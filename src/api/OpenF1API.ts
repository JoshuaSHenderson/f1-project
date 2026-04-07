import type {
    ICarData,
    IDriver,
    IDriverChampionship,
    IMeeting,
    ISession,
    ISessionResult,
    ITeamChampionship,
} from "../types/api.interfaces"
import type { SessionCircuitResults } from "../types/FantasyLeague.interfaces"

const _apiRoot = "https://api.openf1.org/v1/"

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Random delay in ms, uniformly in [800, 2200]. */
function jitterDelayMs(): number {
    return 800 + Math.floor(Math.random() * 1401)
}

/** True when the server might succeed on a later attempt (rate limit or transient server error). */
function isRetryableHttpStatus(status: number): boolean {
    return status === 429 || status >= 500
}

/**
 * Run async work over `items` with at most `concurrency` in flight.
 * Order of `results` matches `items`.
 */
async function mapPool<T, R>(
    items: T[],
    concurrency: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    if (items.length === 0) return []
    const results: R[] = new Array(items.length)
    let next = 0

    async function worker(): Promise<void> {
        while (true) {
            const index = next++
            if (index >= items.length) return
            results[index] = await fn(items[index], index)
        }
    }

    const n = Math.min(Math.max(1, concurrency), items.length)
    await Promise.all(Array.from({ length: n }, () => worker()))
    return results
}

type FetchWithRetryOptions = {
    /** Called when the server returns 429 (before backoff). Use to coordinate concurrent callers. */
    on429?: () => void
}

async function fetchWithRetry(
    url: string,
    maxAttempts: number,
    options?: FetchWithRetryOptions
): Promise<Response | undefined> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await fetch(url)

            if (response.ok) {
                return response
            }

            if (!isRetryableHttpStatus(response.status)) {
                return undefined
            }

            if (response.status === 429) {
                options?.on429?.()
            }

            if (attempt < maxAttempts - 1) {
                const backoffMs =
                    response.status === 429
                        ? Math.min(1200 * 2 ** attempt, 16_000)
                        : jitterDelayMs()
                await delay(backoffMs)
            }
        } catch (error: unknown) {
            const detail = error instanceof Error ? error.message : String(error)
            console.error(`OpenF1 API: network/request failed — ${url}`, detail)
            if (attempt < maxAttempts - 1) {
                await delay(jitterDelayMs())
            }
        }
    }
    return undefined
}

/** Shared pause so concurrent `session_result` requests back off together after any 429. */
let sessionResultCooldownUntil = 0

async function waitForSessionResultCooldown(): Promise<void> {
    const now = Date.now()
    if (now < sessionResultCooldownUntil) {
        await delay(sessionResultCooldownUntil - now)
    }
}

function extendSessionResultCooldown(ms: number): void {
    sessionResultCooldownUntil = Math.max(sessionResultCooldownUntil, Date.now() + ms)
}



export async function getCarData(driverNumber: number, sessionKey: number): Promise<ICarData | undefined> {

    const response = await fetchWithRetry(
        _apiRoot + `car_data?driver_number=${driverNumber}&session_key=${sessionKey}`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ICarData>
    }


}

export async function getCurrentYearSession(sessionName: string): Promise<ISession[] | undefined> {
    const year = new Date().getFullYear()
    const yearAndDay = new Date().toISOString() // 'YYYY-MM-DD' string
    const response = await fetchWithRetry(
        _apiRoot + `sessions?session_name=${sessionName}&year=${year}&date_start<=${yearAndDay}`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ISession[]>
    }

}



export async function getSessionResults(sessionKey: number): Promise<ISessionResult[] | undefined> {
    await waitForSessionResultCooldown()
    const response = await fetchWithRetry(
        _apiRoot + `session_result?session_key=${sessionKey}`,
        5,
        { on429: () => extendSessionResultCooldown(2000) }
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ISessionResult[]>
    }
}

/** Balanced default: enough overlap to finish quickly, with shared 429 cooldown to avoid retry storms. */
const DEFAULT_SESSION_RESULT_CONCURRENCY = 7

/**
 * Loads `session_result` for each session with limited parallelism to avoid HTTP 429 from OpenF1
 * when many race/sprint sessions are requested at once (see https://openf1.org/docs/#api-endpoints).
 * Merges each session with `meetings` data for circuit image and official meeting name.
 * Pass `meetings` when you already fetched them (e.g. in parallel with sessions) to save a round trip.
 */
export async function getSessionResultsForSessions(
    sessions: ISession[],
    concurrency: number = DEFAULT_SESSION_RESULT_CONCURRENCY,
    meetings?: IMeeting[] | undefined
): Promise<SessionCircuitResults[]> {
    const list = meetings ?? (await getCurrentYearMeetings())
    const meetingsByKey = new Map<number, IMeeting>(
        (list ?? []).map((m) => [m.meeting_key, m])
    )

    const blocks = await mapPool(sessions, concurrency, async (s) => {
        const results = await getSessionResults(s.session_key)
        if (results == null || results.length === 0) return null
        const m = meetingsByKey.get(s.meeting_key)
        return {
            circuit_key: s.circuit_key,
            sessionResults: results,
            circuit_image: m?.circuit_image ?? "",
            meeting_name: m?.meeting_name ?? s.circuit_short_name,
            location: s.location,
            country_name: s.country_name,
        } satisfies SessionCircuitResults
    })
    return blocks.filter((b): b is SessionCircuitResults => b != null)
}


export async function getTeamChampionship(): Promise<ITeamChampionship[] | undefined> {
    const response = await fetchWithRetry(
        _apiRoot + `championship_teams?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ITeamChampionship[]>
    }
}


export async function getDriverChampionship(): Promise<IDriverChampionship[] | undefined> {
    const response = await fetchWithRetry(
        _apiRoot + `championship_drivers?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<IDriverChampionship[]>
    }
}

export async function getDrivers(): Promise<IDriver[] | undefined> {
    const response = await fetchWithRetry(
        _apiRoot + `drivers?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<IDriver[]>
    }
}


export async function getCurrentYearMeetings(): Promise<IMeeting[] | undefined> {
    const year = new Date().getFullYear()
    const yearAndDay = new Date().toISOString()
    const response = await fetchWithRetry(_apiRoot + `meetings?year=${year}&date_start<=${yearAndDay}`, 5)
    if (response?.ok && response.body) {
        return response.json() as Promise<IMeeting[]>
    }
}
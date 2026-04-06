import type { ICarData, IDriver, IDriverChampionship, ISession, ISessionResult, ITeamChampionship } from "../types/api.interfaces"

const _apiRoot = "https://api.openf1.org/v1/"

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Random delay in ms, uniformly in [1000, 5000] (1–5 seconds inclusive). */
function randomRetryDelayMs(): number {
    return 1000 + Math.floor(Math.random() * 4001)
}

async function fetchWithRetry(url: string, attempts: number): Promise<Response | undefined> {
    for (let i = 0; i <= attempts; i++) {
        try {
            const response = await fetch(url)

            if (response.ok) {
                return response
            }

            // only retry when throttled
            if (response.status != 429) {
                console.warn(`OpenF1 API error ${response.status} — ${url}`)
                i = attempts++
            }

            console.error(
                `OpenF1 API: HTTP ${response.status} ${response.statusText || "error"} — ${url}`
            )
        } catch (error: unknown) {
            const detail = error instanceof Error ? error.message : String(error)
            console.error(`OpenF1 API: network/request failed — ${url}`, detail)
        }

        if (i >= attempts) {
            return undefined
        }
        const waitMs = randomRetryDelayMs()
        await delay(waitMs)
        console.log("Retrying")
    }
    return undefined
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
    const response = await fetchWithRetry(
        _apiRoot + `sessions?session_name=${sessionName}&year=${year}`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ISession[]>
    }

}



export async function getSessionResults(sessionKey: number): Promise<ISessionResult[] | undefined> {
    const response = await fetchWithRetry(
        _apiRoot + `session_result?session_key=${sessionKey}`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ISessionResult[]>
    }
}


export async function getTeamChampionship(): Promise<ITeamChampionship | undefined> {
    const response = await fetchWithRetry(
        _apiRoot + `championship_teams?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        return response.json() as Promise<ITeamChampionship>
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
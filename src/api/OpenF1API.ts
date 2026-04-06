import type { ICarData, IDriver, IDriverChampionship, ISession, ITeamChampionship } from "../types/api.interfaces"

const _apiRoot = "https://api.openf1.org/v1/"


async function fetchWithRetry(url: string, attempts: number): Promise<Response | undefined> {

    const timeBetweenRetries = 1000
    for (let i = 0; i <= attempts; i++) {
        try {
            console.log("getting ", url)
            const response = await fetch(url)

            if (response.ok) {
                return response
            }
        }
        catch (error) {
            console.error(error)
        }
        setTimeout(() => { console.log("Retrying") }, timeBetweenRetries)
    }
    return undefined
}



export async function getCarData(driverNumber: number, sessionKey: number): Promise<ICarData | undefined> {

    const response = await fetchWithRetry(
        _apiRoot + `car_data?driver_number=${driverNumber}&session_key=${sessionKey}`,
        5
    )
    if (response?.ok && response.body) {
        console.log("cars", response)
        return response.json() as Promise<ICarData>
    }


}

export async function getCurrentYearSession(location: string, sessionName: string): Promise<ISession | undefined> {

    const year = new Date().getFullYear()

    const response = await fetchWithRetry(
        _apiRoot + `sessions?session_name=${sessionName}&location=${location}&year=${year}`,
        5
    )
    if (response?.ok && response.body) {
        console.log("Sessions", response)
        return response.json() as Promise<ISession>
    }


}


export async function getTeamChampionship(): Promise<ITeamChampionship | undefined> {


    const response = await fetchWithRetry(
        _apiRoot + `championship_teams?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        console.log("Sessions", response)
        return response.json() as Promise<ITeamChampionship>
    }
}


export async function getDriverChampionship(): Promise<IDriverChampionship[] | undefined> {

    const response = await fetchWithRetry(
        _apiRoot + `championship_drivers?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        console.log("Sessions", response)
        return response.json() as Promise<IDriverChampionship[]>
    }
}

export async function getDrivers(): Promise<IDriver[] | undefined> {

    const response = await fetchWithRetry(
        _apiRoot + `drivers?meeting_key=latest`,
        5
    )
    if (response?.ok && response.body) {
        console.log("drivers", response)
        return response.json() as Promise<IDriver[]>
    }
}
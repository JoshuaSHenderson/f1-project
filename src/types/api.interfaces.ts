/** Grand Prix weekend (OpenF1 `meetings` endpoint). Used for circuit image and official meeting name. */
interface Meeting {
  circuit_key: number
  circuit_info_url: string
  circuit_image: string
  circuit_short_name: string
  circuit_type: string
  country_code: string
  country_flag: string
  country_key: number
  country_name: string
  date_end: string
  date_start: string
  gmt_offset: string
  location: string
  meeting_key: number
  meeting_name: string
  meeting_official_name: string
  year: number
}

interface Session {
  circuit_key: number
  circuit_short_name: string
  country_code: string
  country_key: number
  country_name: string
  date_end: Date
  date_start: Date
  gmt_offset: string
  location: string
  meeting_key: number
  session_key: number
  session_name: string
  session_type: string
  year: number
}

interface TeamChampionship {
  meeting_key: number
  points_current: number
  points_start: number
  position_current: number
  position_start: number
  session_key: number
  team_name: string
}

interface DriverChampionship {
  driver_number: number
  meeting_key: number
  points_current: number
  points_start: number
  position_current: number
  position_start: number
  session_key: number
}

interface Driver {
  broadcast_name: string
  driver_number: number
  first_name: string
  full_name: string
  headshot_url: URL
  last_name: string
  meeting_key: number
  name_acronym: string
  session_key: number
  team_colour: string
  team_name: string
}

interface CarData {
  brake: number
  date: Date
  driver_number: number
  drs: number
  meeting_key: number
  n_gear: number
  rpm: number
  session_key: number
  speed: number
  throttle: number
}

interface SessionResult {
  dnf: boolean
  dns: boolean
  dsq: boolean
  driver_number: number
  duration: number
  gap_to_leader: string
  number_of_laps: number
  meeting_key: number
  position: number
  session_key: number
}

export type {
  Meeting,
  Session,
  Driver,
  DriverChampionship,
  TeamChampionship,
  CarData,
  SessionResult,
}

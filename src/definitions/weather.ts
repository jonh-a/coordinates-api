export interface WeatherResponse {
  clouds: {
    all: number
  }
  dt: number,
  main: {
    feels_like: number,
    humidity: number,
    pressure: number,
    sea_level: number,
    temp: number,
    temp_max: number,
    temp_min: number,
  }
  name: string,
  sys: {
    country: string,
    sunrise: number,
    sunset: number,
  }
  visibility: number
}

export interface WeatherParsed {
  clouds: number
  dt: number
  feels_like: number
  humidity: number
  pressure: number
  sea_level: number
  temp: number
  temp_max: number
  temp_min: number
  name: string
  country: string
  sunrise: number
  sunset: number
  visibility: number
}

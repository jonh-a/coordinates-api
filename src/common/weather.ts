import axios from 'axios';
import { WeatherResponse, WeatherParsed } from '../definitions/weather';

const parseResponseFromOWM = (response: WeatherResponse): WeatherParsed => {
  const cloudsDefault = { all: 0 };
  const mainDefault = {
    feels_like: 0, humidity: 0, pressure: 0, sea_level: 0, temp: 0, temp_max: 0, temp_min: 0,
  };
  const sysDefault = {
    country: 'NA', sunrise: 0, sunset: 0,
  };
  const {
    clouds = cloudsDefault,
    dt = 0,
    main = mainDefault,
    name = 'NA',
    sys = sysDefault,
    visibility = 0,
  } = response;

  const { all: cloudsAll } = clouds;
  const {
    feels_like: feelsLike = 0,
    humidity = 0,
    pressure = 0,
    sea_level: seaLevel = 0,
    temp = 0,
    temp_min: tempMin = 0,
    temp_max: tempMax = 0,
  } = main;
  const {
    country = 'NA',
    sunrise = 0,
    sunset = 0,
  } = sys;

  return {
    clouds: cloudsAll,
    dt,
    feels_like: feelsLike,
    humidity,
    pressure,
    sea_level: seaLevel,
    temp,
    temp_min: tempMin,
    temp_max: tempMax,
    name,
    country,
    sunrise,
    sunset,
    visibility,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const getWeatherDataForCoordinates = async (
  coordinates: number[],
  openweathermapApiKey: string,
) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${openweathermapApiKey}&units=imperial`;
  try {
    const resp = await axios.get(url);

    let parsedResponse: WeatherParsed | WeatherResponse;
    try {
      parsedResponse = parseResponseFromOWM(resp.data);
    } catch {
      parsedResponse = resp.data;
    }

    if (resp.status === 200) return { type: 'weather', ...parsedResponse };
    return { type: 'weather', error: 'Failed to fetch weather data.' };
  } catch (e) {
    console.log(e);
    return { type: 'weather', error: 'An unexpected error occurred while fetching weather data.' };
  }
};

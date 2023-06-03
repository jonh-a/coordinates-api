import axios from 'axios';
import { WeatherResponse, WeatherParsed } from '../definitions/weather';

const parseResponseFromOWM = (response: WeatherResponse): WeatherParsed => ({
  clouds: response?.clouds?.all || 0,
  dt: response?.dt || 0,
  feels_like: response?.main?.feels_like || 0,
  humidity: response?.main?.humidity || 0,
  pressure: response?.main?.pressure || 0,
  sea_level: response?.main?.sea_level || 0,
  temp: response?.main?.temp || 0,
  temp_min: response?.main?.temp_min || 0,
  temp_max: response?.main?.temp_max || 0,
  name: response?.name || '',
  country: response?.sys?.country || '',
  sunrise: response?.sys?.sunrise || 0,
  sunset: response?.sys?.sunset || 0,
  visibility: response?.visibility,
});

// eslint-disable-next-line import/prefer-default-export
export const getWeatherDataForCoordinates = async (
  coordinates: number[],
  openweathermapApiKey: string,
  units: string,
) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${openweathermapApiKey}&units=${units}`;
  try {
    const resp = await axios.get(url);

    const parsedResponse: WeatherParsed = parseResponseFromOWM(resp?.data);

    if (resp.status === 200) return { type: 'weather', ...parsedResponse };
    return { type: 'weather', error: 'Failed to fetch weather data.' };
  } catch (e) {
    console.log(e);
    return { type: 'weather', error: 'An unexpected error occurred while fetching weather data.' };
  }
};

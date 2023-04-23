import axios from 'axios';

export const getWeatherDataForCoordinates = async (coordinates: number[], openweathermap_api_key: string) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${openweathermap_api_key}`
  try {
    const resp = await axios.get(url)
    if (resp.status === 200) return { type: 'weather', ...resp.data };
    return { type: 'weather', error: 'Failed to fetch weather data.' }
  } catch (e) {
    console.log(e)
    return { type: 'weather', error: 'An unexpected error occurred while fetching weather data.' }
  }
}
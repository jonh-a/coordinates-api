import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const getWeatherDataForCoordinates = async (
  coordinates: number[],
  openweathermapApiKey: string,
) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${openweathermapApiKey}`;
  try {
    const resp = await axios.get(url);
    if (resp.status === 200) return { type: 'weather', ...resp.data };
    return { type: 'weather', error: 'Failed to fetch weather data.' };
  } catch (e) {
    console.log(e);
    return { type: 'weather', error: 'An unexpected error occurred while fetching weather data.' };
  }
};

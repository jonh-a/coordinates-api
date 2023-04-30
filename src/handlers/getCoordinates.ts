import express from 'express';
import { getReverseGeocodingForCoordinatesFromOSM } from '../common/coordinates';
import { getWeatherDataForCoordinates } from '../common/weather';

const getCoordinates = async (req: express.Request, res: express.Response) => {
  try {
    let include: any = req?.query?.include || [];
    if (typeof include === 'string') include = include.split(',');
    if (Array.isArray(include)) include = include.join(',').split(',');

    const lat: any = req?.query?.lat || [];
    if (typeof lat !== 'string' || Number.isNaN(lat)) return res.json({ error: 'Value of lat not recognized' });

    const long: any = req?.query?.long || [];
    if (typeof long !== 'string' || Number.isNaN(long)) return res.json({ error: 'Value of long not recognized' });

    const coordinates = [parseFloat(lat), parseFloat(long)];

    const promises = [];

    if (include.includes('geocoding')) {
      promises.push(getReverseGeocodingForCoordinatesFromOSM(coordinates));
    }

    if (include.includes('weather')) {
      promises.push(
        getWeatherDataForCoordinates(coordinates, req.app.locals.openweathermap_api_key),
      );
    }

    const results = await Promise.all(promises);
    const response: any = { coordinates };

    if (include.includes('geocoding')) response.geocoding = results.find((r: any) => r?.type === 'geocoding');
    if (include.includes('weather')) response.weather = results.find((r: any) => r?.type === 'weather');

    return res.json(response);
  } catch (e: any) {
    console.log(e);
    return res.json({ error: 'An unexpected error occurred.' });
  }
};

export default getCoordinates;

import express from 'express';
import {
  getRandomCoordinatesInFeature,
  getCountryGeojson,
} from '../common/coordinates';
import { getReverseGeocodingForCoordinatesFromOSM } from '../common/geocoding';
import { getWeatherDataForCoordinates } from '../common/weather';
import { getRandomCountry } from '../common/countries';

const randomPlace = async (req: express.Request, res: express.Response) => {
  try {
    let country = req?.params?.country || '';

    if (!country) {
      const resp = await getRandomCountry(req);
      country = resp.country.name;
    }

    let include: any = req?.query?.include || [];
    if (typeof include === 'string') include = include.split(',');
    if (Array.isArray(include)) include = include.join(',').split(',');

    const geojson = await getCountryGeojson(country);

    if (geojson?.error) return res.json(geojson);
    const coordinates = await getRandomCoordinatesInFeature(geojson);

    const units = req?.query?.units === 'metric' ? 'metric' : 'imperial';

    const promises = [];

    if (include.includes('geocoding')) {
      promises.push(getReverseGeocodingForCoordinatesFromOSM(coordinates));
    }

    if (include.includes('weather')) {
      promises.push(
        getWeatherDataForCoordinates(coordinates, req.app.locals.openweathermap_api_key, units),
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

export default randomPlace;

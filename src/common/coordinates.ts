import axios from 'axios';
import * as turf from '@turf/turf';
import { Feature } from '../definitions/geojson';

export const getCountryGeojson = async (country: string) => {
  const url = `https://geojson-api.usingthe.computer/countries/${country}`;

  try {
    const resp = await axios.get(url);
    return resp.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return { error: 'Country not found.' };
    return { error: 'An unexpected error occurred.' };
  }
};

export const getRandomCoordinatesInFeature = async (feature: Feature) => {
  const { bbox } = feature;

  let country;

  if (feature.geometry.type === 'MultiPolygon') {
    country = turf.feature(turf.multiPolygon(feature.geometry.coordinates));
  }

  if (feature.geometry.type === 'Polygon') {
    country = turf.feature(turf.polygon(feature.geometry.coordinates));
  }

  const poly = country?.geometry;

  while (true) {
    const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
    const lng = Math.random() * (bbox[2] - bbox[0]) + bbox[0];

    const point = (turf as any).point([lng, lat]);

    if ((turf as any).booleanPointInPolygon(point, poly)) {
      return [lat, lng];
    }
  }
};

export const getReverseGeocodingForCoordinates = async (
  coordinates: number[],
  openweathermap_api_key: string,
) => {
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${openweathermap_api_key}`;
  try {
    const resp = await axios.get(url);
    if (resp.status === 200) return { type: 'geocoding', ...resp.data };
    return { type: 'geocoding', error: 'Failed to fetch reverse geocoding data.' };
  } catch (e) {
    console.log(e);
    return { type: 'geocoding', error: 'An unexpected error occurred while fetching reverse geocoding data.' };
  }
};

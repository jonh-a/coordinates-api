/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import * as turf from '@turf/turf';
import { Feature } from '../definitions/geojson';

export const getCountryGeojson = async (country: string) => {
  const url = `https://geojson-api.usingthe.computer/countries/${country}?detail=10m`;

  try {
    const resp = await axios.get(url, { timeout: 5000 });
    return resp.data;
  } catch (e: any) {
    if (e?.response?.status === 404) return { error: 'Country not found.' };
    return { error: 'An unexpected error occurred.' };
  }
};

const getCoordinatesInsideGeojson = (bbox: number[], poly: any): number[] => {
  const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
  const lng = Math.random() * (bbox[2] - bbox[0]) + bbox[0];

  const point = (turf as any).point([lng, lat]);

  if ((turf as any).booleanPointInPolygon(point, poly)) {
    return [lat, lng];
  }
  return getCoordinatesInsideGeojson(bbox, poly);
};

export const getRandomCoordinatesInFeature = async (feature: Feature) => {
  const { bbox } = feature;

  let country;

  if (feature.geometry.type === 'MultiPolygon') {
    country = turf.feature(turf.multiPolygon(feature.geometry.coordinates));
  } else if (feature.geometry.type === 'Polygon') {
    country = turf.feature(turf.polygon(feature.geometry.coordinates));
  }

  const poly = country?.geometry;

  return getCoordinatesInsideGeojson(bbox, poly);
};

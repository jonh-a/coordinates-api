/* eslint-disable @typescript-eslint/naming-convention */
import * as turf from '@turf/turf';
import fs from 'node:fs/promises';
import { Feature } from '../definitions/geojson';

export const getCountryGeojson = async (country: string) => {
  try {
    const rawGeojson = await fs.readFile('src/geojson/10m.geojson', { encoding: 'utf8' });
    const countryGeojson = JSON.parse(rawGeojson)
      ?.features
      ?.find((feature: Feature) => [
        feature?.properties?.NAME?.toLowerCase(),
        feature?.properties?.NAME_LONG?.toLowerCase(),
        feature?.properties?.ADM0_A3.toLowerCase(),
      ]?.includes(country.toLowerCase()));

    if (!countryGeojson) return { error: 'Country not found.' };
    return countryGeojson;
  } catch (e: any) {
    return { error: 'An unexpected error occurred.' };
  }
};

const getCoordinatesInsideGeojson = (
  bbox: number[],
  poly: any,
  name: string,
): number[] => {
  let attempt: number = 0;
  while (attempt < 10000) {
    const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
    const lng = Math.random() * (bbox[2] - bbox[0]) + bbox[0];

    const point = (turf as any).point([lng, lat]);

    if ((turf as any).booleanPointInPolygon(point, poly)) {
      return [lat, lng];
    }

    attempt += 1;
  }

  throw new Error(name);
};

export const getRandomCoordinatesInFeature = async (feature: Feature) => {
  const { bbox } = feature;

  let country;

  if (feature.geometry.type === 'MultiPolygon') {
    country = turf.feature(turf.multiPolygon(feature.geometry.coordinates));
  } else if (feature.geometry.type === 'Polygon') {
    country = turf.feature(turf.polygon(feature.geometry.coordinates));
  }

  const name = feature?.properties?.NAME || '';
  const poly = country?.geometry;

  return getCoordinatesInsideGeojson(bbox, poly, name);
};

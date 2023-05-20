/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import * as turf from '@turf/turf';
import { Feature } from '../definitions/geojson';
import { GeocodingResponse } from '../definitions/geocoding';

export const getCountryGeojson = async (country: string) => {
  const url = `https://geojson-api.usingthe.computer/countries/${country}?detail=10m`;

  try {
    const resp = await axios.get(url);
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
  }

  if (feature.geometry.type === 'Polygon') {
    country = turf.feature(turf.polygon(feature.geometry.coordinates));
  }

  const poly = country?.geometry;

  return getCoordinatesInsideGeojson(bbox, poly);
};

const parseResponseFromOSM = (response: GeocodingResponse): GeocodingResponse => {
  const {
    address, boundingbox, display_name, lat, lon,
  } = response;
  return {
    address, boundingbox, display_name, lat, lon,
  };
};

export const getReverseGeocodingForCoordinatesFromOSM = async (
  coordinates: number[],
) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&addressdetails=1`;
  try {
    const resp = await axios.get(url);
    if (resp.status !== 200) return { type: 'geocoding', error: 'Failed to fetch reverse geocoding data.' };

    let parsedResponse: GeocodingResponse;
    try {
      parsedResponse = parseResponseFromOSM(resp.data);
    } catch {
      parsedResponse = resp.data;
    }

    const boundingbox = resp?.data?.boundingbox || [0, 0, 0, 0];
    const bbox = [boundingbox[2], boundingbox[0], boundingbox[3], boundingbox[1]].join(',');

    return { type: 'geocoding', ...parsedResponse, bbox };
  } catch (e) {
    console.log(e);
    return { type: 'geocoding', error: 'An unexpected error occurred while fetching reverse geocoding data.' };
  }
};

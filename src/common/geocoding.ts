/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import { GeocodingResponse } from '../definitions/geocoding';

const parseResponseFromOSM = (response: GeocodingResponse): GeocodingResponse => ({
  address: {
    village: response?.address?.village || '',
    country: response?.address?.country || '',
    county: response?.address?.county || '',
    road: response?.address?.road || '',
    state: response?.address?.state || '',
    state_district: response?.address?.state_district || '',
    country_code: response?.address?.country_code || '',
    'ISO3166-2-lvl4': response?.address?.['ISO3166-2-lvl4'] || '',
    'ISO3166-2-lvl6': response?.address?.['ISO3166-2-lvl6'] || '',
  },
  boundingbox: response?.boundingbox || '',
  display_name: response?.display_name || '',
  lat: response?.lat || '',
  lon: response?.lon || '',
});

// eslint-disable-next-line import/prefer-default-export
export const getReverseGeocodingForCoordinatesFromOSM = async (
  coordinates: number[],
) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[0]}&lon=${coordinates[1]}&addressdetails=1`;
  try {
    const resp = await axios.get(url, { timeout: 5000 });
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

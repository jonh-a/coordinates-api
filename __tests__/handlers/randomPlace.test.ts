import request from 'supertest';
import app from '../../app';
import { checkItemsInBody } from '../app.test'

describe('test randomPlace.ts', () => {
  test('test random endpoint', async () => {
    const res = await request(app).get('/random/usa?include=geocoding,weather');
    checkItemsInBody(
      res.body,
      [
        { name: 'coordinates', type: 'object' },
        { name: 'geocoding', type: 'object' },
        { name: 'weather', type: 'object' },
      ]
    )

    checkItemsInBody(
      res.body.geocoding,
      [
        { name: 'address', type: 'object' },
        { name: 'boundingbox', type: 'object' },
        { name: 'display_name', type: 'string' },
        { name: 'lat', type: 'string' },
        { name: 'lon', type: 'string' },
        { name: 'bbox', type: 'string' },
      ]
    )

    checkItemsInBody(
      res.body.geocoding.address,
      [
        { name: 'village', type: 'string' },
        { name: 'road', type: 'string' },
        { name: 'county', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'state_district', type: 'string' },
        { name: 'country_code', type: 'string' },
        { name: 'ISO3166-2-lvl4', type: 'string' },
        { name: 'ISO3166-2-lvl6', type: 'string' },
      ]
    )

    checkItemsInBody(
      res.body.weather,
      [
        { name: 'clouds', type: 'number' },
        { name: 'dt', type: 'number' },
        { name: 'feels_like', type: 'number' },
        { name: 'humidity', type: 'number' },
        { name: 'pressure', type: 'number' },
        { name: 'sea_level', type: 'number' },
        { name: 'temp', type: 'number' },
        { name: 'temp_min', type: 'number' },
        { name: 'temp_max', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'country', type: 'string' },
        { name: 'sunrise', type: 'number' },
        { name: 'sunset', type: 'number' },
        { name: 'visibility', type: 'number' },
      ]
    )

    expect(Array.isArray(res.body.coordinates)).toBe(true);
    expect(res.body.coordinates.length).toBe(2);
    expect(typeof res.body.coordinates[0]).toBe('number')
    expect(typeof res.body.coordinates[1]).toBe('number')

    expect(Array.isArray(res.body.geocoding.boundingbox)).toBe(true);
    expect(res.body.geocoding.boundingbox.length).toBe(4)
    res.body.geocoding.boundingbox.forEach((v: any) => {
      expect(typeof v).toBe('string')
    })
  });
});

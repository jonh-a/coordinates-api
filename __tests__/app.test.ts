import request from 'supertest';
import app from '../app';

describe('test app.ts', () => {
  test('test health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toEqual({ status: 'OK' });
  });
});

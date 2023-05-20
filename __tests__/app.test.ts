import request from 'supertest';
import app from '../app';

interface Item {
  name: string
  type: string
}

export const checkItemsInBody = (obj: any, items: Item[]) => {
  items.forEach((item: Item) => {
    expect(obj).toHaveProperty(item.name);
    expect(typeof obj[item.name]).toBe(item.type)
  })
}

describe('test app.ts', () => {
  test('test health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toEqual({ status: 'OK' });
  });
});

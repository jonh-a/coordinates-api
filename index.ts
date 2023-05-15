import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import randomPlace from './src/handlers/randomPlace';
import getCoordinates from './src/handlers/getCoordinates';
import logRequest from './src/middleware/logRequest';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || '3000';

app.locals.countries = [];
app.locals.openweathermap_api_key = process.env?.OPENWEATHERMAP_API_KEY || '';

app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));

app.get('/random', logRequest, randomPlace);
app.get('/random/:country', logRequest, randomPlace);
app.get('/coordinates', logRequest, getCoordinates);

app.listen(port, () => {
  console.log(` + running on port ${process.env.PORT || '3000'}`);
});

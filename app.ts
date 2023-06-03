import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import randomPlace from './src/handlers/randomPlace';
import getCoordinates from './src/handlers/getCoordinates';
import getCountries from './src/handlers/getCountries';

dotenv.config();

const app: Express = express();
const version: string = '0.0.1';

app.use(cors());

app.locals.countries = [];
app.locals.openweathermap_api_key = process.env?.OPENWEATHERMAP_API_KEY || '';

app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));
app.get('/version', (req: Request, res: Response) => res.json({ version }));

app.get('/random', randomPlace);
app.get('/random/:country', randomPlace);
app.get('/coordinates', getCoordinates);
app.get('/countries', getCountries);

export default app;

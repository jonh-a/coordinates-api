import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import randomPlace from './src/handlers/randomPlace';
import getCoordinates from './src/handlers/getCoordinates';

dotenv.config();

const app: Express = express();
const version: string = '0.0.1';

app.locals.countries = [];
app.locals.openweathermap_api_key = process.env?.OPENWEATHERMAP_API_KEY || '';

app.get('/health', (req: Request, res: Response) => res.json({ status: 'OK' }));
app.get('/version', (req: Request, res: Response) => res.json({ version }));

app.get('/random', randomPlace);
app.get('/random/:country', randomPlace);
app.get('/coordinates', getCoordinates);

export default app;

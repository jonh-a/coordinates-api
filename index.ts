import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import randomPlace from './src/handlers/randomPlace';

dotenv.config()

const app: Express = express();
const port = process.env.PORT || '3000';

app.locals.countries = []
app.locals.openweathermap_api_key = process.env.OPENWEATHERMAP_API_KEY || ''

app.get('/health', (req: Request, res: Response) => {
  return res.json({ status: "OK" })
});

app.get('/random/:country', randomPlace)

app.listen(port, () => {
  console.log(` + running on port ${process.env.PORT || '3000'}`)
})
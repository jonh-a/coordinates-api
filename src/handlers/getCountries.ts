import express from 'express';
import { getRandomCountry } from '../common/countries';

const getCountries = async (req: express.Request, res: express.Response) => {
  try {
    await getRandomCountry(req);
    return res.json(req.app.locals.countries);
  } catch (e: any) {
    console.log(e);
    return res.json({ error: 'An unexpected error occurred.' });
  }
};

export default getCountries;

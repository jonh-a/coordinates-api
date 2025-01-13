/* eslint-disable import/prefer-default-export */
import express from 'express';
import fs from 'node:fs/promises';
import { Feature } from '../definitions/geojson';
import { Country } from '../definitions/countries';

export const listCountries = async (): Promise<Country[]> => {
  try {
    const rawGeojson = await fs.readFile('src/geojson/10m.geojson', { encoding: 'utf8' });
    return JSON.parse(rawGeojson).features.map((feature: Feature) => ({
      name: feature.properties.NAME,
      name_long: feature.properties.NAME_LONG,
      continent: feature.properties.CONTINENT,
      iso_a3: feature.properties.ISO_A3,
    }));
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getRandomCountry = async (req: express.Request): Promise<Country> => {
  let countries: Country[];

  const dummy: Country = {
    name: 'null',
    name_long: 'null',
    continent: 'null',
    iso_a3: 'null',
  };

  if (req.app.locals.countries?.length === 0 || !req.app.locals.countries) {
    const listOfCountries: Country[] = await listCountries();
    req.app.locals.countries = listOfCountries;
    countries = req.app.locals.countries;
  } else {
    countries = req.app.locals.countries;
  }

  return countries[Math.floor((Math.random() * countries.length))] || dummy;
};

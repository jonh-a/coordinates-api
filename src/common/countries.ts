/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import express from 'express';
import { Country } from '../definitions/countries';

export const getRandomCountry = async (req: express.Request) => {
  let countries: Country[];

  const dummy: Country = {
    name: 'null',
    name_long: 'null',
    continent: 'null',
    iso_a3: 'null',
  };

  if (req.app.locals.countries?.length === 0 || !req.app.locals.countries) {
    const url = 'https://geojson-api.usingthe.computer/countries';
    const resp = await axios.get(url);
    if (resp.status !== 200 || resp.data?.length < 10) {
      return { error: 'Failed to fetch countries', country: dummy };
    }

    req.app.locals.countries = resp.data;
    countries = resp.data;
  } else {
    countries = req.app.locals.countries;
  }

  return {
    country: countries[Math.floor((Math.random() * countries.length))] || dummy,
    error: null,
  };
};

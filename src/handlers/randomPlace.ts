import express from 'express';
import axios from 'axios';
import * as turf from '@turf/turf';
import { Feature } from '../definitions/geojson';

const getRandomCoordinates = async (feature: Feature) => {
  const bbox = feature.bbox;

  let country;

  if (feature.geometry.type === 'MultiPolygon') {
    country = turf.feature(turf.multiPolygon(feature.geometry.coordinates))
  }

  if (feature.geometry.type === 'Polygon') {
    country = turf.feature(turf.polygon(feature.geometry.coordinates))
  }

  const poly = country?.geometry

  while (true) {
    const lat = Math.random() * (bbox[3] - bbox[1]) + bbox[1];
    const lng = Math.random() * (bbox[2] - bbox[0]) + bbox[0];

    const point = (turf as any).point([lng, lat])

    if ((turf as any).booleanPointInPolygon(point, poly)) {
      return [lat, lng]
    }
  }
}

const getCountryGeojson = async (country: string) => {
  const url = `https://geojson-api.usingthe.computer/countries/${country}`

  try {
    const resp = await axios.get(url)
    return resp.data
  } catch (e: any) {
    if (e?.response?.status === 404) return { error: 'Country not found.' }
    return { error: 'An unexpected error occurred.' }
  }
}

const randomPlace = async (req: express.Request, res: express.Response) => {
  try {
    const country = req?.params?.country || ""
    const geojson = await getCountryGeojson(country)

    if (geojson?.error) return res.json(geojson)
    const randomPoint = await getRandomCoordinates(geojson)
    return res.json({ coordinates: randomPoint })
  } catch (e: any) {
    console.log(e)
    return res.json({ error: 'An unexpected error occurred.' })
  }

}

export default randomPlace;
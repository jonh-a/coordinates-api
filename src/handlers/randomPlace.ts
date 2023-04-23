import express from 'express';
import axios from 'axios';
import * as turf from '@turf/turf';
import { Feature } from '../definitions/geojson';
import {
  getRandomCoordinatesInFeature,
  getCountryGeojson,
  getReverseGeocodingForCoordinates
} from '../common/coordinates';
import {
  getWeatherDataForCoordinates
} from '../common/weather'


const randomPlace = async (req: express.Request, res: express.Response) => {
  try {
    const country = req?.params?.country || ""

    let include: any = req?.query?.include || []
    if (typeof include === 'string') include = include.split(',')
    if (Array.isArray(include)) include = include.join(',').split(',')

    const geojson = await getCountryGeojson(country)

    if (geojson?.error) return res.json(geojson)
    const coordinates = await getRandomCoordinatesInFeature(geojson)

    const promises = []

    if (include.includes('geocoding')) {
      promises.push(getReverseGeocodingForCoordinates(coordinates, req.app.locals.openweathermap_api_key))
    }

    if (include.includes('weather')) {
      promises.push(getWeatherDataForCoordinates(coordinates, req.app.locals.openweathermap_api_key))
    }

    const results = await Promise.all(promises)
    const response: any = { coordinates }

    if (include.includes('geocoding')) response['geocoding'] = results.find((r: any) => r?.type === 'geocoding')
    if (include.includes('weather')) response['weather'] = results.find((r: any) => r?.type === 'weather')

    return res.json(response)
  } catch (e: any) {
    console.log(e)
    return res.json({ error: 'An unexpected error occurred.' })
  }
}

export default randomPlace;
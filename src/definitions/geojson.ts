export interface Feature {
  type: string
  properties: FeatureProperties
  geometry: FeaturePolygon | FeatureMultiPolygon
  bbox: Array<number>
}

export interface FeatureProperties {
  NAME: string
  NAME_LONG: string
  CONTINENT: string
  SUBREGION: string
  ISO_A3: string
  POSTAL: string
  ADM0_A3: string
}

export interface FeaturePolygon {
  type: 'Polygon'
  coordinates: number[][][]
}

export interface FeatureMultiPolygon {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

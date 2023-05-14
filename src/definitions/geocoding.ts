export interface GeocodingResponse {
  address: {
    'ISO3166-2-lvl4'?: string
    'ISO3166-2-lvl6'?: string
    country: string
    country_code: string
    road?: string
    state?: string
    state_district?: string
    village?: string
  }
  boundingbox: number[]
  display_name: string
  lat: string
  lon: string
}

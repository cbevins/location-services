import fetch from 'node-fetch'
import { Location } from './Location.js'
import { LocationService } from './LocationService.js'

export class LocationServiceWeatherApi extends LocationService {
  constructor () {
    super('WeatherApi.com', 'https://api.weatherapi.com/v1/forecast.json')
  }

  async _load(searchParams, key) {
    const query = `${this._url}?key=${key}&q=${searchParams}`
    const response = await fetch(query)
    if (! response.ok) {
      // WeatherAPI sends additional error info as JSON
      const json = await response.json()
      // console.log('async_load() error:', json.error)
      this.code(json.error.code)
      this.message(json.error.message)
      this.success(false)
      throw new Error('ServiceError')
    }
    const json = await response.json()
    this._location = this.toLocation(json)
    return this.success(true)
  }

  // Convert service response into standard location object
  toLocation(json) {
    let lat = json.location.lat
    let lon = json.location.lon
    if (this._searchParams.includes(',')) { // is this a lat,lon query?
      const parts = this._searchParams.split(',')
      lat = parseFloat(parts[0])
      lon = parseFloat(parts[1])
    }
    return new Location(lat, lon, json.location.name, json.location.region,
      json.location.country, json.location.tz_id, 0)
  }
}

// import fetch from 'node-fetch'
import { LocationService } from './LocationService.js'

export class LocationServiceWeatherApi extends LocationService {
  constructor () {
    super('WeatherApi.com')
    this._url = 'https://api.weatherapi.com/v1/forecast.json'
  }

  async _loadLocation(searchParams, key) {
    const query = `${this._url}?key=${key}&q=${searchParams}`
    const response = await fetch(query)
    this._response = {
      _ok: response.ok,
      _status: response.status,
      _statusText: response.statusText === '' ? this._okText : response.statusText
    }
    this._msg = this._okText
    if (! response.ok) {
      const json = await response.json()
      console.log(json.error)
      // this._msg = `ServiceError: ${response.status}: ${response.statusText}`
      this._response._status = json.error.code
      this._response._statusText = json.error.message
      this._msg = `ServiceError: ${json.error.code}: ${json.error.message}`
      throw new Error(this._msg)
    }
    const json = await response.json()
    this.toLocation(json)
    this._success = true
  }

  // Convert service response into standard location object
  toLocation(json) {
    this._location = {
      _lat: json.location.lat,
      _lon: json.location.lon,
      _name: json.location.name,
      _region: json.location.region,
      _country: json.location.country,
      _timezone: json.location.tz_id
    }
    if (this._searchParams.includes(',')) { // is this a lat,lon query?
        const [lat, lon] = this._searchParams.split(',')
        this._location._lat = parseFloat(lat)
        this._location._lon = parseFloat(lon)
    }
  }
}

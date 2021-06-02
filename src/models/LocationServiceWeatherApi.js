import fetch from 'node-fetch'
import { LocationService } from './LocationService.js'

export class LocationServiceWeatherApi extends LocationService {
  constructor () {
    super('WeatherApi.com')
    this._key = '43956b1f6760417db1d182743212704'
    this._url = 'https://api.weatherapi.com/v1/forecast.json'
  }

  async _loadLocation (search) {
    const query = `${this._url}?key=${this._key}&q=${search}`
    console.log(query)
    try {
      const response = await fetch(query, { method: 'GET' })
        .catch((error) => {
          this._msg = `${this._name} fetch() error: ${error}`
          console.error(this._msg)
          return false
        })
      // console.log(`${this.name()} response status ${response.status}: ${response.statusText}`)
      this._status = response.status
      this._statusText = response.statusText
      if (response.status < 200 || response.status >= 300) {
        this._msg = `Response status ${response.status}: ${response.statusText}`
        console.error(this._msg)
        return false
      }
      const json = await response.json()
      this._response = json.location
      // Convert into standard location props
      if (search.includes(',')) { // is this a lat,lon query?
        const [lat, lon] = search.split(',')
        this._lat = parseFloat(lat)
        this._lon = parseFloat(lon)
      } else {
        this._lat = json.lat
        this._lon = json.lon
      }
      this._place = json.location.name
      this._region = json.location.region
      this._country = json.location.country
      this._timezone = json.location.tz_id
      // console.log(${this.name()} JSON Response: ${this._response})`
      this._msg = this._okText
      return true
    } catch (error) {
        this._msg = `${this._name} try{} error: ${error}`
        console.error(this._msg)
        return false
    }
  }
/**
 * Fetches location info from WeatherAPI.com timezone
 *
 * @param {any} q Query parameter based on which data is sent back. It could be following:
 * - Latitude and Longitude (Decimal degree) e.g: q=48.8567,2.3508
 * - city name e.g.: q=Paris
 * - US zip e.g.: q=10001
 * - UK postcode e.g: q=SW1
 * - Canada postal code e.g: q=G2J
 * - metar: <metar code> e.g: q=metar:EGLL
 * - iata: <3 digit airport code> e.g: q=iata:DXB
 * - auto:ip IP lookup e.g: q=auto:ip
 * - IP address (IPv4 and IPv6 supported) e.g: q=100.0.0.1
 * @returns {object} {
    "name": "Missoula",
    "region": "Montana",
    "country": "USA",
    "lat": 46.86,
    "lon": -114.04,
    "tz_id": "America/Denver",
    "localtime_epoch": 1621784749,
    "localtime": "2021-05-23 9:45",
    "query": "search query",
    "error": { code: 0, message: 'Ok'}
  }
 */
  async _loadLocation0 (q) {
    const query = `${this._url}?key=${this.key()}&q=${q}`
    try {
      const response = await fetch(query, { method: 'GET' })
        .catch((error) => console.error('weatherap.com fetch error: ' + error))
      const json = await response.json()
      json.location.query = q
      json.location.error = (json.error !== undefined) ? json.error : {code: 0, message: 'OK'}
      if (q.includes(',')) { // is this a lat,lon query
        const [lat, lon] = q.split(',')
        json.location.lat = parseFloat(lat)
        json.location.lon = parseFloat(lon)
      }
      return json.location
    } catch (error) {
      console.log('ERROR _weatherApi.js timezone(): ', error)
    }
  }
}

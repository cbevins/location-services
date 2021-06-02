export class LocationService {
  constructor (name) {
    this._name = name // Service name, i.e., 'WeatherApi' or 'Tomorrow'
    this._search = null // search param
    this._response = null // Service's raw JSON response
    this._okText = 'OK' // a constant fixed message for the OK condition
    this._status = 0
    this._statusText = ''
    this._msg = 'Uninitialized' // Message may be 'Uninitialized', 'Loading', 'OK', or an error message
    // Location
    this._lat = 0
    this._lon = 0
    this._place = ''
    this._region = ''
    this._country = ''
    this._timezone = 'America/Denver'
  }

  country () { return this._country }
  lat () { return this._lat }
  lon () { return this._lon }
  name () { return this._name }
  message () { return this._msg }
  ok () { return this._msg === this._okText }
  place () { return this._place }
  region () { return this._region }
  timezone () { return this._timezone }

  async load (search) {
    this._response = null
    this._msg = 'Loading'
    const success =  await this._loadLocation(search)
    if (success) {
    }
    return this
  }

  // Used by nodeExample.js
  consoleReport () {
    let text = `${this.place()}, ${this.region()}, ${this.country()}`
    let geo = `[${this.lat()}, ${this.lon()}], ${this.timezone()}`
    console.log(`${text} ${geo}`)
  }

  async _loadLocation () {
    throw new Error('LocationService._loadLocation() must be reimplemented by a derived class')
  }
}

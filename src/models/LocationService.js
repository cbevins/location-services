export class LocationService {
  constructor (service) {
    this._service = service // Service name, i.e., 'WeatherApi' or 'Tomorrow'
    this._searchParams = ''
    this._response = { _ok: false, _status: 0, _statusText: '' }
    this._location = {_lat: 0, _lon: 0, _name: '', _region: '', _country: '', _timezone: '' }
    this._okText = 'OK'
    this._msg = 'Uninitialized'
    this._success = false
  }

  // Client accessors
  country () { return this._location._country }
  lat () { return this._location._lat }
  lon () { return this._location._lon }
  name () { return this._location._name }
  message () { return this._msg }
  ok () { return this._msg === this._okText }
  region () { return this._location._region }
  searchParams () { return this._searchParams }
  status () { return this._response._status }
  statusText () { return this._response._statusText }
  success () { return this._success }
  timezone () { return this._location._timezone }

  // Client loader
  async load (search, apiKey) {
    this._searchParams = search
    this._response = { _ok: false, _status: 0, _statusText: '' }
    this._location = {_lat: 0, _lon: 0, _name: '', _region: '', _country: '', _timezone: '' }
    this._success = false
    try {
      await this._loadLocation(search, apiKey)
      this._success = true
    } catch (error) {
      this._success = false
      this.errorHandler(this._service, error)
    }
    return this
  }

  // Used by nodeExample.js
  consoleReport () {
    if (this.ok()) {
      let text = `${this.name()}, ${this.region()}, ${this.country()}`
      let geo = `[${this.lat()}, ${this.lon()}], ${this.timezone()}`
      console.log(`${text} ${geo}`)
    } else {
      console.log(this._msg)
    }
  }

  errorHandler(id, error) {
    // When network is unavailable, the error.message is like:
    // "request to https://api.weatherapi.com/v1/forecast.json?key=43956b1f6760417db1d182743212704&q=46.859340,-113.975528 failed, reason: getaddrinfo ENOTFOUND api.weatherapi.com system ENOTFOUND ENOTFOUND"
    if (error.message.substr(0,12) === 'ServiceError') {
      console.log(`${id}:`, error)
      //console.log(this._location)
    } else { // FetchError, network error, no internet, etc
      console.log(error.message, error.type, error.code, error.errno)
    }
  }

  async _loadLocation (/*search, apiKey*/) {
    throw new Error('LocationService._loadLocation() must be reimplemented by a derived class')
  }
}

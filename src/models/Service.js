export class Service {
  constructor (name, url) {
    this._name = name // Name of the service, such as 'MapQuest.com' or 'WeatherApi.com'
    this._url = url
    this._code = 0
    this._id = 'none' // an id optionally passed by the client to load()
    this._loads = 0 // number of times load() (and therefore, init()) was called
    this._message = 'Uninitialized'
    this._success = false
  }

  // Returns most recent service response code, optionally after setting its new value
  code (any) {
    if (arguments.length) this._code = any
    return this._code
  }

  errorHandler(error) {
    this.success(false)
    let str = `${this.name()} [load ${this.loads()}, id '${this.id()}'] `
    // When network is unavailable, the error.message is like:
    // "request to https://api.weatherapi.com/v1/forecast.json?key=43956b1f6760417db1d182743212704&q=46.859340,-113.975528 failed, reason: getaddrinfo ENOTFOUND api.weatherapi.com system ENOTFOUND ENOTFOUND"
    if (error.message.includes('ServiceError')) {
      str += `service error: ${this.synopsis()}`
    } else { // FetchError, network error, no internet, etc
      this.message('Network unavailable or error')
      str += `network error message: '${error.message}',`
      str += `[type: '${error.type}', code: '${error.code}', errno: '${error.errno}']`
    }
    console.error(str)
  }

  // Used by derived classes to easily set failure info
  fail(code, message) {
    this.code(code)
    this.message(message)
    this.success(false)
  }

  id () { return this._id }

  // Called by load() just before invoking _load()
  init (id) {
    this.code(0)
    this.id(id) // a per-load id assigned by the client
    this.message('Pending')
    this._loads++
    this.success(false)
  }

  loads () { return this._loads }

  // Returns most recent service response message, optionally after setting its new value
  message (str) {
    if (arguments.length) this._message = str
    return this._message
  }

  name () { return this._name }

  // Returns a result summary string of either the found Location or an error synopsis
  result () {
    if (this.success()) {
      let text = `${this.place()}, ${this.region()}, ${this.country()}`
      let geo = `[${this.lat()}, ${this.lon()}], ${this.timezone()}`
      return `Found: ${text} ${geo}`
    } else {
      return this.synopsis()
    }
  }

  // Returns most recent service succes boolean, optionally after setting its new value
  success (bool) {
    if (arguments.length) this._success = bool
    return this._success
  }

  // Returns synopsis of success, code, and message
  synopsis () {
    return `Success: ${this.success()}, code: ${this.code()}, '${this.message()}'`
  }
}

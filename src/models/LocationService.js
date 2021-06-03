/**
 * @file LocationService is an abstract class for searching location API services.
 * @copyright 2021 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */
import { Location } from './Location.js'
import { Service } from './Service.js'

export class LocationService extends Service {
  constructor (serviceName, url) {
    super(serviceName, url)
    this._location = new Location()
    this._searchParams = ''
  }

  // Client Location accessors
  country () { return this._location.country() }
  gmt () { return this._location.gmt() }
  lat () { return this._location.lat() }
  lon () { return this._location.lon() }
  place () { return this._location.place() }
  region () { return this._location.region() }
  timezone () { return this._location.timezone() }

  // Returns a Location instance cloned from this._location
  clone () {
    const l = this._location
    return new Location(l.lat(), l.lon(), l.place(), l.region(), l.country(), l.timezone(), l.gmt())
  }

  searchParams () { return this._searchParams }

  // Client loader
  async load (searchParams, apiKey, id='none') {
    this._searchParams = searchParams
    this._location = new Location()
    this.init(id)
    try {
      await this._load(searchParams, apiKey, id)
    } catch (error) {
      this.errorHandler(error)
    }
    return this // resolved Promise return value is *this*
  }

  async _load (/*search, apiKey*/) {
    throw new Error('LocationService._load() must be reimplemented by a derived class')
  }
}

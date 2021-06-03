/**
 * @file Location is a simple data class.
 * @copyright 2021 Systems for Environmental Management
 * @author Collin D. Bevins, <cbevins@montana.com>
 * @license MIT
 */

export class Location {
  constructor (lat=0, lon=0, place='', region='', country='', timezone='UTC', gmt=0) {
    this._lat = lat
    this._lon = lon
    this._place = place
    this._region = region
    this._country = country
    this._timezone = timezone
    this._gmt = gmt
  }

  dataObject () {
    return {lat: this._lat, lon: this._lon, place: this._place,
      country: this._country, timezone: this._timezone, gmt: this._gmt }
  }

  // Location of The 'M'
  M () {
    this._lat = 46.859340
    this._lon = -113.975528
    this._place = 'The "M"'
    this._region = 'Montana'
    this._country = 'United States of America'
    this._timezone = 'America/Denver'
    this._gmt = -7
  }

  gmt () { return this._gmt }
  lat () { return this._lat }
  lon () { return this._lon }
  place () { return this._place }
  region () { return this._region }
  country () { return this._country }
  timezone () { return this._timezone }
}


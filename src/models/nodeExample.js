/**
 * Example of LocationService usage under node.js.
 * To run with node.js, you must:
 * 1 - uncomment LocationServiceWeatherApi.js line 1: 'import { fetch } from 'node-fetch'
 * 2 - have a local package.json with "type": "modules"
 */
import {LocationServiceWeatherApi} from './LocationServiceWeatherApi.js'
import { locationServiceWeatherApiKey } from './keys.js'

async function runParallel (searchParam, apiKeu) {
  // First schedule ...
  const pending = Promise.all([
    wapi.load(searchParam, apiKey)
  ])
  // ... then `await` all the responses ...
  const [wapi] = await pending
  // .. then do something with the responses
  console.log(wapi.result())
}

function runSerial (searchParam, apiKey) {
  // First do one ...
  wapi.load(searchParam, apiKey).then(w => console.log(w.result()))
  // ... then do the other
  // wapi.load(searchParam, apiKey).then(w => console.log(w.result()))
}

console.log('LocationService example usage with node.js')
const M = { name: 'The "M"', lat: 46.859340, lon: -113.975528 }
const goodUrl = 'https://api.weatherapi.com/v1/forecast.json'
const badUrl = 'https://api.weatherapi.com/v2/forecast.json'
const goodParam = `${M.lat},${M.lon}`
const badParam = ''
const goodKey = locationServiceWeatherApiKey()
const badKey = '_'

const wapi = new LocationServiceWeatherApi()
// runParallel(goodParam, goodKey)
runSerial(goodParam, goodKey)
runSerial(badParam, goodKey)
runSerial(goodParam, badKey)
// wapi.load(goodParam, badKey).then(w => console.log(w.result()))

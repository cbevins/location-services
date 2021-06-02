/**
 * Example of Forecast class usage under node.js.
 * To run with node.js, you must:
 * 1 - uncomment LocationServiceWeatherApi.js line 1: 'import { fetch} from 'node-fetch'
 * 2 - have a local package.json with "type": "modules"
 */
import {LocationServiceWeatherApi} from './LocationServiceWeatherApi.js'
import { locationServiceWeatherApiKey } from './keys.js'

async function runParallel (search) {
  // First schedule ...
  const pending = Promise.all([
    wapi.load(search)
  ])
  // ... then `await` all the responses ...
  const [wapi] = await pending
  // .. then do something with the responses
  wapi.consoleReport()
}

function runSerial (search) {
  // First do one ...
  wapi.load(search, locationServiceWeatherApiKey()).then(w => w.consoleReport())
  // ... then do the other
  // wapi.load(search).then(w => w.consoleReport())
}

console.log('LocationService example usgae with node.js')
const M = { name: 'The "M"', lat: 46.859340, lon: -113.975528 }
const wapi = new LocationServiceWeatherApi()
const search = `${M.lat},${M.lon}`
// runParallel(search)
runSerial(search)

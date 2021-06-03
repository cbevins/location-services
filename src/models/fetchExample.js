import fetch from 'node-fetch'

function errorHandler(id, error) {
  // When network is unavailable, the error.message is like:
  // "request to https://api.weatherapi.com/v1/forecast.json?key=43956b1f6760417db1d182743212704&q=46.859340,-113.975528 failed, reason: getaddrinfo ENOTFOUND api.weatherapi.com system ENOTFOUND ENOTFOUND"
  if (error.message.substr(0,12) === 'ServiceError') {
    console.log(`Run ${id}: '${error}'`)
  } else { // FetchError, network error, no internet, etc
    console.log(error.message, error.type, error.code, error.errno)
  }
}

// Wraps fetch() inside await load() inside try{}catch()
// May be called from non-async functions
async function loader(run, url, key, param) {
  try {
    const json = await load(url, key, param)
    report(run, json)
    return json
  } catch(error) { errorHandler(run, error) }
}

// Performs actual fetch(), must be called from async or using Promises.then().catch()
async function load(url, key, parms) {
  const query = `${url}?key=${key}&q=${parms}`
  const response = await fetch(query)
  if (! response.ok) {
    const msg = `ServiceError: ${response.status}: ${response.statusText}`
    throw new Error(msg)
  }
  const json = await response.json()
  json.status = response.status
  json.statusText = response.statusText
  return json
}

function report(id, json) {
  console.log(`Run ${id}: ${json.status}: ${json.statusText}: ${json.location.name}`)
}

function showResponse(res) {
  console.log('response.url:', res.url) // the full path of the resource
  res.headers.forEach((v, k) => console.log(`res.header ${k}: ${v}`)) // response headers Map()
  console.log('response.status:', res.status) // HTTP response status code
  console.log('response.ok:', res.ok) // shorthand for `status` between 200 and 299
  console.log('response.statusText:', res.statusText) // status message of the response e.g. `OK`
  console.log('response.redirected:', res.redirected) // check if there was a redirect
  console.log('response.type:', res.type) // get the response type (e.g., `basic`, `cors`)
}

const goodUrl = 'https://api.weatherapi.com/v1/forecast.json'
const badUrl = 'https://api.weatherapi.com/v2/forecast.json'
const goodKey = '43956b1f6760417db1d182743212704'
const badKey = '43956b1f6760417db1d182743212704_'
const goodParam = '46.859340,-113.975528'
const badParam = ''

// -----------------------------------------------------------------------------
// load().then().catch()
// -----------------------------------------------------------------------------

async function runParallel () {
  const t = Date.now()
  // First schedule ...
  try {
    const pending = Promise.all([
      // Returns 200: OK
      load(goodUrl, goodKey, goodParam), //.catch(error => errorHandler('Parallel 1', error)),
      // Return 401: Unauthorized
      load(goodUrl, badKey, goodParam), //.catch(error => errorHandler('Parallel 2', error)),
      // Returns 400: Bad Request
      load(goodUrl, goodKey, badParam), //.catch(error => errorHandler('Parallel 3', error)),
      // Returns 404: Not Found
      load(badUrl, goodKey, goodParam), //.catch(error => errorHandler('Parallel 4', error)),
    ])
    // ... then `await` all the responses ...
    const [json1, json2, json3, json4] = await pending
    // .. then do something with the responses
    report('Parallel 1', json1)
    report('Parallel 2', json2)
    // report('Parallel 3', json3)
    // report('Parallel 4', json4)
  } catch (error) { console.log(error) }
  console.log(`Parallel() ${Date.now()-t} ms`)
}

async function runSerial () {
  const t = Date.now()
  // Returns 200: OK
  load(goodUrl, goodKey, goodParam).then(j => report('Serial 1', j)).catch(error => errorHandler('Serial 1', error))
  // Return 401: Unauthorized
  load(goodUrl, badKey, goodParam).then(j => report('Serial 2', j)).catch(error => errorHandler('Serial 2', error))
  // Returns 400: Bad Request
  load(goodUrl, goodKey, badParam).then(j => report('Serial 3', j)).catch(error => errorHandler('serial 3', error))
  // Returns 404: Not Found
  load(badUrl, goodKey, goodParam).then(j => report('Serial 4', j)).catch(error => errorHandler('Serial 4', error))
  console.log(`Serial() ${Date.now()-t} ms`)
}

// runParallel()
// runSerial()

// -----------------------------------------------------------------------------
// loader()
// -----------------------------------------------------------------------------

// const j1 = loader(4, goodUrl, goodKey, goodParam) // 200: OK
// console.log(4, json.location.name)
// json = loader(5, goodUrl, badKey, goodParam) // 401: Unathorized
// console.log(5, json.location.name)
// json = loader(6, goodUrl, goodKey, badParam) // 400: Bad Request
// console.log(6, json.location.name)

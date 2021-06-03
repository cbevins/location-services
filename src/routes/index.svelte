<script>
  import { LocationServiceWeatherApi } from '../models/LocationServiceWeatherApi.js'
  import { locationServiceWeatherApiKey } from '../models/keys.js'
  import { currentLocation, foundLocation } from '../models/stores.js'
  import LoadingSpinner from '../components/LoadingSpinner.svelte'
  import LocationCard from '../components/LocationCard.svelte'

  // client inputs
  let apiKey = locationServiceWeatherApiKey()
  let param = '46.859340,-113.975528' // The 'M'
  let service = new LocationServiceWeatherApi()

  // State
  let success = service._success
  let applied = false
  let loadingLocation = false
  let header = 'Please Search for a Location'
  let title = ''
  let subtitle = ''
  let currentHeader = 'No Current Location'

  function applyLocation () {
    currentHeader = 'The Current Location is'
    $currentLocation = service.clone()
  }

  const getLocation = async () => {
    loadingLocation = true
    await service.load(param, apiKey)
    success = service.success()
    if (success) {
      $foundLocation = service.clone()
      header = 'Found the following Location:'
      title = `${service.place()}, ${service.region()}, ${service.country()}`
      subtitle = `${service.lat()}, ${service.lon()}, ${service.timezone()}`
    } else {
      header = `Error: ${service.code()}: '${service.message()}'`
      title = ''
      subtitle = ''
    }
    loadingLocation = false
  }
</script>

<svelte:head>
	<title>Location Services</title>
</svelte:head>

<h1>Step 1: Select a Location</h1>

<div class="form-floating mb-3">
  <input type="text" bind:value={apiKey} class="form-control" id="apikey" placeholder="WeatherAPI.com API key">
  <label for="apikey">WeatherAPI.com API key</label>
</div>

<div class="input-group mb-3">
  <div class="form-floating">
    <input type="text" bind:value={param} class="form-control" id="searchparams" placeholder="Search Parameters">
    <label for="searchparams">Search Parameters</label>
  </div>
  <button on:click={getLocation} class="btn btn-outline-primary" type="button" id="search">
      Search for this Location
  </button>
  <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#searchExamples" aria-expanded="false" aria-controls="collapseExamples">
    Search Examples
  </button>
</div>

<div class="collapse" id="searchExamples">
  <div class="card card-body">
    <ul>
      <li>lat,lon decimal degrees e.g: <code>46.859340,-113.975528</code></li>
      <li>city name e.g.: <code>Missoula</code></li>
      <li>US zip e.g.: <code>59801</code></li>
      <li>UK postcode e.g: <code>SW1</code></li>
      <li>Canada postal code e.g: <code>G2J</code></li>
      <li>metar:&lt;metar code&gt; e.g: <code>metar:EGLL</code></li>
      <li>iata:&lt;digit airport code&gt; e.g: <code>iata:MSO</code></li>
      <li>auto:ip IP lookup e.g: <code>auto:ip</code></li>
      <li>IP address (IPv4 and IPv6 supported) e.g: <code>100.0.0.1</code></li>
    </ul>
  </div>
</div>

{#if loadingLocation}
  <LoadingSpinner msg='Fetching location data from WeatherApi.com ...' />'
{/if}

  <div class="card">
    <div class="card-body">
      <h4 class='card-header'>
        {#if success === true }
        <span class="badge bg-success">Success</span>
        {:else}
        <span class="badge bg-danger">Error</span>
        {/if}
        {header}
      </h4>
      <h4 class='card-title'>{title}</h4>
      <h5 class='card-subtitle'>{subtitle}</h5>
      {#if success === true}
        <button on:click={applyLocation} class="btn btn-outline-primary">
          Make this the Current Location
        </button>
      {/if}
    </div>
  </div>

  <LocationCard location={$currentLocation} header={currentHeader}/>

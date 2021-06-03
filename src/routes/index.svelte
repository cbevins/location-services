<script>
  import { LocationServiceWeatherApi } from '../models/LocationServiceWeatherApi.js'
  import { locationServiceWeatherApiKey } from '../models/keys.js'
  import { currentLocation, foundLocation } from '../models/stores.js'
  import LoadingSpinner from '../components/LoadingSpinner.svelte'
  import LocationCard from '../components/LocationCard.svelte'
  import LocationSearchExamples from '../components/LocationSearchExamples.svelte'

  // client inputs
  let apiKey = locationServiceWeatherApiKey()
  let param = '46.859340,-113.975528' // The 'M'
  let service = new LocationServiceWeatherApi()

  // State
  let bgHeader = ''
  let success = service._success
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
      bgHeader = 'bg-success'
      $foundLocation = service.clone()
      header = 'Found the following Location:'
      title = `${service.place()}, ${service.region()}, ${service.country()}`
      subtitle = `${service.lat()}, ${service.lon()}, ${service.timezone()}`
    } else {
      bgHeader = 'bg-danger'
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
  <button on:click={getLocation} class="btn btn-outline-primary btn-sm" type="button" id="search">
      Search for this Location
  </button>
  <button data-bs-toggle="offcanvas" class="btn btn-outline-secondary" type="button" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
    Search Examples
  </button>
  <!-- <button data-bs-toggle="collapse" class="btn btn-outline-secondary" type="button" data-bs-target="#searchExamples" aria-expanded="false" aria-controls="collapseExamples">
    Search Examples
  </button> -->
</div>

<div class="collapse" id="searchExamples">
  <div class="card card-body">
    <LocationSearchExamples/>
  </div>
</div>

{#if loadingLocation}
  <LoadingSpinner msg='Fetching location data from WeatherApi.com ...' />'
{/if}

<div class="card shadow-lg mb-3">
  <div class="card-body">
    <h4 class='card-header bg-gradient {bgHeader}'>
      {header}
    </h4>
    <h4 class='card-title'>{title}</h4>
    <h5 class='card-subtitle'>{subtitle}</h5>
    {#if success === true}
      <button on:click={applyLocation} class="btn btn-outline-primary btn-sm">
        Make this the Current Location
      </button>
    {/if}
  </div>
</div>

<LocationCard location={$currentLocation} header={currentHeader}/>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Search Examples</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <LocationSearchExamples/>
  </div>
</div>
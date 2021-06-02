<script>
  import { LocationServiceWeatherApi } from '../models/LocationServiceWeatherApi.js'
  import { locationServiceWeatherApiKey } from '../models/keys.js'
  import LoadingSpinner from '../components/LoadingSpinner.svelte'

  let param = '46.859340,-113.975528' // The 'M'
  let applied = false
  let loadingLocation = false
  let service = new LocationServiceWeatherApi()
  let success = false
  let useButtonText = 'Ok, use this Location'
  let useButtonColor = 'btn-outline-primary'

  function applyLocation () {
    applied = true
    // $loc = search
    useButtonText = 'This is the Current Location'
    useButtonColor = 'btn-outline-success'
    // getMapquestElev()
    // getUsgsEpqs()
    // getTomorrow()
    // getWeatherApi()
  }

  const getLocation = async () => {
    applied = false
    loadingLocation = true
    success = await service.load(param, locationServiceWeatherApiKey())
    useButtonText = 'Ok, use this Location'
    useButtonColor = 'btn-outline-primary'
    loadingLocation = false
  }
</script>

<svelte:head>
	<title>Location Services</title>
</svelte:head>

<h1>Location Services</h1>

<h1>Step 1: Select a Location</h1>
<div class="row mb-3">
  <div class="col">Search for:</div>
  <div class="col">
    <input  bind:value={param} type="text" class="form-control" aria-label="Search item">
  </div>
  <div class="col">
    <button  on:click={getLocation}
      class="btn btn-outline-primary" type="button" id="button">
        Search
      </button>
    </div>
  <div class="col">
    <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#searchExamples" aria-expanded="false" aria-controls="collapseExamples">
      Examples
    </button>
  </div>
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

{#if success}
  <div class="card">
    <div class="card-body">
      <div class="row mb-3">
        <div class='col card-title'>
          {#if applied}
            <strong>Currently Selected Location</strong>
          {:else}
            <strong>Search Results</strong>
          {/if}
        </div>
        <div class="col">
          {#if applied}
            &nbsp;
          {:else}
          <button on:click={applyLocation} class="btn {useButtonColor}">
            {useButtonText}
          </button>
          {/if}
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-striped table-bordered border-primary">
          <tbody>
            <tr><td>Search Params</td><td>{service.searchParams()}</td></tr>
            <tr><td>Results</td><td>{service.statusText()}</td></tr>
            <tr><td>Name</td><td>{service.place()}</td></tr>
            <tr><td>Region</td><td>{service.region()}</td></tr>
            <tr><td>Country</td><td>{service.country()}</td></tr>
            <tr><td>Latitude</td><td>{service.lat()}</td></tr>
            <tr><td>Longitude</td><td>{service.lon()}</td></tr>
            <tr><td>Time Zone</td><td>{service.timezone()}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
{/if}

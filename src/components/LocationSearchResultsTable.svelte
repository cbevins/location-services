<script>
  export let service
</script>

<div class="table-responsive">
  <table class="table table-sm table-striped table-bordered border-primary">
    <tbody>
      <tr><td>Search Params</td><td>{service.searchParams()}</td></tr>
      <tr><td>Results</td><td>{service.message()}</td></tr>
      <tr><td>Name</td><td>{service.name()}</td></tr>
      <tr><td>Region</td><td>{service.region()}</td></tr>
      <tr><td>Country</td><td>{service.country()}</td></tr>
      <tr><td>Latitude</td><td>{service.lat()}</td></tr>
      <tr><td>Longitude</td><td>{service.lon()}</td></tr>
      <tr><td>Time Zone</td><td>{service.timezone()}</td></tr>
    </tbody>
  </table>
</div>

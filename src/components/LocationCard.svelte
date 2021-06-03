<script>
  export let location // Location class instance
  export let header // Like 'Current Location'

  let exists = location.lat() !== 0 && location.lon !== 0
  let title = ''
  let subtitle = ''
  $: {
    exists = location.lat() !== 0 && location.lon !== 0
    title = exists ? `${location.place()}, ${location.region()}, ${location.country()}` : ''
    subtitle = exists ? `${location.lat()}, ${location.lon()} ${location.timezone()}` : ''
  }
</script>

<div class="card">
  <div class="card-body">
    <h3 class='card-header'>{header}</h3>
    <h4 class='card-title'>{title}</h4>
    <h5 class='card-subtitle'>{subtitle}</h5>
  </div>
</div>

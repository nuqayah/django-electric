<script>
  import { subscrite_to_shape } from './lib/electric.js'
  import {onMount} from 'svelte'

  function connect() {
    try{
      subscrite_to_shape()

    }catch(e) {
      console.error(`failed to connect : ${e}`)
    }
  }

  onMount(() => {
    connect()
  })

</script>

<main>
  <h1>hello</h1>
</main>

<template>
  <div id="app" class="bg-dark text-center">
    <img alt="Vue logo" src="./assets/logo.png">
    <div class="text-info fw-bold fs-1">
      Verify NFT Ownership
    </div>
    <SignMessage />
  </div>
</template>

<script>
import SignMessage from './components/SignMessage.vue'

export default {
  name: 'App',
  components: {
    SignMessage
  }
}
</script>
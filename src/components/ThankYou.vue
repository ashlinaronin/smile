<template>
  <div class="thank-you">
    <h1>Thank You!</h1>
    <p>We appreciate your smiles. Make sure to pick up a free pin on your way out!</p>
    <router-link class="button" to="/">Start over</router-link>
  </div>
</template>

<script>
  export default {
    name: 'thank-you',
  };
</script>

<style lang="scss" scoped>
  @import "../styles/settings";

  .thank-you {
    @include container();
  }
</style>

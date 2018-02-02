<template>
  <div class="thank-you">
    <h1>Thank You!</h1>
    <p>We appreciate your smiles. Make sure to pick up a free pin on your way out!</p>
    <ul>
      <li v-for="smileImageUrl in smileImageUrls">
        <img :src="smileImageUrl" />
      </li>
    </ul>
    <router-link class="button" to="/">Start over</router-link>
    <p>
      <small>
        Thanks to Deryn Isaac, Ian Burton, Andre Brown, Amy Chiao, Adam Shaylor, Craig Schommer and SkyBiometry.
      </small>
      <br />
      <small>Smile icon by Icon Solid from the Noun Project.</small>
    </p>
  </div>
</template>

<script>
  import store from '@/store';

  export default {
    store,
    name: 'thank-you',
    computed: {
      smileImageUrls() {
        return this.$store.state.smileImageUrls;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../styles/settings";

  .thank-you {
    @include container();

    ul {
      padding: 0;
      list-style-type: none;

      img {
        width: 100%;
      }
    }
  }
</style>

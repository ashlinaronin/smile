<template>
  <div>
    <router-link to="/" class="logo-link">
      <div>😊</div>
      <div>Smile</div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'logo-link',
  };
</script>

<style lang="scss">
  @import "../styles/settings";

  a {
    text-decoration: none;
  }

  .logo-link {
    display: flex;
    flex-direction: row;
    color: $black;

    > div {
      display: flex;
      margin: auto auto;
      padding: 2px;
    }

    > div:first-child {
      text-shadow: 1px 1px 1px #a7a7a7;
      font-size: 10vh;
    }

    > div:nth-child(2) {
      font-size: 5vh;
    }
  }
</style>

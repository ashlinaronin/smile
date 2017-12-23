<template>
  <div id="app">
    <header>
      <router-link to="/">
        <div id="logo">logo here</div>
      </router-link>
      <donation-progress v-if="showProgress"></donation-progress>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import DonationProgress from '@/components/DonationProgress';

export default {
  name: 'app',
  computed: {
    showProgress() {
      return this.$route.name === 'Donate';
    },
  },
  components: {
    DonationProgress,
  },
};
</script>

<style lang="scss">
@import "styles/settings";

body {
  margin: 0;
}

#app {
  font-family: $main-body-font;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  display: flex;
  justify-content: space-between;
}

#logo {
  background: $yellow;
  width: 100px;
  height: 50px;
  border: 1px solid $black;
}

p, li {
  font-size: 22px;
}

.button, button {
  font-family: $main-body-font;
  display: inline-block;
  margin: 40px 0;
  font-size: 26px;
  background: $light-grey;
  color: $black;
  border: 1px solid $black;
  text-decoration: none;
  padding: 8px 16px;
  transition: all ease-out 0.1s;

  &:hover {
    background: $black;
    color: $white;
  }
}
</style>

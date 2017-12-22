<template>
  <div id="app">
    <router-link to="/">
      <div id="logo">logo here</div>
    </router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import "~styles/settings";

body {
  margin: 0;
}

#app {
  font-family: monospace, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#logo {
  background: $yellow;
}

p, li {
  font-size: 22px;
}

.button, button {
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

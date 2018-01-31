<template>
  <div id="app">
    <header v-if="showHeader">
      <logo-link></logo-link>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import LogoLink from '@/components/LogoLink';

export default {
  name: 'app',
  computed: {
    showHeader() {
      return this.$route.name !== 'AllSmiles' && this.$route.name !== 'OneSmile';
    },
  },
  components: {
    LogoLink,
  },
};
</script>

<style lang="scss">
@import "styles/settings";

body {
  margin: 0;

  &.presentation-mode {
    overflow: hidden;
  }
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
  border-bottom: 1px solid $light-grey;
}

h1 {
  font-size: 6vh;
}

h2 {
  font-size: 2.666vh;
  letter-spacing: 2px;
}

h3 {
  font-size: 2vh;
}

h4 {
  font-size: 2vh;
}

h5 {
  font-size: 1.5vh;
}

p, li {
  font-size: 3vh;
}

small {
  font-size: 1.5vh;
}

.button, button {
  font-family: $main-body-font;
  text-transform: uppercase;
  display: inline-block;
  font-size: 26px;
  letter-spacing: 1px;
  background: $white;
  border: 1px solid $black;
  text-decoration: none;
  transition: all ease-out 0.1s;
  cursor: pointer;
  border-radius: 0;
  box-shadow: 0 3px 6px #666666;
  color: $black;
  background: #ffb700;
  padding: 10px 20px 10px 20px;


  &:hover {
    background: #c43227;
    background-image: linear-gradient(to bottom, #c43227, #d93476);
  }

  &:disabled, &.is-disabled {
    background: lighten(#c43227, 30%);
    pointer-events: none;
    cursor: not-allowed;
  }
}
</style>

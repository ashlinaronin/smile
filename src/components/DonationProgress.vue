<template>
  <div class="ui__progress-container">
    <div class="ui__progress">
      <div class="ui__progress-emoji">
        <img v-for="smile in smilesDonated" src="static/smile.svg">
        <img v-for="placeholder in placeholders" src="static/smile-grey.svg">
      </div>
      <div class="ui__progress-text">
        <div>
          {{ textProgressMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store';

  const MAX_DONATIONS = 3;

  export default {
    store,
    name: 'donation-progress',
    computed: {
      smilesDonated() {
        return this.$store.state.smilesDonated;
      },
      placeholders() {
        return MAX_DONATIONS - this.smilesDonated;
      },
      textProgressMessage() {
        const smilePluralization = (this.smilesDonated === 1) ? 'smile' : 'smiles';
        return `${this.smilesDonated} ${smilePluralization} donated`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/settings';

  .ui__progress-container {
    margin-top: 10px;
    width: 100%;
  }

  .ui__progress {
    width: 100%;
    color: white;
    display: flex;

    > div {
      flex-basis: 50%;
      background: $black;
      text-align: center;
      padding: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    > div:nth-child(1) {
      margin-right: 4px;
    }

    > div:nth-child(2) {
      margin-left: 4px;
    }
  }

  .ui__progress-emoji {
    font-size: 48px;
    img {
      width: 60px;
      padding: 4px;
    }
  }

  .ui__progress-text {

  }
</style>

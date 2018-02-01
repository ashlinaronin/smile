<template>
  <div class="all-smiles" ref="smiles" id="test">
    <transition-group name="smile-list" tag="ul">
      <li v-for="smile in allSmiles"
          v-if="smile.mood"
          :key="smile.smileImageUrl"
          class="smile__container">
        <img :src="imageUrl(smile)">
      </li>
    </transition-group>
  </div>
</template>

<script>
  import maptasticMixin from '@/mixins/maptasticMixin';
  import { getAllSmiles, getNewSmiles } from 'services/display';

  const FETCH_INTERVAL_MS = 1000;

  export default {
    name: 'all-smiles',
    mixins: [maptasticMixin],
    data() {
      return {
        allSmiles: [],
        fetchIntervalId: null,
      };
    },
    async created() {
      this.allSmiles = await getAllSmiles();
      this.startFetchInterval();

      document.body.classList.add('presentation-mode');
    },
    beforeDestroy() {
      clearInterval(this.fetchIntervalId);
      document.body.classList.remove('presentation-mode');
    },
    methods: {
      imageUrl(smile) {
        return `${process.env.API_BASE_URL}/${smile.smileImageUrl}`;
      },
      async refreshSmiles() {
        const newSmiles = await getNewSmiles();
        this.allSmiles.unshift(...newSmiles);
      },
      startFetchInterval() {
        this.fetchIntervalId = setInterval(this.refreshSmiles, FETCH_INTERVAL_MS);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .all-smiles {
    width: 100%;
    height: 400px;

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      height: 100vh;
    }

    .smile__container {
      border: 1px red dashed;
      flex-basis: 12.3%;
      height: 12.3%;
      width: 20%;
      transition: all 1s ease-out;
      left: 0;
      top: 0;
      transform: translate3d(0, 0, 0) scale(1.0);
      z-index: 0;
      opacity: 1;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .smile-list-enter, .smile-list-leave-to {
      opacity: 0;
      transform: translate3d(100px, 100px, 0) scale(1.0);
      position: absolute;
      z-index: 0;
    }

    .smile-list-enter-active {
      opacity: 1;
      position: absolute;
      transform: translate3d(100px, 100px, 0) scale(4.0);
      z-index: 3;
    }

    .smile-list-leave-active {
    }

  }
</style>

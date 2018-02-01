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

    ul {
      list-style-type: none;
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
    }

    .smile__container {
      flex-basis: 20%;
      transition: all 5s;
      z-index: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .smile-list-enter, .smile-list-leave-to {
      transition: all 5s;
    }

    .smile-list-enter-active {
      z-index: 99;
      transform: scale(4.0) translateY(100px) translateX(100px);
    }

    .smile-list-leave-active {
      position: absolute;
    }

  }
</style>

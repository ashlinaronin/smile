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
  import getAllSmiles from 'services/display';

  const FETCH_INTERVAL_MS = 5000;

  export default {
    name: 'all-smiles',
    mixins: [maptasticMixin],
    data() {
      return {
        allSmiles: [],
        fetchIntervalId: null,
      };
    },
    created() {
      this.refreshSmiles();
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
        this.allSmiles = await getAllSmiles();
        this.randomizeSmileOrder();
      },
      startFetchInterval() {
        this.fetchIntervalId = setInterval(this.refreshSmiles, FETCH_INTERVAL_MS);
      },
      randomizeSmileOrder() {
        this.shuffleArray(this.allSmiles);
      },
      shuffleArray(array) {
        // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        /* eslint-disable */
        for (let i = array.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
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

      img {
        width: 100%;
        height: 100%;
      }
    }

    .smile-list-move {
      transition: transform 1s;
    }
  }
</style>

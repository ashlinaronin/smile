<template>
  <div class="all-smiles" ref="smiles" id="test">
    <ul>
      <li v-for="smile in allSmiles" v-if="smile.mood" class="smile__container">
        <img :src="imageUrl(smile)">
      </li>
    </ul>
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
    },
    beforeDestroy() {
      clearInterval(this.fetchIntervalId);
    },
    methods: {
      imageUrl(smile) {
        return `${process.env.API_BASE_URL}/${smile.smileImageUrl}`;
      },
      async refreshSmiles() {
        this.allSmiles = await getAllSmiles();
      },
      startFetchInterval() {
        this.fetchIntervalId = setInterval(this.refreshSmiles, FETCH_INTERVAL_MS);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .all-smiles {
    width: 100vw;

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
  }
</style>

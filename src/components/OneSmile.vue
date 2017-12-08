<template>
  <div class="one-smile">
    <img :src="imageUrl(latestSmile)">
  </div>
</template>

<script>
  import Maptastic from 'lib/maptastic';
  import getAllSmiles from 'services/display';

  const FETCH_INTERVAL_MS = 5000;
  const USE_MAPTASTIC = false;

  export default {
    name: 'AllSmiles',
    data() {
      return {
        allSmiles: [],
        projectionMap: null,
        fetchIntervalId: null,
      };
    },
    computed: {
      latestSmile() {
        return this.allSmiles[this.allSmiles.length - 1];
      },
    },
    created() {
      this.refreshSmiles();
      this.startFetchInterval();
    },
    mounted() {
      if (USE_MAPTASTIC) {
        this.initializeMaptastic();
      }
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
      initializeMaptastic() {
        const maptasticConfig = {
          autoSave: false,
          autoLoad: false,
          layers: [this.$refs.smiles],
        };

        this.projectionMap = new Maptastic(maptasticConfig);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .one-smile {
    width: 100vw;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

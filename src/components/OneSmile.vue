<template>
  <div class="one-smile">
    <img :src="imageUrl(latestSmile)">
  </div>
</template>

<script>
  import maptasticMixin from '@/mixins/maptasticMixin';
  import getAllSmiles from 'services/display';

  const FETCH_INTERVAL_MS = 5000;

  export default {
    name: 'AllSmiles',
    mixins: [maptasticMixin],
    data() {
      return {
        allSmiles: [],
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
  .one-smile {
    width: 100vw;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

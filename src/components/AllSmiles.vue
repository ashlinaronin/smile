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
      smileHeading(smile) {
        return `${smile.mood} (${this.letterGender(smile.gender)}, ${smile.age})`;
      },
      letterGender(gender) {
        return (gender === 'male') ? 'm' : 'f';
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
      width: 200px;
      height: 100px;

      img {
        width: 200px;
        height: 100px;
      }
    }
  }
</style>

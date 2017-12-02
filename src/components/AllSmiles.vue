<template>
  <div class="all-smiles" ref="smiles" id="test">
    <h1>Donations</h1>
    <ul>
      <li v-for="smile in allSmiles" v-if="smile.mood" class="smile__container">
        <h3>{{smileHeading(smile)}}</h3>
        <img :src="imageUrl(smile)">
      </li>
    </ul>
  </div>
</template>

<script>
  import Maptastic from 'lib/maptastic';
  import getAllSmiles from 'services/display';

  const FETCH_INTERVAL_MS = 5000;

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
      const maptasticConfig = {
        autoSave: false,
        autoLoad: false,
        layers: [this.$refs.smiles],
      };

      this.projectionMap = new Maptastic(maptasticConfig);
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
    },
  };
</script>

<style lang="scss" scoped>
  .all-smiles {
    ul {
      list-style-type: none;
      display: flex;
      flex-wrap: wrap;
    }

    .smile__container {
      img {
        width: 200px;
        height: auto;
      }
    }
  }
</style>

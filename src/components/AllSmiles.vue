<template>
  <div class="all-smiles" ref="smiles" id="test">
    <h1>Donations</h1>
    <ul>
      <li v-for="smile in allSmiles" v-if="smile.mood" class="smile__container">
        <h3>{{ smile.mood }}</h3>
        <img :src="imageUrl(smile)">
      </li>
    </ul>
  </div>
</template>

<script>
  import Maptastic from 'lib/maptastic';
  import getAllSmiles from 'services/display';

  export default {
    name: 'AllSmiles',
    data() {
      return {
        allSmiles: [],
        map: null,
      };
    },
    async created() {
      this.allSmiles = await getAllSmiles();
    },
    mounted() {
      const maptasticConfig = {
        autoSave: false,
        autoLoad: false,
        layers: [this.$refs.smiles],
      };

      this.map = new Maptastic(maptasticConfig);
    },
    methods: {
      imageUrl(smile) {
        const httpUrl = Object.prototype.hasOwnProperty.call(smile, 'originalImageUrl') ? smile.originalImageUrl : smile.rawResponse.photos[0].url;
        return this.httpToHttps(httpUrl);
      },
      httpToHttps(url) {
        return url.replace('http://', 'https://');
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

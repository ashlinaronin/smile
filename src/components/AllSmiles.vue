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
        projectionMap: null,
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

      this.projectionMap = new Maptastic(maptasticConfig);
    },
    methods: {
      imageUrl(smile) {
        return `${process.env.API_BASE_URL}/${smile.smileImageUrl}`;
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

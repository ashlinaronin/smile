<template>
  <div class="all-smiles">
    <h1>Donations</h1>
    <ul>
      <li v-for="smile in allSmiles" v-if="smile.mood">
        <h3>{{ smile.mood }}</h3>
        <img :src="imageUrl(smile)">
      </li>
    </ul>
  </div>
</template>

<script>
  import getAllSmiles from 'services/display';

  export default {
    name: 'AllSmiles',
    data() {
      return {
        allSmiles: [],
      };
    },
    async created() {
      this.allSmiles = await getAllSmiles();
    },
    methods: {
      imageUrl(smile) {
        return Object.prototype.hasOwnProperty.call(smile, 'originalImageUrl') ? smile.originalImageUrl : smile.rawResponse.photos[0].url;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .all-smiles {
    ul {
      list-style-type: none;
    }
  }
</style>

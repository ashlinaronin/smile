<template>
  <div class="all-smiles">
    <ul>
      <li v-for="smile in allSmiles">
        {{ smile }}
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
</style>

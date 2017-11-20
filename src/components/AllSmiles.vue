<template>
  <div class="all-smiles">
    <ul>
      <li v-for="smile in allSmiles">
        {{ smile }}
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
  };
</script>

<style lang="scss" scoped>
</style>

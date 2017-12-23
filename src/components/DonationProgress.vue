<template>
  <div class="ui__progress-container">
    <div class="ui__progress">
      <div>
        {{ emojiProgressMessage }}
      </div>
      <div>
        {{ textProgressMessage }}
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store';

  // TODO: get these from store
  export default {
    store,
    name: 'donation-progress',
    computed: {
      emojiProgressMessage() {
        return '😃';
      },
      textProgressMessage() {
        return 'fake text progress';
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/settings';

    .ui__progress-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    .ui__progress {
      display: flex;
      color: white;
      flex-direction: column;
      align-items: flex-end;

      > div {
        border: 1px solid $light-grey;
        background: grey;
        text-align: right;
        padding: 4px;
      }
    }
</style>

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

  const MAX_DONATIONS = 3;

  export default {
    store,
    name: 'donation-progress',
    computed: {
      smilesDonated() {
        return this.$store.state.smilesDonated;
      },
      emojiProgressMessage() {
        const smileStringArray = new Array(MAX_DONATIONS);
        smileStringArray.fill('0');

        for (let i = 0; i < this.smilesDonated; i += 1) {
          smileStringArray[i] = '😀';
        }

        return smileStringArray.join('');
      },
      textProgressMessage() {
        const smilePluralization = (this.smilesDonated === 1) ? 'smile' : 'smiles';
        return `${this.smilesDonated} ${smilePluralization} donated!`;
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

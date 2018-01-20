<template>
  <div class="welcome">
    <h1>Welcome!</h1>
    <p>Donating smiles is easy. Here's how it works:</p>
    <ol>
      <li>Make a smiling face*. Hit the Donate button.</li>
      <li>Repeat as many times as necessary</li>
      <li>Check out the other smiles outside!</li>
    </ol>
    <p>When you're ready to start press the <strong>I'm ready</strong> button below.</p>
    <router-link class="button" to="donate">I'm ready</router-link>
    <div class="fine-print">
      <small>*Happy, surprised, angry, confused and disgusted smiles are accepted.</small>
    </div>
  </div>
</template>

<script>
  import store from '@/store';
  import mutations from '@/library/dictionary/mutations';

  export default {
    store,
    name: 'welcome',
    created() {
      this.$store.commit(mutations.RESET_DONATIONS);
    },
  };
</script>

<style lang="scss" scoped>
  @import "../styles/settings";

  .welcome {
    @include container();

    ol {
      margin-left: -2.5vh;
      padding-left: 1vh;
    }
    li {
      padding-left: 1.5vh;
    }

    .fine-print {
      margin-top: 40px;
    }
  }
</style>

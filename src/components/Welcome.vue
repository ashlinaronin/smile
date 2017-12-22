<template>
  <div class="welcome">
    <h1>Welcome!</h1>
    <p>Donating smiles is easy. Here's how it works:</p>
    <ol>
      <li>Make a smiling face*. Hit the Donate button.</li>
      <li>Repeat as many times as necessary</li>
      <li>Check out the other smiles outside!</li>
    </ol>
    <p>When you're ready to start press the button below.</p>
    <router-link class="button" to="donate">I'm ready</router-link>
    <div class="fine-print">
      <small>*Happy, sad, surprised, angry, confused and disgusted smiles are accepted.</small>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Welcome',
  };
</script>

<style lang="scss" scoped>
  .welcome {
    padding: 20px;
    text-align: left;

    .fine-print {
      margin-top: 100px;
    }
  }
</style>

<template>
  <div class="smile">
    <div>
      <video ref="video"></video>
    </div>
    <div class="ui">
      <button v-if="!loading" v-on:click="checkIfSmiling">Smiling?</button>
      <span v-if="loading">loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.initializeWebcam();
  },
  methods: {
    initializeWebcam() {
      navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.mediaDevices.getUserMedia);

      navigator.getUserMedia(
        { video: true, audio: false },
        this.onWebcamSuccess,
        this.onWebcamError,
      );
    },
    onWebcamSuccess(stream) {
      this.$refs.video.src = window.URL.createObjectURL(stream);
      this.$refs.video.onloadedmetadata = this.onLoadedMetadata;
    },
    onLoadedMetadata() {
      this.$refs.video.play();
    },
    onWebcamError(e) {
      this.$log.error('sorry', e);
    },
    checkIfSmiling() {
      this.$log.info('checking if smiling');
      this.loading = true;

      setTimeout(() => { this.loading = false; }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
  .smile {
    font-size: 24px;

    .ui {
      margin-top: 100px;
    }

    button {
      font-size: 24px;
      border: 1px solid black;
      background: transparent;
      padding: 20px;
      &:hover, &:focus {
        background: grey;
        color: white;
      }
      &:active {
        background: black;
        color: white;
      }
    }
  }
</style>

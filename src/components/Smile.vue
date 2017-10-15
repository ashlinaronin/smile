<template>
  <div class="smile">
    <div>
      <video ref="video"></video>
    </div>
    <div class="ui">
      <button v-if="!loading" v-on:click="checkIfSmiling">Smiling?</button>
      <span v-if="loading">loading...</span>
      <span v-if="isSmiling !== null">{{ isSmiling }}</span>
    </div>
    <form method="post" enctype="multipart/form-data" action="http://localhost:3000/face-attributes">
      <input type="file" name="file">
      <input type="submit" value="Submit">
    </form>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import isSmiling from 'services/face-detection';

export default {
  name: 'Smile',
  data() {
    return {
      loading: false,
      isSmiling: null,
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
    async checkIfSmiling() {
      this.$log.info('checking if smiling');
      this.loading = true;
      this.isSmiling = null;

      if (this.$refs.canvas.toBlob) {
        this.$refs.canvas.toBlob(async (blob) => {
          this.isSmiling = await isSmiling(blob);
          this.loading = false;
        }, 'image/png');
      }
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

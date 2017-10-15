<template>
  <div class="smile">
    <div>
      <video ref="video"></video>
    </div>
    <div class="ui">
      <div class="ui__button">
        <button v-if="!processing" v-on:click="checkIfSmiling">Smiling?</button>
        <span v-if="processing">processing...</span>
      </div>
      <div class="ui__feedback">
        <span class="ui__feedback--success" v-if="!processing && !error">{{ smilingText }}</span>
        <span class="ui__feedback--error" v-if="!processing && error">Error: {{ error }}</span>
      </div>
    </div>
    <div class="canvas">
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
      processing: false,
      error: null,
      isSmiling: null,
      context: null,
    };
  },
  computed: {
    smilingText() {
      return this.isSmiling ? 'You are smiling.' : 'You are not smiling';
    },
  },
  mounted() {
    this.initializeWebcam();
    this.context = this.$refs.canvas.getContext('2d');
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
      this.$refs.canvas.width = this.$refs.video.videoWidth;
      this.$refs.canvas.height = this.$refs.video.videoHeight;
    },
    onWebcamError(e) {
      this.$log.error('sorry', e);
    },
    async checkIfSmiling() {
      this.$log.info('checking if smiling');
      this.error = null;
      this.processing = true;
      this.isSmiling = null;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();

      if (this.$refs.canvas.toBlob) {
        this.$refs.canvas.toBlob(async (blob) => {
          const smilingResults = await isSmiling(blob);
          this.error = smilingResults.error;
          this.isSmiling = smilingResults.smiling;
          this.processing = false;
          this.$refs.video.play();
        }, 'image/png');
      }
    },
    saveVideoFrameToCanvas() {
      if (this.$refs.video.readyState === this.$refs.video.HAVE_ENOUGH_DATA) {
        this.context.drawImage(this.$refs.video, 0, 0);
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


      &__feedback {

        &--success {

        }

        &--error {
          color: red;
        }
      }
    }

    .canvas {
      display: none;
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

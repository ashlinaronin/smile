<template>
  <div class="smile">
    <div>
      <video ref="video"></video>
    </div>
    <div class="ui">
      <div class="ui__button">
        <button v-if="!processing" v-on:click="checkIfSmiling" v-focus="true">am I smiling?</button>
        <button v-if="!processing" v-on:click="checkEmotions">check feelz</button>
        <span v-if="processing">analyzing facial features...</span>
      </div>
      <div class="ui__feedback">
        <span class="ui__feedback--success" v-if="!processing && !error">{{ smilingText }}</span>
        <span class="ui__feedback--error" v-if="!processing && error">Error: {{ error }}</span>
      </div>
    </div>
    <div class="ui__attributes">
      <ul>
        <li v-for="(attributeValue, attributeKey) in attributes">
          {{ attributeKey }}: {{ attributeValue.value }} ({{ attributeValue.confidence }}% confidence)
        </li>
      </ul>
    </div>
    <div class="canvas">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import VueFocus from 'vue-focus';
import { isSmiling, getEmotions } from 'services/face-detection';

export default {
  name: 'Smile',
  data() {
    return {
      processing: false,
      error: null,
      isSmiling: null,
      emotions: null,
      context: null,
    };
  },
  mixins: [VueFocus.mixin],
  computed: {
    smilingText() {
      return this.isSmiling ? 'you are smiling 😃.' : 'you are not smiling 😢.';
    },
    attributes() {
      return this.emotions && Object.prototype.hasOwnProperty.call(this.emotions, 'attributes') ?
        this.emotions.attributes :
        [];
    },
  },
  mounted() {
    this.initializeWebcam();
    this.context = this.$refs.canvas.getContext('2d');
    if (!this.$refs.canvas.toBlob) {
      this.error('Your browser does not support smile detection');
    }
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
      this.error = 'Error starting up your webcam';
    },
    async checkEmotions() {
      this.error = null;
      this.isSmiling = null;
      this.emotions = null;
      this.processing = true;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();
      this.$refs.canvas.toBlob(this.emotionsBlobCallback, 'image/png');
    },
    async checkIfSmiling() {
      this.error = null;
      this.isSmiling = null;
      this.processing = true;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();
      this.$refs.canvas.toBlob(this.canvasBlobCallback, 'image/png');
    },
    async canvasBlobCallback(blob) {
      const smilingResults = await isSmiling(blob);
      this.error = smilingResults.error;
      this.isSmiling = smilingResults.smiling;
      this.processing = false;
      this.$refs.video.play();
    },
    async emotionsBlobCallback(blob) {
      this.emotions = await getEmotions(blob);
      this.error = this.emotions.error;
      this.processing = false;
      this.$refs.video.play();
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
        margin-top: 50px;

        &--success {

        }

        &--error {
          color: red;
        }
      }

      &__attributes {
        background-color: #f1eaea;
        ul {
          list-style: none;
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

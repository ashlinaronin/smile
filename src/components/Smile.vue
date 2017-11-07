<template>
  <div class="smile">
    <div>
      <video ref="video"></video>
    </div>
    <div class="ui">
      <div class="ui__button">
        <button v-if="!processing" v-on:click="checkEmotions" v-focus="true">check feelz</button>
        <span v-if="processing">analyzing facial features...</span>
      </div>
      <div class="ui__attributes" v-if="skyBio || kairos">
        <div class="ui__attribute-map ui__attribute-map--sky-bio">
          <h4>SkyBiometry</h4>
          <span v-if="skyBioErrorMessage">Error getting emotional analysis from SkyBio.</span>
          <ul v-if="skyBio">
            <li v-for="(attributeValue, attributeKey) in skyBioAttributes">
              {{ attributeKey }}: {{ attributeValue.value }} ({{ attributeValue.confidence }}% confidence)
            </li>
          </ul>
        </div>
        <div class="ui__attribute-map ui__attribute-map--kairos">
          <h4>Kairos</h4>
          <span v-if="kairosErrorMessage">Error getting emotional analysis from Kairos.</span>
          <ul v-if="kairos">
            <li v-for="(attributeValue, attributeKey) in kairosAttributes">
              {{ attributeKey }}: {{ attributeValue }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="canvas">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import VueFocus from 'vue-focus';
import { getEmotions } from 'services/face-detection';

export default {
  name: 'Smile',
  data() {
    return {
      processing: false,
      successMessage: 'Your facial features were successfully analyzed.',
      skyBioErrorMessage: null,
      kairosErrorMessage: null,
      skyBio: null,
      kairos: null,
      context: null,
    };
  },
  mixins: [VueFocus.mixin],
  computed: {
    skyBioAttributes() {
      return this.skyBio && Object.prototype.hasOwnProperty.call(this.skyBio, 'attributes') ?
        this.skyBio.attributes :
        [];
    },
    kairosAttributes() {
      return this.kairos && Object.prototype.hasOwnProperty.call(this.kairos, 'attributes') ?
        this.kairos.attributes :
        [];
    },
  },
  mounted() {
    this.initializeWebcam();
    this.context = this.$refs.canvas.getContext('2d');
    if (!this.$refs.canvas.toBlob) {
      this.errorMessage = 'Your browser does not support smile detection';
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
      this.errorMessage = 'error starting up your webcam';
    },
    async checkEmotions() {
      this.errorMessage = null;
      this.skyBio = null;
      this.kairos = null;
      this.processing = true;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();
      this.$refs.canvas.toBlob(this.emotionsBlobCallback, 'image/png');
    },
    async emotionsBlobCallback(blob) {
      const emotionResult = await getEmotions(blob);

      this.skyBio = emotionResult.skyBiometry;
      this.kairos = emotionResult.kairos;
      this.skyBioErrorMessage = this.skyBio.error;
      this.kairosErrorMessage = this.kairos.error;

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
        display: flex;
        > div {
          flex: 1;
        }

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

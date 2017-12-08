<template>
  <div class="smile">
    <div>
      <video ref="video" autoplay playsinline></video>
    </div>
    <div class="ui">
      <div class="ui__button">
        <button v-if="!processing" v-on:click="checkEmotions" v-focus="true">donate smile</button>
        <span v-if="processing">processing donation...</span>
      </div>
      <div class="ui__attributes" v-if="resultsByProvider">
        <div class="ui__attribute-map" v-for="providerResult in resultsByProvider">
          <h4>Donation results</h4>
          <span v-if="providerResult.results.error">Error processing donation: {{ providerResult.results.error }}.</span>
          <span v-if="!providerResult.results.error">{{ successMessage(providerResult) }}</span>
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
import getEmotions from 'services/emotion-detection';

export default {
  name: 'Donate',
  data() {
    return {
      processing: false,
      errorMessage: null,
      resultsByProvider: [],
      context: null,
      constraints: { video: true, audio: false },
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
      // Adapted from https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/gum
      // in order to work for iOS 11
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then(this.onWebcamSuccess)
        .catch(this.onWebcamError);
    },
    onWebcamSuccess(stream) {
      const videoTracks = stream.getVideoTracks();
      this.$log.info('Got stream with constraints:', this.constraints);
      this.$log.info(`Using video device: ${videoTracks[0].label}`);
      this.$refs.video.srcObject = stream;
      this.$refs.video.onloadedmetadata = this.onLoadedMetadata;
    },
    onLoadedMetadata() {
      this.$refs.video.play();
      this.$refs.canvas.width = this.$refs.video.videoWidth;
      this.$refs.canvas.height = this.$refs.video.videoHeight;
    },
    onInactive() {
      this.$log.warning('Stream inactive');
    },
    onWebcamError(error) {
      this.$log.error('sorry', error);

      if (error.name === 'ConstraintNotSatisfiedError') {
        this.errorMessage = `The resolution ${this.constraints.video.width.exact}x${this.constraints.video.width.exact} px is not supported by your device.`;
      } else if (error.name === 'PermissionDeniedError') {
        this.errorMessage = 'Permissions have not been granted to use your camera and ' +
          'microphone. Please allow the page access to your devices in ' +
          'order to complete the donation process.';
      } else {
        this.errorMessage = `getUserMedia error: ${error.name}, ${error}`;
      }
    },
    async checkEmotions() {
      this.errorMessage = null;
      this.resultsByProvider = [];
      this.processing = true;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();
      this.$refs.canvas.toBlob(this.emotionsBlobCallback, 'image/png');
    },
    async emotionsBlobCallback(blob) {
      const emotionResult = await getEmotions(blob);

      this.resultsByProvider = emotionResult.resultsByProvider;
      this.errorMessage = emotionResult.error;
      this.processing = false;
      this.$refs.video.play();
    },
    saveVideoFrameToCanvas() {
      if (this.$refs.video.readyState === this.$refs.video.HAVE_ENOUGH_DATA) {
        this.context.drawImage(this.$refs.video, 0, 0);
      }
    },
    letterGender(gender) {
      // fuck the gender binary... but this is what we get back from skybiometry
      return (gender === 'male') ? 'm' : 'f';
    },
    successMessage(providerResult) {
      const attrs = providerResult.results.attributes;
      const gender = this.letterGender(attrs.gender.value);
      const mood = attrs.mood.value;
      const age = attrs.age_est.value;
      return `${mood} smile donated! (${gender}, ${age})`;
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

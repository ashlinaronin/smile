<template>
  <div class="smile">
    <div class="ui__webcam">
      <video ref="video" autoplay playsinline></video>
    </div>
    <div class="ui__button-results-container">
      <div class="ui__button">
        <button :disabled="processing"
                :class="{'is-disabled': processing}"
                class="primary"
                v-on:click="checkEmotions"
                v-focus="true">
          <span v-if="processing">...</span>
          <span v-if="!processing">📷 donate</span>
        </button>
        <router-link :disabled="processing"
                     :class="{'is-disabled': processing}"
                     class="button secondary"
                     to="thank-you">👋 done</router-link>
      </div>
      <div class="ui__results">
        <div>
          <h4>Donation results</h4>
          <img :src="donationImageUrl" v-show="donationImageUrl" />
        </div>
        <div>
          <p v-show="errorMessage"><strong>Error</strong>: {{ errorMessage }}. Please try again!</p>
          <p v-show="!errorMessage && successMessage"><strong>Success</strong>: {{ successMessage }}</p>
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
import store from '@/store';
import mutations from '@/library/dictionary/mutations';

const SKY_BIOMETRY_RESULTS_INDEX = 0;
const MAX_DONATIONS = 3;

export default {
  store,
  name: 'donate',
  data() {
    return {
      processing: false,
      errorMessage: null,
      serviceResults: null,
      context: null,
      constraints: { video: true, audio: false },
    };
  },
  mixins: [VueFocus.mixin],
  computed: {
    donationMood() {
      return this.serviceResults &&
        this.serviceResults.attributes &&
        this.serviceResults.attributes.mood &&
        this.serviceResults.attributes.mood.value;
    },
    donationImageUrl() {
      return this.serviceResults && this.serviceResults.smileUrl &&
        `${process.env.API_BASE_URL}/${this.serviceResults.smileUrl}`;
    },
    successMessage() {
      return (this.serviceResults && this.donationMood) ? `${this.donationMood} smile donated!` : null;
    },
    smilesDonated() {
      return this.$store.state.smilesDonated;
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
      this.serviceResults = null;
      this.errorMessage = null;
      this.processing = true;

      this.$refs.video.pause();
      this.saveVideoFrameToCanvas();
      this.$refs.canvas.toBlob(this.emotionsBlobCallback, 'image/png');
    },
    async emotionsBlobCallback(blob) {
      const emotionResult = await getEmotions(blob);
      this.serviceResults = emotionResult.resultsByProvider[SKY_BIOMETRY_RESULTS_INDEX].results;
      this.errorMessage = this.serviceResults.error;
      this.processing = false;

      if (!this.errorMessage) {
        this.$store.commit(mutations.DONATE_SMILE);
      }

      this.$refs.video.play();
    },
    saveVideoFrameToCanvas() {
      if (this.$refs.video.readyState === this.$refs.video.HAVE_ENOUGH_DATA) {
        this.context.drawImage(this.$refs.video, 0, 0);
      }
    },
  },
  watch: {
    smilesDonated(numSmiles) {
      if (numSmiles === MAX_DONATIONS) {
        this.$router.replace({ name: 'ThankYou' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '../styles/settings';

  .smile {
    font-size: 24px;

    .ui__webcam {

      video {
        width: 70%;
        padding: 2vh;
      }
    }

    .ui__button-results-container {
      width: 70%;
      padding: 2vh;
      display: flex;
      margin: 0 auto;
    }

    .ui__button {
      display: flex;
      flex-direction: row;
      flex-basis: 50%;

      > button, a {
        width: 100%;
        margin: 0 4px 0 0;
      }
    }

    .ui__results {
      background-color: $light-pink;
      border: 1px solid $light-grey;
      display: flex;
      width: 100%;

      > div {
        flex: 1;
        vertical-align: middle;
      }

      ul {
        list-style: none;
      }

      img {
        width: 100px;
      }
    }

    .canvas {
      display: none;
    }
  }
</style>

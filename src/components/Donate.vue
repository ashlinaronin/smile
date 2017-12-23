<template>
  <div class="smile">
    <div class="ui__progress">
      <div>
        {{ progressMessage }}
      </div>
    </div>
    <div>
      <video ref="video" autoplay playsinline></video>
    </div>
    <div>
      <div class="ui__button">
        <button v-if="!processing" v-on:click="checkEmotions" v-focus="true">donate smile</button>
        <router-link v-if="!processing" class="button" to="thank-you">i'm done</router-link>
        <div v-if="processing">processing donation...</div>
      </div>
      <div class="ui__results" v-if="serviceResults">
        <div>
          <h4>Donation results</h4>
        </div>
        <div>
          <p v-if="errorMessage"><strong>Error</strong>: {{ errorMessage }}. Please try again!</p>
          <p v-if="!errorMessage"><strong>Success</strong>: {{ successMessage }}</p>
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

const SKY_BIOMETRY_RESULTS_INDEX = 0;
const MAX_DONATIONS = 3;

export default {
  name: 'Donate',
  data() {
    return {
      processing: false,
      errorMessage: null,
      serviceResults: null,
      smilesDonated: 0,
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
    donationMood() {
      return this.serviceResults &&
        this.serviceResults.attributes &&
        this.serviceResults.attributes.mood &&
        this.serviceResults.attributes.mood.value;
    },
    successMessage() {
      return (this.serviceResults && this.donationMood) ? `${this.donationMood} smile donated!` : null;
    },
    progressMessage() {
      const smileStringArray = new Array(MAX_DONATIONS);
      smileStringArray.fill('0');

      for (let i = 0; i < this.smilesDonated; i += 1) {
        smileStringArray[i] = '😀';
      }

      return smileStringArray.join('');
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
        this.smilesDonated += 1;
      }

      if (this.smilesDonated === MAX_DONATIONS) {
        this.$router.replace({
          name: 'ThankYou',
        });
      }

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
  @import '../styles/settings';

  .smile {
    font-size: 24px;

    .ui__progress {
      display: flex;
      color: white;
      justify-content: flex-end;
      > div {
        border: 1px solid $light-grey;
        background: grey;
        /*flex-basis: 25%;*/
        text-align: right;
        padding: 4px;
      }
    }

    .ui__results {
      background-color: $light-pink;
      display: flex;

      > div {
        flex: 1;
        vertical-align: middle;
      }

      ul {
        list-style: none;
      }
    }

    .canvas {
      display: none;
    }
  }
</style>

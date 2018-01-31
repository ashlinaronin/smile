<template>
  <div class="smile">
    <div class="ui__webcam">
      <video ref="video" autoplay playsinline></video>
    </div>
    <div class="ui__button-results-container">
      <transition name="results-expand" mode="out-in">
        <div class="ui__results"  v-show="successMessage || errorMessage">
          <img class="ui__donation" v-if="donationImageUrl" :src="donationImageUrl" alt="donation" />
          <div class="ui__results-overlay">
            <div>
              <h2 v-if="errorMessage">
                <strong>ERROR</strong>
              </h2>
              <h2 v-if="!errorMessage && successMessage">
                <strong>SUCCESS</strong>
              </h2>
            </div>
            <div>
              <span v-show="errorMessage">
              {{ errorMessage }}. Please try again!
            </span>
              <span v-show="!errorMessage && successMessage">
              {{ successMessage }}
            </span>
            </div>
          </div>
        </div>
      </transition>
      <div class="ui__button">
        <button :disabled="processing"
                :class="{'is-disabled': processing}"
                class="primary"
                v-on:click="checkEmotions"
                v-focus="true">
          <loading-spinner v-if="processing"></loading-spinner>
          <span v-if="!processing">📷 Donate Smile</span>
        </button>
      </div>
      <donation-progress></donation-progress>
    </div>

    <div class="canvas">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import DonationProgress from '@/components/DonationProgress';
import LoadingSpinner from '@/components/LoadingSpinner';
import VueFocus from 'vue-focus';
import webcamMixin from '@/mixins/webcamMixin';
import getEmotions from 'services/emotion-detection';
import store from '@/store';
import mutations from '@/library/dictionary/mutations';

const SKY_BIOMETRY_RESULTS_INDEX = 0;
const MAX_DONATIONS = 3;

export default {
  store,
  name: 'donate',
  components: {
    DonationProgress,
    LoadingSpinner,
  },
  data() {
    return {
      processing: false,
      errorMessage: null,
      serviceResults: null,
    };
  },
  mixins: [VueFocus.mixin, webcamMixin],
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
      return (this.serviceResults && this.donationMood) ?
        this.uppercaseFirstLetter(`${this.donationMood} smile donated!`) :
        null;
    },
    smilesDonated() {
      return this.$store.state.smilesDonated;
    },
  },
  created() {
    this.$store.commit(mutations.RESET_DONATIONS);
  },
  methods: {
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
        this.$store.commit(mutations.DONATE_SMILE, { smileImageUrl: this.donationImageUrl });
      }

      this.$refs.video.play();
    },
    uppercaseFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
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
    @include container();
    
    font-size: 24px;

    .ui__webcam {
      width: 100%;
      margin: 0 auto;
      video {
        width: 100%;
        margin-top: 2vh;
        object-fit: fill;
      }
    }

    .ui__button-results-container {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }

    .ui__button {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 8px;
      width: 100%;

      > button, > a {
        width: 100%;
      }
    }

    .ui__results {
      background-color: #9a9a9a;
      height: 200px;
      display: flex;
      width: 100%;

      > div {
        flex: 1;
        vertical-align: middle;
      }

      ul {
        list-style: none;
      }
    }

    .ui__donation-placeholder {
      margin: 0 auto;
      width: 200px;
      height: 88px;
    }

    .ui__donation {
      width: 100%;
    }

    .ui__results-panel {
      display: flex;
      flex-direction: column;
    }

    .ui__results-overlay {
      position: absolute;
      width: $container-width;
      text-align: center;
      margin: 0 auto;
      color: white;

      > h2 {
        margin: 10px;
      }

      > div {
        text-align: center;
        margin: 0 auto;
        max-width: 50%;
      }
    }

    .canvas {
      display: none;
    }

    .results-expand-enter-active {
      transition: all .3s ease;
    }
    .results-expand-leave-active {
      transition: all .1s ease-out;
    }
    .results-expand-enter, .results-expand-leave-to {
      height: 0;
      opacity: 0;
    }
  }
</style>

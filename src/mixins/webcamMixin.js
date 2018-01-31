import store from '@/store';

export default {
  store,
  data() {
    return {
      errorMessage: null,
      context: null,
      constraints: { video: true, audio: false },
    };
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
    saveVideoFrameToCanvas() {
      if (this.$refs.video.readyState === this.$refs.video.HAVE_ENOUGH_DATA) {
        this.context.drawImage(this.$refs.video, 0, 0);
      }
    },
  },
};

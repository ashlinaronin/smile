import Maptastic from 'lib/maptastic';

const USE_MAPTASTIC = false;

export default {
  data() {
    return {
      projectionMap: null,
    };
  },
  mounted() {
    if (USE_MAPTASTIC) {
      this.initializeMaptastic();
    }
  },
  methods: {
    initializeMaptastic() {
      const maptasticConfig = {
        autoSave: false,
        autoLoad: false,
        layers: [this.$refs.smiles],
      };

      this.projectionMap = new Maptastic(maptasticConfig);
    },
  },
};

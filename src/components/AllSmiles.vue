<template>
  <div class="all-smiles" ref="smiles" id="test">
    <transition-group
        name="smile-list"
        tag="ul"
        :css="false"
        v-on:before-enter="beforeEnter"
        v-on:after-enter="afterEnter"
        v-on:enter="enter"
        v-on:leave="leave">
      <li v-for="(smile, index) in allSmiles"
          v-if="smile.mood"
          :key="smile.smileImageUrl"
          :data-index="index"
          class="smile__container">
        <img :src="imageUrl(smile)">
      </li>
    </transition-group>
  </div>
</template>

<script>
  import maptasticMixin from '@/mixins/maptasticMixin';
  import { getAllSmiles, getNewSmiles } from 'services/display';

  const Velocity = window.Velocity;
  const FETCH_INTERVAL_MS = 1000;

  export default {
    name: 'all-smiles',
    mixins: [maptasticMixin],
    data() {
      return {
        allSmiles: [],
        fetchIntervalId: null,
      };
    },
    async created() {
      this.allSmiles = await getAllSmiles();
      this.startFetchInterval();

      document.body.classList.add('presentation-mode');
    },
    beforeDestroy() {
      clearInterval(this.fetchIntervalId);
      document.body.classList.remove('presentation-mode');
    },
    methods: {
      imageUrl(smile) {
        return `${process.env.API_BASE_URL}/${smile.smileImageUrl}`;
      },
      async refreshSmiles() {
        const newSmiles = await getNewSmiles();

        if (newSmiles.length > 0) {
          this.allSmiles.unshift(...newSmiles);
        }
      },
      startFetchInterval() {
        this.fetchIntervalId = setInterval(this.refreshSmiles, FETCH_INTERVAL_MS);
      },
      beforeEnter(el) {
        /* eslint-disable */
        el.style.opacity = 0;
        el.style.height = 0;
      },
      afterEnter(el) {

      },
      enter(el, done) {
        const delay = el.dataset.index * 100;
        setTimeout(() => {
          Velocity(
            el,
            { opacity: 1 },
            { complete: done },
          )
        }, delay);
      },
      leave(el, done) {
        const delay = el.dataset.index * 100;
        setTimeout(() => {
          Velocity(
            el,
            { opacity: 0 },
            { complete: done },
          )
        }, delay);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .all-smiles {
    width: 100%;
    height: 400px;

    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      height: 100vh;
    }

    .smile__container {
      flex-basis: 12.3%;
      height: 12.3%;
      width: 20%;

      img {
        width: 100%;
        height: 100%;
      }
    }

  }
</style>

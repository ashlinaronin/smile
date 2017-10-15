import Vue from 'vue';
import Router from 'vue-router';
import Smile from '@/components/Smile';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Smile',
      component: Smile,
    },
  ],
});

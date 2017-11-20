import Vue from 'vue';
import Router from 'vue-router';
import Smile from '@/components/Smile';
import AllSmiles from '@/components/AllSmiles';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Smile',
      component: Smile,
    },
    { path: '/all-smiles',
      name: 'AllSmiles',
      component: AllSmiles,
    },
  ],
});

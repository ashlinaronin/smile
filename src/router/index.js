import Vue from 'vue';
import Router from 'vue-router';
import Donate from '@/components/Donate';
import AllSmiles from '@/components/AllSmiles';
import OneSmile from '@/components/OneSmile';
import Welcome from '@/components/Welcome';
import ThankYou from '@/components/ThankYou';
import SmileMaterial from '@/components/SmileMaterial';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/donate',
      name: 'Donate',
      component: Donate,
    },
    {
      path: '/thank-you',
      name: 'ThankYou',
      component: ThankYou,
    },
    {
      path: '/material',
      name: 'SmileMaterial',
      component: SmileMaterial,
    },
    {
      path: '/all-smiles',
      name: 'AllSmiles',
      component: AllSmiles,
    },
    {
      path: '/one-smile',
      name: 'OneSmile',
      component: OneSmile,
    },
  ],
});

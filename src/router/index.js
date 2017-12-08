import Vue from 'vue';
import Router from 'vue-router';
import Donate from '@/components/Donate';
import AllSmiles from '@/components/AllSmiles';
import Welcome from '@/components/Welcome';
import ThankYou from '@/components/ThankYou';

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
      path: '/all-smiles',
      name: 'AllSmiles',
      component: AllSmiles,
    },
  ],
});

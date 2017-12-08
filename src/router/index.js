import Vue from 'vue';
import Router from 'vue-router';
import Smile from '@/components/Smile';
import AllSmiles from '@/components/AllSmiles';
import Welcome from '@/components/Welcome';
import ThankYou from '@/components/ThankYou';

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
    { path: '/welcome',
      name: 'Welcome',
      component: Welcome,
    },
    { path: '/thank-you',
      name: 'ThankYou',
      component: ThankYou,
    },
  ],
});

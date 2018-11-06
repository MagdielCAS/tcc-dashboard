import Vue from 'vue';
import Router from 'vue-router';
import { Plant, Settings, Dashboard } from './views';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/plant',
      name: 'plant',
      component: Plant
    }
  ]
});

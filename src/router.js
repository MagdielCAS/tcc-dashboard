import Vue from 'vue';
import Router from 'vue-router';
import { Plant, Settings, Dashboard, Diagnosis } from './views';

Vue.use(Router);

export default new Router({
  routes: [
    { path: '/', redirect: '/plant' },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: Diagnosis
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

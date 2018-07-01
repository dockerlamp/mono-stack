import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import VisView from './views/Vis.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      name: 'home',
      component: Login,
    },
    {
      path: '/vis',
      name: 'vis',
      component: VisView,
    },
  ],
});

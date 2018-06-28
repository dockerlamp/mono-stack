import Vue from 'vue';

import App from './App.vue';
import router from './router';

new Vue({
  router,
  render: (h) => h(App),
  data: {
      name: 'Timmy alright',
  },
}).$mount('#app');

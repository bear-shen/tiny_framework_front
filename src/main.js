import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GenFunc from './lib/GenFuncLib'
import Uploader from './lib/Uploader'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')

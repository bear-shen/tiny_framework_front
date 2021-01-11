import Vue    from 'vue'
import App    from './App.vue'
import router from './router'
import store  from './store'

//教程说是要导入，但是写进去反而会导致没有导入，没有确认具体的原因，反正先扔掉算了
// import 'bootstrap/dist/js/bootstrap.min'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import './assets/darkstrap.css'
import './assets/fonts/sysIcon/iconfont.css'
import './assets/fonts/listIcon/iconfont.css'

Vue.config.productionTip = false;


/*Vue.component('Header', Header);
Vue.component('Msg', Msg);
Vue.component('Paginator', Paginator);
Vue.component('Loader', Loader);
Vue.component('Popup', Popup);*/

new Vue({
            router,
            store,
            render: function (h) { return h(App) }
        }).$mount('#app')

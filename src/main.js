import Vue from 'vue';
import App from './App.vue';
import './index.css'
import store from './store'
import config from '../config.json'

import shop from '../store.js'
Vue.prototype.$shop = () => { return shop }

import Utils from './scripts/utils.js'
Vue.use(Utils)
import Animation from './scripts/gsap.js'
Vue.use(Animation)
import Whoobe from './scripts/whoobe.js'
Vue.use(Whoobe)
import VueMeta from 'vue-meta'
Vue.use(VueMeta)
import WhoobeStore from './components/plugins/store/whoobe/store.vue'
Vue.component ( 'whoobe-store' , WhoobeStore )
import WhoobeSnipcart from './components/plugins/snipcart/snipcart.vue'
Vue.component ( 'whoobe-snipcart' , WhoobeSnipcart )
import VueGtag from 'vue-gtag'
Vue.use(VueGtag, {
    config: { 
      id: config.analytics
    }
  });


new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');

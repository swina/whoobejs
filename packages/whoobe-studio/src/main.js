import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/tailwind.css'
//import '@/assets/fonts/fonts.css'

import './scripts'
import http from "./scripts/axios";
http.defaults.timeout = 10000;
Vue.prototype.$http = http 


import Icon from '@/components/common/icon.vue'
Vue.component ( 'icon' , Icon )

import BtIcon from '@/components/common/bt.icon.vue'
Vue.component ( 'bt-icon' , BtIcon )

import Chip from '@/components/common/chip.vue'
Vue.component ( 'chip' , Chip )

import Radio from '@/components/common/radio.vue'
Vue.component ( 'radio' , Radio )

import Toggle from '@/components/common/switch.vue'
Vue.component ( 'toggle' , Toggle )

import Navigation from '@/components/common/navigation.vue'
Vue.component ( 'navigation' , Navigation )

import Modal from '@/components/common/modal.vue'
Vue.component ( 'modal' , Modal )

import ModalFullscreen from '@/components/common/modal.fullscreen.vue'
Vue.component ( 'modal-fullscreen' , ModalFullscreen )

import ContextMenu from '@/components/blocks/editor/components/block.context.menu.vue'
Vue.component ( 'context-menu' , ContextMenu )

import LoadingSpinner from '@/components/common/loading'
Vue.component('loading',LoadingSpinner)

import BlockContainer from '@/components/blocks/editor/components/block.container'
Vue.component('block-container',BlockContainer)

import BlockElement from '@/components/blocks/editor/components/block.element'
Vue.component('block-element',BlockElement)

import BlockAttributes from '@/components/blocks/editor/components/block.attributes.vue'
Vue.component('block-attributes',BlockAttributes)

import BlockReusable from '@/components/blocks/actions/block.reusable.vue'
Vue.component('block-reusable',BlockReusable)

import PluginWrapper from '@/components/common/plugin.wrapper.vue'
Vue.component('plugin-wrapper',PluginWrapper)

import Media from '@/components/media/media.vue'
Vue.component('media',Media)
import WhoobeConfirm from '@/components/common/confirm.vue'
Vue.component('modal-confirm',WhoobeConfirm)

import WhoobeIntro from '@/components/desktop/desktop.intro.vue'
Vue.component('whoobe-intro',WhoobeIntro)

import {SimpleSVG} from 'vue-simple-svg'
Vue.component('simple-svg', SimpleSVG)

import Iconify from '@iconify/iconify';
Iconify.enableCache('all', false);

import Supericon from '@/components/common/supericon.vue'
Vue.component('icon-extra',Supericon)
import IconifyIcon from '@iconify/vue';
Vue.component ( 'IconifyIcon' , IconifyIcon )

//import vueCustomElement from 'vue-custom-element'
//Vue.use(vueCustomElement);
if ( !window.localStorage.getItem('whoobe-cms') ){
  window.localStorage.setItem('whoobe-cms' , process.env.VUE_APP_API_URL )
  window.localStorage.setItem('whoobe-mode' , process.env.VUE_APP_LOCAL )
}
//import WhoobeStore from './components/plugins/store/nuxpresso/custom'
//Vue.customElement ( 'whoobe-store' , WhoobeStore )

//import PluginWrapper from '@/components/Plugins.Wrapper'
//Vue.component('plugin-wrapper', PluginWrapper)

//import VueUploadComponent from 'vue-upload-component'
//Vue.component('file-upload', VueUploadComponent)

//import LoadingSpinner from '@/components/loading'
//Vue.component('moka-loading',LoadingSpinner)

//import MokaModal from '@/components/modal'
//Vue.component ( 'moka-modal' , MokaModal )


import VueBlobJsonCsv from 'vue-blob-json-csv'
Vue.use(VueBlobJsonCsv)


//import VueDraggableResizable from 'vue-draggable-resizable'
// optionally import default styles
//import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

//Vue.component('vue-draggable-resizable', VueDraggableResizable)



//import MokaMedia from '@/components/media/media'
//Vue.component('MokaMedia', MokaMedia )

//import MokaMediaCloudinary from '@/components/plugins/cloudinary/cloudinary.widget'
//Vue.component ( 'MokaCloudinary' , MokaMediaCloudinary)

import VueHtml2Canvas from "vue-html2canvas";
Vue.use(VueHtml2Canvas);


import VueFileAgent from 'vue-file-agent';
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css';
Vue.use ( VueFileAgent )

console.log ( 'Using Whoobe-CMS => ' , window.localStorage.getItem ( 'whoobe-cms') || process.env.VUE_APP_API_URL )

import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import whoobe from './modules/whoobe'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    whoobe
  }
})
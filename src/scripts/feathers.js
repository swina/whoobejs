import Vue from 'vue'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'

const socket = io(  import.meta.env.VITE_API_UR , //'http://localhost:3030', //process.env.VUE_APP_APISERVER,
  {
    transports: ['websocket']
  }
)



const api = feathers()
  .configure(socketio(socket,{
    timeout:50000
  }))
  //.configure(auth({ storage: window.localStorage }))


const apiserver = api
export default api 
// export default {
//     install: function (Vue) {
//         Vue.prototype.$api = api
//     }
// }

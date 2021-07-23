import Vue from 'vue'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
//import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'

const socket = io( 'http://localhost:3030/', //process.env.VUE_APP_APISERVER,
  {
    transports: ['websocket']
  }
)

// const socketWhoobe = io('http://localhost:3033' ,
//   {
//     transports: ['websocket'],
//     polling: {
//       extraHeaders: {
//         Authorization: 'Basic000002121212121212222'
//       }
//     }
//   }
// )



const api = feathers()
  .configure(socketio(socket,{
    timeout:20000
  }))
  //.configure(auth({ storage: window.localStorage }))

// const whoobeApi = feathers()
//   .configure(socketio(socketWhoobe,{timeout:20000}))
//  .configure(auth({ storage: window.localStorage }))

export default ({ app }, inject) => {
  const whoobe = api
  inject ( 'whoobe' , whoobe )
}

import feathers  from '@feathersjs/feathers' 
import socketio from '@feathersjs/socketio-client' 
import io from 'socket.io-client' 

//let whoobeCMSURL = process.env.API_URL
// if ( process.env.MULTI_SITE && process.env.MULTI_CONFIG_PATH ){
//     whoobeCMSURL = require ( process.env.MULTI_CONFIG_PATH ) 
// }

const socket = io( 'http://localhost:3030/' ,
  {
    transports: ['websocket']
  }
)

const whoobe = feathers()
  .configure(socketio(socket,{
    timeout:20000
}))

export default whoobe
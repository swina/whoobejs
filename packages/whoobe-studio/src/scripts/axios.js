import axios from "axios"
import store from '../store'

/**
 * Global axios URL and headers
 */
export default axios.create({
    baseURL: window.localStorage.getItem('whoobe-cms') || process.env.VUE_APP_API_URL,
    headers: {
        "Accept" : 'application/json',
        "Content-Type": "application/json",
        "Authorization" : window.localStorage.getItem ( 'feathers-jwt' )
    }
})

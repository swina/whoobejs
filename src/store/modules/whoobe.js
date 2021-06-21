const whoobe = {
    state: {
        login: false,
        user: {},
        message: '',
        popup: null
    },
    mutations: {
        login ( state , login ){
            state.login = login
        },
        user ( state , user ){
            state.user = user
        },
        popup ( state , payload ){
            state.popup = payload
        },
        message ( state , message ){
            state.message = message
        },
    },
    actions: {
        login( { commit } , login ){
            commit ( 'login' , login )
        },
        user( { commit } , user ){
            commit ( 'user' , user )
        },
        popup( { commit } , payload ){
            commit ( 'popup' , payload )
        },
        message( { commit } , message ){
            commit ( 'message' , message )
        },
    }

}
export default whoobe
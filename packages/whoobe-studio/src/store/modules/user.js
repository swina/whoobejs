const user = {
    state: {
        login: false,
        user: {},
        popup: false,
        intro : 1
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
        intro ( state , payload ){
            state.intro = payload
        }
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
        intro( { commit } , payload ){
            commit ( 'intro' , payload )
        },
    }

}
export default user
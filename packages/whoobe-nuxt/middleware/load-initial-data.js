import RSVP from 'rsvp'

export default async function ( { store , from } ){
    let isInitialPageLoad = !from;
    if(isInitialPageLoad){
        await RSVP.all([
            store.dispatch ( 'loadHome' )
            //store.dispatch ( 'loadSettings' ),
            //store.dispatch ( 'loadHomepage' ), 
            //store.dispatch ( 'loadCategories' )
        ])
    }
}
const axios = require ( 'axios' )
const cheerio = require ( 'cheerio' )
module.exports = (options = {}) => {
    return async context => {
        if ( context.params.query.url ){
            const response = await axios.get(context.params.query.url)
                if(response.status === 200) {
                    const html = response.data;
                    const $ = cheerio.load(html); 
                    const form = $('form')
                    const inputs = $('form input')
                    // // const inputs = $('form input')
                    // // console.log ( Object.keys(inputs) )
                    let mc_data = {
                        action : form.attr('action'),
                        fields:[]
                    }
                    Object.keys(inputs).forEach ( input => {
                        let field = inputs[input]
                        if ( field.attribs ){
                            // if ( field.attribs.name === 'u'  || field.attribs.name === 'id' || field.attribs.name === 'MERGE0' ){
                                mc_data.fields.push (
                                    {
                                        name: field.attribs.name ,
                                        type: field.attribs.type,
                                        id: field.attribs.id,
                                        value: field.attribs.value
                                    }
                                )
                            // }
                        }
                        console.log ( inputs[input].attribs ? inputs[input].attribs.value + '=>' + inputs[input].attribs.name : null )
                    })
                    context.result = mc_data
                    return context
                }
            
        }
    }
}
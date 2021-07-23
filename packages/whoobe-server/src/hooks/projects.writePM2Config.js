const path = require('path');
const fs = require('fs')


module.exports = (options = {}) => {
    return async context => {
        console.log ( context.result )
        let config = JSON.stringify(context.result.config)
        fs.writeFileSync ( '/whoobe/pm2/config/' + context.result.name.replace(/ /g,'_') + '.json' , config )
        return context
    }
}
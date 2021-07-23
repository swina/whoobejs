const path = require ( 'path' )

module.exports = (options = {}) => {
    return async context => {
        let projects = require ( path.resolve('/whoobe/pm2/projects.js') )
        context.result = projects
        return context
    }
}
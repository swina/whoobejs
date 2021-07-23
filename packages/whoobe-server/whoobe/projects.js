const fs = require ( 'fs-extra' )
const path = require ( 'path' )
const rootFolder = path.resolve ( '../' )
var projects = fs.readdirSync ( path.resolve ( rootFolder , 'workspace' ) )
projects = projects.filter ( project => {
     return !fs.statSync(path.resolve( rootFolder , 'workspace' , project )).isFile() 
})
console.log ( projects )
module.exports = { projects }
const { createVuePlugin } = require('vite-plugin-vue2');
import { loadEnv } from 'vite';
import ViteComponents from 'vite-plugin-components'
import ViteFonts from 'vite-plugin-fonts'
import fetch from 'node-fetch'
import fs from 'fs-extra'

async function fonts(){ 
  //load configuration file from external resource (generate by CMS)
  const project = await fetch ( process.env.VITE_API_URL + '/config.json' ).then ( res => res.json() ).then ( pr => { return pr })
  if ( project ){
    //create local project file use by tailwind.config.js to purge
    fs.writeFileSync ( './project.json' , JSON.stringify(project) )
    //font families to load
    var fnts = project.fonts 
    //add Material Icons font
    fnts.push ( 'Material Icons' )
    return fnts
  }
}

export default async ({ command, mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  //get the fonts array
  const families = await fonts()
  return {
    plugins: [
      createVuePlugin(),
      ViteComponents({ deep:true }),
      ViteFonts({
        google: {
          families: families
        },
      }),
    ],
    server: {
      hmr : { overlay: false }
    }
  }
};
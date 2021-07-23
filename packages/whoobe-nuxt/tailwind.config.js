/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const path = require ( 'path' )

const ws = path.resolve ( './config.json'  )
const  config = require ( ws )
var whiteList = config.purge
whiteList.push ( 'body' )
// whiteList.push ( 'html')
//const { colors  } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: false, // or 'media' or 'class'
  purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./src/**/*.html'],
        // content: [
        //   'components/**/*.vue',
        //   'layouts/**/*.vue',
        //   'pages/**/*.vue',
        //   'plugins/**/*.js',
        //   'nuxt.config.js'
        // ],
        options: {
          safelist : config.purge
          //safelist: [/^blur/,/^leading/,/^bg/,/^text/,/^border/,/^hover/,/^grid/,/^grid-cols-/,/^m/,/^p/,/^flex/,/^order/,/^md:/,/^lg:/,/^w/,/^h/,/^rounded/,/^content/,/^items/,/^object/,/^font/,/^animate/,/^shadow/,/^gap/,/^grayscale/,/^justify/,/^gradient/,/^from/,/^to/,/^opacity/,/^max/],//['html','body'],
          //blocklist: [/^blur/,/^leading/,/^bg/,/^text/,/^border/,/^hover/,/^grid/,/^grid-cols-/,/^m/,/^p/,/^flex/,/^order/,/^md:/,/^lg:/,/^w/,/^h/,/^rounded/,/^content/,/^items/,/^object/,/^font/,/^animate/,/^shadow/,/^gap/,/^grayscale/,/^justify/,/^gradient/,/^from/,/^to/,/^opacity/,/^max/]
        }
  },
  theme: {
    colors:{
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            blue: colors.blue,
            teal: colors.teal,
            green: colors.green,
            yellow: colors.yellow,
            orange: colors.orange,
            red: colors.red,
            indigo: colors.indigo,
            purple: colors.purple,
            pink: colors.pink
          },
    extend: {
              colors: {
                  brown :{
                    '100' : '#F5F5F4',
                    '200' : '#E7E5E4',
                    '300' : '#D6D3D1',
                    '400' : '#A8A29E',
                    '500' : '#78716C',
                    '600' : '#57534E',
                    '700' : '#44403C',
                    '800' : '#292524',
                    '900' : '#1C1917'
                  },
                  bluegray : {
                    '100' : '#F1F5F9',
                    '200' : '#E2E8F0',
                    '300' : '#CBD5E1',
                    '400' : '#94A3B8',
                    '500' : '#64748B',
                    '600' : '#475569',
                    '700' : '#475569',
                    '800' : '#475569',
                    '900' : '#475569'
                  },
                  lime : {
                    '100' : '#ECFCCB',
                    '200' : '#D9F99D',
                    '300' : '#D9F99D',
                    '400' : '#A3E635',
                    '500' : '#84CC16',
                    '600' : '#65A30D',
                    '700' : '#4D7C0F',
                    '800' : '#3F6212',
                    '900' : '#365314'
                  }
              },
              border :{
                '12' : '1rem',
                '16' : '1.25m',
                '20' : '1.50rem'
              },
                fontFamily: {
        
                },
                zIndex: {
                  '0' : '-1',
                  '1' : '1',
                  '2' : '2',
                  '3' : '3',
                  '4' : '4',
                  '5' : '5',
                  '6' : '6',
                  '7' : '7',
                  '8' : '8',
                  '9' : '9',
                  '11': '11',
                  '12': '12',
                  '13' : '13',
                  '14' : '14',
                  '15' : '15',
                  '16' : '16',
                  '17' : '17',
                  '18' : '18',
                  '19' : '19',
                  '102': '102',
                  '103' : '103',
                  '104' : '104',
                  '105' : '105',
                  '106' : '106',
                  '107' : '107',
                  '108' : '108',
                  '109' : '109', 
                  'max'     : '1000',
                  'top'     : '10000',
                  'xtop'    : '100000',
                  '2xtop'   : '1000000',
                  'highest' : '10000000',
                  'modal'   : '100000000'
                },
                lineHeight : {
                  '11' : '2.75rem',
                  '12' : '3.0rem',
                  '13' : '3.25rem',
                  '14' : '3.5rem',
                  '15' : '3.755rem'
                },
                fontSize : {
                  '6xl' : '3.25rem',
                  '7xl' : '3.5rem',
                  '8xl' : '3.75rem',
                  '9xl' : '4rem',
                  '10xl' : '5rem',
                  '20xl' : '6rem'
                },
                width : {
                  'auto'  : 'auto',
                  'half'  : '50%',
                  'large' : '60%',
                  'wide'  : '75%',
                  'extrawide' : '85%'
                },
                height: {
                  '1/5': '20vh',
                  '1/4': '25vh',
                  '1/3': '33vh',
                  '2/5': '40vh',
                  '1/2': '50vh',
                  '2/3': '66vh',
                  '3/5': '60vh',
                  '3/4': '75vh',
                  '4/5': '80vh',
                  '1/12' : '12vh'
                },
                scale: {
                  '101': '1.01',
                  '102': '1.02',
                  '103': '1.03',
                  '104': '1.04',
                  '105' : '1.05',
                  '106': '1.06',
                  '107': '1.07',
                  '108' : '1.08',
                  '109' : '1.09',
                  '111': '1.11',
                  '112': '1.12',
                  '113': '1.13',
                  '114': '1.14',
                  '115' : '1.15',
                  '116': '1.16',
                  '117': '1.17',
                  '118' : '1.18',
                  '119' : '1.19',
                  '120' : '1.20'
                },
                gridTemplateRows: {
                  'pancake' : 'auto 1fr auto'
                },
                spacing: {
                  'full' : '100%',
                  '1/2' : '50%',
                  '1/3' : '33.333333%',
                  '2/3' : '66.666667%', 
                  '1/4' : '25%',
                  '3/4' : '75%',
                  '1/5' : '20%',
                  '2/5' : '40%',
                  '3/5' : '60%',
                  '4/5' : '80%',
                  '1/6' : '16.666667%',
                  '2/6' : '33.333333%',
                  '4/6' : '66.666667%',
                  '5/6' : '83.333333%',
                  '1/12' : '8.333333%',
                  '2/12' : '16.666667%',
                  '3/12' : '25%',
                  '4/12' : '8.333333%',
                  '5/12' : '16.666667%',
                  '7/12' : '58.333333%',
                  '8/12' : '66.666667%',
                  '9/12' : '75%',
                  '10/12' : '83.333333%',
                  '11/12' : '91.666667%'  
                }
          
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
// const { colors  } = require('tailwindcss/defaultTheme')
// module.exports = {
//   theme: {
//     // colors:{
//     //   transparent: 'transparent',
//     //   current: 'currentColor',
//     //   black: colors.black,
//     //   white: colors.white,
//     //   gray: colors.gray,
//     //   blue: colors.blue,
//     //   teal: colors.teal,
//     //   green: colors.green,
//     //   orange: colors.orange,
//     //   red: colors.red,
//     //   indigo: colors.indigo,
//     //   purple: colors.purple,
//     //   pink: colors.pink
//     // },
//     maxWidth: {
//           '1/4': '25%',
//           '1/2': '50%',
//           '3/4': '75%',
//     },
   
//     borderRadius :{ 
//       'none': '0',
//       'sm': '0.125rem',
//       default: '0.25rem',
//       default: '4px',
//       'md': '0.375rem',
//       'lg': '0.5rem',
//       'full': '9999px',
//       'xl': '1rem',
//       '2xl' : '1.5rem',
//       '3xl': '2rem'
//     },
//     fontFamily: {
//       display: ['Barlow Condensed','Abel','Alice','Amethysta', 'sans-serif']
//     },
//     extend: {
//       colors: {
//           brown :{
//             '100' : '#F5F5F4',
//             '200' : '#E7E5E4',
//             '300' : '#D6D3D1',
//             '400' : '#A8A29E',
//             '500' : '#78716C',
//             '600' : '#57534E',
//             '700' : '#44403C',
//             '800' : '#292524',
//             '900' : '#1C1917'
//           },
//           bluegray : {
//             '100' : '#F1F5F9',
//             '200' : '#E2E8F0',
//             '300' : '#CBD5E1',
//             '400' : '#94A3B8',
//             '500' : '#64748B',
//             '600' : '#475569',
//             '700' : '#475569',
//             '800' : '#475569',
//             '900' : '#475569'
//           },
//           lime : {
//             '100' : '#ECFCCB',
//             '200' : '#D9F99D',
//             '300' : '#D9F99D',
//             '400' : '#A3E635',
//             '500' : '#84CC16',
//             '600' : '#65A30D',
//             '700' : '#4D7C0F',
//             '800' : '#3F6212',
//             '900' : '#365314'
//           }
//       },
//       border :{
//         '12' : '1rem',
//         '16' : '1.25m',
//         '20' : '1.50rem'
//       },
//         fontFamily: {

//         },
//         zIndex: {
//           '0' : '-1',
//           '1' : '1',
//           '2' : '2',
//           '3' : '3',
//           '4' : '4',
//           '5' : '5',
//           '6' : '6',
//           '7' : '7',
//           '8' : '8',
//           '9' : '9',
//           '11': '11',
//           '12': '12',
//           '13' : '13',
//           '14' : '14',
//           '15' : '15',
//           '16' : '16',
//           '17' : '17',
//           '18' : '18',
//           '19' : '19',
//           '102': '102',
//           '103' : '103',
//           '104' : '104',
//           '105' : '105',
//           '106' : '106',
//           '107' : '107',
//           '108' : '108',
//           '109' : '109', 
//           'max': '10000000',
//           'top': '999999999',
//           'xtop'    : '999999999999999999',
//           '2xtop'   : '9999999999999999999',
//           'highest' : '99999999999999999999'
//         },
//         lineHeight : {
//           '11' : '2.75rem',
//           '12' : '3.0rem',
//           '13' : '3.25rem',
//           '14' : '3.5rem',
//           '15' : '3.755rem'
//         },
//         fontSize : {
//           '6xl' : '3.25rem',
//           '7xl' : '3.5rem',
//           '8xl' : '3.75rem',
//           '9xl' : '4rem',
//           '10xl' : '5rem',
//           '20xl' : '6rem'
//         },
//         width : {
//           'auto'  : 'auto',
//           'half'  : '50%',
//           'large' : '60%',
//           'wide'  : '75%',
//           'extrawide' : '85%'
//         },
//         height: {
//           '1/5': '20vh',
//           '1/4': '25vh',
//           '1/3': '33vh',
//           '2/5': '40vh',
//           '1/2': '50vh',
//           '2/3': '66vh',
//           '3/5': '60vh',
//           '3/4': '75vh',
//           '4/5': '80vh',
//           '1/12' : '12vh'
//         },
//         scale: {
//           '101': '1.01',
//           '102': '1.02',
//           '103': '1.03',
//           '104': '1.04',
//           '105' : '1.05',
//           '106': '1.06',
//           '107': '1.07',
//           '108' : '1.08',
//           '109' : '1.09',
//           '111': '1.11',
//           '112': '1.12',
//           '113': '1.13',
//           '114': '1.14',
//           '115' : '1.15',
//           '116': '1.16',
//           '117': '1.17',
//           '118' : '1.18',
//           '119' : '1.19',
//           '120' : '1.20'
//         },
//         gridTemplateRows: {
//           'pancake' : 'auto 1fr auto'
//         },
//         spacing: {
//           'full' : '100%',
//           '1/2' : '50%',
//           '1/3' : '33.333333%',
//           '2/3' : '66.666667%', 
//           '1/4' : '25%',
//           '3/4' : '75%',
//           '1/5' : '20%',
//           '2/5' : '40%',
//           '3/5' : '60%',
//           '4/5' : '80%',
//           '1/6' : '16.666667%',
//           '2/6' : '33.333333%',
//           '4/6' : '66.666667%',
//           '5/6' : '83.333333%',
//           '1/12' : '8.333333%',
//           '2/12' : '16.666667%',
//           '3/12' : '25%',
//           '4/12' : '8.333333%',
//           '5/12' : '16.666667%',
//           '7/12' : '58.333333%',
//           '8/12' : '66.666667%',
//           '9/12' : '75%',
//           '10/12' : '83.333333%',
//           '11/12' : '91.666667%'  
//         }
//     },
//   },
//   variants: {
//     transform: ['responsive'],
//     translate: ['responsive'],
//     display: ['responsive'] ,
//     borderColor : [ 'responsive' , 'hover' , 'focus' ],
//     backgroundColor: [ 'responsive' , 'hover' , 'focus' ],
//     visibility : [ 'responsive' , 'hover' ], 
//     outline: [ 'focus']
//   },
//   plugins: [],
//   purge: {
//     // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
//     enabled: process.env.NODE_ENV === 'production',
//     content: [
//       'components/**/*.vue',
//       'layouts/**/*.vue',
//       'pages/**/*.vue',
//       'plugins/**/*.js',
//       'nuxt.config.js'
//     ],
//     options: {
//       whitelist: ['html','body'],
//       whitelistPatterns: [/^blur/,/^leading/,/^bg/,/^text/,/^border/,/^hover/,/^grid/,/^grid-cols-/,/^m/,/^p/,/^flex/,/^order/,/^md:/,/^lg:/,/^w/,/^h/,/^rounded/,/^content/,/^items/,/^object/,/^font/,/^animate/,/^shadow/,/^gap/,/^grayscale/,/^justify/,/^gradient/,/^from/,/^to/,/^opacity/,/^max/]
//     }
//   }
// }

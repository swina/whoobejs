var ce = document.createElement.bind(document);

function init (){
console.log ( ce , 'init script')
var target = ce ( 'div' )
target.setAttribute('id','loadCart')
const snipcartCSS = document.createElement('link')
snipcartCSS.setAttribute('rel','stylesheet')
snipcartCSS.setAttribute('href','https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.css')

const snipcartScript = document.createElement("script");
snipcartScript.setAttribute("type", "text/javascript");
snipcartScript.setAttribute("charset", "utf-8");
snipcartScript.setAttribute("data-cfasync", "false");
snipcartScript.setAttribute(
    "src",
    `https://cdn.snipcart.com/themes/v3.0.31/default/snipcart.js`
);
target.appendChild(snipcartCSS);
target.appendChild(snipcartScript);
console.log ( target )
return target
}
export default function SnipCart ( key ){
    let container = init()
    var snipcart = document.createElement ( 'div' )
    snipcart.setAttribute ( 'id' , 'snipcart' )
    snipcart.setAttribute ( 'data-api-key' , key ) 
    document.body.append ( container  )
    document.body.append ( snipcart )
    console.log ( snipcart )
}

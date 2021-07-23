<template>
    <div :id="'carousel_' + block.id"  v-if="block">
        <whoobe-navigation 
            v-if="block.gallery.navigation.enable" 
            :navigation="block.gallery.navigation" 
            :dots="block.gallery.dots"
            :gallery="block.gallery"
            :index="index"
            class="z-highest" 
            @next="index++" 
            @prev="index--"
            @goto="goToSlide"/>
    </div>
</template>

<script>
import WhoobeNavigation from './block.preview.navigation'
export default {
    name: 'WhoobePreviewCarousel',
    components: { WhoobeNavigation },
    data:()=>({
        carouselKey: null,
        index:0
    }),
    props:['block'],
    watch:{
        index(v){
            
            v > this.block.gallery.images.length -1 ? this.index = 0 : null 
            v < 0 ? this.index = this.block.gallery.images.length-1 : null
            this.goTo(this.index)
        }
    },
    methods:{
        goTo(i){
            this.block.gallery.images.forEach ( (image,n) => {
                // if ( this.block.gallery.animation.includes('fade') ){
                //     document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.animation = ''
                //     document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.opacity = 0
                // } else {
                    document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.animation = ''
                    document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.transition = 'all ' + this.block.gallery.delay + 's linear'
                    //document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.transform = 'translateX(-100%)'
                    document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.opacity = 0
                // }
            })
            let animation = this.block.gallery.custom ? this.block.gallery.custom : this.block.gallery.animation + 'Navigation'
            let el = document.querySelector ( '.carousel_' + this.block.id + '_' + i )
            el.style.animation = animation // + ' ' + this.block.gallery.delay + 's linear 1'
            el.style.animationDuration = this.block.gallery.delay + 's'
            el.style.animationTimingFunction = 'linear'
            
            el.style.opacity = 1
            //el.style.zIndex = 1
            
            //el.style.animationFillMode = 'both'
            //el.style.opacity = 1
        },
        goToSlide(n){
            this.index = n
            this.goTo(n)
        }
    },
    mounted(){
        let block = this.block
        var bgContainer = document.querySelector('#carousel_' + block.id )
        console.log ( 'Init carousel ...' , bgContainer  )
        if ( bgContainer ){
            bgContainer.classList.add('absolute','bgcontainer','top-0','left-0','bottom-0','right-0','z-1')
            var timing = ''
            var delay = false
            if ( !block.gallery.navigation.enable){
                timing = ( (parseFloat(block.gallery.delay)* (block.gallery.images.length)) )  + 's' + ' linear infinite 0s'
                delay = true
            } else {
                timing = '3s linear' //(parseFloat(block.gallery.delay)) + 's linear 0s'
            }
            var animation = 'imageFade'
            block.gallery.hasOwnProperty('custom') && block.gallery.custom ? 
                animation = block.gallery.custom :
                    block.gallery.hasOwnProperty('animation') ? 
                        animation = block.gallery.animation : 
                            null
            let container
            block.gallery.images.forEach( (image,i) => {
                if ( i < 100 ){
                container = document.createElement('div')
                bgContainer.appendChild ( container )

                container.classList.add('absolute','top-0','left-0','bottom-0','right-0','bg-cover','bg-no-repeat','bg-top', 'carousel_' + block.id + '_' + i)
                
                

                container.style.animation = animation
                container.style.animationDelay = (parseInt(block.gallery.delay)*(i))+'s'
                container.style.animationDuration = (parseInt(block.gallery.delay)*(block.gallery.images.length))+'s'
                container.style.animationIterationCount = 'infinite'
                container.style.backgroundImage = 'url(' + this.$imageURL(image) + ')'
                container.style.zIndex = -1
                // delay ? 
                //     container.classList.add ( 'opacity-0' ) : null
                // delay ? 
                //     container.style.animation = animation + ' ' + timing : null
                // delay ? 
                //     container.style.animationDelay = (parseInt(block.gallery.delay)*(i))+'s' :
                //         null
                
                }
            })
            
        }
        if ( block.gallery.navigation.enable ){
            //this.goTo(0)
            this.block.gallery.images.forEach ( (image,n) => {
                 document.querySelector ( '.carousel_' + this.block.id + '_' + n ).style.opacity = 0
            })
            let el = document.querySelector ( '.carousel_' + block.id + '_0' )
            el.style.animation = block.gallery.custom ? block.gallery.custom : block.gallery.animation
            el.style.animationDuration = block.gallery.delay + 's'
            el.style.animationTimingFunction = 'linear'
            el.style.zIndex = 1
            el.style.opacity = 1
        }
        if ( this.block.gallery.custom ){
            let stile = document.createElement('style')
            stile.innerHTML = '@keyframes ' + this.block.gallery.custom + '{ ' + this.block.gallery.keyframes + '}'
            bgContainer.appendChild ( stile )
        }
    }
}
</script>

<style>
@keyframes imageFadeNavigation {
    0% { opacity: 0; animation-timing-function: ease-in; }
    35% { opacity: 1 }
    50% { opacity: 1 }
    100% { opacity: 1 }
},
@keyframes imageFade { 
    0% { opacity: 0; animation-timing-function: ease-in; }
    8% { opacity: 1; animation-timing-function: ease-out; }
    25% { opacity: 1 }
    50% { opacity: 1 }
    100% { opacity: 0 }
}

@keyframes imageSlider {
    0% {opacity:1;visibility: visible}
    99% {opacity:1;visibility: hidden}
}  
@keyframes imageSlide { 
    0% { opacity:0 ; background-position-x: 0%; animation-timing-function: linear; }
    2% { opacity:1 ; background-position-x: 0%;  animation-timing-function: linear; }
    25% { opacity: 1 }
    95% { opacity: 1 ; }
    100% { opacity: 0;background-position-x: 100%}
}
@keyframes imageSlideNavigation { 
    0% { opacity:1 ; transform: translateX( 100% );  }
    20% { opacity:.4 ; transform: translateX( 80% );  }
    50% { opacity: .8 ; transform: translateX( 50% );  }
    100% { opacity: 1; transform: translateX( 0% ); }
}
</style>
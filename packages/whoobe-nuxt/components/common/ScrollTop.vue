<template>
    <a href="#"  v-if="visible" v-scroll-to="top" class=" fixed bottom-0 right-0 mb-14 m-2 z-highest">
    <icon-extra icon="ic:round-keyboard-arrow-up" class="cursor-pointer text-black bg-white shadow rounded-full" style="font-size:3rem;"/>
    </a>
</template>

<script>
export default {
    name: 'WhoobeScrollTop',
    data:()=>({
        visible: false,
        visibleoffset: 120,
        visibleoffsetbottom:0
    }),
    computed:{
        top(){
            return process.client ?
                { element : document.querySelector('body') , duration: 1500 } : null
        }
    },
    methods:{
        catchScroll(){
            if ( process.client ){
                const pastTopOffset = window.pageYOffset > parseInt(this.visibleoffset)
                const pastBottomOffset = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - parseInt(this.visibleoffsetbottom)
                this.visible = parseInt(this.visibleoffsetbottom) > 0 ? pastTopOffset && !pastBottomOffset : pastTopOffset
            }
        },
        scrollTop(){
          if ( process.client ) window.scrollTo(0,0)
        }
    },
    destroy(){
        window.removeEventListener('scroll')
    },
    mounted(){
        if ( process.client ){
            window.smoothscroll = () => {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
            if (currentScroll > 0) {
                window.requestAnimationFrame(window.smoothscroll)
                window.scrollTo(0, Math.floor(currentScroll - (currentScroll / 5)))
            }
            }
            //this.visibleoffset = window.innerHeight
            window.addEventListener('scroll', this.catchScroll)
        }
    }
}
</script>
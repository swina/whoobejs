<template>
<span>
    <div class="absolute h-full overflow-hidden top-0 left-0 p-2 flex flex-col justify-center z-highest" :class="classe" @click="$emit('prev')">
        <icon class="z-highest":css="navigation.color + ' ' +  navigation.size" :name="navigation.icons[0]"/>
    </div>
    <div class="absolute h-full overflow-hidden top-0  right-0 p-2 flex flex-col justify-center z-highest" :class="classe" @click="$emit('next')" >
        <icon class="z-highest" :css="navigation.color + ' ' +  navigation.size" :name="navigation.icons[1]"/>
    </div>
    <div v-if="dots && dots.enable" class="absolute bottom-0 left-0 text-center flex flex-row justify-center items-center w-full p-2 z-highest m-2">
        <i class="material-icons mr-2" :class="parseInt($attrs.index)===(n-1)?'animate-ping ' + dots.css:dots.css" v-for="n in $attrs.gallery.images.length" @click="$emit('goto',n-1)">fiber_manual_record</i>
    </div>
</span>
</template>


<script>
export default {
    name: 'WhoobeNavigationVert',
    props: ['navigation','dots'],
    computed: {
        classe(){
            let css = this.navigation.css
            css += ' ' + this.navigation.position
            return this.$clean(css)
        }
    }
}
</script>
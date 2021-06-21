<template>
    <div :class="'fixed z-2xtop h-screen overflow-y-auto theme-dark overflow-x-hidden shadow-lg inset-0 w-screen ' + $attrs.position">
        <div class="absolute z-highest top-0 right-0 h-8 px-2 flex flex-row items-center text-gray-400 text-xls" >
            <i class="material-icons" @click="$emit('close')">close</i>
        </div>
        <div class="text-sm flex flex-row items-center bg-gray-900 text-white px-2 py-1">
            <slot name="title"></slot>
        </div>
        <div class="relative overflow-y-auto w-full h-full">
            <slot name="content" class="relative overflow-y-auto">
            </slot>
        </div> 
    </div>
</template>

<script>
export default {
    name: 'ModalFullscreen',
    props: ['name'],
    computed:{
        component(){
            return () =>  import( '@/components/' + this.name )
        }
    }
}
</script>
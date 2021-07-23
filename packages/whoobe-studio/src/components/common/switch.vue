<template>
    <div class="flex flex-row items-center">
    <icon :name="status?'toggle_on':'toggle_off'" class="text-5xl transition-color duration-500 ease-in-out" :class="classe" @click="$emit('click',status=!status)"/> {{ $attrs.label }}
    </div>
</template>

<script>
export default {
    name: 'Toggle',
    data:()=>({
        status:false
    }),
    computed:{
        classe(){
            return this.status ? 'text-gray-700 ' + this.$attrs.css :'text-gray-300 ' + this.$attrs.css 
        }
    },
    mounted(){
        this.status = this.$attrs.status
    }
}
</script>
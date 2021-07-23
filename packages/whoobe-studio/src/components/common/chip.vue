<template>
    <span class="px-2 w-auto cursor-pointer" :class="classe">
        <span @click="$emit('click')">{{$attrs.content}}</span>
        <icon :name="$attrs.icon" v-if="$attrs.icon" class="ml-1" :class="$attrs.reverse?'order-first':''" @click="$emit('click')"/>
    </span>
</template>

<script>
export default {
    name: 'WhoobeChip',
    computed:{
        classe(){
            return this.$attrs.css ? this.$attrs.css : 'bg-purple-500 text-white rounded py-1'
        }
    }
}
</script>
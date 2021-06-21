<template>
    <div class="flex flex-row items-center justify-around px-2 py-1" :class="$attrs.css">
        <div>{{$attrs.content}}</div>
        <icon :name="$attrs.icon" v-if="$attrs.icon" class="mx-1" :class="$attrs.reverse?'order-first':''" @click="$emit('click')"/>
    </div>
</template>

<script>
export default {
    name: 'WhoobeChip',
}
</script>
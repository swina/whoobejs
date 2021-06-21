<template>
    <i class="material-icons" :class="$attrs.css" @click="$emit('click')">{{$attrs.name}}</i>
</template>
<script>
export default {
    name: 'Icon',
}
</script>

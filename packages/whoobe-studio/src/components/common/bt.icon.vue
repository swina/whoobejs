<template>
    <i :class="'bi-' + $attrs.name + ' ' + $attrs.css" @click="$emit('click')"/>
</template>
<script>
export default {
    name: 'BootstrapIcon',
}
</script>

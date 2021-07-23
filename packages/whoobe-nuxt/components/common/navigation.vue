<template>
    <div class="flex-row-center justify-center">
        <icon :class="'text-' + size" name="chevron_left" @click="$emit('prev')"/>
        <icon :class="'text-' + size" name="chevron_right" @click="$emit('next')"/>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: {
        size : { type: String , required: false , default: 'base' }
    }
}
</script>
<template>
    <input :type="el.type" :name="el.name" :class="$cssResponsive(el.css)" :value="el.content" :placeholder="el.placeholder"/>
</template>

<script>
export default {
    name: 'MokaInputElement',
    props:['el']
}
</script>
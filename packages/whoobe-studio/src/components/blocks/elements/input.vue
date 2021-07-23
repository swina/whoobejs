<template>
    <input :type="el.type" :class="$cssResponsive(el.css)" :value="el.content" :placeholder="el.required?'required!':''"/>
</template>

<script>
export default {
    name: 'MokaInputElement',
    props:['el']
}
</script>
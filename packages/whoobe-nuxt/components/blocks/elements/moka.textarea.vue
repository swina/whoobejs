<template>
    <textarea :type="el.type" :name="el.name" :id="el.id" :class="$cssResponsive(el.css)" :value="el.content" :placeholder="el.required?'required!':''"/>
</template>

<script>
export default {
    name: 'MokaTextareaElement',
    props:['el']
}
</script>
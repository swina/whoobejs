<template>
    <select :name="el.name" :class="$cssResponsive(el.css)" :placeholder="el.placeholder">
        <option v-for="option in el.options" :value="option">{{ option }}</option>
    </select>
</template>

<script>
export default {
    name: 'MokaSelectElement',
    props:['el']
}
</script>
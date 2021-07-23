<template>
    <span class="cursor-pointer">
        <toggle :label="el.placeholder" :status="el.content" :css="el.css" @click="el.content=!el.content"/>
        <input type="hidden" :name="el.name" :value="el.content"/>
    </span>
</template>

<script>
export default {
    name: 'MokaToggle',
    props:['el']
}
</script>
<template>
    <div class="flex flex-row flex-wrap">
        <template v-for="option in el.options">
            <chip v-if="option" :content="option" :class="el.css" @click="selected=option,$emit('click',option)"/>
        </template>
        <input type="hidden" :name="el.name" :value="selected"/>
    </div>
</template>

<script>
export default {
    name: 'MokaChip',
    props:['el'],
    data:()=>({
        selected: null
    })
}
</script>
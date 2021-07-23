<template>
    <div class="flex flex-col">
        <template v-for="option in el.options">
            <div v-if="option" :content="option" :class="el.css" @click="selected=option,$emit('click',option)">{{ option }}</div>
        </template>
        <input type="hidden" :name="el.name" :value="selected"/>
    </div>
</template>

<script>
export default {
    name: 'MokaList',
    props:['el'],
    data:()=>({
        selected: null
    })
}
</script>
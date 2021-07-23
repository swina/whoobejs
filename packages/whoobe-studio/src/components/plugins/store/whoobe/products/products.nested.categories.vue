<template>
    <ul v-if="$attrs.category">
        
            <template v-for="category in Object.keys($attrs.category)">
                <li class="list-none" ><input type="checkbox" v-model="selected[$attrs.name+'|'+category]"/> {{ category }}</li>
                <ul>
                <template v-for="name in $attrs.category[category]">
                    <li class="list-none" ><input type="checkbox" v-model="selected[$attrs.name+'|'+category+'|'+name]"/> {{ name }}</li>
                </template>
                </ul>
            </template>
    </ul>
</template>

<script>
export default {
    name: 'NestedObject',
    data:()=>({
        categories: {}
    }),
    computed:{
        selected(){
            return this.$mapState().datastore.selectedCategories
        }
    }
}
</script>
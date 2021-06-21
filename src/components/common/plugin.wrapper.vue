<template>
    <div class="relative"> 
        <component 
            :is="component"
            :plugin="plugin"/>
    </div>
</template>

<script>
export default {
    data:()=>({
        component: null,
        enabled: false,
    }),
    props: ['doc','plugin'],
    computed:{
    },
    mounted(){
        let name = this.plugin.general.path.toString()
        name = 'whoobe-store'
        this.component = `${name}` //'whoobe-store' //() => import( `../../components/plugins/store/whoobe/store.vue` )
    }
}
</script>
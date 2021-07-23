<template>
    <div class="relative"> 
        <component 
            :is="component"
            :plugin="plugin"/>
    </div>
</template>

<script>
export default {
    name: 'PluginWrapper',
    data:()=>({
        component: null,
        enabled: false,
    }),
    props: ['doc','plugin'],
    computed:{
    },
    mounted(){
        let name = this.plugin.general.path.toString()
        //name = 'whoobe-store'
        console.log ( name )
        this.component = () => import( `../../components/plugins/${name}.vue`  )
    }
}
</script>
<template>
    <div>
        <input class="dark" placeholder="search icon ..." type="text" v-model="search" @keydown="searchIcon($event)"/>
        <div v-if="icons" class="flex flex-row flex-wrap">
            <template v-for="icon in icons">
                <div class="w-auto h-8 m-2 text-center" @click="setIcon(icon)">
                    <i class="iconify text-2xl" :data-icon="icon"></i>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'BlockIconify',
    data:()=>({
        search: '',
        icons: null
    }),
    computed:{
        ...mapState(['editor'])
    },
    methods: {
        searchIcon(e){
            if ( e.keyCode === 13 && e.target.value.length > 2){
                this.icons = null
                this.$icons ( e.target.value ).then ( res => {
                    //this.icon = () => import ( '@iconify/icons/' + res.icons[0].split(':')[0] + '/' + res.icons[0].split(':')[1] )
                    this.icons = res.icons
                })
            }
        },
        setIcon(icon){
            this.$emit('icon',icon)
            this.editor.current.content = icon
        }
    }
}
</script>
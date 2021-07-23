<template>
    <span>
        <i :class="'bi-list text-2xl z-highest fixed top-0 left-0 m-1 ' + el.css.responsive_items" v-if="!menu_show && el.element === 'menu' && el.responsive" @click="nested=null,menu_show=!menu_show"></i>
    
        <div v-if="menu_show" class="fixed inset-0 transition duration-700" :class="el.css.responsive">
            
                <nav :class="classe + ''" v-if="!nested"> 
                    <i :class="'bi-chevron-left moka-icons z-max top-0 left-0 m-1 text-2xl ' + el.css.responsive_items" v-if="el.element === 'menu' && el.responsive" @click="menu_show=!menu_show"></i>
                    <div v-for="(item,i) in el.items" :class="' cursor-pointer relative p-1'"> 
                        
                        <a v-if="!item.submenu" :class="el.css.responsive_items" :href="item.link">{{ item.label }}</a>
                        
                        <a v-if="item.submenu" :class="el.css.responsive_items" @click="nested=item">{{ item.label }} <span class="absolute right-0"><i class="bi-chevron-right"></i></span></a>
                        
                        
                        
                    </div>
                </nav>
                <nav v-if="nested" :class="classe + ''"> 
                    <i :class="'bi-chevron-left moka-icons z-max top-0 left-0 m-1 text-2xl ' + el.css.responsive_items" v-if="el.element === 'menu' && el.responsive" @click="nested=null"></i>
                    <div v-for="sub in nested.submenu">
                        <a :class="el.css.responsive_items" :href="sub.link">{{ sub.label }}</a>
                        
                    </div>
                </nav>
        </div>
    </span>
</template>

<script>
export default {
    name: 'WhoobeResponsiveMenu',
    data:()=>({
        menu_show: false,
        nested: ''
    }),
    props: ['el'],
    computed: {
        classe(){
            return this.menu_show ? this.el.css.responsive + ' width-grow': this.el.css.responsive + ' width-grow-out'
        }
    }
}
</script>
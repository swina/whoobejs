<template>

    <nav menu_nav v-if="el.element === 'menu'" :class="el.css.container + ' invisible md:visible w-full z-top ' + el.css.align +  background(el) + ' ' + el.css.css"> 
        <div menu_item v-for="(item,i) in el.items" :class="el.css.items  + ' cursor-pointer relative '" :key="el.id + '_' + i">
            
            <a :class="el.css.items" v-if="hasNoSubmenu(item)" :href="item.link && !item.link.includes('//')" @mouseover="menuover=null">
                <span v-if="!item.icon" :class="el.css.items">{{ item.label }}</span>
                <span v-else :class="el.css.items"><i :class="'bi-' + item.icon"></i></span> 
            </a>
            
            <span v-if="!hasNoSubmenu(item)" :class="el.css.items" class="cursor-pointer">
                <span class="flex flex-row items-center" v-if="!item.icon"  
            @mouseover="el.css.submenu_behavior?menuover=i:null"
            @click="menuover===i?menuover=null:menuover=i">{{ item.label }} 
                    <icon class="ml-1" :name="menuover===i?'expand_less':'expand_more'"/>
                </span>
                <span v-else><i :class="'bi-' + item.icon"></i></span>
            </span>
            
            
            <div :ref="'submenu_'+i" submenu v-if="item.submenu && item.submenu.length" :class="isOver(i) + ' ' + el.css.submenu + ' fixed flex flex-col z-highest'" @mouseleave="el.css.submenu_behavior?menuover=null:menuover=null" :style="overStyle(i)">
                
                <div v-if="item.submenu[0].blocks && menuover===i" :class="Object.values(item.submenu[0].blocks.css).join(' ')" :style="background(item.submenu[0].blocks)  + getPos(i)">
                    
                    <template v-for="block in item.submenu[0].blocks.blocks">
                        <moka-element
                        v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                        :key="block.id"
                        :el="block"
                        :data="$attrs.data||null"
                        :currency="$attrs.currency||null"
                        :develop="false"/>

                        <moka-preview-single-container 
                            v-if="block.hasOwnProperty('blocks')"
                            :key="block.id" 
                            :doc="block" 
                            level="1" 
                        />
                    </template>
                </div>
                <div v-else>
                    <template v-for="sub in item.submenu">
                            
                        <div :class="el.css.submenu_items">
                            {{sub.label}}
                            <img v-if="sub.hasOwnProperty('image')" :src="$imageURL(sub.image)" class="w-1/2"/>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    
    </nav>
        <!-- <icon name="menu" :class="'z-2xtop fixed md:hidden top-0 left-0 m-1 text-5xl font-bold ' + el.css.css" @click="menu_show=!menu_show"></icon>
        <nav class="md:hidden fixed z-2xtop flex flex-col top-0 left-0 right-0 bottom-0 h-screen"  :class="responsive()" style="transition:all 1s linear;"> 
            <i :class="'bi-arrow-left cursor-pointer z-max mb-2 text-3xl ' + itemsCSS" v-if="el.element === 'menu' && el.responsive" @click="showmenu"></i>
            <div>
                <div v-for="(item,i) in el.items" class="cursor-pointer relative p-1'"> 
                    
                    <a :class="el.css.responsive_items" v-if="hasNoSubmenu(item)" :href="item.link">{{ item.label }}</a>
                    
                    <div 
                        :class="el.css.responsive_items" 
                        v-if="!hasNoSubmenu(item)" 
                        @click="menuover===i ? menuover=null : menuover=i">{{ item.label }}</div>
                    
                    
                    <div v-if="item.submenu && item.submenu.length && menuover===i" class="ml-2 flex flex-col">
                            <div v-if="item.submenu[0].blocks" :class="Object.values(item.submenu[0].blocks.css).join(' ')" :style="background(item.submenu[0].blocks)">
                                
                                <template v-for="block in item.submenu[0].blocks.blocks">
                                    <moka-element
                                    v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                                    :key="block.id"
                                    :el="block"
                                    :data="$attrs.data||null"
                                    :currency="$attrs.currency||null"
                                    :develop="false"/>

                                    <moka-preview-single-container 
                                        v-if="block.hasOwnProperty('blocks')"
                                        :key="block.id" 
                                        :doc="block" 
                                        level="1" 
                                    />
                                </template>
                            </div>
                            <div v-else>
                                <template v-for="sub in item.submenu">
                                        
                                    <div :class="el.css.submenu_items">
                                        {{sub.label}}
                                        <img v-if="sub.hasOwnProperty('image')" :src="$imageURL(sub.image)" class="w-1/2"/>
                                    </div>
                                </template>
                            </div>
                    </div>
                    
                </div>
            </div>
        </nav> -->

    <!-- responsive -->
    
    
</template>

<script>
import { mapState } from 'vuex'

import MokaElement from '../moka.element'
import MokaPreviewSingleContainer from '../moka.menu.container'
var gsap
export default {
    name: 'WhoobeMenu',
    props: ['el'],
    components: { MokaPreviewSingleContainer },
    data:()=>({
        opacity: 'opacity-0',
        menuover: -1,
        menu_show: false
    }),
    computed:{
        ...mapState ( ['moka'] ),
        itemsCSS(){
            if ( !this.el.css.responsive ) return ''
            let classi = this.el.css.responsive.split ( ' ' )
            let cls = classi.filter ( cl => {
                            return cl.includes ( 'linkcss' ) ? cl : null 
                                
            })
            let cl = cls.length ? 
                        cls[0].split(':')[1] : ''
            return cl
        }
    },
    methods:{
        hasNoSubmenu(item){
            if ( !item.hasOwnProperty('submenu') || (item.hasOwnProperty('submenu') && !item.submenu.length )){
                return true
            }
            return false
        },
        responsive(){
            let cl = this.menu_show ? '' : 'transform -translate-x-full'
            cl += ' ' + this.el.css.responsive
            return cl
        },
        showmenu(){
            this.menu_show =! this.menu_show
        },
        getPos(i,e){
            if ( process.client ){
                if ( this.menuover === i ) {
                    let posX = this.$refs['submenu_' + i][0].getBoundingClientRect().x
                    let posY = this.$refs['submenu_' + i][0].getBoundingClientRect().y
                    let width = this.$refs['submenu_' + i][0].clientWidth
                    let height = this.$refs['submenu_' + i][0].clientHeight
                    let availableX = window.innerWidth
                    let availableY = window.innerHeight
                    if ( ( posX + width - availableX ) > 0 ){
                        this.$refs['submenu_' + i][0].style.left = (availableX - width) + 'px'
                    }
                    console.log ( availableY - height - 50 )
                    if ( ( posY + height - availableY ) > 0 ){
                        this.$refs['submenu_' + i][0].style.transform = 'translateY(-110%)'//(availableY - height - 50 ) + 'px'
                    }
                }
            }
        },
        isOver(i){
            return i < 0 ? 'opacity-0 invisible' : this.menuover === i ? 'opacity-100 visible' : 'opacity-0 invisible'
        },
        overStyle(i){
            if ( process.client ){
                return i < 0 ? 'height:0px;width:0px;' : this.menuover === i ? 'transition:height .5s linear;height:auto;' : 'transition:height .5s linear;height:0px;width:0px;'
            }
        },
        menu_responsive(menu){
            if ( menu.responsive && menu.align === 'horizontal' ){
                return 'hidden md:flex md:flex-row'
            }
            let resp = menu.responsive ? 'hidden' : ''
            let pref = menu.responsive ? 'md:' : ''
            return menu.align === 'horizontal' ? 
                resp + pref + 'flex ' + pref + 'flex-row' :
                    resp + pref + 'flex ' + pref + 'flex-col'
                    
            //if ( menu.type === 'horizontal' && menu.responsive ) return ' hidden flex flex-col md:flex md:flex-row' 
            //if ( menu.type === 'horizontal' && !menu.responsive ) return menu.css.container
            //if ( menu.type === 'vertical' ) return 'flex flex-col'
        },
        background(block){
            if ( !block ) return ''
            return block.hasOwnProperty('image') ?
                //'background-image:url(' + this.$imageURL(block.image) + ')' : ''
                block.image && block.image.url ? 
                        ' background-image:url(' + this.$imageURL(block.image) + ');' :
                             ''  : ''
        },

    },
    mounted(){
        gsap = this.$animation(this.el,this.el.id,this.$refs)
    },
    beforeDestroy(){
        if ( gsap ) gsap.timeline().kill()
    }
}
</script>
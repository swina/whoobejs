<template>
    <nav navigation :class="menuContainerCSS" class="cursor-pointer" :ref="el.id" :id="el.id" :style="background(el)">
        <icon v-if="responsive" class="burger-icon md:hidden z-highest fixed top-0 m-1 text-3xl" :class="menu_responsive?el.css.items:el.css.items" :name="menu_responsive?el.icons.back:el.icons.burger" @click="menu_responsive=!menu_responsive"/>
        <!-- desktop -->
        <div class="hidden md:contents relative">
            <template v-for="(item,i) in el.blocks">

                    <a v-if="item.link && !item.blocks.length" :href="$mapState().editor.action!='in_editor_preview'?item.link:'#'" :class="item.css">
                            {{ item.content }}
                    </a>

                    <div v-if="!item.link && !item.blocks.length" menu-item class="relative flex flex-row items-center" :class="item.css">
                        {{ item.content }}
                    </div>

                    <div v-if="!item.link && item.blocks.length" @click="openSub(i,$event)" :class="item.css + ' menu_item item_' + item.id" class="relative flex flex-row items-center">
                        
                        {{ item.content }}
                        
                        <i class="material-icons" v-if="el.hasOwnProperty('icons')">{{ el.icons.submenu }}</i>
                        <i class="material-icons" v-else>expand_more</i>
                    </div>


                    <div :ref="'submenu_'+i" submenu v-if="!item.link && item.blocks && item.blocks.length" :class="isOver(i) + ' ' + el.css.submenu + ' top-0 fixed flex flex-col z-highest'" :style="overStyle(i,item.id)" @click="submenu=null">
                        
                        <div v-if="item.blocks[0].blocks && submenu===i" :style="getPos(i)">
                            
                            <template v-for="block in item.blocks">
                                <block-preview-element
                                v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                                :key="block.id"
                                :el="block"
                                :data="$attrs.data||null"
                                :currency="$attrs.currency||null"
                                :develop="false"/>

                                <block-preview-single-container 
                                    v-if="block.hasOwnProperty('blocks')"
                                    :key="block.id" 
                                    :doc="block" 
                                    level="1" 
                                />
                            </template>
                        </div>
                        <div v-else class="flex flex-col">
                            <template v-for="subitem in item.blocks">
                                <a :href="subitem.link" :class="item.css">
                                    <span>{{ subitem.content }}</span>
                                </a>
                            </template>
                        </div>
                    </div>
                
            </template>
        </div>

        <!--responsive -->
        
        <template menu_responsive v-if="responsive" v-for="(item,i) in el.blocks" >
            <div v-if="responsive" class="md:hidden w-0" :class="opacity">
                <a v-if="item.link" :href="$mapState().editor.action!='in_editor_preview'?item.link:'#'">
                    <div :class="el.css.responsive_items">{{ item.content }}</div>
                </a>
                <div v-if="!item.link && !item.blocks.length" :class="el.css.responsive_items">{{ item.content }}</div>
                <div v-if="!item.link && item.hasOwnProperty('blocks') && item.blocks.length" @click="submenu && submenu===i?submenu=null:submenu=i" :class="el.css.responsive_items">
                        {{ item.content }}
                        <!-- <icon v-if="el.hasOwnProperty('icons')" :name="el.icons.submenu"/>
                        <icon v-else name="expand_more"/> -->
                </div>
            </div>    

                <div :ref="'submenu_'+i" submenu-responsive v-if="submenu===i && item.blocks && item.blocks.length" :class="el.css.submenu + ' absolute flex top-0 flex-col z-highest'" @click="el.css.submenu_behavior?submenu=null:submenu=null">
                    
                    <div v-if="item.blocks[0].blocks && submenu===i" @mouseleave="el.css.submenu_behavior?submenu=null:submenu=null" :style="getPos(i)">
                        
                        <template v-for="block in item.blocks">
                            <block-preview-element
                            v-if="block && !block.hasOwnProperty('blocks') && !block.hasOwnProperty('blocks')"
                            :key="block.id"
                            :el="block"
                            :data="$attrs.data||null"
                            :currency="$attrs.currency||null"
                            :develop="false"/>

                            <block-preview-single-container 
                                v-if="block.hasOwnProperty('blocks')"
                                :key="block.id" 
                                :doc="block" 
                                level="1" 
                            />
                        </template>
                    </div>
                    <div v-else class="flex flex-col">
                        <template v-for="subitem in item.blocks">
                            <a :href="subitem.link" :class="item.css">
                                <span>{{ subitem.content }}</span>
                            </a>
                        </template>
                    </div>
                </div>
        </template>
        
    </nav>
</template>

<script>
import BlockPreviewElement from '../block.element.component.vue'
import BlockPreviewSingleContainer from '../block.menu.container.vue'
export default {
    name: 'BlockPreviewMenu',
    props: ['el'],
    components: {
        BlockPreviewElement,
        BlockPreviewSingleContainer
    },
    data:()=>({
        submenu: null,
        submenu_id: null,
        width:0,
        menu_responsive:false,
        responsive: false,
        clientY: 0
    }),
    computed:{
        menuContainerCSS(){
            let responsive = this.menu_responsive ? this.el.css.responsive + ' w-full': 'p-0 m-0 h-0 w-0 ' + this.el.css.responsive.replaceAll('p-' , '')
            this.width > 640 ? this.responsive = false : this.responsive = true
            return this.width > 640 ? 
                this.el.css.css + ' ' + this.el.css.container + ' ' + this.el.css.align :
                   'fixed top-0 left-0 z-highest ' + responsive 
        },
        opacity(){
            return this.menu_responsive ? 'opacity-100 w-full' : 'opacity-0 w-0'
        }
    },
    methods:{
        background(block){
            if ( !block || !this.menu_responsive) return ''
            if ( block.hasOwnProperty('gallery') && !block.gallery || !block.hasOwnProperty('gallery')){ 
                let bgImage = ''
                block.image && block.image.url?
                    block.image && block.image.url && block.image.url.indexOf('.mp4') < 0 ? 
                            bgImage = ' background-image:url(' + this.$imageURL(block.image) + ');' :
                                null  : null
                return bgImage
            }
        },
        openSub(i,e){
            this.clientY = e.clientY + window.pageYOffset
            this.submenu === i ? this.submenu = null : this.submenu = i
        },
        isOver(i){
            return i < 0 ? 'opacity-0 invisible' : this.submenu === i ? 'opacity-100 visible' : 'opacity-0 invisible'
        },
        overStyle(i,item_id){
            let item = document.querySelector('.item_' + item_id)
            let top = this.clientY
            if ( item ) top = item.getBoundingClientRect().bottom 
            return i < 0 ? 'height:0px;' : this.submenu === i ? 'height:auto;position:fixed;top:' + top + 'px;' : 'height:0px;'
        },
        getPos(i){

            if ( this.submenu === i) {
                let posX = this.$refs['submenu_' + i][0].getBoundingClientRect().x
                let posY = this.$refs['submenu_' + i][0].getBoundingClientRect().y
                let width = this.$refs['submenu_' + i][0].clientWidth
                let height = this.$refs['submenu_' + i][0].clientHeight
                let availableX = window.innerWidth
                let availableY = window.innerHeight
                if ( ( posX + width - availableX ) > 0 ){
                    this.$refs['submenu_' + i][0].style.left = (availableX - width) + 'px'
                }
                if ( ( posY + height - availableY ) > 0 ){
                    this.$refs['submenu_' + i][0].style.transform = 'translateY(-110%)'//(availableY - height - 50 ) + 'px'
                }
            }
        },
    },
    mounted(){
        this.width = window.innerWidth
        window.addEventListener('resize',()=>{
            this.width = window.innerWidth
        })
        window.addEventListener('scroll',()=>{
            this.clientY = this.clientY + window.pageYOffset
        })
        let menu_item = document.querySelector('.menu_item') 
        if ( menu_item ){
            this.clientY = menu_item.getBoundingClientRect().bottom
        }

    }
}
</script>
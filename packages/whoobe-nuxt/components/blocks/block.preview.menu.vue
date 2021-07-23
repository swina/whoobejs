<template>
    <nav navigation :class="menuContainerCSS" class="cursor-pointer" :ref="el.id" :id="el.id" :style="background(el) + ' ' + el.style">
            

            <!-- desktop -->
            <div class="hidden md:contents relative">
                <template v-for="(item,i) in el.blocks">


                        <a v-if="item.link && item.link.includes('//') && !item.blocks.length" :href="item.link" :class="item.css" target="_blank">
                            {{ item.content }}
                        </a>
                        <nuxt-link v-if="item.link && !item.link.includes('//') && !item.blocks.length" :class="item.css" :to="item.link">{{ item.content }}</nuxt-link>

                        <div v-if="!item.link && !item.blocks.length" menu-item class="relative flex flex-row items-center" :class="item.css">
                            {{ item.content }}
                        </div>

                        <div v-if="!item.link && item.blocks.length" @click="openSub(i,$event)" :class="item.css + ' menu_item item_' + item.id" class="relative flex flex-row items-center">
                            
                            {{ item.content }}
                            
                            <icon-extra v-if="el.hasOwnProperty('icons')" :icon="el.icons.submenu"/>
                            <icon-extra v-else icon="mi:arrow_right"/>
                        </div>


                        <div :ref="'submenu_'+i" submenu v-if="!item.link && item.blocks && item.blocks.length" :class="isOver(i) + ' submenu submenu_' + i + ' ' + el.css.submenu + ' top-0 fixed flex flex-col z-highest'" :style="overStyle(i,item.id)" @click="submenu=null">
                            
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
                                    
                                    <a v-if="subitem.link && subitem.link.includes('//')" :href="subitem.link" :class="el.css.submenu_items" target="_blank">
                                        <span>{{ subitem.content }}</span>
                                    </a>
                                    <nuxt-link v-if="subitem.link && !subitem.link.includes('//')" :to="subitem.link" :class="el.css.submenu_items">
                                        <span>{{ subitem.content }}</span>
                                    </nuxt-link>
                                    <div v-if="!subitem.link">
                                        <span v-if="subitem.content" :class="el.css.submenu_items">{{ subitem.content }}</span>
                                        <div v-if="!subitem.content" :class="el.css.submenu_items"></div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    
                </template>
            </div>

            <!--responsive -->
            <!-- navigation bar -->
            <div navigation-bar class="navigation-bar md:hidden fixed bottom-0 left-0 w-full h-12 p-2 z-highest flex flex-row justify-around bg-white text-black" v-if="!menu_responsive" >
                <nuxt-link to="/" v-if="!menu_responsive && $route.path!='/'">
                    <icon css="'text-black text-3xl'" name="home" label="Home"/>
                </nuxt-link>
                <icon v-if="!menu_responsive" css="'text-black text-3xl'" name="menu"  @click="menu_responsive=!menu_responsive" label="Menu"/>
            </div>
            <icon name="close" v-if="menu_responsive" :css="el.css.responsive_items.replace('p','') + ' z-modal fixed top-0 right-0 text-3xl'"  @click="menu_responsive=!menu_responsive,submenu=null"/>
            <template menu_responsive v-if="responsive" v-for="(item,i) in el.blocks" >
                <div v-if="responsive" class="transition-all duration-700 ease-in-out md:hidden w-0" :class="opacity">

                    <a v-if="item.link && item.link.includes('//')" :href="item.link" target="_blank">
                        <div :class="el.css.responsive_items">{{ item.content }}</div>
                    </a>
                    <nuxt-link v-if="item.link && !item.link.includes('//')" :to="item.link" @click="menu_response=!menu_responsive">
                        <div :class="el.css.responsive_items">{{ item.content }}</div>
                    </nuxt-link>
                    <div v-if="!item.link && !item.blocks.length" :class="el.css.responsive_items">{{ item.content }}</div>
                    <div v-if="!item.link && item.hasOwnProperty('blocks') && item.blocks.length" @click="submenu && submenu===i?submenu=null:submenu=i" :class="el.css.responsive_items">
                            {{ item.content }}
                    </div>
                </div>    
                
                    <div :ref="'submenu_'+i" submenu-responsive v-if="submenu===i && item.blocks && item.blocks.length" @click="el.css.submenu_behavior?submenu=null:submenu=null">
                        
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
                        <div v-else class="flex flex-col pl-4">
                            <template v-for="subitem in item.blocks">
                                <a :href="subitem.link" :class="el.css.responsive_items">
                                    <span>{{ subitem.content }}</span>
                                </a>
                            </template>
                        </div>
                    </div>
            </template>
            
        </nav>
</template>

<script>
export default {
    name: 'BlockPreviewMenu',
    props: ['el'],
    components: {
        'block-preview-element' : () => import ( './block.element.vue' ),
        'block-preview-single-container' : () => import ( './block.preview.single.container.vue')
    },
    data:()=>({
        submenu: null,
        submenu_id: null,
        width:0,
        menu_responsive:false,
        menu_closed: true,
        responsive: false,
        clientY: 0,
        clientX: 0
    }),
    computed:{
        menuContainerCSS(){
            let responsive = this.menu_responsive ? this.el.css.responsive + ' w-full': '' 
            this.width > 640 ? this.responsive = false : this.responsive = true
            return this.width > 640 ? 
                this.el.css.css + ' ' + this.el.css.container + ' ' + this.el.css.align :
                   'fixed z-modal top-0 left-0 ' + responsive 
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
            this.clientX = e.clientX
            this.submenu === i ? this.submenu = null : this.submenu = i
        },
        isOver(i){
            return i < 0 ? 'invisible' : this.submenu === i ? '' : 'invisible'
        },
        overStyle(i,item_id){
            if ( process.client ){
            let item = document.querySelector('.item_' + item_id)
            let pos = {}
            if ( item ) {
                let coords = item.getBoundingClientRect()
                !this.el.css.submenu.includes('left-0') ?
                    pos = { left : coords.left + 'px;' , top: coords.bottom + 'px;' } :
                        pos = { top : coords.bottom + 'px;', left: '0px;' }
            }
            i < 0 ? 
                pos.height = '0px;' :
                    this.submenu === i ? 
                        pos.height = 'auto;' :
                            pos.height = 0 + 'px;'
            
            if ( i > -1 ){
                return 'height:' + pos.height + 'left:' + pos.left + 'top:' + pos.top
            }

            return ''
            }
        },
        getPos(i){
            
            if ( this.submenu === i) {
                let posX = this.$refs['submenu_' + i][0].getBoundingClientRect().x
                let posY = this.$refs['submenu_' + i][0].getBoundingClientRect().y
                let width = this.$refs['submenu_' + i][0].clientWidth
                let height = this.$refs['submenu_' + i][0].clientHeight
                let availableX = window.innerWidth
                let availableY = window.innerHeight
                console.log ( document.querySelector('.submenu_' + i ).getBoundingClientRect() , posX , width , posX + width , availableX )
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

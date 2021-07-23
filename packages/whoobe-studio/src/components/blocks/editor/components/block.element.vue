<template>
    <div editorelement v-if="element && element.label != 'Menu'" :class="$attrs.develop ? 'relative ' : ''" @dblclick="$emit('editinline',element)" :style="element.style" :data-element-tag="element.type!='plugin'?element.element:element.plugin.component.name">

            <block-text-inline v-if="(el.element==='p' || el.element==='div' || el.element==='span' || el.element==='h' || el.type==='button' || el.type==='download' || ( el.tag === 'article' && !el.hasOwnProperty('article') ) )  && el.element !='img' && el.type != 'video' && el.type != 'audio' && el.type != 'plugin'" :element="el"/>

            <!-- <block-text-inline v-if="(el.tag==='element' || el.type==='button' || el.type==='download' || ( el.tag === 'article' && !el.hasOwnProperty('article') ) )  && el.element !='img' && el.type != 'video' && el.type != 'audio'" :element="el"/> -->
            
            <component :is="tag" v-if="el.tag === 'article' && el.hasOwnProperty('article')" v-html="el.article[el.label]"/>
            
            <svg v-if="el.tag === 'svg'" :viewBox="el.content.viewBox" width="100%" height="100%" v-html="el.content.g" :class="el.css + ' fill-current'"></svg>

            <img :id="'image_' + el.id" v-if="el.element === 'img' && el.image && el.image.url && el.image.ext != '.svg'" 
                :src="$imageURL(el.image)" :caption="el.image.caption" :alt="el.image.alternative_text" :class="$cssResponsive(el.css) + imageCSSDefault" :style="el.css?'':''" @dblclick="$emit('media')"/>
            
            <div v-if="(el.element === 'img')  && el.image && el.image.ext === '.svg'" :class="el.css + ' fill-current'">     
                <simple-svg :src="$imageURL(el.image)" width="100%" height="100%"/>
            </div>
            <!--<button v-if="el.element === 'button'" :class="el.css">{{ el.content }}</button>-->

            <img :class="$cssResponsive(el.css) + imageCSSDefault" :ref="el.id" v-if="el.type==='video' && el.image && el.image.url && el.image.ext != '.svg' && !el.image.url.includes('mp4')" :style="el.css?'':''" :src="$imagePreviewURL(el.image).replace('h_60','h_480').replace('w_90','w_640')"/>

            <video v-if="el.type==='video' && el.image && el.image.url && (el.image.url.includes('mp4') || el.image.url.includes('webm'))" :style="el.style" :class="$cssResponsive(el.css)">
                <source :src="el.image.url"/>
            </video>
            

            <i :class="'material-icons text-10xl m-auto ' + $cssResponsive(el.css)" v-if="el.type==='video' && !el.image" :title="el.label">movie</i> 

            
            <i :class="'material-icons text-4xl m-auto ' + $cssResponsive(el.css)" v-if="el.type==='audio'" :title="el.label"> audiotrack</i>
            
            <i :class="'material-icons text-10xl m-auto ' + $cssResponsive(el.css)" v-if="el.type==='image' && !el.image">photo</i> 

            <button :class="$cssResponsive(el.css)" v-if="el.type==='file'">{{el.content}}</button>    
            
            <!-- icon -->
            <icon v-if="el.tag==='icon' && !el.link" :class="$cssResponsive(el.css)" :name="el.content"/>
            <bt-icon v-if="el.tag==='icon_bootstrap' && !el.link" :class="$cssResponsive(el.css)" :name="el.content"/>

            <!-- iconify -->
            <icon-extra v-if="el.tag==='iconify'" :css="$cssResponsive(el.css)" :icon="el.content"/>

            <!-- bootstrap icon -->
            <i v-if="el.tag==='icon_bt' && !el.link" :class="'bi-' + el.content + '  moka-icons ' + $cssResponsive(el.css)"></i>
            
            <!-- <icon v-if="el.tag==='icon'" :class="$cssResponsive(el.css)"/> -->

            <a v-if="el.link && el.tag==='icon'" :href="el.link">
                <i v-if="el.tag==='icon'" :class="'material-icons moka-icons ' + $cssResponsive(el.css)">{{el.content}}</i>
            </a>
            <a v-if="el.link && el.tag==='icon_bt'" :href="el.link">
                <i :class="'bi-' + el.content + ' ' + $cssResponsive(el.css)"></i>
            </a>

            <!-- <div v-if="el.type==='plugin' && typeof el.plugin === 'object'" :class="el.css" :style="el.style">
                <i class="material-icons">settings_input_component</i> Plugin {{ element.name }}
                <moka-plugin-wrapper v-if="el.plugin.editor" :settings="el.plugin.editor.settings"  :block="el"  :plugin="el" :component="el.plugin.component"/>
            </div> -->
            
            <input :name="el.name" :type="el.type" v-if="el.element!= 'textarea' && el.tag === 'input' && el.type!='button' && el.element != 'select'" :class="$cssResponsive(el.css)" :value="el.content" :placeholder="el.required?'required!':''"/><sup v-if="el.required" class="ml-1 nuxpresso-element-required">*</sup>

            <select v-if="el.element === 'select'" :class="el.css">
                <option value=""></option>
                <option v-for="option in el.options" :value="option">{{option}}</option>
            </select>


            <textarea v-if="el.element === 'textarea'" :class="$cssResponsive(el.css)"></textarea>

            <!--<icon name="expand_more" v-if="el.hasOwnProperty('blocks') && el.blocks.length"/>-->

            <!-- <nav v-if="el.element === 'menu'" :class="el.css.container + ' ' + el.css.align"> 
                <div v-for="(item,i) in el.items" :class="el.css.css + ' cursor-pointer relative pr-4'" :key="el.id + '_' + i"> 
                    
                    
                    <a :class="el.css.css" v-if="!item.submenu && !$attrs.develop && item.link && !item.link.includes('http')" :href="item.link">
                        <span v-if="!item.hasOwnProperty('icon') && !item.icon">{{ item.label }}</span>
                        <span v-else><i :class="'bi-' + item.icon"></i></span> 
                        <i v-if="item.submenu" class="material-icons moka-icons">arrow_drop_down</i>
                    </a>
                    
                    <div v-else @mouseover="menuover=i" :class="el.css.css" @click="menuover=i">
                        <span v-if="!item.hasOwnProperty('icon') && !item.icon">{{ item.label }}</span>
                        <span v-else><i :class="'bi-' + item.icon"></i></span>  
                        <i v-if="item.submenu && item.submenu.length" :class="el.css.css + ' material-icons moka-icons text-sm'">arrow_drop_down</i>
                    </div>
                    
                    <div v-if="item.submenu && item.submenu.length && !$attrs.develop" :class="isOver(i) + ' ' + el.css.css + ' absolute w-48 p-1 flex flex-col z-max'" @mouseleave="menuover=-1"> 
                        <div v-for="sub in item.submenu">
                            <div :class="el.css.css">{{sub.label}}</div>
                        </div>
                    </div>
                </div>
            </nav>
            <i :class="'material-icons moka-icons z-top fixed md:hidden top-0 left-0 m-1 ' + el.css.css" v-if="el.element === 'menu' && el.responsive" @click="menu_show=!menu_show">menu</i>
            <transition name="fade">
            <nav v-if="el.element === 'menu' && menu_show" class="z-top flex flex-col p-1 my-2"> 
                <div v-for="(item,i) in el.items" :class="el.css.css + ' cursor-pointer relative p-1'"> 
                    
                    <a :class="el.css.css" v-if="!item.submenu && !$attrs.develop && item.link && !item.link.includes('http')" :href="item.link">{{ item.label }} <i v-if="item.submenu" class="material-icons moka-icons">arrow_drop_down</i></a>
                    
                    <div v-else @mouseover="menuover=i" :class="el.css.css" @click="menuover=i">{{item.label}} <i v-if="item.submenu && item.submenu.length" :class="el.css.css + ' material-icons moka-icons text-sm'">arrow_drop_down</i></div>
                    
                    <div v-if="item.submenu && item.submenu.length" :class="isOver(i) + ' ' + el.css.css + ' absolute w-48 p-1 flex flex-col z-40'" @mouseleave="menuover=-1"> 
                        <div v-for="sub in item.submenu">
                            <div :class="el.css.css">{{sub.label}}</div>
                        </div>
                    </div>
                </div>
            </nav>
            </transition> -->

            <plugin-wrapper
                v-if="el.type === 'plugin'"
                :key="el.id"
                :component="$attrs.component"
                :level="parseInt($attrs.level)+1" 
                :zi="$attrs.zi + parseInt($attrs.level)"
                :plugin="el.plugin"
                :doc="el"
                :editor="true"/>


            <div :id="el.id" v-if="$attrs.develop " :class="'absolute border-dashed top-0 left-0 bottom-0 right-0 scale-x-100 scale-y-100 transform z-' + $attrs.level + ' ' + active(el.id,el.css) + ' bg-transparent'" style="min-height:2rem" @click="select(el)">
                <div class="h-2 w-2 absolute top-0 right-0 bg-black rounded-full -m-1" @click="moveUp(el.id)"></div>
                <div class="h-2 w-2 absolute top-0 left-0 bg-black rounded-full -m-1"></div>
                <div class="h-2 w-2 absolute bottom-0 right-0 bg-black rounded-full -m-1"></div>
                <div class="h-2 w-2 absolute bottom-0 left-0 bg-black rounded-full -m-1"></div>
                <!-- 
                    <i class="absolute top-0 right-0 material-icons nuxpresso-icon-circle text-sm text-black -mt-4" @click="$emit('editinline')">{{ el.icon }}</i>-->
                <div class="absolute bottom-0 left-0 -mb-4 text-xs text-purple-500" v-if="el.gsap && el.gsap.animation">{{ el.gsap.animation }}</div>
            </div>
             <div v-if="el.id===editor.selected" class="z-highest absolute top-0 right-0 -mt-6  h-6 bg-gray-800 text-gray-300 text-xs rounded-2xl items-center flex flex-row">
                    <!--,$store.dispatch('setParent',$attrs.parent)-->
                    <i class="material-icons text-sm text-lime-400 hover:text-red-500 leading-4 ml-2" @click="toolbar=!toolbar,$action('replaceelement'),$store.dispatch('setParent',$attrs.parent)" title="Replace element">{{ el.icon }}</i>
                    
                    <i class="material-icons text-sm hover:text-blue-500 leading-4 ml-2" @click="moveUp(el.id,1)" title="Move up">expand_less</i>
                    <i class="material-icons text-sm hover:text-blue-500 leading-4 ml-2" @click="moveUp(el.id,-1)" title="Move down">expand_more</i>
                    <i class="material-icons text-sm text-gray-600 hover:text-blue-500 leading-4 mr-2" @click="toolbar=!toolbar" v-if="toolbar">arrow_left</i>
                        <div v-if="toolbar||!toolbar" class="flex flex-row items-center">  
                        
                            <i v-if="el.type==='plugin'" class="material-icons hover:text-blue-500 text-sm leading-4 mx-2" @click="$action('block_plugin_setting')" title="Plugin Settings">settings</i>
                            
                            <i v-if="el.type==='element'" class="material-icons hover:text-blue-500 text-sm  leading-4 mx-2" @click="$action('block_edit')" title="Edit content">edit</i>

                            <icon name="list" class="hover:text-blue-500 text-sm leading-4 mx-2" @click="$action('block_attributes')" title="Attributes"/>
                            
                            <i v-if="el.type==='image'" class="material-icons hover:text-blue-500 text-sm    leading-4 mx-2" @click="$action('media')" title="set image">photo</i>

                            <i v-if="el.type==='video'" class="material-icons hover:text-blue-500 text-sm    leading-4 mx-2" @click="$action('media')" title="set image">photo</i>
                            
                            <i class="material-icons hover:text-blue-500 text-sm leading-4 mx-2" @click="$action('customize'),toolbar=!toolbar" title="Customize">brush</i>
                            
                            <i class="material-icons hover:text-blue-500 text-sm leading-4 mx-2" @click="$action('delete')" title="Delete">delete</i> 
                        </div>
                        <icon v-if="el.hasOwnProperty('blocks')" name="list" title="Submenu" class="hover:text-blue-500 mx-2" @click="$action('block_menu_item')"/>
                </div>
            
    </div>
</template>

<script>
//import MokaTextEditor from '@/components/editor/render/moka.text.editor'
//import MokaInlineEditor from '@/components/editor/render/moka.editor.inline'
//import MokaPluginWrapper from '@/components/Plugins.Wrapper'
import { mapState } from 'vuex'
import jp from 'jsonpath'
export default {
    name: 'BlockEditorElement',
    //components: { MokaTextEditor , MokaInlineEditor , MokaPluginWrapper },
    components: {
        'block-text-editor' : () => import ( './block.text.editor.vue' ),
        'block-text-inline' : () => import ( './block.text.inline.vue'),
        'block-editor-menu' : () => import ( './block.menu.vue')
    },
    data:()=>({
        el: null,
        article: 'article',
        opacity: 'opacity-0',
        menuover: -1,
        menu_show: false,
        toolbar: false,
    }),

    props: ['current'],
   
    computed:{
        ...mapState ( ['editor'] ),
        showid(){
            return this.$attrs.debug ? '' : 'hidden'
        },
        element(){
            if ( this.$attrs.element && this.$attrs.element.hasOwnProperty('data') && this.$attrs.element.data.hasOwnProperty('content')){
                this.$attrs.element.content = this.$attrs.element.data.content
            }
            if ( this.$attrs.element && this.$attrs.element.hasOwnProperty('data') && this.$attrs.element.data.hasOwnProperty('image')){
                this.$attrs.element.image = this.$attrs.element.data.image
            }
            //this.$attrs.element && this.$attrs.element.css ? this.$attrs.element.css = this.$clean(this.$attrs.element.css,'md:') : null
            return this.$attrs.element  ? this.el = this.$attrs.element : false
        },  
        tag(){
            if ( !this.editor.current ){
                return this.$attrs.element.element === 'h' ? 
                            'h' + this.$attrs.element.level : 
                                    this.$attrs.element.element
            } else {
                return this.$attrs.element.id != this.editor.current.id ?
                    this.$attrs.element.element === 'h' ? 
                        'h' + this.$attrs.element.level : 
                            this.$attrs.element.element : 
                                MokaInlineEditor
            }
        },
        stile(){
            if (this.el.image ){
                return 'background-image:url(' + this.el.image.url + ');' + this.el.style  
            }
            return ''
        },
        imageCSSDefault(){
            if ( !this.el.css ){
                return ' w-full h-auto'
            }
        },
        component(){
            if ( this.$attrs.element.plugin ){
                let name = this.el.plugin + '.editor'
                console.log ( name )
                return () =>  import(/* webpackChunkName: 'nuxpresso_' */ '@/components/plugins/' + name )
                //return () =>  import( name )
            }
            return false
        }
        
        
    },
    /*
    async asyncData({context}){
        const { data } = await this.$axios.$get('articles/2')
        console.log ( data )
        return { article: data.content }
    },
    */
    methods:{
        moveUp(id,up){
            let component = this.editor.component.json
            var parent = jp.parent ( component , '$..blocks[?(@.id=="' + id + '")]' )
            if ( parent.length === 1 ) return
            let i
            parent.forEach ( (p,index) => {
                if ( p.id === id ){
                    i = index
                }
            })
            if ( i > 0 ){
                let obj = Object.assign({},this.el)
                parent.splice(i,1)
                parent.splice(i-up,0,this.el)
            }
        },
        select(el){
            this.$store.dispatch('selected',el.id)
            this.$emit('selected',el)
            let element = document.querySelector('#' + this.$attrs.element.id).getBoundingClientRect()
            if ( document.querySelector('#image_' + this.$attrs.element.id) ) {
                element = document.querySelector('#image_' + this.$attrs.element.id).getBoundingClientRect()
            }
            this.coords = { 
                x: element.x -57 + window.pageXOffset,
                y: element.y - 66 + window.pageYOffset,
                width: element.width,
                height: element.height
            },
            this.editor.current.coords = this.coords
        },
        layer(){
            
            let classe = 'relative '
            if ( this.element.css.length ){
                let cl = this.element.css.split(' ')
                cl.forEach ( z => {
                    z.indexOf('z-') > -1 ? classe += z : null
                })
                return classe
            }
            classe += 'z-top'
            return classe
        },
        responsiveCss(css){
            return css //this.$clean ( this.$cssResponsive ( css ) )
        
        },
        active(id,css){
            let translate = ''
            
            if ( css && css.length ){
                let classi = css.split(' ')
                classi.forEach ( classe => {
                    if ( classe.indexOf ( 'translate' ) > -1 ){
                        translate += ' transform ' + classe
                    }
                    if ( classe.indexOf ( 'w-') > -1 ){
                        translate += ' '
                    }
                    if ( classe.indexOf ( 'h-') > -1 ){
                        translate += ' '
                    }
                    
                })
            }
            this.$attrs.element.hasOwnProperty('plugin') ? 
                translate += ' border-brown-400 border-2 ' :
                    translate += ' border-green-500 border '
            if ( id === this.editor.selected ){
                
                return ' opacity-100 bg-transparent ' + translate
            }
            return ' opacity-0 hover:opacity-100 bg-transparent ' + translate
        },
        isOver(i){
            return i < 0 ? 'opacity-0' : this.menuover === i ? 'opacity-100' : 'opacity-0'
        },
        menu_responsive(menu){
            if ( menu.type === 'horizontal' ) return 'flex flex-row' 
            if ( menu.type === 'vertical' ) return 'flex flex-col'
            if ( menu.responsive ) return menu.css.container.replace('flex-row','h-0 opacity-0 md:h-auto md:opacity-100 flex-col md:flex-row')
        },
        handleInput: function(e){
            let pippo = '<a style="pippo">'.replace(/style=\".*"/gm,'')
            console.log ( pippo )
            let text = e.target.innerHTML.replaceAll(/style=\".*"/gm,'')
            console.log ( text )
            this.editor.current.content = text//e.target.innerHTML
            //this.editor.current.content = this.editor.current.content.replace(/<style.*?<\/style>/g, '')
        },
    },
    mounted(){
      
    }
}
</script>   


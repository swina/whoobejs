<template>
<div v-if="user.intro && datastore.dataset.help">
    <transition name="fade">
    <modal
        :key="user.intro"
        v-if="user.intro"
        size="md"
        :position="position"
        :css="css"
        @close="$store.dispatch('intro',0)"
        buttons="none">
        <div slot="title">{{ title }}</div>
        <div slot="content" class="relative p-8 bg-gray-400 text-gray-800 text-lg" v-html="content">
        </div>
        <p class="p-4 bg-gray-400 text-black" slot="footer">
            <button v-if="user.intro > 1" class="bg-purple-500 rounded mr-2"@click="$store.dispatch('intro',user.intro-1)">Prev</button>
            <button v-if="datastore.dataset.help.data.length > (parseInt(user.intro))" content="Next" class="bg-purple-500 rounded" @click="$store.dispatch('intro',user.intro+1)">Next</button>
            <button v-if="datastore.dataset.help.data.length <= (parseInt(user.intro))" content="Next" class="bg-purple-500 rounded" @click="$store.dispatch('intro',0)">Close</button>
            <br><br>
            <span v-if="parseInt(user.intro) == 1">
                <input type="checkbox" v-model="enableIntro"/> Show at startup 
            </span> 
        </p>
    </modal>
    </transition>
    <!-- <transition name="fade">
        <modal
            v-if="$store.state.user.intro===2"
            css="m-12 mt-64 z-2xtop"
            size="md"
            position="modal-top-left"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Navigation Bar</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    <icon  name="chevron_left" class="absolute top-0 left-0 -ml-6 bg-white rounded-full p-2 z-highest text-xl"/> From the Navigation Bar you can access to all the application tools to manage your projects.<br>
                    <br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',1)"/><chip content="Next" @click="$store.dispatch('intro',3)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===3"
            css="mt-10 z-2xtop"
            size="md"
            position="modal-top"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Top Bar</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    <icon  name="expand_less" class="absolute top-0 left-0 -ml-6 bg-white rounded-full p-2 z-highest text-xl"/> The Top Bar is a multitab bar. When you select an option from the navigation bar usually a new tab is added to the top bar and the relative content is displayed in the main container <br>
                    <br>
                    Select <icon name="widgets"/> and Templates from the Navigation Bar<br><br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',2)"/><chip content="Next" @click="$store.dispatch('intro',4)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===4"
            size="md"
            position="modal-bottom"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Desktop Container</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    The Desktop Container is the working area of Whoobe<br>
                    <br>
                    Click on a template to open the Editor<br><br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',3)"/><chip content="Next" @click="$store.dispatch('intro',5)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===5"
            size="md"
            position="modal-bottom"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Whoobe Blocks Editor</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    The Block Editor is the core of Whoobe. Here you can assemble your page or create components, widgets and much more that then you can insert in your page, change them.<br>
                    <br>
                    
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',4)"/><chip content="Next" @click="$store.dispatch('intro',6)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===6"
            size="md"
            position="modal-bottom"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Block Selection</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    Moving the mouse around the Block Editor you will notice that every block will be highlighted with a border and a tag indicating the block type.<br>
                    <br>
                    To select a block click on it. A floating bar will be displayed in the top right of the block.
                    <br><br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',5)"/><chip content="Next" @click="$store.dispatch('intro',7)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===7"
            size="md"
            position="modal-bottom"
            css="mb-10"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Status Bar</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    At the bottom you have a Status Bar with multiple options like :<br>
                    <br>
                    <ul>
                        <li>Select the page</li>
                        <li>Add a block to the page</li>
                        <li>Add a reusable block from the library</li>
                        <li>Preview the current page (multiple options)</li>
                        <li>Edit CSS class names directly</li>
                        <li>Manage SEO data for the current page/element</li>
                        <li>Current block dimensions and coordinates</li>
                    </ul>
                    To select a block click on it. A floating bar will be displayed in the top right of the block.
                    <br><br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',6)"/><chip content="Next" @click="$store.dispatch('intro',8)"/>
                </p>
            </div>
        </modal>
    </transition>
    <transition name="fade">
        <modal
            v-if="$store.state.user.intro===8"
            size="md"
            position="modal"
            css="ml-64"
            @close="$store.dispatch('intro',0)"
            buttons="none">
            <div slot="title">Sidebar</div>
            <div slot="content" class="p-8 bg-gray-400 text-gray-800 text-lg">
                <p class="relative pl-8">
                    THe Sidebar is the core of the block editor designer. From the sidebar you have a granular control of every element in the page.<br>
                    <br>
                    <ul>
                        <li><icon name="brush"></icon> Customize</li>
                        <li><icon name="add"></icon> Add an element to the current block</li>
                        <li><icon name="code"></icon> Edit CSS / Style</li>
                        <li><icon name="brush"></icon> Animations</li>
                        <li><icon name="widgets"></icon> Add a reusable block from the library</li>
                        <li><icon name="brush"></icon> Customize</li>
                        
                    </ul>
                    To select a block click on it. A floating bar will be displayed in the top right of the block.
                    <br><br>
                    <chip content="Previous" class="mr-2" @click="$store.dispatch('intro',7)"/><chip content="Next" @click="$store.dispatch('intro',9)"/>
                </p>
            </div>
        </modal>
    </transition>
    <div class="z-highest fixed top-0 left-0 h-screen bg-transparent w-10 border-2 border-lime-500" v-if="$store.state.user.intro===2"></div>
    <div class="z-highest fixed bottom-0 left-0 bg-transparent w-screen h-10 border-2 border-lime-500" v-if="$store.state.user.intro===7"></div>
    <div class="z-highest fixed top-0 left-0 w-screen bg-transparent h-10 border-2 border-lime-500" v-if="$store.state.user.intro===3"></div> -->
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'DesktopIntro',
    data:()=>({
        enableIntro: false
    }),
    watch:{
        enableIntro(v){
            window.localStorage.setItem('whoobe-intro',v)
            // if ( !v ) {
            //     this.$store.dispatch ( 'intro' , 0 )
            // } else {
            //     this.$store.dispatch ( 'intro' , 1 )
            // }
        }
    },
    computed: {
        ...mapState ( ['datastore' , 'user' ]),
        title(){
            return this.datastore.dataset.help.data[this.user.intro-1].title
        },
        content(){
            return this.datastore.dataset.help.data[this.user.intro-1].content
        },
        position(){
            return this.datastore.dataset.help.data[this.user.intro-1].position
        },
        css(){
            return this.datastore.dataset.help.data[this.user.intro-1].css
        }
    },
    mounted(){
        if ( window.localStorage.getItem ( 'whoobe-intro') ){
            this.enableIntro = JSON.parse(window.localStorage.getItem ( 'whoobe-intro' ))
            !this.enableIntro ? 
                this.$store.dispatch ( 'intro' , 0 ) : this.$store.dispatch('intro',1) 
        } else {
            this.enableIntro = true
            this.$store.dispatch ( 'intro' , 1)            
        }
    }
}
</script>
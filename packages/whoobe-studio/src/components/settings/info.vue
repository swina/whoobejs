<template>
<!-- # Whoobe

Whoobe, *Web Html Object Oriented Blocks Editor*, is a visual block builder to create landing pages with full design control.

Checkout the documentation to install.

### Info

Version: alpha-version 0.0.1
Release date: May 2021
Author: A. Nardone
Github : https://github.com/swina/whoobe-studio-alpha-01
License : MIT 

### Last updates

- Multiple tabs
- Iconify support with access to +80.000 icons
- Static page generator based on Vitejs
- Import media from Pixabay, upload to Cloudinary, import from URL
- Snipcart plugin integrated with products manager and frontsore plugin

### Issues 

Use the Github repo to open an issue https://github.com/swina/whoobe-studio-alpha-01 -->
<div class="text-purple-500 mx-20 mt-20">
    <h3 class="flex items-center">Whoobe Studio<button class="ml-2 text-sm bg-purple-500 rounded" content="Show Intro" @click="viewIntro()">Show Intro</button></h3>
    <div class="my-20">
        <button class="lg rounded shadow bg-purple-600" @click="openStartTab()">START HERE</button>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-10">
        
        
        
         <div class="text-gray-400">
                <h3>Info</h3>
                <p>Version: alpha-version <br>July 2021</p>
                <p>Author: Antonio Nardone</p>
                <small>MIT License - Open source - Free</small>
                <h5>Issues</h5>
                <p>Help to improve Whoobe. Any time you find a bug or an error please open an issue on <a href="https://github.com/swina/whoobejs" target="_blank">Github repository</a></p>
            </div>
            <div class="text-gray-400">
                <h3>Last updates</h3>
                <p>- Context menu in the block editor and preview window</p>
                <p>- Multitabs support</p>
                <p>- Import media from Pixabay, upload media to Cloudinary, upload images from URL</p>
                
            </div>
            
            <div class="text-gray-400">
                <h3>Todo List</h3>
                <p>- Create full documentation (in progress)</p>
                <p>- PWA support</p>
                <p>- Add image editor (filerobot in progress)</p>
                <p>- Improve store products import</p>
                <p>- Add support for deployment in the cloud</p>
                <p>- Add support for dynamic content in production (blog, etc.)</p>
                
            </div>
            <div class="text-gray-400">
                <h3>Tips</h3>
                <ul>
                    <li>Copy&Paste any block/element between documents with Alt+C (copy) and Alt+v (paste)</li>
                    <li>Copy CSS attributes between blocks/elements with Alt+g (copy) and Alt+h (paste)</li>
                    <li>In the Block Editor and the Block preview window click the mouse right button to access to a context menu</li>
                </ul>
            </div>
    </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeInfo',
    methods:{
        viewIntro(){
            this.$store.dispatch('intro',1)
        },
        openStartTab(){
            //this.desktop.tabs.push ( {
            let tab = 
                {
                    component: 'blocks/blocks' ,
                    name: 'Homepages' ,
                    icon: 'widgets',
                    filter: 'homepage',
                    mode: 'components',
                    plugin: null,
                    resumeAction: null,
                    blocks: null
                }
            //}) 
            this.$store.dispatch ( 'mode' , tab.mode ) 
            this.$store.dispatch ( 'add_tab' , tab )
            //this.desktop.currentTab = this.desktop.tabs.length - 1
            //window.localStorage.setItem('whoobe-desktop',JSON.stringify(this.desktop.tabs))
        }
    }
}
</script>


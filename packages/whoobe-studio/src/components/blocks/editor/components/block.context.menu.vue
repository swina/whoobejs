<template>
    <div v-if="editor.current" class="rounded-xl z-highest" :key="$randomID()" :id="$randomID()">
        <div class="editor-context-menu-item bg-black hover:bg-black border-l-0 border-b hover:border-gray-600 border-gray-600 capitalize">
            <icon :name="editor.current.icon" v-if="editor.current.icon"/>
            <span v-if="editor.current.type">{{ editor.current.type }}</span>
            <span v-else>Block Component</span>
            <div class="absolute right-0 top-0 m-1 flex flex-row items-center" v-if="editor.current.tag!='document'">
                <i class="material-icons mr-1">north</i>Move up
            </div>
        </div>
        <!-- <div class="editor-context-menu-item" @click="$block_moveup()">
            <i class="material-icons mr-4">north</i>Move up
        </div> -->
        <div v-if="editor.current.type==='plugin'" class="editor-context-menu-item" @click="$action('pluginsetting')">
            <i class="material-icons mr-4">settings</i>Plugin Settings
        </div>

        <template v-if="editor.current.hasOwnProperty('tag') && editor.current.tag === 'document'">
            <div class="editor-context-menu-item" @click="$action('component_settings')">
                <icon name="settings" class="mr-4"/>Settings 
            </div>
            <div class="editor-context-menu-item" @click="$action('createpage')">
                <icon name="article" class="mr-4"/>Create article
            </div>
            <div class="editor-context-menu-item" @click="$action('component_export')">
                <icon name="file_download" class="mr-4"/>Export 
            </div>
            <div class="editor-context-menu-item flex flex-row justify-between" @click="$action('block_add_element')">
                <i class="material-icons mr-4">add</i>Add element <span class="text-right ml-4">(Alt + i)</span>
            </div>
            <div class="editor-context-menu-item" @click="$action('media')">
                <i class="material-icons mr-4">photo</i>Background image
            </div>
            <div class="editor-context-menu-item" @click="$action('customize')">
                <i class="material-icons mr-4">brush</i>Customize element  <span class="text-right ml-4">(Alt + z)</span>
            </div>
            <div class="editor-context-menu-item" @click="$action('addreusable')">
                <i class="material-icons mr-4">widgets</i>Add reusable component  <span class="text-right ml-4">(Alt + u)</span>
            </div>
            <div class="editor-context-menu-item" @click="$block_paste()">
                <i class="material-icons mr-4">content_paste</i>Paste from clipboard  <span class="text-right ml-4">(Alt + v)</span>
            </div>
            <div class="editor-context-menu-item" @click="$action('block_save_as_reusable')">
                <icon name="archive" class="mr-4"/>Save as reusable
            </div>
            <div class="editor-context-menu-item" @click="$action('edit_css')">
                <i class="material-icons mr-4">style</i>Edit CSS / Style
            </div>
            
            
            <div class="editor-context-menu-item" @click="$action('tree')">
                <i class="material-icons mr-4">account_tree</i>Block tree  <span class="text-right ml-4">(Alt + t)</span>
            </div>
        </template>
        <template v-else>

            <div v-if="editor.current.tag==='container' || editor.current.tag==='blocks' || editor.current.hasOwnProperty('blocks') || (editor.current.type==='plugin' && editor.current.plugin.general.editor)" class="editor-context-menu-item" @click="$action('block_add_element')">
                <i class="material-icons mr-4">add</i>Add element <span class="text-right ml-4">(Alt + i)</span>
            </div>

            <div v-if="editor.current.tag==='container' || editor.current.tag==='blocks'" class="editor-context-menu-item" @click="$action('media')">
                <i class="material-icons mr-4">photo</i>Background image
            </div>
            <div v-if="editor.current.hasOwnProperty('gallery') && editor.current.gallery" class="editor-context-menu-item" @click="$action('slidersettings')">
                <i class="material-icons mr-4">photo</i>Carousel settings
            </div>
            <div v-if="editor.current.type==='element' || editor.current.type==='button'" class="editor-context-menu-item justify-between" @click="$action('block_edit')">
                <i class="material-icons mr-4">edit</i>Edit content <span class="text-right ml-4">(Alt + w)</span>
            </div>

            <div class="editor-context-menu-item" @click="$action('block_attributes')">
                <icon name="list" class="mr-4"/> Attributes
            </div>

            <div v-if="editor.current.tag==='menu'" class="editor-context-menu-item" @click="$action('block_menu')">
                <i class="material-icons mr-4">menu</i>Menu Style<span class="text-right ml-4"></span>
            </div>

            <div class="editor-context-menu-item justify-between" @click="$action('customize')">
                <div class="flex flex-row items-center">
                    <i class="material-icons mr-4">brush</i>Customize element</div>  
                    <div class="text-right">Alt + Z</div>
                    
            </div>
            <div class="editor-context-menu-item" @click="$block_duplicate($attrs.component,$attrs.current)">
                <i class="material-icons mr-4">file_copy</i>Duplicate  <span class="text-right ml-4">(Alt + d)</span>
            </div>
            <div class="editor-context-menu-item" @click="$block_copy()">
                <i class="material-icons mr-4">content_copy</i>Copy to clipboard  <span class="text-right ml-4">(Alt + c)</span>
            </div>
            <div class="editor-context-menu-item" @click="$block_paste()">
                <i class="material-icons mr-4">content_paste</i>Paste from clipboard  <span class="text-right ml-4">(Alt + v)</span>
            </div>
            <div class="editor-context-menu-item" @click="$emit('delete')">
                <i class="material-icons mr-4">delete</i>Delete  <span class="text-right ml-4">(Alt + r)</span>
            </div>
            <div class="h-1 border-t border-gray-900 w-full"></div>
            <div class="editor-context-menu-item" @click="$action('addreusable')">
                <i class="material-icons mr-4">widgets</i>Add reusable component  <span class="text-right ml-4">(Alt + u)</span>
            </div>

            <div class="editor-context-menu-item" @click="$action('block_save_as_reusable')">
                <icon name="archive" class="mr-4"/>Save as reusable
            </div>

            <div v-if="editor.current.type==='grid' || editor.current.type==='flex'" class="editor-context-menu-item" @click="$action('addplugin')">
                <i class="material-icons mr-4">settings_input_component</i>Add plugin
            </div>
            
            <div class="editor-context-menu-item" @click="$action('animation')">
                <i class="material-icons mr-4">motion_photos_on</i>Animation ...  <span class="text-right ml-4">(Alt + a)</span>
            </div>

            <div class="editor-context-menu-item" @click="$action('edit_css')">
                <i class="material-icons mr-4">style</i>Edit CSS / Style
            </div>
            
            
            <div v-if="editor.current.hasOwnProperty('blocks')" class="editor-context-menu-item" @click="$action('tree')">
                <i class="material-icons mr-4">account_tree</i>Block tree  <span class="text-right ml-4">(Alt + t)</span>
            </div>
            
                    
        </template>

    </div>
</template>

<script>

export default {
    name: 'WhoobeEditorContextMenu',
    data:()=>({
        group: ''
    }),
    computed: {
        editor(){
            return this.$mapState().editor
        }
    },
}
</script>
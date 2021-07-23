
const actions = {
    
    login: {
        title: 'Login',
        size: 'md',
        position: 'modal',
        component: 'common/login.vue'
    },
    image_preview :{
        title: 'Preview',
        size: 'lg',
        position: 'modal',
        component: 'blocks/actions/block.image.preview.vue'
    },
    project_edit : {
        title: 'Project',
        size: 'lg',
        position: 'modal',
        component: 'settings/projects.vue'
    },
    articles_create: {
        title: 'Create article',
        size: 'md',
        position: 'modal',
        component: 'articles/article.create.vue'
    },
    article_selection : {
        title: 'Select article',
        size: 'lg',
        position: 'modal',
        component: 'blocks/actions/block.article.selection.vue'
    },
    mode_settings : {
        title: 'Server',
        size: 'md',
        position: 'modal',
        component: 'settings/settings.vue'
    },
    component_settings: {
        title: 'General settings',
        size: 'md',
        position: 'modal',
        component: 'blocks/actions/block.document.settings'
    },
    savecomponent :{
        size: false,
        title: 'Save Block',
        component : 'blocks/actions/block.save'
    },
    component_create : {
        size: 'md',
        position: 'modal',
        title: 'Create new block',
        component: 'blocks/actions/block.create.vue'
    },
    component_export : {
        size: 'md',
        position: 'modal',
        title: 'Export',
        component: 'blocks/actions/block.export.vue'
    },
    component_import : {
        size: 'md',
        position: 'modal',
        title: 'Import',
        component: 'blocks/actions/block.import.vue'
    },
    component_createpage: {
        size: 'md',
        position: 'modal',
        title: 'Create article from block',
        component: 'blocks/actions/block.create.page.vue'
    },
    animation: {
        size: 'md',
        title: 'Animation',
        component: 'blocks/actions/block.animation',
        position: 'modal-bottom-left',
    },
    customize: {
        title: 'Customizer', 
        size: 'sm',
        position: 'modal-top-right',
        component: 'blocks/editor/tailwind/tailwind.container'
    },
    edit_css : {
        title: 'Edit CSS/Style',
        size: 'md',
        position: 'modal-bottom-right mb-10',
        component: 'blocks/actions/block.css.vue'
    },
    block_add_element : {
        title: 'Add element',
        size: 'sm',
        position: 'modal-top-right',
        component: 'blocks/actions/block.elements.vue'
    },
    block_edit : {
        title: 'Edit',
        size: 'lg',
        position: 'modal-top-right',
        component: 'blocks/actions/block.multi.editing.vue'
    },
    block_save_as_reusable : {
        title: 'Save block as reusable',
        size: 'md',
        position: 'modal',
        component: 'blocks/actions/block.save.as.reusable.vue'
    },
    block_icon : {
        title: 'Edit Icon',
        size: 'sm',
        position: 'modal-top-right',
        component: 'blocks/actions/block.editing.content.vue'
    },
    block_attributes : {
        title: 'Attributes',
        size: 'lg',
        position: 'modal',
        component: 'blocks/actions/block.attributes.settings.vue'
    },
    block_gallery : {
        title: 'Blocks',
        size: 'md',
        position: 'modal-top-left',
        component: 'blocks/actions/block.gallery.selection.vue'
    },
    icon_selector : {
        title: 'Select Icon',
        size: 'sm',
        position: 'modal-top-right',
        component: 'blocks/actions/block.customize.icon'
    },
    block_menu : {
        title: 'Menu Edit',
        size: 'md',
        position: 'modal-top-left',
        component: 'blocks/actions/block.menu.style'
    },
    block_menu_item : {
        title: 'Menu Item Edit',
        size: 'lg',
        position: 'modal-top-right',
        component: 'blocks/actions/block.menu.item'
    },
    addreusable: {
        title: 'Add reusable block',
        size: 'md',
        position: 'modal-top-right',
        component: 'blocks/actions/block.reusable'
    },
    grids: {
        size: 'md',
        title: 'Grid Templates',
        position: 'modal',
        component: 'blocks/actions/block.grids.vue'
    },
    heading_selector :{
        title: 'Heading selector',
        size: 'sm',
        position: 'modal',
        component: 'blocks/actions/block.heading'
    },
    addplugin: {
        size: 'lg',
        position: 'modal',
        title: 'Add Plugin',
        component: 'blocks/actions/block.plugins',
    },
    media: {
        size: 'fullscreen',
        position: '',
        title: 'Media',
        component: 'media/media.vue'
    },
    tree: {
        size: 'sm', 
        title: 'Blocks Tree',
        component: 'blocks/actions/block.tree.draggable',
        position: 'modal-top-right'
    },
    slides_settings: {
        size: 'lg',
        position: 'modal',
        component: 'plugins/slides/slides.settings'
    },
    plugin_settings: {
        size: 'lg',
        position: 'modal',
        title: 'Plugin Settings',
        component: 'plugins/plugins.settings'
    },
    block_plugin_setting: {
        size: 'lg',
        position: 'modal-top-right',
        title: 'Plugin Settings',
        component: 'blocks/actions/block.plugin.setting'
    },
    block_plugin_schema: {
        size: 'lg',
        position: 'modal',
        title: 'Elements',
        component: 'blocks/actions/block.plugin.schema.vue'
    },
    block_link_data: {
        size: 'md',
        position: 'modal-top-right',
        title: 'Data Link',
        component: 'blocks/actions/block.data.link.vue'
    },
    seo: {
        size: 'md',
        position: 'modal',
        title: 'SEO',
        component: 'plugins/seo/index.settings.vue'
    },
    popupsettings : {
        size: 'md',
        position: 'modal',
        title: 'Popup settings',
        component: 'blocks/actions/block.popup.settings.vue'
    }
}

export default actions
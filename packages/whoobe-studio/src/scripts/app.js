
/**
 * Main menu
 * @label       => Menu title
 * @icon        => Icon
 * @component   => Component invoked
 * @filter      => Default filter (if applicable)
 * @items       => Submenu items
 * Submenus
 * same as Main menu 
 */

const menu = {
    items : [
        { label: 'Templates' , icon: 'grid_view' , components: 'blocks/blocks.vue' , path: 'blocks/blocks.vue' , filter: 'template'} ,
        { label: 'Blocks' , icon: 'widgets' , component: 'blocks/blocks.vue' , path: '' ,  filter: '' , 
            dataset : 'components_categories'
        },
        { label: 'CMS' , icon: 'article' , path: '', component: null , 
            items : [
                { label: 'Articles' , icon: 'article' , component: 'WhoobeArticles' , path:'articles/articles' , filter: 'article' },
                { label: 'Categories' , icon: 'category' , component: 'WhoobeCategories' , path: 'articles/articles.categories', filter: 'category' }
            ]
        },
        { label: 'Media' , icon: 'photo' , component: 'MokaMedia' , path: 'media/media' , filter: 'manager' },
        // { label: 'Shop' , icon: 'shopping_cart' , component: null , path: '' , filter: 'manager' ,
        //     items: [
        //         { label: 'Products' , icon: 'article' , component: 'MokaProducts' , filter: 'products' , path: 'plugins/store/whoobe/products/products.vue' },
        //         { label: 'Categories' , icon: 'category' , component: 'MokaCategory' , path: 'plugins/store/whoobe/products/products.categories.vue', filter: 'categories' },
        //         { label: 'Configuration' , icon: 'settings' , component: 'MokaShop' ,  filter: 'configure' },
        //     ]
        // }, 
        { label: 'Plugins' , icon: 'settings_input_component' , component: 'MokaPlugins' , path: 'plugins/plugins' , filter: 'plugins' }, 
        //{ label: 'Collections' , icon: 'dynamic_feed' , component: 'MokaPlugins' , path: 'plugins/collections/collection.vue' , filter: 'collections' }, 
        { label: 'Settings' , icon: 'settings' , component: 'MokaSettings' , path: 'settings/settings' , filter: '' },
        { label: 'Generate' , icon: 'dynamic_form' , component: 'WhoobeGenerator' , filter: 'generate' , path: 'settings/generator' },
        { label: 'Info' , icon: 'info' , component: 'WhoobeInfo' , filter: '' , path: 'settings/info' },
        //{ label: 'Share'  , icon: 'share' , component: 'MokaMarketing' , path: 'tools/social/moka.social.post' , filter: '' },
        
    
    ]
}

export default menu
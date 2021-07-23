const schema = {
    plugins: {
        "general" : {
            "name": "",
            "description": "",
            "path": "",
            "enabled": false,
            "editor": false,
            "global": false,
            "help": "",
            "author": "",
            "version": ""
        },
        "component": {
            "path": "",
            "config": {},
            "settings": {},
            "module": {
                "url": "",
                "css": "",
                "name": ""
            }
        },
        "editor":{}
    },
    products: {
        "_id": {
            type: "string",
            edit: false,
            list: false 
        },
        "name": {
            type: "string",
            edit: true,
            list: true
        },
        "excerpt": {
            type: "text",
            edit: true,
            list: false
        },
        "code": {
            type: "string",
            edit: true,
            list: true
        },
        "categories": {
            type: "array",
            edit: true,
            list: true
        },
        "variations": {
            type: "boolean",
            edit: false,
            list: true,
        },
        "price": {
            type: "currency",
            precision: 2,
            edit: true,
            list: true
        },
        "sale": {
            type: "currency",
            precision: 2,
            edit: true,
            list: true
        },
        "active": {
            type: "boolean",
            edit: true,
            list: true
        },
        "new": {
            type: "boolean",
            edit: true,
            list: false
        },
        "image_uri": {
            type: "image",
            edit: true,
            list: true
        },
        image: {
            type: "image",
            edit: true,
            list: true
        },
        seo_title: {
            type: 'string',
            edit: true,
            list: false
        },
        seo_description: {
            type: 'text',
            edit: true,
            list: false
        }
        
    },
    projects: {
        url: {
            type: 'string',
            list: true,
            edit: true,
            label: 'Whoobe CMS URL'
        },
        dist: {
            type: 'string',
            list: false,
            edit: false,
            label: 'Destination folder'
        },
        repo: {
            type: 'string',
            list: true,
            edit: true,
            label: 'Repo URL'
        },
        uploads: {
            type: 'boolean',
            list: true,
            edit: true,
            label: 'Copy assets to destination folder'
        },
        fonts: {
            type: 'array',
            list: true,
            edit: true,
            separator: '|',
            label: 'Used fonts'
        },
        mode: {
            type: 'select',
            options: ['website','landing'], 
            list: false,
            edit: true,
            label: 'Mode'
        },
        landing: {
            type: 'string',
            list: false,
            edit:true,
            label: 'Landing Page'
        }
    },
    articles: { 
        "_id": {
            "$id": "#root/_id", 
            "title": "_id", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : true,
            edit: false
        },
        "title": {
            "$id": "#root/title", 
            "title": "title", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            "list" : true,
            edit: true
        },
        "excerpt": {
            "$id": "#root/excerpt", 
            "title": "excerpt", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            "list" : false,
            edit: true
        },
        "content": {
            "$id": "#root/content", 
            "title": "content", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: true
        },
        "slug": {
            "$id": "#root/slug", 
            "title": "slug", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : true,
            edit: true
        },
        "homepage": {
            "$id": "#root/homepage", 
            "title": "homepage", 
            "type": "boolean",
            "default": true,
            list : true,
            edit: true
        },
        "store": {
            "$id": "#root/store", 
            "title": "store", 
            "type": "boolean",
            "default": false,
            list : true,
            edit: true
        },
        "random_image": {
            "$id": "#root/random_image", 
            "title": "random_image", 
            "type": "boolean",
            "default": true,
            list : false,
            edit: true
        },
        "list_exclude": {
            "$id": "#root/list_exclude", 
            "title": "list_exclude", 
            "type": "boolean",
            "default": true,
            list : false,
            edit: true
        },
        "parent": {
            "$id": "#root/parent", 
            "title": "parent", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "tags": {
            "$id": "#root/tags", 
            "title": "tags", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "image_title": {
            "$id": "#root/image_title", 
            "title": "image_title", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "component": {
            "$id": "#root/component", 
            "title": "component", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: true
        },
        "user": {
            "$id": "#root/user", 
            "title": "user", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "lang": {
            "$id": "#root/lang", 
            "title": "lang", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : true,
            edit: true
        },
        "template_id": {
            "$id": "#root/template_id", 
            "title": "template_id", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: true
        },
        "seo_title": {
            "$id": "#root/seo_title", 
            "title": "seo_title", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: true
        },
        "seo_description": {
            "$id": "#root/seo_description", 
            "title": "seo_description", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: true
        },
        "blocks": {
            "$id": "#root/blocks", 
            "title": "blocks", 
            "type": "object",
            "required": [
            ],
            "properties": {
            },
            list : false,
            edit: true
        },
        "featured_img": {
            "$id": "#root/featured_img", 
            "title": "featured_img", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "image": {
            "$id": "#root/image", 
            "title": "image", 
            "type": "null",
            "default": null,
            list : false,
            edit: true
        },
        "gallery": {
            "$id": "#root/gallery", 
            "title": "gallery", 
            "type": "array",
            "default": [],
            list : false,
            edit: true
        },
        "categories": {
            "$id": "#root/categories", 
            "title": "categories", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : true,
            edit: true
        },
        
        "publish": {
            "$id": "#root/publish", 
            "title": "publish", 
            "type": "boolean",
            "default": true,
            "pattern": "^.*$",
            list : true,
            edit: true
        },
        "createdAt": {
            "$id": "#root/createdAt", 
            "title": "createdAt", 
            "type": "string",
            "default": "",
            "pattern": "^.*$",
            list : false,
            edit: false
        },
        "updatedAt": {
            "$id": "#root/updatedAt", 
            "title": "updatedAt", 
            "type": "date",
            "default": "",
            "pattern": "^.*$",
            list : true,
            edit: false
        },
        template_preview:{
            type: 'image',
            title: 'template_preview',
            default: '',
            list : true,
            edit: true
        }
    },
    snipcart_add_to_cart: {
        'data-item-id' : {
            type: 'attribute',
            title: 'Item id',
            required: true,
            default: ''
        },
        "data-item-price" : {
            type: 'attribute',
            title: 'Item price',
            required: true,
            default : ''
        },
        "data-item-url" : {
            type: 'attribute',
            title: 'Item URL',
            required: true,
            default: '/store/product/',
        },
        "data-item-description":{
            type: 'attribute',
            title: 'Item description',
            required: true,
            default: ''
        },
        "data-item-image": {
            type: 'attribute',
            title: 'Item image url',
            required: true,
            default: ''
        },
        "data-item-name" : {
            type: 'attribute',
            title: 'Item name',
            required: true,
            default: ''
        }
    }
}

export default schema
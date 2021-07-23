const model = {
    "_id": {
        type : "id",
        edit: false,
        list: false,
        import: true
    },
    "name": {
        type: "string",
        group: 'general',
        edit: true,
        list: true,
        import: true
    },
    "slug":{
        type: "string",
        group: 'general',
        edit: true,
        list: false
    },
    "description":{
        type: "text" ,
        group: 'general',
        edit: true,
        list: false,
        import: true
    },
    "assets":{
        type: "image_uri",
        group: 'general',
        edit: true,
        list: true,
        import: true
    },
    "category" :{
        type: "select",
        group: 'category',
        edit: true,
        list: true,
        import: true
    },
    "facets":{
        type: "select", //"category:Sports & Outdoor|category:Equipment|brand:Wilson"
        separator: '|',
        group: 'category',
        edit: true,
        list: true,
        import: false
    },
    "optionGroups":{
        type: "array",
        edit: false,
        list: false,
        import: false
    },
    "optionValues":{
        type: "list",
        separator: "|",
        edit: false,
        list: false,
        import: false
    },
    "sku":{
        type: "string",
        group: 'general',
        list: true,
        edit: false,
        import: true
    },
    "parent": {
        type: "string",
        list: false,
        edit: false,
        import: false
    },
    "upsell":{
        type: "array",
        group: "related",
        list: false,
        edit: true,
        import: false,
        data: 'products'
    },
    
    "price": {
        type: "currency",
        group: 'price',
        edit: false,
        list: true,
        import: true
    },
    "sale": {
        type: "currency",
        group: 'price',
        edit: false,
        list: true,
        import: true
    },
    "price_value": {
        type: "number",
        edit: false,
        list: true,
        import: false
    },
    "taxCategory":{
        type: "string",
        group: 'price',
        edit: false,
        list: false,
        import: false
    },
    "stockOnHand": {
        type: "number",
        group: 'stock',
        edit: false,
        list: false,
        import: false
    },
    "trackInventory":{
        type: "boolean",
        group: 'stock',
        edit: false,
        list: false,
        import: false
    },
    "variantAssets":{
        type: "array",
        edit: false,
        list: false,
        import: false
    },
    "type": {
        type: "array",
        edit: false,
        list: false,
        import: false
    },
    "image":{
        type: 'image',
        edit: false,
        list: false,
        import: false
    },
    seo_title:{
        type: 'string',
        group: 'seo',
        edit: true,
        list: false,
        import: true
    },
    seo_description:{
        type: 'text',
        group: 'seo',
        edit: true,
        list: false,
        import: true
    },

}
// {
//     "_id": {
//         type: "string",
//         edit: false,
//         list: false 
//     },
//     "name": {
//         type: "string",
//         edit: true,
//         list: true
//     },
//     "excerpt": {
//         type: "text",
//         edit: true,
//         list: false
//     },
//     "code": {
//         type: "string",
//         edit: true,
//         list: true
//     },
//     "categories": {
//         type: "array",
//         edit: true,
//         list: true
//     },
//     "variations": {
//         type: "boolean",
//         edit: false,
//         list: true,
//     },
//     "price": {
//         type: "currency",
//         precision: 2,
//         edit: true,
//         list: true
//     },
//     "sale": {
//         type: "currency",
//         precision: 2,
//         edit: true,
//         list: true
//     },
//     "active": {
//         type: "boolean",
//         edit: true,
//         list: true
//     },
//     "new": {
//         type: "boolean",
//         edit: true,
//         list: false
//     },
//     "image_uri": {
//         type: "image",
//         edit: true,
//         list: true
//     },
//     image: {
//         type: "image",
//         edit: true,
//         list: true
//     }
    
// }

export default model
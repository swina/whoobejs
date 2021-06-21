const model = {
    "_id": {
        type : "id",
        edit: false,
        list: false
    },
    "name": {
        type: "string",
        edit: true,
        list: true
    },
    "slug":{
        type: "string",
        edit: true,
        list: false
    },
    "description":{
        type: "text" ,
        edit: true,
        list: false
    },
    "assets":{
        type: "image_uri",
        edit: true,
        list: true
    },
    "category" :{
        type: "select",
        edit: true,
        list: true
    },
    "facets":{
        type: "select", //"category:Sports & Outdoor|category:Equipment|brand:Wilson"
        separator: '|',
        edit: true,
        list: true
    },
    "optionGroups":{
        type: "array",
        edit: false,
        list: false
    },
    "optionValues":{
        type: "list",
        separator: "|",
        edit: false,
        list: false
    },
    "sku":{
        type: "string",
        list: true,
        edit: false
    },
    "parent": {
        type: "string",
        list: false,
        edit: false
    },
    "price": {
        type: "currency",
        edit: false,
        list: true
    },
    "taxCategory":{
        type: "string",
        edit: true,
        list: false
    },
    "stockOnHand": {
        type: "number",
        edit: false,
        list: false
    },
    "trackInventory":{
        type: "boolean",
        edit: false,
        list: false
    },
    "variantAssets":{
        type: "array",
        edit: false,
        list: false
    },
    "type": {
        type: "array",
        edit: false,
        list: false
    },
    "image":{
        type: 'image',
        edit: false,
        list: false
    }

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
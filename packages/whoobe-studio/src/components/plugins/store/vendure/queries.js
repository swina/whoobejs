const queries = {
    products : "\
            items {\
                id \
                name \
                description \
                facetValues { \
                    code \
                    name \
                } \
                variants { \
                    name \
                    price\
                    currencyCode\
                }\
                assets { \
                    name \
                    source \
                } \
            }",

    collections:  "query Collections { collections ( options:{ sort :{ id : ASC } }) { items { name parent { name } children { name id productVariants { items { id name assets { name source } price } } } }}}",

    collection: "query Collections { collections(options :{ filter :{ name : { contains : __filter__ }}}) {items {name productVariants { totalItems items { product { id name assets { name source } description id variants { name price currencyCode } facetValues { name code } }}}}}}"
    
}

export default queries
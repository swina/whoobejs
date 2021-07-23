<template>
    <div v-if="current" slot="content" :class="settings.single.css + ' ' + settings.single.container + ' overflow-y-auto'">
        <div v-for="n in settings.single.cols">    

            <template v-for="field in settings.single.fields">
                <span v-if="schema[field.name] && parseInt(field.col)===(n-1)">
                    <div :class="field.css" v-if="schema[field.name].type==='text' || schema[field.name].type === 'string'">
                        <span v-if="field.name!='sku'">{{ current[field.name] }}</span>
                        <span v-else>SKU {{ !currentVariation ? current[field.name] : currentVariation.sku }}</span>
                    </div>
                    <div :class="field.css" v-if="schema[field.name].type==='list' && field.name != 'optionValues'">
                        {{ current[field.name].split ( schema[field.name].separator ).join('-') }}
                    </div>
                    <div v-if="field.name === 'optionValues'" class="flex flex-col">
                        
                        <div class="relative flex flex-col md:flex-row" v-if="productVariations && productVariations.length">
                            <div :class="variationSelected(current.optionValues,field.css)" @click="currentPrice=current.price,currentOption=current.optionValues,currentVariation=null">{{ current[field.name] }}</div>
                            <div v-for="variation in productVariations" :class="variationSelected(variation.optionValues,field.css)" @click="currentPrice = variation.price,currentOption=variation.optionValues,currentVariation=variation">
                                {{ variation.optionValues }}
                            </div>
                        </div>

                    </div>
                    <div :class="field.css" v-if="schema[field.name].type==='currency'">
                        <small class="mr-1">{{ settings.general.currency }}</small>
                        <span>{{ parseFloat(currentPrice).toFixed(2) }}</span>
                    </div>
                    <div :class="field.css" v-if="field.name==='category'">
                        {{ current[field.name] }}
                    </div>
                    <div :class="field.css" v-if="field.name==='facets'">
                        {{ current[field.name].join(' - ') }}
                    </div>
                    <div v-if="schema[field.name].type==='image_uri'" class="flex flex-col"> 
                        <img :src="productImage(current[field.name])" :class="field.css">
                        <div class="flex flex-row flex-wrap">
                            <template v-for="(asset,i) in current.assets" v-if="Array.isArray(current.assets)">
                                <img :src="$imageURL(asset)" class="w-16 h-16 border object-cover mt-1 mb-1 mr-1" :title="asset" @click="currentImageIndex=i"/>
                            </template>
                        </div>
                    </div>
                </span>
                
                <div class="flex flex-row items-center" v-if="parseInt(field.col)===(n-1) && field.name === 'add_to_cart'">
                    <div class="flex items-center rounded border mr-2 text-lg cursor-pointer">
                        <div class="bg-transparent w-8 h-10 flex items-center justify-center border-r" @click="qty>1?qty--:null">-</div>
                        <input class="text-lg bg-transparent text-center w-20 h-10" type="text" readonly v-model="qty"/>
                        <div class="bg-transparent w-8 h-10 flex items-center justify-center border-l" @click="qty++">+</div>
                    </div>
                    <button 
                        :key="field.name"
                        :class="field.css"
                        :data-item-quantity="qty"
                        :data-item-id="current._id"
                        :data-item-image="productImage(current.assets)"
                        :data-item-price="currentPrice"
                        :data-item-name="current.name + ' ' + currentOption"
                        :data-item-description="currentOption"
                        :data-item-url="'/store/product/' + current._id"> 
                    Add to cart</button>
                </div>
            </template>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreSingle',
    data:()=>({
        current: null,
        settings: null,
        productVariations: null,
        currentPrice:null,
        currentOption: null,
        currentVariation: null,
        currentImageIndex:0
    }),
    mounted(){
        this.current = JSON.parse(window.localStorage.getItem ( 'whoobe-store-single'))
        this.settings = this.current.settings
        this.$api.service ( 'products' ).find ( { query : { 
            type: 'variation' , 
            parent: this.current.sku , 
            $sort : {  price: 1 , optionValues: 1 } 
        }}).then ( res => {
            this.productVariations = res.data
        })
    },
}
</script>
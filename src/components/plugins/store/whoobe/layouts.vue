<template>
    <div>
        <div v-if="parseInt(layout)===1" class="flex flex-col">
            <div slot="0"></div>
        </div> 
        
        <div v-if="parseInt(layout)===2" class="flex flex-col">
            <div class="grid grid-cols-1 md:grid-cols-2">
                <slot name="slot_0" class="flex flex-col"></slot>
                <slot name="slot_1" class="flex flex-col"></slot>
                
            </div>
            <div class="flex flex-col w-full">
                <slot name="slot_2"></slot>
            </div>
        </div>

        <div v-if="parseInt(layout)===3" class="flex flex-col">
            <div class="flex flex-col w-full">
                <slot name="slot_0"></slot>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2">
                <slot name="slot_1"></slot>
                <slot name="slot_2"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import model from './model'
export default {
    name: 'WhoobeStoreLayouts',
    props: [ 'layout' ]
}
</script>
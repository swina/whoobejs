<template>
    <div class="grid grid-cols-3" v-if="base">
        <div class="flex flex-col">
            Type : 
            <select class="w-1/2" v-model="wobject.type">
                <option v-for="type in base.types" :value="type">{{ type }}</option>
            </select>
            Element : 
            <select class="w-1/2" v-model="wobject.element">
                <option v-for="element in base.elements" :value="element">{{ element }}</option>
            </select>
            Component : 
            <select class="w-1/2" v-model="wobject.component">
                <option v-for="component in base.components" :value="component">{{ component }}</option>
            </select>
        </div>
        <div class="col-span-2 flex flex-col">
            <template v-for="attribute in Object.keys(base.attributes)">
                    <div class="grid grid-cols-2">
                        <div>{{ attribute }}</div>
                        <input type="text" v-if="typeof base.attributes[attribute] ==='string' && attribute != 'component' && attribute!='type' && attribute!='element'"/>
                        <input type="text" readonly v-if="attribute === 'component' || attribute==='type' || attribute==='element'" class="font-bold" :value="wobject[attribute]"/>
                        <div v-if="typeof base.attributes[attribute]==='object'">dynamic</div>
                    </div>
            </template>
        </div>
    </div>

</template>
<script>
import base from '@/assets/base.js'
export default {
    name: 'BlockObject',
    data:()=>({
        base: null,
        wobject: {
            type: '',
            element: '',
            component: '',
            attributes: null
        }
    }),
    mounted(){
        console.log ( base )
        this.base = base
    }
}
</script>
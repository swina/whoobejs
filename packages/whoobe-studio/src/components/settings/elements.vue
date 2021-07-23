<template>
    <div>
        <template v-for="category in $datastore('elements').moka.keys">
            <div class="bg-gray-300 capitalize p-1 flex flex-row items-center my-1 cursor-pointer relative" @click="isCategory=category">{{ category }} 
                <!--<button class="absolute right-0 mr-2">Add</button>-->
            </div>
            <template v-for="element in $datastore('elements').moka[category]">
                <div class="p-1 border-b text-sm relative" v-if="isCategory===category">
                    <span  @click="isElement!=element.label?isElement=element.label:isElement=''" class="flex flex-row items-center cursor-pointer">
                        <i class="material-icons mr-2">{{ element.icon }}</i> {{ element.label }} 
                        <i class="material-icons absolute right-0" v-if="isElement!=element.label" @click="isElement=element.label">expand_more</i>
                        <i class="material-icons absolute right-0" v-if="isElement===element.label" @click="isElement=''">expand_less</i>
                        <br/>
                    </span>
                    <transition name="fade">
                    <div v-if="isElement===element.label" class="text-sm mx-4 p-2 bg-gray-300 rounded">
                        
                        {<br/>
                            <template v-for="key in Object.keys(element).sort()">
                                <span class="ml-8">{{ key }} : 
                                    <span v-if="typeof element[key]!='object'">"{{ element[key] }}"</span>
                                    <span v-else>{{ element[key] }}</span>
                                </span><br/>
                            </template>
                        }
                        
                    </div>
                    </transition>
                </div>
            </template>

        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'MokaBlocksElements',
    data:()=>({
        isCategory: null,
        isElement : null
    }),
    computed:{
        ...mapState (['moka'])
    }
}
</script>
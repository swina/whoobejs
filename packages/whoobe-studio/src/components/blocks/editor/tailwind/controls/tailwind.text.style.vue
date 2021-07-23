<template>
    <div>
        Font
        <div class="flex flex-col my-1">
            <div class="flex flex-row flex-wrap mb-1 text-black">
                <icon name="format_bold" @click="setFont('font-bold')" class="mr-2"/>
                <icon name="format_italic" @click="setFont('italic')" class="mr-2"/>
                <icon name="format_underline" @click="setFont('underline')" class="mr-2"/>
                <!-- <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('font-bold')" @click="setFont('font-bold')" title="bold">format_bold</i>
                <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('italic')" @click="setFont('italic')" title="italic">format_italic</i>
                <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('underline')" @click="setFont('underline')" title="underline">format_underlined</i>
                <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('font-black')" @click="setFont('font-black')" title="font black">title</i> -->
            </div>
            <div class="flex flex-row flex-wrap mb-1">
                <!-- <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('uppercase')" @click="setFont('uppercase')" title="uppercase">arrow_upward</i>
                <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('lowercase')" @click="setFont('lowercase')" title="lowercase">arrow_downward</i>
                <i :class="'material-icons nuxpresso-icon-btn text-black mr-2 ' + getFont('capitalize')" @click="setFont('capitalize')" title="capitalize">text_fields</i> -->
                <!--<i class="material-icons nuxpresso-icon-btn text-black mr-2" @click="font.bold='',font.italic='',font.black='',font.underline='',font.transform=''" title="Reset">undo</i>-->
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'MokaTailwindTextStyle',
    data:()=>({
        model: '',
        font: {
            'font-bold' : false ,
            'italic' : false ,
            'underline' : false ,
            'font-black' : false ,
            'uppercase': false,
            'lowercase':false,
            'capitalize':false
        },        
        options: [
            'font-bold',
            'italic',
            'underline',
            'font-black',
            'uppercase',
            'lowercase',
            'capitalize'
        ]
    }),
    computed:{
        fonts(){
            this.model = ''
            this.options.forEach(ft=>{
                if ( this.font[ft] ) this.model += ft + ' '
            })
            return this.font
        }
    },
    
    props: ['css'],
    watch:{
        model(v){
            this.$emit('input',v)
            this.$emit('css',v)
        }
    },
    methods: {
        getFont(what){
            return this.font[what] ? 'bg-blue-500': ''
        },
        setFont(what){
            this.font[what] =! this.font[what]
            
        }
    },
    mounted(){
        if ( !this.css ) return 
        let classes = this.css.split(' ')
        classes.forEach ( cl => {
            this.options.forEach ( (op,index) => {
                if ( cl.indexOf ( op ) > -1 ){
                    this.model += cl + ' '
                    this.font[cl] = true
                    this.$emit('input',this.model)
                    this.$emit('css',cl)
                }
            })
        })
    }
}
</script>
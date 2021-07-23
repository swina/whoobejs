<template>
    <div class="flex flex-col">
        Element position 
        <select class="dark"  v-model="epos.position">
            <option value=""></option>
            <option v-for="opt in options" :value="opt">{{opt}}</option>
        </select>
        <div class="flex flex-row mt-1">
            <div v-for="p in pos">
                {{p.label}} <input type="checkbox" v-model="p.value"/>
            </div>
        </div>
        <div class="mt-1">
            Modal <input type="checkbox" v-model="center"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MokaTailwindElementPosition',
    data:()=>({
        epos: { 
            position: '',
            top:'',
            left:'',
            right:'',
            bottom:''
        }, 
        center: false,
        centerscreen: 'nuxpresso-modal',
        options : [ 'static' , 'fixed' , 'absolute' , 'relative' ],
        pos: [ 
            { label: 'top' , value: false, attr: 'top-0' },
            { label: 'left' , value: false , attr: 'left-0' },
            { label: 'right' , value: false , attr: 'right-0' },
            { label: 'bottom' , value: false , attr: 'bottom-0' }
        ]
    }),
    props:['css'],
    watch:{
        epos:{
            handler(old,data){
                this.update(data)
            },
            deep: true
        },
        pos: {
            handler(old,data){
                this.update(data)
            },
            deep: true
        },
        center(v){
            this.update()
        }
    },
    methods:{
        update(){
            let classe = this.epos.position
            this.pos.forEach ( p => {
                if ( p.value ){
                    classe += ' ' + p.attr
                }
            })
            this.center ? classe += ' ' + this.centerscreen : null
            this.$emit ( 'input' , classe )
            this.$emit ( 'css' , classe )
        }
    },
    mounted(){
        if ( !this.css ) return
        let classi = this.css.split(' ')
        this.model = ''
        classi.forEach ( cl => {
            if ( cl.indexOf ( this.centerscreen ) > -1 ){
                this.center = true
            }
            this.options.forEach ( op => {
                if ( cl.indexOf( op ) > -1 ){
                    this.epos.position = cl
                    console.log ( this.epos , op )
                }
            })
            this.pos.forEach ( (p,index) => {
                if ( cl.indexOf(p.attr) > -1 ){
                    this.epos[p.label] = p.attr
                    this.pos[index].value = true
                }
            })
        })
        this.update()
    }
}
</script>
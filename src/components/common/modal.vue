<template>
    <div>
        <div v-if="$attrs.exclusive" class="fixed top-0 left-0 bg-gray-800 bg-opacity-75 z-1 h-screen w-screen"></div>
        <div ref="draggableContainer" id="draggable-container" class="z-highest max-h-screen max-w-screen shadow-lg text-sm overflow-hidden border border-gray-700" :class="size + height + position + color"  style="resize:both;">
            
            <div class="absolute z-highest top-0 right-0 h-8 px-2 flex flex-row items-center text-gray-400 text-xls" >
                <i class="material-icons" @click="$emit('close')">close</i>
            </div>
            <div id="z-2 draggable-header"  class="cursor-move w-full bg-gray-900 text-white  px-2 py-1"  @mousedown="dragMouseDown">
                <slot name="title"></slot>
            </div>
                
            <div class="z-highest text-sm h-full">
                <slot name="content"></slot>
                <slot name="footer"></slot>
            </div>
            
            <div class="z-highest px-4 p-1">
                <slot name="confirm">{{ confirmMsg }}</slot>
            </div>
            
            <div v-if="buttons != 'none'" class="z-highest w-full p-4 items-center justify-center p-2 grid" :class="'grid-cols-' + btns[buttons].length + color">
                <template v-for="(button,i) in btns[buttons]">
                    <button :class="button.class + ' m-auto'" @click="action(i)">
                        {{ button.label }}
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: { 
        close : {
            type: Boolean,
            default: true
        },
        buttons: {
            type: String,
            default: 'standard'
        }
    },
    data:()=>({
        btns: {
            none :[],
            close: [
                { label: 'Close' , class: 'bg-gray-600 round' }
            ],
            standard : [
                { label: 'Close' , class: 'danger  round' },
                {label:'OK',class:'success  round'}
            ],
            saveonly: [
                { label: 'Save' , class: 'success round' }
            ],
            save : [
                 { label: 'Close' , class: 'bg-gray-600 round' },
                { label: 'Save' , class: 'success round' },
            ],
            delete : [
                { label: 'Close' , class: 'bg-gray-600 round' },
                { label: 'Delete' , class: 'danger round' },
            ]
        },
        fullscreen: false,
        confirmMsg: '',
        positions: {
            clientX: undefined,
            clientY: undefined,
            movementX: 0,
            movementY: 0
        }
    }),
    computed:{
        size(){
                return !this.$attrs.size ?
                        'w-full md:w-1/3 lg:w-1/4' :
                            this.$attrs.size === 'md' ?
                                'w-full md:w-1/2 lg:w-1/3' :
                                    this.$attrs.size === 'sm' ? 
                                        'w-full md:w-1/4 lg:w-1/5' :
                                            this.$attrs.size === 'lg' ? 
                                                'w-full md:w-3/4 lg:w-2/3' : 
                                                    this.$attrs.size === 'full' || this.$attrs.size === 'fullscreen' ? 
                                                        'fixed w-screen h-screen top-0 left-0' :
                                                            'w-full md:w-1/3 lg:w-1/3'
        },
        height(){
            return this.$attrs.height ?
                    ' h-' + this.$attrs.height : ''
        },
        position(){
           return this.$attrs.position ? ' ' + this.$attrs.position : ''
        },
        color(){
            return this.$attrs.color ? ' ' + this.$attrs.color : ' bg-gray-800 text-gray-300'
        },
        confirm(){
            return this.$attrs.confirm ? true : false
        }
    },
    methods:{
       
        action ( index ){
            if ( !this.confirm ){
                this.$emit('click_' + index )
            } else {
                console.log ( this.confirmMsg.length )
                if ( !this.confirmMsg.length ){
                    this.confirmMsg = this.$attrs.confirm 
                } else {
                    this.$emit ( 'click_' + index ) 
                }
                        
            }
        },

    dragMouseDown: function (event) {
        //if ( this.$attrs.modal.hasOwnProperty('fixed') ) return
        //if ( this.$attrs.size && this.$attrs.size === 'full' ) return 
        event.preventDefault()
        // get the mouse cursor position at startup:
        this.positions.clientX = event.clientX
        this.positions.clientY = event.clientY + window.pageYOffset
        document.onmousemove = this.elementDrag
        document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      //if ( this.position.indexOf('fixed') < 0 ){
        if ( !this.$attrs.position  ){
            this.$refs.draggableContainer.style.top = (window.pageYOffset + this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
        } else {
            //this.$refs.draggableContainer.style.top = '0px'
        }
        this.$refs.draggableContainer.style.left =  (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
        
      //}
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    }
    },
    mounted(){
        /*
       if ( !this.$attrs.fixed ) {
           document.addEventListener ( 'scroll' , () => {
               console.log ( 'scroll control')
               if ( document.getElementById('draggable-container') )
                   document.getElementById('draggable-container').style.top = window.pageYOffset + 'px'
           })
           if ( document.getElementById('draggable-container') )
           console.log ( 'reposition element')
                   document.getElementById('draggable-container').style.top = window.pageYOffset + 'px'
       }
       */
    }
}
</script>
<template>
    <div class="w-full relative flex flex-col items-start justify-start">
        <div class='range-slider h-12 w-full'>
            <input type="range" :min="$attrs.min" :max="$attrs.max" step="1" v-model="sliderMin">
            <input class="rounded py-2 mx-2 text-sm" type="number" :min="$attrs.min" :max="$attrs.max" step="1" v-model="sliderMin">
            <input type="range" :min="$attrs.min" :max="$attrs.max" step="1" v-model="sliderMax">
            <input class="rounded py-2 mx-2 text-sm" type="number" :min="$attrs.min" :max="$attrs.max" step="1" v-model="sliderMax">
        </div>
        <button class="rounded m-auto mt-6" @click="$emit('range',sliderMin,sliderMax)">Filter</button>
    </div>
</template>

<script>
export default {
    name: 'WhoobeDoubleRange',
    data:()=>( {
        minAngle: 10,
        maxAngle: 30
    }),
    computed: {
        sliderMin: {
            get: function() {
                var val = parseInt(this.minAngle);
                return val;
            },
            set: function(val) {
                val = parseInt(val);
                if (val > this.maxAngle) {
                this.maxAngle = val;
                }
                this.minAngle = val;
            }
        },
        sliderMax: {
            get: function() {
                var val = parseInt(this.maxAngle);
                return val;
            },
            set: function(val) {
                val = parseInt(val);
                if (val < this.minAngle) {
                this.minAngle = val;
                }
                this.maxAngle = val;
            }
        }
    },
    // watch:{
    //     sliderMin(v){
    //         this.$emit ( 'range' , v , this.sliderMax )
    //     },
    //     sliderMax(v){
    //         this.$emit ( 'range' , this.sliderMin , v )
    //     }
    // },
    mounted(){
        this.minAngle = this.$attrs.min
        this.maxAngle = this.$attrs.max
    }
}
</script>
<style scoped>
.range-slider {
  margin: auto;
  text-align: center;
  position: relative;
}

.range-slider input[type=range] {
  position: absolute;
  left: 0;
  bottom: 0;
}

.range-slider > input[type=number] {
  border: 1px solid #ddd;
  text-align: center;
  -moz-appearance: textfield;
}

.range-slider > input[type=number]::-webkit-outer-spin-button,
.range-slider > input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.range-slider > input[type=number]:invalid,
.range-slider > input[type=number]:out-of-range {
  border: 2px solid #ff6347;
  
}

.range-slider > input[type=range] {
  -webkit-appearance: none;
  width: 100%;
}

.range-slider > input[type=range]:focus {
  outline: none;
}

.range-slider > input[type=range]:focus::-webkit-slider-runnable-track {
  background: #6a6d6e;
}

.range-slider > input[type=range]:focus::-ms-fill-lower {
  background: #6a6d6e;
}

.range-slider > input[type=range]:focus::-ms-fill-upper {
  background: #6a6d6e;
}

.range-slider > input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  animate: 0.2s;
  background: #6a6d6e;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}

.range-slider >  input[type=range]::-webkit-slider-thumb {
  z-index: 2;
  position: relative;
  box-shadow: 0px 0px 0px #000;
  border: 1px solid #6a6d6e;
  height: 18px;
  width: 18px;
  border-radius: 25px;
  background: #fff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -7px;
}

</style>
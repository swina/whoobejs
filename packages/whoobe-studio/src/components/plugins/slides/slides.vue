<template>


    <div v-if="doc && slides" class="content-slider relative overflow-x-hidden flex flex-row flex-no-wrap block h-full" :ref="doc.id">
        <div class="flex flex-row flex-no-wrap relative w-full block" :class="'slider_' + doc.id">

          <template v-for="slide in slides">
            
                  <slides-container 
                      class="slide flex-none top-0 left-0 right-0 bottom-0 w-full h-full"
                      :doc="slide" 
                      :key="slide.id"/>
          </template>
        </div>
        <div v-if="doc.controls.dots.enable" class="md:absolute h-10 z-highest bottom-0 left-0 text-center flex-row justify-center items-center p-1 w-full">
          <i :class="'material-icons mr-2 ' + dotActive(n)" :key="'dot-' + doc.id + n" v-for="n in doc.blocks.length" @click="goTo(n-1)">fiber_manual_record</i>
        </div>

        <div v-if="doc.controls.navigation.enable">
          <div :class="'absolute top-0 left-0 h-full flex justify-center p-1 ' + over + position" @click="goTo(index-1)" v-if="index > 0">
            <i :class="'slider-navigation-icon material-icons text-4xl ' + doc.controls.navigation.css">{{ doc.controls.navigation.icons[0]}}</i>
          </div>
          <div :class="'absolute top-0 right-0 h-full flex justify-center p-1 ' + over + position " @click="goTo(index+1)" v-if="index < doc.blocks.length-1">
            <i :class="'slider-navigation-icon material-icons text-4xl ' + doc.controls.navigation.css">{{ doc.controls.navigation.icons[1]}}</i>
          </div>
        </div>
        <div v-if="doc.controls.buttons" :class="'slider-buttons absolute left-0 text-center hidden md:flex md:flex-row border-b justify-left items-center my-2 w-full ' + doc.controls.buttons_position">
          <template v-for="(slide,n) in doc.blocks">
            <button :key="'btn_' + doc.id + n" :class="'mx-0 capitalize '  + buttonsClass" @click="goTo(n)">{{ slide.name || 'slide' + (n+1) }}</button>
          </template>
        </div>
    </div>
    

</template>

<script>
import { mapState } from 'vuex'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger];
import  AlloyFinger from 'alloyfinger'
import jp from 'jsonpath'
export default {
    name: 'BlockSlides',
    data:()=>({
        doc: null,
        index: 0,
        timer: null,
        current: null,
        slidesContainer: null,
        slidesBlocks: null,
        slides:null
    }),
    components: { 
      'slides-container' : () => import ( './slides.container' )
    },
    computed:{
        ...mapState(['editor']),
        animations(){
            return gsapEffects
        },
        over(){
          return this.doc.controls.navigation.hover ? 'opacity-0 hover:opacity-100' : ''
        },
        position(){
            return this.doc.controls.navigation.hasOwnProperty('position') && this.doc.controls.navigation.position ?
                      ' ' + this.doc.controls.navigation.position : ' items-center'
        },
        buttonsClass(){
          let css = this.doc.controls.buttons_css ? ' ' + this.doc.controls.buttons_css : ''
          css += this.doc.controls.buttons_text ? ' ' + this.doc.controls.buttons_text : ''
          return css
        }
    },

    methods:{
        setCounter(n){
            this.doc.counter = n
        },
        setLeftPosition(n,id){
            if ( n === this.index ){
                return 'left:0;' //this.$refs[id].style.left = 0
            } else {
                return 'width:0;left:-2000px;'
            }

        },
        setSlide(n,id){
           
            if ( (n+1) < this.slidesBlocks.length  ){
                this.index++
            } else {
                this.index = 0
            }
            this.goTo()
        },
        dotActive(n){
          let css = this.doc.controls.dots.css ? this.doc.controls.dots.css : 'text-black'
          return (n) === this.index ? css + ' animate-ping' : css + ' rounded-full'
        },

        goTo(n,id){
            let tl = gsap.timeline()
            if ( n < 0 ) return 
            if ( n > this.doc.blocks.length -1 ) return
            this.index = n
            if ( document.querySelector('.slider_' + this.doc.id ) ){
              console.table ( document.querySelector('.slider_' + this.doc.id).getBoundingClientRect() )
              let slide = document.querySelector('.slider_' + this.doc.id )
              tl.to ( slide , { opacity:.6 , duration: .4 } ),
              tl.to ( slide , { xPercent: -this.index*100 , opacity:.8 , duration: 1 } ),
              tl.to ( slide , { opacity:1 , duration: .5 })
              this.index++
            }
            

        },
        playslides ( sec ){

            console.log ( 'playing each ' + sec + ' secs' )
            let vm = this
            this.goTo(1)
            this.timer = window.setInterval( function(){
                //vm.next(1)
                vm.index < vm.doc.blocks.length ?
                  null : vm.index = 0
                vm.goTo(vm.index)
            },parseInt(sec)*1000)
            
        },
        hasSlideAction(action){
            action === 'slider_next' ? 
                    this.next(1) : 
                        action === 'slider_prev' ? this.next(-1)
                             : null
        },
        next(n){
            this.index < (this.doc.blocks.length + n) ? this.index += n : this.index = 0
            this.index < 0 ? this.index = 0 : null
            this.index >= this.doc.blocks.length ? this.index = 0 : null
            //this.current = this.doc.blocks[this.index].id
            let tl = gsap.timeline()
            if ( document.querySelector('.slider_' + this.doc.id ) ){
              console.table ( document.querySelector('.slider_' + this.doc.id).getBoundingClientRect() )
              let slide = document.querySelector('.slider_' + this.doc.id )
              this.index === 0 && this.doc.controls.delay ?
                tl.to ( slide , { xPercent: 50 , opacity:1 , duration: 0 } ) : null
              
              tl.to ( slide , { xPercent: -this.index*100 , opacity:1 , duration: 1.5 } )
              this.index === (this.doc.blocks.length -1) && this.doc.controls.delay ?
                tl.to ( slide , { xPercent: -this.index*100 , opacity:1 , duration:.3 } ) : null
            }
        },
        classe(css){
          if ( !css ) return
          return css.hasOwnProperty('css') ? css.css + ' ' + css.container : css
        },
        stile(block,doc){
            if ( !block || !doc ) return 
            let stile = ''
            if ( block.hasOwnProperty('fontFamily')){
                stile += 'font-family:\"' + block.fontFamily + '\"; '
            }
            return block.hasOwnProperty('style') ? block.style + stile : stile
        },
        background(block){
            if ( !block ) return 
            return block.hasOwnProperty('image') && block.image ?
              block.image.url ?
                ' background-image:url(' + this.$imageURL(block.image) + ');' : '' : ''
                /*
                block.image && block.image.url ? 
                    block.image.previewUrl ? 
                        ' background-image:url(' + block.image.previewUrl + ');background-size:cover;background-repeat:no-repeat;' :
                            ' background-image:url(' + block.image.url + ');' : ''  : ''        
                */
        },
        animate(element,id){
            if ( !element ) return 
            let vm = this
            if ( this.$refs && element.hasOwnProperty('gsap') && element.gsap.animation ){
                let ani = gsap.effects[element.gsap.animation]( this.$refs[id] ,{
                    trigger: this.$refs[id],
                    duration: parseFloat(element.gsap.duration),
                    delay: parseFloat(element.gsap.delay),
                    ease: element.gsap.ease
                })
                ScrollTrigger.create({
                    id: id,
                    start: "top 99%",
                    trigger: this.$refs[id],
                    toggleActions: "play pause restart none",
                    animation:ani,
                    onEnter: ()=>{ 
                        if ( element.gsap.delay ){
                            ani.play()
                        } else {
                            ani.play(0)
                        }
                    },
                    
                });
                    
        }
            }
        

    },
    mounted(){
        this.doc = this.$attrs.doc
        this.doc.id = this.$randomID()
        this.slides = this.doc.blocks
        if ( parseInt(this.doc.controls.delay) > 0 ){
          //this.playslides ( this.doc.controls.delay )
        }
        
        // let slides = jp.parent ( this.doc , '$..blocks[?(@.element=="slides")]' )[0]
        // if ( slides ){
        //     this.slidesBlocks = slides.blocks  
        //     this.slidesBlocks.forEach ( slide => {
        //         slide.isSlide = true
        //     })
        // }
        // this.slidesContainer = {
        //     grid: this.doc.css,
        //     flex: this.doc.blocks[0].css
        // }
        //this.slides = this.$refs
      
      /*
      if ( !this.doc.blocks.length ) return 
        this.next()
        if ( parseInt(this.doc.controls.delay) > 0 ){
          this.playslides ( this.doc.controls.delay )
        }
        let container = this.$refs[this.doc.id]
        let slider = new AlloyFinger ( container , {
          swipe:(evt)=>{
            if ( evt.direction === 'Left' ) {
              (this.index+1) < this.doc.blocks.length ?
                this.goTo(this.index+1) :
                  this.goTo(0)
            }
            if ( evt.direction === 'Right' ) {
              (this.index) > 0 ?
                this.goTo(this.index-1) :
                  this.goTo(this.doc.blocks.length-1)
            }
          },
          doubleTap:(evt)=>{
            (this.index+1) < this.doc.blocks.length ?
                this.goTo(this.index+1) :
                  this.goTo(0)
          },
        })
        */
    },
    beforeDestroy(){
      clearInterval(this.timer)
      this.timer = null
    }
}


/*

const slides = document.querySelectorAll("section");
const container = document.querySelector("#panelWrap");
let dur = 0.5;
let offsets = [];
let oldSlide = 0;
let activeSlide = 0;
let dots = document.querySelector(".dots");
let navDots = [];
let iw = window.innerWidth;
const mouseAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const handAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const cursorAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });
const arrowAnim = gsap.timeline({ repeat: -1, repeatDelay: 1 });

document.querySelector("#leftArrow").addEventListener("click", slideAnim);
document.querySelector("#rightArrow").addEventListener("click", slideAnim);

// set slides background colors and create the nav dots
for (let i = 0; i < slides.length; i++) {
  gsap.set(slides[i], { backgroundColor: colorArray[i] });
  let newDot = document.createElement("div");
  newDot.className = "dot";
  newDot.index = i;
  navDots.push(newDot);
  newDot.addEventListener("click", slideAnim);
  dots.appendChild(newDot);
}

// icon animations for slide 1
mouseAnim.fromTo(
  "#mouseRings circle",
  { attr: { r: 10 } },
  { attr: { r: 40 }, duration: 0.8, stagger: 0.25 }
);
mouseAnim.fromTo(
  "#mouseRings circle",
  { opacity: 0 },
  { opacity: 1, duration: 0.4, stagger:0.25 },
  0
);
mouseAnim.fromTo(
  "#mouseRings circle",
  { opacity: 1 },
  { opacity: 0, duration: 0.4, stagger:0.25 },
  0.4
);

handAnim.to("#hand", { duration: 0.75, rotation: -10, transformOrigin: "center bottom" });
handAnim.to("#hand", { duration: 0.5, rotation: 14, ease: "power3.inOut" });
handAnim.to("#hand", { duration: 1, rotation: 0, transformOrigin: "center bottom" });

cursorAnim.to("#cursor", { duration: 0.25, x: -22 });
cursorAnim.to(
  "#iconCircles circle",
  0.5,
  { duration: 0.5, attr: { r: 6 }, stagger:0.15 },
  "expand"
);
cursorAnim.to("#cursor", { duration: 1.1, x: 40 }, "expand");
cursorAnim.to("#cursor", { duration: 0.75, x: 0 }, "contract");
cursorAnim.to("#iconCircles circle", { duration: 0.5, attr: { r: 4 } }, "contract");

arrowAnim.to("#caret", {
  duration: 0.5,
  attr: { points: "60 30, 35 50, 60 70" },
  repeat: 3,
  yoyo: true,
  ease: "power2.inOut",
  repeatDelay: 0.25
});

// get elements positioned
gsap.set(".dots, .titleWrap", { xPercent: -50 });
gsap.set(".arrow", { yPercent: -50 });
gsap.set(".title", { y: 30 });

// lower screen animation with nav dots and rotating titles
const dotAnim = gsap.timeline({ paused: true });
dotAnim.to(
  ".dot",
  {
    stagger: { each: 1, yoyo: true, repeat: 1 },
    scale: 2.1,
    rotation: 0.1,
    ease: "none"
  },
  0.5
);
dotAnim.to(
  ".title",
  slides.length + 1,
  { y: -(slides.length * 30), rotation: 0.01, ease: "none" },
  0
);
dotAnim.time(1);

// make the whole thing draggable
let dragMe = Draggable.create(container, {
  type: "x",
  edgeResistance: 1,
  snap: offsets,
  inertia: true,
  bounds: "#masterWrap",
  onDrag: tweenDot,
  onThrowUpdate: tweenDot,
  onDragEnd: slideAnim,
  allowNativeTouchScrolling: false,
  zIndexBoost: false
});

dragMe[0].id = "dragger";
sizeIt();

// main action check which of the 4 types of interaction called the function
function slideAnim(e) {
  oldSlide = activeSlide;
  // dragging the panels
  if (this.id === "dragger") {
    activeSlide = offsets.indexOf(this.endX);
  } else {
    if (gsap.isTweening(container)) {
      return;
    }
    // arrow clicks
    if (this.id === "leftArrow" || this.id === "rightArrow") {
      activeSlide =
        this.id === "rightArrow" ? (activeSlide += 1) : (activeSlide -= 1);
      // click on a dot
    } else if (this.className === "dot") {
      activeSlide = this.index;
      // scrollwheel
    } else {
      activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
    }
  }
  // make sure we're not past the end or beginning slide
  activeSlide = activeSlide < 0 ? 0 : activeSlide;
  activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
  if (oldSlide === activeSlide) {
    return;
  }
  // if we're dragging we don't animate the container
  if (this.id != "dragger") {
    gsap.to(container, dur, { x: offsets[activeSlide], onUpdate: tweenDot });
  }
}

// update the draggable element snap points
function sizeIt() {
  offsets = [];
  iw = window.innerWidth;
  gsap.set("#panelWrap", { width: slides.length * iw });
  gsap.set(slides, { width: iw });
  for (let i = 0; i < slides.length; i++) {
    offsets.push(-slides[i].offsetLeft);
  }
  gsap.set(container, { x: offsets[activeSlide] });
  dragMe[0].vars.snap = offsets;
}

gsap.set(".hideMe", { opacity: 1 });
window.addEventListener("wheel", slideAnim);
window.addEventListener("resize", sizeIt);

// update dot animation when dragger moves
function tweenDot() {
  gsap.set(dotAnim, {
    time: Math.abs(gsap.getProperty(container, "x") / iw) + 1
  });
}*/
</script>
<style>
.xslide {
  height: 100%;
  display: flex;
  align-content: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  position: relative;
  float: left;
}
</style>
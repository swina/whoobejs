import Vue from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin ( ScrollTrigger )
const plugins = [ScrollTrigger]
import gsapEffects from './animations' 

        Vue.prototype.$animation = (element,id,refs)=>{
            if ( refs && element.hasOwnProperty('gsap') && element.gsap.animation ){
                let ani = gsap.effects[element.gsap.animation]( refs[id] ,{
                    trigger: refs[id],
                    duration: parseFloat(element.gsap.duration),
                    delay: parseFloat(element.gsap.delay),
                    ease: element.gsap.ease,
                    clearProps: 'all'
                })

                ScrollTrigger.create({
                    id: id,
                    start: "top 99.99%",
                    trigger: refs[id],
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
                return gsap    
            }
        }

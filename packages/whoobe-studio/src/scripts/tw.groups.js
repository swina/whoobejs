/**
 * Customizer panel options
 * @label   => Option label
 * @filter  => Apply only to elements with type === filter
 * @components => Array of components for each group
 * 
 * @components => 
 *  @name   *String => component name  
 *  @attr   *String => variable from the twclasses
 *  @title  *String => option title
 *  @css    String  => extra class to assign to the option
 *  @icon   String  => material icon name if control uses an icon
 *  @negative Boolean => true = slider has negative values
 */
const twgroups = [
    { label: 'grid' , filter: ['grid'] , components: [
        { name: 'MokaOptions' , attr: 'gridgap' , title: 'grid gap'}
    ]},
    { label: 'flex' , filter: ['flex','mansory' ] , components: [
        { name: 'MokaOptions' , attr: 'colspan' , title: 'grid column span' },
        { name: 'MokaOptions' , attr: 'flexdirection' , title: 'direction'},
        { name: 'MokaOptions' , attr: 'flexwrap' , title: 'wrap'},
        { name: 'MokaOptions' , attr: 'flexgrow' , title: 'grow'},
        { name: 'MokaOptions' , attr: 'flexshrink' , title: 'shrink'},
        { name: 'MokaOptions' , attr: 'flexorder' , title: 'order'}
    ]},
    {
        label: 'box align / justify' , filter: ['grid','flex','menu'] , components: [
            { name: 'MokaOptions' , attr: 'alignitems' , title: 'Align items' },
            { name: 'MokaOptions' , attr: 'aligncontent' , title: 'Align content' },
            { name: 'MokaOptions' , attr: 'alignself' , title: 'Align self' },
            { name: 'MokaOptions' , attr: 'justifycontent' , title: 'Justify content' },
            { name: 'MokaOptions' , attr: 'justifyitems' , title: 'Justify items' },
            { name: 'MokaOptions' , attr: 'justifyself' , title: 'justify self' },
        ]
    },
    // {
    //     label: 'box justify' , filter: ['grid','flex'] , components: [
    //     ]
    // },
    { label: 'position', components : [ 
        { name: 'MokaOptions' , attr: 'positionelement' , title: 'position' },
        { name: 'MokaCheckbox' , attr: 'positionTop' , title: 'top' , css: 'float-left'},
        { name: 'MokaCheckbox' , attr: 'positionLeft' , title: 'left' , css: 'float-left' },
        { name: 'MokaCheckbox' , attr: 'positionBottom' , title: 'bottom' , css: 'float-left' },
        { name: 'MokaCheckbox' , attr: 'positionRight' , title: 'right' , css: 'float-none' },
        { name: 'MokaPosition' , attr: 'position' },
        { name: 'MokaRange' , attr: 'zindex' , title: 'z index'},
        { name: 'MokaOptions' , attr: 'objectfit' , title: 'Object fit' }
    ]},
    { label: 'dimension' , components: [ 
        { name: 'MokaWidths' , attr: 'width' },
        { name: 'MokaHeights' , attr: 'height' } 
    ]},
    { label: 'typography' , components: [ 
        { name: 'MokaColor' , attr: 'textcolor' }, 
        // { name: 'MokaRange' , attr: 'textSize' , title: 'size' },
        { name: 'MokaOptions' , attr: 'textSize' , title: 'size' },
        { name: 'MokaOptions' , attr: 'textAlign' , title: 'Align' },
        { name: 'MokaOptions' , attr: 'fontWeight' , title: 'weight' },
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'italic' , title : 'italic' , icon: 'format_italic' , css: 'float-left'},
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'underline' , title : 'underline' , icon: 'format_underline' , css: 'float-left'},
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'line-through' , title : 'strikethrough' , icon: 'format_strikethrough' , css: 'float-left'},
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'uppercase' , title : 'uppercase' , icon: 'arrow_upward', css: 'float-left'},
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'lowercase' , title : 'lowercase' , icon: 'arrow_downward', css: 'float-left'},
        { name: 'MokaButton' , group: 'text-decoration' , attr: 'capitalize' , title : 'capitalize' , icon: 'text_fields' , css: 'float-none'},
        { name: 'MokaRange' , attr: 'textOpacity' , title: 'opacity' },
        { name: 'MokaOptions' , attr: 'textSpacing' , title: 'letter spacing' },
        { name: 'MokaOptions' , attr: 'textlineheight' , title: 'line height'},
        { name: 'MokaTextFont' , attr: 'textfont' },
    ]},
    { label: 'background' , components: [ 
        { name: 'MokaColor' , attr: 'bgcolor'},
        { name: 'MokaRange' , attr: 'bgOpacity' , title: 'opacity' },
        { name: 'MokaBgPosition' , attr: 'bgposition' },
        { name: 'MokaOptions' , attr: 'blur' , title: 'filter blur' }
        // { name: 'MokaBgGradient' , attr: 'from' , title: 'gradient from' , css: 'float-left'},
        // { name: 'MokaBgGradient' , attr: 'via' , title: 'gradient via' , css: 'float-left'},
        // { name: 'MokaBgGradient' , attr: 'to' , title: 'gradient to' },
        // { name: 'MokaOptions' , attr: 'gradient' , title: 'direction' },
        //{ name: 'MokaBgcolor' , attr: 'to' , title: 'gradient to'},
        //{ name: 'MokaBgcolor' , attr: 'via' , title: 'gradient via'},
    ]},
    { label: 'gradient' , components: [ 
        { name: 'MokaBgGradient' , attr: 'from' , title: 'gradient from' , css: 'float-left' , group: true },
        { name: 'MokaBgGradient' , attr: 'via' , title: 'gradient via' , css: 'float-left' , group: true },
        { name: 'MokaBgGradient' , attr: 'to' , title: 'gradient to' , css: 'float-left' , group: true },
        { name: 'MokaOptions' , attr: 'gradient' , title: 'direction' , css: 'flex w-full' , group: true },
    ]},
    { label: 'padding', components : [ 
        { name: 'MokaRange' , attr: 'padding' , title: 'all'},
        { name: 'MokaRange' , attr: 'paddingTop' , title: 'top'},
        { name: 'MokaRange' , attr: 'paddingBottom' , title: 'bottom'},
        { name: 'MokaRange' , attr: 'paddingLeft' , title: 'left'},
        { name: 'MokaRange' , attr: 'paddingRight' , title: 'right'},
    ] }, 
    
    { label: 'margin', components : [ 
        { name: 'MokaRange' , attr: 'margin' , title: 'all' , negative: true},
        { name: 'MokaRange' , attr: 'marginTop' , title: 'top', negative: true},
        { name: 'MokaRange' , attr: 'marginBottom' , title: 'bottom', negative: true},
        { name: 'MokaRange' , attr: 'marginLeft' , title: 'left', negative: true},
        { name: 'MokaRange' , attr: 'marginRight' , title: 'right', negative: true},
        { name: 'MokaCheckbox' , attr: 'mauto' , title: 'auto' }
    ] },
    { label: 'border', components : [ 
        { name: 'MokaRange' , attr: 'border' , title: 'all' },
        { name: 'MokaRange' , attr: 'borderTop' , title: 'top' },
        { name: 'MokaRange' , attr: 'borderRight' , title: 'right' },
        { name: 'MokaRange' , attr: 'borderBottom' , title: 'bottom' },
        { name: 'MokaRange' , attr: 'borderLeft' , title: 'left' },
        { name: 'MokaBorderColor' , attr: 'bordercolor' },
        { name: 'MokaOptions' , attr: 'borderType' },
        { name: 'MokaRange' , attr: 'borderOpacity' , title: 'opacity' }
    ]},
    { label: 'rounded / shadow / +', components : [ 
        { name: 'MokaOptions' , attr: 'rounded' },
        { name: 'MokaOptions' , attr: 'shadow' },
        { name: 'MokaCheckbox' , attr: 'grayscale' , title: 'grayscale' },
        { name: 'MokaRange' , attr: 'opacity' , title: 'opacity'} 
    ]},
    { label: 'CSS Animation', components : [ 
        { name: 'MokaOptions' , attr: 'animation' , title: 'animation'}
    ]},
    { label: 'Transition', components : [ 
        { name: 'MokaOptions' , attr: 'transition' , title: 'transition type'},
        { name: 'MokaOptions' , attr: 'transitionDuration' , title: 'transition duration'},
        { name: 'MokaOptions' , attr: 'transitionTiming' , title: 'timing function'},
        { name: 'MokaOptions' , attr: 'transitionDelay' , title: 'transition delay'}
    ]},
    { label: 'transform', components : [ 
        { name: 'MokaOptions' , attr: 'skewX' , required: 'transform' , title: 'Skew X' },
        { name: 'MokaOptions' , attr: 'skewY' , required: 'transform' , title: 'Skew Y' },
        { name: 'MokaOptions' , attr: 'rotate' , required: 'transform' },
        { name: 'MokaOptions' , attr: 'clipPath' , required: 'transform' , title: 'clip path'},
        { name: 'MokaOptions' , attr: 'rotate3D' , title: 'Perspective'} 
    ]}, 
    { label: 'spacing', components : [ 
        { name: 'MokaOptions' , attr: 'spacing' , title: 'all' },
        { name: 'MokaOptions' , attr: 'spacingTop' , title: 'top' },
        { name: 'MokaOptions' , attr: 'spacingBottom' , title: 'bottom' },
        { name: 'MokaOptions' , attr: 'spacingLeft' , title: 'left' },
        { name: 'MokaOptions' , attr: 'spacingRight' , title: 'right' },
    ] },
    
]

export default twgroups
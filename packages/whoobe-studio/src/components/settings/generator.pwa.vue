<template>
    <div class="theme-dark p-2 grid grid-cols-2 gap-5">
        <div class="flex flex-col">
            
            <label>Name</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.name"/>

            <label>Description</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.description"/>

            <label>Favicon</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.favicon"/>

            <label>Website Icon</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.icon"/>
            
            <label>Charset</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.charset"/>
            
            <label>Theme Color</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.theme_color"/>

            <label>Lang</label>
            <input class="dark w-full" type="text" v-model="$attrs.website.meta.lang"/>

            
            
        </div>
        <div class="flex flex-col">
            <div class="flex my-2">
                <input class="dark" type="checkbox" v-model="$attrs.website.meta.mobileApp"/>
                <label>Mobile Capable</label>
            </div>
            
            <div class="flex flex-row items-center justify-start">
                <input class="dark" type="checkbox" v-model="$attrs.website.meta.mobileAppIOS"/> 
                Mobile iOS Capable
            </div>

            <label>Mobile Apple Status Bar Style</label>
            <div class="flex items-center">
                <input type="radio" name="appleStatusBar" value="default"  v-model="$attrs.website.meta.appleStatusBarStyle"/> default
            </div>
            <div class="flex items-center">
                <input type="radio" name="appleStatusBar" value="black"  v-model="$attrs.website.meta.appleStatusBarStyle"/> black
            </div>
            <div class="flex">
                <input type="radio" name="appleStatusBar" value="black-translucent"  v-model="$attrs.website.meta.appleStatusBarStyle"/> black translucent
            </div>

        </div>
    </div>
</template>

<script>
export default {
    name: 'WhoobeGeneratorPWA',
    
}
</script>
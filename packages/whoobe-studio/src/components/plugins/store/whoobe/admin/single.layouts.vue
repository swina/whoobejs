<template>
    <div class="flex flex-row flex-wrap justify-around theme-dark w-full cursor-pointer" style="transform: scale(.7)">
        <div class="w-32 h-32 p-1 flex flex-col text-3xl m-2 border items-center justify-center" @click="$emit('layout',1)" :class="$attrs.layout?$attrs.layout===1?'text-red-500 border-red-500':'':''">
            0
        </div>

        <div class="w-32 h-32 p-1 flex flex-col text-3xl m-2 border" @click="$emit('layout',2)" :class="$attrs.layout?$attrs.layout===2?'text-red-500 border-red-500':'':''">
                <div class="grid grid-cols-2 gap-1">
                    <div class="h-16 border border-dashed flex items-center justify-center">0</div>
                    <div class="h-16 border flex items-center justify-center">1</div>
                </div>
                <div class="w-full h-16 border border-dashed flex items-center justify-center mt-1">2</div>
        </div>

        <div class="w-32 h-32 p-1 flex flex-col text-3xl m-2 border" @click="$emit('layout',3)" :class="$attrs.layout?$attrs.layout===3?'text-red-500 border-red-500':'':''">
                <div class="w-full h-16 border border-dashed flex items-center justify-center mb-1">0</div>
                <div class="grid grid-cols-2 gap-1">
                    <div class="h-16 border border-dashed flex items-center justify-center">1</div>
                    <div class="h-16 border border-dashed flex items-center justify-center">2</div>
                </div>
        </div>
    </div>
</template>
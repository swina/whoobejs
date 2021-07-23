<template>
    <div class="p-4">
        Heading level 
        <select v-model="$mapState().editor.element.level" class="mx-2 theme-dark">
            <option v-for="n in 6" :value="n">H{{n}}</option>
        </select>
        <button class="sm w-12" @click="$mapState().editor.current.blocks.push($mapState().editor.element),$action()">OK</button>
    </div>
</template>

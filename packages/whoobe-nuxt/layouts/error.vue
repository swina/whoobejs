<template>
    <div class="p-2 md:p-32 flex flex-col bg-cover bg-no-repeat bg-center">
        <h2>An error occurred !</h2>
        <nuxt-link to="/"><button>Home</button></nuxt-link>
    </div>
</template>

<script>
export default {
    name: 'Nuxp404',
}
</script>
<style scoped>
.outline {
    -webkit-text-fill-color: white; /* Will override color (regardless of order) */
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
}
</style>
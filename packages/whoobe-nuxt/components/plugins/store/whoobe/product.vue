<template>
    <div>
        {{ $route }}
    </div>
</template>

<script>
export default {
    name: 'WhoobeStoreProduct',
    beforeMount(){
        console.log ( this.$route )
    }

}
</script>
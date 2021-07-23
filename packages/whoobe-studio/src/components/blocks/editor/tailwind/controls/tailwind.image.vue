<template>
    <div>
        <img :src="element.url"/>
    </div>
</template>

<script>
export default {
    props: [ 'element' ]
}
</script>
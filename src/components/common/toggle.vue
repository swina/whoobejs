<template>
    <div class="flex flex-row items-center">
    <icon :name="status?'toggle_on':'toggle_off'" class="text-5xl" :class="status?'text-green-500':'text-red-500'" @click="$emit('click',status=!status)"/> Active
    </div>
</template>

<script>
export default {
    name: 'Switch',
    data:()=>({
        status:false
    }),
    mounted(){
        this.status = this.$attrs.status
    }
}
</script>
<template>
    <modal
            :fixed="true"
            size="sm"
            position="modal" 
            :close="true"
            v-if="confirmModal"
            @close="confirmModal=false,$emit('noconfirm')"
            @click_0="confirmModal=false,$emit('noconfirm')"
            @click_1="confirmModal=!confirmModal,$emit('confirm')">
            <div slot="title">Confirm</div>
            <div slot="content" class="p-4">
                Confirm action ?
            </div>
    </modal>
</template>

<script>
export default {
    name: 'ConfirmAction',
    data:()=>({
        confirmModal: true
    })
}
</script>
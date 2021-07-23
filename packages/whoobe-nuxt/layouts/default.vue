<template>
  <div id="whoobe-page" class="overflow-y-hidden">
    <transition name="fade">
      <nuxt/>
    </transition>
    <common-scroll-top class="invisible md:visible"/>
    <!--<moka-jivo-chat v-if="prod"/>--->
    <template v-for="plugin in $store.state.plugins">
      <common-plugin-wrapper :settings="plugin.editor.settings"  :block="null"  :plugin="plugin" :component="plugin.component"/>
    </template>
  </div>
</template>

<script>
export default {
  middleware: 'load-initial-data',
  name: 'WhoobeLayout'
}
</script>

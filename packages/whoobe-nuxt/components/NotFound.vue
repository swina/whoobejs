<script>
export default {
  name: 'NotFound',
  template: `<div></div>`,
  mounted() {
    this.$router.push({ path: '/' })
  }
}
</script>
<template>
  <div class="segi-loading" :style="{width:getWidth, opacity: getOpacity}"></div>
</template>

<script>
export default{
  data () {
    return this.$store.state.global.loading
  },
  computed: {
    getOpacity: function () {
      return this.percentage === 0 || this.percentage === 100 ? 0 : 1
    },
    getWidth: function () {
      return this.percentage + '%'
    }
  }
}
</script>
<style scoped>
  .segi-loading{
    position: fixed;
    top: 0;
    height: 3px;
    background: #4CAF50;
    transition: width .5s;
    z-index: 999999;
  }
</style>

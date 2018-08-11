<template>
  <div class='hello'>
    <div v-for="key in obj">{{obj[key]}}</div>
  </div>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object
    }
  },
  mounted () {
    for (let key in this.obj) {
      console.log(this.obj[key])
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>


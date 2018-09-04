<template>
  <div class="hello">
  </div>
</template>

<script>
  import axios from 'axios'


export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted () {
      axios.get('http://192.168.1.11:10080/business-accept-web/rest-api/v2/accpet/lease/getReturnLeaseList.json', {
      }).then(res => {
          console.log(res)
      }).catch(err => {
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

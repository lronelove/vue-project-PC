<template>
  <div class="header">
    <div class="title-1">
      <img style="float: left; margin-right: 15px;" :src="logo">
      <p style="float: right">{{title}}</p>
    </div>
    <div class="title-2">
      <p>{{subTitle}}</p>
    </div>
  </div>
</template>

<script>
export default{
  props: {
    logo: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subTitle: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.header{
   background-color: #ffffff;
   height: 100px;
   width: 100%;
}
.header .title-1{
   font-family: fantasy;
   margin-left: 20%;
   font-size: 32px;
   color: #666666;
   position: absolute;
   top: 15px;
}
.header .title-2 {
    top: 55px;
    right: 300px;
    position: absolute;
    color: #666666;
}
.header .title-1 p{
   padding-top: 20px;
}
.header .title-1 img{
   padding-top: 23px;
}
</style>

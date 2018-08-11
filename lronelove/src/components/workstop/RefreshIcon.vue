<!--  示例：
 <refresh :show="refresh.show"></refresh>
 <button @click="rotate">refresh</button> // 父组件的控制按键
 data () {
    return {
      refresh: {show: false}
    }
 }
 methods: {
    rotate () {
      let that = this
      that.refresh.show = true // 将show设置为true，图标显示和旋转
       // 调用接口之后，再设置为false,图标消失和停止旋转
    }
  }
-->
<template>
  <div>
    <span class="glyphicon glyphicon-refresh pull-right" :class={rotation:show} v-show="show"></span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'refresh',
  props: {
    /* 在父组件中函数控制show的值，图标显示和旋转 */
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .rotation{
    animation:move .4s linear infinite both;
    -webkit-animation:move .4s linear infinite both;
    -moz-animation:move .4s linear infinite both;
  }
  @keyframes move{
    from {transform:rotate(-360deg);}
    to {transform:rotate(0);}
   }
  @-webkit-keyframes move{
    from {transform:rotate(-360deg);-webkit-transform:rotate(-360deg);}
    to {transform:rotate(0);-webkit-transform:rotate(0);}
  }
  @-moz-keyframes move{
    from {transform:rotate(-360deg);-moz-transform:rotate(-360deg);}
    to {transform:rotate(0);-moz-transform:rotate(0);}
  }
</style>

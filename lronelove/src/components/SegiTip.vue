<template>
  <div class="tip flex-left">
    <span class="sign-icon">i</span>
    <span class="text">{{value}}</span>
  </div>
</template>
<script>
export default {
  name: 'Tip',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .tip{
    background: @light-gray;
    font-size: 0;
    border-radius: 4px;
    padding: 0 20px;
    text-align: left;
    .sign-icon{
      font-size: 14px;
      color: @white;
      margin-right: 10px;
      display: block;
      width: 18px;
      height: 18px;
      line-height: 18px;
      background: @primary-blue;
      border-radius: 50%;
      text-align: center;
      font-weight: bold;
      font-family: "Helvetica Neue", Helvetica, "Arial Regular",Arial, sans-serif;
    }
    .text{
      font-size: 14px;
      line-height: 36px;
    }
  }
  .flex-left {
    display: -webkit-flex;
    display: flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: center;
    -webkit-align-items: center;
  }
</style>

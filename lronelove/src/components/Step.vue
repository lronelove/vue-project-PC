<!--Step组件:用于排班计划的‘新建’模态框中，表示第几个步骤的圆圈和横线-->
<!--props参数意义：
  arr: 数组类型,包含name,style,例子Plan.vue
      step: [
        {name: '派单',style: {color: '#B2B5B9'}},
       {name: '接单',style: {color: '#B2B5B9'}}
     ]
-->
<template>
  <div class="step">
    <div class="section" v-for="(item, index) in arr" :style="sectionStyle">
      <span class="left" v-if="index!=0"></span>
      <div class="circle" @click="changeColor" :style="{background: item.style.color}">
        <span>{{ index+1 }}</span>
      </div>
      <span class="right" v-if="index!=arr.length-1"></span>
      <p :style="{color: item.style.color}">{{ item.name }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['arr'],
    data () {
      return {
        h: 'red',
        sectionStyle: {
          width: 660 / this.arr.length + 'px'
        }
      }
    },
    methods: {
      // 点击圆点，切换颜色和对应的表单（父组件中，表单v-if绑定到item.style.color上,所以颜色切换时表单也切换）
      changeColor (obj) {
        this.$emit('changeColor', obj.target.innerText)
      }
    }
  }
</script>

<style scoped>
  .section {
    height: 80px;
    position: relative;
    display: inline-flex;
    display: -webkit-inline-flex;
    justify-content: center;
    align-items: top;
  }
  .section > span {
    width: 58px;
    background: #B2B5B9;
    height: 4px;
    position: absolute;
    top: 20px;
  }
  .section p {
    position: absolute;
    top: 50px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    /*color: #B2B5B9;*/
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .circle {
    width: 50px;
    height: 50px;
    -webkit-border-radius: 50px;
    -moz-border-radius: 50px;
    border-radius: 50px;
    border: 2px solid transparent;
    /*background: #B2B5B9;*/
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    /*position: absolute;*/
    z-index:0;
    transition:background .2s linear;
  }
  .circle:hover {
    cursor: pointer;
  }
  .circle span {
    color: #ffffff;
    font-size: x-large;
  }
</style>

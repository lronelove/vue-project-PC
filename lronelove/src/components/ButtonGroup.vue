<!--
功能描述
  一个水平方向和竖直方向都是居中均价分布的按钮组，点击每一个按钮发送对应的广播，绑定id方便与slot绑定

使用样本
  <button-group
        :slot="btn.id"
        :array="buttonGroup(btn)"
        v-for="btn in buttonArray"
        @offLine="offLine(btn.id)"
        @onLine="onLine(btn.id)"
        @editItem="editItem(btn.id)"
        @delItem="delItem(btn.id)"
        @copyItem="copyItem(btn.id)"
      >
  </button-group>

props参数解析
isInput: Boolean类型，选填项，默认值为true
array: Array类型，按钮组的数组
  按钮组数组中单个元素的属性
    id: Number类型或者String类型,选填项，用来与v-for的key绑定，加快渲染速度
    btnClass: String类型,选填项，每一个按钮所对应的样式类
    name: String类型,必填项,按钮的名称
    func: String类型，必填项,按钮触发的事件名称

事件流说明
  点击对应的按钮会发送对应的func属性事件,监听该事件即可做对应的操作

-->
<template>
  <div>
    <div class="button-group" v-if="isInput">
      <input 
      type="button" 
      class="btn btn-text" 
      :style="{marginRight: marginRight}" 
      v-for="a in array" 
      :key="a.id" 
      :class="a.btnClass" 
      @click="send(a.func)" 
      :value="a.name" 
      :disabled="a.disabled"
      >
    </div>
    <div class="button-group" v-else>
      <a 
      type="button" 
      class="btn btn-text marg" 
      :style="{marginRight: marginRight}" 
      v-for="a in array" 
      :class="a.btnClass" 
      :href="a.href" 
      @click.prevent="send(a.func)"
      :key="a.id"
      >
      {{ a.name }}
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      array: Array,
      isInput: {
        type: Boolean,
        default: false
      },
      marginRight: {
        type: String,
        default: '30px'
      }
    },
    methods: {
      /* 点击事件发送的广播 */
      send (event) {
        this.$emit(event)
      }
    }
  }
</script>
<style scoped>
  /*.marg {*/
  /*margin-right: 30px;*/
  /*}*/
  .button-group {
    height: 40px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-start;
    align-items: center;
  }
  .button-group input {
    font-size: small;
  }
  .plainTxt{
    background-color: transparent;
    border-color: transparent;
  }
  .plainTxt:hover{
    background-color: transparent;
    border-color: transparent;
  }
  .plainTxt:active{
    box-shadow: none;
  }
</style>

<template>
  <div class="label-unit flex-left">
    <span  class="m-label" :style="{width: labelWidth}" v-if="label">{{label}}</span>
    <span  
      class="m-text scrollbar" 
      :class="{'limit-height': limitHeight}" 
      :style="{width: inputWidth, overflow: overflow, maxHeight: (limitHeight ? inputHeight : '')}">
      {{value || '无'}}
      </span>
  </div>
</template>
<script>
export default {
  name: 'Label',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: [String, Number],
      default: ''
    },
    labelWidth: {
      type: String,
      default: '90px'
    },
    inputWidth: {
      type: String,
      default: '340px'
    },
    inputHeight: {
      type: String
    },
    width: {
      type: String,
      default: '109px'
    },
    overflow: {
      type: String,
      default: 'auto'
    },
    // 是否限制高度
    limitHeight: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .flex-left {
    display: -webkit-inline-flex;
    display: inline-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: flex-start;
    -webkit-align-items: flex-start;
  }
  .label-unit {
    line-height: 20px;
    text-align: left;
  }
  .m-label{
    display: inline-block;
    width: 90px;
    padding: 10px 5px 10px 0;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    color: @input-label-color;
  }
  .m-label:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  .m-text{
    border-radius: 5px;
    display: inline-block;
    width: 340px;
    padding: 10px 5px 10px 0;
    color: @input-color;
    word-wrap: break-word;
    word-break: break-all;
    overflow: auto;
  }
  .limit-height{
    max-height: 86px;
  }
  .querycondition .m-text{
    width: 270px;
  }
  @media screen and (min-width:1420px){
    .querycondition .m-text{
      width: 340px;
    }
  }
</style>

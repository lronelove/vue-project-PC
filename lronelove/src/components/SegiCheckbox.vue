<!-- props参数释义
 1.required: Boolean类型，选填项，默认值为false,若为true则在label左上角显示一个红色*
 2.label: String类型，选填项，
 3.labelWidth: String类型，选填项，默认值为43px.
 4.labelHeight: String类型，选填项，默认值为109px.
 5.isBlock: Boolean类型，选填项，默认为false,同行排列,若为true则显示为隔行排列
 6.disabled: Boolean类型，选填项，默认为false,即控制所有checkbox的disabled类型,这个优先级比单个的disabled的优先级高
 7.labelWeight: String类型, 选填项，默认为normal,显示每个checkbox前面的label的font-weight
 7.options: Array类型，必填项，即每个checkbox所对应的数组
    options所对应的每个对象属性
      id: String类型或者Number类型， 必须独一无二的,必填项
      name: String或者Number类型，该checkbox多对应的label
      value: String或者Number类型，独一无二的，必填项
      disabled: Boolean类型,单个checkbox所对应的disabled值
 6.v-model绑定的数组: Array类型，必填项，
    数组对应的每一项即为options里面的值
 -->
<template>
  <div class="segi-checkbox flex-left">
    <label v-if="label" class="outsideLabel" :style="{width: labelWidth, height: labelHeight}">
      <span v-if="required" style="color:red">*</span>
      {{ label }}
    </label>
    <div class="flex-input-width" style="display:inline-block" :style="{width: inputWidth}">
      <span class="bottom" :class="{block: isBlock, height: labelHeight}" v-for="(item, index) in value" :key="index">
        <label class="checkbox-label" :class="{checkboxDisabled:disabled}">
          <input type="checkbox" :value="item.value" @change="handleChange(index)" :checked="item.checked"/>
          <span class="glyphicon" :style="{width: boxWidth, height: boxWidth, lineHeight: iconHeight}"></span>
          <span v-if="item.name" class="checkbox-text" :style="{lineHeight: labelHeight}">{{ item.name }}</span>
        </label>
      </span>
    </div>
  </div>
</template>

<script>
/* 如果使用深复制，当在外部改变checkbox的值时会使得checkbox的样式不发生改变 */
//  import _ from 'lodash'
export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: [String, Number]
    },
    value: {
      type: Array
    },
    labelWidth: {
      type: String,
      default: '90px'
    },
    labelHeight: {
      type: String,
      default: '40px'
    },
    boxWidth: {
      type: String,
      default: '18px'
    },
    iconHeight: {
      type: String,
      default: '10px'
    },
    labelWeight: {
      type: String,
      default: 'normal'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: String
    }
  },
  data () {
    return {
      array: []
    }
  },
  created () {
    this.array = this.value
  },
  methods: {
    /* 勾选事件 */
    handleChange (index) {
      let obj = this.array[index]
      obj.checked = !obj.checked
      this.array.splice(index, 1, obj)
      this.$emit('input', this.array)
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/less/variables.less';
  
  .segi-checkbox{
    display: inline-block;
    text-align: left;
    font-size:0;
  }
  label {
    font-weight: normal;
    text-align:left;
    margin:0;
    font-size:14px;
    vertical-align:middle;
  }
  /*.segi-label{
    padding: 12px 5px 12px 0;
  }
  .segi-label .label-txt{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    width:100%;
    display:inline-block;
  }
  .segi-label:hover .label-txt{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }*/
  .outsideLabel {
    /*float: left;*/
    color: @light-black;
    font-weight: normal;
    text-align:left;
    margin:0;
    line-height: 20px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding: 10px 5px 10px 0;
  }
  .outsideLabel:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  .bottom {
    margin: 0 16px 0 0;
    font-size:0;
    display:inline-block;
    vertical-align:middle;
  }
  .checkbox-label{
    color: @light-black;
    font-size:0;
    cursor:pointer;
  }
  .checkbox-label.checkboxDisabled{
    color: @extra-light-black;
    cursor: not-allowed;
  }
  .checkbox-label:hover input[type="checkbox"] + span {
    border-color: @primary-blue; /*改*/
  }
  .checkbox-label:hover input[type="checkbox"]:disabled + span {
    border-color: @extra-light-gray; /*改*/
  }
  input[type='checkbox'] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
  }
  input[type="checkbox"] + span {
    vertical-align: middle;
    top: 0;
    font-size:14px;
    width: 18px;
    height: 18px;
    line-height:10px;
    border: 1px solid @extra-light-silver;
    margin-right: 5px;
    border-radius: 4px;
    display: inline-block;
    text-align: center;
    background: @white;
    cursor:pointer;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46); /*改*/
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    -moz-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    position:relative;
  }
  input[type="checkbox"] + span:hover {
    border-color: @primary-blue; /*改*/
  }
  /*部分选中*/
  input[type="checkbox"].half + span::after {
    position:absolute;
    display:block;
    content: "";
    border: 1px solid @white;
    margin-top: -1px;
    left: 3px;
    right: 3px;
    top: 50%;
  }
  input[type="checkbox"]:checked + span, input[type="checkbox"].half + span {
    background-color: @primary-blue;
    border-color: @primary-blue; /*改*/
  }
  input[type="checkbox"] + span::before {
    transform: rotate(45deg) scaleY(0);
    -webkit-transform: rotate(45deg) scaleY(0);
    -moz-transform: rotate(45deg) scaleY(0);
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    transform-origin: center;
    -webkit-transform-origin: center;
    -moz-transform-origin: center; /*改*/
  }
  input[type='checkbox']:checked + span::before{
    /*content: '\2714';
    font-weight:600;*/
    box-sizing: content-box;
    border: 2px solid @white;
    border-left: 0;
    border-top: 0;
    height: 8px;
    width:4px;
    left: 5px;
    top: 1px;
    position: absolute;
    transform: rotate(45deg) scaleY(1);
    -webkit-transform: rotate(45deg) scaleY(1);
    -moz-transform: rotate(45deg) scaleY(1); /*改*/
    /*box-sizing: content-box;
    border-left: 0;
    border-top: 0;
    height: 8px;
    left: 4px;
    position: absolute;
    top: 0px;
    transform: rotate(35deg) scaleY(1);
    -webkit-transform: rotate(35deg) scaleY(1);
    -moz-transform: rotate(35deg) scaleY(1);
    width: 3px;*/
  }
  input[type="checkbox"] + span::before {
    content: '\a0';
  }
  input[type='checkbox']:disabled + span {
    opacity: .4;
    background: @extra-light-gray;
    border-color: @extra-light-silver;
  }
  input[type='checkbox']:checked:disabled + span {
    background: @extra-light-silver;
  }
  .checkbox-text{
    vertical-align:middle;
    display:inline-block;
    font-size:14px;
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .block {
    display: block;
  }
  .flex-left {
    display: -webkit-inline-flex;
    display: inline-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: flex-start;
    -webkit-align-items: flex-start;
  }
  .flex-input-width{
    width: 340px;
  }
  .querycondition .flex-input-width{
    width: 270px;
  }
  @media screen and (min-width:1420px){
    .querycondition .flex-input-width{
      width: 340px;
    }
  }
</style>

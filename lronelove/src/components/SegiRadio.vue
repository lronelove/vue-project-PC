<!--
  props:
  required: 是否必填项
  label: 显示的文案
  options: 选项的数组 e.g[{name: 'abc', value: '1'}]
  value: 选择的值
  disabled: true 为不可写
  width: 整体宽度
-->

<template>
  <div 
    v-if="!disabled || disabledStyle !== 'label'" 
    class="segi-radio clearfix" 
    :style="{lineHeight: labelHeight}" 
    :class="{'limit-height': limitHeight}">
    <label 
      class="outsideLabel" 
      :style="{width: labelWidth, height: labelHeight}" 
      v-if="label">
      <span v-show="required" style="color:#f74444">*</span>{{ label }}
    </label>
    <div class="flex-input-width" style="display: inline-block;text-align: left;white-space: normal;" :style="{width: inputWidth}" >
      <label 
        class="radio-label"
        :class="{radioDisabled:disabled}" 
        v-for="(item, index) in options" 
        @click="handleChange(item)"
        :key="index" 
        style="cursor: pointer">
        <input type="radio" :checked='item.value === selected' :disabled="disabled">
        <span class="radio"></span>
        <span class="radio-text">{{item.name}}</span>
      </label>
    </div>
  </div>
  <form-label v-else :label="label" :value="getLabel()" :labelWidth="labelWidth" :inputWidth="inputWidth"/>
</template>

<script>
  import _ from 'lodash'
  import FormLabel from './Label.vue'
  import tabArr from '../utils/tabArr'

  export default {
    components: {FormLabel},
    props: {
      labelWidth: {
        type: String,
        default: '90px'
      },
      labelHeight: {
        type: String,
        default: '40px'
      },
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String
      },
      options: {
        type: Array
      },
      value: {
        type: [String, Number, Boolean]
      },
      disabled: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '490px'
      },
      inputWidth: {
        type: String
      },

      /* disabled两种样式：label、common, 分别是文本、正常灰色背景 */
      disabledStyle: {
        type: String,
        default: 'label'
      },
      limitHeight: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selected: this.value
      }
    },
    methods: {
      handleChange (item) {
        if (this.disabled) {
          return false
        }
        this.selected = item.value
        this.$emit('input', item.value)
      },
      getLabel () {
        let obj = tabArr.getTab(this.options, this.value, 'value', 'obj')
        return obj.name || ''
      }
    },
    watch: {
      options (val, oldVal) {
        var self = this
        self.selected = self.value

        if (_.isEqual(val, oldVal)) {
          return false
        }

        if (val.length > 0) {
          let res

          val.forEach((item) => {
            if (item.value === self.value) {
              res = item.value
            }
          })
          self.$emit('input', res === undefined ? val[0].value : res)
        } else {
          console.error('no options in select!')
        }
      },
      value () {
        let self = this
        self.selected = self.value
        let flag = this.options.some((item) => { return item.value === self.value })

        if (!flag) {
          console.warn('error, the value is beyond the options!')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/less/variables.less';
  
  label {
    font-weight: normal;
    text-align:left;
    margin:0;
    height: 40px;
    line-height: 40px;
    width: 109px;
  }
  .segi-radio {
    display: inline-block;
    /*vertical-align: middle;*/
  }
  .outsideLabel {
    color: @light-black;
    float: left;
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
  input {
    display:inline-block;
    float: left;
    line-height: 40px;
    position: relative;
    top: 10px;
    margin-right: 8px;
    margin-left:10px;
    cursor: pointer;
  }
  /*新增样式*/
  .radio-label{
    width:auto;
    color: @light-black;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-align-items: center;
    -webkit-justify-content: flex-start;
  }
  .radio-label.radioDisabled{
    cursor: not-allowed;
    color: @extra-light-black;
  }
  .radio-label > * {
    /*vertical-align:middle;*/
  }
  .radio-label:hover .radio{
    border-color: @primary-blue;
  }
  input[type='radio'] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    margin:0;
  }
  input[type='radio'] + .radio{
    border: 1px solid @extra-light-silver;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: @white;
    position: absolute;
    top: 12px;
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    margin-right: 5px;
    margin-top: 0;
    margin-bottom: 0;
  }
  input[type='radio'] + .radio:after {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @white;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0);
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6);
  }
  input[type='radio']:checked + .radio {
    border-color: @primary-blue;
    background: @primary-blue;
  }
  input[type='radio']:checked + .radio:after {
    transform: translate(-50%,-50%) scale(1);
  }
  input[type='radio']:checked:disabled + .radio {
    background: @extra-light-silver;
  }
  input[type='radio']:disabled + .radio {
    opacity: .4;
    background: @extra-light-gray;
    border-color: @extra-light-silver;
  }
  .radio-text{
    margin-right:16px;
    margin-left: 20px;
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

  .limit-height{
    label{
      height: 20px;
      line-height: 20px;
    }
    .outsideLabel{
      padding: 0 5px 0 0;
    }
    .radio-label{
      vertical-align: middle;
    }
    input{
      top: 0;
    }
    input[type='radio'] + .radio{
      position: relative;
      top: 0;
    }
    .radio-text{
      margin-left: 0;
    }
  }
</style>

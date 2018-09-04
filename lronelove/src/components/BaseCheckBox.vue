<!-- props参数释义
 1.options: Array类型，必填项，可选的checkbox。例子[{name: 'hello', value: 0}, {name: 'we', value: 1}, {name: 'world', value: 2}]
 2.value: Array类型，必填项，默认选中的checkbox的value数组。直接用v-model绑定即可,为组件中的value,例子[0]
 3.required: Boolean类型，选填项，默认值为false,若为true则在label左上角显示一个红色*
 4.label: String类型，选填项，
 5.labelWidth: String类型，选填项，默认值为109px.
 6.labelHeight: String类型，选填项，默认值为40px.
 7.boxWidth: String类型，选填项，默认值为15px.checkbox的宽、高
 8.iconHeight: String类型，选填项，默认值为10px.checkbox的打勾的lineHeight
 9.isBlock: Boolean类型，选填项，默认值为false,若为true则checkbox的display:block
 10.allBlock:Boolean类型，选填项，默认值为false,若为true则‘全部’的display:block
 11.all:Boolean类型，选填项，默认值为false,若为true则有全选的checkbox
 12.inputWidth: String类型，选填项，默认值为381px;
 -->
<template>
  <div v-if="!disabled || disabledStyle !== 'label'" class="segi-checkbox flex-left" >
    <label v-if="label" class="outsideLabel" :style="{width: labelWidth, height: labelHeight}">
      <span v-if="required" style="color:red">*</span>
      {{ label }}
    </label>
    <div class="flex-input-width" style="display:inline-block" :style="{width: inputWidth}">
      <!--全选-->
      <span class="bottom" :class="{block: allBlock, height: labelHeight}" v-if="all" v-show="options.length">
        <label class="checkbox-label" :class="{checkboxDisabled:disabled}">
          <input 
          type="checkbox" 
          :disabled="disabled" 
          v-model="allSelection" 
          :class="{half: value.length < options.length && value.length > 0}"
          />
          <span :style="{width: boxWidth, height: boxWidth, lineHeight: iconHeight}"></span>
          <span class="checkbox-text" :style="{lineHeight: labelHeight, minWidth: textWidth}">全部</span>
        </label>
      </span>
      <!--选项-->
      <span class="bottom" :class="{block: isBlock, height: labelHeight}" v-for="(item, index) in options" :key="index">
        <label class="checkbox-label" :class="{checkboxDisabled:disabled}">
          <input type="checkbox" :disabled="disabled" :value="item.value" v-model="selectArr"/>
          <span class="glyphicon" :style="{width: boxWidth, height: boxWidth, lineHeight: iconHeight}"></span>
          <span v-if="item.name" class="checkbox-text" :style="{lineHeight: labelHeight, minWidth: textWidth}">{{ item.name }}</span>
        </label>
      </span>
    </div>
  </div>
  <form-label v-else :label="label" :value="getLabel()" :labelWidth="labelWidth" :inputWidth="inputWidth"/>
</template>

<script>
import tabArr from '../utils/tabArr'
import FormLabel from './SegiLabel.vue'

export default {
  components: {FormLabel},
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: [Array, String]
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: [String, Number]
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
    /* 是否display:block */
    isBlock: {
      type: Boolean,
      default: false
    },
    /* 是否有全选框 */
    all: {
      type: Boolean,
      default: false
    },
    allBlock: {
      type: Boolean,
      default: false
    },
    /* 右边整体宽度 */
    inputWidth: {
      type: String
    },
    /* checkbox文本宽度 */
    textWidth: {
      type: String
    },
    /* disabled两种样式：label、common, 分别是文本、正常灰色背景 */
    disabledStyle: {
      type: String,
      default: 'label'
    }
  },
  data () {
    return {
      selectArr: this.value || [],
      allSelection: false // 是否全选
    }
  },
  methods: {
    validateOptions () {
      if (this.options.length < 1) {
        console.warn('no options in checkbox!')
      }
    },
    validateValue () {
      if (typeof this.value === 'string') {
        let pattern = /^\[.*\]$/
        let value
        if (pattern.test(this.value)) {
          value = eval('(' + this.value + ')')
        } else {
          value = []
        }
        this.$emit('input', value)
      }
      for (let i = 0; i < this.value.length; i++) {
        if (tabArr.getTab(this.options, this.value[i], 'value') === -1) {
          console.warn('error, the value is beyond the options!')
          break
        }
      }
    },
    setAllSelection () {
      if (this.selectArr.length) {
        for (let i = 0; i < this.options.length; i++) {
          if (tabArr.indexOfTab(this.selectArr, this.options[i].value) === -1) {
            this.allSelection = false
            return
          }
        }
        this.allSelection = true
      } else {
        this.allSelection = false
      }
    },
    getLabel () {
      let convertVal = this.value
      let label = convertVal.map((item) => {
        let obj = tabArr.getTab(this.options, item, 'value', 'obj')
        return obj.name
      })
      return label.join(',')
    }
  },
  watch: {
    // 全选时，其他项也选中
    allSelection (val) {
      if (val) {
        let selection = []
        this.options.forEach((item) => {
          selection.push(item.value)
        })
        this.selectArr = selection
      } else {
        if (this.options.length === this.selectArr.length) {
          this.selectArr = []
        }
      }
    },
    // 当选中每一项时，‘全选’为true
    selectArr (val) {
      this.$emit('input', val)
      this.setAllSelection()
    },
    value (val) {
      this.selectArr = val
      this.validateValue()
    },
    options (val) {
      this.validateOptions()
    }
  },
  mounted () {
    // 验证options
    this.validateOptions()
    // 验证value
    this.validateValue()
    // 设置全选true/false
    this.setAllSelection()
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
  // position: absolute;
  // clip: rect(0, 0, 0, 0);
  display: none;
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

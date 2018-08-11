<template>
  <!--外嵌格式-->
  <div v-if="outside" >
    <div v-if="!disabled || disabledStyle !== 'label'" :class="[{error: errorTip.length>0}, 'segi-input', 'clearfix']" >
      <label v-if="label" :style="{width: labelWidth, paddingTop: getPaddingTop()}" class="outsideLabel">
        <span v-show="required">*</span>{{label}}
      </label>
      <input  v-if="inputType === 'text'" :minlength="inputMinLenth" :maxlength="inputMaxLength" type="text" class="form-control flex-input-width" :value="val" @input="updateValue($event.target.value)" @keyup.enter="queryData()" :name="inputName" :id="inputId" :placeholder="getholder()" :disabled="disabled" :style="{ width: inputWidth, height: inputHeight, borderRadius: radius}">
      <input v-else-if="inputType === 'number'" type="number" :minlength="inputMinLenth" :maxlength="inputMaxLength" :min="min" :max="max" :step="step" class="form-control flex-input-width" :value="val" @change="validateNumber($event.target.value)" @input="updateValue($event.target.value)" @keyup.enter="queryData()" :name="inputName" :id="inputId" :placeholder="getholder()" :disabled="disabled" :style="{ width: inputWidth, height: inputHeight, borderRadius: radius}">
      <input v-else-if="inputType === 'file' && hideFlag === false" type="file" class="form-control" @change="updateEvent($event)" :style="{ width: inputWidth, height: inputHeight, borderRadius: radius}">
      <div class="error-tip" :style="{'left': labelWidth}" v-if="errorTip.length>0">{{errorTip}}</div>
      <div v-if="hideFlag"><a class="btn btn-danger" @click="delImg">清空已存在的图片</a></div>
      <div v-else-if="inputType === 'textarea'" style="display:inline-block">
        <textarea class="form-control scrollbar" :value="val" :minlength="inputMinLenth" :maxlength="textareaMaxLength" @input="updateValue($event.target.value, 'textarea')" :style="{ width: inputWidth, height: textareaHeight, borderRadius: radius}" style="resize: none;padding:9px 10px;" :placeholder="getholder()" :disabled="disabled"></textarea>
        <span v-if="textareaNumberTip" class="tip-text">还可输入{{textareaMaxLength - val.length < 0 ? 0 : textareaMaxLength - val.length}}个字</span>
      </div>
      <div v-else-if="inputType === 'div'" class="div-input" :style="{ width: inputWidth, height: inputHeight, borderRadius: radius, lineHeight: inputHeight}" style="padding-left: 10px;display: inline-block;overflow: hidden;text-overflow: ellipsis">{{val}}</div>
    </div>
    <form-label v-else :label="label" :value="val" :labelWidth="labelWidth" :inputWidth="inputWidth" :inputHeight="inputType === 'textarea' ? textareaHeight : ''"/>
  </div>
  <!--内嵌格式-->
  <label v-else class="input segi_formInput" :style="{ width: inputWidth}">
    <input v-if="inputType === 'text'" type="text" class="form-control" :maxlength="inputMaxLength"  v-model.trim="val" @keyup.enter="queryData()" :name="inputName" :id="inputId" :placeholder="getholder()" :disabled="disabled" :style="[baseStyle, inputStyle]">
    <input v-else-if="inputType === 'number'" type="number" :min="min" :max="max" :step="step" :maxlength="inputMaxLength"  class="form-control" @input="updateValue($event.target.value)" @keyup.enter="queryData()" :style="[baseStyle, inputStyle]" :placeholder="getholder()">
    <input v-else-if="inputType === 'file'" type="file" class="form-control" @input="updateValue($event.target.value)" :style="[baseStyle, inputStyle]">
    <span class="labelBox" :style="{height: inputHeight, lineHeight: inputHeight, width: labelWidth}">
      <span class="labelText"><i :class="labelIcon"></i>{{label}}<span v-show="required" style="color:red">*</span></span>
    </span>
  </label>
</template>

<script>
  // import _ from 'lodash'
  import FormLabel from './Label.vue'
  // function getByteLen (val) {
  //   let len = 0
  //   for (let i = 0; i < val.length; i++) {
  //     let length = val.charCodeAt(i)
  //     if (length >= 0 && length <= 128) {
  //       len += 1
  //     } else {
  //       len += 2
  //     }
  //   }
  //   return len
  // }
  export default {
    name: 'SegiFormInput',
    components: {FormLabel},
    props: {
      /* 公共 */
      inputType: {
        type: String,
        default: 'text'
      },
      min: {
        type: [Number, String]
      },
      max: {
        type: [Number, String]
      },
      step: {
        type: [Number, String]
      },
      float: {
        type: Boolean,
        default: false
      },
      fix: {
        type: [Number, String],
        default: 2
      },
      // 是否外嵌格式
      outside: {
        type: Boolean,
        default: true
      },
      // 是否必填
      required: {
        type: Boolean,
        default: false
      },
      // 是否数字必填，验证数字使用（部分情况，数字必填但又没有*，无法用required），数字为空时，设置为最小值
      numRequired: {
        type: Boolean,
        default: false
      },
      // 是否不可编辑
      disabled: {
        type: Boolean,
        default: false
      },
      // label文本
      label: {
        type: String,
        default: ''
      },
      // 圆角
      radius: {
        type: String,
        default: '5px'
      },
      inputName: {
        type: String,
        default: ''
      },
      inputId: {
        type: String,
        default: ''
      },
      holder: {
        type: String
      },
      inputWidth: {
        type: String,
        default: ''
      },
      inputHeight: {
        type: String,
        default: '40px'
      },
      // label宽度
      labelWidth: {
        type: String,
        default: '90px'
      },
      labelHeight: {
        type: String,
        default: '40px'
      },
      textareaNumberTip: { // inputType为textarea时字数提示
        type: Boolean,
        default: true
      },
      /* 内嵌格式icon */
      labelIcon: {
        type: String,
        default: 'glyphicon glyphicon-th-list'
      },
      value: {
        default: ''
      },
      hideFlag: {
        type: Boolean,
        default: false
      },
      /* 最小长度 */
      inputMinLenth: {
        type: Number
      },
      /* 输入字段的最大长度 */
      inputMaxLength: {
        type: Number,
        default: 64
      },
      textareaMaxLength: {
        type: Number,
        default: 200
      },
      inputStyle: {
        default: () => {
          return {}
        }
      },
      /* 是否警示输入不正确（边框变红） */
      isError: {
        type: Boolean,
        default: false
      },
      /* 是否点击enter时，进行查询 */
      query: {
        type: Boolean,
        default: false
      },
      /* disabled两种样式：label、common, 分别是文本、正常灰色背景 */
      disabledStyle: {
        type: String,
        default: 'label'
      },
      rule: {
        type: Object,
        default () {
          return null
        }
      }
//      isDebounce: {
//        type: Boolean,
//        default: true
//      }
    },
    data () {
      return {
        val: this.value,
        errorTip: ''
      }
    },
    computed: {
      textareaHeight () {
        var inputHeight = this.inputHeight
        var temp = (parseInt(inputHeight.replace(/px/, '')) < 64) ? '64px' : this.inputHeight
        console.log(temp)
        return temp
      },
      baseStyle () {
        return {
          width: this.inputWidth,
          height: this.inputHeight,
          borderRadius: this.radius,
          paddingLeft: this.labelWidth
        }
      }
    },
    watch: {
      value (val) {
        this.val = val
//        replace(/px/, '')
//        console.log(val)
//        var itv = ''
//        var self = this
//        if (self.inputType && self.inputType === 'textarea' && val === '') {
//          var elem = self.$el.getElementsByTagName('textarea')[0]
//          elem.style.height = '64px'
//        }
//        self.$nextTick(function () {
//          var maxHeight = parseInt(self.textareaHeight.replace(/px/, ''))
//          if (self.inputType && self.inputType === 'textarea') {
//            /* 高度 */
//            var elem = self.$el.getElementsByTagName('textarea')[0]
//            var conpensate = 2
//            if (elem.scrollHeight >= 64 && elem.scrollHeight <= maxHeight) {
//              var temp = 0
//              itv = setInterval(function () {
// //              elem.style.opacity = 0
//                elem.style.height = elem.scrollHeight + conpensate + 'px'
//                if (temp === elem.style.height || elem.scrollHeight <= 64) {
//                  clearItv()
//                  if (elem.scrollHeight <= 64) {
//                    elem.style.height = '64px'
//                  }
// //                elem.style.height = elem.scrollHeight + conpensate + 'px'
// //                elem.style.opacity = 1
//                } else {
//                  temp = elem.style.height
//                }
//              })
//            } else if (elem.scrollHeight > maxHeight) {
//              elem.style.height = maxHeight + 'px'
//            } else if (elem.scrollHeight < 64 && elem.scrollHeight > 0) {
//              elem.style.height = '64px'
//            } else {
//              console.log('error')
//            }
//          }
//        })
//        function clearItv () {
//          clearInterval(itv)
//        }
      }
    },
    methods: {
      validate () {
        this.errorTip = ''
        if (this.disabled) {
          return
        }
        if (this.required && this.val.length === 0) {
          this.errorTip = this.label ? '请输入' + this.label : this.holder
          return true
        }
        let rule = this.rule
        if (rule !== null) {
          // if ('len' in rule && (getByteLen(this.val) < rule.len.min || getByteLen(this.val) > rule.len.max)) {
          //   this.errorTip = rule.len.message
          //   return true
          // }
          if ('len' in rule && (this.val.length < rule.len.min || this.val.length > rule.len.max)) {
            this.errorTip = rule.len.message
            return true
          }
          if ('reg' in rule && !rule.reg.expression.test(this.val)) {
            this.errorTip = rule.reg.message
            return true
          }
        }
        return false
      },
      getholder () {
        if (this.disabled) {
          return ''
        } else if (this.holder === undefined) {
          return '请输入' + this.label
        } else {
          return this.holder
        }
      },
      getPaddingTop () {
        if (this.inputType !== 'textarea' && this.inputType !== 'file' && this.inputType !== 'div' && this.inputHeight.indexOf('px') !== -1) {
          return (parseInt(this.inputHeight) - 20) / 2 + 'px'
        } else {
          return '10px'
        }
      },
      updateValue: function (val, type) {
        // this.validate()
        this.val = val
        this.$emit('input', val)
        // this.$nextTick(() => {
        //   this.validate()
        // })
        this.validate()
      },
//      updateValue: _.debounce(function (val, type) {
//        this.val = val
//        this.$emit('input', val)
//      }, 500),
      validateNumber (val) {
        let value
        if (val === '') {
          value = this.numRequired && this.min ? this.min : ''
        } else if (!isNaN(val)) {
          if (this.min && (val - this.min < 0)) {
            console.log(val - this.min)
            value = this.min
          } else if (this.max && (val - this.max > 0)) {
            value = this.max
          } else {
            value = this.float ? parseFloat(val).toFixed(Number(this.fix)) : parseInt(val)
          }
        } else {
          value = this.min ? this.min : ''
          console.log(value)
        }
        /* if (this.float) {
          value = parseFloat(this.value).toFixed(Number(this.fix))
        } */
        this.val = value
        this.$emit('input', value)
      },
      updateEvent (evt) {
        this.$emit('previewImg', evt)
      },
      delImg (evt) {
        this.$emit('delImg', evt)
      },
      // 点击键盘enter，进行查询
      queryData () {
        if (!this.query) {
          return
        }
        this.$emit('queryData')
      }
    },
    mounted () {
      var self = this
      if (self.inputType && self.inputType === 'textarea') {
//        var elem = self.$el.getElementsByTagName('textarea')[0]
//        elem.style.height = '40px'
      }
    }
  }
</script>

<style scoped lang="less">
@import '../assets/less/variables.less';
.tip-text{
  color:@extra-light-black;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
input {
  box-shadow: none;
}
.segi_formInput {
  margin:0;
  position:relative;
  font-size:14px;
}
.segi_formInput .labelBox{
  width: 85px;
  text-align: left;
  position:absolute;
  top:0;
  left:0;
  font-weight: normal;
}
.segi_formInput .labelText{
  padding:0 10px;
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: @extra-light-silver;
  z-index: 20 !important;
  font-size: 13px;
  color: @light-black
;
}
.segi_formInput i:before{
  margin-right: 3px!important;
  margin-top: 3px!important;
  /*padding: 0;*/
  box-sizing: content-box;
}
.segi_formInput input{
  padding-left: 95px;
  position: initial;
  display: block;
  font-weight: 400;
  /*border-color: rgb(189, 189, 189);*/
  width: 100%;
  z-index: 10;
  border-radius: 0;
  max-width: 600px;
  display:inline;
}
/*.checkbox input:focus + i,.input input:focus,.radio input:focus + i,.select select:focus,.textarea textarea:focus,.toggle input:focus + i {
  border-color: rgb(50, 118, 177);
  box-shadow: none;
}
.checkbox input:hover + i,.input input:hover,.radio input:hover + i,.select select:hover,.textarea textarea:hover,.toggle input:hover + i {
  border-color: rgb(50, 118, 177);
  box-shadow: none;
}*/

.segi-input {
  text-align: left;
  display: inline-block;
  font-size:14px;
  position: relative;
}
.segi-input.error{
  input, textarea{
    border: 1px solid @primary-red;
  }
  .error-tip{
    position: absolute;
    top: 100%;
    color: @primary-red;
    font-size: 12px;
    min-width: 110px;
  }
}
.outsideLabel {
  color: @light-black;
  float: left;
  font-weight: normal;
  text-align:left;
  margin:0;
  line-height: 19px;
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
.segi-input label span {
  color: red;
}
.segi-input input {
  display:inline;
}
textarea:focus {
  border-color: @primary-blue;
  outline: 0;
  /*-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);*/
  /*box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);*/
}
.input-file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 1.25em;
  font-weight: 700;
  color: white;
  background-color: black;
  display: inline-block;
}
.inputfile:focus + label,
.inputfile + label:hover {
  background-color: red;
}
.form-control{
  border-color: @extra-light-silver;
}
.form-control[disabled] {
  background: @extra-light-gray;
  border: none;
  box-shadow: none;
}
.form-control:focus {
  border-color: @primary-blue;
  box-shadow: none;
  -webkit-box-shadow: none;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: @extra-light-black;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: @extra-light-black;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: @extra-light-black;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: @extra-light-black;
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

// 业务需要2个input支持响应式
.querycondition{
  .two-input{
    .flex-input-width{
      width: 133px;
    }
  }
}
@media screen and (min-width:1420px){
  .querycondition{
    .two-input{
      .flex-input-width{
        width: 168px;
      }
    }
  }
}
.div-input {
  color: @light-black
}
</style>

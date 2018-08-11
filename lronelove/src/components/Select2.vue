<!--颜色
@input-color @input-border-color @input-placeholder-color，@input-focus-border-color，@drop-options-hover-bg，@input-label-color，@primary-red
-->
<!--      props参数意义：
  required: 布尔类型，是否必填项，若为true则在label左上角显示一个红色*,
  label: 字符串类型，选择框前的标签，
  options: 数组类型， 选择框下面的可选项，
    options数组中对象的属性
    value: Number或者String类型，必填，v-model绑定的值输出的值也为这个
    name: String类型，必填，显示给用户的内容
  inputId: String类型，用于同一个组件在生命周期里面更换不同的数据的时候避免产生bug引入的问题。
  holder1: 字符串类型，选择框里面的placeholder.
  holder2: 字符串类型，搜索框里面的placeholder
  disable: 设置不可写
  select2获取值的方法
  直接用v-model绑定组件即可,为组件中options的value, 当inMultiple为true时,返回数组
  isMultiple: Boolean 类型, 标识是否支持多选
-->
<template>
  <div class="select2 clearfix" :class="{noMaxHeight: isPopover}" v-clickoutside="hide" style="position:relative" :style="{height:(isPopover) ? 'auto' : inputHeight}" ref="select2">
    <!--外嵌格式-->
    <div v-if="outside">
      <div v-if="!disabled || disabledStyle !== 'label'" class="hit clearfix" :class="{error: errorTip.length>0}" style="position: relative">
        <label class="outsideLabel" v-if="label" :style="{width: labelWidth, paddingTop: getPaddingTop(), paddingBottom: getPaddingTop()}"><span v-show="required">*</span>{{ label }}</label>
        <div class="error-tip" :style="{'left': labelWidth}" v-if="errorTip.length>0">{{errorTip}}</div>
        <div class="hit-right" :class="{numberClass: optionsType === 'number', popoverSelect: isPopover}">
          <input @click="toggle" :disabled="disabled" @keyup.esc.prevent="hide"  :class="{popoverSelect: isPopover}" type="text" class="form-control flex-input-width" v-model.trim="convertInputOptions" :placeholder="getholder()" :name="inputName" ref="inputRef" :style="{borderRadius: radius, width: inputWidth, height: (isPopover) ? 0 : inputHeight, opacity: (isPopover) ? 0 : 1}" readonly>
          <span v-if="!disabled" v-show="!isPopover" class="caret input-icon" @click="toggle"></span>
          <!--下拉菜单-->
          <!--前端数据--> <!--, marginLeft: getMargin()-->
          <div class="drop flex-input-width" v-if="client" v-show="show || isPopover" style="transform-origin: top center" :style="{width: dropWidth || inputWidth, top: top, transform: rotate}" :class="{popoverSelect: isPopover,clearfix: isPopover, dropUp: dropUp}">
            <div class="drop-top" v-if="options.length > 7 && !isPopover" :style="{transform: rotate}">
              <input type="text" class="form-control" v-model.trim="search" :placeholder="getSearchHolder()" :style="{height: searchHeight}">
              <span :style="{borderRadius: radius, height: searchHeight, lineHeight: searchHeight}" class="input-icon glyphicon glyphicon-search" style="font-size: 14px;"></span>
            </div>
            <ul class="dropdown-menu scrollbar" style="width:100%;" :style="{borderRadius: radius, transform: rotate}" :class="{multiple: isMultiple, inline: inlineClass, popoverSelect: isPopover, colorClass: optionsType === 'color'}">
              <li v-if="filterData.length===0"><a>没有数据</a></li>
              <!-- 增加d.disabled,选项不可选时，chooseValue直接返回 -->
              <li v-else @click="chooseValue(d.value, d.disabled)"v-for="d in filterData" :class="{ active: checkSelected(d.value), disabled: d.disabled }">
                <span></span>
                <i class="color-icon"  v-if="optionsType === 'color'" :style="{background: d.value}"></i>
                <a class="notSelect">{{ d.name }}</a>
              </li>
            </ul>
          </div>
          <!--后端数据-->
          <div class="drop flex-input-width" v-else v-show="show" style="transform-origin: top center" :style="{width: dropWidth || inputWidth, top: top, transform: rotate}">
            <div class="drop-top" :style="{transform: rotate}">
              <input @input="updateOptions" type="text" class="form-control" v-model.trim="search" :placeholder="getSearchHolder()" :style="{height: searchHeight}">
              <span :style="{borderRadius: radius, height: searchHeight, lineHeight: searchHeight}" class="input-icon glyphicon glyphicon-search"></span>
            </div>
            <ul :class="searchData.length ? 'dropdown-menu' : ''" :style="{borderRadius: radius,width: inputWidth, transform: rotate}" class="scrollbar">
              <li @click="chooseValue(d.value)"v-for="d in searchData" :class="{ active: checkSelected(d.value) }">
                <span></span>
                <i class="color-icon"  v-if="optionsType === 'color'" :style="{background: d.value}"></i>
                <a class="notSelect">{{ d.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <form-label v-else :label="label" :value="convertInputOptions" :labelWidth="labelWidth" :inputWidth="inputWidth"/>
    </div>
    <!--内嵌格式-->
    <div v-else class="clearfix">
      <label class="input segi_formInput" :style="{height:inputHeight}">
        <input @click="toggle" :disabled="disabled" @keyup.esc.prevent="hide" type="text" class="form-control" v-model.trim="convertInputOptions" :placeholder="getholder()" :name="inputName" ref="inputRef" :style="{width: inputWidth, height: inputHeight, borderRadius: radius, paddingLeft: labelWidth}" readonly>
        <span class="labelBox" :style="{height: inputHeight, lineHeight: inputHeight, width: labelWidth}">
          <span class="labelText"><i :class="labelIcon"></i>{{label}}<span v-show="required" style="color:@primary-red">*</span></span>
        </span>
        <button type="button"class="btn btn-default dropdown-toggle" :style="{borderRadius: radius, height: inputHeight, width: buttonWidth, marginLeft: buttonLeft}">
          <span :class="caret"></span>
        </button>
        <!-- 删除的功能 -->
        <!--<button  v-else type="button" @click.stop="clearValue" class="btn btn-default dropdown-toggle" :style="{borderRadius: radius, height: inputHeight, width: buttonWidth, marginLeft: -buttonWidth}">-->
        <!--<span class="glyphicon glyphicon-trash"></span>-->
        <!--</button>-->

        <!--下拉菜单-->
        <!--前端数据-->
        <div class="drop" v-if="client" v-show="show || isPopover" :style="{width: inputWidth}" :class="{popoverSelect: isPopover, dropUp: dropUp}">
          <div class="drop-top" v-if="options.length > 7">
            <input type="text" class="form-control" v-model.trim="search" :placeholder="getSearchHolder()" :style="{height: searchHeight}">
            <span :style="{borderRadius: radius, height: searchHeight, lineHeight: searchHeight}" class="input-icon glyphicon glyphicon-search"></span>
          </div>
          <ul class="dropdown-menu scrollbar" style="width:100%;" :style="{borderRadius: radius}" :class="{multiple: isMultiple, inline: inlineClass, popoverSelect: isPopover, colorClass: optionsType === 'color'}">
            <li v-if="filterData.length===0"><a>没有数据</a></li>
            <li v-else @click="chooseValue(d.value)" v-for="d in filterData" :class="{ active: checkSelected(d.value) }"><span></span><a class="notSelect">{{ d.name }}</a></li>
          </ul>
        </div>
        <!--后端数据-->
        <div class="drop" v-else v-show="show" :style="{width: inputWidth}">
          <div class="drop-top">
            <input @input="updateOptions" type="text" class="form-control" v-model.trim="search" :placeholder="getSearchHolder()" :style="{height: searchHeight}">
            <span :style="{borderRadius: radius, height: searchHeight, lineHeight: searchHeight}" class="input-icon glyphicon glyphicon-search"></span>
          </div>
          <ul :class="searchData.length ? 'dropdown-menu' : ''" :style="{borderRadius: radius,width: inputWidth}" class="scrollbar">
            <li @click="chooseValue(d.value)" v-for="d in searchData" :class="{ active: checkSelected(d.value) }"><span></span><a class="notSelect">{{ d.name }}</a></li>
          </ul>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import _ from 'lodash'
import { SHOW_TOAST } from '../store/types'
import FormLabel from './Label.vue'
// import tabArr from '../utils/tabArr'
export default {
  directives: {
    clickoutside
  },
  components: {FormLabel},
  props: {
   // 前端/后端数据，默认为前端数据
    client: {
      type: Boolean,
      default: true
    },
    // 后端数据的api
    url: {
      type: String,
      default: ''
    },
    outside: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Number, Array, Boolean]
    },
    holder1: {
      type: String
    },
    holder2: {
      type: String
    },
    inputName: {
      type: String,
      default: ''
    },
    inputId: {
      type: String,
      default: 'id'
    },
    /* 各部分的圆角 */
    radius: {
      type: String,
      default: '4px'
    },
    /* label宽度 和 输入框的margin-left，不能为auto */
    labelWidth: {
      type: String,
      default: '90px' // 10rem
    },
    /* 输入框宽度:50px-xx，注意：min-width:50px */
    inputWidth: {
      type: String,
      default: '' // 35rem
    },
    dropWidth: {
      type: String
    },
    /* 输入框高度:30px-50px，注意：对于整个select2，max-height:50px */
    inputHeight: {
      type: String,
      default: '40px' // 4rem
    },
    /* 搜索框高度 */
    searchHeight: {
      type: String,
      default: '35px' // 3.5rem
    },
    /* 按键宽度 */
    buttonWidth: {
      type: String,
      default: '40px' // 4rem
    },
    /* 下拉按键的图标，可以是其他图标 */
    caret: {
      type: String,
      default: 'caret'
    },
    /* 内嵌格式的icon */
    labelIcon: {
      type: String,
      default: 'glyphicon glyphicon-th-list'
    },
    /* 设置可写 */
    disabled: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 下拉列表，是否一行显示多个的样式
    inlineClass: {
      type: Boolean,
      default: false
    },
    isPopover: {
      type: Boolean,
      default: false
    },
    /* 是否警示输入不正确（边框变红） */
    isError: {
      type: Boolean,
      default: false
    },
    canClickOutside: {
      type: Boolean,
      default: true
    },
    /* 类型：普通‘text’，颜色‘color’,数字‘number’数字用于table组件的select */
    optionsType: {
      type: String,
      default: 'text'
    },
    /* disabled两种样式：label、common, 分别是文本、正常灰色背景 */
    disabledStyle: {
      type: String,
      default: 'label'
    },
    directionOverRide: {
      type: String,
      default: ''
    },
    useHolderTip: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value () {
      let self = this
//      setTimeout(function () {
      if (!self.isMultiple) {
        let flag = self.options.some((item) => { return item.value === self.value })
        if (flag) {
          self.options.forEach(function (item) {
            if (item.value === self.value) self.inputOption = _.cloneDeep(item)
          })
        } else {
          self.inputOption = {}
        }
      } else {
        let flag = self.options.some((item) => {
          return self.value.some((item2) => {
            return item.value === item2
          })
        })
        if (flag) {
          self.inputOption = self.isMultiple ? [] : {}
          self.inputOption.splice(0, self.inputOption.length)
          self.options.forEach(function (item) {
            // 如果传进来的是数组而且当前的项的值也在这个数组内, 就把对应的项设置为被选中的
            if (self.value instanceof Array && self.value.indexOf(item.value) > -1) {
              self.inputOption.push(_.cloneDeep(item))
            }
          })
        } else {
          self.inputOption = []
        }
      }
//      }, 0)
    }
  },
  mounted () {
    console.log(this.value)
    let self = this
    if (!self.isMultiple) {
      let flag = this.options.some((item) => { return item.value === self.value })
      if (flag) {
        this.options.forEach(function (item) {
          if (item.value === self.value) self.inputOption = _.cloneDeep(item)
        })
      } else {
        self.inputOption = {}
      }
    } else {
      /* let flag = this.options.some((item) => { return tabArr.indexOfTab(self.value, item.value) !== -1 })
      console.log(flag)
      if (flag) {
        this.options.forEach(function (item) {
          if (tabArr.indexOfTab(self.value, item.value) !== -1) self.inputOption.push(_.cloneDeep(item))
        })
      } else {
        self.inputOption = []
      } */
      let flag = this.options.some((item) => {
        return self.value.some((item2) => {
          return item.value === item2
        })
      })
      if (flag) {
        self.inputOption.splice(0, self.inputOption.length)
        this.options.forEach(function (item) {
          // 如果传进来的是数组而且当前的项的值也在这个数组内, 就把对应的项设置为被选中的
          if (self.value instanceof Array && self.value.indexOf(item.value) > -1) {
            self.inputOption.push(_.cloneDeep(item))
          }
        })
      } else {
        self.inputOption = []
      }
    }
  },
  data () {
    return {
      show: false,
      search: '',
      inputOption: this.isMultiple ? [] : {},
      searchData: [], // 增加后端数据
      dropUp: false,
      rotate: null,
      top: null,
      errorTip: ''
    }
  },
  computed: {
    convertInputOptions () {
      var self = this
      if (!this.isMultiple) {
        return self.inputOption.name
      } else {
        let temp = ''
        for (var i = 0; i < self.inputOption.length; i++) {
          if (i !== self.inputOption.length - 1) {
            temp += self.inputOption[i].name + ','
          } else {
            temp += self.inputOption[i].name
          }
        }
        return temp
      }
    },
    buttonLeft () {
      return -parseInt(this.buttonWidth) + 'px'
    },
    filterData () {
      const self = this
      return this.options.filter(function (item) {
        return item.name.indexOf(self.search) > -1
      })
    }
  },
  methods: {
//    /* 清空值的功能 */
//    clearValue () {
//      this.inputOption.name = ''
//      this.inputOption.value = null
//      this.$emit('input', this.inputOption.value)
//    },
    getInputOption () {
      let self = this
      if (!self.isMultiple) {
        let flag = this.options.some((item) => { return item.value === self.value })
        if (flag) {
          this.options.forEach(function (item) {
            if (item.value === self.value) self.inputOption = _.cloneDeep(item)
          })
        } else {
          self.inputOption = {}
        }
      } else {
        let flag = this.options.some((item) => {
          return self.value.some((item2) => {
            return item.value === item2
          })
        })
        if (flag) {
          self.inputOption.splice(0, self.inputOption.length)
          this.options.forEach(function (item) {
            // 如果传进来的是数组而且当前的项的值也在这个数组内, 就把对应的项设置为被选中的
            if (self.value instanceof Array && self.value.indexOf(item.value) > -1) {
              self.inputOption.push(_.cloneDeep(item))
            }
          })
        } else {
          self.inputOption = []
        }
      }
    },
    validate () {
      if (this.disabled) {
        return
      }
      this.errorTip = ''
      if (this.required && this.value.length === 0) {
        this.errorTip = this.useHolderTip ? this.holder1 : (this.label ? '请选择' + this.label : this.holder1)
        return true
      }
      return false
    },
    getholder () {
      if (this.disabled) {
        return ''
      } else if (this.holder1 === undefined) {
        return '请选择' + this.label
      } else {
        return this.holder1
      }
    },
    getSearchHolder () {
      if (this.holder2 === undefined) {
        return '搜索' + this.label
      } else {
        return this.holder2
      }
    },
    getPaddingTop () {
      if (this.inputHeight.indexOf('px') !== -1) {
        return (parseInt(this.inputHeight) - 20) / 2 + 'px'
      } else {
        return '10px'
      }
    },
    /* 点击下落，再点击回退 */
    toggle () {
//      var self = this
      if (this.disabled) {
        return
      }
      this.show = !this.show
      if (!this.show) {
        this.search = ''
        this.rotate = null
        this.top = null
      } else {
        let hit = this.$refs.inputRef
        let box = hit.getBoundingClientRect()
        if (this.directionOverRide === '' && box.bottom > (window.innerHeight / 2) && this.$refs.select2.offsetTop > 280) {
          this.top = '-10px'
          this.rotate = `rotate(180deg)`
        } else if (this.directionOverRide === 'top') {
          this.top = '-10px'
          this.rotate = `rotate(180deg)`
        }
//        let element = this.$el
//        let bottomDiff = document.getElementsByTagName('body')[0].getBoundingClientRect().bottom -
//          element.getElementsByClassName('hit')[0].getBoundingClientRect().bottom
//        console.log(bottomDiff)
//        setTimeout(function () {
//          if (bottomDiff < element.getElementsByTagName('ul')[0].offsetHeight) {
//            self.dropUp = true
//          } else {
//            self.dropUp = false
//          }
//        }, 0)
      }
    },
    /* 隐藏选项栏 */
    hide () {
      if (this.canClickOutside) {
        this.show = false
        this.search = ''
      }
    },
    /* 选择一个或多个值 */
    chooseValue (value, disabled) {
      if (disabled) return
      const self = this
      if (!this.isMultiple) {
        if (this.client) {
          self.options.forEach(function (item) {
            if (item.value === value) {
              self.inputOption = _.cloneDeep(item)
            }
          })
        } else {
          self.searchData.forEach(function (item) {
            if (item.value === value) {
              self.inputOption = _.cloneDeep(item)
            }
          })
        }
        self.toggle()
        this.$emit('input', value)
        this.$nextTick(() => {
          this.validate()
        })
      } else {
        if (this.client) {
          // 记录该项是否在已被选中的数组中,如果在并记录其位置, item 是选中项
          let flag = {
            isSelected: false,
            index: 0,
            item: null
          }
          // 遍历选中项数组,判断该项是否已被选中
          self.inputOption.forEach(function (item, index) {
            if (item.value === value) {
              flag.isSelected = true
              flag.index = index
            }
          })
          // 如果该项在选中项数组中,把其剔除
          if (flag.isSelected) {
            self.inputOption.splice(flag.index, 1)
          } else {
            self.options.forEach(function (item) {
              if (item.value === value) {
                flag.item = item
              }
            })
            self.inputOption.push(_.cloneDeep(flag.item))
          }
        } else {
          self.searchData.forEach(function (item) {
            let flag = {
              isSelected: false,
              index: 0,
              item: null
            }
            self.inputOption.forEach(function (item, index) {
              if (item.value === value) {
                flag.isSelected = true
                flag.index = index
              }
            })
            if (flag.isSelected) {
              self.inputOption.splice(flag.index, 1)
            } else {
              self.options.forEach(function (item) {
                if (item.value === value) {
                  flag.item = item
                }
              })
              self.inputOption.push(_.cloneDeep(flag.item))
            }
          })
        }
        this.$emit('input', this.inputOption.map(function (item) {
          return item.value
        }))
      }
    },
    /* 不同情况的下拉菜单margin-left */
    getMargin () {
      if (this.outside) {
        return this.label === '' ? 0 : this.labelWidth
      } else {
        return 0
      }
    },
    /* 从后端获取数据 */
    updateOptions: _.debounce(function () {
      let url = this.url + '?name=' + this.search
      if (this.search) {
        this.$http.get(url, {search: this.search}, {emulateJSON: true}).then((res) => {
          this.searchData = res.data ? res.data : []
          if (this.searchData.length === 0) {
            this.$store.dispatch(SHOW_TOAST, '查不到相关数据')
          }
        }, (res) => {
          this.$store.dispatch(SHOW_TOAST, '查不到相关数据')
        })
      } else {
        this.searchData = []
      }
    }, 1200),
    /* 判断输入参数对应的item 是否存在于self.inputOption中 */
    checkSelected (value) {
      if (!this.isMultiple) {
        return this.inputOption.value === value
      } else {
        return this.inputOption.some((item) => {
          return item.value === value
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  .drop.dropUp {
    top: auto;
    bottom: 100%;
    border: 1px solid @input-border-color;
    border-bottom: none;
    /*margin-bottom: 2px;*/
  }
  .dropUp .dropdown-menu {
    box-shadow: none;
  }
  .popoverSelect.form-control{
    border: none;
    padding-top: 0;
    padding-bottom: 0;
  }
  .popoverSelect.form-control:focus{
    border: none;
  }
  .popoverSelect.drop{
    border:none;
    position: relative;
    box-shadow: none;
    margin-top: 0px;
  }
  .popoverSelect.dropdown-toggle{
    display: none;
  }
  .popoverSelect.dropdown-menu{
    margin-top: 1px;
    box-shadow: none;
    border: none;
  }
  input {
    box-shadow: none;
  }
  input:focus {
    box-shadow: none;
  }
  /*select样式*/
  .select2 {
    max-height: 50px;
    position: initial;
    display: inline-block;
    font-size:14px;
    color: @drop-options-color;
  }
  .select2.noMaxHeight{
    max-height: none
  }
  .hit {
    width: 100%;
  }
  .form-control[readonly] {
    background: white;
  }
  .hit-right.popoverSelect{
    vertical-align: top;
  }
  /*placeholder颜色*/
  .hit-right input::-webkit-input-placeholder { /* WebKit browsers */
    color: @input-placeholder-color;
  }
  .hit-right input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: @input-placeholder-color;
  }
  .hit-right input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: @input-placeholder-color;
  }
  .hit-right input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: @input-placeholder-color;
  }
  /*outsidelabel*/
  .select2 .outsideLabel {
    float: left;
    font-weight: normal;
    text-align:left;
    margin:0;
    line-height: 20px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding: 10px 5px 10px 0;
    color: @input-label-color;
  }
  .select2 .outsideLabel:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  /*required颜色*/
  .hit label span {
    color: @primary-red;
  }
  /*右边*/
  .hit-right {
    display: inline-block;
    font-size:0; /*避免inline-block的间隙问题*/
    position: relative;
  }
  .hit-right input {
    min-width:50px;
    display: inline;
    cursor: pointer;
    font-size:14px; /**/
    padding: 5px 25px 5px 10px;
    border: 1px solid @input-border-color;
    color: @input-color;
  }
  .hit-right>input:focus{
    box-shadow: none;
    -webkit-box-shadow: none;
    border: 1px solid @input-focus-border-color;
  }
  .hit-right .drop-top input:focus{
    border-bottom: 1px solid @input-focus-border-color;
  }
  /*table使用.numberClass*/
  .numberClass.hit-right input{
    padding: 5px;
  }
  .numberClass .caret.input-icon{
    right: 5px;
    top: 48%;
  }
  .numberClass .dropdown-menu{
    padding: 4px 0;
  }
  .numberClass .dropdown-menu > li > a {
    padding: 3px 10px;
  }
  /*input-disabled*/
  .hit-right input:disabled{
    border: none;
    box-shadow: none;
    cursor: not-allowed;
    background-color: @input-disable-bg;
  }
  /*input-error*/
  .hit.error .hit-right>input{
    border: 1px solid @primary-red;
  }
  .error-tip{
    position: absolute;
    top: 100%;
    color: @primary-red;
    font-size: 12px;
  }
  .hit.error .hit-right input + button {
    border-color: @primary-red;
  }
  /*.hit-right button {
    position: initial;
    top: 0;
    right: 0;
    margin-left: -40px;
    vertical-align: top;
  }*/
  /*下拉菜单*/
  .drop {
    position:absolute;
    z-index:100;
    border:1px solid @input-border-color;
    background:@white;
    margin-top:5px;
    border-radius: 4px;
    box-shadow: @drop-shadow;
  }
  /*下拉菜单上部分-搜索框*/
  .drop-top {
    position:relative;
    padding:0 10px;
    margin-top: 5px;
    margin-bottom: 2px;
  }
  .drop-top input {
    min-width:50px;
    border-top:none;
    border-left:none;
    border-right:none;
    border-radius: 0;
    padding: 5px 25px 5px 0;
  }
  .drop-top .glyphicon-search {
    position: absolute;
    top: 0;
    right:10px;
    padding:0;
    text-align:center;
  }
  .caret.input-icon{
    position: absolute;right: 10px;top: 49%;
    cursor: pointer;
    border-top: 5px dashed;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
  }
  .input-icon{
    color: @input-icon-color;
  }
  /*下拉菜单下部分-scrollbar样式*/
  /* .dropdown-menu::-webkit-scrollbar{
    width: 8px;
    height:10px;
    background-color: #f5f5f5;
    padding:0;
  }
  .dropdown-menu::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background-color: #aaa;
  } */
  /*下拉菜单下部分*/
  .dropdown-menu {
    display: block;
    position: relative;
    max-height: 19rem;
    overflow-y: auto;
    margin: 0;
    min-width:50px;
    border:none;
    box-shadow: none;
    padding: 6px 0;
  }
  /*普通类型*/
  .dropdown-menu li {
    position: relative;
    cursor:pointer;
  }
  // 增加disabled
  .dropdown-menu{
    li.disabled {
      cursor: not-allowed;
      a, a:hover{
        color: @extra-light-black;
      }
    }
    // checkbox类型，span置灰
    &.inline li.disabled>span{
      background: @gray;
      cursor: not-allowed;
      &:hover {
        border-color: @extra-light-silver; /*改*/
      }
    }
  }
  .dropdown-menu li.active a{
    background-color: @drop-options-active-bg;
    color: @white;
  }
  .dropdown-menu>li>a{
    padding: 8px 20px;
    line-height: 20px;
    color:@drop-options-color;
  }
  .dropdown-menu>li>a:focus, .dropdown-menu>li>a:hover {
    color: inherit;
    text-decoration: none;
    background-color: @drop-options-hover-bg;
  }
  .dropdown-menu>li.active>a:focus, .dropdown-menu>li.active>a:hover {
    background-color: @drop-options-active-bg;
    color: @white;
  }
  /*multiple类型*/
  .dropdown-menu.multiple li.active a{
    background-color: @white;
    color: @drop-options-active-bg;
  }
  .dropdown-menu.multiple li.active a:hover{
    background-color: @drop-options-hover-bg;
  }
  .dropdown-menu.multiple li.active:after{
    position: absolute;
    right: 10px;
    top: 5px;
    content: '\2714';
    color: @drop-options-active-bg;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  /* color类型 */
  .dropdown-menu.colorClass{
    li>a{
      padding-left: 30px;
    }
    li>i{
      display: inline-block;
      width: 14px;
      height: 14px;
      left: 10px;
      border-radius: 2px;
      top: 11px;
      position: absolute;
    }
  }
  /*inline类型*/
  .dropdown-menu.inline{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-start;
    justify-content: flex-start;
    -webkit-align-items: flex-start;
    -webkit-justify-content: flex-start;
  }
  .inline li {
    display:inline-block;
    text-align:left;
    margin: 1%;
    width:31%;
    cursor: pointer;
    vertical-align:top;
  }
  .dropdown-menu.inline>li>a {
    padding:3px 3px 3px 25px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
  }
  .dropdown-menu.inline.popoverSelect>li>a, .dropdown-menu.inline>li>a:hover {
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
    background-color: transparent;
  }
  .dropdown-menu.inline li.active a:hover{
    background-color: transparent;
  }
  .dropdown-menu.inline li.active, .dropdown-menu.inline li.active a {
    background-color: @white;
    color:@drop-options-color;
  }
  .dropdown-menu.inline li.active:after{
    content: '';
  }
  /*checkbox样式*/
  .notSelect{
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .dropdown-menu.inline li>span:hover {
    border-color: @drop-options-active-bg; /*改*/
  }
  .dropdown-menu.inline li>span{
    vertical-align:middle;
    font-size:14px;
    width: 18px;
    height: 18px;
    line-height:10px;
    border: 1px solid @extra-light-silver;
    margin-right: 5px;
    border-radius: 3px;
    display: inline-block;
    text-align:center;
    background:@white;
    cursor:pointer;
    position: absolute;
    left: 3px;
    top: 4px;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46); /*改*/
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    -moz-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }
  .dropdown-menu.inline li>span:before{
    content: '\a0'
  }
  .dropdown-menu.inline li.active>span {
    background-color: @drop-options-active-bg;
    border-color: #00a0e2; /*改*/
  }
  .dropdown-menu.inline li>span::before {
    transform: rotate(45deg) scaleY(0);
    -webkit-transform: rotate(45deg) scaleY(0);
    -moz-transform: rotate(45deg) scaleY(0);
    /* transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;*/
    transform-origin: center;
    -webkit-transform-origin: center;
    -moz-transform-origin: center; /*改*/
  }
  .dropdown-menu.inline li.active>span:before{
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
  }

.segi_formInput {
  margin:0;
  position:relative;
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
  border-right-color: #BDBDBD;
  z-index: 20 !important;
  font-size: 13px;
  color: #A2A2A2;
}
.segi_formInput button{
  position: absolute;
  right:0;
  top:0;
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
  /* border-color: rgb(189, 189, 189); */
  width: 100%;
  z-index: 10;
  border-radius: 0;
  max-width: 600px;
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
.querycondition .house-select .select2{
  vertical-align: top;
}
.querycondition .house-select .house-select-2{
  margin-left: 5px;
}
.querycondition .house-select .house-select-3{
  margin-left: 5px;
}
.querycondition .house-select .flex-input-width{
  width: 87px;
}
.querycondition .house-select .drop{
  width: 270px;
}
.querycondition .house-select .house-select-2 .drop{
  left: -92px;
}
.querycondition .house-select .house-select-3 .drop{
  left: -184px;
}
@media screen and (min-width:1420px){
  .querycondition .house-select .flex-input-width{
    width: 110px;
  }
  .querycondition .house-select .drop{
    width: 340px;
  }
  .querycondition .house-select .house-select-2 .drop{
    left: -115px;
  }
  .querycondition .house-select .house-select-3 .drop{
    left: -230px;
  }
}

// 业务需要2个input支持响应式
.querycondition{
  .two-input{
    .flex-input-width{
      width: 133px;
    }
    .first-input{
      .drop{
        width: 270px;
      }
      .flex-input-width{
        margin-right: 4px;
      }
    }
    .second-input .drop{
      width: 270px;
      left: -137px;
    }
  }
}
@media screen and (min-width:1420px){
  .querycondition{
    .two-input{
      .flex-input-width{
        width: 168px;
      }
      .first-input .drop{
        width: 340px;
      }
      .second-input .drop{
        width: 340px;
        left: -172px;
      }
    }
  }
}

/*.checkbox{
  margin-top: 5px;
  margin-bottom: 10px;
}*/
/* .checkbox input:focus + i,.input input:focus,.radio input:focus + i,.select select:focus,.textarea textarea:focus,.toggle input:focus + i {
  border-color: rgb(50, 118, 177);
  box-shadow: none;
}
.checkbox input:hover + i,.input input:hover,.radio input:hover + i,.select select:hover,.textarea textarea:hover,.toggle input:hover + i {
  border-color: rgb(50, 118, 177);
  box-shadow: none;
} */
</style>

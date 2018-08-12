<template>
  <div class="datePicker clearfix" v-clickoutside="hide" style="position:relative;" :style="{height:inputHeight}">
    <div class="hit clearfix" :class="{error: isError || !times.length}">
      <!--左边-->
      <label class="outsideLabel" v-if="label" :style="{width: labelWidth, paddingTop: getPaddingTop(), paddingBottom: getPaddingTop()}"><span v-show="required">*</span>{{ label }}</label>
      <!--右边-->
      <div class="hit-right">
        <input  @click="toggle" :disabled="disabled" @keyup.esc.prevent="hide" type="text" class="form-control" v-model="computedDateTime" :placeholder="disabled ? '' : holder" ref="inputRef" :style="{borderRadius: radius, width: inputWidth, height: inputHeight}" readonly>
        <!-- <span v-if="!disabled" :class="btnIcon" class="input-icon" style="position: absolute;font-size: 14px;right: 10px;" :style="{lineHeight: inputHeight}"></span> -->
        <span @click="toggle" v-if="!disabled" class="input-icon" style="position: absolute;width: 14px;height:15px;right: 10px;top:13px;cursor:pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 13 14" enable-background="new 0 0 13 14" xml:space="preserve">
            <path fill="#C0CCDA" d="M11,4v8H2V4H11 M12,2H1C0.4,2,0,2.4,0,3v10c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V3C13,2.4,12.6,2,12,2L12,2
                z"/>
            <path fill="#C0CCDA" d="M9,7H8C7.4,7,7,7.4,7,8v1c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V8C10,7.4,9.6,7,9,7L9,7z"/>
            <path fill="#C0CCDA" d="M10,0H9C8.4,0,8,0.4,8,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C11,0.4,10.6,0,10,0L10,0z M4,0H3
                C2.4,0,2,0.4,2,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C5,0.4,4.6,0,4,0L4,0z"/>
          </svg>
        </span>
        <div v-if="!times.length" style="font-size:14px;position:absolute;bottom:-20px;color:#f74444;">查不到可选时间段</div>
        <!--下拉菜单-->
        <div class="drop" v-show="showDatePicker"  :style="{top: top}">
          <div class="calendar-panel" style="transform-origin: top center;":style="{transform: rotate, width: inputWidth}">
            <div :style="{transform: rotate}">
              <!--头部-->
              <div class="calendar-panel-header clearfix">
                <div class="year" v-show="stage === 0">选择日期</div>
                <div class="year" v-show="stage === 1">选择时间段<button class="btn btn-primary btn-text pull-right" @click="hide()" style="margin-right:5px;">确定</button></div>
              </div>
              <!--日期-->
              <div v-show="stage === 0" class="calendar-content">
                <span v-for="(item, index) in dates" :key="index" :class="{selected: item.dateFullString === selectedDate}" @click="selectDate(item)">
                  <a class="link">{{item.dateString}}</a>
                  <div>{{item.dayString}}</div>
                </span>
              </div>
              <!--时间段-->
              <div v-show="stage === 1" class="calendar-content">
                <span class="time" v-for="(time, index) in times" :key="index" :class="{selected: time.value === selectedTime}" @click="selectTime(time)">
                  {{time.name}}
                </span>
                <loading v-show="loading" style="width:100%;overflow:hidden;"/>
                <div v-show="!times.length && !loading" class="no-times">查不到可选时间段</div>
              </div>
              <!-- 底部 -->
              <div class="calendar-panel-footer clearfix" @click="toggleStage()">
                <div class="hour pull-right" style="cursor:pointer;">
                  <span class="input-icon glyphicon glyphicon-time" v-if="stage === 0"></span>
                  <span class="input-icon" style="width: 13px;height:14px;display:inline-block;" v-if="stage === 1">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       viewBox="0 0 13 14" enable-background="new 0 0 13 14" xml:space="preserve">
                      <path class="svg-calendar" d="M11,4v8H2V4H11 M12,2H1C0.4,2,0,2.4,0,3v10c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V3C13,2.4,12.6,2,12,2L12,2
                            z"/>
                      <path class="svg-calendar" d="M9,7H8C7.4,7,7,7.4,7,8v1c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V8C10,7.4,9.6,7,9,7L9,7z"/>
                      <path class="svg-calendar" d="M10,0H9C8.4,0,8,0.4,8,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C11,0.4,10.6,0,10,0L10,0z M4,0H3
                            C2.4,0,2,0.4,2,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C5,0.4,4.6,0,4,0L4,0z"/>
                    </svg>
                  </span>
                  <span class="footer-text">{{stage === 0 ? '选择时间段':'选择日期'}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import loading from 'components/LoadingIcon'

export default {
  directives: {
    clickoutside
  },
  components: {loading},
  props: {

    // calendar的props
    /* 从字典表获取times */
    times: {
      type: Array,
      default: () => {
        return []
      }
    },

    /* loading动画 */
    loading: {
      type: Boolean,
      default: false
    },

    /* 默认选中的日期 */
    value: {
      type: Object,
      default: () => {
        return {
          date: '',
          times: ''
        }
      }
    },

    /* 布尔类型，是否必填项，若为true则在label左上角显示一个红色* */
    required: {
      type: Boolean,
      default: false
    },

    /* 字符串类型，输入框前的标签文本 */
    label: {
      type: String,
      default: ''
    },

    /* 字符串类型，输入框里面的placeholder. */
    holder: {
      type: String,
      default: '请选择日期和时间段'
    },

    /* 各部分的圆角 */
    radius: {
      type: String,
      default: '4px'
    },

    /* label宽度 和 输入框的margin-left，不能为auto */
    labelWidth: {
      type: String,
      default: '90px'
    },

    /* 输入框宽度:160px-xx，注意：下拉菜单min-width:160px */
    inputWidth: {
      type: String,
      default: '340px'
    },

    /* 输入框高度:30px-50px，注意：对于整个datePicker，max-height:50px */
    inputHeight: {
      type: String,
      default: '40px'
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

    /* 是否警示输入不正确（边框变红） */
    isError: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      top: null,
      rotate: null,
      showDatePicker: false,
      btnIcon: 'glyphicon glyphicon-time',
      timeIcon: 'glyphicon glyphicon-time',
      stage: 0,
      date: new Date(),
      dates: [],
      selectedTime: '',
      selectedTimeName: '',
      selectedDate: ''
    }
  },
  computed: {
    computedDateTime () {
      return this.selectedDate ? `${this.selectedDate} ${this.selectedTimeName.replace(' ~ ', '~')}` : ''
    }
  },
  methods: {
    toggleStage () {
      this.stage = this.stage ? 0 : 1
    },

    // input方法
    /* 点击下落，再点击回退 */
    toggle () {
      if (this.disabled) {
        return
      }
      this.showDatePicker = !this.showDatePicker
      this.stage = 0

      if (this.showDatePicker) {
        let hit = this.$refs.inputRef
        let box = hit.getBoundingClientRect()

        if (box.bottom > (window.screen.availHeight / 2)) {
          this.top = '-10px'
          this.rotate = 'rotate(180deg)'
        }
      } else {
        this.top = null
        this.rotate = null
      }
    },

    /* 隐藏选项栏 */
    hide () {
      this.showDatePicker = false
      this.stage = 0
    },

    /* 不同情况的下拉菜单margin-left */
    getMargin () {
      if (this.outside) {
        return this.label === '' ? 0 : this.labelWidth
      } else {
        return 0
      }
    },
    getPaddingTop () {
      if (this.inputHeight.indexOf('px') !== -1) {
        return (parseInt(this.inputHeight) - 20) / 2 + 'px'
      } else {
        return '10px'
      }
    },

    /* 业务相关 */
    // 时间对象转字符串
    dateToString (value, type) {
      if (type === 'mm-dd') {
        return (!value || value === '' || value === undefined) ? '' : `${value.getMonth() + 1}-${value.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      } else {
        return (!value || value === '' || value === undefined) ? '' : `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      }
    },

    // 获取星期几
    dateToDay (value) {
      let weekDay = {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六'}
      let day = value.getDay()
      return weekDay[+day]
    },

    // 选择日期，跳转到选择时间
    selectDate (item) {
      this.selectedDate = item.dateFullString
      this.stage = 1
    },

    // 选择时间
    selectTime (time) {
      this.selectedTime = time.value
      this.selectedTimeName = time.name
      this.showDatePicker = false
    },
    getSelectedTime () {
      this.selectedDate = this.dates[0].dateFullString

      if (this.times.length) {
        this.selectedTime = this.times[0].value
        this.selectedTimeName = this.times[0].name
      }
      console.log(this.selectedTime, this.times)
    },
    getDates () {
      let date = this.date

      for (let i = 0; i < 8; i++) {
        let item = new Date(+date + 1000 * 60 * 60 * 24 * i)
        let dateFullString = this.dateToString(item)
        let dateString = this.dateToString(item, 'mm-dd')
        let dayString = this.dateToDay(item)
        this.dates.push({date: item, dateFullString: dateFullString, dateString: dateString, dayString: dayString})
      }
//      this.selectedDate = this.dates[0].dateFullString
    }
  },
  watch: {
    'selectedDate' (val) {
      console.log('selectedDate')
      let value = {date: this.selectedDate, times: this.selectedTime}
      this.$emit('input', value)
      console.log(value)
    },
    'selectedTime' (val) {
      console.log('selectedTime')
      let value = {date: this.selectedDate, times: this.selectedTime}
      this.$emit('input', value)
      console.log(value)
    },
    'times' (val) {
      this.getSelectedTime()
    }
  },
  created () {
    this.getDates()
    this.getSelectedTime()
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  a{
   text-decoration:none;
  }
  ul,li{
    list-style-type:none;
    padding:0;
    margin:0;
  }
  input {
    box-shadow: none;
  }
  .datePicker {
    font-size:14px;
  }
  .inline-flex {
    display: -webkit-inline-flex;
    display: -ms-inline-flexbox;
    display: inline-flex;
  }
  .flex-nowrap{
    -webkit-flex-wrap: nowrap;
    -moz-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    -o-flex-wrap: nowrap;
    flex-wrap:nowrap;
  }

  /*日历面板*/
  .calendar-panel {
    width: 360px;
    position: absolute;
    color: @drop-options-color;
    border-radius: 4px;
    border: 1px solid @extra-light-silver;
    box-shadow: @drop-shadow;
    background-color: @white;
    user-select: none;
    font-size:12px;
    padding: 15px 10px;
    margin-top: 5px;
  }
  .calendar-panel-header {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    margin-bottom: 10px;
  }
  .calendar-panel-header span {
   cursor:pointer;
  }

  .year {
    flex: 2;
    color: @silver;
    font-size: 16px;
    margin: 0 1%;
  }

  .calendar-content {
    display: -webkit-flex;display: flex;
    justify-content: flex-start;-webkit-justify-content: flex-start;
    flex-wrap: wrap;-webkit-flex-wrap: wrap;
    align-items: center;-webkit-align-items: center;
  }
  .calendar-content span{
    display: block;
    width: 23%;
    margin: 1%;
    text-align: center;
    cursor: pointer;
    color: inherit;
    padding: 5px 0;
    border: 1px solid @drop-options-border-color;
  }
  .calendar-content .time{
    width: 31%;
    font-size: 14px;
  }
  .calendar-content span:hover{
    background: @drop-options-hover-bg;
  }
  .calendar-content .link{
    display: block;
    margin-bottom: 5px;
    margin-top:2px;
    color: inherit;
    text-align: center;
    cursor: pointer;
  }
  .calendar-content .available:hover {
    color: @drop-options-active-bg;
  }
  .calendar-content .selected {
    color: @white;
    background-color: @drop-options-active-bg;
    border: 1px solid transparent;
  }
  .calendar-content .selected:hover {
    color: @white;
    background-color: @drop-options-active-bg;
  }

  /*input*/
  .flex-left {
    display: -webkit-inline-flex;
    display: inline-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: flex-start;
    -webkit-align-items: flex-start;
  }
  .datePicker {
    max-height: 50px;
    position: initial;
    display: inline-block;
  }
  .datePicker .outsideLabel{
    float:left;
    font-weight: normal;
    text-align:left;
    margin:0;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding: 10px 5px 10px 0;
    line-height: 20px;
    color: @input-label-color;
  }
  .datePicker .outsideLabel:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  .hit {
    width: 100%;
  }
  .hit-right {
    display: inline-block;
    font-size:0; /*避免inline-block的间隙问题*/
    position: relative;
  }
  .hit-right input {
    min-width:160px;
    display: inline;
    cursor: pointer;
    font-size:14px; /*.hit-right font-size:0;*/
    padding-right: 32px;
    border: 1px solid @input-border-color;
    color: @input-color;
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
  .hit-right input:focus{
    box-shadow: none;
    -webkit-box-shadow: none;
    border: 1px solid @input-focus-border-color;
  }
  .hit-right button {
    position: initial;
    top: 0;
    right: 0;
    /* margin-left: -3px;*/
    /* 修改样式 */
    margin-left: -40px;
    /*margin-top: -10px;*/
    vertical-align: top;
  }
  .hit label span {
    color: @primary-red;
  }
  .drop {
    position:absolute;
    z-index:100;
  }
  .form-control[readonly] {
    background: @white;
  }

  .glyphicon{
    position: initial;
  }
  .hit-right input:focus{
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .hit-right input:disabled{
    border: none;
    box-shadow: none;
    cursor: not-allowed;
    background-color: @input-disable-bg;
  }
  .hit.error input{
    border: 1px solid @primary-red;
  }
  .hit.error .hit-right input + button {
      border-color: @primary-red;
  }
  .input-icon{
    color: @input-icon-color;
  }
  .no-times{
    padding: 10px 0;
    font-size: 12px;
    color: @extra-light-black;
  }
  .calendar-panel-footer{
    color: @light-black;
    margin: 5px 10px 0 10px;
    line-height: 20px;
    font-size: 0;
    svg{
      vertical-align: top;
    }
    .svg-calendar{
      fill: #c0ccda;
    }
    &:hover span{
      color:@primary-blue;
    }
    &:hover .svg-calendar{
      fill: @primary-blue;
    }
    span{
      vertical-align: middle;
      font-size: 14px;
    }
    .footer-text{
      font-size: 14px;
      margin-left: 5px;
    }
  }
</style>

<!--颜色
@input-color @input-border-color @silver，@extra-light-black，@light-silver，@drop-options-active-bg，@drop-options-hover-bg，@drop-options-color，@primary-red
-->
<!--
子组件选中日期的函数(选中时间的函数类似)：
selectDate (e) {
  ... this.$emit('input', new Date(this.computedDateTime))  ...// 时间转为date类型，并通过input传递给父组件，父组件通过v-model绑定时间
}
对应的父组件：
<date-picker label="时间" v-model="date"/>
data () {
  return {
    date: new Date() // 或者''
  }
}
可以在父组件中通过this.dateTime获取选中的日期时间值

两个datePicker实现日期范围选择：
<date-picker label="申请时间" v-model="lastDate"/>
<date-picker label="至" v-model="nextDate" :lastDateValue="lastDate" />
data () {
    return {
      lastDate: new Date(new Date().getTime() - 3600 * 24 * 365 * 1000), // 365天之前
      nextDate: new Date(), //今天
    }
}
1.第二个datePicker的lastDateValue = 第一个datePicker的v-model
-->
<template>
  <div class="datePicker clearfix" v-clickoutside="hide" style="position:relative;" :style="{height:inputHeight, width:getDatePickerWidth()}" ref="picker">
    <!--外嵌格式 input-->
    <div v-if="!disabled || disabledStyle !== 'label'" class="hit clearfix" :class="{error: isError}">
      <!--lineHeight: inputHeight, -->
      <label class="outsideLabel" v-if="label" :style="{width: labelWidth, paddingTop: getPaddingTop(), paddingBottom: getPaddingTop()}"><span v-show="required">*</span>{{ label }}</label>
      <div class="hit-right">
        <input  @click="toggle" :disabled="disabled" @keyup.esc.prevent="hide" type="text" class="form-control flex-input-width" v-model="computedDateTime" :placeholder="disabled ? '' : holder" :name="inputName" :id="inputId" ref="inputRef" :style="{borderRadius: radius, width: inputWidth, height: inputHeight}" readonly>
        <!-- <span v-if="!disabled" :class="btnIcon" class="input-icon" style="position: absolute;font-size: 14px;right: 10px;" :style="{lineHeight: inputHeight}"></span> -->
        <span @click="toggle" v-if="!disabled" class="input-icon" style="position: absolute;width: 14px;height:15px;right: 10px;top:13px;cursor:pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 13 14" enable-background="new 0 0 13 14" xml:space="preserve">
          <g>
            <g>
              <path fill="#C0CCDA" d="M11,4v8H2V4H11 M12,2H1C0.4,2,0,2.4,0,3v10c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V3C13,2.4,12.6,2,12,2L12,2
                z"/>
            </g>
          </g>
          <g>
            <g>
              <path fill="#C0CCDA" d="M9,7H8C7.4,7,7,7.4,7,8v1c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V8C10,7.4,9.6,7,9,7L9,7z"/>
            </g>
          </g>
          <g>
            <g>
              <path fill="#C0CCDA" d="M10,0H9C8.4,0,8,0.4,8,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C11,0.4,10.6,0,10,0L10,0z M4,0H3
                C2.4,0,2,0.4,2,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C5,0.4,4.6,0,4,0L4,0z"/>
            </g>
          </g>
          </svg>
        </span>
        <!--calendar下拉菜单--> <!--:style="{marginLeft: getMargin()}"-->
        <div class="drop" v-show="showDatePicker"  style="transform-origin: top center" :style="{transform: rotate, top: top}">
          <div class="calendar-panel" :style="{width: dropWidth || inputWidth, transform: rotate}" ref="drop">
            <!--头部-->
            <div class="calendar-panel-header" :class="!datePicker ? 'confirm-btn' : ''">
              <div class="year" @click="selectYear" v-if="datePicker">{{year}}年{{month}}月</div>
              <div class="prev-arrow" @click="prevMonth" v-if="stage === 0 && datePicker"></div>
              <div  class="next-arrow" @click="nextMonth" v-if="stage === 0 && datePicker"></div>
              <div v-if="stage === 3 || !datePicker">
                <button class="btn btn-primary btn-text" @click="hide()">确定</button>
              </div>
            </div>
            <!--日历选择页-->
            <div class="calendar-panel-content" v-show="stage === 0" v-if="datePicker">
              <div class="calendar-header">
                <span v-for="(item, index) of weeks" :key="index" v-text="item"></span>
              </div>
              <div class="calendar-content">
                  <a v-for="(item,index) of dates" :key="index" class="prev-month" v-if="index < firstDay - 1" v-text="item"></a>
                  <a 
                    v-for="(item,index) of dates" 
                    :key="index"
                    @click.prevent="selectDate($event,isAvailable(item))" 
                    :class="[{selected: isSelected && 
                      item === Number(selectDay) && 
                      index > firstDay - 2 && 
                      index < lastDay + firstDay - 1, today: isToday && 
                      item === currentDay && 
                      index > firstDay - 2 && 
                      index < lastDay + firstDay - 1},isAvailable(item)]" 
                    v-if="index > firstDay - 2 && index < lastDay + firstDay - 1" 
                    v-text="(isToday && item === currentDay && 
                      index > firstDay - 2 && 
                      index < lastDay + firstDay - 1) ? '今天' : item" 
                    :data-index="item"
                  >
                  </a>
                  <a 
                    v-for="(item,index) of dates" 
                    :key="index" 
                    class="next-month" 
                    v-if="index > lastDay + firstDay - 2" 
                    v-text="item">
                  </a>
              </div>
            </div>
            <!--年份选择页-->
            <div class="calendar-year" v-show="stage === 1" v-if="datePicker">
              <ul>
                <li v-for="item of yearList" :key="item.toString()" v-text="item" @click="selectMonth(item)"></li>
              </ul>
            </div>
            <!--月份选择页-->
            <div class="calendar-month" v-show="stage === 2" v-if="datePicker">
              <ul>
                <li v-for="item of monthList" :key="item.toString()" v-text="item" @click="render(item)"></li>
              </ul>
            </div>
            <!--时间选择页-->
            <div v-show="stage===3 || !datePicker" v-if="timePicker" style="height: 224px;">
              <div class="timeFrame">
                <span>
                  <span :style="{width: accurate === 'second' ? '60px' : '100px'}">{{hour}}</span>
                  <span style="width:10px;">:</span>
                  <span :style="{width: accurate === 'second' ? '60px' : '100px'}">{{minute}}</span>
                  <span v-if="accurate === 'second'" style="width:10px;">:</span>
                  <span v-if="accurate === 'second'">{{second}}</span>
                </span>
              </div>
              <div class="calendar-time" style="position:relative;z-index:2;">
                <div class="scrollbar" :id="id1" ref="hour" @wheel="scrollTime($event, 'hour')" @mousewheel="scrollTime($event, 'hour')" @DOMMouseScroll="scrollTime($event, 'hour')">
                  <ul class="calendar-hours">
                    <li 
                      :style="{width: accurate === 'second' ? '70px' : '110px'}" 
                      class="hover" 
                      v-for="(hr, index) in hourList"
                      :key="index" 
                      v-text="hr" 
                      :class="{active: hour === hr}" 
                      @click.stop="select('hour', hr)"
                      >
                    </li>
                  </ul>
                </div>
                <div class="scrollbar" :id="id2" ref="minute" @wheel="scrollTime($event, 'minute')" @mousewheel="scrollTime($event, 'minute')" @DOMMouseScroll="scrollTime($event, 'minute')">
                  <ul class="calendar-minutes">
                    <li 
                      :style="{width: accurate === 'second' ? '70px' : '110px'}" 
                      class="hover" 
                      v-for="(m, index) in minuteList"
                      :key="index" 
                      v-text="m" 
                      :class="{active: minute === m}" 
                      @click.stop="select('minute', m)"
                      >
                    </li>
                  </ul>
                </div>
                <div 
                  class="scrollbar" 
                  v-if="accurate === 'second'" 
                  :id="id3" 
                  ref="second" 
                  @wheel="scrollTime($event, 'second')" 
                  @mousewheel="scrollTime($event, 'second')" 
                  @DOMMouseScroll="scrollTime($event, 'second')"
                >
                  <ul class="calendar-seconds">
                    <li 
                      class="hover" 
                      v-for="(s, index) in secondList" 
                      v-text="s" 
                      :class="{active: second === s}" 
                      @click.stop="select('second', s)"
                      :key="index"
                    ></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="calendar-panel-footer clearfix">
              <div 
                class="hour pull-right" 
                v-if="timePicker && datePicker" 
                v-show="stage === 0 || stage === 3 " 
                @click="selectTime" 
                style="cursor:pointer;"
              >
                <span class="input-icon glyphicon glyphicon-time" v-if="datePicker && stage === 0"></span>
                <span class="input-icon" style="width: 13px;height:14px;display:inline-block;" v-if="datePicker && stage === 3">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 13 14" enable-background="new 0 0 13 14" xml:space="preserve">
                  <g>
                    <g>
                      <path class="svg-calendar" d="M11,4v8H2V4H11 M12,2H1C0.4,2,0,2.4,0,3v10c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1V3C13,2.4,12.6,2,12,2L12,2
                        z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path class="svg-calendar" d="M9,7H8C7.4,7,7,7.4,7,8v1c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V8C10,7.4,9.6,7,9,7L9,7z"/>
                    </g>
                  </g>
                  <g>
                    <g>
                      <path class="svg-calendar" d="M10,0H9C8.4,0,8,0.4,8,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C11,0.4,10.6,0,10,0L10,0z M4,0H3
                        C2.4,0,2,0.4,2,1v2c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V1C5,0.4,4.6,0,4,0L4,0z"/>
                    </g>
                  </g>
                  </svg>
                </span>
                <span class="footer-text">{{stage === 0 ? '选择时间':'选择日期'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form-label v-else :label="label" :value="computedDateTime" :labelWidth="labelWidth" :inputWidth="inputWidth"/>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import FormLabel from './Label.vue'
import _ from 'lodash'
// let val = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
export default {
  directives: {
    clickoutside
  },
  components: {FormLabel},
  props: {
    // calendar的props
    /* 默认选中的日期 */
    value: {
      type: [String, Date],
      default: () => {
        return new Date()
      }
    },
    /* 可选的第一个日期,前面日期为不可选状态，用于选择日期范围 */
    lastDateValue: {
      type: [String, Date],
      default: ''
    },
    maxValue: {
      type: [String, Date],
      default: ''
    },
    /* 是否有timePicker */
    timePicker: {
      type: Boolean,
      default: true
    },
    /* 是否有datePicker */
    datePicker: {
      type: Boolean,
      default: true
    },
    /* accurate: 时间精确到分钟'minute'/秒'second' */
    accurate: {
      type: String,
      default: 'second'
    },
    /* 一个页面多个timePicker，需要设置id，因为时间选择时，改变其scrollTop, 需要有唯一id(见methods中的 select (type, value)) */
    inputId: {
      type: [String, Number],
      default: 'picker1'
    },
    // input的props
    /* 是否外嵌样式 */
    outside: {
      type: Boolean,
      default: true
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
      default: '请选择日期'
    },
    /* 输入框 name属性 */
    inputName: {
      type: String,
      default: ''
    },
    /* 输入框 id
    inputId: {
      type: String,
      default: ''
    }, */
    /* 各部分的圆角 */
    radius: {
      type: String,
      default: '4px'
    },
    /* 外嵌格式的整体宽度，labelWidth+inputWidth （使用外嵌格式，且改变labelWidth或inputWidth时，需要设置） */
    datePickerWidth: {
      type: String,
      default: '490px'
    },
    /* label宽度 和 输入框的margin-left，不能为auto */
    labelWidth: {
      type: String,
      default: '90px'
    },
    /* 输入框宽度:160px-xx，注意：下拉菜单min-width:160px */
    inputWidth: {
      type: String
    },
    dropWidth: {
      type: String
    },
    /* 输入框高度:30px-50px，注意：对于整个datePicker，max-height:50px */
    inputHeight: {
      type: String,
      default: '40px'
    },
    /* 按键宽度 */
    buttonWidth: {
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
    },
    /* disabled两种样式：label、common, 分别是文本、正常灰色背景 */
    disabledStyle: {
      type: String,
      default: 'label'
    }
  },
  data () {
    return {
      // calendar数据
      showDatePicker: false,
      dateValue: '',
      // timeValue: ''  改为computed属性
      time: new Date().getTime(),
      dates: [],
      year: 0,
      currentYear: new Date().getFullYear(),
      month: 0,
      currentMonth: new Date().getMonth() + 1,
      today: 0,
      currentDay: new Date().getDate(),
      firstDay: 0,
      lastDay: 0,
      weeks: ['一', '二', '三', '四', '五', '六', '日'],
      stage: 0,
      yearList: [],
      monthList: [],
      hourList: [],
      minuteList: [],
      secondList: [],
      hour: 0,
      minute: '00',
      second: '00',
      selectDay: 0,
      timeIcon: 'glyphicon glyphicon-time',
      btnIcon: 'glyphicon glyphicon-time',
      id1: this.inputId + 'hour',
      id2: this.inputId + 'minute',
      id3: this.inputId + 'second',
      top: null,
      rotate: null
    }
  },
  computed: {
    // calendar计算属性
    date () {
      return this.value ? _.cloneDeep(this.value) : new Date()
    },
    isSelected () {
      if (this.dateValue) {
        return this.year === +this.dateValue.substr(0, 4) && this.month === +this.dateValue.substr(5, 2)
      } else {
        return this.isToday
      }
    },
    isToday () {
      return this.year === this.currentYear && this.month === this.currentMonth
    },
    timeValue () {
      const h = this.hour ? this.hour : '0'
      const m = this.minute ? this.minute : '00'
      const s = this.second ? this.second : '00'
      if (this.hour || this.minute || this.second) {
        return `${h}:${m}:${s}`
      } else {
        return ''
      }
    
    },
    computedDateTime () {
      if (this.value) {
        let val
        if (this.datePicker) {
          if (this.timePicker) {
            val = (this.accurate === 'second') ? `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()} ${this.value.getHours()}:${this.value.getMinutes()}:${this.value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1') : `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()} ${this.value.getHours()}:${this.value.getMinutes()}`.replace(/\b(\w)\b/g, '0$1')
          } else {
            val = `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`.replace(/\b(\w)\b/g, '0$1')
          }
        } else {
          if (this.timePicker) {
            val = (this.accurate === 'second') ? `${this.value.getHours()}:${this.value.getMinutes()}:${this.value.getSeconds()}`.replace(/\b(\w)\b/g, '0$1') : `${this.value.getHours()}:${this.value.getMinutes()}`.replace(/\b(\w)\b/g, '0$1')
          } else {
            val = ''
          }
        }
        return val
      } else {
        return ''
      }
    }
  },
  methods: {
    // input方法
    /* 点击下落，再点击回退 */
    toggle () {
      if (this.disabled) {
        return
      }
      this.showDatePicker = !this.showDatePicker
      this.stage = 0
      if (this.showDatePicker) {  // 打开
        let hit = this.$refs.inputRef
        let box = hit.getBoundingClientRect()
        if (box.bottom > (window.innerHeight / 2) && this.$refs.picker.offsetTop > 310) {
          this.top = '0px'
          this.rotate = 'rotate(180deg)'
        }
      } else { // 关闭
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

    /* 不同情况的整体宽度 */
    getDatePickerWidth () {
      if (this.outside) {
        return this.label === '' ? this.inputWidth : this.inputWidth + this.labelWidth
      } else {
        return this.inputWidth
      }
    },
    getPaddingTop () {
      if (this.inputHeight.indexOf('px') !== -1) {
        return (parseInt(this.inputHeight) - 20) / 2 + 'px'
      } else {
        return '10px'
      }
    },

    // calendar方法
    prevYear () {
      this.date.setFullYear(this.date.getFullYear() - 1)
      this.getCal()
    },
    prevMonth () {
      if (this.date.getMonth() === 0) {
        this.date.setFullYear(this.date.getFullYear() - 1)
        this.date.setMonth(11)
      } else {
        this.date.setMonth(this.date.getMonth() - 1)
      }
      this.getCal()
    },
    nextMonth () {
      if (this.date.getMonth() + 1 > 11) {
        this.date.setFullYear(this.date.getFullYear() + 1)
        this.date.setMonth(0)
      } else {
        this.date.setMonth(this.date.getMonth() + 1)
      }
      this.getCal()
    },
    nextYear () {
      this.date.setFullYear(this.date.getFullYear() + 1)
      this.getCal()
    },
    getCal (month) {
      const dates = []
      let years = this.date.getFullYear()
      let months = this.date.getMonth()
      let firstDay = new Date(years, months, 1).getDay() // 当月第一天是星期几
      let lastDay = new Date(years, months + 1, 0).getDate() // 求出当月共有几天

      // 当月
      let count = 0
      let i = 1
      let index = firstDay - 1 - 1

      if (firstDay === 0) {
        index = 5
      }

      if (firstDay === 1) {
        index = 6
      }
      count = index // 如星期天，前两天就是星期五，5

      while (count++ < lastDay + index) { // count++,6
        dates[count] = i++  // dates[count]，放到数组的第7个位置，与星期天对应
      }
      // 上个月
      let prevLastDay = new Date(years, months, 0).getDate() // 上个月共有几天
      let prevCount = firstDay - 1

      if (firstDay === 0) {
        prevCount = 6
      }

      if (firstDay === 1) {
        prevCount = 7
      }

      while (prevCount--) {
        dates[prevCount] = prevLastDay--
      }

      // 下个月
      let nextI = 0
      let nextCount = 42 - lastDay - (firstDay - 1)
      let nextIndex = lastDay + firstDay - 1

      if (firstDay === 0) {
        nextCount = 42 - lastDay - 6
        nextIndex = lastDay + 6
      }

      if (firstDay === 1) {
        nextCount = 42 - lastDay - 7
        nextIndex = lastDay + 7
      }

      while (nextCount--) {
        dates[nextIndex + nextI] = nextI + 1
        nextI++
      }
      this.dates = dates
      this.year = this.date.getFullYear()
      this.month = this.date.getMonth() + 1
      this.today = this.date.getDate()
      this.firstDay = firstDay

      if (firstDay === 0) {
        this.firstDay = 7
      }

      if (firstDay === 1) {
        this.firstDay = 8
      }
      this.lastDay = lastDay
    },
    selectYear () {
      this.stage = 1
    },
    selectMonth (value) {
      this.date.setFullYear(value)
      this.year = value // 改变year值
      this.stage = 2
    },
    render (value) {
      value = parseInt(value) - 1
      this.stage = 0
      this.date.setMonth(value)
      this.month = value + 1 // 改变month值
      this.getCal()
    },
    // 增加updateDateTime函数
    updateDateTime () {
      let d
      if (this.dateValue) {
        d = this.dateValue
      } else if (this.value) {
        d = `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      } else {
        d = `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      }
      return this.timePicker ? (d + ' ' + this.timeValue) : d
    },
    selectDate (e, type) {
      console.info('selectDate  sdlsjdlsjdljaljkldjlajdflkjsakf')
      const day = e.target.dataset.index

      if (!day || type === 'prev') {
        return
      }
      const date = new Date(this.date.getFullYear(), this.date.getMonth(), day)
      const value = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      this.dateValue = value
      let dateTimeValue = this.updateDateTime()

      this.$emit('input', new Date(dateTimeValue))
      this.time = date.getTime()
      this.selectDay = value.substr(8, 2)

      if (!this.timePicker) this.showDatePicker = false

      if (this.timePicker) this.stage = 3
    },
    // 增加selectTime 和select方法
    selectTime () {
      if (this.stage === 0) {
        this.stage = 3
      } else if (this.stage === 3) {
        this.stage = 0
      }
    },
    select (type, value) {
      if (type === 'hour') {
        this.hour = value
        this.date.setHours(value)
      } else if (type === 'minute') {
        this.minute = value
        this.date.setMinutes(value)
      } else if (type === 'second') {
        this.second = value
        this.date.setSeconds(value)
      }
      let dateTimeValue = this.updateDateTime()
      this.$emit('input', new Date(dateTimeValue))
    },
    scrollTime (e, type) {
      e.preventDefault()
      let wheelRange = -e.wheelDeltaY || e.deltaY || -e.wheelDelta || e.detail

      if (wheelRange > 0) {
        switch (type) {
          case 'hour':
            this.$refs.hour.scrollTop += 30
            break
          case 'minute':
            this.$refs.minute.scrollTop += 30
            break
          case 'second':
            this.$refs.second.scrollTop += 30
        }
      } else {
        switch (type) {
          case 'hour':
            this.$refs.hour.scrollTop -= 30
            break
          case 'minute':
            this.$refs.minute.scrollTop -= 30
            break
          case 'second':
            this.$refs.second.scrollTop -= 30
            break
        }
      }
    },
    compareTime (begin, end) {
      let beginString = `${begin.getFullYear()}-${begin.getMonth() + 1}-${begin.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      let endString = `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`.replace(/\b(\w)\b/g, '0$1')
      return (+new Date(beginString)) - (+new Date(endString))
    },
    // 增加方法，用于选择时间范围时，第二个datePicker样式设置
    isAvailable (item) {
      let now = new Date(this.year + '/' + this.month + '/' + item)
      let min = this.lastDateValue
      let max = this.maxValue
      if ((this.lastDateValue && 
          this.compareTime(now, min, 'date') < 0) || (this.maxValue && this.compareTime(now, max, 'date') > 0)) {
        return 'prev'
      } else {
        return 'available'
      }
    },
    setValue () {
      if (this.value) {
        console.log('dateTime change')

        // 设置dateValue，才能更新选中日期，isSelected
        const value = `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`.replace(/\b(\w)\b/g, '0$1')
        this.dateValue = value
        this.selectDay = this.value.getDate()

        // 设置hour,minute,second，更新时间面板
        this.hour = this.value.getHours()
        this.minute = this.value.getMinutes() < 10 ? '0' + this.value.getMinutes() : this.value.getMinutes()
        this.second = this.value.getSeconds() < 10 ? '0' + this.value.getSeconds() : this.value.getSeconds()
        this.time = this.value.getTime()

        // 设置date的year,month，调用getCal,才能更新年和月
        this.date.setFullYear(this.value.getFullYear())
        this.date.setMonth(this.value.getMonth())
        this.getCal()
      }
    }
  },

  // 增加watch，当第一个datePicker日期变化时，第二个关联的datePicker进行变化
  watch: {
    'value' (val) {
      if (val) {
        this.setValue()
      } else {
        this.dateValue = ''
        this.hour = 0
        this.minute = '00'
        this.second = '00'
        this.time = new Date().getTime()
        this.selectDay = 0
        this.date.setFullYear(new Date().getFullYear())
        this.date.setMonth(new Date().getMonth())
        this.getCal()
      }
    },
    'lastDateValue' (val) {
      if (val) {
        let hour = val.getHours()
        let minute = val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes()
        let second = val.getSeconds() < 10 ? '0' + val.getSeconds() : val.getSeconds()
        let lastTime = val.getTime()
        let nextTime

        if (this.dateValue !== '') { // 第二个日期已选择，再改变第一个日期

          // 第二个日期已选择时，computedDateTime不会是''，直接取时间
          nextTime = new Date(this.computedDateTime).getTime()

          if (!this.timePicker) this.showDatePicker = false
        } else if (this.dateValue === '') { // 选择第一个日期，未选择第二个日期

          // 如果computedDateTime不是''，比较第一个日期和computedDateTime
          if (this.computedDateTime) {
            nextTime = new Date(this.computedDateTime).getTime()
          } else {

            // computedDateTime是'',则无默认选项，翻页选择日期1时，应该让日期2也翻页，需重设年、月
            this.$emit('input', val) // 增加：当第一个日期选中，第二个日期为''，设置第二个日期=第一个日期
            this.date.setFullYear(val.getFullYear())
            this.date.setMonth(val.getMonth())
            this.getCal()
          }
        }

        // 如果第一个日期大于第二个日期，则将第二个日期设置为第一个日期
        if (nextTime && lastTime > nextTime) {
          this.year = val.getFullYear()
          this.month = val.getMonth()
          this.dateValue = `${val.getFullYear()}-${val.getMonth() + 1}-${val.getDate()}`.replace(/\b(\w)\b/g, '0$1')
          this.hour = hour
          this.minute = minute
          this.second = second
          let dateTimeValue = this.updateDateTime()
          this.$emit('input', new Date(dateTimeValue))
          this.time = lastTime
          this.selectDay = val.getDate()
          this.date.setFullYear(val.getFullYear())
          this.date.setMonth(val.getMonth())
          this.getCal()
        }
      }
    },
    'stage' (val) {
      if (val === 0) {
        this.timeIcon = 'glyphicon glyphicon-time'
      } else if (val === 3) {
        this.timeIcon = 'glyphicon glyphicon-calendar'
      }
    }
  },
  created () {
    this.getCal()
    const prevYear = []
    const nextYear = []
    const currentYear = new Date().getFullYear()
    let i = 0

    while (i++ < 10) {
      prevYear.unshift(currentYear - i)
    }
    i = 0

    while (i++ < 10) {
      nextYear.push(currentYear + i)
    }
    this.yearList = [...prevYear, currentYear, ...nextYear]

    // 月份
    i = 0

    while (i++ < 12) {
      this.monthList.push(`${i}月`)
    }
    // hours 增加时间

    i = -1
    while (i++ < 23) {
      this.hourList.push(i)
    }

    // minutes
    i = -1

    while (i++ < 59) {
      i = i < 10 ? '0' + i : i
      this.minuteList.push(i)
    }

    // seconds
    i = -1

    while (i++ < 59) {
      i = i < 10 ? '0' + i : i
      this.secondList.push(i)
    }
  },
  mounted () {
    this.setValue()
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

  /*日历面板*/
  .calendar-panel-footer{
    color: @light-black;
    margin: 5px 30px 0 30px;
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
      fill: @primary-blue
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
  /*增加.hour*/
  .calendar-panel {
    width: 340px;
    height: 310px;
    /*position: absolute;*/
    color: @drop-options-color;
    border-radius: 4px;
    border: 1px solid @input-border-color;
    box-shadow: @drop-shadow;
    margin-top: 5px;
    background-color: @white;
    user-select: none;
    font-size:12px;
  }

  .calendar-panel-header {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    align-items: center;
    margin: 15px 25px 10px 25px;
    &.confirm-btn{
      display: block;
      text-align: right;
    }
  }
  .calendar-panel-header span {
   cursor:pointer;
  }

  .year {
    flex: 2;
    color: @silver;
    font-size: 16px;
    cursor: pointer;
  }
  .prev-arrow {
    width: 15px;
    height: 15px;
    margin-right: 30px;
    cursor: pointer;
    border: 1px solid @silver;
    border-bottom-width: 0;
    border-left-width: 0;
    transform: rotate(-45deg) translateY(10px);
  }
  .next-arrow {
    width: 15px;
    height: 15px;
    margin-right: 23px;
    cursor: pointer;
    border: 1px solid @silver;
    border-top-width: 0;
    border-left-width: 0;
    transform: rotate(45deg) translateY(-5px);
  }

  .calendar-panel-content {
    min-width: 220px;
    max-width: 320px;
    margin: 0 auto;
    padding: 0 15px;
  }
  .calendar-header {
    display: -webkit-flex;display: flex;
    justify-content: space-between;-webkit-justify-content: space-between;
    color: @light-silver;
  }
  .calendar-header span {
    display: block;
    width: 45px;
    line-height: 36px;
    text-align: center;
  }

  .calendar-content {
    display: -webkit-flex;display: flex;
    justify-content: space-between;-webkit-justify-content: space-between;
    flex-wrap: wrap;-webkit-flex-wrap: wrap;
    align-items: center;-webkit-align-items: center;
  }
  .calendar-content a {
    display: block;
    width: 13%;
    margin-bottom: 5px;
    color: inherit;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
  }
  .calendar-content .available:hover {
    color: @drop-options-active-bg;
  }
  .calendar-content .prev-month, .calendar-content .next-month, .calendar-content a.prev {
    color: #d3dadd;
    cursor: default;
    pointer-events:none;
  }
  .calendar-content .today {
    border:1px solid @drop-options-border-color;
  }
  .calendar-content .selected {
    color: @white;
    background-color: @drop-options-active-bg;
    border: 1px solid transparent;
  }
  .calendar-content .selected:hover {
    color: @white;
  }

  .calendar-year {
    position: relative;
  }

/*  .year-shadow-before {
    width: 100%;
    position: absolute;
    top: 0;
    height: 60px;
    pointer-events: none;
    background: linear-gradient(to bottom, @white, transparent);
  }

  .year-shadow-after {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 60px;
    pointer-events: none;
    background: linear-gradient(to top, @white, transparent);
  }*/

  .calendar-year ul {
    display: -webkit-flex;display: flex;
    justify-content: space-between;-webkit-justify-content: space-between;
    flex-wrap: wrap;-webkit-flex-wrap: wrap;
    height: 210px;
    margin: 20px 20px 20px;
    overflow: auto;
  }
  .calendar-year ul li{
    margin-right: 17px;
	margin-bottom: 20px;
	font-size: 18px;
	cursor: pointer;
	text-align: center;
  }
  .calendar-year ul::-webkit-scrollbar{
    display: none;
  }

  .calendar-month ul {
    display: -webkit-flex;display: flex;
    flex-wrap: wrap;-webkit-flex-wrap: wrap;
    height: 210px;
    margin: 20px 20px 20px;
    overflow: auto;
  }
  .calendar-month ul li{
	width: 25%;
	margin-bottom: 40px;
	text-align: center;
	cursor: pointer;
	font-size: 20px;
  }
  .calendar-month ul::-webkit-scrollbar{
    display: none;
  }
  /*新增calendar-time*/
  .calendar-time {
    padding-top: 10px;
    display: -webkit-flex;display: flex;
    justify-content: center;-webkit-justify-content: center;
    -webkit-flex-flow: row-reverse nowrap;
    flex-flow:row nowrap;
  }
  .calendar-time div {
    height:180px;
    overflow-x: hide;
    overflow-y: auto;
  }
  /* .calendar-time div::-webkit-scrollbar{
    display: none;
    width: 8px;
    background-color: #F5F5F5;
  }
  定义滑块 内阴影+圆角
  .calendar-time div::-webkit-scrollbar-thumb
  {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
      background-color: #aaa;
  } */
  .calendar-time ul li{
	width: 70px;
	height:30px;
	padding:5px;
	text-align: center;
	cursor: pointer;
	font-size:14px;
	margin:0 5px;
    color:@drop-options-color;
  }
  .calendar-time ul li:hover{
    background:@drop-options-hover-bg;
  }
  .calendar-time ul::-webkit-scrollbar{
      display: none;
  }
  .calendar-time ul li.unable{
    color:@input-icon-color;
    background:@input-disable-bg;
    cursor:not-allowed;
  }
  .timeFrame {
    position:relative;
    height:30px;
    /* width:70%;
    margin-left:15%;
    margin-right:15%; */
    text-align:center;
  }
  .timeFrame>span{
    border-bottom: 1px solid @input-border-color;
    border-top: 1px solid @input-border-color;
    line-height:30px;
    display:inline-block;
  }
  .timeFrame>span>span{
    font-weight:bold;
    position:relative;
    vertical-align:middle;
    display: inline-block;
    line-height:36px;
    width: 60px;
    text-align: center;
    font-size: 14px;
    margin: 0 3px;
    color: @drop-options-active-bg;
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
    font-size:14px;
    color: @drop-options-color;
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
    min-width:120px;
    display: inline;
    cursor: pointer;
    font-size:14px; /*.hit-right font-size:0;*/
    padding: 5px 30px 5px 10px;
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
  /* .hit-right button {
    position: initial;
    top: 0;
    right: 0;
    修改样式
    margin-left: -40px;
    vertical-align: top;
  } */
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
    border-right-color: @extra-light-black;
    z-index: 20 !important;
    font-size: 13px;
    color: @light-silver;
  }
  .segi_formInput button{
    position: absolute;
    right:0;
    top:0;
  }
  .segi_formInput i:before{
    margin-right: 3px!important;
    margin-top: 3px!important;
    box-sizing: content-box;
  }
  .segi_formInput input{
    padding-left: 95px;
    position: initial;
    display: block;
    font-weight: 400;
    width: 100%;
    z-index: 10;
    border-radius: 0;
    max-width: 600px;
  }
  .glyphicon{
    position: initial;
  }
  .hit-right input:focus{
    box-shadow: none;
    -webkit-box-shadow: none;
    border: 1px solid @input-focus-border-color;
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
  .checkbox input:focus + i,.input input:focus,.radio input:focus + i,.select select:focus,.textarea textarea:focus,.toggle input:focus + i {
    border-color: rgb(50, 118, 177);
    box-shadow: none;
  }
  .checkbox input:hover + i,.input input:hover,.radio input:hover + i,.select select:hover,.textarea textarea:hover,.toggle input:hover + i {
    border-color: rgb(50, 118, 177);
    box-shadow: none;
  }
  .input-icon{
    color: @input-icon-color;
  }
  .flex-input-width{
    width: 340px;
  }
  /* queryCondition中的响应式布局，业务相关 */
  .querycondition .date-begin-end .flex-input-width{
    width: 123px;
  }
  .querycondition .date-begin-end .calendar-year ul, .querycondition .date-begin-end .calendar-month ul{
     margin: 10px 20px 15px 20px;
     height: 210px;
   }
  .querycondition .date-begin-end .calendar-year ul li{
    margin: 10px;
  }
  .querycondition .date-begin-end .calendar-month ul li{
    margin: 15px 0;
  }
  .querycondition .date-end .drop, .date-end .drop{
    right:0;
  }
  .querycondition .date-end .outsideLabel{
    width: 24px !important;
    text-align: center;
    color: @input-border-color;
    padding-right: 0;
  }
  .querycondition .flex-input-width{
    width: 270px;
  }
  .querycondition .date-begin-end .calendar-panel{
    width: 270px;
    height: 290px;
  }
  @media screen and (min-width:1420px){
    .querycondition .flex-input-width{
      width: 340px
    }
    .querycondition .date-begin-end .flex-input-width{
      width: 158px;
    }
    .querycondition .date-begin-end .calendar-panel{
      width: 340px;
      height: 300px;
    }
  }
</style>

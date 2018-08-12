<!--TrackStep组件:用于工单查询的‘详情’模态框中，工单追踪步骤-->
<template>
  <div class="track-step flex-start-top"> <!--:style="isLast ? activeStep : ''"-->
    
    <!--左边-->
    <slot name="left">
      <div class="step-left">
        <template v-if="dateTime">
          <p class="step-time">{{time}}</p>
          <p class="step-date">{{date}}</p>
        </template>
      </div>
    </slot>
    
    <!--右边-->
    <div class="step-right flex-1">
      <div class="step-content">
        <div v-if="iconType==='normal'" class="step-icon">{{title}}</div> <!--:style="isLast ? activeIcon : ''" -->
        <div v-if="iconType==='cust'">
          <span class="cust-icon" :class="{disabled: disabled}"></span>
          <p class="cust-title" v-if="title">{{title}}</p>
        </div>
        <slot name="content">
          <div class="step-text">{{text}}</div>
        </slot>
        <slot name="remarks">
          <div class="step-remarks">{{remarks}}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import ct from '../utils/convertTime'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    dateTime: {
      type: [String, Number],
      default: ''
    },
    text: {
      type: String,
      default: ''
    },

    // 备注信息
    remarks: {
      type: String,
      default: ''
    },

    // 是否最下面一行,没有下划线
    isFirst: {
      type: Boolean,
      default: false
    },

    // 是否最后一步
    isLast: {
      type: Boolean,
      default: false
    },

    // 最后一步的文字样式
    activeStep: {
      type: Object,
      default: () => {
        return {
          color: '@black'
        }
      }
    },

    // 最后一步的圆圈样式
    activeIcon: {
      type: Object,
      default: () => {
        return {
          border: '1px solid #00a0e2', // #1cd391
          background: '#19afe7',
          lineHeight: '24px',
          textAlign: 'center',
          color: '#fff'
        }
      }
    },

    // iconType:normal普通环节，cust自定义环节
    iconType: {
      type: String,
      default: 'normal'
    },

    // disabled:自定义环节，如果为true，置灰
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      date: '',
      time: ''
    }
  },
  methods: {
  },
  mounted () {
    if (this.dateTime && typeof +this.dateTime === 'number') {
      let dateTime = new Date(+this.dateTime)
      this.date = ct.dateToString(dateTime, 'dateOnly')
      this.time = ct.dateToString(dateTime, 'hh:mm')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/variables.less';

p{
  margin: 0;
  padding:0;
}
.track-step{
  text-align:left;
  font-size:14px;
  line-height:22px;
  color: @black;
  position:relative;
}
.flex-start-top {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  -webkit-align-items: flex-start;
  -webkit-justify-content: flex-start;
}
.flex-1 {
  -webkit-box-flex: 1.0;
  -webkit-flex: 1.0;
  -ms-flex: 1.0;
  flex: 1.0;
  -moz-box-flex: 1.0;
}
.step-left{
  margin-top:17px;
  margin-right:15px;
  min-width:80px;
  text-align: right;
  line-height: 18px;
  font-size:12px;
  position: relative;
}
.step-date{
  color: @light-black;
}
.step-time{
  font-weight:bold;
  /*font-style: italic;*/
}
.step-right{
  border-left: 1px solid @extra-light-silver;
  margin-left:20px;
  padding-left:30px;
  padding-top:20px;
  position:relative;
  min-height:60px;
}
.step-icon{
  position:absolute;
  left: -28px;
  top: 20px;
  width: 52px;
  height: 26px;
  padding: 0 2px;
  border-radius:12px;
  line-height:20px;
  text-align:center;
  font-size:12px;
  z-index: 10;
  /*border: 1px solid #C0CCDA;
  background: #E5E9F2;*/
  border: 3px solid #c0eeff;
  background:@primary-blue!important;
  color: @white;
  /*box-shadow: 0 0 1px #19afe7;*/
}
.cust-icon{
  position:absolute;
  left: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  border-radius:12px;
  font-size:12px;
  z-index: 10;
  /*border: 1px solid #C0CCDA;
  background: #E5E9F2;*/
  border: 5px solid @primary-blue;
  background:#c0eeff;
  &.disabled{
    border-color:@gray;
    background: @extra-light-black;
  }
}
.cust-title{
  color: @black;
  line-height: 20px;
  height: 20px;
  margin-bottom: 15px;
}
@media print{
  .track-step{
    color: #000 !important;
    font-size: 20px;
    font-family: "宋体",SimSun;
    .step-time,.step-date,.sublabel,.step-icon,.sub-icon,.subtext,.sublabel.sublabel-black,.step-first > *,.step-line,.step-line span, .subUser,.dealAdvise,.step-left,.matters{
      color: #000 !important;
      font-size: 20px;
    }
    .step-icon, .sub-icon, .cust-icon{
      border: none;
      background: @white !important;
    }
    .relative .step-left{
      left: -170px !important;
    }
    .step-first, .step-nextUser{
      width: 500px; // 380px
    }
    .sublabel{
      width:130px; // 90px
    }
    .subtext.dealAdvise{
      width:370px; // 290px
    }
  }
}

.sub-icon{
  position:absolute;
  left:-43px;
  top:5px;
  width:24px;
  height: 24px;
  border-radius:12px;
  line-height:22px;
  text-align:center;
  font-size:12px;
  z-index: 10;
  /*border: 1px solid #C0CCDA;
  background: #E5E9F2;
  color: @black;*/
  border: 1px solid @primary-blue;
  color: @primary-blue;
  background: @white;
}
.step-text{
  padding-right:20px;
}
.step-content{
  margin-top:3px;
}
</style>

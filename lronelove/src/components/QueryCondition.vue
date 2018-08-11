<!--
头部，尾部或者中间体都是三个slot，中间体是默认的slot,
头部和尾部的slot是命名slot,名字分别为header和footer

slot解释
  slot[header]头部的slot
  slot 中间匿名的slot
  slot[footer]尾部的slot

props属性介绍
title：String类型，默认的slot里面的title
queryFlag: Boolean类型，默认的footer里面的slot里面的查询按钮是否显示
addFlag: Boolean类型，默认的footer里面的slot里面的新建按钮是否显示
array: Array属性。
  array属性中的元素属性
    type: String类型，现在暂时为['select2', 'input']
    label: String类型，select2或者input前面显示的label样式
    options: Array类型，可选类型，如果type为select2则为必填项。
      options数组里面元素的类型
      name: String类型，显示为用户看到的字段
      id: number类型，每个name对应的索引

注意事项
    获取值的方法直接通过v-model绑定即可获得，获得的值为与原顺序一致的组件所对应的数组

事件流
    在点击查询的时候会发送query的事件流，监听该事件即可对其进行操作，同时会改变v-model的值，把该组件里面的值同步更新到v-model绑定的变量里面，
    在点击新增的时候会发送add的事件流
-->
<template>
  <div class="querycondition">
    <div class="top divborder">
      <slot name="header">
        <div class="topLeft">
          <slot name="title">
            <span class="condition">{{ title }}</span>
          </slot>
        </div>
        <div class="topRight" @click="changeIcon" v-if="toggle">

            <span class="icon-color arrow-icon" :class="flag ? 'arrow-bottom' : 'arrow-top'"></span>
            <span class="glyphicon glyphicon-plus icon-color" :style="{color:iconColor, fontSize: iconSize}" v-else></span>-->
        </div>
      </slot>
    </div>
    <transition name="shrink">
      <div v-if="flag">
        <div class="middle">
          <div v-if="array" class="unit" v-for="(a, index) in array" :key="index">
            <select2 v-if="a.type==='select2'" :outside="outside" :required="a.required" :label="a.label" :labelIcon="a.labelIcon" :labelWidth="a.labelWidth" :options="a.options" :holder1="a.holder1" :holder2="a.holder2" :caret="a.caret" v-model.trim="value[index]"></select2>
            <segi-form-input 
              v-else-if="a.type==='input'" 
              :outside="outside" 
              :required="a.required" 
              :label="a.label" 
              :labelIcon="a.labelIcon" 
              :labelWidth="a.labelWidth" 
              :holder="a.holder" 
              v-model.trim="value[index]">
            </segi-form-input>
            <date-picker 
              v-else-if="a.type==='datePicker'" 
              :outside="outside" 
              :required="a.required" 
              :label="a.label" 
              :labelIcon="a.labelIcon" 
              :labelWidth="a.labelWidth" 
              :holder="a.holder" 
              :lastDateValue="a.lastDateValue" 
              :timePicker="a.timePicker" 
              v-model.trim="value[index]">
            </date-picker>
          </div>
          <slot>
          </slot>
        </div>
        <div class="bottom divborder">
          <slot name="footer">
            <a type="button" v-if="queryFlag"  class="mbtn btn btn-primary" @click.prevent="query">查询</a>
            <a type="button" v-if="addFlag" class="mbtn btn btn-success" @click.prevent="addSchedule">新建</a>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import Select2 from './Select2'
  import SegiFormInput from './SegiFormInput'
  import DatePicker from './DatePicker'

  export default {
    props: {
      title: {
        type: String,
        default: '查询条件'
      },
      queryFlag: {
        type: Boolean,
        default: true
      },
      addFlag: {
        type: Boolean,
        default: true
      },
      array: {
        type: Array
      },
      iconColor: {
        type: String,
        default: '#000000'
      },
      iconSize: {
        type: String,
        default: '14px'
      },
      outside: {
        type: Boolean,
        default: true
      },
      value: {
        type: Array
      },
      toggle: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        flag: true
      }
    },
    components: {
      Select2, SegiFormInput, DatePicker
    },
    methods: {
      /*  点击显示新建排班模态框  */
      addSchedule () {
        this.$emit('add')
      },

      /* 查询函数 */
      query () {
        this.$emit('query')
        this.$emit('input', this.value)
      },

      /* 点击实现下落或者收起 */
      changeIcon () {
        this.flag = !this.flag
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .querycondition{
    box-shadow: @container-shadow;
    border-radius: 4px;
    border:1px solid @gray;
  }
  .icon-color {
    color: rgb(69, 144, 205);
    font-size: 1.5rem;
  }
  .divborder {
  }
  .topRight {
    height: 100%;
    position: relative;
    width: 25px;
    line-height: 50px;
    text-align: right;
    /*display: inline-flex;
    display: -webkit-inline-flex;
    justify-content: center;
    align-items: center;*/
    cursor: pointer;
    &:hover .arrow-icon,&:active .arrow-icon{
      border-color:@primary-blue;
    }
  }
  .top {
    /*background: #eef1f6;*/
    width: 100%;
    height: 51px;
    display: flex;
    border-bottom: 1px solid @gray;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .topLeft {
    position: relative;
    /*left: 10px;*/
  }
  .condition {
    font-size: 18px;
    color: @black;
  }
  .plus-minus {
    /*display: inline-flex;
    display: -webkit-inline-flex;
    width: 52px;
    height: 100%;
    justify-content: center;
    align-items: center;*/
  }
  .plus-minus:hover{
    cursor: pointer;
    /*background: #c9e5f5;*/
  }
  .arrow-icon{
    box-sizing: content-box;
    border: 2px solid @icon-color;
    border-left: 0;
    border-top: 0;
    height: 10px;
    width: 10px;
    position: absolute;
    transition: all ease-in-out 0.2s;
    top: 18px;
    right: 2px;
  }
  .arrow-top{
    margin-top: -2px;
    transform: rotate(45deg) scaleY(1);
  }
  .arrow-bottom{
    margin-top: 2px;
    transform: rotate(-135deg) scaleY(1);
  }
  .middle {
    background: rgba(255,255,255,0.9);
    width: 100%;
    text-align: left;
    padding:10px;
    /*padding-left: 30px;*/
  }
  .flex-start {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    -webkit-align-items: center;
    -webkit-justify-content: flex-start;
    flex-wrap:wrap;
  }
  /*.middle .unit {
    min-width: 49.5%;
    display:inline-block;
    text-align:center;
    margin:0px auto;
    font-size: 14px;
    vertical-align:top;
  }
  .unit>* {
    margin:7px 0px;
  }
  @media screen and (max-width:1100px){
    .middle {
      !*text-align:center;*!
      padding-left: 10px;
    }
    .middle .unit {
      min-width:95%;
      margin:0 auto;
    }
  }*/
    .unit{
      /*min-width: 49.5%;*/
      min-width: 360px;
      display: inline-block;
      margin: 10px;
      vertical-align: top;
      /*text-align: center;*/
    }
  .bottom {
    /*background: #eef1f6;*/
    border-top:none;
    width: 100%;
    text-align: right;
    position: relative;
    /*line-height: 5rem;*/
    padding: 0 20px 20px 20px;
  }
  .mbtn {
    text-align: center;
    margin-top: auto;
    margin-bottom: auto;
    position: relative;
    right: 10px;
  }
  .shrink-enter-active{
    transition: all .1s ease-in-out;
    -webkit-transition: all .1s ease-in-out;
    -moz-transition: all .1s ease-in-out;
    max-height: 1000px;
    overflow:hidden;
  }
  .shrink-enter {
    max-height: 0 !important;
    overflow:hidden;
  }
  .shrink-leave {
    max-height: 1000px !important;
    overflow:hidden;
  }
  .shrink-leave-active {
    max-height: 0;
    transition: all .1s ease-in-out;
    -webkit-transition: all .1s ease-in-out;
    -moz-transition: all .1s ease-in-out;
    overflow:hidden;
  }
</style>

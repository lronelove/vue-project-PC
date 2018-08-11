<!--
* @Author: wanglei
* @Date:   2017-06-03 14:58:57
* @Last Modified by:   wanglei
* @Last Modified time: 2017-07-04 11:17:53
-->
<!--
  props:
    value: 默认值0 取值范围0-5
    label: 显示的标签名
    disabled: true为不可评价
    showlabel: 是否显示标签 默认true
  或者v-model="rateValue"
-->
<template>
  <div>
    <div class="clearfix">
      <span v-if="showLabel" style="float: left;padding-right: 5px;line-height: 28px;height: 28px" :style="{width: labelWidth}">{{label}}</span>
      <span class="rate" style="float: left;line-height: 28px;height: 28px" :style="{'cursor': disabled ? 'auto': 'pointer', width: inputWidth}">
        <span v-for="val in 5" @click="selectVal(val)" @mouseenter="enter(val)" @mouseleave="leave(val)">
          <i class="iconfont" style="display: inline-block;padding-right: 4px;font-size: 18px;" :class="{'active': showColor(val), 'icon-star': showColor(val), 'icon-star-grey': !showColor(val), 'disabled': disabled}"></i>
        </span>
      </span>
    </div>
  </div>
</template>

<script type="text/javascript">
  import '../assets/iconfont/iconfont.css'
  export default {
    props: {
      value: {
        type: [Number, String],
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: '评价'
      },
      showLabel: {
        type: Boolean,
        default: true
      },
      labelWidth: {
        type: String,
        default: ''
      },
      inputWidth: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        curValue: parseInt(this.value, 10),
        hoverValue: 0
      }
    },
    methods: {
      selectVal (val) {
        if (this.disabled) {
          return
        }
        this.curValue = val
        this.hoverValue = val
        this.$emit('input', val)
      },
      enter (val) {
        if (this.disabled) {
          return
        }
        this.hoverValue = val
      },
      leave (val) {
        if (this.disabled) {
          return
        }
        this.hoverValue = this.curValue
      },
      showColor (val) {
        return val <= this.curValue || val <= this.hoverValue
      }
    }
  }
</script>

<style lang="less" scoped>
  .rate{
    color: #c0ccda;
  }
  .icon-star{
    &.active{
      color: #f3b627;
      &:hover{
        transform: scale(1.3);
        &.disabled{
          transform: none;
        }
      }
    }
  }
</style>

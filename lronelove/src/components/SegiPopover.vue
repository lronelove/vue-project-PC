<!--popover组件:弹出框-->
<!--
例子1：disabled=false,则非只读数据，有submitPop函数
<popover :disabled="false" @submitPop="submitCite" label="追记" title="追记" :labelClass="'btn btn-primary'">
  <div></div>
</popover>
例子2：simple=false，则show由外部控制，有showPop,closePop之类的函数
<popover :simple="false" :popoverShow="pop.show" @showPop="showPop" @closePop="closePop" label="追记" title="追记" >
  <div>内容</div>
</popover>
-->
<template>
  <span style="position:relative;" v-clickoutside="hide" ref="popunit">

    <!--简单类型，只有关闭按键，或者取消/完成按键-->
    <span v-if="simple">
      <slot name="label">
        <a @click.prevent="showPop" ref="label" :class="labelClass" :style="labelStyle" class="pop-label"><span :class="icon"></span>{{label}}</a>
      </slot>
      <div ref="pop" v-show="show" class="popover" :style="{top: custTop || top, left: custLeft || left, bottom: custBottom || bottom, right: custRight || right, width: width, maxWidth: width}" :class="[getType(),{ 'popover-sm': popoverStyle.indexOf('small') !== -1, 'popover-md': popoverStyle.indexOf('middle') !== -1, 'noline': popoverStyle.indexOf('noline') !== -1}]">
        <span class="arrow" :style="[arrowStyle, custArrow]" v-if="ifArrow"></span>
        <div class="popover-title clearfix" v-if="title" >
          {{title}}
          <a @click.prevent="closePop">

            <!-- <remove-icon /> -->
            <i class="iconfont icon-remove-cross"></i>
          </a>
        </div>
        <div class="popover-content scrollbar" :style="{height: height, maxHeight: maxHeight}">
          
          <!--内容-->
          <slot></slot>
        </div>
        <div class="popover-footer" v-if="!disabled">

          <!--按键-->
          <slot name="buttons">
            <a v-if="!disabled" class="btn btn-success btn-sm" type="button" @click.prevent="submitPop()">{{okText}}</a>
          </slot>
        </div>
      </div>
    </span>

    <!--非简单类型，popoverShow在组件外部控制-->
    <span v-else>
      <slot name="label">
        <a @click.prevent="showPop" ref="label" :class="labelClass" :style="labelStyle" class="pop-label"><span :class="icon"></span>{{label}}</a>
      </slot>
      <div ref="pop" v-show="popoverShow" class="popover" :style="{top: custTop || top, left: custLeft || left, bottom: custBottom || bottom, right: custRight || right, width: width, maxWidth: width}" :class="[getType(),{ 'popover-sm': popoverStyle.indexOf('small') !== -1, 'popover-md': popoverStyle.indexOf('middle') !== -1, 'noline': popoverStyle.indexOf('noline') !== -1}]">
        <span class="arrow" :style="[arrowStyle, custArrow]" v-if="ifArrow"></span>
        <div class="popover-title clearfix" v-if="title">
          {{title}}
          <a @click.prevent="closePop">

            <!-- <remove-icon /> -->
            <i class="iconfont icon-remove-cross"></i>
          </a>
        </div>
        <div class="popover-content scrollbar" :style="{height: height, maxHeight: maxHeight}">
          
          <!--内容-->
          <slot></slot>
        </div>
        <div class="popover-footer" v-if="!disabled">
          <!--按键-->
          <slot name="buttons">
            <a v-if="!disabled" class="btn btn-success btn-sm" type="button" @click.prevent="submitPop()">{{okText}}</a>
          </slot>
        </div>
      </div>
    </span>
  </span>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import RemoveIcon from 'components/RemoveIcon'

export default {
  directives: {
    clickoutside
  },
  components: {
    RemoveIcon
  },
  props: {

    // 简单类型，只有关闭按键，或者取消/完成按键
    simple: {
      type: Boolean,
      default: true
    },

    // 非简单类型时，show在组件外部控制
    popoverShow: {
      type: Boolean,
      default: false
    },

    // 是否只读，不提交数据,如果为true，则clickOutSide有效
    disabled: {
      type: Boolean,
      default: true
    },

    // 标签，点击标签显示弹出框
    label: {
      type: String,
      default: '标签'
    },

    // 标题
    title: {
      type: String
    },

    // 宽度
    width: {
      type: String,
      default: '300px'
    },

    // 内容高度
    height: {
      type: String,
      default: '110px'
    },
    maxHeight: {
      type: String
    },

    // 位置，有“top,left,right,bottom”
    pos: {
      type: String,
      default: 'bottom'
    },
    labelClass: {
      type: String
    },
    labelStyle: {
      type: Object
    },

    /* small:小的popover，middle: 中的popover, noline: footer没有line，small-noline, middle-noline */
    popoverStyle: {
      type: String,
      default: ''
    },

    /* label中可以包含一个图标 */
    icon: {
      type: String
    },

    /* UPDATE为true时，根据dom变化更新位置，尽量不用该属性，易导致bug */
    update: {
      type: Boolean,
      default: false
    },

    /* disabled，simple不全是true，也可以用outSide控制：可以点击外部关闭弹出框 */
    outSide: {
      type: Boolean,
      default: false
    },

    /* ok按键可以是完成/确定等文案 */
    okText: {
      type: String,
      default: '完成'
    },

    /* 是否有小箭头 */
    ifArrow: {
      type: Boolean,
      default: true
    },
    custTop: {
      type: String
    },
    custLeft: {
      type: String
    },
    custBottom: {
      type: String
    },
    custRight: {
      type: String
    },
    custArrow: {
      type: Object
    },
    containerWidth: {
      type: [String, Number],
      default: '800'
    }
  },
  data () {
    return {
      show: false, // 简单类型，show在组件内部控制
      top: '0',
      left: '0',
      bottom: 'auto',
      right: 'auto',
      arrowStyle: {}
    }
  },
  methods: {
    showPop () {
      if (this.simple) {
        this.show = true
      } else {
        this.$emit('showPop')
      }
      let _this = this

      this.$nextTick(function () {
        _this.getPos()
      })
    },
    closePop () {
      if (this.simple) {
        this.show = false
      } else {
        this.$emit('closePop')
      }
    },
    hide () {
      if (this.disabled && this.simple) {
        this.show = false
      } else if (this.outSide) {
        this.$emit('closePop')
      }
    },
    submitPop () {
      this.$emit('submitPop', this.closePop)
    },
    getType () {
      let map = {'bottom': 'bottom', 'right': 'right', 'top': 'top', 'left': 'left', 'leftBottom': 'left', 'bottomLeft': 'bottom', 'topFlex': 'top'}
      return map[this.pos]
    },
    getPos () {
      if (this.$refs.label === undefined || this.$refs.pop === undefined) return

        switch (this.pos) {
        case 'bottom':
          this.top = this.$refs.label.offsetHeight + 5 + 'px'
          this.left = -(this.$refs.pop.offsetWidth - this.$refs.label.offsetWidth) / 2 + 'px'
          this.bottom = 'auto'
          this.right = 'auto'
          break
        case 'right':
          this.top = -(this.$refs.pop.offsetHeight - this.$refs.label.offsetHeight) / 2 + 'px'
          this.left = this.$refs.label.offsetWidth + 5 + 'px'
          this.bottom = 'auto'
          this.right = 'auto'
          break
        case 'top':
          this.top = 'auto'
          this.left = -(this.$refs.pop.offsetWidth - this.$refs.label.offsetWidth) / 2 + 'px'
          this.bottom = this.$refs.label.offsetHeight + 'px'
          this.right = 'auto'
          break
        case 'left':
          this.top = -(this.$refs.pop.offsetHeight - this.$refs.label.offsetHeight) / 2 + 'px'
          this.left = -this.$refs.pop.offsetWidth - 5 + 'px'
          this.bottom = 'auto'
          this.right = 'auto'
          break
        case 'leftBottom':
          this.top = 0 + 'px'
          this.left = -this.$refs.pop.offsetWidth - 5 + 'px'
          this.bottom = 'auto'
          this.right = 'auto'
          this.arrowStyle = {top: '15px'}
          break
        case 'bottomLeft':
          this.top = this.$refs.label.offsetHeight + 5 + 'px'
          this.left = 1.5 * this.$refs.label.offsetWidth - this.$refs.pop.offsetWidth + 'px'
          this.bottom = 'auto'
          this.right = 'auto'
          let left = (this.$refs.pop.offsetWidth - 1 * this.$refs.label.offsetWidth) + 'px'
          this.arrowStyle = {left: left}
          console.log(this.$refs.label.offsetHeight)
          break
        // 使用topFlex，正常情况在正上方显示，超出容器宽度时左上角/右上角显示，需要给定containerWidth
        case 'topFlex':
          this.top = 'auto'
          this.bottom = this.$refs.label.offsetHeight + 'px'
          
          if (this.$refs.popunit.offsetLeft < ((this.$refs.pop.offsetWidth - this.$refs.label.offsetWidth) / 2)) {
            this.left = '-10px'
            this.right = 'auto'
            this.arrowStyle = {left: '21px', right: 'auto'}
          } else if (this.$refs.popunit.offsetLeft + this.$refs.pop.offsetWidth / 2 + this.$refs.label.offsetWidth / 2 > this.containerWidth) {
            this.left = 'auto'
            this.right = '-10px'
            this.arrowStyle = {left: 'auto', right: '10px'}
          } else {
            this.left = -(this.$refs.pop.offsetWidth - this.$refs.label.offsetWidth) / 2 + 'px'
            this.right = 'auto'
            this.arrowStyle = {left: '50%', right: 'auto'}
          }
          break
      }
    }
  },
  watch: {
  },
  updated () {
    // if (this.show || this.popoverShow) {
    //   this.update && this.getPos()
    // }
  },
  mounted () {
  }
}
</script>

<style scoped>
   /* 小弹窗 宽：300px 高： 84+110=182*/
  a, a:hover{
    cursor:pointer;
    text-decoration:none;
  }
  div.popover{
    display:block;
    width:400px;
    max-width:400px;
    margin-bottom:10px;
  }
  div.popover.popShow{
    /* opacity: 1;
    pointer-events: auto; */
  }
  /*.popover-title{
    line-height:20px;
    padding:10px 20px;
    background-color: #fff;
    font-size: 110%;
  }
  .popover-title a{
    color: #bbb;
  }
  .popover-title a:focus, .popover-title a:hover {
    color: #808080;
    text-decoration: none;
  }*/
  .popover-content{
    padding: 0;
    height:110px;
    overflow:auto;
    margin-right: 1px;
  }
  .popover-content>div{
    margin: 0 auto;
  }
  /*.popover-footer{
    padding:6px 20px;
    font-size:110%;
    margin: 0;
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
    border-radius: 0 0 5px 5px;
    text-align:right;
  }
  .popover-footer a.btn-sm{
    padding: 5px 10px;
    font-size: 12px;
    line-height: 18px;
  }*/
  .pop-line{
    padding: 8px 0;
  }
  .pop-label{
    display: inline-block;
  }
</style>

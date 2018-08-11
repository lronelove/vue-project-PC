<!--SegiDrawer组件：抽屉-->
<!--
父组件中编写drawer打开函数：
<a type="button" class="mbtn btn btn-primary" @click.prevent="showDrawer">drawer</a>
showDrawer () {
  this.drawer.show = true
}
父组件中编写drawer关闭函数：
hideDrawer () {
  this.drawer.show = false
}
父组件中编写drawer打开/关闭函数：
toggleDrawer () {
  this.drawer.show = !this.drawer.show
}
-->
<template>
  <div 
    @mouseup="stopDragDrawer($event)" 
    @mousemove="doDragDrawer($event)" 
    class="segi-drawer" 
    :class="{resizing: isResizing}"
    :style="{cursor: isResizing ? 'w-resize': '' , padding: show ? '20px': getPadding()}">
    <!--页面整体-->
    <div class="segi-main" :style="pushMain()">
      <!--主体内容-->
      <slot></slot>
      <!--mask-->
      <div v-if="mask" class="mask" :class="show ? 'mask-show' : ''" @click="hideDrawer"></div>
    </div>
    <!--drawer-->
    <div class="drawer" :class="[ show ? 'drawer-show' : '', drawPos()]" ref="drawerLeft" >
      <transition name="move">
        <div v-show="show" class="drawer-container" :style="{width: leftWidth}">
          <!--drawer头部-->
          <slot name="drawerHeader">
            <div v-if="header" class="drawer-header" :style="{textAlign: headerAlign}" >
              <!--<span :class="drawerTitleIcon"></span>-->
              <p class="drawer-title">{{title}}</p>
              <a v-if="close" type="button" class="close" @click="hideDrawer"><span class="iconfont icon-remove-cross"></span></a>
            </div>
          </slot>
          <!--drawer主体，需重写的slot-->
          <div class="drawer-body scrollbar" >
            <slot name="drawerBody"></slot>
          </div>
          <div v-if="pos==='left'" class="dragLine" ref="dragLine" @mousedown.prevent="startDragDrawer($event)">
            <div v-if="show" class="guide-dragLine" style="height: 100px;margin-top:0;margin-left:-5px;"></div>
          </div>
        </div>
      </transition>
      <!--drawer侧边滑块-->
      <div v-if="slider" class="drawer-slider" :class="show? 'slider-show' : 'slider-hide'" @click="toggleDrawer" :style="{left: show && pos==='left'?leftWidth:'0', right: pos==='right'?leftWidth:''}" >
        <slot name="drawerSlider">
          <!--<span class="glyphicon drawer-slider-icon" :class="iconType()"></span>-->
          <div class="drawer-slider-icon" :class="iconType()"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'segi-drawer',
  data () {
    return {
      leftWidth: this.drawerWidth,
      lastDownX: 0,
      isResizing: false,
      minWidth: 250,
      maxWidth: 450,
      bodyHeight: '414px'
    }
  },
  props: {

    // drawer位置，可以是'left','right','top','bottom'
    pos: {
      type: String,
      default: 'left'
    },

    // 整体的min-height,如82vh
    minHeight: {
      type: String,
      default: '700px'
    },

    // drawer宽度
    drawerWidth: {
      type: String,
      default: '300px'
    },

    // drawer高度
    drawerHeight: {
      type: String,
      default: '100%'
    },

    // drawer是否显示
    show: {
      type: Boolean,
      default: false
    },

    // drawer标题
    title: {
      type: String,
      default: ''
    },

    // drawer标题字体大小
    titleSize: {
      type: String,
      default: '14px'
    },
    drawerTitleIcon: {
      type: String,
      default: 'glyphicon glyphicon-th-large'
    },

     // 头部文字对齐方式，text-align
    headerAlign: {
      type: String,
      default: 'left'
    },

    // push 是否用push样式，push为false时，drawer覆盖到页面上；push为true时，页面原来内容被推动
    push: {
      type: Boolean,
      default: true
    },

    // 是否有遮罩样式
    mask: {
      type: Boolean,
      default: false
    },

    // 是否有头部
    header: {
      type: Boolean,
      default: true
    },

    // 是否有侧边滑块
    slider: {
      type: Boolean,
      default: true
    },

    // 是否有关闭按键
    close: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    startDragDrawer (e) {
      if (this.$refs.drawerLeft.scrollWidth >= this.minWidth - 1) {
        this.isResizing = true
        this.lastDownX = e.clientX
      }
    },
    doDragDrawer (e) {
      if (!this.isResizing) {
        return
      }
      if (e.clientX < this.maxWidth) {
        this.leftWidth = e.clientX > this.minWidth ? e.clientX + 'px' : this.minWidth + 'px'
      } else {
        this.leftWidth = this.maxWidth + 'px'
      }
    },
    stopDragDrawer (e) {
      this.isResizing = false
      console.log('stopDrag', this.isResizing)
    },
    getPadding () {
      if (this.push) {
        if (!this.slider && !this.show) {
          return '10px'
        } else {
          switch (this.pos) {
            case 'left':
              return '20px 20px 20px 70px'
            case 'right':
              return '10px 70px 10px 10px'
            case 'top':
              return '35px 10px 10px 10px'
            case 'bottom':
              return '10px 10px 35px 10px'
            default:
              return '10px 10px 10px 30px'
          }
        }
      }
    },

    // 根据pos值，返回不同的class
    drawPos () {
      switch (this.pos) {
        case 'left':
          return 'drawer-left'
        case 'right':
          return 'drawer-right'
        case 'top':
          return 'drawer-top'
        case 'bottom':
          return 'drawer-bottom'
        default:
          return 'drawer-left'
      }
    },

    // 根据pos值，返回不同的icon
    iconType () {
      switch (this.pos) {
        case 'left':
          return this.show ? 'icon-left' : 'icon-right'
        case 'right':
          return this.show ? 'glyphicon-chevron-right' : 'glyphicon-chevron-left'
        case 'top':
          return this.show ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down'
        case 'bottom':
          return this.show ? 'glyphicon-chevron-down' : 'glyphicon-chevron-up'
        default:
          return this.show ? 'glyphicon-chevron-left' : 'glyphicon-chevron-right'
      }
    },

    // push
    pushMain () {
      if (!this.push) {
        return {}
      } else {
        switch (this.pos) {
          case 'left':
            let leftWidth = this.leftWidth.indexOf('px') !== -1 ? (parseInt(this.leftWidth, 10) + 20) + 'px' : this.leftWidth
            return {marginLeft: (this.show ? leftWidth : '')}
          case 'right':
            return {marginRight: (this.show ? this.leftWidth : '')}
          case 'top':
            return {marginTop: (this.show ? this.drawerHeight : '')}
          case 'bottom':
            return {}
          default:
            return {marginLeft: (this.show ? this.leftWidth : '')}
        }
      }
    },

    // 打开drawer
    showDrawer () {
      console.log('show')
      this.$emit('showDrawer')
    },

    // 关闭drawer
    hideDrawer () {
      this.$emit('hideDrawer')
    },

    // 打开/关闭drawer
    toggleDrawer () {
      this.$emit('toggleDrawer')
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .dragLine{
    width: 10px;
    height: 100%;
    background: transparent;
    position: absolute;
    right: -8px;
    bottom: 0;
    cursor: w-resize;
  }
  .resizing .segi-main{
    transition: all ease-in-out 0s;
  }
  .resizing.segi-drawer .drawer.drawer-left{
    transition: all ease-in-out 0s;
  }
  .resizing .drawer-left>.drawer-slider{
    transition: all ease-in-out 0s;
  }
  .move-enter, .move-leave-active {
    transform: translateX(-100%);
  }
  .move-enter-active{
    transition: all ease-in-out 0.3s;
  }
  .move-leave-active {
    transition: all ease-in-out 0.3s;
  }
  .drawer-container{
    border: 1px solid @gray;
    background: @white;
    box-shadow: @container-shadow;
    border-radius: 4px;
    height: 100%;
  }
  .drawer-body{
    height: calc(~"100% - 52px");
    overflow: auto;
    // padding: 10px 20px;
  }
/*整体*/
 .segi-drawer {
   width: 100%;
   height: 100%;
   /* overflow-x: hidden;*/
   position: relative;
 }
 /* .segi-drawer::-webkit-scrollbar{
    display: none;
  } */
 .segi-main {
  transition: all ease-in-out 0.3s;
   -webkit-transition: all ease-in-out 0.3s;
   -moz-transition: all ease-in-out 0.3s;
   // min-height: 540px;
 }
/*mask*/
 .segi-drawer > .segi-main > .mask {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   visibility: hidden;
   opacity: 0;
   transition: all ease-in-out 0.3s;
   -webkit-transition: all ease-in-out 0.3s;
   -moz-transition: all ease-in-out 0.3s;
   background-color: rgba(0, 0, 0, 0.45);
 }
 .segi-drawer > .segi-main > .mask-show {
   visibility: visible;
   opacity: 1;
 }

/*drawer*/
 .segi-drawer > .drawer {
   position: absolute;
   /*overflow: hidden;
   pointer-events: none;
   visibility: hidden;*/
   transition: all ease-in-out 0.3s;
   -webkit-transition: all ease-in-out 0.3s;
   -moz-transition: all ease-in-out 0.3s;
 }
 .segi-drawer > .drawer-left {
   top: 0;
   left: 20px;
   /*transform: translateX(-100%);
   -webkit-transform: translateX(-100%);
   -moz-transform: translateX(-100%);*/
   margin-top:20px;
   height: calc(~"100% - 40px");
   // min-height: 540px;
 }
 .segi-drawer > .drawer-right {
   top: 0;
   right: 0;
   transform: translateX(100%);
   -webkit-transform: translateX(100%);
   -moz-transform: translateX(100%);
   margin-top:10px;
 }
 .segi-drawer > .drawer-top {
   top: 0;
   left: 0;
   transform: translateY(-100%);
   -webkit-transform: translateY(-100%);
   -moz-transform: translateY(-100%);
 }
 .segi-drawer > .drawer-bottom {
   bottom: 0;
   left: 0;
   transform: translateY(100%);
   -webkit-transform: translateY(100%);
   -moz-transform: translateY(100%);
   position:fixed;
 }
 /* 改变drawer的visiblity和transform来实现抽屉效果 */
 .segi-drawer > .drawer-show {
   pointer-events: inherit;
   visibility: visible;
   transform: translate(0,0);
   -webkit-transform: translate(0,0);
   -moz-transform: translate(0,0);
 }
 .drawer-header {
   height:52px;
   border-bottom:1px solid @gray;
   padding: 0 20px;
   color: @black;
 }
 .drawer-title {
   display:inline-block;
   margin:0;
   padding:0;
   font-size: 18px;
   line-height: 52px;
 }
 .drawer-header>* {
  display: inline-block;
  vertical-align:middle;
 }

/*slider*/
 .drawer-slider {
   cursor:pointer;
   color: @black;
 }
 .drawer-left>.drawer-slider,.drawer-right>.drawer-slider {
   position: absolute;
   top: 0;
   width: 30px;
   height: 52px;
   transition: left ease-in-out 0.3s;
   /*transition: left ease-in-out 0.3s, background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -webkit-transition: left ease-in-out 0.3s, background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -moz-transition: left ease-in-out 0.3s, background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;*/
   line-height:52px;
 }
 .drawer-top>.drawer-slider {
   position: absolute;
   width: 100%;
   height:30px;
   bottom:-30px;
   transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -webkit-transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -moz-transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
 }
 .drawer-bottom>.drawer-slider {
   position: absolute;
   width: 100%;
   height:30px;
   top:-30px;
   transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -webkit-transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
   -moz-transition: background ease-in-out 0.3s, color ease-in-out 0.3s, border linear 0.1s;
 }
 .drawer-left>.slider-show {
   margin-left:-40px;
   transition: left ease-in-out 0.3s;
 }
 .drawer-right>.slider-show {
   margin-right:-30px;
 }
 .drawer-top>.slider-show {
   bottom:0;
 }
 .drawer-bottom>.slider-show {
   top:0;
   text-align:right;
   padding-right:15px;
 }
 .slider-hide {
   height: 52px;
   background: @primary-blue;
   color:@white;
   box-shadow: @drop-shadow;
   border-radius:4px ;
 }
 .drawer-bottom>.slider-hide {
   background:@gray;
   color:@black;
   border:1px solid @gray;
 }
 .drawer-slider{
   /*display: inline-flex;
   display: -webkit-inline-flex;
   justify-content: center;
   align-items: center;*/
   cursor: pointer;
 }
 .slider-show.drawer-slider:hover{
    .drawer-slider-icon{
      border-color: @primary-blue;
    }
 }
  .drawer-slider-icon{
    box-sizing: content-box;
    border: 2px solid @icon-color;
    border-left: 0;
    border-top: 0;
    height: 10px;
    width: 10px;
    position: absolute;
    top: 20px;
    /*transition: all ease-in-out .4s;*/
  }
  .icon-left{
    /*top: 20px;*/
    left: 10px;
    transform: rotate(135deg) scaleY(1);
  }
  .icon-right{
    border-color: @white;
    left:7px;
    transform: rotate(-45deg) scaleY(1);
  }
 .drawer-left .drawer-slider-icon,.drawer-right .drawer-slider-icon{
  vertical-align:middle;
 }
 .drawer-top .drawer-slider-icon,.drawer-bottom .drawer-slider-icon{
  margin-top:8px;
 }
</style>

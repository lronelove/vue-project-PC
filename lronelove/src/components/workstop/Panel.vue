<!--Panel组件：例子：views/home-router-test/Workstop.vue-->
<template>
  <div class="panel" :class="panelType">
    <div class="panel-heading clearfix" :class="{headStyle:blueGradient}" :style="headStyle" v-if="title" style="position:relative">
      <slot name="header">
        <h3 class="panel-title">{{title}}</h3>
        <span class="panel-subtitle" v-if="subtitle" style="font-size:14px;">{{subtitle}}</span>
        <span class="glyphicon glyphicon-refresh pull-right refresh" :class={rotation:rotate} @click="refreshRotate" v-if="refresh"></span>
      </slot>
    </div>
    <div class="panel-body" v-if="content">
      {{content}}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'panel',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    subtitle: {
      type: String,
      default: ''
    },
    // 默认没有内容
    content: {
      default: ''
    },
    // 设置有无刷新图标
    refresh: {
      type: Boolean,
      default: false
    },
    // 设置面板样式，如panel-default/panel-primary，参照BootStrap
    panelType: {
      type: String,
      default: 'panel-default'
    },
    // 在父组件中重写头部样式，如{fontSize: '16px'}
    headStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 可设置头部样式为蓝色渐变
    blueGradient: {
      type: Boolean,
      default: false
    },
    rotate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // rotate: false,
      time: 1000
    }
  },
  methods: {
    // 点击刷新图标，触发旋转动画
    refreshRotate () {
      /* let that = this
      that.rotate = true
      setTimeout(function () {
        that.rotate = false
      }, that.time) */
      this.$emit('loadContent')
    }
  }
}
</script>

<style scoped>
  .panel-title{
    display:inline-block;
  }
  .headStyle{
    background: -webkit-linear-gradient(#d9e9f7, #e6f1fa,#e2f0fc,#d5e6f5);
    background: -o-linear-gradient(#d9e9f7, #e6f1fa,#e2f0fc,#d5e6f5);
    background: -moz-linear-gradient(#d9e9f7, #e6f1fa,#e2f0fc,#d5e6f5);
    background: linear-gradient(#d9e9f7, #e6f1fa,#e2f0fc,#d5e6f5);
  }
  .refresh{
    cursor: pointer;
  }
  .rotation{
    animation:move .4s linear infinite both;
    -webkit-animation:move .4s linear infinite both;
    -moz-animation:move .4s linear infinite both;
  }
  @keyframes move{
    from {transform:rotate(-360deg);}
    to {transform:rotate(0);}
   }
  @-webkit-keyframes move{
    from {transform:rotate(-360deg);-webkit-transform:rotate(-360deg);}
    to {transform:rotate(0);-webkit-transform:rotate(0);}
  }
  @-moz-keyframes move{
    from {transform:rotate(-360deg);-moz-transform:rotate(-360deg);}
    to {transform:rotate(0);-moz-transform:rotate(0);}
  }
  /* linear-gradient(#cde8f7, #d9edf7,#c5ebfd);
    background: linear-gradient(#d9e9f7, #e6f1fa,#e2f0fc,#d5e6f5);
  */
</style>

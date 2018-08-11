<!--
* 用法
* <button class="btn btn-primary" @click="test">展示</button>
* <handle-guide v-if="guide.show" @close="guide.show=false" :tipsArr="guide.tips"></handle-guide>
  #guide-content是相对于body的绝对定位，尽量不要在组件的祖先元素上加上定位，导致位置计算错误
  组件最好放在父组件标签的一级子节点下，方便获取this.$parent.$el
  <template>
    <div class="model">
      <handle-guide v-if="guide.show" @close="guide.show=false" :tipsArr="guide.tips" />
* data () {
    return {
      guide: {
        show: false,
        tips: []
      }
    }
  }
* 点击事件
  test () {
    this.guide.show = true
    this.guide.tips = []   // 每次显示要先清空数组，或者预先写好tips内容
    this.guide.tips.push({
      selector: '.drawer-slider.slider-show',  // 选择器
      content: '点击此按钮，可以收起组织结构'  // tip内容
    }, {
      selector: '.btn.btn-primary',
      content: '点击预览排序，设置服务在手机上的展示顺序'
    }, {
      selector: '.btn.btn-success',
      content: '点击服务开通，可以单独或批量开通服务'
    })
  }
*
-->
<template>
  <div>
    <div id="guide-cover" @click="nextTip(tipIndex)"></div>
    <div id="guide-content" :style="guidePosition">
      <div class="tip-content" :style="{'top': top}">
        {{content}}
        <a @click.prevent.stop="nextTip(tipIndex)" class="know">下一步</a>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  props: {
    tipsArr: {
      type: Array,
      default () {
        return []
      }
    },
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      tipIndex: 0,
      curTip: '',
      top: '',
      content: '',
      guidePosition: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    nextTip (index) {
      if (this.tipIndex === this.tipsArr.length) {
        this.$emit('close')
        return
      }
      this.generateContent(this.tipsArr[index])
      ++this.tipIndex
    },
    generateContent (item) {
      let box = this.$parent.$el.querySelector(item.selector).getBoundingClientRect()
      
      this.guidePosition.width = box.width + 'px'
      this.guidePosition.height = box.height + 'px'
      this.guidePosition.left = box.left + document.body.scrollLeft + 'px'
      this.guidePosition.top = box.top + document.body.scrollTop + 'px'
      this.top = box.height + 20 + 'px'
      this.content = item.content
    }
  },
  mounted () {
    this.nextTip(0)
  }
}
</script>

<style lang="less" scoped>
  #guide-cover{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    outline: none;
    cursor: pointer;
  }
  #guide-content{
    position: absolute;
    transition: all .3s;
    box-shadow: rgba(0, 0, 0, .75) 0px 0px 0px 9999px;
    z-index: 10000;
    text-align: left;
    .tip-content{
      position: absolute;
      background-color: #fff;
      border-radius: 4px;
      width: 120px;
      padding: 10px 10px 30px 10px;
      &:after{
        position: absolute;
        border: 10px solid transparent;
        border-bottom-color: #fff;
        top: -20px;
        left: 10%;
        content: '';
      }
      .know{
        position: absolute;
        bottom: 5px;
        right: 5px;
        cursor: pointer;
      }
    }
  }
</style>

<!--SegiAudio组件：音频-->
<!--
父组件:<segi-audio :src="xxxx"/>
-->
<template>
  <div class="play-audio" v-if="disabled">
    <label :style="{width: labelWidth}" v-if="label">{{ label }}</label>
    <span style="line-height:40px;" v-if="value">
      <audio controls>
        <source :src="value" type="audio/mpeg">
        您的浏览器不支持 audio 元素。
      </audio>
    </span>
    <span v-else class="no-value">无</span>
    <a class="download-audio" style="" download="" :href="value" v-if="download">
      <span :class="icon"></span>{{downloadText}}
    </a>
  </div>
</template>

<script>
export default {
  name: 'segi-audio',
  props: {
    // 是否渲染该组件
    disabled: {
      type: Boolean,
      default: true
    },

    // 资源链接
    value: {
      type: String,
      default: ''
    },

    // 标签长度
    labelWidth: {
      type: String,
      default: '90px'
    },

    // 标签内容
    label: {
      type: String,
      default: ''
    },

    // download，是否有下载按键
    download: {
      type: Boolean,
      default: false
    },

    // downLoad icon，下载图标
    icon: {
      type: String,
      default: 'glyphicon glyphicon-save'
    },

    // downLoadText
    downloadText: {
      type: String,
      default: '下载'
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .play-audio {
    font-size:0px;
  }
  .play-audio label{
    font-size:14px;
    font-weight: normal;
    text-align:left;
    margin:0;
    width: 109px;
    padding-right:5px;
    vertical-align: top;
    padding: 10px 5px 10px 0;
    line-height: 20px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    color: @input-label-color;
  }
  .play-audio label:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  .play-audio audio{
    display:inline-block;vertical-align: middle;font-size:15px;
  }
  .play-audio .download-audio{
    display:inline;vertical-align: middle;font-size:15px;margin-left:50px;
  }
  a.download-audio:hover{
    text-decoration:none;
  }
  .no-value{
    color:@black;
    line-height:40px;
    font-size:14px;
    display:inline-block;
    vertical-align:top;
  }
</style>

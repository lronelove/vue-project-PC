<!--
1.返回按键
<special-button type="back" @clickBtn="goBack()"/>
 -->
<template>
  <span @click="clickBtn()">
    <span v-if="type === 'back'" class="back-svg-btn" :style="{width: width, height:height}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 62 36" enable-background="new 0 0 62 36" xml:space="preserve">
        <g>
          <path class="back-svg" fill-rule="evenodd" clip-rule="evenodd" d="M16,36C16,36,15.9,36,16,36C16,36,16,36,16,36z M58,0H16
          c0,0,0,0,0,0c0,0,0,0,0,0h-0.1c-0.1,0-0.1,0-0.1,0h0.1c0,0,0,0,0.1,0c-0.3,0-0.7,0-0.9,0c-2.1,0-3.9,1.4-5,3L2,13
          c-1.8,1.9-2,3.9-2,5c0,1.4,0.7,3.1,2,5l8,10c0-0.3,0,0,0,0c1.1,1.6,2.9,3,5,3c0.2,0,0.7,0,0.9,0c0,0,0,0-0.1,0h-0.1
          c0,0,0.1,0,0.1,0H58c2.2,0,4-1.8,4-4V4C62,1.8,60.2,0,58,0z M16,0C16,0,16,0,16,0C15.9,0,16,0,16,0L16,0z"/>
        </g>
        <text transform="matrix(1 0 0 1 21.25 22.2024)" fill="#FFFFFF" font-family="'MicrosoftYaHei'" font-size="14">返回</text>
      </svg>
    </span>
  </span>
</template>
<script>
export default {
  name: 'sepcial-button',
  props: {
    /* 按键类型：‘back’返回按键 */
    type: {
      type: String,
      default: 'back'
    },
    /* 按键大小 */
    width: {
      type: String
    },
    height: {
      type: String
    }
  },
  methods: {
    clickBtn () {
      this.$emit('clickBtn')
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  /*返回按键*/
  .back-svg-btn{
    width:59px;
    height:34px;
    display:inline-block;
    cursor:pointer;
    .back-svg{
      fill: #19AFE7;
    }
    &:hover .back-svg{
      fill: #3cc2f4;
    }
    &:active .back-svg{
      fill: #00a0dc;
    }
  }
</style>

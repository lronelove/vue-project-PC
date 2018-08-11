<template>
  <span>
    <div v-if="iconType === 'line'" class="remove-line" :style="{width:width, height: width}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 18 18" enable-background="new 0 0 18 18" xml:space="preserve">
        <polygon class="svg-line" points="1.7,0.3 0.3,1.7 16.3,17.7 17.7,16.3 1.7,0.3       "/>
        <polygon class="svg-line" points="16.3,0.3 0.3,16.3 1.7,17.7 17.7,1.7 16.3,0.3      "/>
      </svg>
    </div>
    <div v-if="iconType === 'circle'" class="remove-circle" :class="{grayIcon: circleColor === 'gray'}" :style="{width:width, height: width}">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
        <circle class="svg-circle" fill-rule="evenodd" clip-rule="evenodd" cx="20" cy="20" r="20"/>
        <polygon fill="#FFFFFF" points="12.7,11.3 11.3,12.7 27.3,28.7 28.7,27.3 12.7,11.3       "/>
        <polygon fill="#FFFFFF" points="27.3,11.3 11.3,27.3 12.7,28.7 28.7,12.7 27.3,11.3       "/>
      </svg>
    </div>
  </span>
</template>
<script>
export default {
  name: 'remove-icon',
  props: {
    /* line类型，一般用于关闭；circle类型：一般用于删除 */
    iconType: {
      type: String,
      default: 'line'
    },

    /* icon大小 */
    width: {
      type: String
    },

    /* circle类型颜色：red,gray */
    circleColor: {
      type: String,
      default: 'red'
    },
    padding: {
      type: String
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../assets/less/variables.less';
  
  .popover .remove-line{
    width: 18px;
    height: 18px;
  }
  .popover-sm .remove-line, .popover-md .remove-line{
    width: 16px;
    height: 16px;
  }
  .remove-line,.remove-circle{
    width: 18px;
    height: 18px;
    cursor: pointer;
    svg{
      vertical-align: top;
    }
  }
  .remove-line{
    .svg-line{
      fill: @close;
    }
    &:hover{
      .svg-line{
        fill: @extra-light-silver;
      }
    }
    &:active{
      .svg-line{
        fill: @light-black;
      }
    }
  }
  .remove-circle{
    .svg-circle{
      fill: @primary-red;
    }
    &:hover{
      .svg-circle{
        fill: @light-red;
      }
    }
    &:active{
      .svg-circle{
        fill: @dark-red;
      }
    }
    &.grayIcon{
      .svg-circle{
        fill: #333;
      }
      &:hover{
        .svg-circle{
          fill: #4a4a4a;
        }
      }
      &:active{
        .svg-circle{
          fill: #252525;
        }
      }
    }
  }
  /* .lineIcon{
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    cursor: pointer;
    &:before {
      content: '\a0';
      position: absolute;
      width: 100%;
      height: 50%;
      border-top: 2px solid @close;
      top: calc(~"50% - 1px");
      left: 0;
    }
    &:after {
      content: '\a0';
      position: absolute;
      height: 100%;
      width: 50%;
      left: calc(~"50% - 1px");
      top: 0;
      border-left: 2px solid @close;
    }
    &:hover&:before{
      border-top: 2px solid @extra-light-silver;
    }
    &:hover&:after{
      border-left: 2px solid @extra-light-silver;
    }
    &:active&:before{
      border-top: 2px solid @light-black;
    }
    &:active&:after{
      border-left: 2px solid @light-black;
    }
  }
  .circleContainer{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    padding: 4px;
    background: @primary-red;
    text-align: center;
    cursor: pointer;
    &:hover{
      background: @light-red;
    }
    &:active{
      background: @dark-red;
    }
    &.grayIcon{
      background: #333;
    }
    &.grayIcon:hover{
      background: #4a4a4a;
    }
    &.grayIcon:active{
      background: #252525;
    }
    .circleIcon{
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      &:before {
        content: '\a0';
        position: absolute;
        width: 100%;
        height: 50%;
        border-top: 2px solid @white;
        top: calc(~"50% - 1px");
        left: 0;
      }
      &:after {
        content: '\a0';
        position: absolute;
        height: 100%;
        width: 50%;
        left: calc(~"50% - 1px");
        top: 0;
        border-left: 2px solid @white;
      }
    }
  } */
</style>

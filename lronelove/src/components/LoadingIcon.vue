<template>
  <div v-show="loading">
    <div class="loading" v-if="loadingType==='dots'">
      <ul class="loading-animation">
        <li v-for="i in 5" :key="i"></li>
      </ul>
    </div>
    <div v-if="loadingType==='ios'">
      <span class="vux-spinner vux-spinner-ios" :style="{width: width, height: width, margin: margin}">
      <svg viewBox="0 0 64 64">
        <g stroke-width="4" stroke-linecap="round">
          <line y1="17" y2="29" transform="translate(32,32) rotate(180)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(210)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(240)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(270)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(300)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(330)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(0)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(30)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(60)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(90)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(120)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" 
              repeatCount="indefinite">
            </animate>
          </line>
          <line y1="17" y2="29" transform="translate(32,32) rotate(150)">
            <animate 
              attributeName="stroke-opacity" 
              dur="750ms" 
              values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" 
              repeatCount="indefinite">
            </animate>
          </line>
        </g>
      </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading-icon',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingType: {
      type: String,
      default: 'dots'
    },
    width: {
      type: String
    },
    margin: {
      type: String
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  @import '../assets/less/variables.less';
  /*loading动画1*/
  .loading {
    width:400px;
    margin:0 auto;
    background:transparent;
    padding:10px 18px;
    position:relative;
    overflow:hidden;
  }
  .loading .loading-animation {
    list-style:none;
    position:relative;
    width:100%;
  }
  .loading .loading-animation li {
    position:absolute;
    height:4px;
    width:4px;
    background:@primary-blue;
    border-radius:3px;
    margin-left:-500%;
    animation-duration:2s;
    animation-timing-function:ease-in-out;
    animation-iteration-count:infinite;
    animation-direction:normal;
  }
  .loading .loading-animation li:nth-child(1) {
    left:35%;
    animation-name:run1;
  }
  .loading .loading-animation li:nth-child(2) {
    left:40%;
    animation-name:run2;
  }
  .loading .loading-animation li:nth-child(3) {
    left:45%;
    animation-name:run3;
  }
  .loading .loading-animation li:nth-child(4) {
    left:50%;
    animation-name:run4;
  }
  .loading .loading-animation li:nth-child(5) {
    left:55%;
    animation-name:run5;
  }
  @keyframes run1 {
    0% {
      margin-left:-500%;
    }
    35%,75% {
      margin-left:0%;
    }
    100% {
      margin-left:500%;
    }
  }
  @keyframes run2 {
    0% {
      margin-left:-500%;
    }
    30%,70% {
      margin-left:0%;
    }
    100% {
      margin-left:500%;
    }
  }
  @keyframes run3 {
    0% {
      margin-left:-500%;
    }
    25%,65% {
      margin-left:0%;
    }
    100% {
      margin-left:500%;
    }
  }
  @keyframes run4 {
    0% {
      margin-left:-500%;
    }
    20%,60% {
      margin-left:0%;
    }
    100% {
      margin-left:500%;
    }
  }
  @keyframes run5 {
    0% {
      margin-left:-500%;
    }
    15%,55% {
      margin-left:0%;
    }
    100% {
      margin-left:500%;
    }
  }
  /* loading动画2 */
  .vux-spinner-ios, .vux-spinner-ios-small {
    stroke: #69717d;
  }
  .vux-spinner {
    stroke: @primary-blue;
    fill: @primary-blue;
    vertical-align: middle;
    display: inline-block;
    margin: 50% 45%;
    width: 40px;
    height: 40px;
  }
</style>

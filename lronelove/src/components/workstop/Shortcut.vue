<!--Shortcut组件：‘我的工作台’中‘快捷通道’的快捷图标，例子：views/home-router-test/Workstop.vue，数据结构：navlist.js-->
<!--props参数意义：
  item: 对象类型，例子{ type: 'glyphicon-cog', id: '1.1', text: '领导视窗', shortcut: '' }
       type: 图标类型; id: stroe/modules/home.js中的shortcuts数组，用来放打开的快捷图标，由id标识; text; shortcut: 是否显示,初始为''，后面改为true/false
-->
<template>
  <div class="shortcut" v-if="show(item)">
    <!--<div class="shortcut-pic" @click="showTab(item)">
      <span class="shortcut-icon glyphicon" :class="item.type"></span>
      <span class="shortcut-close" @click.stop="closeShortcut(item)"><span class="glyphicon glyphicon-minus"></span></span>
    </div>
    <span class="shortcut-title">{{item.text}}</span>-->
    <a class="col-xs-4 col-sm-3 col-md-3 col-lg-2" @click.prevent="showTab(item)">
      <div class="thumbnail">
        <span class="glyphicon shortcut-icon" :class="item.type" :style="{backgroundColor: item.bg, color: item.color}"></span>
        <span class="shortcut-close" @click.stop="closeShortcut(item)"><span class="glyphicon glyphicon-remove"></span></span>
        <div class="caption">
          <h4>{{item.text}}</h4>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import tabArr from '../../utils/tabArr'
export default {
  name: 'shortcut',
  props: [ 'item' ],
  methods: {
    showTab (item) {
      this.$emit('showTab', item)
    },
    closeShortcut (item) {
      this.$emit('closeShortcut', item)
    },
    show (item) {
      /* if (item.shortcut !== '') {
        return item.shortcut
      } else if (window.localStorage.getItem('shortcuts')) {
        let shortcuts = window.localStorage.getItem('shortcuts').split(',')
        return tabArr.indexOfTab(shortcuts, item.id) > -1
      } else {
        return false
      } */
      return tabArr.indexOfTab(this.shortcuts, item.id) > -1
    }
  },
  computed: {
    shortcuts () {
      return this.$store.state.home.shortcuts
    }
  }
}
</script>

<style scoped>
  a{
    cursor:pointer;
  }
  a:hover .thumbnail{
    box-shadow: 2px 2px 4px #ccc;
  }
  a:focus, a:hover {
    text-decoration: none;
  }
  .thumbnail{
    text-align:center;
  }
  .thumbnail .shortcut-icon{
    margin:2%;
    height:55px;
    line-height:55px;
    width:96%;
    display:inline-block;
    border-radius:3px;
    background:#337ab7;
    color:#fff;
    font-size:18px;
  }
  .shortcut-close{
    font-size:10px;
    width:25px;
    height:25px;
    display:none;
    border-radius:50%;
    position:absolute;
    top:-5px;
    right:7px;
    border:1px solid #ccc;
    background:#fff;
    color:#222;
  }
  .shortcut-close > *{
    vertical-align:middle;
    line-height: 20px;
  }
  .thumbnail:hover>.shortcut-close {
      display:block;
  }
/* .shortcut {
  display: -webkit-inline-flex;
  display: inline-flex;
  -webkit-flex-flow: row-reverse wrap;
  flex-flow:row wrap;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
  position:relative;
  padding:10px 5px 5px 10px;
  width:70px;
  box-sizing:content-box;
}
.shortcut-pic {
  width:70px;
  height:70px;
  border-radius:60px;
  font-size: 12px;
  font-family: "Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
  float: left;
  padding: 10px;
  line-height: 1.4;
  text-align: center;
  background-color: #eee;
  position:relative;
}
.shortcut-pic:hover {
  cursor:pointer;
  color: #fff;
  background-color: #5b6274;
  box-shadow:none;
}
.shortcut-icon{
  margin-top: 10px;
  margin-bottom: 10px;
  font-size:24px;
  width:100%;
}
.shortcut-title{
  word-wrap: break-word;
  font-size: 12px;
  text-align:center;
}
.shortcut-close{
  font-size:10px;
  padding:0 2px;
  display:none;
  border-radius:10px;
  position:absolute;
  top:-2px;
  right:2px;
  border:1px solid #bbb;
  background:#eee;
  color:#222;
}
.shortcut-pic:hover>.shortcut-close {
    display:block;
} */
</style>

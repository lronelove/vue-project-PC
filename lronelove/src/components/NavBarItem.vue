<!--NavBarItem组件：首页上的导航项+对应的菜单，例子：Home.vue，数据结构：navlist.js-->
<!--props参数意义：
  src: 字符串类型，导航项图片
  title: 字符串类型，导航项标题
  menulist: 对象数组类型，包含title（menu中一行的标题），
    例子：[{ title: '呼叫中心' }, { title: '工单管理' }]
  submenulist: 数组类型，第二层数组对应menu的一行，第二层数组中的对象对应menu的一项
    例子：submenulist: [
      [{ type: 'glyphicon-wrench', id: '4.1', text: '坐席配置', show: '', shortcut: '', go: '' }, { type: 'glyphicon-log-in', id: '4.2', text: '坐席开通', show: '', shortcut: '', go: '' }, { type: 'glyphicon-search', id: '4.3', text: '录音查询', show: '', shortcut: '', go: '' }, { type: 'glyphicon-search', id: '4.4', text: '登录查询', show: '', shortcut: '', go: '' }, { type: 'glyphicon glyphicon-volume-down', id: '4.5', text: '录音统计', show: '', shortcut: '', go: '' }],
      [{ type: 'glyphicon-time', id: '4.6', text: '待办工单', show: '', shortcut: '', go: '' }, { type: 'glyphicon-edit', id: '4.7', text: '在办工单', show: '', shortcut: '', go: '' }, { type: 'glyphicon-check', id: '4.8', text: '经办工单', show: '', shortcut: '', go: '' }, { type: 'glyphicon-search', id: '4.9', text: '工单查询', show: '', shortcut: '', go: '' }, { type: 'glyphicon-eye-open', id: '4.10', text: '工单督办', show: '', shortcut: '', go: '' }, { type: 'glyphicon-pencil', id: '4.11', text: '工单录入', show: '', shortcut: '', go: '' }, { type: 'glyphicon-ok', id: '4.12', text: '已归档工单', show: '', shortcut: '', go: '' }, { type: 'glyphicon-search', id: '4.13', text: '录音查询', show: '', shortcut: '', go: '' }, { type: 'glyphicon-stats', id: '4.14', text: '三级问题归类统计', show: '', shortcut: '', go: '' }],
    ]
    type:快捷功能的图标; id:标识; text：链接文字; show:tab是否显示; shortcut:快捷功能是否显示; go:跳转的路由
-->
<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="nav">
    <!--nav-->
    <div class="nav-item">
      <!--<img name="image" class="image" v-bind:src="src">-->
      <span class="icon" :class="icon" :style="{color:iconColor}"></span>
      <p name="title" class="nav-title">{{title}}</p>
    </div>
    <!--menu-->
    <ul class="menulist">
      <li v-for="(item,index) in menulist" class="item" :key="index">
        <!--menu中的一行-->
        <div class="menu-title">{{item.title}}</div>
        <div class="menu-detail clearfix">
          <!--menu中的一项：链接、快捷功能-->
          <div 
            style="position:relative;display:inline-block" 
            class="pull-left" 
            v-for="(subitem,index) in submenulist[index]"
            :key="index"
            >
            <a @click.prevent="showtab(subitem)" class="subitem" :key="index">{{subitem.text}}</a>
            <span class="glyphicon glyphicon-plus plus" @click="showShortcut(subitem)"></span>
            <span class="tip">添加快捷功能</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'nav-bar-item',
  props: [ 'icon', 'iconColor', 'src', 'title', 'menulist', 'submenulist' ],
  methods: {
    showtab (subitem) {
      this.$emit('showtab', subitem)
    },
    showShortcut (subitem) {
      this.$emit('showShortcut', subitem)
    },
    showMenu () {
      this.menuStyle.display = 'block'
    },
    hideMenu () {
      console.log('hideMenu')
      this.menuStyle.display = 'none'
    }
  }
}
</script>

<style scoped>
*{
  padding:0;
  margin:0;
}
a{
  text-decoration:none;
}
ul,li {
  list-style-type: none;
}
.icon{
  width:40px;
  height:40px;
  font-size:33px;
}
/* 导航样式*/
.nav{
  display:inline-block;
  text-align:center;
  font-size:14px;
}
.nav-item{
  width:90px;
  height:80px;
  padding:9.6px 16px;
  box-sizing:border-box;
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  color:#eee;
}
.nav:hover >.nav-item{
  background:rgba(255,255,255,0.5);
  color:#333;
  cursor: pointer;
}
/* 菜单样式 */
.nav:hover >.menulist{
  display:block;
}
.menulist{
  display:none;
  position:absolute;
  top:79px;
  right:0;
  z-index:1100;
  padding:16px;
  width:768px;
  background:#fff;
  border:1px solid #ddd;
  text-align:left;
  box-shadow:0px 3px 5px #c5c5c5;
}
.item{
  position:relative;
  vertical-align: top;
}
.item:after{
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.menu-title{
  display:inline;
  font-size:16px;
  color:#333;
  width:128px;
  margin-bottom: 17px;
  position:absolute;
}
.menu-detail{
  width:608px;
  float:left;
  margin-left:120px;
  font-size:0; /* 解决inline-block间隙问题，子元素需要指定font-size */
}
.subitem{
  color: #777;
  display:inline-block;
  margin:0 0 16px 16px;
  padding:1.6px 6.4px;
  border:1px solid #eee;
  font-size:14px;
}
.subitem:hover{
  cursor:pointer;
  background-color:#00b2ce; /*#00b2ce*/
  color:#fff;
  border-color:#00b2ce; /*#4eb0de*/
}
.plus{
  color:#ccc;
  cursor:pointer;
  font-size:14px;
  padding-left:5px;
}
.plus:hover{
  color:#333;
}
.tip{
  display:none;
  position:absolute;
  right:10px;
  top:33px;
  width:86px;
  background:#333;
  color:#fff;
  padding:4px;
  z-index:1000;
  border-radius:4px;
  font-size:10px;
}
.plus:hover +.tip{
  display:inline;
}
</style>

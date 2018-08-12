<!--TabItem组件：首页上的蓝色tab标签，用于导航菜单项、点击其他链接（‘修改密码’/‘帮助中心’/‘我的工作台’中的‘我的待办’/‘快捷功能’）,例子：Home.vue-->
<!--props参数意义：
  item: 对象类型，例子{ id: '0.1', text: '修改密码', show: '', go: 'modifypassword' },
        id:stroe/modules/stroe home.js中的tabs数组，用来放打开的tab，由id标识; text，show: 是否显示,初始为''，后面改为true/false; go(点击tab，跳转的路由)
  selection: 字符串类型，被选中的tab(对应stroe/modules/stroe home.js中的selection，由id标识)
-->
<template>
  <div v-if="show(item)" class="tabitem" :class="{ select: selection === item.id}">
    <a>
      <span @click="switchview(item)" class="tablink">{{item.text}}&nbsp</span>
      <span @click="closetab(item)" class="glyphicon glyphicon-remove" style="font-size:10px"></span>
    </a>
  </div>
</template>

<script>
import tabArr from '../utils/tabArr'

export default {
  name: 'tab-item',
  props: [ 'item', 'selection' ],
  methods: {

    // 关闭tab
    closetab (item) {
      this.$emit('closetab', item)
    },

    // 路由跳转
    switchview (item) {
      this.$emit('switchview', item)
    },
    
    // 判断是否显示：
    // 先判断show属性，如果true/false，则按show属性返回；如果show属性为‘’，则判断sessionStorage中的tabs是否包含该项；如果sessionStorage中的没有tabs，则不显示。
    show (item) {
      /* if (item.show !== '') {
        return item.show
      } else if (window.sessionStorage.getItem('tabs')) {
        return tabArr.indexOfTab(window.sessionStorage.getItem('tabs').split(','), item.id) > -1
      } else {
        return false
      } */
      return tabArr.indexOfTab(this.tabs, item.id) > -1
    }
  },
  computed: {
    tabs () {
      return this.$store.state.home.tabs
    }
  }
}
</script>

<style scoped>
  a{
    text-decoration:none;
  }
  .tab{
    display:inline-block;
  }
  .tabitem{
    font-size:12.8px;
    display:inline-block;
    border:1px solid #ddd;
    border-bottom:none;
    border-radius:6.4px 6.4px 0 0;
    margin:5px 0 0 3.2px;
    padding:0 6.4px;
    height:auto;
  }
  .tabitem.select{
    background-image:none;
    background-color:#89b4da;
  }
  .tabitem:hover{
    background-color:#95c8ea;
  }
  .tabitem a{
    color:#89b4da;
  }
  .tabitem:hover a,.tabitem.select a{
    color:#fff
  }
  .tabitem span{
    cursor:pointer;
  }
  .tablink{
    display:inline-block;
    padding:6.4px 0;
  }
</style>

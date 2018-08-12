<!--
@author: jwolf (blog: jwolf.cn)
props:
  data:树结构的基本数据： exp = {   name: 'My A1',
            id: 'A1',
            hide: false,
            children: []
         }
  isMultiple: 是否支持多选
  isRelative: 是否联动
event:
  onopen: 点击展开按钮触发，把节点id和节点model作为回传参数，异步加载节点可以把子节点对应的json push到model.children中 模拟exp:
  if (model.children.length < 1) {
        setTimeout(function () {
          if (Math.random() > 0.5) {
            model.children.push(
              {
                name: 'D5',
                id: Math.random() * 700,
                hide: false, // 搜索的时候隐藏
                children: [],
                isOpen: item.children.length > 0, // 设置是否当其有子节点时展开
                disabled: !(item.type === 'community') // 设置该节点是否可被勾选
              }
            )
          } else {
            model.isFolder = false // isFolder:是否有小三角
          }
        }, 200)
      }
  oncheck: 每次勾选触发，把节点id和节点model作为回传参数
-->
<template>
  <div style="height: 100%;">
    <div v-if="searchShow" class="search-container">
      <input type="text" class="form-control search-input" v-model.trim="keyword" placeholder="快速查找" @keyup.enter="searchTree()">
      <span class="glyphicon glyphicon-search search-btn" @click="searchTree()"></span>
    </div>
    <div style="margin-left:5px;" class="tree-container scrollbar" :class="{noSearch: !searchShow}">
      <ul id="demo">
        <item :show="!treedata.hide"
              class="{item: true, focus: treedata.focus}"
              :model="treedata"
              @onchange="onchange"
              @oncheck="oncheck"
              :selected="selected"
              :isMultiple="isMultiple"
              :isRelative="isRelative"
              :isOpen="treedata.isOpen"
              :disabled="treedata.disabled"
        >
        </item>
      </ul>
    </div>
  </div>
</template>

<script>
import item from './TreeItem'
import _ from 'lodash'

/**
 * 把传进来的数据结构每个节点都加上加上hide, isFolder属性
 * @param vm vue component上下文
 * @param obj
 */
const formatData = function (vm, obj, parent) {
  if (!obj.hasOwnProperty('hide')) {
    vm.$set(obj, 'hide', false)
  }

  if (!obj.hasOwnProperty('isFolder')) {
    vm.$set(obj, 'isFolder', true)
  }

  if (!obj.hasOwnProperty('isOpen')) {
    vm.$set(obj, 'isOpen', false)
  }

  if (!obj.hasOwnProperty('disabled')) {
    vm.$set(obj, 'disabled', false)
  }

  if (!obj.hasOwnProperty('focus')) {
    vm.$set(obj, 'focus', false)
  }
  obj.parent = parent
  
  if (!obj.children || obj.children.length === 0) {
    return false
  }
  
  for (let i = 0; i < obj.children.length; i++) {
    formatData(vm, obj.children[i], obj)
  }
}
/**
 * 把当前model及其子节点对应的model.id push 到selected的数组中 或从selected 数组中移除
 * @param model TreeItem data 中的model数据 实例
 * @param selected 选中项的id
 * @param isAdd true为push, false为除去
 */

const setChildren = function (model, selected, isAdd) {
  let index = selected.indexOf(model.id)

  if (index > -1 && !isAdd) {
    selected.splice(index, 1)
  } else if (index === -1 && isAdd) {
    selected.push(model.id)
  }
  
  if (!model.children || model.children.length === 0) {
    return false
  }
  
  for (let i = 0; i < model.children.length; i++) {
    setChildren(model.children[i], selected, isAdd)
  }
}
function filter (node, keyword, deep) {
  console.log(keyword.length)
  
  const setAllNode = function (node, value) {
    node.hide = value
    node.focus = false
   
    if (!node.children) return
    
    for (var i = 0; i < node.children.length; i++) {
      setAllNode(node.children[i], value)
    }
  }
  
  if (keyword.length < 1) {
    setAllNode(node, false)
    return
  }

  const deepSearch = function (node, keyword, isDeep) {
    var flag = true
    
    if (node.name.indexOf(keyword) > -1) {
      node.hide = false
      node.focus = true // 设置为高亮
      console.log(node.name + '有' + ', 但是继续筛选子孙节点进行染色（标记匹配关键字）')
      
      if (deep && node.children && node.children.length > 0) {
        
        for (var j = 0; j < node.children.length; j++) {
          console.log('for!!!!')
          deepSearch(node.children[j], keyword, isDeep)
        }
      }
      return true
    } else if (!node.children) {
      node.hide = true
      node.focus = false // 去掉高亮
      console.log(node.name + '没有')
      return false
    } else {
      console.log(node.name + '自己没有,查找它儿子')
      
      for (var i = 0; i < node.children.length; i++) {
        if (deepSearch(node.children[i], keyword)) {
          flag = false
          console.log(node.name + '的第' + (i + 1) + '个儿子有')
        }
      }
      
      if (flag) {
        console.log(node.name + '它儿子也没有')
      } else {
        console.log(node.name + '它儿子有,所以它显示')
        node.isOpen = true // 子孙节点有的话，自动展开
      }
      node.hide = flag
      return !flag
    }
  }
  deepSearch(node, keyword, deep)
}
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isMultiple: {
      type: Boolean,
      default: true
    },
    isRelative: {
      type: Boolean,
      default: false
    },
    searchShow: {
      type: Boolean,
      default: true
    },
    // 是否前端搜索
    searchFrontEnd: {
      type: Boolean,
      default: true
    },
    // 前端搜索的时候，从父节点深度遍历，设置是否搜到匹配节点马上返回还是继续深度遍历
    searchFrontEndDeep: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array]
    }
  },
  data () {
    return {
      keyword: this.key || '',
      treedata: this.data,
      selected: this.isMultiple ? (Array.isArray(this.value) ? this.value : []) : (Array.isArray(this.value) ? this.value : [this.value])
    }
  },
  methods: {
//    change () {
//      console.log('change')
//      this.treedata = {}
//      console.log(JSON.stringify(this.treedata))
//    },
    clearSelected () {
      this.selected = []
    },
    clearKeyWord () {
      if (this.keyword) {
        this.keyword = ''
      }
    },
    onchange (id, model) {
      console.debug('this.selected', this.selected)
      this.$emit('onopen', id, model)
    },
    oncheck (id, model) {
//      this.$nextTick(function () {
//        console.debug('this.selected in next tick: ', this.selected)
//      })
      let result
      let index = this.selected.indexOf(id)
      let flag = index > -1
      if (!this.isMultiple) {
        // 如果单选并且点击的是已经选择的节点
        if (flag) {
          return false
        }
        this.selected.splice(0, this.selected.length)
      }
      if (flag) {
        if (this.isRelative) {
          setChildren(model, this.selected, false)
        } else {
          this.selected.splice(index, 1)
        }
      } else {
        if (this.isRelative) {
          setChildren(model, this.selected, true)
        } else {
          this.selected.push(model.id)
        }
      }
      result = this.isMultiple ? this.selected : (!this.selected[0] ? '' : this.selected[0])
      let self = this
      this.$nextTick(function () {
//        console.debug('this.selected', JSON.stringify(self.selected))
        self.$emit('oncheck', result, model)
        self.$emit('input', result)
//        self.$emit('input', result)
      })
//      setTimeout(function () {
//        console.debug('this.selected', JSON.stringify(self.selected))
//        self.$emit('oncheck', result, model)
//      }, 0)
    },
    searchTree () {
      if (this.searchFrontEnd) {
        filter(this.treedata, this.keyword, this.searchFrontEndDeep)
      } else {
        this.queryTree()
      }
    },
    queryTree: _.debounce(function () {
      this.$emit('queryTree', this.keyword)
    }, 500)
  },
  watch: {
    keyword: function () {
      this.searchTree()
//      console.log('treedata---->')
//      console.log(JSON.stringify(this.treedata))
    },
    'value': function (val) {
      this.selected = this.isMultiple ? (Array.isArray(val) ? val : []) : (Array.isArray(val) ? val : [val])
    }, // 当value为非引用类型时，外部的改变需要引起内部selected的改变
    // 'keyword': _.debounce(function () {
    //   this.queryTree()
    // }, 5000),
    data: {
      handler: function (val, oldVal) {
        if (val) {
          formatData(this, val)
          console.debug('Formatted data:', this.data)
        }
      },
      deep: true
    }
  },
  mounted () {
    formatData(this, this.data, null)
  },
  components: {
    item
  }
}

</script>

<style scoped lang="less">
@import '../assets/less/variables.less';
  span {
    color: @light-black;
  }
  ul, li{
    list-style:none;
    padding:0;
  }
  body{
    background-color:#ff0000;
  }
  .search-btn{
    display:inline-block;
    cursor:pointer;
    position:absolute;
    top: 20px;
    right: 30px;
    color: @extra-light-silver;
    &:hover{
      color: @primary-blue;
    }
  }
  .search-input{
    border-radius:3px;
  }
  .search-container{
    position: relative;
    padding: 10px 20px;
    border-bottom: 1px solid @line;
  }
  .tree-container{
    height: calc(~"100% - 56px");
    overflow: auto;
    padding:10px 20px;
  }
  .tree-container.noSearch{
    height: 100%;
  }
</style>

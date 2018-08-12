<template>
<!-- :class="selectStatus(selected)" -->
  <li v-show="show"  @click.stop.prevent="toggleItem()" :style="{cursor: model.disabled?'auto':'pointer'}">
    <div
      :class="{bold: isFolder}"
      style="height:28px;min-width:150px;">
      <span class="arrow" :style="{visibility: model.isFolder?'inherit':'hidden'}" :class="[folderClass,isClosed]" @click.stop.prevent="toggle"></span>
      <a :class="selectStatus(selected)">
        <span v-if="isMultiple" v-show="!model.disabled" class="checkbox" @click.stop.prevent="toggleItem()"></span>
        <span v-else v-show="!model.disabled" class="radio" @click.stop.prevent="toggleItem()"></span>
        <img v-if="model.organCode !== 'SERVICE-USER'" class="organicIcon" src="../assets/image/organization/company.png" width="18px" style="opacity:1"/>
        <span v-if="model.organCode === 'SERVICE-USER'" class="glyphicon glyphicon-user" style="color:#8492a6;margin-right:5px;"></span>
        <span v-bind:class="['name', model.focus? 'focus' : '']" >{{model.name}}</span>
      </a>
    </div>
    <ul v-show="model.isOpen" v-if="isFolder" >
      <item :show="!model.hide"
        class="item"
        v-for="(model, index) in model.children"
        :model="model"
        :key="'key'+index"
        @onchange="onchange"
        @oncheck="oncheck"
        :selected="selected"
        :isMultiple="isMultiple"
        :isRelative="isRelative"
      >
      </item>
      <!--<li class="add" @click="addChild">+</li>-->
    </ul>
  </li>
</template>

<script>
import Vue from 'vue'

/**
 * 判断实例及其父节点对应的model.id是否存在于selected的数组中
 * @param vueObj vue component 实例
 * @param selected 选中项的id
 */

const checkParent = function (vueObj, selected) {
  if (!vueObj.model) {
    return false
  } else if (selected.indexOf(vueObj.model.id) > -1) {
    return true
  } else {
    return checkParent(vueObj.$parent, selected)
  }
}

/**
 * 根据儿孙节点判断节点的状态，原理：判断节点的子孙节点对应的model.id是否存在于selected的数组中,
 * @param model tree对应的节点json数据 实例
 * @param selected 选中项的id数组
 * @return 1 选中状态 0 半选状态 -1 空状态
 */
const checkNodeState = function (model, selected) {
  let count = 0
  let selectedCount = 0

  const searchChildren = function (m) {
    count++

    if (selected.indexOf(m.id) > -1) {
      selectedCount++
    }

    for (let i = 0; i < m.children.length; i++) {
      searchChildren(m.children[i])
    }
  }

  for (let i = 0; i < model.children.length; i++) {
    searchChildren(model.children[i])
  }

  if (selectedCount === 0) {
    return -1
  } else if (count === selectedCount) {
    return 1
  } else {
    return 0
  }
}

/**
 * 判断实例及其父节点对应的model.id是否存在于selected的数组中
 * @param vueObj vue component 实例
 * @param selected 选中项的id
 */
//  const setParent = function (vueObj, selected) {
//  if (!vueObj.model) {
//    return false
//  } else if (selected.indexOf(vueObj.model.id) > -1) {
//    return true
//  } else {
//    return checkParent(vueObj.$parent, selected)
//  }
//  }

export default {
  name: 'item',
  props: {
    model: Object,
    show: Boolean,
    selected: Array,
    isMultiple: Boolean,
    isRelative: Boolean
  },
  data: function () {
    return {
      folderClass: 'glyphicon node'
    }
  },
  computed: {
    isFolder: function () {
      return this.model.children &&
        this.model.children.length
    },
    isClosed: function () {
      return this.model.isOpen ? 'minus' : 'plus'
    },
    isChecked: function () {
      return this.selected && (this.selected.indexOf(this.model.id) > -1)
    }
  },
  watch: {
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.model.isOpen = !this.model.isOpen
      } else {
        this.model.isOpen = !this.model.isOpen
        this.$emit('onchange', this.model.id, this.model)
      }
    },
    changeType: function () {
      if (!this.isFolder) {
        Vue.set(this.model, 'children', [])
        this.addChild()
        this.model.isOpen = true
      }
    },
    addChild: function () {
      this.model.children.push({
        text: 'new stuff'
      })
    },
    toggleItem: function () {
      if (this.model.disabled) {
        return
      }
      this.$emit('oncheck', this.model.id, this.model)
    },
    onchange (id, model) {
      this.$emit('onchange', id, model)
    },
    oncheck (id, model) {
      this.$emit('oncheck', id, model)
    },
    selectStatus (selected) {
      if (!this.isRelative) {
        return selected.indexOf(this.model.id) > -1 ? 'select' : null
      } else {
        let map = {
          '0': 'half',
          '1': 'select',
          '-1': null
        }

        /* 如果没有儿子节点，那直接根据自身节点判断 */
        let sonsCount = this.model.children.length

        if (sonsCount === 0) {
          return selected.indexOf(this.model.id) > -1 ? 'select' : null
        }
        let temp = selected.indexOf(this.model.id)
        let flag = checkNodeState(this.model, selected)

        if (flag !== 1 && temp > -1) {
          selected.splice(temp, 1)
        } else if (flag === 1 && temp === -1) {
          selected.push(this.model.id)
        }
        return map[flag]
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../assets/less/variables.less';

li.select {
  background: #ddd;
  padding-left: 10px;
  margin-left: -10px;
  line-height: 25px;
}

.name{
  max-width: 130px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name.focus{
  color: @primary-blue;
}
.arrow{
  display: inline-block;
  cursor: pointer;
  vertical-align: middle;
  width:13px;
  height:15px;
}
.arrow:before{
  height:0;
  width:0;
  display: inline-block;
  content: '\a0';
  border: 5px solid transparent;
  border-right-width: 0;
  border-left-width: 6px;
  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  transition: all .3s ease-in-out;
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
}
.minus:before{
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  border-left-color: #97a8be;
}
.plus:before{
  border-left-color: #324057;
}
div{
  font-size: 0;
}
div > * {
  vertical-align:middle;
}
.organicIcon{
  margin-right:5px;
}
a > * {
  vertical-align:middle;
  line-height:21px;
  font-size:14px;
}

/* checkbox style begin */
a.select .checkbox:before{
  box-sizing: content-box;
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 8px;
  width:4px;
  left: 5px;
  top: 1px;
  position: absolute;
  transform: rotate(45deg) scaleY(1);
  -webkit-transform: rotate(45deg) scaleY(1);
  -moz-transform: rotate(45deg) scaleY(1); /*改*/
}
a.half .checkbox:after{
  position:absolute;
  display:block;
  content: "";
  border: 1px solid #fff;
  margin-top: -1px;
  left: 3px;
  right: 3px;
  top: 50%;
}
a .checkbox:before{
  content: '\a0';
  transform: rotate(45deg) scaleY(0);
  -webkit-transform: rotate(45deg) scaleY(0);
  -moz-transform: rotate(45deg) scaleY(0);
  transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
  transform-origin: center;
  -webkit-transform-origin: center;
  -moz-transform-origin: center; /*改*/
}
a.select .checkbox, a.half .checkbox {
  background-color: #19afe7;
  border-color: #00a0e2; /*改*/
}
a:hover .checkbox {
  border-color: #19afe7; /*改*/
}
a .checkbox{
  width: 18px;
  height: 18px;
  margin-right: 5px;
  border-radius: 3px;
  display: inline-block;
  border: 1px solid #bfcbd9;
  text-align: center;
  line-height: 15px;
  background: #fff;
  cursor: pointer;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46); /*改*/
  -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  -moz-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  position:relative;
}
/* checkbox style end */

/* radio style begin */
.radio{
  border: 1px solid;
  border-color: @extra-light-silver;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: @white;
  position: relative;
  cursor: pointer;
  display: inline-block;
  box-sizing: border-box;
  margin-right: 5px;
}
a.select .radio, a.half .radio{
    border-color: @primary-blue;
    background: @primary-blue;
}
a.select .radio:after {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: @white;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  // transform: translate(-50%,-50%) scale(0);
  transition: transform .15s cubic-bezier(.71,-.46,.88,.6);
  transform: translate(-50%,-50%) scale(1);
}
a.half .radio:after{
  width: 8px;
  height: 2px;
  background-color: @white;
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transition: transform .15s cubic-bezier(.71,-.46,.88,.6);
  transform: translate(-50%,-50%) scale(1);
}
/* radio style end */

a{
  color: @light-black;
  padding:2px 5px;
  display: inline-block;
  vertical-align: middle;
  font-size:0;
}
.glyphicon-minus-sign, .glyphicon-plus-sign{
  color: #333;
  font-size:14px;
  margin-right:5px;
}
.glyphicon-minus-sign{
  color:#999;
}
body{
  background-color:#ff0000;
}
li{
  text-align:left;
  white-space: nowrap;
}
span{
  /*height:20px;
  width:20px;
  display:block;
  position:relative;*/
  margin:0;
}

.root{
  width:20px; height:20px; display:block;
}

.root:before{
  content:'';
  height:0px;
  width:0px;
  display:block;
  position:absolute;
  top:0px; left:0px;
  border:20px solid transparent;
  border-bottom-color:#333;
  border-top:0
  }

.root:after{
  content:'';
  height:12px;
  width:12px;
  display:block;
  position:absolute;
  top:18px;
  left:6px;
  border:8px #333 solid;
  border-top-width:10px;
  border-bottom:0;
  }
.folder{
  width:10px;
  position:relative;
  display:inline-block;
}

.folder:before{
  content:'';
  height:0;
  width:0;
  display:block;
  border:6px transparent solid;
  border-right-width:0;
  border-left-color:#333;
  position:absolute;
  top:0px;
  left:0px;
  margin-top: 0px;
  transform-origin: center;
  -webkit-transform-origin: center;
  -moz-transform-origin: center;
  }
.folder.open:before{
  transform-orign: left;
  -webkit-transform-orign: left;
  -moz-transform-orign: left;
  transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
}

span{
  display:inline-block;
}

.node{
  cursor:pointer;
}
ul, li{
  list-style:none
}
ul {
  padding-left: 23px;
}
a:hover{
  text-decoration: none;
}
</style>

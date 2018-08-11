<!--
注意：此组件为旧版（工单用版本），footer传slot会出现异常
slot解释
  slot[header]
  slot[footer]
  slot[name](这个slot是为每一个表格可以从外部传入组件而设置的,slot的name建议设置为每一条数据的所对应该列的attrName + 该条数据多对应的id)

props参数解释
  title：String类型，选填，表格的标题
  hideFlag: Boolean类型，选填，默认为false(不显示),是否显示双击某列该列隐藏的功能
  anotherSave: Boolean类型，选填，默认为false(不显示),右上角的另存为选项
  savedFileName: 选填, 导出excel的文件名
  acrossMode: Boolean类型，选填，默认为false（表格模式）,即是否显示为横栏模式
  iconClass: String类型，选填，左上角的图标类, 默认为'glyphicon glyphicon-th'
  iconColor: String类型，选填，左上角图标的颜色，默认为'#000'黑色
  fontSize: String类型，选填，默认为14px,表格里面字体的大小
  lazy: Boolean类型, 选填，默认为true，表示处于懒模式
  hasLoadingBtn: Boolean类型,选填, 当lazy为true是设置是否显示加载按钮
  addDataLoading: Boolean类型,选填, 显示在最后的loading
  hasNextPage: Boolean类型, 选填，默认为true,表示还有下一页的数据
  tableLoading: Boolean类型，选填，默认为false，数据加载时的动画效果，当数据加载成功时设置为true
  currentPage: Number类型,选填,当前页的页数,默认值为1
    当需要改变时,监听changePage事件
  pageCounts: Array类型,选填，表格中单页可显示的最大行数的可选数组，该数组默认为[10, 15, 20, 25, 30, 50, 100]
    Array类型里面的元素属性
      selected: Boolean类型,必填,默认值
      value: Number类型,必填,数值
  isFrontEndPage: Boolean类型，选填,默认为false,默认为后端分页，若为前端分页则为true
  totalRecords: Number类型,数据总数，若为后端分页则为必填，前端分页则不填
  tableHead: Array类型，必填,表头元素的集合
    tableHead里面元素的属性
      id: Number类型，选填，若不为空则用来绑定slot的name属性，若为空则直接显示为数据
      name: String类型，必填,表头元素的标题
      icon: String类型，选填,表头元素每个标题对应的图标类
      percent: String类型，选填，表头所占的宽度（最好用百分比-显示，并且各元素相加等于100%）,若不填则每列所占相等的宽度
      attrName: String类型，必填,即为对应的data的属性名,若不填则报错
      computed: Function类型, 选填, 输入的参数为该条数据的值，返回的值为显示在table中的值,比如:
      function (val) {
              let map = {
                '0': '其他',
                '1': '寻常生活APP',
                '2': '常服务APP'
              }
              return (map[val] || val)// 或上val防止第二次调用时返回出错
            }
  tableData: Array类型，表格主体部分的内容的数据，数组中一个元素即对应表格中一行数据（数组中元素既可以是数组也可以是对象）
    数组中单个元素所对应的属性（即对应表格中一个表格）
    id: Number类型，选填，若不为空则用来绑定slot的name属性，若为空则直接用来显示数据

注意事项
  当isFrontEndPage为false时，即默认为后端分页时,totalRecords为必需参数
  当attrName不存在时,那么也会报错

数据流说明
  若为后端分页的话，则必须监听query事件,用来执行查询事件,传递出来的是一个对象，包括属性 start, end, number
  若为后端分页的话，则必须监听changeNumber事件,传递出来的是一个number值
  无论前端还是后端，必须监听changePage事件,用来改变当前页数，传递出来的是一个number类型的数字，即为当前的页数

隐藏功能
  当双击某列的列名时，该列会被隐藏

-->
<template>
  <div class="plan-table">
    <div class="table-title">
      <slot name="header">
        <div class="title-left">
          <!--<span :class="iconClass" :style="{color: iconColor}"></span>-->
          <span style="line-height:34px;">{{ title }}</span>
          <!--导航-->
          <slot name="navs"></slot>
        </div>
        <div class="title-right">
          <!--其他按键 div/span-->
          <slot name="buttons"></slot>
          <a v-if="addFlag" class="btn btn-success" @click="addEvents">
            {{addText}}
          </a>
          <!--导出表格-->
          <div class="dropdown" v-clickoutside="hideSave">
            <button v-if="anotherSave" class="btn btn-default btn-group-sm dropdown-toggle" type="button" @click="showSave">
              导出
              <!--<span class="caret"></span>-->
            </button>
            <ul class="dropdown-menu" v-if="flag">
              <li v-for="(s, index) in save" :key="index">
                <a>
                  <label for="saveFile">
                    {{ s.name }}<input type="file" id="saveFile" :accept="s.value">
                  </label>
                </a>
              </li>
            </ul>
          </div>
          <!--<select class="dropdown-toggle" v-model="number" v-if="!lazy">
            <option v-for="pc in filteredPageCounts" :value="pc">{{ pc }}</option>
          </select>-->
          <!-- <select2 v-model="number" :options="computedPageCounts" v-if="!lazy" inputWidth="56px" inputHeight="36px" optionsType="number"></select2> -->
        </div>
      </slot>
    </div>
    <div class="table-body">
      <table v-if="tableHead && tableHead.length > 0" class="table" ref="myTable" :class="noLastPadding ? 'no-last-padding' : ''">
        <thead>
          <tr :class="{borderClass: acrossMode}">
            <!--每个对象包含的列表的头部名称（一个数组）-->
            <th 
              v-for="(item,index) in tableHead" 
              :key="index" :rowspan="computeSpan(item, 0)" 
              :colspan="computeSpan(item, 1)" 
              :style="{width: item.percent}" 
              v-if="!showArray[index]" 
              :class="{borderClass: !acrossMode}" 
              :title="columnMessage()" 
              @dblclick="hideColumn(index)">
              <slot :name="item.id"><span :class="item.icon"></span>{{ typeof item.name === 'object'? item.name.text: item.name }}</slot>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!tableData || tableData.length < 1">
            <!--border: 1px solid #ddd;"-->
            <td :colspan="colNumber" style="height: 60px;vertical-align: middle;text-align: center;">
              <span v-show="!tableLoading">没有任何记录</span>
              <!--<span ></span>-->
              <div class="loading" v-show="tableLoading">
                <ul class="loading-animation">
                  <li v-for="i in 5" :key="i"></li>
                </ul>
              </div>
            </td>
          </tr>
        <!-- filteredArray即为这个表格中单页显示的数组数据 -->
          <tr  v-else v-for="(obj,index) in filteredArray" :key="index" :class="{borderClass: acrossMode, selectClass: selectTr}" @click="selectLine(obj, index)" :style="{cursor: selectTr ? 'pointer' : 'auto'}">
            <td v-for="(o,index) in obj" :key="index" :rowspan="computeSpan(o, 0)" :colspan="computeSpan(o, 1)" v-if="!showArray[getObjectKeyOrder(obj,index)]" :class="{borderClass: !acrossMode}" :style="{fontSize: fontSize}" style="vertical-align: middle">
              <slot :name="o.id">{{ typeof o === 'object'? o.text: o }}</slot>
            </td>
          </tr>
          <tr v-if="fixedRows && tableData.length > 0" class="fixedTr" :class="{borderClass: acrossMode}">
            <td 
              v-for="(o,index) in fixedObject" 
              :class="{borderClass: !acrossMode}" 
              :style="{fontSize: fontSize}" 
              :key="index" 
              style="vertical-align: middle">
              <slot :name="o.id">{{ typeof o === 'object'? o.text: o }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="loading" v-show="addDataLoading">
        <ul class="loading-animation">
          <li v-for="i in 5" :key="i"></li>
        </ul>
      </div>
      <button v-if="lazy && hasLoadingBtn && hasNextPage && tableData.length > 0" @click="lazyLoad" class="btn btn-primary" style="text-align: center">加载</button>
    </div>

    <div class="table-footer" v-if="!lazy" v-show="!fakeFooterFlag">
      <slot name="footer">
        <div class="footer-left">
          <span>第<span> {{ start }} </span>到<span> {{ end }} </span>条记录,共<span> {{ sum }} </span>条</span>
        </div>
        <div class="flex-start">
          <span>
            每页显示
            <select2 
              style="margin: 0 5px;" 
              ref="footerSelect2" 
              directionOverRide="top" 
              v-model="number" 
              :options="computedPageCounts" 
              v-if="!lazy" 
              inputWidth="56px" 
              inputHeight="28px" 
              optionsType="number">
            </select2>条
          </span>
          <div class="footer-right" style="margin-left:20px;">
            <!--<button type="button" class="btn-prev left-btn" :disabled="firstDisable" @click="firstPage">首页</button>-->
            <button type="button" class="btn-prev" :disabled="firstDisable" @click="previousPage"><i class="glyphicon glyphicon-menu-left"></i></button>
            <ul class="page-number" v-if="pageNumber">
              <li @click="firstPage" :class="{active: currentPage === 1}">1</li>
              <li class="more" v-if="pageNumber >= 7 && filteredPage[0] !== 2" @click="previousSection">
                <span class="d-arrow"><i class="glyphicon glyphicon-menu-left"></i><i class="glyphicon glyphicon-menu-left" style="margin-left: -7px;"></i></span>
                <span class="dots glyphicon glyphicon-option-horizontal"></span>
              </li>
              <li 
                v-for="(page, index) in filteredPage" 
                :key="index" 
                @click="changeValue(page)" 
                :class="{active: page === currentPage}">{{ page }}
              </li>
              <li class="more" v-if="pageNumber >= 7 && filteredPage[filteredPage.length - 1] !== pageNumber - 1" @click="nextSection">
                <span class="d-arrow"><i class="glyphicon glyphicon-menu-right"></i><i class="glyphicon glyphicon-menu-right" style="margin-left: -7px;"></i></span>
                <span class="dots glyphicon glyphicon-option-horizontal"></span>
              </li>
              <li v-if="pageNumber !== 1" @click="lastPage" :class="{active: currentPage === pageNumber}">{{pageNumber}}</li>
            </ul>
            <button class="btn-next" :disabled="lastDisable" @click="nextPage"><i class="glyphicon glyphicon-menu-right"></i></button>
            <!--<button class="btn-next right-btn" :disabled="lastDisable" @click="lastPage">末页</button>-->
          </div>
        </div>

      </slot>
    </div>

    <!-- 懒加载模式的页脚 -->

    <div class="table-footer" v-if="lazy" v-show="!fakeFooterFlag">
      <slot name="footer">
        <div class="footer-left">
          <span>第<span v-if="tableData.length > 0"> 1 </span> 
          <span v-else> 0 </span>到
          <span> {{ tableData.length }} </span>条记录,共
          <span> {{ sum }} </span>条</span>
        </div>
      </slot>
    </div>
    <div class="table-footer-fake" v-show="fakeFooterFlag">
      <table-slot-copy v-if="!defaultFooterFlag" ref="tableSlotCopy" />
      <div v-else>
        <div v-if="!lazy">
          <div class="footer-left">
            <span>第<span> {{ start }} </span>到<span> {{ end }} </span>条记录,共<span> {{ sum }} </span>条</span>
          </div>
          <div class="flex-start">
          <span>
            每页显示
            <select2 
              ref="fakeFooterSelect2" 
              directionOverRide="top" 
              style="margin: 0 5px;" 
              v-model="number" 
              :options="computedPageCounts" 
              v-if="!lazy" 
              inputWidth="56px" 
              inputHeight="28px" 
              optionsType="number">
            </select2>条
          </span>
            <div class="footer-right" style="margin-left:20px;">
              <!--<button type="button" class="btn-prev left-btn" :disabled="firstDisable" @click="firstPage">首页</button>-->
              <button type="button" class="btn-prev" :disabled="firstDisable" @click="previousPage"><i class="glyphicon glyphicon-menu-left"></i></button>
              <ul class="page-number" v-if="pageNumber">
                <li @click="firstPage" :class="{active: currentPage === 1}">1</li>
                <li class="more" v-if="pageNumber >= 7 && filteredPage[0] !== 2" @click="previousSection">
                  <span class="d-arrow"><i class="glyphicon glyphicon-menu-left"></i><i class="glyphicon glyphicon-menu-left" style="margin-left: -7px;"></i></span>
                  <span class="dots glyphicon glyphicon-option-horizontal"></span>
                </li>
                <li 
                  v-for="(page, index) in filteredPage" 
                  :key="index" 
                  @click="changeValue(page)" 
                  :class="{active: page === currentPage}">{{ page }}
                </li>
                <li class="more" v-if="pageNumber >= 7 && filteredPage[filteredPage.length - 1] !== pageNumber - 1" @click="nextSection">
                  <span class="d-arrow"><i class="glyphicon glyphicon-menu-right"></i><i class="glyphicon glyphicon-menu-right" style="margin-left: -7px;"></i></span>
                  <span class="dots glyphicon glyphicon-option-horizontal"></span>
                </li>
                <li v-if="pageNumber !== 1" @click="lastPage" :class="{active: currentPage === pageNumber}">{{pageNumber}}</li>
              </ul>
              <button class="btn-next" :disabled="lastDisable" @click="nextPage"><i class="glyphicon glyphicon-menu-right"></i></button>
              <!--<button class="btn-next right-btn" :disabled="lastDisable" @click="lastPage">末页</button>-->
            </div>
          </div>
        </div>
        <div v-else>
          <div class="footer-left">
            <span>第<span v-if="tableData.length > 0"> 1 </span> <span v-else> 0 </span>到<span> {{ tableData.length }} </span>条记录,共<span> {{ sum }} </span>条</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import _ from 'lodash'
import {table2Excel} from '../utils/utils'
import Select2 from './Select2.vue'
import Vue from 'vue'
import ElementResize from '../utils/directive/elementresizeevent'

var tableSlotCopy = Vue.component('tableSlotCopy', {
  render: function (createElement) {
    return createElement(
      'div',   // tag name
      [deepClone(createElement)] // array of children
    )
  }
})
var tableFooterSlot = ''
function deepClone (createElement) {
  if (!tableFooterSlot || tableFooterSlot === '') return
  var vnodes = tableFooterSlot

  function cloneVNode (vnode) {
    const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode))
    const cloned = createElement(vnode.tag, vnode.data, clonedChildren)
    
    cloned.text = vnode.text
    cloned.isComment = vnode.isComment
    cloned.componentOptions = vnode.componentOptions
    cloned.elm = vnode.elm
    cloned.context = vnode.context
    cloned.ns = vnode.ns
    cloned.isStatic = vnode.isStatic
    cloned.key = vnode.key
    return cloned
  }
  const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode))
  console.log(clonedVNodes)
  return clonedVNodes
}
export default {
  components: {
    Select2,
    tableSlotCopy
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    hideFlag: {
      type: Boolean,
      default: false
    },
    addFlag: {
      type: Boolean,
      default: false
    },
    addText: {
      type: String,
      default: '新建'
    },
    anotherSave: {
      type: Boolean,
      default: false
    },
    /* 导出excel的文件名 */
    savedFileName: {
      type: String
    },
    iconClass: {
      type: String,
      default: 'glyphicon glyphicon-th'
    },
    iconColor: {
      type: String,
      default: '#000'
    },
    fontSize: {
      type: String,
      default: '14px'
    },
    pageCounts: {
      type: Array,
      default: () => {
        return [{selected: true, value: 10}, 15, 20, 25, 30, 50, 100]
      }
    },
    acrossMode: {
      type: Boolean,
      default: true
    },
    isFrontEndPage: {
      type: Boolean,
      default: false
    },
    /* 假如isFrontEndPage是false，则这个为必需传入的值，否则为非必需 */
    totalRecords: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    tableHead: Array,
    tableData: Array,
    tableLoading: {
      type: Boolean,
      default: false
    },
    fixedRows: {
      type: Boolean,
      default: false
    },
    fixedObject: {
      type: Object
    },
    lazy: {
      type: Boolean,
      default: false
    },
    hasNextPage: {
      type: Boolean,
      default: false
    },
    selectTr: {
      type: Boolean,
      default: false
    },
    hasLoadingBtn: {
      type: Boolean,
      default: true
    },
    addDataLoading: {
      type: Boolean,
      default: false
    },
    fakeFooterFlagControl: {
      type: Boolean,
      default: true
    },

    // 最后一列是否有默认的padding-right:20px;
    noLastPadding: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultFooterFlag: true,

      /* 浮动底部开关 */
      fakeFooterFlag: false,

      /* 作为判断是否显示或者隐藏另存为后的选项的参数 */
      flag: false,

      /* 表格每页显示的数据数量 */
      number: null,

      /* 用来生成showArray的引子 */
      showArr: [],
      
      /* 用来筛选需要显示的对象属性组成的数组(filteredTableData里使用) */
      pick: [],
      
      /* 另存为所显示的选项名和选项值 */
      save: [{name: 'CSV', value: 'text/csv'}, {name: 'Excel', value: 'application/vnd.ms-excel'}]
    }
  },
  directives: {
    clickoutside
  },
  activated () {
    console.log('segiTable activated!')
    this.buildFakeFooter()
  },
  watch: {
    tableData (val) {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
    },
    number () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      if (this.isFrontEndPage) {
        this.$emit('changePage', 1)
      } else {
        this.$emit('changeNumber', this.number)
        
        if (this.currentPage === 1) {
          (this.tableData.length < this.totalRecords || this.number < this.tableData.length) && this.$emit('query', {start: this.start, end: this.end, number: this.number})
        } else {
          this.$emit('changePage', 1)
        }
      }
    },
    currentPage () {
      if (!this.isFrontEndPage) {
        this.$emit('query', {start: this.start, end: this.end, number: this.number})
      }
    }
    /* 当table为后端分页时，tableData的长度如果和本应该接受的长度不一致时提示的错误信息 */
/*    tableData () {
      if (!this.isFrontEndPage) {
        if (this.totalRecords === 0) {
          if (this.tableData.length !== 0) {
            console.error('[SegiTable Warn]: The length of tableData more than totalRecords')
          }
        } else {
          if (this.tableData.length > (this.end + 1 - this.start)) {
            console.error('[SegiTable Warn]: The length of tableData' + this.tableData.length + 'more than  computed data length' + this.end + 1 - this.start)
            this.tableData = this.tableData.slice(0, (this.end + 1 - this.start))
          } else if (this.tableData.length < (this.end + 1 - this.start)) {
            console.error('[SegiTable Warn]: The length of tableData' + this.tableData.length + 'less than  computed data length' + this.end + 1 - this.start)
          }
        }
      }
    } */
  },
  computed: {
    /* 生成的显示在右上角的每页可选数据的数组 */
    filteredPageCounts () {
      let arr = []

      this.pageCounts.forEach((item) => {
        if (typeof item === 'object' && item.hasOwnProperty('value')) {
          arr.push(item.value)
        } else {
          arr.push(item)
        }
      })
      return arr
    },
    computedPageCounts () {
      let arr = []

      this.pageCounts.forEach((item) => {
        if (typeof item === 'object' && item.hasOwnProperty('value')) {
          arr.push({name: item.value.toString(), value: item.value})
        } else {
          arr.push({name: item.toString(), value: item})
        }
      })
      return arr
    },
    /* 生成的每列的显示状态的数组 */
    showArray () {
      for (let i = 0; i < this.tableHead.length; i++) {
        if (this.showArr.length === this.tableHead.length) {
          break
        }
        this.showArr.push(false)
      }
      return this.showArr
    },
    /* 当没有数据时合并的列数 */
    colNumber () {
      return this.showArray.filter((item) => {
        return item === false
      }).length
    },
    /* 筛序数据使每列的data与head对齐 */
    filteredTableData () {
      if (!Array.isArray(this.tableData) || this.tableData.length === 0) {
        return []
      }
      let arr = []
      let computedProperties = []

      for (let i = 0; i < this.tableHead.length; i++) {
        if (typeof this.tableHead[i] === 'object' && this.tableHead[i].hasOwnProperty('attrName')) {
          this.pick.push(this.tableHead[i].attrName)

          if (this.tableHead[i].hasOwnProperty('computed')) {
            computedProperties.push({name: this.tableHead[i].attrName, fn: this.tableHead[i].computed})
          }
        } else {
          console.error('attrName not found!')
          throw new Error('attrName not found in tableHead[' + i + ']!')
        }
      }
      this.tableData.forEach((item) => {
        computedProperties.forEach((pro) => {
          item[pro.name] = pro.fn(item[pro.name])
        })
        typeof item === 'object' && arr.push(_.pick(item, this.pick))
      })
      arr.forEach((item) => {
        for (let i in item) {
          if (item[i] === null || item[i] === undefined) {
            item[i] = ''
          }
        }
      })
      this.pick = []
      return arr
    },
    /* 数据总数 */
    sum () {
      if (this.isFrontEndPage) {
        if (this.tableData && this.tableData.length > 0) {
          return this.tableData.length
        }
        return 0
      } else {
        if (Number.isInteger(this.totalRecords)) {
          return this.totalRecords
        } else {
          return 0
        }
      }
    },
    /* 前两个按钮对应为disable的class */
    firstDisable () {
      if (this.sum === 0) {
        return true
      }
      if (this.currentPage === 1) {
        return true
      }
      return false
    },
    /* 后两个按钮对应为disable的class */
    lastDisable () {
      if (this.sum === 0) {
        return true
      }
      if (this.currentPage === this.pageNumber) {
        return true
      }
      return false
    },
    /* 底部栏的页数 */
    pageNumber () {
      return Math.ceil(this.sum / this.number)
    },
    /* 底部的开始页数 */
    start () {
      if (this.sum === 0) {
        return 0
      }
      return ((this.currentPage - 1) * this.number) + 1
    },
    /* 底部的结束页数 */
    end () {
      if (this.sum === 0) {
        return 0
      }
      if (this.isFrontEndPage) {
        return (this.currentPage * this.number) > this.tableData.length ? this.tableData.length : (this.currentPage * this.number)
      } else {
        return this.number < (this.totalRecords - (this.start - 1)) ? (this.currentPage * this.number) : this.totalRecords
      }
    },
    /* 底部栏的总页数的数组 */
    showPage () {
      let arr = []

      for (let i = 0; i < this.pageNumber; i++) {
        arr.push(i + 1)
      }
      return arr
    },
    /* 在列表中显示的数组 */
    filteredArray () {
      if (this.isFrontEndPage) {
        return this.filteredTableData.slice(this.start - 1, this.end)
      } else {
        return this.filteredTableData
      }
    },
    /* 在列表底部显示的分页功能 */
    filteredPage () {
      if (this.pageNumber < 7) {
        return this.showPage.slice(1, this.pageNumber - 1) // 比如1：1-0，2：1-1，3：1-2
      } else {
        let start = this.currentPage - 3
        let end = this.currentPage + 2

        if (start < 1) {
          start = 1
          end = 6
          console.log('if < ', this.currentPage, start, end)
        } else if (end > this.pageNumber - 1) {
          end = this.pageNumber - 1
          start = end - 5
          console.log('else if', this.currentPage, start, end)
        }
        console.log('sdsds', this.currentPage, start, end)
        return this.showPage.slice(start, end)
      }
    }
  },
  /* 在SegiTable加载初始阶段把number的值挑选出来 */
  created () {
    for (let i = 0; i < this.pageCounts.length; i++) {
      if (typeof this.pageCounts[i] === 'object' && this.pageCounts[i].hasOwnProperty('value') && this.pageCounts[i].hasOwnProperty('selected') && this.pageCounts[i].selected) {
        this.number = this.pageCounts[i].value
      }
    }
  },
  methods: {
    buildFakeFooter () {
      var self = this
      var footer = self.$el.getElementsByClassName('table-footer')[0]
      var fakeFooter = self.$el.getElementsByClassName('table-footer-fake')[0]
      var warp = closest(self.$el, '.scrollbar')

      if (!warp) {
        self.fakeFooterFlag = false
        self.defaultFooterFlag = false
        return
      }
      tableFooterSlot = self.$slots.footer

      /* 默认footer的情况 */
      if (!tableFooterSlot) {
        self.defaultFooterFlag = true

        setTimeout(() => {
          fakeFooter.style.bottom = (((window.innerHeight - warp.getBoundingClientRect().bottom) > 0) ? (window.innerHeight - warp.getBoundingClientRect().bottom) : 0) + 'px'
        }, 0)
//        console.log(warp.getBoundingClientRect().bottom)
        showFakeFooterOrNot(footer, fakeFooter, warp, self);
        (function (footer, fakeFooter, warp, self) {
          if (!warp.onscroll) {
            warp.onscroll = function () {
              showFakeFooterOrNot(footer, fakeFooter, warp, self)
            }
          } else {
            let temp = warp.onscroll
            warp.onscroll = function () {
              showFakeFooterOrNot(footer, fakeFooter, warp, self)
              temp()
            }
          }
        })(footer, fakeFooter, warp, self)
        return
      } else {
        self.defaultFooterFlag = false

        /* footer是由外部传入slot的情况 */
        console.log(tableFooterSlot)
        if (self.fakeFooterFlagControl) {
          self.fakeFooterFlag = true
        }

//        fakeFooter.style.width = footer.offsetWidth + 'px'
        setTimeout(() => {
          fakeFooter.style.bottom = (((window.innerHeight - warp.getBoundingClientRect().bottom) > 0) ? (window.innerHeight - warp.getBoundingClientRect().bottom) : 0) + 'px'
        }, 0)
        showFakeFooterOrNot(footer, fakeFooter, warp, self);

        (function (footer, fakeFooter, warp, self) {
          if (!warp.onscroll) {
            warp.onscroll = function () {
              showFakeFooterOrNot(footer, fakeFooter, warp, self)
            }
          } else {
            let temp = warp.onscroll
            warp.onscroll = function () {
              showFakeFooterOrNot(footer, fakeFooter, warp, self)
              temp()
            }
          }
        })(footer, fakeFooter, warp, self)
        console.log(self.$refs.tableSlotCopy)
        self.$refs.tableSlotCopy.$forceUpdate()
      }

      function showFakeFooterOrNot (footer, fakeFooter, warp, self) {
//        fakeFooter.style.width = footer.offsetWidth + 'px'
        fakeFooter.style.width = self.$el.getElementsByClassName('table-body')[0].offsetWidth + 'px'
        fakeFooter.style.bottom = (((window.innerHeight - warp.getBoundingClientRect().bottom) > 0) ? (window.innerHeight - warp.getBoundingClientRect().bottom) : 0) + 'px'
//        console.log(((window.innerHeight - warp.getBoundingClientRect().bottom) > 0) ? (window.innerHeight - warp.getBoundingClientRect().bottom) : 0)
        if (((warp.getBoundingClientRect().bottom > window.innerHeight) ? window.innerHeight : warp.getBoundingClientRect().bottom) < self.$el.getBoundingClientRect().bottom + fakeFooter.offsetHeight &&
          ((warp.getBoundingClientRect().bottom > window.innerHeight) ? window.innerHeight : warp.getBoundingClientRect().bottom) > (self.$el.getBoundingClientRect().top + 100)
          ) {
          if (self.fakeFooterFlag === false && self.$refs.footerSelect2 && self.$refs.footerSelect2.show) {
            self.$refs.footerSelect2.toggle()
          }
          if (self.fakeFooterFlagControl) {
            self.fakeFooterFlag = true
          }
//          console.log('block')
        } else {
          self.fakeFooterFlag = false
//          console.log('none')
        }
      }

      function closest (el, selector) {
        var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
        while (el) {
          if (matchesSelector.call(el, selector)) {
            break
          }
          el = el.parentElement
        }
//        console.log(el)
        return el
      }
    },

    /* 选中一行tr */
    selectLine (obj, index) {
      if (this.selectTr) {
        this.$emit('selectLine', {obj, index})
      }
    },

    /* 懒加载事件 */
    lazyLoad () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', (this.currentPage + 1))
      this.$emit('load')
    },

    /* 双击隐藏此列的提示信息 */
    columnMessage () {
      let content = this.hideFlag ? '双击隐藏此列' : null
      return content
    },

    /* 获取对象的初始key所对应的顺序 */
    getObjectKeyOrder (obj, key) {
      let i = 0
      for (let k in obj) {
        if (key === String(k)) {
          return i
        }
        i++
      }
    },

    /* 新增事件 */
    addEvents () {
      this.$emit('add')
    },
    
    /* 显示或隐藏另存为 */
    showSave () {
      table2Excel(this.$refs.myTable, 'xlsx', this.savedFileName || this.title)
    },
    
    /* 隐藏另存为 */
    hideSave () {
      this.flag = false
    },
    
    /* 改变当前的页面 */
    changeValue (page) {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', page)
    },
    
    /* 隐藏该列 */
    hideColumn (index) {
      this.hideFlag && (this.$set(this.showArray, index, true))
    },
    
    /* 底部栏的第一页 */
    firstPage () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', 1)
    },
    
    /* 上一页 */
    previousPage () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', (this.currentPage - 1))
    },
    
    /* 下一页 */
    nextPage () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', (this.currentPage + 1))
    },
    
    /* 上五页 */
    previousSection () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      let page = (this.currentPage - 5 < 1) ? 1 : this.currentPage - 5
      this.$emit('changePage', page)
    },
    
    /* 下五页 */
    nextSection () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      let page = (this.currentPage + 5 > this.pageNumber) ? this.pageNumber : this.currentPage + 5
      this.$emit('changePage', page)
    },
    
    /* 最后一页 */
    lastPage () {
      var self = this
      this.$nextTick(function () {
        self.buildFakeFooter()
      })
      this.$emit('changePage', this.pageNumber)
    },
    
    /* 计算跨行或跨列 */
    computeSpan (obj, isRow) {
      if (typeof obj === 'object') {
        return (isRow === 0) ? (obj.rowspan || 1) : (obj.colspan || 1)
      } else {
        return 1
      }
    }
  },
  mounted () {
    var self = this
    this.buildFakeFooter()
    var el = this.$el.querySelector('.table-body')
    
    ElementResize(el, (elem) => {
      self.$el.getElementsByClassName('table-footer-fake')[0].style.width = self.$el.getElementsByClassName('table-body')[0].offsetWidth + 'px'
    })
    window.addEventListener('resize', function () {
      self.$el.getElementsByClassName('table-footer-fake')[0].style.width = self.$el.getElementsByClassName('table-body')[0].offsetWidth + 'px'
      self.buildFakeFooter()
    }, false)
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/variables.less';

.flex-start {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  -webkit-align-items: center;
  -webkit-justify-content: flex-start;
}
input[type='file'] {
  position:absolute;
  clip:rect(0 0 0 0);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.title-right ul {
  display: block;
}
select {
  height:36px;
  min-width: 54px;
  vertical-align:middle;
  border-color:#ccc;
  border-radius:4px;
}
select:hover {
  cursor: pointer;
}
.plan-table {
  width: 100%;
  position:relative;
  background:#fff;
  border: 1px solid @gray;
  box-shadow: @container-shadow;
  border-radius: 4px;
}
.plan-table {
  margin-bottom: 60px;
}
.plan-table .table{
  margin-bottom: 0;
}
.borderClass {
  /*border: 1px solid #ddd;*/
}
tr.selectClass {
  .icon-ok{
    color: @primary-green;
    display: none;
  }
  &:hover{
    .icon-ok{
      display: inline-block;
    }
  }
}
table.table>thead>tr>td, table.table>thead>tr>th {
  border-bottom-width: 1px;
}
.table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td{
  border-bottom: 1px solid @gray;
  border-top: none;
}
table {
  width: 100%;
  table-layout: fixed;
}
td,th {
  display: table-cell;
  text-align: left;
}
td:first-child, th:first-child{
  padding-left: 20px;
}
td:last-child, th:last-child{
  padding-right: 20px;
}
.no-last-padding{
  td:last-child, th:last-child{
    padding-right: 0;
  }
}
th {
  background:@extra-light-gray;
  color: @black;
}
tr:nth-child(even){
  background: @table-stripe;
}
tr:hover {
  background: @light-gray;
}
.fixedTr:hover {
  background: #ffffff;
}
td {
  overflow: hidden;
  white-space: nowrap;
  word-wrap:break-word;
  word-break: break-all;
  text-overflow: ellipsis
}
td:hover {
  text-overflow: inherit;
  white-space: normal;
  overflow: visible;
}
.table-title {
  /*background: #eef1f6;*/
  border-bottom: 1px solid @gray;
  /*border: 1px solid @gray;
  border-bottom: none;*/
  /*height: 40px;*/
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  min-height: 50px;
}
.table-body {
  /*padding: 10px;*/
}
.title-left {
  position: relative;
  color: @black;
  font-size: 18px;
}
.title-right {
  position: relative;
  font-size: 0;
}
.title-right > *{
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
}
.title-right>div, .title-right>span {
  display: inline-block;
  font-size: 0;
}
.title-right>div > *, .title-right>span > *{
  font-size: 14px;
}
.title-right .btn + .btn{
  margin-left: 20px;
}
.table-footer {
  /*height: 40px;*/
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  /*border: 1px solid @gray;
  border-top: none;*/
  padding: 10px 20px;
}
.footer-left {
  position: relative;
}
.footer-right{
  display: inline-block;
  position: relative;
  font-size: 0;
  button{
    display: inline-block;
    font-size: 13px;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    vertical-align: top;
    box-sizing: border-box;
    background: 50% no-repeat;
    background-size: 16px;
    background-color: @white;
    border: 1px solid @extra-light-silver;
    cursor: pointer;
    margin: 0;
    outline:none;
    color: @icon-color;
    &:hover{
       color: @primary-blue;
    }
    &:disabled {
      color: @extra-light-silver;
      cursor: not-allowed;
    }
  }
  .btn-prev{
    border-right: 0;
    border-radius: 4px 0 0 4px;
  }
  .btn-next{
    border-radius: 0 4px 4px 0;
  }
  .more{
    color: @icon-color;
    .d-arrow{
      display: none;
      position: relative;
      i{
        position: absolute;
        top: -12px;
        left: -4px;
      }
    }
    .dots{
      display: inline;
    }
    &:hover {
      color: @primary-blue;
      .d-arrow{
        display: inline-block;
      }
      .dots{
        display: none;
      }
     }
  }
  /*.arrow-icon{
    box-sizing: content-box;
    border: 2px solid @icon-color;
    border-left: 0;
    border-top: 0;
    height: 7px;
    width: 7px;
    display: block;
  }
  .arrow-left{
    transform: rotate(135deg) scale(1);
  }*/
  /*.left-btn{
    border-radius: 4px 0 0 4px;
  }
  .right-btn{
    border-radius: 0 4px 4px 0;
    border-left: 0;
  }*/
}
.footer-right ul,.footer-right li{
  padding: 0;
  margin:0;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.page-number {
  display: inline-block;
  & li{
    display: inline-block;
    padding: 0;
    border: 1px solid @extra-light-silver;
    border-right: 0;
    background: @white;
    font-size: 13px;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    &:hover{
      color: @primary-blue;
    }
    &.active{
       border-color: @primary-blue;
       background-color: @primary-blue;
       color: @white;
       cursor: default;
     }
  }
}
.dropdown-menu li a {
  position: relative;
}
.dropdown-menu li a label {
  width: 100%;
  height: 100%;
}
/*临时修改table组件分页按钮颜色*/
.btn.btn-default.selectedPage {
  background: #777;
  border-left:1px solid transparent;
  border-right:1px solid transparent;
  color: #fff;
}
.btn.btn-default.selectedPage:active {
  background: #d4d4d4;
  /*border-left:1px solid transparent;*/
  /*border-right:1px solid transparent;*/
  color: #333;
}
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
  background:#337ab7;
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
.table-footer-fake {
  position: fixed;
  background-color: #fff;
  /*display: none;*/
  padding: 10px 20px;
  border: 1px solid @gray;
}
.table-footer-fake .footer-left{
  float: left;
}
.table-footer-fake .flex-start{
  float: right
}
.table-footer-fake .drop{
  transform: rotate(180deg);
}
</style>

<!-- props参数解释

slot[header]
slot[footer]

title：String类型，表格的标题,默认为排班计划列表
iconClass: String类型，左上角的图标类.
fontSize: String类型，表格里面字体的大小。
pageCounts: Array类型,表格中单页可显示的最大行数的可选数组(该数组默认为[10, 15, 20, 25, 30, 50, 100])
isFrontEndPage: Boolean类型，默认为false,默认为后端分页，若为前端分页则为true
totalRecords: Number类型,后端分页时的必须参数,前端分页时不需要
tableHead: Array类型，表头元素的集合
  id: Number类型，若不为空则用来绑定slot的name属性，若为空则直接显示为数据
  name: String类型，表头元素的标题
  percent: String类型，表头所占的宽度（最好用百分比-显示，并且各元素相加等于100%）
  attrName: String类型，可选,即为对应的data的属性名。
tableData: Array类型，表格主体部分的内容的数据，数组中一个元素即对应表格中一行数据（数组中元素既可以是数组也可以是对象）
  数组中单个元素所对应的属性（即对应表格中一个表格）
  id: Number类型，若不为空则用来绑定slot的name属性，若为空则用来直接显示数据

注意事项:totalRecords为必需参数
注：table后端分页之前有bug，已更正。但simpleTable没有一起更新，simpleTable不适用于后端分页。
-->
<template>
  <div class="list">
    <div class="table-title clearfix">
      <slot name="header">
        <div class="title-right pull-right">
          <span class="drop-top">
            <label>
              <input type="text" class="form-control search-input" v-model.trim="searchName" :placeholder="holder">
              <span class="glyphicon glyphicon-search search-btn"></span>
            </label>
          </span>
          <select v-model="number" class="dropdown-toggle" style="height:3rem;vertical-align:middle;border-color:#ccc;border-radius:4px;">
            <option v-for="(pc, index) in pageCounts" :key="index" :value="pc">{{ pc }}</option>
          </select>
          <a type="button" class="btn btn-default" style="margin-left:10px;" @click.prevent="refreshTable">
            <span class="glyphicon glyphicon-refresh" :class={rotation:refresh}></span>
            <span>刷新</span>
          </a>
        </div>
      </slot>
    </div>
    <div class="table-body">
      <table class="table" v-if="tableHead && tableHead.length > 0">
        <thead>
        <tr>
          <!--每个对象包含的列表的头部名称（一个数组）-->
          <th v-for="(item,index) in tableHead" :key="index" :style="{width: item.percent}" :class="{hide: showArray[index]}">
            <slot :name="item.id"><span :class="item.icon"></span>{{ item.name }}</slot>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="!tableData || tableData.length < 1">
          <td :colspan="colNumber" style="height: 6rem;text-align: center">
            <span v-show="!tableLoading">没有任何记录</span>
            <div class="loading" v-show="tableLoading">
              <ul class="loading-animation">
                <li v-for="i in 5" :key="i"></li>
              </ul>
            </div>
          </td>
        </tr>
        <!-- filteredArray即为这个表格中单页显示的数组数据 -->
        <tr  v-else v-for="obj in filteredArray" :key="obj.toString()">
          <td v-for="(o,index) in obj" :key="index" :class="{hide: showArray[getObjectKeyOrder(obj,index)], num: !isNaN(o)}" style="min-height: 4rem;text-align: center">
            <div v-if="o === null || o=== undefined">''</div>
            <slot v-else :name="o.id">{{ o }}</slot>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <slot name="footer">
          <div class="footer-left">
            <span>第<span> {{ start }} </span>到<span> {{ end }} </span>条记录,共<span> {{ sum }} </span>条</span>
          </div>
          <div class="footer-right">
            <button type="button" class="btn btn-default" :disabled="firstDisable" @click="firstPage">首页</button>
            <button type="button" class="btn btn-default" :disabled="firstDisable" @click="previousPage">上页</button>
            <div class="page-number" v-if="pageNumber">
              <a 
                class="btn btn-default" 
                v-for="page in filteredPage" 
                @click.prevent="changeCurrentPage(page)"
                :key="page.toString()" 
                :class="{selectedPage: page === currentPage}"
              >{{ page }}
              </a>
            </div>
            <button class="btn btn-default" :disabled="lastDisable" @click="nextPage">下页</button>
            <button class="btn btn-default" :disabled="lastDisable" @click="lastPage">末页</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'
import _ from 'lodash'

export default {
  props: {
    holder: {
      type: String,
      default: '关键字'
    },
    title: {
      type: String,
      default: '排班计划列表'
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
        return [10, 15, 20, 25, 30, 50, 100]
      }
    },
    isFrontEndPage: {
      type: Boolean,
      default: true
    },

    /* 假如isFrontEndPage是false，则这个为必需传入的值，否则为非必需 */
    totalRecords: {
      type: Number,
      default: 0
    },
    tableHead: Array,
    tableData: Array,
    tableLoading: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchName: '',
      flag: false,
      number: 30,
      currentPage: 1,
      showArr: [],
      pick: []
    }
  },
  directives: {
    clickoutside
  },
  watch: {
    number () {
      this.currentPage = 1
    },
    searchName (val) {
      if (val) {
        this.currentPage = 1
      }
    }
  },
  computed: {

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

      for (let i = 0; i < this.tableHead.length; i++) {
        if (typeof this.tableHead[i] === 'object' && this.tableHead[i].hasOwnProperty('attrName')) {
          this.pick.push(this.tableHead[i].attrName)
        } else {
          return this.tableData
        }
      }

      this.tableData.forEach((item) => {
        // console.info(_.pick(item, this.pick))
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
        console.debug('front-end')
        if (this.searchData && this.searchData.length > 0) {
          return this.searchData.length
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
        return (this.currentPage * this.number) > this.searchData.length ? this.searchData.length : (this.currentPage * this.number)
      } else {
        return this.number < (this.totalRecords - this.start) ? (this.currentPage * this.number) : this.totalRecords
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
    searchData () {
      let self = this
      let list = []

      this.filteredTableData.map(function (item) {
        for (let i in item) {
          if ((typeof (item[i]) === String || Number) && item[i].toString().indexOf(self.searchName) > -1) {
            list.push(item)
            break
          } else if (item[i].text && (typeof (item[i].text) === String || Number) && item[i].text.toString().indexOf(self.searchName) > -1) {
            list.push(item)
            break
          }
        }
      })
      return list
    },

    /* 在列表中显示的数组 */
    filteredArray () {
      if (this.isFrontEndPage) {
        return this.searchData.slice(this.start - 1, this.end) /* 前端过滤 */
      } else {
        return this.filteredTableData
      }
    },

    /* 在列表底部显示的分页功能 */
    filteredPage () {
      if (this.pageNumber < 5) {
        return this.showPage.slice(0, this.pageNumber)
      } else {
        let start = this.currentPage - 3
        let end = this.currentPage + 2

        if (start < 0) {
          start = 0
          end = 5
        } else if (end > this.pageNumber) {
          end = this.pageNumber
          start = end - 5
        }
        return this.showPage.slice(start, end)
      }
    }
  },
  created () {
    // console.debug(this.sum)
  },
  methods: {
    refreshTable () {
      this.currentPage = 1
      this.$emit('refreshTable', true)
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

    /* 显示或隐藏另存为 */
    showSave () {
      this.flag = !this.flag
    },

    /* 隐藏另存为 */
    hideSave () {
      this.flag = false
    },

    /* 改变当前的页面 */
    changeCurrentPage (page) {
      this.currentPage = page
    },
    /* 隐藏该列 */
    /* hideColumn (index) {
      this.$set(this.showArray, index, true)
    }, */

    /* 底部栏的第一页 */
    firstPage () {
      this.currentPage = 1
    },

    /* 上一页 */
    previousPage () {
      this.currentPage--
    },

    /* 下一页 */
    nextPage () {
      this.currentPage++
    },

    /* 最后一页 */
    lastPage () {
      this.currentPage = this.pageNumber
    }
  }
}
</script>

<style scoped>
  .list tr>td, .list tr>th{
    height:50px;
    vertical-align:middle;
    /* line-height:35px; */
  }
  .list .num{
    font-size:18px;
    font-weight:bold;
    /* font-style: italic; */
  }
  .list .num .glyphicon-arrow-up{
    font-size:14px;
    font-style: italic;
    color:#a1ce5b;
  }
  .list .num .glyphicon-arrow-down{
    font-size:14px;
    font-style: italic;
    color:#eb7479;
  }
  .drop-top input{
    width:auto;
    display:inline-block;
    font-weight: normal;
  }
  .title-right>*{
    vertical-align:middle;
  }
  .search-btn{
    margin-left:-70px;
    cursor:pointer;
  }
  .search-input{
    padding-right:30px;margin-right:40px
  }

.table>thead>tr>th {
    vertical-align: bottom;
    border-bottom: 1px solid #ddd;
    font-weight:normal;
    text-align:center;
}
.table {
  width: 100%;
  table-layout: fixed;
  /*margin: 1rem;*/
}
.table tbody tr td {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis
}
.table tbody tr td:hover {
  text-overflow: inherit;
  white-space: normal;
  overflow: visible;
}
.table-title {
  /*background:linear-gradient(#eee, #fafafa,#fafafa,#eee);*/
  /* border-bottom: 1px solid #C2C2C2; */
}
.table-title>* {
  margin: 5px 0;
}
.table-body {
  padding: 5px;
  border:1px solid #ddd;
  margin-bottom: 1rem;
}
.title-left {
  margin-left: 1rem;
}
.title-right {
  margin-right: 1rem;
}
.title-right select {
  height: 3rem;
  min-width: 5rem;
  /*width: 30%;*/
}
.table-footer {
  height: 4rem;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}
.footer-left {
  position: relative;
  left: 1rem;
}
.footer-right {
  display: inline-block;
  position: relative;
  right: 1rem;
}
.page-number {
  display: inline-block;
}
.dropdown-menu li a {
  position: relative;
}
.dropdown-menu li a label {
  width: 100%;
  height: 100%;
}
.selectedPage {
  background: #777;
  border-left:1px solid transparent;
  border-right:1px solid transparent;
  color: #fff;
}
/*loading动画*/
.loading {
  width:400px;
  margin:0 auto;
  /* background:#fff; */
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
  .rotation{
    animation:move .4s linear infinite both;
    -webkit-animation:move .4s linear infinite both;
    -moz-animation:move .4s linear infinite both;
  }
  @keyframes move{
    from {transform:rotate(-360deg);}
    to {transform:rotate(0);}
   }
  @-webkit-keyframes move{
    from {transform:rotate(-360deg);-webkit-transform:rotate(-360deg);}
    to {transform:rotate(0);-webkit-transform:rotate(0);}
  }
  @-moz-keyframes move{
    from {transform:rotate(-360deg);-moz-transform:rotate(-360deg);}
    to {transform:rotate(0);-moz-transform:rotate(0);}
  }
</style>

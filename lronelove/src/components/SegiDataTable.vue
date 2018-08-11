<template>
  <div style="background:#fff;position:relative;">
    <!--title标题-->
    <div class="table-title">
      <div class="title-left">
        <span :class="titleIcon" style="color: titleIconColor"></span>
        <span>{{ title }}</span>
      </div>
      <div class="title-right">
        <div class="dropdown" style="display: inline-block;" v-clickoutside="hideSave">
          <a class="btn btn-default btn-group-sm dropdown-toggle" style="background:#ddd;" type="button" @click.prevent="showSave">
            另存为
            <span class="caret"></span>
          </a>
          <ul v-if="flag"  class="dropdown-menu"  style="display: block;min-width: 70px;">
            <li v-for="item in save">
              <a href="javascript:void(0)" @click.prevent="saveAnother">
                <label for="saveFile">{{ item.name }}
                </label>
                <form style="position: relative;">
                  <input type="file" id="saveFile" :accept="item.value" style="position:absolute;clip:rect(0 0 0 0);">
                </form>
              </a>
            </li>
          </ul>
        </div>
        <select v-model="page" style="vertical-align:top;display: inline-block;width:40px;height:32px;border-radius:3px;border:1px solid #ccc;">
          <option v-for="arr in pageCounts" :value="arr" v-text="arr" :selected="$index === 0 ? true : false"></option>
        </select>
      </div>
    </div>

    <!--tabel-->
    <div class="v-table">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th v-for="column in dataTable.columns"
                @click="sortBy(column)"
                :class="{sort: isSortable(column),
                         desc: sort.sortBy === column.value && sort.desc,
                         asc: sort.sortBy === column.value && !sort.desc}"
                :style="{width: column.percent}"
            >
              <slot :name="column.text + index">{{ column.text }}</slot>
              <span style="display:block;margin-top:10px;" class="caret"></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!paginationAndfilteredRows || paginationAndfilteredRows.length<1">
            <td :colspan="dataTable.columns.length" style="text-align: center">没有任何记录</td>
          </tr>
          <tr v-else v-for="row in paginationAndfilteredRows">
            <td v-for="(item, key, index) in row" @click="editField(item, key)" class="text-overflow">
              <span v-if ="!item.editing">
                <slot :name="item.orderId">{{ item.value }}</slot>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!--分页-->
      <div v-if="paginationAndfilteredRows && paginationAndfilteredRows.length>0" class="v-table-footer">
        <div class="v-table-footer-info">
          第{{firstRow + 1}}到{{lastRow}}条记录，共{{filteredRows.length}}条记录
        </div>

        <div class="v-table-footer-page" v-if ="lastPage !== 1">
          <a class="v-table-footer-page-btn" href="javascript:"
             @click="togglePage('prev')"
             :class="{disabled: currentPage == 1}">上一页</a>

          <a class="v-table-footer-page-btn" href="javascript:"
             :class="{current: currentPage == 1}"
             @click="togglePage(1)">1</a>
          <span v-if ="currentPage >= 5 && lastPage > 10">...</span>
          <a class="v-table-footer-page-btn" href="javascript:"
             :class="{current: currentPage == page + 1}"
             @click="togglePage(page + 1)"
             v-for="page in centerPartPage">{{page + 1}}</a>
          <span v-if ="lastPage > 10 && lastPage - currentPage > 5">...</span>
          <a class="v-table-footer-page-btn" href="javascript:"
             :class="{current: currentPage == page + 1}"
             @click="togglePage(page + 1)"
             v-for="page in lastPartPage">{{page + 1}}</a>

          <a class="v-table-footer-page-btn" href="javascript:"
             @click="togglePage('next')"
             :class="{disabled: currentPage == lastPage}">下一页</a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import clickoutside from '../utils/directive/clickoutside'
  export default {
    directives: {
      clickoutside
    },
    props: {
      /* title属性 */
      title: {
        type: String,
        default: '排班计划列表'
      },
      titleIcon: {
        type: String,
        default: 'glyphicon glyphicon-th'
      },
      titleIconColor: {
        type: String,
        default: '#000'
      },
      save: {
        type: Array,
        default: () => {
          return [{name: 'CSV', value: 'text/csv'}, {name: 'Excel', value: 'application/vnd.ms-excel'}]
        }
      },
      /* table属性 */
      dataTable: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // dataTable示例
      /* tableData: {
        options: {
          // Global sort option
          sortable: true,
          // Global edit option
          editable: false,
          // How many items will be shown in each page
          pageCount: 2,
          // Callback of change page
          onPageChanged (page) {
            console.log(page)
          }
        },
        columns: [
          {
            value: 1,
            text: '提单人',
            percent: '52px',
            // If this column is sortable
            sortable: false,
            // If this column is editable
            editable: false
          },
          {
            value: 2,
            text: '手机号',
            percent: '94px',
            sortable: false,
            editable: false
          },
          {
            value: 3,
            text: '所属房屋',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 4,
            text: '所属项目',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 5,
            text: '服务类型',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 6,
            text: '申请时间',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 7,
            text: '工单信息',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 8,
            text: '处理状态',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 9,
            text: '下一步处理人',
            percent: '10%',
            sortable: false,
            editable: false
          },
          {
            value: 10,
            text: '评价',
            percent: '40px',
            sortable: false,
            editable: false
          },
          {
            value: 11,
            text: '费用/元',
            percent: '8%',
            sortable: false,
            editable: false
          },
          {
            value: 12,
            text: '超时',
            percent: '40px',
            sortable: false,
            editable: false
          },
          {
            value: 13,
            text: '工单来源',
            percent: '7%',
            sortable: false,
            editable: false
          },
          {
            value: 14,
            text: '操作',
            percent: '110px',
            sortable: false,
            editable: false
          }
        ],
        rows: [
          {
            firstStaff: { value: '罗文卿' },
            tel: { value: '13923771968' },
            house: { value: '香颂花园C座/15J房' },
            project: { value: '绿景香颂' },
            serviceType: { value: '室内维修【其他】' },
            time: { value: '2016-12-29 15:30:26' },
            info: { value: '开落地井盖' },
            status: { value: '待接单' },
            nextStaff: { value: '张志军' },
            comment: { value: '' },
            fee: { value: '免费' },
            outTime: { value: '' },
            resource: { value: '400录入' },
            buttons: {
              orderId: 1,
              value: [
                {
                  'text': '详情',
                  'class': 'btn btn-success',
                  'func': (event, column, field, subitem) => {
                    this.showModal(subitem)
                  }
                },
                {
                  'text': '播放',
                  'class': 'btn btn-default',
                  'func': function (event, column, field) {
                    console.log(event)
                    console.log(column)
                    console.log(field)
                  }
                }
              ]
            }
          },
          {
            firstStaff: { value: '林晓云' },
            tel: { value: '15820773801' },
            house: { value: '北区D座1单元11C房' },
            project: { value: '1866北区' },
            serviceType: { value: '室内维修【水管类】' },
            time: { value: '2016-12-29 15:15:41' },
            info: { value: '北区D座1单元11C房洗碗盆下水管堵塞，预约15:40上门维修' },
            status: { value: '处理中' },
            nextStaff: { value: '林孝煌' },
            comment: { value: '' },
            fee: { value: '免费' },
            outTime: { value: '' },
            resource: { value: '400录入' },
            buttons: {
              orderId: 2,
              value: [
                {
                  'text': '详情',
                  'class': 'btn btn-success',
                  'func': (event, column, field, subitem) => {
                    this.showModal(subitem)
                  }
                }
              ]
            }
          },
          {
            firstStaff: { value: '林晓云' },
            tel: { value: '15820773801' },
            house: { value: '北区D座1单元11C房' },
            project: { value: '1866北区' },
            serviceType: { value: '室内维修【水管类】' },
            time: { value: '2016-12-29 15:15:41' },
            info: { value: '北区D座1单元11C房洗碗盆下水管堵塞，预约15:40上门维修' },
            status: { value: '处理中' },
            nextStaff: { value: '林孝煌' },
            comment: { value: '' },
            fee: { value: '免费' },
            outTime: { value: '' },
            resource: { value: '400录入' },
            buttons: {
              orderId: 3,
              value: [
                {
                  'text': '详情',
                  'class': 'btn btn-success',
                  'func': (event, column, field, subitem) => {
                    this.showModal(subitem)
                  }
                }
              ]
            }
          }
        ]
      } */
      // 每页显示个数
      pageCount: {
        type: Number,
        default: 3
      },
      // 显示个数数组
      pageCounts: {
        type: Array,
        default: () => {
          return [2, 3, 10, 15, 20, 25, 30, 50, 100]
        }
      },
      // 是否请求服务器端数据
      async: {
        type: Boolean,
        default: false
      },
      // AJAX地址
      url: {
        type: String,
        default: ''
      },
      // 参数内容
      param: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      console.log(this.dataTable.options)
      return {
        flag: false, // 另存为下拉菜单
        currentPage: 1, // 当前页面
        searchBy: '',
        rows: [], // 表格数据
        sort: {
          sortBy: '',
          desc: true
        },
        page: this.pageCount // 每页显示多少行，取prop的值
      }
    },
    computed: {
      filteredRows () {
        return this.filterRows(this.dataTable.rows, this.dataTable.options, this.currentPage)
      },
      paginationAndfilteredRows () {
        return this.getPageRows(this.filteredRows, this.currentPage, this.page)
      },
      lastPage () {
        console.log(this.filteredRows.length + ' & ' + this.page)
        return Math.ceil(this.filteredRows.length / this.page)
      },
      centerPartPage () {
        if (this.lastPage > 10 && this.currentPage >= 5) {
          if (this.lastPage - this.currentPage > 5) {
            return this.currentPage === this.lastPage ? [this.currentPage - 3, this.currentPage - 2, this.currentPage - 1] : [this.currentPage - 2, this.currentPage - 1, this.currentPage]
          } else {
            const r = []
            for (let i = this.lastPage - 6; i < this.lastPage; i++) {
              r.push(i)
            }
            return r
          }
        } else if (this.lastPage > 10) {
          const r = []
          for (let i = 1; i < 5; i++) {
            r.push(i)
          }
          return r
        } else {
          const r = []
          for (let i = 1; i < this.lastPage; i++) {
            r.push(i)
          }
          return r
        }
      },
      lastPartPage () {
        if (this.lastPage > 10 && this.lastPage - this.currentPage > 5) {
          return [this.lastPage - 1]
        } else {
          return []
        }
      },
      firstRow () {
        return this.currentPage === 1 ? 0 : this.page * (this.currentPage - 1)
      },
      lastRow () {
        return this.page * this.currentPage > this.filteredRows.length ? this.filteredRows.length : this.page * this.currentPage
      }
    },
    watch: {
      'dataTable.rows' (rows) {
        rows.forEach((row, index) => {
          for (let key in row) {
            const column = this.dataTable.columns.filter((column) => {
              return column.value === key
            })[0]
            console.log(column)
            row[key] = Object.assign({
              editable: false,
              editing: false,
              tmpValue: ''
            }, row[key])
          }
          this.dataTable.rows[index] = row
        })
      },
      'dataTable.columns' (columns) {
        columns.forEach((column, index) => {
          column = Object.assign({
            editable: false,
            sortable: false
          }, column)
          this.dataTable.columns[index] = column
        })
      },
      'searchBy' (val) {
        if (val) {
          this.currentPage = 1
        }
      },
      // 如果用户选择每页显示多少行，则页面跳回第一页
      'page' (val) {
        if (val) {
          this.currentPage = 1
        }
      }
    },
    filters: {
    },
    methods: {
      /*  title */
      // 显示或隐藏“另存为”
      showSave () {
        this.flag = !this.flag
      },
      // 隐藏“另存为”
      hideSave () {
        this.flag = false
      },
      // “另存为”
      saveAnother () {
        this.showSave()
      },
      /* table */
      onChangePageCount () {
        this.currentPage = 1
      },
      filterRows (rows, options, currentPage) {
        rows = this.sort.sortBy ? this.sortRows(rows, this.sort.sortBy) : rows
        if (this.searchBy !== '') {
          rows = rows.filter((row) => {
            let r = false
            for (let key in row) {
              if (row[key].value
                  .toString()
                  .toLowerCase()
                  .indexOf(this.searchBy.toLowerCase()) !== -1) {
                r = true
              }
            }
            return r
          })
        }
        return rows
      },
      getPageRows (rows, currentPage, pageCount) {
        if (!this.async) {
          console.log(currentPage + ' & ' + pageCount)
          return rows.slice(this.firstRow, this.lastRow)
        } else {
          console.log('getPageRows from server')
          this.param.firstRow = this.firstRow
          this.param.lastRow = this.lastRow
          this.$http({
            url: this.url, method: 'POST', data: this.param
          }).then((response) => {
            return response.rows
          })
        } // add getPageRows from server
      },
      togglePage (page) {
        switch (page) {
          case 'prev':
            if (this.currentPage <= 1) return
            this.currentPage--
            break
          case 'next':
            if (this.currentPage >= this.lastPage) return
            this.currentPage++
            break
          default:
            if (this.currentPage === page) return
            this.currentPage = page
        }
        if (this.dataTable.onPageChanged) {
          this.dataTable.onPageChanged(this.currentPage)
        }
      },
      sortBy (column) {
        if (!column.sortable || !this.dataTable.options.sortable) return
        if (column.value === this.sort.sortBy) {
          this.sort.desc = !this.sort.desc
        } else {
          this.sort.sortBy = column.value
          this.sort.desc = true
        }
      },
      editField (field, key) {
        if (!this.isEditable(field, key, true)) return
        field.tmpValue = field.value
        field.editing = true
      },
      saveEdit (field) {
        field.value = field.tmpValue
        field.editing = false
        field.tmpValue = ''
      },
      cancelEdit (field) {
        field.editing = false
        field.tmpValue = ''
      },
      sortRows (rows, sortBy) {
        const arr = rows.slice(0)
        return arr.sort((a, b) => {
          const r = this.sort.desc ? a[sortBy].value < b[sortBy].value : a[sortBy].value > b[sortBy].value
          return r ? 1 : -1
        })
      },
      isSortable (column) {
        return column.sortable && this.dataTable.options.sortable
      },
      isEditable (field, key, beforeEditing) {
        const column = this.dataTable.columns.filter((column) => {
          return column.value === key
        })[0]
        if (beforeEditing) {
          return field.editable && this.dataTable.options.editable && column.editable
        } else {
          return field.editable && this.dataTable.options.editable && field.editing && column.editable
        }
      }
    }
  }
</script>

<style scoped>
  /* title */
  .table-title {
    height: 4rem;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    border:1px solid #ccc;
    border-bottom:none;
    background:#fafafa;
    font-size:14px;
  }
  .title-left {
    position: relative;
    left: 1rem;
  }
  .title-right {
    position: relative;
    right: 1rem;
  }
  /* table */
  .v-table{
    padding:13px;
    border:1px solid #ccc;
  }
  .v-table table {
    width: 100%;
    border-collapse: collapse;
    table-layout:fixed
  }
  .v-table table thead {
    border-bottom: 1px solid #111111;
  }
  .v-table table thead th {
    position: inherit;
    /* padding: 10px 18px;*/
    text-align: left;
    background-color: #FAFAFA;
    font-weight: bold;
  }
  .v-table table thead th.sort {
    cursor: pointer;
  }
  .v-table table thead th.sort::after {
    content: "";
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #FAFAFA;
    right: 5px;
    top: 50%;
    margin-top: -10px;
    display: none;
  }
  .v-table table thead th.sort::before {
    content: "";
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #FAFAFA;
    right: 5px;
    top: 50%;
    margin-top: 3px;
    transform: rotate(180deg);
    display: none;
  }
  .v-table table thead th.sort.desc::after {
    display: none;
  }
  .v-table table thead th.sort.desc::before {
    content: "";
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #333;
    right: 5px;
    top: 50%;
    margin-top: -5px;
  }
  .v-table table thead th.sort.asc::before {
    display: none;
  }
  .v-table table thead th.sort.asc::after {
    content: "";
    position: absolute;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 10px solid #333;
    right: 5px;
    top: 50%;
    margin-top: -5px;
  }
  .v-table table tbody {
    border-bottom: 1px solid #111111;
  }
  .v-table table tbody tr {
    background-color: #fff;
  }
  .v-table table tbody tr td {
    text-align: left;
    padding: 10px 8px;
    max-width: 150px;
  }
  .v-table table tbody tr td div{
    text-overflow: ellipsis;
    overflow-y: auto;
  }
  .v-table table tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
  .v-table table tbody tr:nth-child(odd) td:nth-child(1) {
    background-color: #F1F1F2;
  }
  .v-table table tbody tr:nth-child(even) td:nth-child(1) {
    background-color: #fafafa;
  }
  .v-table .v-table-header, .v-table .v-table-footer {
    display: table;
    height: 40px;
    width: 100%;
    line-height: 40px;
  }
  .v-table .v-table-header::after, .v-table .v-table-footer::after {
    content: '';
    clear: both;
  }
  .v-table .v-table-header-count {
    float: left;
  }
  .v-table .v-table-header-search {
    float: right;
  }
  .v-table .v-table-footer {
    margin-top: 10px;
  }
  .v-table .v-table-footer-info {
    float: left;
    font-size:13px;
  }
  .v-table .v-table-footer-page {
    font-size: 0;
    float: right;
  }
  .v-table .v-table-footer-page span {
    display: inline-block;
    /*font-size: 1rem;*/
    padding: 10px 15px;
  }
  .v-table .v-table-footer-page-btn {
    display: inline-block;
    height: 40px;
    box-sizing: border-box;
    padding: 0px 15px;
    line-height: 40px;
    text-decoration: none;
    color: #000;
    border-radius: 2px;
    font-size: 1rem;
  }
  .v-table .v-table-footer-page-btn:hover {
    color: #fff;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    background-color: #333;
  }
  .v-table .v-table-footer-page-btn:nth-last-child(1) {
    margin-right: 0;
  }
  .v-table .v-table-footer-page-btn.disabled {
    cursor: default;
    color: #666;
  }
  .v-table .v-table-footer-page-btn.disabled:hover {
    color: #666;
    background-color: transparent;
    border: none;
  }
  .v-table .v-table-footer-page-btn.current {
    color: #000;
    border: 1px solid #979797;
    background-color: #fff;
  }

  .text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-overflow:hover {
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
</style>




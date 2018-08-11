/**
* Created by Richard Chao on 2016/12/19.
*/
<template>
  <div class="v-table">
    <!--<div class="v-table-header">-->
      <!--<div class="v-table-header-count">-->
        <!--Show-->
        <!--<select v-model="dataTable.options.pageCount" @change="onChangePageCount()">-->
          <!--<option>5</option>-->
          <!--<option>10</option>-->
          <!--<option>15</option>-->
          <!--<option>20</option>-->
        <!--</select>-->
        <!--items each page-->
      <!--</div>-->

      <div class="v-table-header-search">
        Search <input type="text" v-model="searchBy">
      </div>
    <!--</div>-->
    <table class="table table-bordered">
      <thead>
      <tr>
        <th v-for="column in dataTable.columns"
            @click="sortBy(column)"
            :class="{sort: isSortable(column),
                       desc: sort.sortBy === column.value && sort.desc,
                       asc: sort.sortBy === column.value && !sort.desc}">{{column.text}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in paginationAndfilteredRows" track-by="$index">
        <td v-for="(item, key, index) in row" @click="editField(item, key)">
            <span v-if ="!item.editing">
              <div v-if="isButton(item, key, index)">
                <button type="button"
                        v-for="button in item.value"
                        :class="button.class"
                        @click="button.func($event, key, button)" style="margin: 2px">{{button.text}}</button>
              </div>
              <div v-else>
                <div v-if="isHTML(item, key, index)">{{item.value}}</div>
                <div v-else>{{item.value}}</div>
              </div>
            </span>
          <!--<div v-if ="isEditable(item, key)">-->
            <!--<input type="text" v-model="item.tmpValue">-->
            <!--<button type="button" @click.stop="saveEdit(item)">Save</button>-->
            <!--<button type="button" @click.stop="cancelEdit(item)">Cancel</button>-->
          <!--</div>-->
        </td>
      </tr>
      </tbody>
    </table>

    <div class="v-table-footer">
      <div class="v-table-footer-info">
        Showing {{firstRow + 1}} to {{lastRow}} of {{filteredRows.length}} items
      </div>

      <div class="v-table-footer-page" v-if ="lastPage !== 1">
        <a class="v-table-footer-page-btn" href="javascript:"
           @click="togglePage('prev')"
           :class="{disabled: currentPage == 1}">Prev</a>

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
           :class="{disabled: currentPage == lastPage}">Next</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['dataTable'],
    data () {
      console.log(this.dataTable.options)
      return {
        currentPage: 1,
        searchBy: '',
        rows: [],
        sort: {
          sortBy: '',
          desc: true
        }
      }
    },
    computed: {
      // 根据排序和关键字过滤表格
      filteredRows () {
        return this.filterRows(this.dataTable.rows, this.dataTable.options, this.currentPage)
      },
      // 计算出第几页是最后一页
      lastPage () {
        console.log(this.filteredRows.length + ' & ' + this.dataTable.options.pageCount)
        return Math.ceil(this.filteredRows.length / this.dataTable.options.pageCount)
      },
      // 生成部分页码 如 1 2 .... 13 14 15效果
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
      // 计算第一行数据序号
      firstRow () {
        return this.currentPage === 1 ? 0 : this.dataTable.options.pageCount * (this.currentPage - 1)
      },
      // 计算最后一行数据序号
      lastRow () {
        return this.dataTable.options.pageCount * this.currentPage > this.filteredRows.length ? this.filteredRows.length : this.dataTable.options.pageCount * this.currentPage
      },
      // 对过滤了的数据进行分页
      paginationAndfilteredRows () {
//        var filteredRows = this.filteredRows
//        console.log(rows)
//        console.log(this.getPageRows(this.filteredRows, this.currentPage, this.dataTable.options.pageCount))
        return this.getPageRows(this.filteredRows, this.currentPage, this.dataTable.options.pageCount)
//      | pagination 'currentPage' dataTable.options.pageCount
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
      }
    },
    filters: {
//      pagination: function (rows, currentPage, pageCount) {
//        console.log(rows + ' & ' + currentPage + ' & ' + pageCount)
//        return this.getPageRows(rows, currentPage, pageCount)
//      }
    },
    methods: {
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
        console.log(currentPage + ' & ' + pageCount)
        return rows.slice(this.firstRow, this.lastRow)
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
      },
      isHTML (item, key, index) {
        var result = this.dataTable.columns.filter((column) => {
          // console.log(column.value + ' & ' + index)
          return column.value === (index + 1)
        })
          // console.log(item)
          // console.log(key)
        if (result !== undefined && result.length !== 0) {
          // console.log('is html? ' + result[0].isHTML)
          return result[0].isHTML
        } else {
          return false
        }
      },
      isButton (item, key, index) {
//        console.log('isButton?')
        // console.log(item.value)
        var result = this.dataTable.columns.filter((column) => {
          return column.value === (index + 1)
        })
//        console.log(result)
        if (result !== undefined && result.length !== 0) {
          return result[0].isButton
        } else {
          return false
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-table table {
    width: 100%;
    border-collapse: collapse;
  }
  .v-table table thead {
    border-bottom: 1px solid #111111;
  }
  .v-table table thead th {
    position: inherit;
    padding: 10px 18px;
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
  }
  .v-table .v-table-footer-page {
    font-size: 0;
    float: right;
  }
  .v-table .v-table-footer-page span {
    display: inline-block;
    font-size: 1rem;
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
    /*background: linear-gradient(to bottom, #fff 0%, #dcdcdc 100%);*/
  }
</style>

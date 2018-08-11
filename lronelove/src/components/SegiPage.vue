<!-- Created by Lucifer -->
<!-- 
  props 属性说明：
    current: 默认值 1, 类型 Number, 当前展示的页码
    total: 默认值 0, 类型 Number, 要展示的数据的总量
    pageSize: 默认值 10, 类型 Number, 每页展示的数据量
    sizer: 默认值 [10, 20, 30, 40], 类型 Array, 每页展示数据量的可选项
    showTotal: 默认值 false, 类型 Boolean, 是否显示数据总量
    showSizer: 默认值 false, 类型 Boolean, 是否显示每页数据量的可选项
    showJumper: 默认值 false, 类型 Boolean, 是否显示输入跳页框
    selectionWidth: 默认值 '60px', 类型 String, 每页数据量的可选项宽度
-->

<template>
  <div class="segi-page">
    <div class="segi-page-total" v-if="showTotal">
      <slot>第 {{ beginNum }} 到 {{ endNum }} 条记录，共 {{ total }} 条</slot>
    </div>
    <div class="segi-page-right">
      <div class="segi-page-sizer" v-if="showSizer" v-clickoutside="hide">
        <span>每页显示&nbsp;</span>
        <div :class="selectionClass" @click="toggle" :style="{width: selectionWidth}">
          {{ currentPageSize }}
          <span class="caret input-icon" :class="{'segi-page-selection-show': showSelection}"></span>
        </div>
        <span>&nbsp;条</span>
        <transition name="slide">
          <ul class="segi-page-drop" v-show="showSelection">
            <li
              class="segi-page-option"
              :class="{'segi-page-option-active': currentPageSize === item}"
              :style="{width: selectionWidth}"
              v-for="(item, index) in sizer"
              :key="index"
              @click="changeSize(item)"
            >{{ item }}</li>
          </ul>
        </transition>
      </div>
      <ul class="segi-page-list">
        <li
          title="上一页"
          :class="prevClass"
          @click="prev"
        ><i class="glyphicon glyphicon-menu-left"></i></li>
        <li
          :title="1"
          class="segi-page-item"
          :class="{ 'segi-page-active': currentPage === 1 }"
          v-if="allPages > 0"
          @click="changePage(1)"
        >1</li>
        <li
          title="后退5页"
          class="segi-page-item segi-page-jump-prev"
          v-if="showPrevJump"
          @click="jumpPrev"
        >
          <span class="segi-page-dots glyphicon glyphicon-option-horizontal"></span>
          <span class="segi-page-d-arrow">
            <i class="glyphicon glyphicon-menu-left"></i>
            <i class="glyphicon glyphicon-menu-left" style="margin-left: -10px"></i>
          </span>
        </li>
        <li
          v-for="(page, index) in pageArr"
          :key="index"
          :title="page"
          class="segi-page-item"
          :class="{ 'segi-page-active': currentPage === page }"
          @click="changePage(page)"
        >{{ page }}</li>
        <li
          title="前进5页"
          class="segi-page-item segi-page-jump-next"
          v-if="showNextJump"
          @click="jumpNext"
        >
          <span class="segi-page-dots glyphicon glyphicon-option-horizontal"></span>
          <span class="segi-page-d-arrow">
            <i class="glyphicon glyphicon-menu-right"></i>
            <i class="glyphicon glyphicon-menu-right" style="margin-left: -10px"></i>
          </span>
        </li>
        <li
          :title="allPages"
          class="segi-page-item"
          :class="{ 'segi-page-active': currentPage === allPages }"
          v-if="allPages > 1"
          @click="changePage(allPages)"
        >{{ allPages }}</li>
        <li
          title="下一页"
          :class="nextClass"
          @click="next"
        ><i class="glyphicon glyphicon-menu-right"></i></li>
      </ul>
      <div v-if="showJumper" class="segi-page-jumper">
        前往
        <input type="text" v-model="jumpPage" @keyup.enter="changePage(jumpPage)">
        页
      </div>
    </div>
  </div>
</template>

<script>
import clickoutside from '../utils/directive/clickoutside'

export default {
  name: 'page',
  directives: {
    clickoutside
  },
  props: {
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    sizer: {
      type: Array,
      default () {
        return [10, 15, 20, 25, 30, 50, 100]
      }
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    showSizer: {
      type: Boolean,
      default: false
    },
    showJumper: {
      type: Boolean,
      default: false
    },
    selectionWidth: {
      type: String,
      default: '60px'
    }
  },
  data () {
    return {
      jumpPage: 1,
      currentPage: this.current,
      currentPageSize: this.pageSize,
      showPrevJump: false,
      showNextJump: false,
      showSelection: false
    }
  },
  computed: {
    allPages () {
      const allPage = Math.ceil(this.total / this.currentPageSize)
      // return (allPage === 0) ? 1 : allPage
      return allPage
    },
    beginNum () {
      if (!Number(this.total)) { return 0 }
      return (this.currentPage - 1) * this.currentPageSize + 1
    },
    endNum () {
      if (this.currentPage === this.allPages || this.allPages === 0) {
        return this.total
      } else {
        return this.currentPage * this.currentPageSize
      }
    },
    pageArr () {
      const count = 7
      let showPrevJump = false
      let showNextJump = false
      let array = []

      if (this.allPages > count + 2) {
        if (this.currentPage > count - 3) {
          showPrevJump = true
        }

        if (this.currentPage < this.allPages - 3) {
          showNextJump = true
        }
      }
      if (showPrevJump && !showNextJump) {
        const startPage = this.allPages - (count - 1)

        for (let i = startPage; i < this.allPages; i++) {
          array.push(i)
        }
      } else if (!showPrevJump && showNextJump) {

        for (let i = 2; i < count + 1; i++) {
          array.push(i)
        }
      } else if (showPrevJump && showNextJump) {
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          array.push(i)
        }
      } else {
        for (let i = 2; i < this.allPages; i++) {
          array.push(i)
        }
      }
      this.showPrevJump = showPrevJump
      this.showNextJump = showNextJump
      return array
    },
    selectionClass () {
      return [
        'segi-page-selection',
        { 'segi-page-selection-border': this.showSelection }
      ]
    },
    prevClass () {
      return [
        'segi-page-item',
        'segi-page-prev',
        { 'segi-page-disabled': this.currentPage === 1 }
      ]
    },
    nextClass () {
      return [
        'segi-page-item',
        'segi-page-next',
        { 'segi-page-disabled': this.currentPage === this.allPages || this.allPages === 0 }
      ]
    }
  },
  methods: {
    setCurrentPageSize () {
      if (this.sizer[0] !== 10 && this.pageSize === 10) {
        this.currentPageSize = this.sizer[0]
      } else {
        this.currentPageSize = this.pageSize
      }
    },
    // setWidth () {
    //   let width = this.$refs.drop.clientWidth
    //   this.selectionWidth = `${width}px`
    //   this.showSelection = false
    // },
    toggle () {
      this.showSelection = !this.showSelection
    },
    hide () {
      this.showSelection = false
    },
    changePage (page) {
      page = Number(page)
      
      if (page > this.allPages) {
        this.currentPage = this.allPages
        this.$emit('changePage', this.allPages)
        return
      } else if (page < 1) {
        this.currentPage = 1
        this.$emit('changePage', 1)
        return
      } else if (this.currentPage !== page) {
        this.currentPage = page
        this.$emit('changePage', page)
      }
    },
    changeSize (val) {
      if (this.currentPageSize !== val) {
        this.currentPageSize = val

        // 更改 size 后，查询第一页数据
        this.currentPage = 1

        if (this.currentPage > this.allPages) {
          // this.currentPage = this.allPages
          this.$emit('changeSize', val)
          this.$emit('changePage', this.allPages, val)
        } else {
          this.$emit('changeSize', val)
        }
      }
      this.showSelection = false
    },
    prev () {
      const current = this.currentPage

      if (current <= 1) {
        return false
      }
      this.changePage(current - 1)
    },
    next () {
      const current = this.currentPage

      if (current >= this.allPages) {
        return false
      }
      this.changePage(current + 1)
    },
    jumpPrev () {
      const page = this.currentPage - 5

      if (page > 0) {
        this.changePage(page)
      } else {
        this.changePage(1)
      }
    },
    jumpNext () {
      const page = this.currentPage + 5
      
      if (page > this.allPages) {
        this.changePage(this.allPages)
      } else {
        this.changePage(page)
      }
    }
  },
  watch: {
    current (val) {
      this.currentPage = val
    }
  },
  mounted () {
    this.setCurrentPageSize()
    // this.setWidth()
  }
}
</script>

<style scoped lang="less">
@import '../assets/less/variables.less';

.segi-page {
  min-width: 850px;
  font-size: 14px;
  color: @light-black;
  padding: 0 20px;
  user-select: none;
  &:after {
    content: '';
    display: block;
    clear: both;
  }
  &-list {
    display: inline-block;
    letter-spacing: -5px;
    padding-left: 0;
    margin-bottom: 0;
  }
  &-item {
    display: inline-block;
    letter-spacing: 0;
    vertical-align: middle;
    min-width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    list-style: none;
    background-color: @white;
    cursor: pointer;
    font-family: Arial;
    border: 1px solid @extra-light-silver;
    border-right: 0;
    // transition: color .2s ease-in-out;
    &:hover {
      color: @primary-blue;
    }
  }
  &-active {
    color: @white;
    background-color: @primary-blue;
    border-color: @primary-blue;
    & + .segi-page-item {
      border-left-color: @primary-blue;
    }
    &:hover{
      color: @white;
    }
  }
  &-prev,
  &-next {
    background-color: @white;
    color: @silver;
    &:hover {
      color: @primary-blue;
    }
  }
  &-prev {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &-next {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-right: 1px solid @extra-light-silver;
  }
  &-jump-prev,
  &-jump-next{
    transition: color 0s;
    // &::after {
    //   content: "•••";
    //   width: 100%;
    //   letter-spacing: 1px;
    //   display: block;
    //   position: absolute;
    //   top: 0;
    // }
    .segi-page-d-arrow {
      display: none;
    }
    .segi-page-dots {
      display: inline-block;
    }
    &:hover .segi-page-dots {
      display: none;
    }
    &:hover .segi-page-d-arrow {
      display: block;
    }
  }
  &-disabled {
    cursor: not-allowed;
    color: @extra-light-silver;
    &:hover {
      color: @extra-light-silver;
      cursor: not-allowed;
    }
  }
  &-total {
    float: left;
    // display: inline-block;
    vertical-align: middle;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
  }
  &-right {
    float: right;
  }
  &-sizer {
    display: inline-block;
    vertical-align: middle;
    margin-right: 15px;
    position: relative;
  }
  &-selection {
    display: inline-block;
    text-align: left;
    background-color: @white;
    border-radius: 4px;
    border: 1px solid @input-border-color;
    padding: 3px 0 3px 8px;
    position: relative;
    outline: 0;
    box-sizing: border-box;
    user-select: none;
    cursor: pointer;
    transition: all .2s ease-in-out;
    &:hover {
      border-color: @input-focus-border-color;
    }
    &-border {
      border-color: @input-focus-border-color;
    }
    span {
      display: block;
      position: absolute;
      top: 12px;
      right: 7px;
      transition: all .2s ease-in-out;
    }
    &-show {
      transform-origin: center 2px;
      transform: rotate(180deg);
    }
  }
  &-drop {
    margin: 5px 0;
    padding: 5px 0;
    background-color: @white;
    box-sizing: border-box;
    border: 1px solid @extra-light-silver;
    border-radius: 4px;
    box-shadow: @drop-shadow;
    position: absolute;
    left: 64px;
    bottom: 30px;
  }
  &-option {
    text-align: left;
    padding: 3px 0 3px 8px;
    list-style: none;
    cursor: pointer;
    transition: all .2s ease-in-out;
    &:hover {
      background: @drop-options-hover-bg;
    }
    &-active {
      color: @white;
      background: @drop-options-active-bg;
      &:hover {
        background: @drop-options-active-bg;
      }
    }
  }
  &-jumper {
    display: inline-block;
    vertical-align: middle;
    font-size: 13px;
    height: 28px;
    line-height: 28px;
    margin-left: 10px;
    input {
      width: 28px;
      height: 28px;
      text-align: center;
      border: 1px solid @input-border-color;
      border-radius: 4px;
      margin: 0 6px;
      padding: 0 4px;
      box-sizing: border-box;
    }
  }
}

.slide-enter-active {
  animation: slideIn .2s ease-in-out;
}
.slide-leave-active {
  animation:  slideOut .2s ease-in-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform-origin: bottom;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform-origin: bottom;
    transform: scaleY(1);
  }
}
@keyframes slideOut {
  from {
    opacity: 1;
    transform-origin: bottom;
    transform: scaleY(1);
  }
  to {
    opacity: 0;
    transform-origin: bottom;
    transform: scaleY(0);
  }
}
</style>

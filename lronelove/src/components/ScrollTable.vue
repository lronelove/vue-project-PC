<!-- 示例：
<scroll-table :heads="scrollTable.heads" :loading="scrollTable.loading" :noData="!scrollTable.contents.length">
  <div slot="contents" class="tb-content-line clearfix" v-for="(item,index) in scrollTable.contents" :key="index">
    <span class="tb-content-item" :style="{width: scrollTable.widthList[0]}">
      <button class="btn btn-text btn-primary">item.name</button>
    </span>
    <span class="tb-content-item" :style="{width: scrollTable.widthList[1]}">item.sk</span>
    <span class="tb-content-item" :style="{width: scrollTable.widthList[2]}">item.sk</span>
    <span class="tb-content-item" :style="{width: scrollTable.widthList[3]}">item.sk</span>
  </div>
</scroll-table>
data () {
  return {
    scrollTable: {
      loading: false,
      heads: [{name: '列一', width: '30%'}, {name: '列一', width: '30%'}, {name: '列一', width: '20%'}, {name: '列一', width: '20%'}],
      widthList: ['30%', '30%', '20%', '20%'],
      contents: [{name: 'templeteName', sk: 'jskdjfkd'}, {name: 'templeteName', sk: 'jskdjfkd'}, {name: 'templeteName', sk: 'jskdjfkd'}, {name: 'templeteName', sk: 'jskdjfkd'}, {name: 'templeteName', sk: 'jskdjfkd'}, {name: 'templeteName', sk: 'jskdjfkd'}]
    }
  }
}
 -->
<template>
  <div class="tb">

    <!-- 标题部分 -->
    <slot name="title"></slot>

    <!-- 表格部分 -->
    <div class="tb-body">
      <div class="head-container">
        <div class="tb-body-head" :style="{minWidth: minWidth, left: headLeft}">
          <span class="tb-content-item" v-for="(head,hIndex) in heads" :key="hIndex" :style="{width:head.width}">{{head.name}}</span>
        </div>
      </div>
      <div class="tb-content scrollbar" :style="{height: height, maxHeight: maxHeight}" ref="content" @scroll="getHeadLeft()">
       
        <!-- 内容 -->
        <div v-show="!loading" :style="{minWidth: minWidth}">
          <slot name="contents"></slot>
        </div>
        <div v-show="noData && !loading" class="tb-content-nodata">没有任何记录</div>
        <loading :loading="loading" style="margin:20px 0;width:100%;overflow: hidden;"/>
      </div>
    </div>
    
    <!-- 底部，如分页 -->
    <slot name="footer"></slot>
  </div>
</template>

<script type="text/javascript">
import Loading from 'components/LoadingIcon'

export default {
  name: 'scroll-table',
  components: {
    Loading
  },
  props: {
    /* 是否展示加载动画 */
    loading: {
      type: Boolean,
      default: false
    },
    
    /* 是否没有数据，如果是，则展示“没有任何记录” */
    noData: {
      type: Boolean,
      default: true
    },
    
    /* 对象数组，name,width */
    heads: {
      type: Array,
      default () {
        return []
      }
    },
    
    /* 表格内容部分的宽、高 */
    height: {
      type: String,
      default: 'auto'
    },
    maxHeight: {
      type: String,
      default: '148px'
    },
    minWidth: {
      type: String
    }
  },
  data () {
    return {
      headLeft: '0'
    }
  },
  methods: {
    getHeadLeft () {
      if (this.minWidth) {
        this.headLeft = -this.$refs.content.scrollLeft + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/less/variables.less';

.head-container{
  overflow: hidden;
  position: relative;
  background: @extra-light-gray;
  .tb-body-head{
    position: relative;
  }
}

.tb{
  border: 1px solid @line;
  border-radius: @radius;
  box-shadow: @drop-shadow;
  margin-bottom: 20px;
  position: relative;
  text-align: left;
  // 头部
  .tb-header{
    height: 50px;
    border-bottom: 1px solid @line;
    padding: 0 20px;
    position: relative;
    .tb-title {
      font-size: 18px;
      color: @black;
      line-height: 50px;
    }
    .tb-header-right{
      display: inline-block;
      line-height: 50px;
      height: 50px;
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  // 没有任何记录
  .tb-content-nodata{
    padding: 20px;
    text-align: center;
  }
  // 内容
  .tb-body{
    .tb-content{
      overflow: auto;
      height: auto;
    }
    .tb-content-line{
      min-height: 37px;
      border-bottom: 1px solid @line;
      &:nth-child(even){
        background: @table-stripe;
      }
      &:hover {
        background: @light-gray;
      }
    }
    .tb-body-head{
      height: 37px;
      border-bottom: 1px solid @line;
      color: @black;
      .tb-content-item{
        font-weight: 700;
        background: @extra-light-gray;
      }
    }
    .tb-content-item{
      font-size: 14px;
      padding: 8px 10px;
      &:first-child{
        padding-left: 20px;
      }
      &:last-child{
        padding-right: 20px;
      }
      display: block;
      float: left;
      line-height: 20px;
      min-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      word-wrap:break-word;
      word-break: break-all;
      text-overflow: ellipsis;
      &:hover{
        text-overflow: inherit;
        white-space: normal;
        overflow: visible;
      }
      .btn{
        float: left;
      }
      &:after{
        content:".";display:table;clear:both;
      }
      &:before, &:after{
        content: " ";
        display: table;
      }
    }
  }
}
</style>

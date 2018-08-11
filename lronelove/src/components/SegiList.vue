<template>
  <div class="col-lg-3 col-md-4 col-sm-6">
    <div class="mini-widget">
      <div class="mini-widget-heading clearfix">
        <div class="pull-middle"><span>{{ title }}</span></div>
        <!--<a class="pull-right">{{linkTitle}}</a>-->
      </div>
      <div class="mini-widget-body">
        <div class="item clearfix" v-for="(item, index) in list">
          <div class="pull-left">
            <i :class="item.icon"></i><em>{{item.name}}</em>
          </div>
          <span class="pull-right cycleType">{{item.content}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      default: '注册'
    },
    linkTitle: {
      type: String,
      default: '编辑'
    },
    list: {
      type: Array,
      default: () => {
        return [
          {icon: 'glyphicon glyphicon-time', name: '最大频次', content: '1'}, {icon: 'glyphicon glyphicon-piggy-bank', name: '寻常币', content: '50'}, {icon: 'glyphicon glyphicon-star', name: '成长值', content: '20'}, {icon: 'glyphicon glyphicon-adjust', name: '周期', content: '永久'}, {icon: 'glyphicon glyphicon-stats', name: '状态', content: '生效'}
        ]
      }
    }
  },
  computed: {
  }
}
</script>
<style scoped>
.mini-widget {
    margin: 0 0 25px 0;
    display: block;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    /* color: #fff; */
    color:#333;
}
.mini-widget .mini-widget-heading {
    padding: 7px 15px;
    -webkit-border-radius: 2px 2px 0 0;
    -moz-border-radius: 2px 2px 0 0;
    border-radius: 2px 2px 0 0;
    text-transform: uppercase;
    text-align: center;
    border: 1px solid #ccc;
    border-bottom: none;
    background:#fafafa;
    /* background: #3693cf; */
    /* background: #666; */
}
.mini-widget .mini-widget-heading a.pull-right {
    opacity: 0.7;
    -webkit-transition: All 0.5s ease-in;
    -moz-transition: All 0.5s ease-in;
    -ms-transition: All 0.5s ease-in;
    -o-transition: All 0.5s ease-in;
    transition: All 0.5s ease-in;
    cursor:pointer;
    color:#333;
}
.mini-widget .mini-widget-body {
    padding: 10px 15px;
    font-weight: 300;
    /* background: #2877aa; */
    color: #333;
    border: 1px solid #ccc;
}
.mini-widget .mini-widget-body .pull-right{
    font-weight: normal;
}
.pull-middle {
  text-align: center;
}
.pull-middle span {
  font-size: large;
}
.mini-widget .mini-widget-body span,.mini-widget .mini-widget-body em {
    line-height:30px;
    vertical-align:middle;
}
.mini-widget .mini-widget-body i{
    line-height:30px;
    vertical-align:middle;
    color:#666;
}
.mini-widget .mini-widget-body em{
    font-size:80%;
    margin-left:8px;
}
</style>

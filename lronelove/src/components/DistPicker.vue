<template>
  <div class="vue-dist-picker clearfix" :style="{height:inputHeight, width:getWidth()}" v-clickoutside="endChoice" >
    <!--外嵌格式 input-->
    <div v-if="outside" class="hit clearfix">
      <label class="outsideLabel" v-if="label" :style="{height: inputHeight ,lineHeight: inputHeight, width: labelWidth}"><span v-show="required">*</span>{{ label }}</label>
      <div class="hit-right"  @click="toggle">
        <input type="text" class="form-control" v-model="showText" :placeholder="holder" :name="inputName" :id="inputId" :style="{borderRadius: radius, width: inputWidth, height: inputHeight}" readonly>
        <button type="button" class="btn btn-default dropdown-toggle" :style="{borderRadius: radius, height: inputHeight, width: buttonWidth, marginLeft: -buttonWidth}">
          <span class="glyphicon glyphicon-map-marker"></span>
        </button>
      </div>
    </div>
    <!--内嵌格式 input-->
    <div v-else class="clearfix">
      <label class="input segi_formInput" @click="toggle" :style="{height:inputHeight}">
        <input @keyup.esc.prevent="endChoice" type="text" class="form-control" v-model="showText"  :placeholder="holder" :name="inputName" :id="inputId" :style="{width: inputWidth, height: inputHeight, borderRadius: radius, paddingLeft: labelWidth}" readonly>
        <span class="labelBox" :style="{height: inputHeight, lineHeight: inputHeight, width: labelWidth}">
          <span class="labelText"><i :class="labelIcon"></i>{{label}}<span v-show="required" style="color:red">*</span></span>
        </span>
        <button type="button" class="btn btn-default dropdown-toggle" :style="{borderRadius: radius, height: inputHeight, width: buttonWidth, marginLeft: -buttonWidth}">
          <span :class="caret"></span>
        </button>
      </label>
    </div>

    <!--<input type="text" autocomplete="off" disableautocomplete :name="field" :id="field" :placeholder="placeholder" :value="showName" v-model="showName"
           @focus="toggle" @keypress="toggle" @blur="endChoice" ref:input>-->
    <!--选择面板-->
    <div class="drop" v-show="showPanel" :style="{marginLeft: getMargin()}">
      <div class="vdp-panel" :style="{width: inputWidth}">
        <h5>选择地址</h5>
        <ul class="vdp-tags">
          <li :class="{'z-on': activatedTag===1}" @click="activeTag(1)">{{ currProv.name }}</li>
          <li :class="{'z-on': activatedTag===2}" @click="activeTag(2)" v-show="provId">{{ currCity.name }}</li>
          <li :class="{'z-on': activatedTag===3}" @click="activeTag(3)" v-show="cityId">{{ currDist.name }}</li>
          <li :class="{'z-on': activatedTag===4}" @click="activeTag(4)" v-show="distId">{{ currCommunity.name }}</li>
        </ul>
        <div style="width: 100%;height: 2px;background: #20A0FF;"></div>
        <div class="vdp-list">
          <ul v-show="activatedTag===1">
            <li v-for="item in provList" @click="choiceProv(item.regionId)" :title="item.name">{{ item.name }}</li>
            <div v-show="provList instanceof Array && !provList.length" class="tip">{{tip1}}</div>
          </ul>
          <ul v-show="activatedTag===2">
            <li v-for="item in cityList" @click="choiceCity(item.regionId)" :title="item.name">{{ item.name }}</li>
            <div v-show="cityList instanceof Array && !cityList.length" class="tip">{{tip2}}</div>
          </ul>
          <ul v-show="activatedTag===3">
            <li v-for="item in distList" @click="choiceDist(item.regionId)" :title="item.name">{{ item.name }}</li>
            <div v-show="distList instanceof Array && !distList.length" class="tip">{{tip3}}</div>
          </ul>
          <ul v-show="activatedTag===4">
            <li v-for="item in communityList" @click="choiceCommunity(item.communityId)" :title="item.name">{{ item.name }}</li>
            <div v-show="communityList instanceof Array && !communityList.length" class="tip">{{tip4}}</div>
          </ul>
          <div class="loading" v-show="loading">
            <ul class="loading-animation">
              <li v-for="i in 5"></li>
            </ul>
          </div>
        </div>
        <!--<a class="btn btn-default" @click="console">query</a>-->
      </div>
    </div>
  </div>

</template>

<script>
// import DIST_PICKER_LIST from '../data/china-dist-data.json'
import clickoutside from '../utils/directive/clickoutside'
import * as api from '../api'
import { SHOW_TOAST } from '../store/types'
/* const collection = {
    // 通过id获取集合条目，取得条目
  get (arr, id, field = 'id') {
    let res = null
    if (typeof arr === 'object' && typeof arr.length !== 'undefined' && arr.length > 0) {
      arr.forEach((item) => {
        if (item[field] === id) {
          res = item
        }
      })
    }
    return res
  }
} */
const collection = {
  get (arr, id, field = 'regionId') {
    let res = {field: '', name: '请选择'}
    if (arr instanceof Array && arr.length) {
      let len = arr.length
      for (let i = 0; i < len; i++) {
        if (arr[i][field] === id) {
          res = arr[i]
        }
      }
    }
    return res
  }
}
export default {
  directives: {
    clickoutside
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    // input的props
    /* 是否外嵌样式 */
    outside: {
      type: Boolean,
      default: true
    },
    /* 布尔类型，是否必填项，若为true则在label左上角显示一个红色* */
    required: {
      type: Boolean,
      default: false
    },
    /* 字符串类型，输入框前的标签文本 */
    label: {
      type: String,
      default: ''
    },
    /* 字符串类型，输入框里面的placeholder. */
    holder: {
      type: String,
      default: '请选择小区'
    },
    /* 输入框 name属性 */
    inputName: {
      type: String,
      default: ''
    },
    /* 输入框 id */
    inputId: {
      type: String,
      default: ''
    },
    /* 各部分的圆角 */
    radius: {
      type: String,
      default: '5px'
    },
    /* label宽度 和 输入框的margin-left，不能为auto */
    labelWidth: {
      type: String,
      default: '109px'
    },
    /* 输入框宽度:160px-xx，注意：下拉菜单min-width:160px */
    inputWidth: {
      type: String,
      default: '381px'
    },
    /* 输入框高度:30px-50px，注意：对于整个datePicker，max-height:50px */
    inputHeight: {
      type: String,
      default: '43px'
    },
    /* 按键宽度 */
    buttonWidth: {
      type: String,
      default: '43px'
    },
    /* 内嵌格式的icon */
    labelIcon: {
      type: String,
      default: 'glyphicon glyphicon-th-list'
    }
  },
  data () {
    return {
      showPanel: false,
      isMouseOver: false,
      activatedTag: 1, // 1省 2市 3区 4小区
      showName: '',
      provList: [],
      cityList: [],
      distList: [],
      communityList: [],
      provId: '',
      cityId: '',
      distId: '',
      communityId: '',
      provCode: '',
      cityCode: '',
      distCode: '',
      tip1: '',
      tip2: '',
      tip3: '',
      tip4: '',
      loading: false
    }
  },
  computed: {
    /* getTitle () {
      switch (this.activatedTag) {
        case 1:
          return '选择省'
        case 2:
          return '选择市'
        case 3:
          return '选择区'
        case 4:
          return '选择小区'
        default:
          return '选择地址'
      }
    }, */
    /* cityList () {
      let {
        provId
      } = this
      if (provId && typeof DIST_PICKER_LIST[provId] !== 'undefined') {
        return DIST_PICKER_LIST[provId]
      } else {
        return []
      }
    },
    distList () {
      let {
        cityId
      } = this
      if (cityId && typeof DIST_PICKER_LIST[cityId] !== 'undefined') {
        return DIST_PICKER_LIST[cityId]
      } else {
        return []
      }
    },
    communityList () {
      let {
        communityId
      } = this
      if (communityId && typeof DIST_PICKER_LIST[communityId] !== 'undefined') {
        return DIST_PICKER_LIST[communityId]
      } else {
        return []
      }
    }, */
    currProv () {
      let {
        provList,
        provId
      } = this
      if (provId) {
        return collection.get(provList, provId)
      } else {
        return {
          regionId: '',
          name: '请选择'
        }
      }
    },
    currCity () {
      let {
        cityList,
        cityId
      } = this
      if (cityList.length > 0 && cityId) {
        return collection.get(cityList, cityId)
      } else {
        return {
          regionId: '',
          name: '请选择'
        }
      }
    },
    currDist () {
      let {
        distList,
        distId
      } = this
      if (distList.length > 0 && distId) {
        return collection.get(distList, distId)
      } else {
        return {
          regionId: '',
          name: '请选择'
        }
      }
    },
    currCommunity () {
      let {
        communityList,
        communityId
      } = this
      if (communityList.length > 0 && communityId) {
        return collection.get(communityList, communityId, 'communityId')
      } else {
        return {
          communityId: '',
          name: '请选择'
        }
      }
    },
    showText () {
      let {
        currProv,
        currCity,
        currDist,
        currCommunity,
        value
      } = this
      if (currProv.regionId && currCity.regionId && currDist.regionId && currCommunity.communityId && value) {
        return currProv.name + '-' + currCity.name + '-' + currDist.name + '-' + currCommunity.name
      } else {
        return ''
      }
     // return this.currProv.name + '-' + this.currCity.name + '-' + this.currDist.name + '-' + this.currCommunity.name
    }
  },
  methods: {
    /* 不同情况的下拉菜单margin-left */
    getMargin () {
      if (this.outside) {
        return this.label === '' ? 0 : this.labelWidth
      } else {
        return 0
      }
    },
    /* 不同情况的整体宽度 */
    getWidth () {
      if (this.outside) {
        return this.label === '' ? this.inputWidth : this.inputWidth + this.labelWidth
      } else {
        return this.inputWidth
      }
    },
    activeTag (k) {
      this.activatedTag = k
    },
    choiceProv (id) {
      this.provId = id
      this.cityId = ''
      this.distId = ''
      this.communityId = ''
      this.$emit('input', this.communityId)
      this.queryCity(id)
      this.activeTag(2)
    },
    choiceCity (id) {
      this.cityId = id
      this.distId = ''
      this.communityId = ''
      this.$emit('input', this.communityId)
      this.queryDist(id)
      this.activeTag(3)
    },
    choiceDist (id) {
      this.distId = id
      this.communityId = ''
      this.$emit('input', this.communityId)
      this.queryCommunity(id)
      this.activeTag(4)
    },
    choiceCommunity (id) {
      this.communityId = id
      this.$emit('input', this.communityId)
      console.log(this.currCommunity)
    },
    // 打开/关闭面板
    toggle (e) {
      this.showPanel = !this.showPanel
      // 如果打开面板，且provList是[]，则查询省份列表
      if (this.showPanel && !this.provList.length) {
        this.queryProv()
      }
    },
    // 关闭省市区面板
    endChoice (e) {
      this.showPanel = false
    },
    startMouseOver () {
      this.isMouseOver = true
      console.log('mouseOver' + this.showPanel)
    },
    queryProv () {
      this.loading = true
      api.queryProv().then(res => {
        this.loading = false
        if (Number(res.data.code) === 0) {
          if (res.data.data.list && (res.data.data.list !== 'undefined')) {
            this.provList = res.data.data.list
            if (res.data.data.list instanceof Array && !res.data.data.list.length) {
              this.tip1 = '没有可选项'
            } else if (res.data.data.list instanceof Array && res.data.data.list.length) {
              this.tip1 = ''
            }
          } else {
            console.log('省份列表')
            console.log(res.data.data.list)
          }
        } else {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到省份信息')
        }
      }, res => {
        this.loading = false
        this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到省份信息')
      })
    },
    queryCity (id) {
      this.cityList = []
      this.loading = true
      api.queryCity(id).then(res => {
        this.loading = false
        if (Number(res.data.code) === 0) {
          if (res.data.data.list && (res.data.data.list !== undefined)) {
            this.cityList = res.data.data.list
            if (res.data.data.list instanceof Array && !res.data.data.list.length) {
              this.tip2 = '没有可选项'
            } else if (res.data.data.list instanceof Array && res.data.data.list.length) {
              this.tip2 = ''
            }
          } else {
            console.log('城市列表')
            console.log(res.data.data.list)
          }
        } else {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到城市信息')
        }
      }, res => {
        this.loading = false
        this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到城市信息')
      })
    },
    queryDist (id) {
      this.distList = []
      this.loading = true
      api.queryDist(id).then(res => {
        this.loading = false
        if (Number(res.data.code) === 0) {
          if (res.data.data.list && (res.data.data.list !== undefined)) {
            this.distList = res.data.data.list
            if (res.data.data.list instanceof Array && !res.data.data.list.length) {
              this.tip3 = '没有可选项'
            } else if (res.data.data.list instanceof Array && res.data.data.list.length) {
              this.tip3 = ''
            }
          } else {
            console.log('区域列表')
            console.log(res.data.data.list)
          }
        } else {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到区域信息')
        }
      }, res => {
        this.loading = false
        this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到区域信息')
      })
    },
    queryCommunity (id) {
      this.communityList = []
      this.loading = true
      api.queryCommunity(id).then(res => {
        this.loading = false
        if (Number(res.data.code) === 0) {
          if (res.data.data.list && (res.data.data.list !== undefined)) {
            this.communityList = res.data.data.list
            if (res.data.data.list instanceof Array && !res.data.data.list.length) {
              this.tip4 = '没有可选项'
            } else if (res.data.data.list instanceof Array && res.data.data.list.length) {
              this.tip4 = ''
            }
          } else {
            console.log('小区列表')
            console.log(res.data.data.list)
          }
        } else {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到小区信息')
        }
      }, res => {
        this.loading = false
        this.$store.dispatch(SHOW_TOAST, '系统出小差了，查不到小区信息')
      })
    },
    console () {
      console.log('小区列表')
      console.log(this.communityList)
    }
  },
  mounted () {
    this.queryProv()
  },
  watch: {
    'value' (val) {
      if (!val) {
        /* if (this.activatedTag === 4) {
          this.provId = ''
          this.cityId = ''
          this.distId = ''
          this.communityId = ''
          this.activatedTag = 1
        } */
      }
    }
  }
}
</script>

<style scoped>
.tip{
  line-height:100px;
  color:#777;
}
@keyframes vueDistPicker {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    opacity: 1;
    transform: translate(0) scale(1);
  }
}
a{
   text-decoration:none;
}
ul,li,h5,div{
  list-style-type:none;
  padding:0;
  margin:0;
}
.vue-dist-picker {
  position: relative;
  margin: 0;
  padding: 0;
  font: 12px/1.5 'Microsoft YaHei',tahoma,arial,'Hiragino Sans GB','\\5b8b\4f53',sans-serif;
  color: #666;
}
.vue-dist-picker * {
  box-sizing: border-box;
}
.vue-dist-picker .vdp-panel {
  padding: 0 10px 0;
  width: 381px;
  height: 300px;
  border: 1px solid #DDD;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.18);
  overflow-y: auto;
  background-color: #FFF;
  /* animation: vueDistPicker 0.1s ease-out;*/
}
.vue-dist-picker .vdp-panel::-webkit-scrollbar{
  /* display: none; */
  width: 8px;
  background-color: #F5F5F5;
}
/*定义滑块 内阴影+圆角*/
.vue-dist-picker .vdp-panel::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background-color: #aaa;
}
.vue-dist-picker .vdp-panel h5 {
  padding-left: 2px;
  color: #aaa;
  line-height: 40px;
  font-weight: normal;
  display:inline-block;
}
.vue-dist-picker .vdp-panel .vdp-tags {
  /*margin: 5px 0;
  border-bottom: 2px solid #20A0FF; /*#dd606a*/
}
.vue-dist-picker .vdp-panel .vdp-tags::after {
  content: '';
  display: block;
  clear: both;
}
.vue-dist-picker .vdp-panel .vdp-tags li {
  position: relative;
  display: block;
  float: left;
  margin-right: 5px;
  width:70px;
  font-size: 12px;
  line-height: 24px;
  height: 23px;
  text-align: center;
  border: 1px solid #ccc;
  border-bottom: none;
  cursor: pointer;
  /* font-weight: bold; */
  color:#555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius:5px 5px 0 0;
}
.vue-dist-picker .vdp-panel .vdp-tags li.z-on {
  color: #20A0FF; /* #d01 */
  border-color: #20A0FF;
  border-width: 2px;
  border-bottom: 2px solid #fff;
  bottom: -2px;
  font-weight: bold;
}
.vue-dist-picker .vdp-panel .vdp-list {
  overflow: hidden;
  border-bottom: 10px solid #fff;
}
.vue-dist-picker .vdp-panel .vdp-list ul {
  padding: 10px 12px 20px;
  line-height: 28px;
  overflow: hidden;
}
.vue-dist-picker .vdp-panel .vdp-list ul li {
  float: left;
  display: block;
  width: 20%;
  margin:0 2%;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vue-dist-picker .vdp-panel .vdp-list ul li:hover {
  color: #fff; /*#d01*/
  background-color: #20A0FF; /*#f2f2f3*/
}
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
.hide {
  display: none
}
.vue-dist-picker .vdp-panel .vdp-list .loading .loading-animation li {
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
  /*input*/
  .vue-dist-picker {
    font-size:14px;
  }
  .vue-dist-picker  .outsideLabel{
    float:left;
    font-weight: normal;
    text-align:left;
    margin:0;
  }
  .vue-dist-picker  {
    max-height: 50px;
    position: initial;
    display: inline-block;
  }
  .hit {
    width: 100%;
  }
  .hit-right {
    display: inline-block;
    font-size:0; /*避免inline-block的间隙问题*/
  }
  .hit-right input {
    min-width:160px;
    display: inline;
    cursor: pointer;
    font-size:14px; /*.hit-right font-size:0;*/
  }
  .hit-right button {
    position: initial;
    top: 0;
    right: 0;
    /* margin-left: -3px;*/
    /* 修改样式 */
    margin-left: -43px;
    /*margin-top: -10px;*/
    vertical-align: top;
  }
  .hit label span {
    color: red;
  }
  .drop {
    position:absolute;
    z-index:100;
  }
  .form-control[readonly] {
    background: white;
  }

  .segi_formInput {
    margin:0;
    position:relative;
  }
  .segi_formInput .labelBox{
    width: 85px;
    text-align: left;
    position:absolute;
    top:0;
    left:0;
    font-weight: normal;
  }
  .segi_formInput .labelText{
    padding:0 10px;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: #BDBDBD;
    z-index: 20 !important;
    font-size: 13px;
    color: #A2A2A2;
  }
  .segi_formInput button{
    position: absolute;
    right:0;
    top:0;
  }
  .segi_formInput i:before{
    margin-right: 3px!important;
    margin-top: 3px!important;
    box-sizing: content-box;
  }
  .segi_formInput input{
    padding-left: 95px;
    position: initial;
    display: block;
    font-weight: 400;
    width: 100%;
    z-index: 10;
    border-radius: 0;
    max-width: 600px;
  }
  .glyphicon{
    position: initial;
  }
  .hit-right input:focus{
    box-shadow: none;
    -webkit-box-shadow: none;
  }
  .hit-right input:focus + button{
    border-color:#66afe9;
  }
</style>

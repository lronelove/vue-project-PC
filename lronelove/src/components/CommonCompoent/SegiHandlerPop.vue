<template>
  <div>
    <div class="modal-add HandlerPop scrollbar" style="overflow: auto">
      <div class="unit">
        <radio label="处理人类型" labelWidth="93px" inputWidth="400px" holder1="选择处理人类型" :options="dealerTypeOptions" v-model="dealerType" @input="saveThis()" :disabled="disabled" />
      </div>
      <div class="unit" v-show="dealerType === 1">
        <!--<span style="display:inline-block;width:90px;">员工名称</span>-->
        <!--<input class="form-control form-input" @keyup.enter="queryUserList(modal.userName)" v-model="modal.userName" placeholder="请输入员工的姓名">-->
        <!--<a class="btn btn-primary" type="button" @click="queryUserList(modal.userName)">查询</a>-->
      </div>
      <div class="modal-select" v-show="dealerType === 1" style="width: 450px">
        <!--部门-->
        <div class="modal-department">
          <tree v-model="modal.organId" ref="treeOne" :isMultiple="false" :data="modal.tree" @onopen = "modalNodeOpen" @oncheck="modalCheck" :searchFrontEnd="false" @queryTree="queryTreeByKey" style="width:218px;"></tree>
        </div>
        <!--组员-->
        <div class="list-group modal-user">
          <!--<span v-if="!noSelect" class="list-group-item" v-for="(item,index) in modal.userList" style="font-size:0;">-->
            <!--<label class="checkbox-label" @click="saveThis()">-->
              <!--<input class="checkbox" type="checkbox" v-model="modal.selectUser" :value="item.value" style="margin:0;"/>-->
              <!--<span class="glyphicon"></span>-->
              <!--<span class="checkbox-text glyphicon glyphicon-user" style="color:#8492a6;margin-right:5px;"></span>-->
              <!--<span class="checkbox-text">{{item.name}}</span>-->
            <!--</label>-->
          <!--</span>-->
          <!--<span v-if="!noSelect" class="list-group-item" v-show="!modal.userList.length" style="line-height: 40px;padding: 0 10px;color: #aaa;">&nbsp;查不到员工</span>-->
          <!--<span v-if="noSelect" class="list-group-item" style="line-height: 40px;padding: 0 10px;color: #aaa;">&nbsp;不可选择员工</span>-->
          <div class="search-container">
            <input type="text" placeholder="快速查找" @input="(value) => { asyncQueryUserlist() }" v-model="midTab.userName" class="form-control search-input">
            <span class="glyphicon glyphicon-search search-btn"></span>
          </div>
          <div style="max-height: 244px;padding-bottom: 2px;overflow: auto; width: 218.5px;height: calc(244px - 0px);" class="scrollbar" >
            <tree v-show="midTab.midTree.children.length" ref="midTabMidTree" v-model="midTab.array" :searchShow="false" :isRelative="true" :isMultiple="true" :data="midTab.midTree" @oncheck="midTreeCheck" @onopen="midTreeNodeOpen"></tree>
          </div>
          <div v-if="modal.organId === ''" class="not-find">请先选择组织机构</div>
          <div v-if="midTab.midTree.isFolder === 'undefined' || !midTab.midTree.isFolder" class="not-find">查不到员工</div>
        </div>
      </div>
      <div class="handler" v-show="dealerType === 1" style="height: 300px;">
        <span style="line-height: 40px;padding: 0px 10px;">
          <span class="glyphicon glyphicon-user"></span>
          已选处理人
           <span v-if="midTab.checkUser.length > 0 && !disabled" class="btn btn-danger" style="margin-right: 5px;margin-top: 3px;float: right;" @click.stop="cleanComputedOptions">清空</span>
        </span>
        <span>
          <div v-if="handlerType === 'checkbox'" class="selectedHandler scrollbar" style="position:relative;max-height:255px;overflow: auto">
            <!-- <span class="handlerItem" v-for="(item, index) in computedOptions">
              {{item.name}}
              <i v-if="!disabled" class="glyphicon glyphicon-remove" @click.stop="delHandlerItem(index)"></i>
            </span> -->
            <span v-for="(item,index) in midTab.checkUser">
              <!--<span v-if="index===0 || item.department !== midTab.checkUser[index - 1].department" class="list-group-item" style="padding:10px 20px 5px 20px;" >-->
                <!--<img class="organicIcon" src="../../assets/image/organization/company.png" width="18px" style="opacity:1"/>-->
                <!--{{item.department}}-->
              <!--</span>-->
              <span class="list-group-item" style="padding:2px 5px;height: 30px" @mouseleave="showRemoveIco($event, 'none')" @mouseover="showRemoveIco($event, 'inline-block')" >
                <span class="checkbox-text glyphicon glyphicon-user" style="color:#8492a6;margin-right:5px;"></span>
                <span>
                  <p style="vertical-align: middle;margin:0;display:inline-block;max-width: 120px;overflow: hidden;text-overflow: ellipsis">
                    {{item.name}}
                  </p>
                  <a v-if="!disabled" class="remove-icon" @click.stop="delHandlerItem(index)" style="vertical-align: middle;display: none">
                    <i class="iconfont icon-remove-circle icon-red"></i>
                  </a>
                </span>
              </span>
            </span>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import Radio from 'components/SegiRadio'
  import CheckBox from 'components/CheckBox'
  import Modal from 'components/CommonCompoent/modal'
  import Tree from 'components/Tree'
  import * as api from '../../api'
  import { SHOW_TOAST } from 'store/types'
  import tabArr from '../../utils/tabArr'
  import Select2 from 'components/Select2'
  import _ from 'lodash'

  const modalAdapter = function (array) {
    let result = []
    array.forEach((item) => {
      result.push({
        name: item.organName,
        id: item.organId,
        organCode: item.organCode,
        children: modalAdapter(item.children),
        isOpen: item.children.length > 0,
        hide: false,
        disabled: item.orgTypeCode !== 'community'
      })
    })
    return result
  }
  export default {
    name: 'handler',
    components: {Radio, CheckBox, Modal, Tree, Select2},
    data () {
      return {
        noSelect: false,
        dealerType: 1,
        midTab: {
          array: [],
          checkUser: [], // 更新后:checkbox选中的员工，右边展示
          userMap: {}, // value: Name
          show: false,
          large: false,
          small: false,
          title: '',
          text: '',
          okText: '完成',
          cancelText: '取消',
          width: '700px',
          okClass: 'btn btn-success',
          // 增加组员
          midTree: {
            name: '公共节点',
            id: '',
            hide: false,
            isOpen: true,
            disabled: true,
            children: []
          },
          organId: '',
          userName: '', // 根据员工名查询
          item: {} // 用于删除组员
        },
        dealerTypeOptions: [
          {name: '用户', value: 1},
          {name: '提单人', value: 0},
          {name: '接单人', value: 4},
          {name: '上一步处理人', value: 5}
//          {name: '用户组', value: 2},
//          {name: '角色', value: 3}
        ],
        selectData: '',
        computedOptions: [],
        // 模态框
        modal: {
          show: false,
          large: false,
          small: false,
          title: '添加人员',
          text: '',
          okText: '完成',
          cancelText: '取消',
          width: '670px',
          okClass: 'btn btn-success',
          // 增加组员
          tree: {
            name: '公共节点',
            id: '',
            hide: false,
            isOpen: true,
            disabled: true,
            children: []
          },
          organId: '',
          userList: [],
          userMap: {}, // value: Name
          selectUser: [], // 选中某些员工
          userName: '' // 根据员工名查询
        }
      }
    },
    props: {
      // 是否只读
      disabled: {
        type: Boolean,
        default: false
      },
      // 标签长度
      labelWidth: {
        type: String,
        default: '90px'
      },
      // 标签内容
      label: {
        type: String,
        default: ''
      },
      inputWidth: {
        type: String,
        default: '340px'
      },
      inputHeight: {
        type: String,
        default: '43px'
      },
      // 类型：单选radio/多选checkbox
      handlerType: {
        type: String,
        default: 'radio'
      },
      // 值
      value: {
        type: [String, Number, Array, Object]
      },
      options: {
        type: Array
      },
      // organId
      organId: {
        type: [String, Number],
        default: ''
      },
      showFlag: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      showFlag (val) {
        var self = this
        var value = ''
        console.log(self.value)
        if (self.value === '[]') {
          value = JSON.stringify([{}])
        } else {
          value = JSON.parse(self.value)[0]
          console.log(value)
        }
        if (value !== undefined && value.type !== undefined) {
          self.dealerType = value.type
        } else {
          self.dealerType = 1
        }
        /* self.midTab.array是midTabn内的tree组建的model */
        /* midTab.checkUser是准备提交(emit)的res.datas */
        self.midTab.array.splice(0)
        self.midTab.checkUser.splice(0)
        if (value.datas && Array.isArray(value.datas) && (value.datas.length > 0)) {
          self.midTab.checkUser.push(...value.datas)
          value.datas.map(function (item, itemIndex) {
            self.midTab.array.push(item.id)
            self.midTab.userMap[item.id] = item.name
          })
        }

//        self.computedOptions = []
//        if (value.datas && Array.isArray(value.datas) && (value.datas.length > 0)) {
//          value.datas.map(function (item, itemIndex) {
//            self.computedOptions.push({
//              name: item.name,
//              value: item.id
//            })
//          })
//        }
        console.log('midTab', self.midTab)
        self.$nextTick(function () {
          self.initHeight = self.$el.offsetHeight
          self.$nextTick(function () {
            var diff = self.$el.offsetHeight - self.initHeight
            self.initHeight = self.$el.offsetHeight
            self.$emit('resizeCondition', {
              evtTarget: self.$el,
              heightDiff: diff,
              wider: true,
              attrCode: self.attrCode
            })
          })
        })
        console.log(value)
        /* 是否内部出现滚动条 */
        var elem = self.$el.getElementsByClassName('HandlerPop')[0]
        /* 52是popover标题栏的高度 */
        let maxHeight = (window.innerHeight - elem.getBoundingClientRect().top - 52)
        elem.style.maxHeight = ((maxHeight > 50) ? maxHeight : 50) + 'px'
      },
      value (val) {
//        var self = this
//        var value = ''
//        if (val === '[]') {
//          value = JSON.stringify([{}])
//        } else {
//          value = JSON.parse(val)[0]
//        }
//        if (value !== undefined && value.type !== undefined) {
//          self.dealerType = value.type
//        } else {
//          self.dealerType = 1
//        }
//        self.midTab.array.splice(0)
//        self.midTab.checkUser.splice(0)
//        if (value.datas && Array.isArray(value.datas) && (value.datas.length > 0)) {
//          self.midTab.checkUser.push(...value.datas)
//          value.datas.map(function (item, itemIndex) {
//            self.midTab.array.push(item.id)
//          })
//        }
//        console.log(value)
      }
//      computedOptions (val) {
//        var self = this
//        self.modal.selectUser = []
//        _.clone(val).forEach((item) => {
//          console.log('pushed' + item.value)
//          self.modal.selectUser.push(item.value)
//        })
//      }
    },
    methods: {
      showRemoveIco (evt, showType) {
        if (evt.target.getElementsByTagName('a')[0]) {
          evt.target.getElementsByTagName('a')[0].style.display = showType
        }
      },
      asyncQueryUserlist: _.debounce(function () {
        this.queryUserList('userName')
      }, 400),
      cleanComputedOptions () {
        this.midTab.checkUser.splice(0)
        this.midTab.array.splice(0)
//        this.computedOptions.splice(0)
//        this.modal.selectUser.splice(0)
        this.saveThis()
      },
      delHandlerItem (index) {
        var value = ''
        if (this.midTab.checkUser[index]) {
          value = this.midTab.checkUser[index].id
          this.midTab.checkUser.splice(index, 1)
        }
        if (value === '') {
          console.log('not found')
          return
        }
        var idx = this.midTab.array.indexOf(value)
        if (idx !== -1) {
          this.midTab.array.splice(idx, 1)
        }
//        var value = this.computedOptions[index].value
//        /* 已选处理人删除了，那么selectUser也要删除 */
//        var idx = this.modal.selectUser.indexOf(value)
//        if (idx !== -1) {
//          this.modal.selectUser.splice(idx, 1)
//        }
//        this.computedOptions.splice(index, 1)
        this.saveThis()
      },
      // 提交模态框内容，添加组员
      saveThis () {
        var self = this
        if (self.disabled) {
          return
        }
        if (self.dealerType !== 1) {
          console.log([{
            type: self.dealerType,
            datas: []
          }])
          self.$emit('input', JSON.stringify([{
            type: self.dealerType,
            datas: []
          }]))
          return
        }
        // let map = self.modal.userMap
        // // 添加，应该去重
        // self.modal.selectUser.forEach((item) => {
        //   if (tabArr.getTab(self.computedOptions, item, 'value') === -1) {
        //     if (map[item]) {
        //       self.computedOptions.push({name: map[item], value: item})
        //     }
        //   }
        // })
        // // 如果从selectUser中删除了，那么computedOptions也应删除
        // var commonList = []
        // self.modal.userList.map(function (user, userIndex) {
        //   self.computedOptions.map(function (opt, optIndex) {
        //     if (user.value === opt.value && user.name === opt.name) {
        //       commonList.push(_.clone(user))
        //     }
        //   })
        // })
        // var delList = []
        // commonList.map(function (com, comIndex) {
        //   var foundFlag = false
        //   self.modal.selectUser.forEach((usr) => {
        //     if (com.value === usr) {
        //       foundFlag = true
        //     }
        //   })
        //   if (!foundFlag) {
        //     delList.push(_.clone(com.value))
        //   }
        // })
        // var resList = []
        // self.computedOptions.forEach((item) => {
        //   if (delList.indexOf(item.value) === -1) {
        //     resList.push(_.clone(item))
        //   }
        // })
        // self.computedOptions = _.clone(resList)
        // console.log(self.computedOptions)
        let res = {
          type: self.dealerType,
          datas: []
        }
        res.datas.push(..._.clone(self.midTab.checkUser))
        // self.computedOptions.map(function (item, itemIndex) {
        //   res.datas.push({
        //     id: item.value,
        //     name: item.name
        //   })
        // })
        console.log(res)
        self.$emit('input', JSON.stringify([res]))
      },
      // 加载模态框中组织机构数据
      loadModalTree () {
        let self = this
        api.loadOrganTree().then(res => {
          console.log(res.data)
          if (res.data.code === '0') {
            let data = res.data.data
            self.dataToTree(data, self.modal.tree)
            // self.modal.tree.children.splice(0, self.modal.tree.children.length)
            // data.forEach((item) => {
            //   self.modal.tree.children.push({
            //     name: item.organName,
            //     id: item.organId,
            //     organCode: item.organCode,
            //     children: modalAdapter(item.children),
            //     isOpen: item.children.length > 0,
            //     hide: false
            //   })
            // })
          }
        }, res => {
          this.$store.dispatch(SHOW_TOAST, '加载组织机构树失败')
        })
      },
      resetTree () {
        this.modal.organId = null
        this.$refs.treeOne.clearSelected()
        this.modal.tree.children.splice(0)
        this.modal.tree.name = '公共节点'
        this.modal.tree.id = ''
        this.modal.tree.organCode = ''
        this.modal.tree.orgTypeCode = ''
        this.modal.tree.isOpen = true
        this.modal.tree.disabled = true
        this.modal.tree.isFolder = true
        console.log('resetTree', this.modal.tree)
      },
      /* 左边树的转换，不通用 */
      dataToTree (data, tree, fromSearch) {
        var self = this
        if (data.length > 1) {
          self.modal.tree.children.splice(0, self.modal.tree.children.length)
          data.forEach((item) => {
            self.modal.tree.children.push({
              name: item.organName,
              id: item.organId,
              organCode: item.organCode,
              children: modalAdapter(item.children),
              isOpen: item.children.length > 0,
              disabled: item.orgTypeCode !== 'community',
              hide: false
            })
          })
        } else if (data.length === 1) {
          tree.name = data[0].organName
          tree.id = data[0].organId
          tree.organCode = data[0].organCode
          tree.isOpen = (fromSearch) ? (data[0].children.length > 0) : data[0].isOpen
          tree.disabled = (data[0].orgTypeCode !== 'community')
          data[0].children.forEach((item) => {
            tree.children.push({
              name: item.organName,
              id: item.organId,
              organCode: item.organCode,
              children: modalAdapter(item.children),
              isOpen: item.children.length > 0,
              disabled: item.orgTypeCode !== 'community',
              hide: false
            })
          })
          console.debug('tree', tree)
        } else {
          self.callToast('没有查询到数据')
          tree.name = '没有查询到数据'
          tree.id = null
          tree.isFolder = false
          tree.disabled = true
        }
      },
      modalNodeOpen (id, model) {
        this.midTab.array.push({})
        this.midTab.array.splice(this.midTab.array.length, 1)
        if (model.children.length < 1) {
          api.querySubTreeById(id).then((res) => {
            if (res.data.code === '0') {
              if (res.data.data.length > 0) {
                modalAdapter(res.data.data).forEach((item) => {
                  model.children.push(item)
                })
              } else {
                model.isFolder = false
              }
            }
          }, res => {
            this.$store.dispatch(SHOW_TOAST, res.msg)
          })
        }
      },
      // 搜索左边组织机构树
      queryTreeByKey (keyword) {
        // 如果keyword为空，loadOrganTree
        if (!keyword) {
          this.resetTree()
          this.loadModalTree()
          return
        }
        // 如果keyword不为空，queryTreeByKey
        let self = this
        api.queryTreeByKey(keyword).then(res => {
          self.resetTree()
          if (res.data.code === '0') {
            let data = res.data.data
            self.dataToTree(data, self.modal.tree, true)
          } else {
            this.$store.dispatch(SHOW_TOAST, '搜索组织机构树失败')
          }
        }, res => {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了')
        })
      },
      modalCheck (id, model) {
        this.modal.organId = id
        console.log(this.midTab.array)
        this.resetMidTree()
        this.queryUserList()
      },
      resetMidTree () {
        this.midTab.midTree.children.splice(0, this.midTab.midTree.children.length)
        this.midTab.midTree.name = '公共节点'
        this.midTab.midTree.id = ''
        this.midTab.midTree.isOpen = true
        this.midTab.midTree.disabled = true
        this.midTab.midTree.isFolder = true
      },
      // 选中的时候，将id放到右边，需要过滤（小组不需要）
      midTreeCheck (id, model) {
        var self = this
        let map = self.midTab.userMap
        console.log('midTreeCheck', self.midTab.userMap)
        self.$nextTick(() => {
          self.midTab.checkUser.splice(0)
          // 如果modal.array某一项在userMap中，且不在右边的checkUser中，则加入右边
          self.midTab.array.forEach((item) => {
            if (map[item] && tabArr.getTab(self.midTab.checkUser, item, 'id') === -1) {
              self.midTab.checkUser.push({name: map[item], id: item})
            }
          })
//          self.midTab.checkUser.sort((prev, next) => {
//            return prev.department > next.department ? -1 : 1
//          })
          console.log(self.midTab.checkUser)
          console.log('modal array', self.midTab.array)
          self.saveThis()
        })
      },
      // 查询组织机构员工
      queryUserList (type) {
        let self = this
        api.loadServiceManagerTree(this.modal.organId, this.midTab.userName).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data
            // 用户名查询时,不需要重置
            if (type !== 'userName') {
//              self.$refs.midTabMidTree.clearSelected()
            }
            self.midTab.midTree.children.splice(0, self.midTab.midTree.children.length)
            self.midTab.midTree.name = data.organName
            self.midTab.midTree.id = data.organId.toString() // 转字符串
            self.midTab.midTree.organCode = data.organCode
            self.midTab.midTree.isOpen = data.children.length > 0
            self.midTab.midTree.isFolder = data.children.length > 0
            self.midTab.midTree.disabled = true // 项目不可选
            data.children.forEach((item) => {
              self.midTab.midTree.children.push({
                name: item.organName,
                id: item.organId.toString(), // 转字符串
                organCode: item.organCode,
                children: self.adapter(item.children),
                isOpen: item.children.length > 0,
                disabled: true,
                hide: false,
                isFolder: true // 小组可以继续打开
              })
            })
          } else {
            this.$store.dispatch(SHOW_TOAST, '加载组织机构树失败')
            treeError(self.midTree)
          }
        }, res => {
          this.$store.dispatch(SHOW_TOAST, '系统出小差了，加载组织机构树失败')
          treeError(self.midTree)
        })
      },
      adapter (array) {
        let result = []
        let self = this
        array.forEach((item) => {
          /* 当organCode是SERVICE-USER时，不能继续展开 */
          let isFolder = (item.organCode !== 'SERVICE-USER')
          if (item.organCode === 'SERVICE-USER') {
            self.midTab.userMap[item.organId.toString()] = item.organName
          }
          result.push({
            name: item.organName,
            id: item.organId.toString(), // 转字符串
            organCode: item.organCode,
            children: self.adapter(item.children),
            hide: false,
            isFolder: isFolder
          })
        })
        return result
      },
      /* 点击节点的时候，查询组员 */
      midTreeNodeOpen (id, model) {
        if (model.children.length < 1) {
          api.queryUserByGroupList(id).then((res) => {
            if (res.data.code === '0') {
              if (res.data.data.length > 0) {
                userAdapter(res.data.data).forEach((item) => {
                  model.children.push(item)
                })
                /* 多选：查询到数据后，小组可以全选 */
                model.disabled = false
                /* userMap用于过滤组员id，只有是user类型的才能选中，小组过滤掉 */
                let data = res.data.data
                let map = {...this.midTab.userMap}
                if (data instanceof Array) {
                  for (let i = 0; i < data.length; i++) {
                    map[data[i].userId.toString()] = data[i].userName // 转字符串
                  }
                }
                this.midTab.userMap = map
              } else {
                model.isFolder = false
                this.$store.dispatch(SHOW_TOAST, '没有查询到数据')
              }
            } else {
              let msg = res.data.msg ? res.data.msg : '系统出小差了'
              this.$store.dispatch(SHOW_TOAST, msg)
            }
          }, res => {
            this.$store.dispatch(SHOW_TOAST, '系统出小差了')
          })
        }
      },
//      queryUserList () {
//        // 该organId是模态框中选择了部门之后的organId，后续要改
//        if (!this.modal.organId) { // 没有organId时返回
//          this.$store.dispatch(SHOW_TOAST, '请选择组织机构')
//          return
//        }
//        api.queryUserList(this.modal.organId, this.modal.userName).then(res => {
//          if (Number(res.data.code) === 0) {
//            let data = res.data.data
//            let arr = []
//            let map = {...this.modal.userMap}
//            if (data instanceof Array) {
//              for (let i = 0; i < data.length; i++) {
//                arr.push({name: data[i].userName, value: data[i].userId})
//                map[data[i].userId] = data[i].userName
//              }
//            }
//            this.modal.userList = arr
//            this.modal.userMap = map
//          } else {
//            let msg = res.data.msg ? res.data.msg : '系统出小差了'
//            this.$store.dispatch(SHOW_TOAST, msg)
//          }
//        }, res => {
//          this.$store.dispatch(SHOW_TOAST, '系统出小差了')
//        })
//      },
      callToast (msg) {
        this.$store.dispatch(SHOW_TOAST, msg)
      }
    },
    mounted () {
      // value 转 computedOptions
      if (Array.isArray(JSON.parse(this.value))) {
      } else {
        console.log('value is illeagal, requires array stringify')
//        this.computedOptions = []
        this.cleanComputedOptions()
      }
      this.loadModalTree() // 加载树
    }
  }
  const treeError = function (tree) {
    tree.name = '没有查询到数据'
    tree.id = null
    tree.organCode = ''
    tree.orgTypeCode = ''
    tree.isFolder = false // 是否有小箭头
    tree.disabled = true
  }
  const userAdapter = function (array) {
    let result = []
    array.forEach((item) => {
      result.push({
        name: item.userName,
        id: item.userId.toString(), // 转字符串
        organCode: 'SERVICE-USER',
        children: [],
        hide: false,
        isFolder: false
      })
    })
    return result
  }
</script>

<style scoped lang="less">
  @import '../../assets/less/variables.less';
  .search-container {
    position: relative;
    padding: 10px 20px;
    border-bottom: 1px solid #e5e9f2;
  }
  .search-input {
    border-radius: 3px;
  }
  .search-btn {
    display: inline-block;
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 30px;
    color: #c0ccda;
  }
  .selectedHandler{
    border-top: 1px solid @gray;
  }
  /*span.handlerItem {*/
    /*padding: 2px 4px;*/
    /*margin: 4px;*/
    /*line-height: 20px;*/
    /*border: 1px solid #ddd;*/
    /*border-radius: 10px;*/
    /*display: inline-table;*/
  /*}*/
  /*.handlerItem i {*/
    /*vertical-align: text-top;*/
    /*padding-left: 2px;*/
    /*color: #D06359;*/
  /*}*/
  label, div{
    margin:0;
    padding:0;
    font-weight: normal;
  }
  .handler {
    vertical-align: top;
    display: inline-block;
    width: 180px;
    text-align:left;
    border: 1px solid @gray;
    margin-left: -3px;
  }
  .handler .list-group-item {
    border: none;
    white-space: nowrap;
  }
  .handler-label{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    padding: 8px 5px 8px 0;
  }
  .handler-label:hover{
    text-overflow: inherit;
    white-space: normal;
    overflow: visible;
  }
  a{
    cursor: pointer;
  }
  .flex-left {
    display: -webkit-inline-flex;
    display: inline-flex;
    justify-content: flex-start;
    -webkit-justify-content: flex-start;
    align-items: flex-start;
    -webkit-align-items: flex-start;
  }
  /* 模态框内部的样式 */
  .modal-add{
    width: 672px;
    padding:5px;
  }
  .modal-add .unit {
    text-align:left;
    margin:0px auto;
    margin-bottom: 5px;
  }
  .modal-add .unit > * {
    vertical-align:middle;
  }
  .modal-add .unit .btn {
    margin-left: 10px;
    height: 36px;
  }
  .modal-select{
    vertical-align: top;
    display: inline-block;
    font-size: 0;
  }
  .modal-select > * {
    font-size: 14px;
  }
  .modal-department{
    margin-right: 5px;
    height: 300px;
  }
  .modal-department, .modal-user{
    max-height: 300px;
    overflow-x: auto;
    overflow-y: hidden;
    width: 49%;
    display:inline-block;
    vertical-align:top;
    border: 1px solid @gray;
    // border-bottom: 1px solid #ddd;
    text-align:left;
  }
  .list-group-item{
    padding:0;
  }
  .list-group-item span{
    vertical-align: middle;
  }
  .modal-select .list-group-item:hover{
    background:#e5f4fd;
  }
  .modal-select .list-group-item:first-child {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: 0px;
  }
  .modal-select .list-group-item:last-child {
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    border-bottom: 0px;
  }
  .modal-select .list-group-item > *{
    vertical-align:middle;
    line-height: 21px;
  }
  .form-input{
    display:inline-block;
    width:280px;
    height:40px;
    border-radius:5px;
  }
  input.form-input:focus {
    box-shadow: none;
  }
  .list-group-item .checkbox-label{
    padding: 10px 15px;
    width:100%;
  }
  .checkbox-label{
    font-size:0;
    vertical-align:middle;
    font-weight:normal;
    cursor:pointer;
  }
  .checkbox-label:hover input[type="checkbox"] + span {
    border-color: #19afe7; /*改*/
  }
  /*小的checkbox*/
  input[type='checkbox'] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    margin:0;
  }
  input[type="checkbox"] + span {
    vertical-align:middle;
    top:0;
    font-size:9px;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    border-radius: 3px;
    display: inline-block;
    border: 1px solid #bfcbd9;
    text-align:center;
    line-height:10px;
    background:#fff;
    cursor:pointer;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46); /*改*/
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    -moz-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    position:relative;
  }
  input[type="checkbox"] + span:hover {
    border-color: #19afe7; /*改*/
  }
  /*部分选中*/
  input[type="checkbox"].half + span::after {
    position:absolute;
    display:block;
    content: "";
    border: 1px solid #fff;
    margin-top: -1px;
    left: 3px;
    right: 3px;
    top: 50%;
  }
  input[type="checkbox"]:checked + span, input[type="checkbox"].half + span {
    background-color: #19afe7;
    border-color: #00a0e2; /*改*/
  }
  input[type="checkbox"] + span::before {
    content: '\a0';
    transform: rotate(45deg) scaleY(0);
    -webkit-transform: rotate(45deg) scaleY(0);
    -moz-transform: rotate(45deg) scaleY(0);
    transition: transform .15s cubic-bezier(.71,-.46,.88,.6) .05s;
    transform-origin: center;
    -webkit-transform-origin: center;
    -moz-transform-origin: center; /*改*/
  }
  input[type='checkbox']:checked + span::before{
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
  input[type='checkbox']:disabled + span::before {
    opacity: .4;
  }
  .checkbox-container{
    font-size:0;
    display:inline-block;
    vertical-align:middle;
    margin:0 10px;
  }
  .checkbox-block{
    font-size:0;
    display:block;
    vertical-align:middle;
    margin:0 10px;
  }
  .checkbox-text{
    vertical-align: top;
    font-size:14px;
    pointer-events: none;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .not-find{
    padding: 10px;
  }
</style>

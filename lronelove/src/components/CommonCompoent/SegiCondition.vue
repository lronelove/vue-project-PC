<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="seigCondition" style="width: 300px">
    <div class="firstPage" v-show="firstPage">
      <tr v-for="(rule, index) in rules" class="rulesItem" :key="index">
        <!-- index will change after your drag -->
        <th scope="row">
          <h5>
          <!--<span class="glyphicon glyphicon-option-vertical"></span><span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>{{index + 1}}.&nbsp-->
            <span v-if="index === 0">当</span>
            <span v-if="index !== 0">或</span>
          </h5>
        </th>
        <td>
          <!--<input type="text" max="512" v-show="rule.editFlag" :value="rule.ruleContent" @input="ruleEdit($event.target.value, index)" v-focus="rule.editFlag" @focus="setEditFlag(rule, true)" @blur="setEditFlag(rule, false)"  />-->
          <button v-if="!disabled" class="btn btn-text btn-primary" @click.stop="setEditFlag(rule, index, false)">{{(disabled) ? '详情' : '编辑'}}</button>
          <button v-if="!disabled" class="btn btn-text btn-danger" @click.stop="delRules(index)">删除</button>
          <div v-show="!rule.editFlag" class="tdDisplay" :class="{disabled: disabled}">
            {{rule.groupName}}
          </div>
        </td>
      </tr>
      <tr  class="rulesItem">
        <th scope="row">
          <h5>
            <span v-if="rules.length === 0">当</span>
            <span v-if="rules.length !== 0">或</span>
          <!--<span class="glyphicon glyphicon-option-vertical"></span><span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>{{rules.length + 1}}.&nbsp-->
          </h5>
        </th>
        <td><div class="fakeinput" @click="appendRules" :class="{disabled: disabled}" >
          点击添加新条件
        </div></td>
      </tr>
    </div>
    <div class="secondPage" v-show="!firstPage" style="width: 650px;">
      <button class="btn btn-default returnBtn" @click.stop="backToFirstPage()" style="margin: 0 0 10px;">返回</button>
      <segi-form-input v-if="groupNameShowIndex !== '' && rules[groupNameShowIndex]" inputType="text" label="组名" labelWidth="100px" inputWidth="200px" v-model="rules[groupNameShowIndex].groupName" @input="upload()" :disabled="safetyMode === 'save'" style="float: right;" />
      <tr>
        <!--<th scope="row"></th>-->
        <!--<span class="condItems CondTitle">条件左类型</span>-->
        <!--<span class="condItems CondTitle">条件左值</span>-->
        <!--<span class="condItems CondTitle">条件</span>-->
        <!--<span class="condItems CondTitle">条件右类型</span>-->
        <!--<span class="condItems CondTitle">条件右值</span>-->
      </tr>
      <tr v-for="(cond, index) in condsShow" class="rulesItem" :key="index" style="height: 50px">
        <!-- index will change after your drag -->
        <th scope="row">
          <h5>
            <!--<span class="glyphicon glyphicon-option-vertical"></span>-->
            <!--<span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>-->
            <!--{{index + 1}}.&nbsp-->
            <span v-if="index === 0">当</span>
            <span v-if="index !== 0">并且</span>
          </h5>
        </th>
        <td style="padding-left: 10px">
          <select2 class="condItems" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择类型" :options="rlTypeOptionsOne" v-model="cond.lType" @input="cleanAttr(cond, 'lType')" :disabled="safetyMode === 'save'" />

          <segi-form-input class="condItems" v-if="cond.lType === 1" inputType="text" label="" labelWidth="0px" inputWidth="100px" v-model="cond.lValue" @input="cleanAttr(cond, 'lValue')"  :disabled="safetyMode === 'save'" />
          <select2 class="condItems" v-if="cond.lType === 2" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择对象" :options="lValueOptions" @input="cleanAttr(cond, 'lValue')" v-model="cond.lValue" :disabled="safetyMode === 'save'" />

          <select2 class="condItems" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择操作符" :options="operatirflagOptions" v-model="cond.operatirflag" @input="upload()" :disabled="safetyMode === 'save'" />

          <select2 class="condItems" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择类型" :options="(cond.lType === 1) ? rlTypeOptionsOne : rlTypeOptionsTwo" v-model="cond.rType" @input="cleanAttr(cond, 'rType')" :disabled="safetyMode === 'save'" />

          <segi-form-input class="condItems" v-if="cond.rType === 1" inputType="text" label="" labelWidth="0px" inputWidth="100px" v-model="cond.rValue" @input="upload()"  :disabled="safetyMode === 'save'" />
          <select2 class="condItems" v-if="cond.rType === 2" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择对象" :options="lValueOptions" v-model="cond.rValue" @input="upload()" :disabled="safetyMode === 'save'" />
          <select2 class="condItems" v-if="cond.rType === 3" label="" labelWidth="0px" inputWidth="100px" dropWidth="200px" holder1="选择值" :options="rValueOptions(cond.lValue)" v-model="cond.rValue" @input="upload()" :disabled="safetyMode === 'save'" />
          <button v-if="!disabled" class="btn btn-text btn-danger " @click.stop="delConds(index)" style="vertical-align: text-top;margin-top: 4px;">删除</button>
        </td>
      </tr>
      <tr @click="appendConds" class="rulesItem">
        <th scope="row">
          <h5>
            <span v-if="condsShow.length === 0">当</span>
            <span v-if="condsShow.length !== 0">并且</span>
            <!--<span class="glyphicon glyphicon-option-vertical"></span><span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>{{condsShow.length + 1}}.&nbsp-->
          </h5>
        </th>
        <td style="padding-left: 10px">
          <div class="fakeinput condItems" v-for="item in [0,1,2,3,4]"  :class="{disabled: disabled}" >
          <!--点击生成新条件-->
          </div>
        </td>
      </tr>
    </div>
  </div>
</template>

<script>
  import { SHOW_TOAST } from '../../store/types'
  import clickoutside from '../../utils/directive/clickoutside'
  import Select2 from 'components/Select2'
  import SegiFormInput from 'components/SegiFormInput'
  import _ from 'lodash'
  export default {
    name: 'invitationRules',
    components: {
      Select2,
      SegiFormInput
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      attrCode: {
        type: String,
        default: ''
      },
      formAttrListPreMatch: {
        type: Array,
        default: []
      },
      keyOfInspected: {
        type: [String, Number],
        default: ''
      },
      tacheIdOfInspected: {
        type: [String, Number],
        default: ''
      },
      safetyMode: {
        type: String,
        default: 'fully'
      },
      showFlag: {
        type: Boolean,
        default: false
      }
    },
    directives: { focus: {
      inserted: function (el, binding) {
        if (binding.value) el.focus()
        else el.blur()
      },
      componentUpdated: function (el, binding) {
        if (binding.modifiers.lazy) {
          if (Boolean(binding.value) === Boolean(binding.oldValue)) {
            return
          }
        }
        if (binding.value) el.focus()
        else el.blur()
      }
    },
      clickoutside
    },
    computed: {
      lValueOptions () {
        var self = this
        var res = []
        self.formAttrListPreMatch.map(function (attr, attrIndex) {
          if (parseInt(self.keyOfInspected) === parseInt(attr.key)
            /* 由于tacheId异步拉取，渲染此组件时不确定是否存在，因此暂不添加 */
//            parseInt(self.tacheIdOfInspected) === parseInt(attr.tacheId)
          ) {
            res.push({
              name: attr.attrName,
              value: attr.attrCode
            })
          }
        })
        console.log(res)
        return res
      }
    },
    methods: {
      cleanAttr (cond, type) {
        switch (type) {
          case 'lType':
            cond.lValue = ''
            cond.rType = 1
            cond.rValue = ''
            break
          case 'lValue':
            cond.rValue = ''
            cond.rType = 1
            break
          case 'rType':
            cond.rValue = ''
            break
          default :
            console.log('error')
            break
        }
        this.upload()
      },
      backToFirstPage () {
        var self = this
        self.firstPage = true
        self.$nextTick(function () {
          var diff = self.$el.offsetHeight - self.initHeight
//          console.log(self.$el.offsetHeight + '&' + self.initHeight)
          self.initHeight = self.$el.offsetHeight
          self.$emit('resizeCondition', {
            evtTarget: self.$el,
            heightDiff: diff,
            attrCode: self.attrCode
          })
        })
      },
      rValueOptions (attrCode) {
        var self = this
        var res = []
        self.formAttrListPreMatch.map(function (attr, attrIndex) {
          if (attr.attrCode === attrCode &&
            parseInt(attr.key) === parseInt(self.keyOfInspected)
//            parseInt(self.tacheIdOfInspected) === parseInt(attr.tacheId)
          ) {
            attr.attrValues.forEach((item) => {
              res.push({
                name: item.attrValueName,
                value: item.attrValueCode
              })
            })
          }
        })
        return res
      },
      delRules: function (index) {
        var self = this
        self.rules.splice(index, 1)
        self.upload()
        self.$nextTick(function () {
          var diff = self.$el.offsetHeight - self.initHeight
          self.initHeight = self.$el.offsetHeight
          self.$emit('resizeCondition', {
            evtTarget: self.$el,
            heightDiff: diff,
            attrCode: self.attrCode
          })
        })
      },
      delConds (index) {
        var self = this
        self.condsShow.splice(index, 1)
        self.upload()
        self.$nextTick(function () {
          var diff = self.$el.offsetHeight - self.initHeight
          self.initHeight = self.$el.offsetHeight
          self.$emit('resizeCondition', {
            evtTarget: self.$el,
            heightDiff: diff,
            wider: !self.firstPage,
            attrCode: self.attrCode
          })
        })
      },
      appendRules: function () {
        var self = this
        if (!this.disabled) {
          this.rules.push({
            groupName: '新建组',
            conds: [],
            editFlag: false,
            editFlagDelay: false
          })
          self.upload()
          self.$nextTick(function () {
            var diff = self.$el.offsetHeight - self.initHeight
//            console.log(self.$el.offsetHeight + ' & ' + self.initHeight)
            self.initHeight = self.$el.offsetHeight
            self.$emit('resizeCondition', {
              evtTarget: self.$el,
              heightDiff: diff,
              attrCode: self.attrCode
            })
          })
        }
      },
      appendConds () {
        var self = this
        if (!this.disabled) {
          self.condsShow.push({
            lType: 1,
            lValue: '',
            operatirflag: '',
            rType: 1,
            rValue: ''
          })
          self.upload()
          self.$nextTick(function () {
            var diff = self.$el.offsetHeight - self.initHeight
//            console.log(self.$el.offsetHeight + ' & ' + self.initHeight)
            self.initHeight = self.$el.offsetHeight
            self.$emit('resizeCondition', {
              evtTarget: self.$el,
              heightDiff: diff,
              wider: !self.firstPage,
              attrCode: self.attrCode
            })
          })
          console.log(self.rules)
          console.log(self.lValueOptions)
          console.log(self.condsShow)
        }
      },
//      ruleEdit (val, index) {
//        this.rules[index].ruleContent = val
//      },
      setEditFlag (rule, index, flag) {
        var self = this
        self.$el.parentNode.parentNode.style.opacity = 0
        self.$el.style.opacity = 0
        self.firstPage = flag
        self.condsShow.splice(0)
        self.condsShow.push(...rule.conds)
        self.groupNameShowIndex = index
        console.log(self.condsShow)
        setTimeout(function () {
          var diff = self.$el.offsetHeight - self.initHeight
          console.log(self.$el.offsetHeight + '&' + self.initHeight)
          self.initHeight = self.$el.offsetHeight
          self.$emit('resizeCondition', {
            evtTarget: self.$el,
            heightDiff: diff,
            wider: !self.firstPage,
            attrCode: self.attrCode
          })
        }, 100)

//        if (this.disabled) {
//          self.callToast('不可编辑')
//          return
//        }
//        rule.editFlag = flag
//        if (flag) {
//          rule.editFlagDelay = flag
//        } else {
//          setTimeout(function () {
//            rule.editFlagDelay = flag
//            var res = []
//            self.rules.map(function (rule, index) {
//              res.push(rule.ruleContent)
//            })
//            self.$emit('input', JSON.stringify(res))
//            self.$nextTick(function () {
//              var diff = self.$el.offsetHeight - self.initHeight
//              self.$emit('resizeCondition', {
//                evtTarget: self.$el,
//                heightDiff: diff,
//                attrCode: self.attrCode
//              })
//            })
//          }, 0)
//        }
      },
      callToast (msg) {
        this.$store.dispatch(SHOW_TOAST, msg)
      },
      upload () {
        var self = this
        var res = []
        if (self.groupNameShowIndex !== '' && self.rules[self.groupNameShowIndex] && Array.isArray(self.rules[self.groupNameShowIndex].conds)) {
          self.rules[self.groupNameShowIndex].conds.splice(0)
          self.rules[self.groupNameShowIndex].conds.push(...self.condsShow)
        }
        if (!self.rules[self.groupNameShowIndex]) {
          self.condsShow.splice(0)
        }
        self.rules.map(function (rule, ruleIndex) {
          var temp = _.clone(rule)
          temp.sequence = ruleIndex
          delete (temp['editFlag'])
          delete (temp['editFlagDelay'])
          res.push(temp)
        })
        self.$emit('input', JSON.stringify(res))
      }
    },
    watch: {
      showFlag (val) {
        var self = this
        self.$nextTick(function () {
          self.initHeight = self.$el.offsetHeight
        })
      },
      value (val) {
        var self = this
        if (val === '') {
          self.rules = []
        } else {
          var res = JSON.parse(val)
          if (Array.isArray(res)) {
            self.rules = []
            if (res.length !== 0) {
              res.map(function (rule, index) {
                self.rules.push({
                  groupName: rule.groupName,
                  conds: rule.conds,
                  sequence: rule.sequence,
                  editFlag: false,
                  editFlagDelay: false
                })
              })
            }
          }
        }
      },
      firstPage (val) {
        this.$el.parentNode.getElementsByClassName('popoverHint')[0].style.display = (val) ? 'block' : 'none'
      }
    },
    data () {
      return {
        rules: [],
        condsShow: [],
        initHeight: 40,
        groupNameShowIndex: '',
//        initHeightSecPage: 86,
        firstPage: true,
        rlTypeOptionsOne: [
          {name: '固定值', value: 1},
          {name: '参考对象', value: 2}
        ],
        rlTypeOptionsTwo: [
          {name: '固定值', value: 1},
          {name: '参考对象', value: 2},
          {name: '选择值', value: 3}
        ],
//        =，!=，>=，<=，>，<，in，include
        operatirflagOptions: [
          {name: '等于', value: '='},
          {name: '不等于', value: '!='},
          {name: '大于等于', value: '>='},
          {name: '小于等于', value: '<='},
          {name: '大于', value: '>'},
          {name: '小于', value: '<'},
          {name: '存在于', value: 'in'},
          {name: '包含', value: 'include'}
        ]
//        globalId: -1
      }
    },
    mounted: function () {
      var self = this
      console.log(self.formAttrListPreMatch)
      if (self.value === '') {
        self.rules = []
      } else {
        var res = JSON.parse(self.value)
        console.log(res)
        if (Array.isArray(res)) {
          self.rules = []
          res.map(function (rule, index) {
            self.rules.push({
              groupName: rule.groupName,
              conds: rule.conds,
              sequence: rule.sequence,
              editFlag: false,
              editFlagDelay: false
            })
          })
        }
      }
    }
  }
</script>

<style scoped  lang="less">
  @import '../../assets/less/variables.less';
  .CondTitle{
    text-align: center;
    padding: 2px 0;
  }
  .fakeinput.condItems {
    width: 100px;
    display: inline-block;
    margin: 0 2px
  }
  .condItems {
    vertical-align: text-top;
    width: 100px;
    display: inline-block;
    margin: 0 1px 0 0;
  }
  .fakeinput{
    line-height: 25px;
    color: @extra-light-black;
    border-radius: 5px;
    border: 1px dashed #bdbdbd;
    min-width: 100px;
    height: 40px;
    width: 200px;
    padding: 6px 12px;
  }
  .tdDisplay {
    border-radius: 5px;
    border: 1px solid transparent;
    height: 40px;
    line-height: 30px;
    padding: 6px 12px;
    width: 200px;
    display: inline-block;
    float: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /*.tdDisplay:hover {*/
    /*border: 1px solid #bdbdbd;*/
    /*!*background: -webkit-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Safari 5.1 - 6.0 *!*!*/
    /*!*background: -o-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Opera 11.1 - 12.0 *!*!*/
    /*!*background: -moz-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Firefox 3.6 - 15 *!*!*/
    /*background: linear-gradient(#ffffff, #f2f2f2, #ffffff); !* 标准的语法 *!*/
    /*outline: 0;*/
  /*}*/
  .tdDisplay.disabled:hover {
    border: 1px solid #bdbdbd;
    /*background: -webkit-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Safari 5.1 - 6.0 *!*/
    /*background: -o-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Opera 11.1 - 12.0 *!*/
    /*background: -moz-linear-gradient(#ecf3f8, #ffffff, #ecf3f8); !* Firefox 3.6 - 15 *!*/
    background: #EEEEEE; /* 标准的语法 */
    outline: 0;
  }
  .rulesItem {
  }
  .rulesItem:not(.disabled):hover {
    border-color: rgb(50, 118, 177)!important;
  }
  .rulesItem.selected{
    border-color: rgb(50, 118, 177)!important;
  }
  .rulesItem th{
    vertical-align: middle;
    padding-top: 5px;
    padding-bottom: 10px;
  }
  .rulesItem input{
    border-radius: 5px;
    border: 1px solid #bdbdbd;
    width: 200px;
    height: 40px;
    padding: 6px 12px;
  }
  .rulesItem input:focus{
    /*border-color: #66afe9;*/
    outline: 0;
    /*-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);*/
    /*box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);*/
  }
  .fakeinput.disabled{
    background-color: #EEEEEE;
  }
  .btn.btn-text{
    line-height: 45px;
    margin-left: 5px;
  }
</style>

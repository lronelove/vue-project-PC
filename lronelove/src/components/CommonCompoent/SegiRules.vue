<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="seigRules" style="width: 300px">
    <tr v-for="(rule, index) in rules" class="rulesItem" :key="index">
      <!-- index will change after your drag -->
      <th scope="row">
        <h5>
          <span v-if="widgetType === 'quickReply'">回复{{index + 1}}：</span>
          <span v-if="widgetType === 'badReply'">理由{{index + 1}}：</span>
        <!--<span class="glyphicon glyphicon-option-vertical"></span><span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>{{index + 1}}.&nbsp-->
        </h5>
      </th>
      <td>
        <input type="text" class="rulesInput" max="512" v-show="rule.editFlag" :value="rule.ruleContent" @input="ruleEdit($event.target.value, index)" v-focus="rule.editFlag" @focus="setEditFlag(rule, true)" @blur=""  />
        <div v-show="!rule.editFlag" class="tdDisplay" :class="{disabled: disabled}">
          {{rule.ruleContent}}
        </div>
        <div style="width:65px;vertical-align:top; float:right;text-align: left;display: inline-block">
          <button v-if="!disabled && rule.editFlag" class="btn btn-text btn-primary" @click.stop="setEditFlag(rule, false)" style="">完成</button>
          <button v-if="!disabled && !rule.editFlag" class="btn btn-text btn-primary" @click.stop="setEditFlag(rule, true)" style="">编辑</button>
          <button v-if="!disabled" class="btn btn-text btn-danger" @click.stop="delRules(index)" style="">删除</button>
        </div>
      </td>
    </tr>
    <tr class="rulesItem">
      <th scope="row">
        <h5>
          <span v-if="widgetType === 'quickReply'">回复{{rules.length + 1}}：</span>
          <span v-if="widgetType === 'badReply'">理由{{rules.length + 1}}：</span>
          <!--<span class="glyphicon glyphicon-option-vertical"></span>-->
        <!--<span class="glyphicon glyphicon-option-vertical" style="margin-left: -10px;"></span>{{rules.length + 1}}.&nbsp-->
        </h5>
      </th>
      <td><div class="fakeinput" @click.stop="appendRules" :class="{disabled: disabled}" >点击此处添加</div></td>
    </tr>
  </div>
</template>

<script>
  import { SHOW_TOAST } from '../../store/types'
  import clickoutside from '../../utils/directive/clickoutside'

  export default {
    name: 'invitationRules',
    components: {
    },
    props: {
      widgetType: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      disabled: {
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
    },
    methods: {
      delRules: function (index) {
        console.log(index)
        var self = this
        var res = []
        self.rules.map(function (rule, ruleIndex) {
          if (ruleIndex !== index) {
            res.push(rule.ruleContent)
          }
        })
        console.log(res)
        self.$emit('input', JSON.stringify(res))
      },
      appendRules: function () {
        var self = this
        if (!this.disabled) {
          this.rules.forEach((item) => {
            item.editFlag = false
            item.editFlagDelay = false
          })
          self.rules.push({
            ruleContent: '',
            editFlag: true,
            editFlagDelay: true
          })
          var res = []
          self.rules.map(function (rule, ruleIndex) {
            res.push(rule.ruleContent)
          })
          self.$emit('input', JSON.stringify(res))
          setTimeout(function () {
            console.log(self.rules)
            self.rules[self.rules.length - 1].editFlag = true
            self.rules[self.rules.length - 1].editFlagDelay = true
            let rulesInputArr = self.$el.getElementsByClassName('rulesInput')
            console.log(rulesInputArr[rulesInputArr.length - 1])
//            rulesInputArr[rulesInputArr.length - 1].focus()
          }, 0)
        }
      },
      ruleEdit (val, index) {
        this.rules[index].ruleContent = val
      },
      setEditFlag (rule, flag) {
        var self = this
        if (this.disabled) {
          self.callToast('不可编辑')
          return
        }
        self.rules.forEach((item) => {
          item.editFlag = false
          item.editFlagDelay = false
        })
        rule.editFlag = flag
        if (flag) {
          rule.editFlagDelay = flag
        } else {
          setTimeout(function () {
            rule.editFlagDelay = flag
            var res = []
            self.rules.map(function (rule, index) {
              res.push(rule.ruleContent)
            })
            self.$emit('input', JSON.stringify(res))
          }, 0)
        }
      },
      callToast (msg) {
        this.$store.dispatch(SHOW_TOAST, msg)
      }
    },
    watch: {
      value (val) {
        console.log(this.widgetType)
        var self = this
        if (val === '') {
          self.rules.splice(0)
        } else {
          var res = JSON.parse(val)
          console.log(res)
          if (Array.isArray(res)) {
            self.rules.splice(0)
            res.map(function (rule, index) {
              self.rules.push({
                ruleContent: rule,
                editFlag: false,
                editFlagDelay: false
              })
            })
          }
        }
      }
    },
    data () {
      return {
        rules: []
//        globalId: -1
      }
    },
    mounted: function () {
      var self = this
      if (self.value === '新建回复') {
        self.rules.splice(0)
      } else {
        var res = JSON.parse(self.value)
        console.log(res)
        if (Array.isArray(res)) {
          self.rules.splice(0)
          res.map(function (rule, index) {
            self.rules.push({
              ruleContent: rule,
              editFlag: false,
              editFlagDelay: false
            })
          })
        }
      }
    }
  }
</script>

<style scoped   lang="less">
  @import '../../assets/less/variables.less';
  .fakeinput{
    line-height: 25px;
    color: @extra-light-black;
    border-radius: 5px;
    border: 1px dashed #bdbdbd;
    min-width: 100px;
    height: 40px;
    width: 180px;
    padding: 6px 12px;
  }
  .tdDisplay {
    border-radius: 5px;
    border: 1px solid transparent;
    height: 40px;
    line-height: 30px;
    padding: 6px 12px;
    width: 180px;
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
    padding-bottom: 5px;
    height: 45px
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
    width: 180px;
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
    margin-left: 2px;
  }
</style>

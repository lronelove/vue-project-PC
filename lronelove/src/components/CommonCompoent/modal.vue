/**
* Created by Richard Chao on 2016/12/19.
*/
<!--
<modal title="Modal Title"
           :show="modalshow"
           cancelText='取消'
           cancelClass="btn btn-danger"
           okClass="btn btn-default"
           okText='保存'
           modalWidth='51%'
           ifOk='true'
           @save="saveThis"
           @closeModalWin="closeModalWindow"
    ></modal>
where:
      saveThis: function () {
        console.log('upload your info')
      }
      closeModalWindow: function () {
        this.modalshow = false
      },
    -->
<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-model="http://www.w3.org/1999/xhtml">
  <div :class="{isshow: show,notshow: !show, nofade: !fade}" :transition="transition" :style="styleObject">
    <div class="modal scrollbar" :class="[{ modalOpen: modalOpen }, modalVertical]" @click.self="clickMask" :style="modalStyle">
      <div class="modal-dialog"
           :class="modalClass"
           ref="dialog"
           :style="[{ width: modalWidth, minWidth: modalMinWidth, margin: modalMargin, height: modalDialogHeight }, dialogVertical]"
           v-show="show"
      >
        <span v-show="loading" class="vux-spinner vux-spinner-ios"><svg viewBox="0 0 64 64"><g stroke-width="4" stroke-linecap="round"><line y1="17" y2="29" transform="translate(32,32) rotate(180)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(210)"><animate attributeName="stroke-opacity" dur="750ms" values="0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(240)"><animate attributeName="stroke-opacity" dur="750ms" values=".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(270)"><animate attributeName="stroke-opacity" dur="750ms" values=".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(300)"><animate attributeName="stroke-opacity" dur="750ms" values=".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(330)"><animate attributeName="stroke-opacity" dur="750ms" values=".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(0)"><animate attributeName="stroke-opacity" dur="750ms" values=".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(30)"><animate attributeName="stroke-opacity" dur="750ms" values=".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(60)"><animate attributeName="stroke-opacity" dur="750ms" values=".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(90)"><animate attributeName="stroke-opacity" dur="750ms" values=".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(120)"><animate attributeName="stroke-opacity" dur="750ms" values=".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85" repeatCount="indefinite"></animate></line><line y1="17" y2="29" transform="translate(32,32) rotate(150)"><animate attributeName="stroke-opacity" dur="750ms" values="1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1" repeatCount="indefinite"></animate></line></g></svg></span>
        <div v-show="!loading" class="modal-content" :style="contentStyle">
          <!--Header-->
          <div class="modal-header" :class="{headNoBorder: headNoBorder}">
            <slot name="header">
              <a v-if="ifCloseBtn" @click="cancel" class="remove-icon"><i class="iconfont icon-remove-cross" style="font-size:17px;"></i></a>
              <h4 class="modal-title" style="height: 20px;line-height:20px;">
                <!--<slot name="title">-->
                  {{title}}
                <!--</slot>-->
              </h4>
            </slot>
          </div>
          <!--Container-->
          <div class="modal-body clearfix" :style="{padding: bodyPadding}">
            <slot></slot>
          </div>
          <!--Footer-->
          <div class="modal-footer" :style="modalFooterStyle" :class="{footerNoBorder: footerNoBorder}">
            <slot name="footer">
              <button type="button" v-if="ifCancel === 'true'" :disabled="cancelDisabled" :class="cancelClass" @click="cancel">{{cancelText}}</button>
              <button type="button" v-if="ifOk === 'true'" :disabled="okDisabled" :class="okClass" @click="ok">{{okText}}</button>
            </slot>
          </div>
          <div v-if="hasFooter" class="modal-footer modal-footer-fake hasSlot" v-show="fakeFooterFlag" :style="[modalFooterStyle]" style="width: 100%;">
            <!--{{footerClone}}-->
            <modal-slot-copy ref="modalSlotCopy" />
          </div>
          <div v-if="!hasFooter" class="modal-footer modal-footer-fake noSlot" v-show="fakeFooterFlag" :style="[modalFooterStyle]" style="width: 100%;">
            <div>
              {{ifCancel}}
              {{ifOk}}
              <button type="button" v-show="ifCancel === 'true'" :disabled="cancelDisabled" :class="cancelClass" @click="cancel">{{cancelText}}</button>
              <button type="button" v-show="ifOk === 'true'" :disabled="okDisabled" :class="okClass" @click="ok">{{okText}}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop in" ></div>
  </div>
</template>
<script>
  /**
   * Bootstrap Style Modal Component for Vue
   * Depend on Bootstrap.css
   */
//  import _ from 'lodash'
  import Vue from 'vue'
  import _ from 'lodash'
  var modalSlotCopy = Vue.component('modalSlotCopy', {
    render: function (createElement) {
      return createElement(
        'div',   // tag name
        [deepClone(createElement)] // array of children
      )
    }
  })
  var modalFooterSlot = ''
  export default {
    components: {
      modalSlotCopy
    },
    props: {
      headNoBorder: {
        type: Boolean,
        default: false
      },
      footerNoBorder: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
//        twoWay: true,
        default: false
      },
      title: {
        type: String,
        default: 'Modal'
      },
      small: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      full: {
        type: Boolean,
        default: false
      },
      // 为true时无法通过点击遮罩层关闭modal
      force: {
        type: Boolean,
        default: false
      },
      // 自定义组件transition
      transition: {
        type: String,
        default: 'modal'
      },
      // 确认按钮text
      okText: {
        type: String,
        default: 'OK'
      },
      // 取消按钮text
      cancelText: {
        type: String,
        default: 'Cancel'
      },
      // 确认按钮className
      okClass: {
        type: String,
        default: 'btn btn-success'
      },
      ifOk: {
        type: String,
        default: 'true'
      },
      ifCancel: {
        type: String,
        default: 'false'
      },
      // 是否头部有关闭按键
      ifCloseBtn: {
        type: Boolean,
        default: true
      },
      cancelDisabled: {
        type: Boolean,
        defualt: false
      },
      okDisabled: {
        type: Boolean,
        default: false
      },
      // 取消按钮className
      cancelClass: {
        type: String,
        default: 'btn btn-default'
      },
      // 点击确定时关闭Modal
      // 默认为false，由父组件控制prop.show来关闭
      closeWhenOK: {
        type: Boolean,
        default: false
      },
      modalWidth: {
        type: String,
        default: '50%'
      },
      modalMinWidth: {
        type: String,
        default: '700px'
      },
      modalMargin: {
        type: String,
        default: '30px auto'
      },
      modalDialogHeight: {
        type: String,
        default: 'auto'
      },
      bodyPadding: {
        type: String
      },
      // 是否有fadeIn动画
      fade: {
        type: Boolean,
        default: true
      },
      // modal样式设置
      modalStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      // content样式设置
      contentStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      modalFooterStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
      vertical: {
        type: Boolean,
        default: true
      },
      /* margin/ flex方法实现垂直居中 */
      verticalType: {
        type: String,
        default: 'margin'
      },
      animated: {
        type: Boolean,
        default: false
      },
      fakeFooterFlagControl: {
        type: Boolean,
        default: false
      },
      // 是否调用updated
      update: {
        type: Boolean,
        default: true
      },
      throttle: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        updateCnt: 0,
        hasFooter: false,
        fakeFooterFlag: false,
        footerClone: '',
        duration: null,
        styleObject: {},
        modalOpen: true,
        modalHeight: 0
      }
    },
    computed: {
      modalWidthNum () {
        var patt = new RegExp(/[0-9]+/g, 'g')
        return patt.exec(this.modalWidth)
      },
      modalClass () {
        return {
          'modal-lg': this.large,
          'modal-sm': this.small,
          'modal-full': this.full
        }
      },
      modalVertical () {
        if (this.vertical && this.verticalType === 'flex' && this.modalHeight < window.innerHeight) {
//          console.log('marginTop', parseInt((window.innerHeight - this.modalHeight) / 2, 10))
          // let margin = parseInt((window.innerHeight - this.modalHeight) / 2, 10) + 'px'
          // return {marginTop: margin, marginBottom: margin}
          return 'vertical-center'
        } else {
          // return {margin: this.modalMargin}
          return ''
        }
      },
      dialogVertical () {
        console.log(this.vertical, this.verticalType === 'margin', this.modalHeight !== 0, this.modalHeight < window.innerHeight)
        if (this.vertical && this.verticalType === 'margin' && this.modalHeight !== 0 && this.modalHeight < window.innerHeight) {
//          console.log('marginTop', parseInt((window.innerHeight - this.modalHeight) / 2, 10))
          let margin = parseInt((window.innerHeight - this.modalHeight) / 2, 10) + 'px'
          return {marginTop: margin, marginBottom: margin}
        } else {
          console.log('jkhjkhjkhkjhkjhjk')
          return {}
        }
      }
    },
    created () {
      if (this.show) {
//        this.modalOpen = true
        document.body.className += ' modal-open'
      }
    },
    mounted () {
      var self = this
      this.$slots.footer && (modalFooterSlot = this.$slots.footer)
      if (this.fakeFooterFlagControl) {
        this.fakeFooterFlag = true
      }
      if (this.$slots['footer']) {
        this.hasFooter = true
      } else {
        this.hasFooter = false
      }
      console.log(modalFooterSlot)
      window.addEventListener('resize', function () {
        self.buildFakeFooter()
      }, false)
    },
    updated () {
//      console.log(this.$slots)
      console.log('modal updated')
      if (this.update && this.show) {
        this.updateCnt++
        if (this.throttle || this.updateCnt > 10) {
          this.$nextTick(_.debounce(function () {
            this.updateModalHeight()
//            this.buildFakeFooter()
          }, 500))
        } else {
          this.modalHeight = (this.$refs.dialog !== undefined ? this.$refs.dialog.scrollHeight : 0)
//          this.buildFakeFooter()
        }
      }
    },
    beforeDestroy () {
//      this.modalOpen = false
      document.body.className = document.body.className.replace(' modal-open', '')
    },
    watch: {
      show (value) {
        this.updateCnt = 0
//        this.footerClone = _.cloneDeep()
        // 在显示时去掉body滚动条，防止出现双滚动条
        if (value) {
//          this.modalOpen = true
          document.body.className += ' modal-open'
          let self = this
          this.vertical && this.$nextTick(function () {
            self.modalHeight = (self.$refs.dialog !== undefined ? self.$refs.dialog.scrollHeight : 0)
//            console.log('show modalHeight:', self.modalHeight, window.innerHeight)
          })
          document.getElementsByTagName('body')[0].style.paddingRight = (document.getElementsByTagName('body')[0].scrollHeight > window.innerHeight) ? '8px' : '0px'
        } else {
          // 在modal动画结束后再加上body滚动条
          if (!this.duration) {
            this.duration = window.getComputedStyle(this.$el)['transition-duration'].replace('s', '') * 1000
          }
          window.setTimeout(() => {
//            this.modalOpen = false
            document.body.className = document.body.className.replace(' modal-open', '')
            document.getElementsByTagName('body')[0].style.paddingRight = '0px'
          }, this.duration || 0)
        }
        /* 浮动footer */
        var self = this
        self.fakeFooterFlag = false
        self.$nextTick(function () {
          // modalFooterSlot = self.$slots.footer
          // if (self.fakeFooterFlagControl) {
          //   self.fakeFooterFlag = true
          // }
          // var footer = self.$el.getElementsByClassName('modal-footer')[0]
          // var fakeFooter = self.$el.getElementsByClassName('modal-footer-fake')[0]
          // fakeFooter.style.width = footer.offsetWidth + 'px'
          // var interval = setInterval(function () {
          //   showFakeFooterOrNot(footer, fakeFooter)
          // }, 400)
          // if (value) {
          //   console.log('show')
          //   self.$el.getElementsByClassName('modal')[0].onscroll = function () {
          //     showFakeFooterOrNot(footer, fakeFooter)
          //   }
          // } else {
          //   clearInterval(interval)
          //   self.$el.getElementsByClassName('modal')[0].onscroll = function () {}
          // }
          self.buildFakeFooter()
        })
        // function showFakeFooterOrNot (footer, fakeFooter) {
        //   if (window.innerHeight + 5 < footer.getBoundingClientRect().bottom) {
        //     self.fakeFooterFlag = true
        //   } else {
        //     self.fakeFooterFlag = false
        //   }
        // }
      }
    },
    methods: {
      updateModalHeight: _.debounce(function () {
        this.modalHeight = (this.$refs.dialog !== undefined ? this.$refs.dialog.scrollHeight : 0)
        this.updateCnt = 0
      }, 400),
      buildFakeFooter () {
        var self = this
        modalFooterSlot = self.$slots.footer
        if (self.fakeFooterFlagControl) {
          self.fakeFooterFlag = true
        }
        var footer = self.$el.getElementsByClassName('modal-footer')[0]
        var fakeFooter = self.$el.getElementsByClassName('modal-footer-fake')[0]
        fakeFooter.style.width = footer.offsetWidth + 'px'
        showFakeFooterOrNot(footer, fakeFooter)
        if (self.show) {
//          console.log('show')
          self.$el.getElementsByClassName('modal')[0].onscroll = function () {
            showFakeFooterOrNot(footer, fakeFooter)
          }
        } else {
          self.$el.getElementsByClassName('modal')[0].onscroll = function () {}
        }
//        console.log(self.$refs.modalSlotCopy)
        if (self.$refs.modalSlotCopy) {
          self.$refs.modalSlotCopy.$forceUpdate()
        }
        function showFakeFooterOrNot (footer, fakeFooter) {
          if (window.innerHeight + 5 < footer.getBoundingClientRect().bottom) {
            if (self.fakeFooterFlagControl) {
              self.fakeFooterFlag = true
            }
          } else {
            self.fakeFooterFlag = false
          }
        }
      },
      ok () {
        this.$emit('save', this.cancel)
      },
      cancel () {
        if (this.animated) {
          this.styleObject = {
            '-webkit-animation': 'fadeout 0.6s',
            'animation': 'fadeout 0.6s'
          }
          var self = this
          setTimeout(function () {
            self.$emit('closeModalWin')
            self.styleObject = {}
          }, 500)
        } else {
          this.$emit('closeModalWin')
        }
      },
      // 点击遮罩层
      clickMask () {
        if (!this.force) {
          this.cancel()
        }
      }
    }
  }

  function deepClone (createElement) {
    if (!modalFooterSlot || modalFooterSlot === '') return
    var vnodes = modalFooterSlot
    function cloneVNode (vnode) {
      const clonedChildren = vnode.children && vnode.children.map(vnode => cloneVNode(vnode))
      const cloned = createElement(vnode.tag, vnode.data, clonedChildren)
      cloned.text = vnode.text
      cloned.isComment = vnode.isComment
      cloned.componentOptions = vnode.componentOptions
      cloned.elm = vnode.elm
      cloned.context = vnode.context
      cloned.ns = vnode.ns
      cloned.isStatic = vnode.isStatic
      cloned.key = vnode.key
      return cloned
    }
    const clonedVNodes = vnodes.map(vnode => cloneVNode(vnode))
    console.log(clonedVNodes)
    return clonedVNodes
  }
</script>

<style scoped lang="less">
  @import '../../assets/less/variables.less';
  .modal-body{
    padding: 20px;
  }
  .modal-header{
    font-size: 18px;
    text-align: left;
    color: @black
  }
  .modal-header{
    padding: 20px;
    border-bottom-color: @gray;
  }
  .modal-header.headNoBorder {
    border-bottom: none;
  }
  .modal-footer.footerNoBorder{
    border-top: none;
  }
  .modal .modal-footer{
    font-size: 0;
    span,a,.btn{
      font-size: 14px;
    }
    .btn{
      min-width: 54px;
    }
    border-top-color: @gray;
  }
  .modal-footer.modal-footer-fake {
    position: fixed;
    bottom: 0;
    background: #fff;
    display: none;
  }
  .modal {
    display: block;
  }
  .modal-transition {
    transition: all .6s ease;
  }
  .nofade.modal-transition {
    transition: all 0s ease;
  }
  .modal-leave {
    /* 样式没什么用，但可以让根标签的transitionEnd生效，以去掉modal-leave */
    border-radius: 1px !important;
  }
  .modal-dialog {
    /*overflow: scroll;*/
  }
  /*.modal-dialog.vertical-center{
    transform: translateY(-50%);
    top:50%;
    margin: 0 auto !important;
  }*/
  .modal.vertical-center{
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align:center;
    -webkit-align-items:center;
    -ms-flex-align:center;
    -moz-align-items: center;
    align-items: center;
    -webkit-box-pack:center;
    -webkit-justify-content:center;
    -ms-flex-pack:center;
    -moz-justify-content: center;
    justify-content:center;
  }
  .modal-transition .modal-dialog, .modal-transition .modal-backdrop {
    transition: all .5s ease;
  }
  .nofade.modal-transition .modal-dialog, .nofade.modal-transition .modal-backdrop {
    transition: all 0s ease;
  }
  .modal-enter .modal-dialog, .modal-leave .modal-dialog {
    opacity: 0;
    // transform: translateY(-30%);
  }
  .modal-enter .modal-backdrop, .modal-leave .modal-backdrop {
    opacity: 0;
  }
  .isshow{
    visibility: visible;
    -webkit-animation: fadein 0.5s;
    animation: fadein 0.5s;
  }
  .notshow{
    visibility: hidden;
  }
  .nofade{
    animation: fadein 0s;
    -webkit-animation: fadein 0s;
  }

  .form-group {
    margin-bottom: 0;
  }
  .modal-footer{
    padding: 15px 20px;
  }
  .modal-open .modal{
    /*overflow-x: scroll;*/
  }
  .modal .modal-footer .btn + .btn{
    margin-left: 10px;
  }
  .vux-spinner-ios, .vux-spinner-ios-small {
    stroke: #69717d;
  }
  .vux-spinner {
    stroke: @gray;
    fill: @gray;
    vertical-align: middle;
    display: inline-block;
    margin: 30% 45%;
    width: 60px;
    height: 60px;
  }
  .remove-icon{
    float: right;
    /* font-size: 21px; */
    /* font-weight: bold; */
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
  }
  .close{
    font-size: 29px;
  }
  // .modal .modal-footer .btn + .btn {
  //   margin-left: 0;
  // }
</style>

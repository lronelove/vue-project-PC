<!-- 选择图片组件
props解释
  required: Boolean类型，非必填,为true时在左上角显示红色*符号，反之则不显示
  label: String类型，非必填,标签内容
  labelHeight: String类型，标签高度,默认为100px
  labelWidth: String类型，标签宽度,默认为30px(可通过调节该值的大小来调节这两个组件的间距)
  imgWidth: String类型，预览图片宽度,默认为300px
  imgHeight： String类型，预览图片高度,默认为400px
  name: String类型，input的name属性，用来区分不同的表单控件
  disabled: Boolean类型，用来使图片不能被删除
  maxImgSize: Number类型,用来限制图片的大小,单位为MB,
  showBigImage: Boolean类型，用来是否显示当点击图片的时候是否显示大图,默认为true(显示)

注意事项
  获取该图片的值通过v-model绑定来获得
  获取文件通过监听file事件来获得

事件流
  在图片加载成功时会发送file的事件流，并且把file文件发送出来，监听该事件即可接收该文件从而对其进行处理，同时会把v-model绑定的imgPath的值改变违法base64,从而把图片显示出来
  点击删除时会发送一个改变imgPath的事件流，从而做到使v-model的值变为空

基本功能与上传图片组件一致，现在只需要传图片地址，不需要在外面加域名
 -->
<template>
  <div class="upload-image" v-if="!camera" :class="{'flex-start': isTable}">
    <label v-if="label" class="img-label" :style="{width: labelWidth, height: labelHeight}"><span v-if="required">*</span>{{label}}</label>
    <div class="error-tip" :style="{'left': labelWidth}" v-if="errorTip.length>0">{{errorTip}}</div>
    <div class="upload-bottom border-color" :class="{borderClass: !disabled}" :style="{width: imgWidth, height: imgHeight}">
      <label :for="name" v-if="!imgPath">
        <!-- <input type="file" accept="image/png, image/jpg, image/jpeg, image/bmp, image/gif" :name="name"  :id="name"   @change="previewImg($event)"> -->
        <input type="file" accept="image/png, image/jpg, image/jpeg, image/bmp, image/gif" :name="name"  :id="name"   @click.prevent="previewImg">
        <div class="right border-color"></div>
        <div class="bottom border-color"></div>
      </label>
      <img v-if="imgPath" :src="imgPath" @click="showBigPhoto" @error="setValid(false)" @load="setValid(true)">
      <!-- <span v-if="imgPath && !disabled" class="glyphicon glyphicon-remove" style="color: rgb(197, 27, 27) ; position: absolute ; top:0 ; right: 0" @click.stop="delImg"></span> -->
      <div v-if="!disabled&&imgPath" class="update" @click="previewImg">
        <img src="../assets/image/refresh.png" alt="" />
      </div>
    </div>
    <div v-if="photoFlag" style="width: 100vw; height: 100vh;background: rgba(0, 0, 0, .3);display: flex;position: fixed;top: 0;left: 0;display: -webkit-flex;justify-content: center;align-items: center;z-index: 999;" @click="hidePhoto">
      <div style="position:relative;">
        <img :src="imgPath" style="max-height: 80vh;max-width: 80vw;">
        <remove-icon style="position:absolute;top:-50px;right: -60px;z-index:10;" iconType="circle" circleColor="gray" width="40px" padding="10px"/>
      </div>
    </div>
    <modal v-if="modal.show" :show="modal.show" :title="modal.title" @closeModalWin="closeModal" modalWidth="900px" modalMinWidth="900px" style="position: fixed;z-index: 2000;text-align:center;" ifOk="false" verticalType="flex">
      <div>
        <div class="cur-path">
          <a @click.prevent="getLastFiles" v-if="filePaths.length>1" style="padding-right: 15px">&lt;返回上一级</a>
          位置：
          <a v-for="(filePath, index) in filePaths" :key="index" @click.prevent="getCurFiles(filePath, index)">{{filePath}}</a>
        </div>
        <div style="width: 808px;margin: 0 auto;max-height: 500px;overflow: auto;" class="scrollbar">
          <div v-for="(file, index) in files" :key="index" class="icon-list">
            <div class="icon-ct">
              <img :src="file.fileType === '0' ? require('../assets/image/filefolder.png') : accessIconPath + file.iconPath" @click="selectFiles(file)" class="icon" :style="{'border-radius': file.fileType === '0' ? '' : '50%'}">
            </div>
            <div class="icon-name">{{file.iconName}}</div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from './CommonCompoent/modal.vue'
import RemoveIcon from 'components/RemoveIcon'
import {listIcon, listChildrenIcon} from 'api/index.js'
import {SHOW_TOAST} from 'store/types.js'
import util from '../utils/utils.js'

export default {
  props: {
    camera: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    labelWidth: {
      type: String,
      default: '109px'
    },
    labelHeight: {
      type: String,
      default: '30px'
    },
    imgWidth: {
      type: String,
      default: '64px'
    },
    imgHeight: {
      type: String,
      default: '64px'
    },
    value: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    maxImgSize: {
      type: Number,
      default: 1
    },
    showBigImage: {
      type: Boolean,
      default: true
    },
    isTable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      photoFlag: false,
      isValid: true,
      modal: {
        show: false,
        title: '选择图片'
      },
      curValue: this.value,
      files: [],
      filePaths: [],
      accessIconPath: util.paths.imgServerDoamin,
      errorTip: ''
    }
  },
  watch: {
    value (val) {
      this.curValue = val
    }
  },
  computed: {
    imgPath () {
      return this.value ? this.accessIconPath + this.value : this.value
    }
  },
  methods: {
    validate () {
      if (this.disabled) {
        return
      }
      this.errorTip = ''

      if (this.required && (this.curValue === '' || this.curValue === null)) {
        this.errorTip = '请选择' + this.label
        return true
      }
      return false
    },
    getRootFolder () {
      listIcon().then(res => {
        this.filePaths = []

        if (res.data.code === '0') {
          let data = res.data.data
          this.files = data.icons
          this.filePaths.push(data.filePath)
        } else {
          this.$store.dispatch(SHOW_TOAST, res.data.msg)
        }
      }, res => {
        this.$store.dispatch(SHOW_TOAST, '系统异常')
      })
    },
    getFolderFiles (filePath) {
      listChildrenIcon(filePath).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.files = data.icons
        } else {
          this.$store.dispatch(SHOW_TOAST, res.data.msg)
        }
      }, res => {
        this.$store.dispatch(SHOW_TOAST, '系统异常')
      })
    },
    /* 预览图片 */
    previewImg () {
      this.modal.show = true
      this.getRootFolder()
    },
    selectFiles (file) {
      if (file.fileType === '0') {
        this.filePaths.push('/' + file.iconName)
        this.getFolderFiles(file.iconPath)
      } else {
        this.closeModal()
        this.filePaths = []
        this.files = []
        this.curValue = file.iconPath
        this.$emit('input', this.curValue)
        this.$emit('update', this.curValue)
        this.validate()
      }
    },
    getCurFiles (filePath, index) {
      if (index === 0) {
        this.getRootFolder()
      } else {
        this.filePaths.splice(index + 1)
        filePath = this.filePaths.join('')
        this.getFolderFiles(filePath)
      }
    },
    getLastFiles () {
      if (this.filePaths.length > 1) {
        this.filePaths.pop()
        let filePath = this.filePaths.join('')
        this.getFolderFiles(filePath)
      } else {
        this.getRootFolder()
      }
    },

    /* 设置图片是否有效 */
    setValid (isValid) {
      this.isValid = isValid
    },
    showBigPhoto () {
      if (!this.isValid) {
        return false
      }
      this.showBigImage && (this.photoFlag = true)
    },

    /* 隐藏大图 */
    hidePhoto () {
      this.photoFlag = false
    },
    closeModal () {
      this.modal.show = false
    }
  },
  components: {
    Modal,
    RemoveIcon
  }
}
</script>

<style scoped lang="less">
@import '../assets/less/variables.less';

.img-label{
  color: @light-black;
  font-size: 14px;
  padding-top: 10px;
}
.upload-image {
  display: flex;
  display: -webkit-flex;
  // justify-content: center;
  // align-items: flex-start;
  position: relative;
}
.flex-start{
  justify-content: flex-start;
}
.upload-image label {
  line-height: 15px;
  font-weight: normal;
  text-align: left;
  margin: 0;
}
.upload-image label span {
  color: @primary-red;
}
.upload-bottom {
  position: relative;
  border-radius: 4px;
}
.borderClass {
  border: 1px dashed @extra-light-silver;
}
input[type='file']{
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
}
.upload-bottom label{
  padding: 0;
}
.upload-bottom img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.upload-bottom img:hover {
  cursor: pointer;
}
.bottom {
  position: absolute;
  width: 12px;
  height: 50%;
  border-top: 2px solid @silver;
  margin-top: -1px;
  top: 50%;
  left: 25px;
}
.right {
  position: absolute;
  height: 12px;
  width: 50%;
  left: 50%;
  top: 25px;
  border-left: 2px solid @silver;
  margin-left: -1px;
}
.border-bottom :hover .border-color {
  border-color: @primary-red;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075)
}
/*.border-color {
  border-color: #000000;
}*/
.upload-bottom span:hover {
  cursor: pointer;
}
.upload-bottom label {
  width: 100%;
  height: 100%;
}
.upload-bottom label:hover {
  cursor: pointer;
}
.upload-bottom:hover .bottom, .upload-bottom:hover .right{
  border-color: @light-silver;
}
.upload-bottom:active .bottom, .upload-bottom:active .right{
  border-color: @light-black;
}
.cur-path{
  text-align: left;
  padding-left: 40px;
}
.cur-path a:hover{
  text-decoration: underline;
  cursor: pointer;
}
.error-tip{
  position: absolute;
  top: 100%;
  min-width: 150px;
  color: @primary-red;
  font-size: 12px;
}
.icon-list{
  float: left;
  margin: 10px;
  width: 180px;
  // height: 90px;
  text-align:center;
  border: 1px solid @extra-light-silver;
  &:hover{
    background-color: @dark-white;
  }
  .icon-ct{
    width: 100%;
    height: 80px;
    margin-top: 10px;
    .icon{
      cursor: pointer;
      width: 80px;
      height: 80px;
    }
  }
  .icon-name{
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.upload-bottom{
  .update{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: rgba(0,0,0,.4);
    cursor: pointer;
    display: none;
  }
  &:hover{
    .update{
      display: block;
    }
  }
}
</style>


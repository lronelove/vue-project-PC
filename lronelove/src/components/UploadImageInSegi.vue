<!-- 上传图片组件
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
	index: 用来标记表格中对应的哪一行的UploadImage
注意事项
  获取该图片的值通过v-model绑定来获得
  获取文件通过监听file事件来获得

事件流
  在图片加载成功时会发送file的事件流，并且把file文件发送出来，监听该事件即可接收该文件从而对其进行处理，同时会把v-model绑定的value的值改变违法base64,从而把图片显示出来
  点击删除时会发送一个改变value的事件流，从而做到使v-model的值变为空

 -->
<template>
  <div class="upload-image">
    <label v-if="label" :style="{width: labelWidth, height: labelHeight}"><span v-if="required">*</span>{{label}}</label>
    <div class="upload-bottom border-color" :class="{borderClass: !disabled}" :style="{width: imgWidth, height: imgHeight}">
      <label :for="name" v-if="!value">
        <input type="file" accept="image/png, image/jpg, image/jpeg, image/bmp, image/gif" :name="name"  :id="name"   @change="previewImg($event)">
        <div class="right border-color"></div>
        <div class="bottom border-color"></div>
      </label>
      <img v-if="value" :src="value" @click="showBigPhoto">
      <span v-if="value && !disabled" class="glyphicon glyphicon-remove" style="color: rgb(197, 27, 27) ; position: absolute ; top:0 ; right: 0" @click.stop="delImg"></span>
    </div>
    <div v-if="photoFlag" style="width: 100vw; height: 100vh;background: rgba(0, 0, 0, .3);display: flex;position: fixed;top: 0;left: 0;display: -webkit-flex;justify-content: center;align-items: center;z-index: 999;" @click="hidePhoto">
      <img :src="value" style="max-height: 100vh;max-width: 100vw;">
    </div>
  </div>
</template>

<script>
import * as Types from '../../src/store/types'

export default {
  props: {
    index: '',
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
    }
  },
  data () {
    return {
      photoFlag: false
    }
  },
  methods: {

    /* 预览图片 */
    previewImg (event) {
      let reader = new window.FileReader()
      const self = this
      event.target.files[0] && reader.readAsDataURL(event.target.files[0])

      reader.onload = function () {
        console.info(event.target.files[0].size)

        if (event.target.files[0].size > (self.maxImgSize * 1024 * 1024)) {
          self.$store.dispatch(Types.SHOW_TOAST, '图片体积过大，最大上传限制为' + self.maxImgSize + 'MB')
        } else {
          self.$emit('file', [event.target.files[0], self.index])
          self.$emit('input', reader.result)
        }
      }
    },

    /* 删除图片 */
    delImg () {
      this.$emit('input', null)
    },

    /* 展示大图 */
    showBigPhoto () {
      this.showBigImage && (this.photoFlag = true)
    },
    
    /* 隐藏大图 */
    hidePhoto () {
      this.photoFlag = false
    }
  }
}
</script>

<style scoped>
.upload-image {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.upload-image label {
  line-height: 30px;
  font-weight: normal;
  text-align: left;
  margin: 0;
}
.upload-image label span {
  color: red;
}
.upload-bottom {
  position: relative;
  border-radius: 10px;
}
.borderClass {
  border: 1px dashed #000000;
}
input[type='file']{
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
}
.upload-bottom img {
  width: 100%;
  height: 100%;
}
.upload-bottom img:hover {
  cursor: pointer;
}
.bottom {
  position: absolute;
  width: 90%;
  height: 50%;
  border-top: 1px dashed #000000;
  top: 50%;
  left: 5%;
}
.right {
  position: absolute;
  height: 90%;
  width: 50%;
  left: 50%;
  top: 5%;
  border-left: 1px dashed #000000;
}
.border-bottom :hover .border-color {
  border-color: red;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075)
}
.border-color {
  border-color: #000000;
}
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
.upload-bottom label:hover .border-color {
  border-color: #2ce82c;
}
</style>

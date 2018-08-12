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

注意事项
  获取该图片的值通过v-model绑定来获得
  获取文件通过监听file事件来获得

事件流
  在图片加载成功时会发送file的事件流，并且把file文件发送出来，监听该事件即可接收该文件从而对其进行处理，同时会把v-model绑定的value的值改变违法base64,从而把图片显示出来
  点击删除时会发送一个改变value的事件流，从而做到使v-model的值变为空

 -->
<template>
  <div class="upload-image" v-if="!camera">
    <label v-if="label" class="img-label" :style="{width: labelWidth, height: labelHeight}"><span v-if="required">*</span>{{label}}</label>
    <div v-if="value || !disabled" class="upload-bottom border-color" :class="{borderClass: !disabled}" :style="{width: imgWidth, height: imgHeight}" @dragover.prevent="dragOver($event)" @drop.prevent="previewImg($event, $event.dataTransfer.files[0])">
      <label :for="name" v-if="!value && !disabled">
        <input v-if="multiple" type="file" accept="image/png, image/jpg, image/jpeg, image/bmp, image/gif" :name="name"  :id="name"   @change="previewMultipleImg($event, $event.target.files)" multiple="multiple">
        <input v-else type="file" accept="image/png, image/jpg, image/jpeg, image/bmp, image/gif" :name="name"  :id="name"   @change="previewImg($event, $event.target.files[0])">
        <div :style="{height: addHeight}" class="right border-color"></div>
        <div :style="{width: addWidth}" class="bottom border-color"></div>
      </label>
      <img v-if="value" :src="imgPath()" @click="showBigPhoto" @error="setValid(false)" @load="setValid(true)">
      <div v-if="value && !disabled" class="update" @click.stop="delImg">
        <img src="../assets/image/trash.png" alt="" >
      </div>
    </div>
    <span v-else style="padding-top: 10px;line-height: 15px;">无</span>
    <section :style="{left: labelWidth}" class="error-tip" v-if="errorTip.length > 0">{{ errorTip }}</section>
    <div v-if="photoFlag" style="width: 100vw; height: 100vh;background: rgba(0, 0, 0, .3);display: flex;position: fixed;top: 0;left: 0;display: -webkit-flex;justify-content: center;align-items: center;z-index: 999;" @click="hidePhoto">
      <!-- <remove-icon style="position:absolute;top:20px;right: 20px;z-index:10;" iconType="circle" circleColor="gray" width="40px" padding="10px"/>
      <img :src="value" style="max-height: 100vh;max-width: 100vw;"> -->
      <div style="position:relative;">
        <img :src="imgPath()" style="max-height: 80vh;max-width: 80vw;">
        <remove-icon style="position:absolute;top:-50px;right: -60px;z-index:10;" iconType="circle" circleColor="gray" width="40px" padding="10px"/>
      </div>
    </div>
  </div>
</template>

<script>
  import * as Types from '../../src/store/types'
  import RemoveIcon from 'components/RemoveIcon'

  export default {
    components: {
      RemoveIcon
    },
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
        default: '90px'
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

      /* 图片的默认前缀 */
      imgPrefix: {
        type: String,
        default: ''
      },

      /* 在读取图片成功时是否会把值传出来的参数 */
      deliverFlag: {
        type: Boolean,
        default: true
      },
      maxImgSize: {
        type: Number,
        default: 5
      },
      showBigImage: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        photoFlag: false,
        isValid: true,
        errorTip: ''
      }
    },
    watch: {
      value () {
        this.validate()
      }
    },
    computed: {
      addWidth () {
        return (parseInt(this.imgWidth) * 0.1875 + 'px')
      },
      addHeight () {
        return (parseInt(this.imgHeight) * 0.1875 + 'px')
      }
    },
    methods: {
      validate () {
        this.errorTip = ''
        if (this.required && !this.disabled && !this.value) {
          this.errorTip = '请选择' + (this.label || '图片')
          return true
        }
        return false
      },

      /* 图片路径 */
      imgPath () {
        return this.imgPrefix + this.value
      },

      /* 预览图片 */
      previewMultipleImg (event, files) {
        const self = this
        console.warn(files)
        if (files.length > 0) {
          for (let key in files) {
            if (files[key].size > (self.maxImgSize * 1024 * 1024)) {
              self.$store.dispatch(Types.SHOW_TOAST, `第${+key + 1}张图片体积过大，最大上传限制为${self.maxImgSize}MB`)
              return
            }
          }
        }
        this.$emit('file', files)
      },
      previewImg (event, file) {
        let reader = new window.FileReader()
        const self = this
//      console.warn(files)
        file && reader.readAsDataURL(file)
        reader.onload = function () {
          if (file.size > (self.maxImgSize * 1024 * 1024)) {
            self.$store.dispatch(Types.SHOW_TOAST, '图片体积过大，最大上传限制为' + self.maxImgSize + 'MB')
          } else {
            self.$emit('file', file)

            if (self.deliverFlag) {
              self.$emit('input', reader.result)
            }
          }
        }
      },

      /* 设置图片是否有效 */
      setValid (isValid) {
        this.isValid = isValid
      },

      /* 删除图片 */
      delImg () {
        this.$emit('input', '')
        this.$emit('delete')
      },

      /* 展示大图 */
      showBigPhoto () {
        if (!this.isValid) {
          return false
        }
        this.showBigImage && (this.photoFlag = true)
      },

      /* 隐藏大图 */
      hidePhoto () {
        this.photoFlag = false
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../assets/less/variables.less';
  
  .error-tip {
    position: absolute;
    top: 100%;
    color: #f74444;
    font-size: 12px;
    text-align: left;
    min-width: 110px;
  }
  .img-label{
    color: @light-black;
    font-size: 14px;
    padding-top: 10px;
  }
  .upload-image {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;
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
    height: 50%;
    border-top: 2px solid @silver;
    margin-top: -1px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
  .right {
    position: absolute;
    width: 50%;
    left: 50%;
    top: 50%;
    transform: translateY(-50%);
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

<!--
props解释
    required: Boolean类型，选填，默认为false,若为true则左上方显示一个红色的*
    label: String类型，选填，label的字段
    holder: String类型，选填，input里面的提示字段

slot说明
    匿名slot: 分布在打开的界面里面包含了一个匿名的slot

事件流说明
    当点击Modal的保存事件时，会发送save的事件流，监听这个事件，即可对这个事件进行操作
-->
<template>
  <div class="select-item">
    <label v-if="label"><span v-if="required">*</span>{{ label }}</label>
      <div class="input-group">
        <input type="text" class="form-control" :placeHolder="holder" disabled>
        <span class="input-group-btn">
        <button 
          class="btn btn-default form-control" 
          style="border-top-right-radius: 5px;border-bottom-right-radius: 5px" 
          type="button" 
          @click="showModal" 
          >请选择
        </button>
        </span>
      </div>
    <modal :title="title" :show="modal.show" okText="确定" ifCancel="false" @closeModalWin="closeModalWin" @save="save">
      <slot></slot>
    </modal>
  </div>
</template>

<script>
import Modal from './CommonCompoent/Segimodal.vue'

export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    holder: {
      type: String
    },
    title: {
      type: String

    }
  },
  data () {
    return {
      modal: {
        flag: true,
        show: false
      }
    }
  },
  components: {
    Modal
  },
  methods: {

    /* 打开modal */
    showModal () {
      this.modal.show = true
    },

    /* 关闭modal */
    closeModalWin () {
      this.modal.show = false
    },
    
    /* 保存事件 */
    save () {
      this.$emit('save')
    }
  }
}
</script>
<style scoped>
.select-item {
  width: 490px;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}
.select-item label {
  width: 109px;
  height: 43px;
  line-height: 43px;
  font-weight: normal;
  position: inherit;
  float: left;
  margin: 0;
  text-align: left;
}
.select-item label span {
  color: red;
}
.choose {
  display: inline-block;
  height: 100%;
}
.choose input {
  height: 43px;
  width: 314px;
}
.choose button {
  width: 67px;
  height: 43px;
}
.form-control{
  position: initial;
  height: 43px;
  border-radius: 5px;
}
.input-group-btn{
  position: initial;
}
.input-group-btn>.btn {
  position: initial;
}
</style>

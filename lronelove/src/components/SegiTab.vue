<!-- 组件说明
props解释
    id: String类型或者Number类型,必填项，当点击增加或者删除时发送的id
    title: String类型，选填项，该标签的标题
    tabWidth: String类型，选填项，该标签的宽度,默认为父元素的18%,最小宽度为220px
    tabHeight: String类型，选填项，该标签的高度,默认为自适应高度,最小高度为200px
    add: Boolean类型，选填项，默认为false,若为true则显示为中间一个十字形的增加操作
    editIcon: String类型，选填项，编制按钮的图标样式,默认为一支笔的样式
    deleteIcon: String类型,选填项，删除按钮的样式,默认为一个垃圾桶的样式

slot声明
    除了title以为的下方所有内容均为slot，使用过程中一般建议覆盖掉这个匿名slot

下面是为了赶业务而写下的默认slot
    icon: String类型，选填
    iconSmall: String类型，选填
    sort: String类型, 选填
    growthLowThreshold: String类型,选填
    growthHighThreshold：String类型,选填
    growthDailyLimit: String类型，选填
    xccDailyLimit：String类型，选填

事件流说明
    点击编辑时发送edit的事件流，点击删除时发送的del事件流,发送的对象的属性有(id: 传进去的id, event: 对应的事件名称)
    点击新增时发送add的事件流,不发送对象
-->
<template>
  <div class="segi-tab" :class="{backClass: add}" :style="{ width: tabWidth, height: tabHeight}">
    <div v-if="add" class="back" @click="sentEvents('add')">
      <div class="level-right"></div>
      <div class="back-bottom"></div>
    </div>
    <div v-else>
      <div class="middle">
        <span :class="editIcon" style="cursor: pointer" @click="sentEvents('edt', id)"></span>
        <span>{{ title }}</span>
        <span :class="deleteIcon" style="cursor: pointer" @click="sentEvents('del', id)"></span>
      </div>
      <div class="bottom">
        <slot>
          <div class="unit">
            <span class="glyphicon glyphicon-film"><em>等级小图标</em></span>
            <img :src="iconSmall" style="width: 30px; height: 30px">
          </div>
          <div class="unit">
            <span class="glyphicon glyphicon-picture"><em>等级图标</em></span>
            <img :src="icon" style="width: 30px; height: 30px">
          </div>
          <div class="unit">
            <span class="glyphicon glyphicon-hourglass"><em>成长值范围</em></span>
            <span>{{growthLowThreshold}} -- {{growthHighThreshold}}</span>
          </div>
          <div class="unit">
            <span class="glyphicon glyphicon-arrow-up"><em>成长值上限</em></span>
            <span>{{growthDailyLimit}}</span>
          </div>
          <div class="unit">
            <span class="glyphicon glyphicon-hand-up"><em>寻常币上限</em></span>
            <span>{{xccDailyLimit}}</span>
          </div>
          <div class="unit">
            <span class="glyphicon glyphicon-globe"><em>排序</em></span>
            <span>{{sort}}</span>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: [Number, String]
      },
      editIcon: {
        type: String,
        default: 'glyphicon glyphicon-edit'
      },
      deleteIcon: {
        type: String,
        default: 'glyphicon glyphicon-trash'
      },
      tabWidth: {
        type: String
      },
      tabHeight: {
        type: String
      },
      title: {
        type: String
      },
      icon: {
        type: String,
        default: '--'
      },
      iconSmall: {
        type: String,
        default: '--'
      },
      sort: {
        type: [Number, String],
        default: '--'
      },
      growthLowThreshold: {
        type: [Number, String],
        default: '--'
      },
      growthHighThreshold: {
        type: [Number, String],
        default: '--'
      },
      growthDailyLimit: {
        type: [Number, String],
        default: '--'
      },
      xccDailyLimit: {
        type: [Number, String],
        default: '--'
      },
      /* 增加的样式 */
      add: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      /* 发送事件给父组件 */
      sentEvents (event, id) {
        this.$emit(event, {id: id, event: event})
      }
    }
  }
</script>

<style scoped>
.segi-tab {
  margin: 0 10px 20px 10px;
  border: 1px solid #ddd;
  width: 18%;
  min-width: 220px;
  min-height: 200px;
  border-radius: 10px;
  -webkit-border-radius: 10px;
}
.middle {
  border-bottom: 1px dashed #ccc;
  display: flex;
  display: -webkit-flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0;
}
.middle span {
  font-size: large;
}
.bottom {
  padding: 10px;
}
.unit {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}
.segi-tab {
  display: inline-block;
  transition-duration: 0.3s;
  transition-property: transform;
  -webkit-tap-highlight-color: transparent;
  transform: translateZ(0);
  box-shadow: 0 0 1px transparent;
  color:#333;
}
.segi-tab:before {
  pointer-events: none;
  position: absolute;
  content: '';
  top: 100%;
  left: 5%;
  height: 10px;
  width: 90%;
  opacity: 0;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 80%);
  transition-duration: 0.3s;
  transition-property: transform opacity;
}
.segi-tab:hover {
  transform: translateY(-6px);
  animation-name: hover;
  animation-duration: 1.5s;
  animation-delay: 0.3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.segi-tab:hover:before {
  opacity: .4;
  transform: translateY(6px);
  animation-name: hover-shadow;
  animation-duration: 1.5s;
  animation-delay: .3s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
.level-right {
  width: 1px;
  height: 90%;
  position: relative;
  left: 50%;
  top: 5%;
  margin: 0 !important;
  border-left: 1px dashed #000000;
}
.back-bottom {
  width: 90%;
  height: 50%;
  border-top: 1px dashed #000000;
  position: absolute;
  top: 50%;
  left: 5%;
  margin: 0;
}
.back {
  width: 100%;
  height: 100%;
  position: relative;
}
.backClass {
  border-style: dashed;
  border-color: #000000;
  cursor: pointer;
}
</style>

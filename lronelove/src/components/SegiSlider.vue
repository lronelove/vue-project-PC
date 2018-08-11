<!--SegiSlider组件：滑块-->
<!--
父组件:
<segi-slider :sliderShow="slider.show">
....
</segi-slider>
父组件中编写slider打开/关闭函数：
toggleSlider () {
  this.slider.show = !this.slider.show
}
-->
<template>
  <div :class="sliderShow ? 'slider-show' : 'slider-hide'" class="slider">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'segi-slider',
  props: {
    // sliderShow
    sliderShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.slider {
  transition: all .5s ease-in-out;
  -webkit-transition: all .5s ease-in-out;
  -moz-transition: all .5s ease-in-out;
  overflow:hidden;
}
.slider-show {
  max-height: 500px !important;
}
.slider-hide {
  max-height:0 !important;
}
</style>

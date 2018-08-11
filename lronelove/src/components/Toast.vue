<template>
  <!--<transition name="fade">-->
    <div :class="{ show: show }" id="snackbarWarp" >
      <div class="toastContainer">
        <span>{{ msg }}</span>
      </div>
    </div>
  <!--</transition>-->
</template>
<script>
  export default{
    data () {
      return this.$store.state.global.tips
    }
  }
</script>
<style scoped>
.toastContainer {
  display: inline-block;
  position: relative;
  /*bottom: 10%;*/
  text-align: center;
  z-index: 99999;
  background: rgba(6, 6, 6, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
}
.toastContainer span {
  font-size: 150%;
  color: white;
}
#snackbarWarp {
  z-index: 99999;
  width: 100%;
  position: fixed;
  bottom:130px;
  visibility: hidden;
}
#snackbarWarp.show {
  visibility: visible;
  -webkit-animation: fadeinToast 0.5s, fadeoutToast 0.5s 2.5s;
  animation: fadeinToast 0.5s, fadeoutToast 0.5s 2.5s;
}

/*.fade-enter-active, .fade-leave-active {*/
  /*transition: all .8s*/
/*}*/
/*.fade-enter, .fade-leave-active {*/
  /*bottom: 0*/
/*}*/
</style>

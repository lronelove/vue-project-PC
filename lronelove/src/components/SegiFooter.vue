<template>
  <div class="footer">
    <p>{{copyRight}}
      <a rel="nofollow" style="text-decoration: none;color:#666666" target="_blank" href="http://www.miibeian.gov.cn">
        粤ICP备14025730号-3</a>&nbsp;
    </p>
  </div>
</template>

<script>
export default{
  props: {
    copyRight: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.footer {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    font-size: 15px;
    color: #666666;
}
</style>

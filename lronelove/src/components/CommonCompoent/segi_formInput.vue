/**
* Created by Richard Chao on 2016/12/19.
*/
<template>
  <div clas="segi-input">
    <!--<span v-if="outerLabel" style="width: auto"><i v-if="required">*</i>{{ outerLabel }}</span>-->
    <label class="input segi_formInput" :style="{ width: inputWidth}">
      <span><i v-if="required">*</i>{{ outerLabel }}</span>
      <input type="text" class="form-control" :name="inputName" :id="inputId" :style="{ borderRadius: borderRadius}">
      <span ><i :class="labelIcon"></i>{{labelTxt}}</span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'segi_formInput',
    props: {
      required: {
        type: Boolean,
        default: false
      },
      outerLabel: {
        type: String,
        default: ''
      },
      inputName: {
        type: String,
        default: ''
      },
      inputId: {
        type: String,
        default: ''
      },
      inputWidth: {
        type: String,
        default: '100%'
      },
      labelTxt: {
        type: String,
        default: 'empty'
      },
      labelIcon: {
        type: String,
        default: 'glyphicon glyphicon-th-list'
      },
      borderRadius: {
        type: String,
        default: '0px'
      }
    },
    data () {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .segi_formInput {
    margin:0 20px
  }
  .segi_formInput span{
    width: 85px;
    /*height: 20px;*/
    float: left;
    text-align: center;
    position: initial;
    left: 5px;
    padding-right: 6px;
    margin-top: -25px;
    margin-left: 5px;
    border-right-width: 1px;
    border-right-style: solid;
    border-right-color: #BDBDBD;
    z-index: 20 !important;
    font-size: 13px;
    color: #A2A2A2;
  }
  .segi_formInput i:before{
    margin-right: 3px!important;
    margin-top: 3px!important;
    /*padding: 0;*/
    box-sizing: content-box;
  }
  .segi_formInput input{
    padding-left: 110px;
    position: initial;
    display: block;
    font-weight: 400;
    border-color: rgb(189, 189, 189);
    width: 100%;
    z-index: 10;
    border-radius: 0;
    max-width: 600px;
  }
  /*input[type="text"]:focus{*/
  /*border-color: rgb(50, 118, 177);*/
  /*}*/
 .checkbox input:focus + i,.input input:focus,.radio input:focus + i,.select select:focus,.textarea textarea:focus,.toggle input:focus + i {
    border-color: rgb(50, 118, 177);
   box-shadow: none;
  }
 .checkbox input:hover + i,.input input:hover,.radio input:hover + i,.select select:hover,.textarea textarea:hover,.toggle input:hover + i {
    border-color: rgb(50, 118, 177);
   box-shadow: none;
 }
</style>

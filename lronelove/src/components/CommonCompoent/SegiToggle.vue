<!--This can be called like
                <toggle labelTxt="当前状态" borderStyle="''" v-if="isEdit" style="display: block;margin:20px 10px" @toggle="toggleInModal" v-model="itemForModal.status" />
In which:
toggleInModal (val) {
        console.log('Toggle to: ' + val)
        if (val) {
          this.itemForModal.status = true
        } else {
          this.itemForModal.status = false
        }
      },
--------------------this need further refinement------------------------------
-->
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="form-group toggleOnOff" style="" :style="borderStyle">
    <label class="control-label" v-if="labelTxt !== ''"  :style="labelStyle"><span v-if="required">*</span>{{labelTxt}}</label>
    <div class="clearfix" style="float: left;display: block">
      <div class="" :style="toggleStyle">
        <label class="switch" style="width:60px" :class="{notAllow: disabled}">
          <input type="checkbox" class="switch-input" ref="input" v-model="toggle" :disabled="disabled">
          <span class="switch-label" :data-on="onText" :data-off="offText" @click.stop="switchCheckBox" :class="{notAllow: disabled}"></span>
          <span class="switch-handle" @click.stop="switchCheckBox"></span>
        </label>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    props: {
      labelTxt: {
        type: String,
        default: ''
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      required: {
        type: Boolean,
        default: false
      },
      labelStyle: {
        type: Object,
        default: () => {
          return {
            float: 'left',
            paddingTop: '3px'
          }
        }
      },
      which: {
        type: String,
        default: null
      },
      borderStyle: {
        type: String,
        default: 'border-top: 1px solid #BDBDBD;border-bottom: 1px solid #BDBDBD;'
      },
      toggleStyle: {
        type: Object,
        default: () => {
          return {
            width: '60px'
          }
        }
      },
      value: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        toggle: ''
      }
    },
    watch: {
      value (val) {
        console.log(val)
        if (this.value) {
          this.toggle = true
        } else {
          this.toggle = false
        }
      }
    },
    mounted () {
      console.log('mounted' + this.value)
      if (this.value) {
        this.toggle = true
      } else {
        this.toggle = false
      }
    },
    methods: {
      switchCheckBox () {
        var self = this
        setTimeout(function () {
          self.$emit('input', self.toggle)
          if (self.toggle) {
            self.$emit('toggle', {val: true, which: self.which})
          } else {
            self.$emit('toggle', {val: false, which: self.which})
          }
        }, 0)
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../../assets/less/variables.less';
  .toggleOnOff{
    margin: 10px;
    /*padding: 20px 0 10px;*/
    height: 30px;
  }
  .container > .switch {
    display: block;
    margin: 12px auto;
  }
  .control-label{
    color: @light-black;
    float: left;
    padding-top: 3px;
    width: 109px;
    text-align: left;
    font-weight: normal;
  }
  .control-label span {
    color: red;
  }
  .switch {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 66px;
    height: 20px;
    padding: 3px;
    background-color: white;
    border-radius: 18px;
    box-shadow: inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    /*background-image: -webkit-linear-gradient(top, #eeeeee, white 25px);*/
    /*background-image: -moz-linear-gradient(top, #eeeeee, white 25px);*/
    /*background-image: -o-linear-gradient(top, #eeeeee, white 25px);*/
    /*background-image: linear-gradient(to bottom, #eeeeee, white 25px);*/
  }
  .switch-input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .switch-label {
    position: relative;
    display: block;
    height: inherit;
    font-size: 10px;
    text-transform: uppercase;
    background: #eceeef;
    border-radius: inherit;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15);
    -webkit-transition: 0.15s ease-out;
    -moz-transition: 0.15s ease-out;
    -o-transition: 0.15s ease-out;
    transition: 0.15s ease-out;
    -webkit-transition-property: opacity background;
    -moz-transition-property: opacity background;
    -o-transition-property: opacity background;
    transition-property: opacity background;
  }
  .switch-label:before, .switch-label:after {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
    line-height: 1;
    -webkit-transition: inherit;
    -moz-transition: inherit;
    -o-transition: inherit;
    transition: inherit;
  }
  .switch-label:before {
    content: attr(data-off);
    right: 8px;
    color: #aaa;
    text-shadow: 0 1px rgba(255, 255, 255, 0.5);
  }
  .switch-label:after {
    content: attr(data-on);
    left: 8px;
    color: white;
    text-shadow: 0 1px rgba(0, 0, 0, 0.2);
    opacity: 0;
  }
  .switch-input:checked ~ .switch-label {
    background: @primary-blue;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2);
  }
  .switch-input:checked ~ .switch-label:before {
    opacity: 0;
  }
  .switch-input:checked ~ .switch-label:after {
    opacity: 1;
  }
  .switch-handle {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    background-image: -webkit-linear-gradient(top, white 40%, #f0f0f0);
    background-image: -moz-linear-gradient(top, white 40%, #f0f0f0);
    background-image: -o-linear-gradient(top, white 40%, #f0f0f0);
    background-image: linear-gradient(to bottom, white 40%, #f0f0f0);
    -webkit-transition: left 0.15s ease-out;
    -moz-transition: left 0.15s ease-out;
    -o-transition: left 0.15s ease-out;
    transition: left 0.15s ease-out;
  }
  .switch-handle:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -6px 0 0 -6px;
    width: 12px;
    height: 12px;
    background: #f9f9f9;
    border-radius: 6px;
    box-shadow: inset 0 1px rgba(0, 0, 0, 0.02);
    background-image: -webkit-linear-gradient(top, #eeeeee, white);
    background-image: -moz-linear-gradient(top, #eeeeee, white);
    background-image: -o-linear-gradient(top, #eeeeee, white);
    background-image: linear-gradient(to bottom, #eeeeee, white);
  }
  .switch-input:checked ~ .switch-handle {
    left: 38px;
    box-shadow: -1px 1px 5px rgba(0, 0, 0, 0.2);
  }
  .switch-green > .switch-input:checked ~ .switch-label {
    background: #4fb845;
  }
  .switch.notAllow{
    cursor: not-allowed;
  }
  .switch > .switch-input:checked ~ .switch-label.notAllow {
    background: #a3d3ea;
  }

</style>

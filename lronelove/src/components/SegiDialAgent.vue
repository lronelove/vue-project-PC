<template>
    <div>
      <div class="segi-dail-panel" v-show="show">
        <a><span class="closeBtn" @click="setHide"></span></a>
        <input placeholder="请输入电话号码" v-model.number.trim="number" type="number">
        <button @click="dial"
                style="background: #6fafe4;box-shadow: none;border: none;height: 30px;width: 44px;margin-left: 6px;">拨打
        </button>
        <div style="width: 250px;height: 70px;display: block;">
          <button @click="hangoff"
                  style="    width: 100px;margin-top: 22px;float: left;height: 28px;border: none;background-color: #3ada91;box-shadow: none;font-size: 14px;margin-left: 2px;">
            摘机
          </button>
          <button @click="hangup"
                  style="    width: 100px;margin-top: 22px;float: right;height: 28px;border: none;background-color: #f66968;box-shadow: none;font-size: 14px;margin-right:14px;">
            挂机
          </button>
        </div>
        <div style="min-height: 40px;" v-show="turnable">
          <button @click="getSeatAll"
                  style="    width: 50px;margin-top: 2px;float: left;height: 28px;border: none;background-color: #3ada91;box-shadow: none;font-size: 14px;margin-left: 2px;">
            转接
          </button>
          <div class="Segi_Select" style="float:left;" v-show="availableSeatArr.length>0">
            <select id="Segi_Widget_Seat" style="float: left;margin: 5px;" v-model="selectedAvailableSeat">
              <option v-for="(seat, index) in availableSeatArr" :key="index" v-bind:value="seat.StaffId">
                {{ seat.TerminalId }}
              </option>
            </select>
            <button style="width: 50px;margin-top: 2px;height: 28px;border: none;background-color: #3ada91;box-shadow: none;font-size: 14px;margin-left: 2px;" @click="transferCall">确定</button>
          </div>
        </div>
        <div class="dail-panel" v-show="version!='1.0.0.0'&&version!='1.0.0.1'">
          <div class="buttons">
            <button @click="dialone" class="default" value="1">1</button>
            <button @click="dialone" class="default" value="2">2</button>
            <button @click="dialone" class="default" value="3">3</button>
            <button @click="dialone" class="default" value="4">4</button>
            <button @click="dialone" class="default" value="5">5</button>
            <button @click="dialone" class="default" value="6">6</button>
            <button @click="dialone" class="default" value="7">7</button>
            <button @click="dialone" class="default" value="8">8</button>
            <button @click="dialone" class="default" value="9">9</button>
            <button @click="dialone" class="default" value="*">*</button>
            <button @click="dialone" class="default" value="0">0</button>
            <button @click="dialone" class="default" value="#">#</button>
          </div>
        </div>
      </div>
      <div id="Segi_Widget" @click="toggleShow" :class="{on: isConnected}"
           style="z-index:1000;display: inline-block;position: fixed;bottom: 20px;right: 5px;width: 20px;height: 20px;border-radius: 25px;"></div>
    </div>
</template>
<script>
  import Notify from 'title-notify'

  const Event = {
    login: 'LOGIN',
    logout: 'LOGOUT',
    onCallIn: 'CALLIN',
    onCallOut: 'CALLOUT',
    dial: 'DIAL',
    dialone: 'DIALONE',
    hangup: 'HANGUP',
    hangoff: 'HANGOFF',
    getSeatAll: 'GETSEATALL',
    transferCall: 'TRANSFERCALL',
    pop: 'POP'
  }
  let time = {
    start: 0,
    end: 0
  }

  export default{
    props: {
      host: {
        type: String,
        default: 'localhost:8081'
      },
      turnable: {
        type: Boolean,
        defalut: false
      },
      terminalId: {
        required: true
      },
      staffId: {
        required: true
      },
      version: {
        required: false
      },
      areaCode: {
        required: false
      },
      codeLen: {
        required: false
      },
      cornetLen: {
        required: false
      },
      preNum: {
        required: false
      },
      preDial: {
        required: false
      },
      isExtern: {
        required: false
      },
      status: {
        required: false
      },
      loginCb: {
        required: false,
        type: Function
      },
      logoutCb: {
        required: false,
        type: Function
      },
      dialCb: {
        required: false,
        type: Function
      },
      dialoneCb: {
        required: false,
        type: Function
      },
      hangupCb: {
        required: false,
        type: Function
      },
      hangoffCb: {
        required: false,
        type: Function
      },
      callInCb: {
        required: false,
        type: Function
      },
      callOutCb: {
        required: false,
        type: Function
      }
    },
    data () {
      return {
        show: true,
        number: '',
        isConnected: false,
        isError: false,
        agent: null,
        socket: null,
        iN: null,
        availableSeatArr: [],
        selectedAvailableSeat: null
      }
    },
    methods: {
      setShow () {
        this.show = true
      },
      toggleShow () {
        this.show = !this.show
      },
      setHide () {
        this.show = false
      },
      init () {
        var _this = this
        this.socket = new window.WebSocket('ws://' + (this.host || 'localhost'))
        this.socket.onopen = function () {
          _this.isConnected = true
          _this.isError = false
          time.start = new Date().getTime()
          var loginPara = {
            Event: Event.login,
            StaffId: _this.staffId.toString(),
            Time: new Date().format('yyyy-MM-dd hh:mm:ss'),
            TerminalId: _this.terminalId,
            area_code: _this.areaCode,
            code_len: _this.codeLen,
            cornet_len: _this.cornetLen,
            pre_num: _this.preNum,
            pre_dial: _this.preDial,
            is_extern: _this.isExtern,
            status: _this.status
          }

          // 关闭Socket....
          // socket.close()
          if (_this.isConnected) {
            _this.socket.send(JSON.stringify(loginPara))
          }
          var timer = setInterval(function () {
            var hb = {
              Event: 'HB',
              StaffId: _this.staffId.toString()
            }
            if (_this.isConnected) {
              _this.socket.send(JSON.stringify(hb))
            } else {
              clearInterval(timer)
            }
          }, 1000 * 60)
          // 上线1000*60
        }
        this.socket.onmessage = function (event) {
          console.log('message comming!' + event.data)
          window.focus()
          var temp = JSON.parse(event.data)

          switch (temp.Event) {
            case Event.onCallIn: _this.onCallIn(temp); break// 被动
            case Event.onCallOut: _this.onCallOut(temp); break// 被动
            case Event.login: _this.loginResponse(temp); break// 主动
            case Event.logout: _this.logoutResponse(temp); break// 主动
            case Event.dial: _this.dialResponse(temp); break// 主动
            case Event.dialone: _this.dialoneResponse(temp); break// 主动
            case Event.hangup: _this.hangupResponse(temp); break// 主动
            case Event.hangoff: _this.hangoffResponse(temp); break// 主动
            case Event.getSeatAll: _this.getSeatAllResponse(temp); break// 主动
            case Event.transferCall: _this.transferCallResponse(temp); break// 主动
            default: console.log('Heart beat ' + event)
          }
        }
        // 监听Socket的关闭
        this.socket.onclose = function (event) {
          _this.isConnected = false

          if (_this.isError) {
            return
          }
          time.end = new Date().getTime()
          console.log('本次连接持续时间: ' + (time.end - time.start) / 1000)
          _this.reconnectJob()
        }
        this.socket.onerror = function (err) {
          _this.isConnected = false
          _this.isError = true
          time.end = new Date().getTime()
          console.log('error' + err)
          console.log('本次连接持续时间: ' + (time.end - time.start) / 1000)
          _this.reconnectJob()
        }
      },
      loginResponse: function (sParam) {
        if (sParam.code === '0') {
          console.log('login callback success!')
        }
        this.loginCb && this.loginCb(sParam)
      },
      logoutResponse: function (sParam) {
        if (sParam.errorCode === '0') {
          console.log('logout callback success!')
        }
        this.loginCb && this.loginCb(sParam)
      },
      dialResponse: function (sParam) {
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          console.log('dial callback success!')
        } else if (sParam.errorCode === '1') {
          window.alert('该盒子不支持软摘机,请先硬摘机')
        } else {
          window.alert('忙音')
        }
        this.dialCb && this.dialCb(sParam)
      },
      dialoneResponse: function (sParam) {
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          console.log('dial callback success!')
        } else {
          window.alert('出小差了')
        }
        this.dialoneCb && this.dialoneCb(sParam)
      },
      hangupResponse: function (sParam) {
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          console.log('hangup callback success!')
        }
        this.hangupCb && this.hangupCb(sParam)
      },
      hangoffResponse: function (sParam) {
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          console.log('hangoff callback success!')
        }
        this.hangoffCb && this.hangoffCb(sParam)
      },
      getSeatAllResponse: function (sParam) {
        var _this = this
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          this.availableSeatArr = sParam.data.filter(function (v) {
            return v.status === '0' && v.dnd === '0' && (v.TerminalId !== _this.terminalId)
          })
        
          if (this.availableSeatArr.length < 1) {
            window.alert('当前没有空闲分机')
            return
          }
        } else {
          console.log('get Seats error')
        }
      },
      transferCallResponse: function (sParam) {
        if (sParam.errorCode === '0' || sParam.errorCode === 'E0') {
          window.alert('转接成功')
        } else {
          window.alert('转接失败')
        }
      },
      onCallIn: function (sParam) {
        this.number = sParam.CallId
        window.focus()

        this.iN.notify({
          title: '新通知',
          body: sParam.CallId + '来电了'
        }, function () {
          window.focus()
        }).player()
        this.callInCb && this.callInCb(sParam)
      },
      onCallOut: function (sParam) {
        this.number = sParam.CallId
        window.focus()

        // 主动呼出事件调用跟呼入事件同样的处理逻辑
        this.callOutCb && this.callOutCb(sParam)
      },
      dial: function () {
        if (!this.isConnected) {
          window.alert('请保证盒子服务连接正常')
        }
        console.log(this.number)
        var _this = this
        var para = {
          Event: 'DIAL',
          StaffId: _this.staffId,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss'),
          DTMF: _this.number,
          TerminalId: _this.terminalId
        }
        _this.socket.send(JSON.stringify(para))
      },
      dialone: function (event) {
        console.log(event.target.value)

        if (!this.isConnected) {
          window.alert('请保证盒子服务连接正常')
        }
        var _this = this
        var para = {
          Event: 'DIALONE',
          StaffId: _this.staffId,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss'),
          DTMF: event.target.value,
          TerminalId: _this.terminalId
        }
        _this.socket.send(JSON.stringify(para))
      },
      hangup: function () {
        if (!this.isConnected) {
          window.alert('请保证盒子服务连接正常')
        }
        var _this = this
        var para = {
          Event: 'HANGUP',
          StaffId: _this.staffId,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
        _this.socket.send(JSON.stringify(para))
      },
      hangoff: function () {
        if (!this.isConnected) {
          window.alert('请保证盒子服务连接正常')
        }
        var _this = this
        var para = {
          Event: 'HANGOFF',
          StaffId: _this.staffId,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
        _this.socket.send(JSON.stringify(para))
      },
      getSeatAll: function () {
        var _this = this
        var para = {
          Event: 'GETSEATALL',
          StaffId: _this.staffId,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
        _this.socket.send(JSON.stringify(para))
      },
      transferCall: function () {
        var _this = this
        // var staffId = $('#Segi_Widget_Seat').val()
        console.log('selectedAvailableSeat' + this.selectedAvailableSeat)
        var para = {
          Event: 'TRANSFERCALL',
          StaffId: _this.staffId,
          TerminalId: _this.terminalId,
          Phone: this.selectedAvailableSeat,
          Time: new Date().format('yyyy-MM-dd hh:mm:ss')
        }
        _this.socket.send(JSON.stringify(para))
      },
      reconnectJob () {
        var a = window.confirm('与盒子服务连接断开,重新连接？')
        
        if (a === true) {
          this.init()
        }
      }
    },
    mounted () {
      console.log(Event)
      this.iN = new Notify().init({
        effect: 'flash',
        interval: 500,
        message: '有消息拉！',
        audio: {
          file: 'mp3/ring.mp3'
        }
      })
      this.init()
    }
  }
</script>
<style scoped>
#Segi_Widget{
    box-shadow: 0px 8px 14px 1px rgba(230, 209, 209, 0.68), inset -1px -6px 12px 0.1px #866b4b;
    cursor: pointer;
    background: #ef4d2f;
}
#Segi_Widget.on{
  background: #2ce82c;
}
.segi-dail-panel {
    width: 306px;
    height: auto;
    position: fixed;
    bottom: 30px;
    right: 18px;
    padding: 40px 50px 40px 40px;
    text-align: center;
    border-radius: 10px 10px 0px 10px;
    background-color: #fdfeff;
    border: 1px solid #aaa;
    /* margin: 20px auto; */
    /* padding: 10px; */
    /* box-shadow: 0 8px 14px 1px rgba(0, 0, 0, 0.68), inset -1px -6px 12px 0.1px #89847e; */
    z-index: 999;
    opacity: 0.95;
}
.segi-dail-panel button{
    padding: 5px;
    border-radius: 5px;
    background: #308656;
    color: white;
    box-shadow: 0 1px 0 0 #aee8bb, inset -1px -2px 1px 1px #ffffff;
}
.segi-dail-panel button, .segi-dail-panel button:hover,.segi-dail-panel button:active,.segi-dail-panel button:visited {
    text-decoration: none !important;
    outline: none !important;
}
.segi-dail-panel input{
    height: 30px;
    border-radius: 5px;
     float: left;
    width: 160px;
    padding: 3px 8px;
    background-color: #f4f4f4;
    box-shadow: none;
    border-style: ridge;
    font-size: 14px;
}
.closeBtn{
    height: 20px;
    width: 24px;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
}

.closeBtn:before, .closeBtn:after{
    content: '';
    height: 2px;
    width: 20px;
    display: block;
    background: #676464;
    border-radius: 10px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 10px;
    position: absolute;
    top: 16px;
    left: 0px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
}

.closeBtn:after{transform:rotate(45deg);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-o-transform:rotate(45deg);-ms-transform:rotate(45deg);}
.buttons{
    margin-top: 15px;
    display:table;
}
.buttons button{
    width: 50px;
    padding: 5px;
    margin: 5px;
    height: 38px;
    border-radius: 10px;
    color: white;
    font-size: 20px;
}
.buttons .default{
    background-color: #2b2828;
}
.buttons .functional{
    background:#115650;
}
button, button:hover, button:active, button:visited {
    text-decoration: none !important;
    outline: none !important;
}
</style>

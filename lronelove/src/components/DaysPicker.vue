<!--props参数释义
required: boolean类型，用来表示是否为必填项，如果为true则在标签左上角显示一个红色的*
label: String类型，用来显示该组件的label标签
list: Array类型，里面是31个元素为boolean型的数组,
pattern: String类型，三种模式，对应的是[day,week,month](默认为按月模式(month))
-->
<template>
  <div class="days-picker">
    <div  :class="{ center: pattern === 'month'}" class="left" >
      <label v-if="label" :class="{ down: pattern === 'week'}"><span v-if="required">*</span>{{ label}}</label>
      <p v-if="pattern === 'month'">单列全选/反选</p>
    </div>
    <div class="right" v-if="pattern === 'week' || pattern === 'month'">
      <div class="top">
        <span><input type="checkbox" :checked="all" @change="allChoose"/>全选/反选</span>
        <div class="bottom-table">
          <div class="unit" v-for="(item, index) in days" :key="index">
            <input type="checkbox" v-model="item.checked" @change="checkDates(index)">
            <p v-if="pattern === 'week'">{{ item.name }}</p>
          </div>
          <div class="date-unit" v-if="pattern === 'month'" v-for="(item, index) in dates" :key="index">
            <input type="checkbox" v-model="item.checked">
            <p>{{ index + 1 }}日</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="day-right">
      <div class="block" style="display: inline-block;margin: 0 2rem;">
        <date-picker
          holder="选择日期"
          label="起始工作日期"
          :dateValue="dateValue"
          inputWidth="300px"
        >
        </date-picker>
      </div>
      <div class="day-bottom">
        工作
        <select v-model.trim="work">
          <option v-for="d in 7" :key="d">{{ d }}天</option>
        </select>
        休息
        <select v-model.trim="rest">
          <option v-for="d in 7" :key="d">{{ d }}天</option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import DatePicker from '../components/DatePicker'
  export default {
    props: {
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String
      },
      day: {
        type: Array
      },
      date: {
        type: Array
      },
      pattern: {
        type: String,
        default: 'month'
      },
      work: {
        type: String,
        default: '1'
      },
      rest: {
        type: String,
        default: '1'
      }
    },
    components: {
      DatePicker
    },
    data () {
      return {
        all: false,
        dateValue: '',
        dates: [],
        days: []
      }
    },
    created () {
      if (this.date) {
        this.dates = _.cloneDeep(this.date)
      } else {
        for (let i = 0; i < 31; i++) {
          let temp = {
            checked: false
          }
          this.dates.push(temp)
        }
      }
      if (this.day) {
        this.days = _.cloneDeep(this.day)
      } else {
        this.days = [
          {name: '星期一', checked: false},
          {name: '星期二', checked: false},
          {name: '星期三', checked: false},
          {name: '星期四', checked: false},
          {name: '星期五', checked: false},
          {name: '星期六', checked: false},
          {name: '星期日', checked: false}
        ]
      }
    },
    methods: {
      allChoose () {
        this.all = !this.all

        for (let i = 0; i < this.days.length; i++) {
          if (this.all) {
            this.$set(this.days, i, {checked: true})
          } else {
            this.$set(this.days, i, {checked: false})
          }
        }

        for (let i = 0; i < this.dates.length; i++) {
          if (this.all) {
            this.$set(this.dates, i, {checked: true})
          } else {
            this.$set(this.dates, i, {checked: false})
          }
        }
      },
      checkDays (index) {
        this.$set(this.days, (index % 7), {checked: true})

        for (let j = index; j < this.dates.length; j = j + 7) {
          if (!this.dates[j].checked) {
            this.$set(this.days, (j % 7), {checked: false})
            break
          }
        }
      },
      checkDates (index) {
        for (let j = index; j < this.dates.length; j = j + 7) {
          this.$set(this.dates, j, this.days[index])
        }
      }
    }
  }
</script>

<style scoped>
  input {
    width: 1.5rem;
    height: 1.5rem;
  }
  .left label {
    font-weight: normal;
    position: initial;
    margin: 10px 0;
  }
  .down {
    top: 3rem;
  }
  .day-right {
    display: inline-block;
  }
  p {
    margin: 0;
  }
  .top {
    margin: 10px 0;
  }
  .top > span > input {
    /*position: relative;*/
    /*top: 3px;*/
    vertical-align: text-top;
  }
  .top > span {
    /*margin-left: 8rem;*/
  }
  .days-picker {
    width: 480px;
    border-radius: 20px;
    border: 2px solid gray;
    display: inline-block;
    position: initial;
  }
  .left {
    display: inline-block;
    width: 100px;
    text-align: left;
  }
  .center {
    text-align: center;
    vertical-align: top;
  }
  .left span {
    color: red;
  }
  .right {
    display: inline-block;
    width: 28rem;
  }
  .unit {
    width: 4rem;
    height: 4rem;
    display: inline-flex;
    display: -webkit-inline-flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    border: 1px dashed lightgray;
  }
  .unit p {
    font-size: smaller;
  }
  .date-unit {
    width: 4rem;
    height: 4rem;
    display: inline-flex;
    display: -webkit-inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .bottom-table {
    text-align: left;
  }
  .day-bottom {
    margin: 10px 0;
  }
  select {
    margin: 0 1rem;
    height: 2rem;
    min-width: 2rem;
  }
</style>

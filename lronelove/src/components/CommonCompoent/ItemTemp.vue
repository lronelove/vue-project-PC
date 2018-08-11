/**
* Created by Richard Chao on 2016/12/19.
*/
<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <li class="item" v-bind:class="[DFS_color,bold,show]">
    <div
      v-bind:class="[bold]"
      @click="toggle"
      @dblclick="changeType">
      {{model.name}}
      <span v-if="isFolder">[{{open ? '-' : '+'}}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="model in model.children"
        :model="model">
      </item>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'item',
    props: {
      model: Object
    },
    data: function () {
      return {
        open: false,
        searchtxt: '',
        DFS_color: 'white',
        show: 'showIt'
      }
    },
    computed: {
      bold: function () {
        if (this.isFolder) {
          return 'bold'
        } else {
          return ''
        }
      },
      isFolder: function () {
        return this.model.children &&
          this.model.children.length
      },
      searchtxt: function () {
        return this.$parent.searchtxt
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      changeType: function () {
        if (!this.isFolder) {
//          console.log(this.$parent)
          Vue.set(this.model, 'children', [])
          this.addChild()
          this.open = true
        }
      },
      addChild: function () {
        this.model.children.push({
          name: 'new stuff'
        })
      }
//      flip: function (color) {
//        this.DFS_color = color
//      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hideIt{
    opacity: 0.5;
    display: none;
    color: #f2f2f2;
  }
  .showIt{
    opacity: 1;
    color: black;
  }
</style>

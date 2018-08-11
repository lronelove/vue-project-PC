/**
* Created by Richard Chao on 2016/12/19.
*/
<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="treeview">
    <p>(You can double click on an item to turn it into a folder.)</p>
    <div>
      <input type="text" placeholder="search" v-bind:value="searchtxt" v-on:input="updateValue($event.target.value)"/>

    </div>
    <ul id="demo">
      <item
        class="item"
        :model="treeData"
        v-model="searchtxt">
      </item>
    </ul>
  </div>
</template>


<script>
  import Item from './ItemTemp.vue'
  export default {
    name: 'treeview',
    props: {},
    data () {
//      console.log(this)
      return {
        treeData: {
          name: 'My Tree',
          children: [
            { type: 'file', name: 'hello' },
            { type: 'file', name: 'wat' },
            {
              type: 'folder',
              name: 'child folder',
              children: [
                {
                  type: 'folder',
                  name: 'child folder',
                  children: [
                    { type: 'file', name: 'hello' },
                    { type: 'file', name: 'wat' }
                  ]
                },
                { type: 'file', name: 'hello' },
                { type: 'file', name: 'chao' },
                {
                  type: 'folder',
                  name: 'child folder',
                  children: [
                    { type: 'file', name: 'hello' },
                    { type: 'file', name: 'wat' }
                  ]
                }
              ]
            },
            { type: 'file', name: 'hello' },
            { type: 'file', name: 'wat' },
            {
              type: 'folder',
              name: 'chao',
              children: [
                {
                  type: 'folder',
                  name: 'richard',
                  children: [
                    { type: 'file', name: 'hello' },
                    { type: 'file', name: 'wat' }
                  ]
                },
                { type: 'file', name: 'richard' },
                { type: 'file', name: 'wat' },
                {
                  type: 'folder',
                  name: 'child folder',
                  children: [
                    { type: 'file', name: 'richard' },
                    { type: 'file', name: 'wat' }
                  ]
                }
              ]
            }
          ]
        },
        searchtxt: ''
      }
    },
    components: { Item },
    methods: {
      updateValue: function (value) {
        this.initDFS(this.$children[0])
        this.searchtxt = value
        // DFS start
        var root = this
        for (var i = 0; i < this.$children.length; i++) {
          this.DFS(this.$children[i], root)
//          console.log(root)
        }
        root.$children[0].show = 'showIt'
        // DFS end
        this.$emit('input', this.searchtxt)
      },
      DFS: function (self, root) {
        self.DFS_color = 'grey'
        if (self.model.name.search(this.searchtxt) !== -1) {
          self.show = 'showIt'
//          console.log(self.model.name + ' & ' + this.searchtxt)
//          console.log(self.model.name.search(this.searchtxt))
//          console.log(self.$el)
          this.bubbleUp(self, root)
          this.bubbleDown(self)
        } else {
          self.show = 'hideIt'
        }
        if (self.$children.length !== 0) {
          for (var j = 0; j < self.$children.length; j++) {
            if (self.$children[j].DFS_color === 'white') {
              this.DFS(self.$children[j], root)
            }
          }
        }
        self.DFS_color = 'black'
      },
      bubbleUp: function (self, root) {
        if (self.$parent.$el !== root.$el) {
          self.$parent.show = 'showIt'
//          console.log(self.$parent.$el)
//          console.log(self.$parent)
          this.bubbleUp(self.$parent, root)
        } else {}
      },
      bubbleDown: function (self) {
        if (self.$children.length !== 0) {
          for (var i = 0; i < self.$children.length; i++) {
            self.$children[i].show = 'showIt'
            self.$children[i].DFS_color = 'black'
//          console.log(self.$parent.$el)
//          console.log(self.$parent)
            this.bubbleDown(self.$children[i])
          }
        } else {}
      },
      initDFS: function (self) {
        self.DFS_color = 'white'
        if (self.$children.length > 0) {
          for (var i = 0; i < self.$children.length; i++) {
            this.initDFS(self.$children[i])
//          console.log(root)
          }
        } else {}
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item {
    cursor: pointer;
    font-family: monospace;
    color: #999;
  }
  .item.folder {
    color: #333;
  }
  ul {
    padding-left: 1em;
    list-style-type: circle;
  }
  .treeview{
    text-align: left;
  }
</style>

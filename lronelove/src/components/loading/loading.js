import Vue from 'vue'
import Loading from './loading.vue'

Loading.newInstance = () => {
  const Instance = new Vue({
    render (h) {
      let vnode = h(Loading, {
        props: {
          fix: true,
          fullscreen: true
        }
      })
      return h('div', {
        'class': 'sg_loading-wrapper'
      }, [vnode])
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const loading = Instance.$children[0]

  return {
    show () {
      loading.visible = true
    },
    remove (cb) {
      loading.visible = false
      setTimeout(() => {
        loading.$parent.$destroy()
        let loadingWrap = document.querySelector('.sg_loading-wrapper')
        if (loadingWrap) {
          document.body.removeChild(loadingWrap)
        }
        cb()
      }, 500)
    }
  }
}

export default Loading

import Loading from './loading.js'

let loadingInstance

function getLoadingInstance () {
  loadingInstance = loadingInstance || Loading.newInstance()
  return loadingInstance
}

Loading.show = function () {
  let instance = getLoadingInstance()
  instance.show()
}
Loading.hide = function () {
  if (!loadingInstance) return
  const instance = getLoadingInstance()
  instance.remove(() => {
    loadingInstance = null
  })
}

export default Loading

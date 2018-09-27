// 这里存放api接口的路径
import config from './../config'
const serverUrl = config.serverUrl

// 用来拼接完整的接口地址
function concat(serverUrl = serverUrl, url) {
    return serverUrl + ulr
}

// api代表接口地址的对象
export const api = {
    'transfer': {
        'list': concat('api/transfer/list')
    },
    'bussiness': {
        'fire': {
            'list': concat('api/fire/lits'),
            'detail': concat('api/fire/detail')
        }
    }
}
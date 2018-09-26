import axios from 'axios'
import api from './../api/index'

export function getTransferList(params) {
    return new Promise( (resolve, reject) => {
        axios.post(api.transfer.list, params).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

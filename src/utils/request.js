import axios from 'axios'
import {
	MessageBox,
	Message
} from 'element-ui'
import store from '@/boots/store'
import {
	getToken
} from '@/utils/auth'

//创建实例
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
	timeout: 5000 // 超时时间
})

//请求拦截
service.interceptors.request.use(
	config => {
		if (store.getters.token) {
			config.headers['Authorization'] = getToken()
		}
		if(store.getters.headerContent) {
			// config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
			config.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
			config.transformRequest = [function (data) {
			    let ret = ''
			    for (let it in data) {
			      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			    }
			    return ret
			}]
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response.data

		if (res.code !== 0) {
			//datau有数据特例
			// if(res.data&&res.data.length>0){
			// 	return res
			// }
			Message({
				message: res.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			})
			if (res.code === 401 || res.code === 50008 || res.code === 50012 || res.code === 50014) {
				MessageBox.confirm('用户已失效请重新登陆',
					'Confirm logout', {
						confirmButtonText: '去登陆',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
					store.dispatch('user/resetToken').then(() => {
						location.reload()
					})
				})
			}
			return Promise.reject(new Error(res.message || 'Error'))
		} else { 
			return res
		}
	},
	error => {
		console.log('err' + error)
		Message({
			message: error.message,
			type: 'error',
			duration: 5 * 1000
		})
		return Promise.reject(error)
	}
)

export default service

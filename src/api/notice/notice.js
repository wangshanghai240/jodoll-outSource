import { post ,get ,put} from '../request'

export default {
	post(url, data) {
		return new Promise((res, rej) => {
			post(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	get(url, data) {
		return new Promise((res, rej) => {
			get(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	put(url,data) {
		return new Promise((res, rej) => {
			put(url,data).then(putRes => {
				res(putRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
}

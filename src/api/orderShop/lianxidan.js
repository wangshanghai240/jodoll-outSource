import { post ,get} from '../request'

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
	}
}

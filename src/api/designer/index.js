import { get , post , del2 , put} from '../request'

export default {
	columns: [{
		label: '编号',
		prop: 'no',
		align: 'center',
	},{
		label: '姓名',
		prop: 'name',
		align: 'center',
	},{
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
	},],
	options:{
		selection: true,
		width: 50,
		tHeight:'77vh',
		headerInput: true,
		index: true,
		labelIndex: '序号',
	},
	post(url, data) {
		return new Promise((res, rej) => {
			post(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	get(url, data, time, isBody) {
		return new Promise((res, rej) => {
			get(url, data, time, isBody).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	delete(url,id){
		return new Promise((res, rej) => {
			del2(url,id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
}
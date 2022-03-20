import { post ,get,put} from '../request'

export default {
	columns: [{
		label: '辅料名称',
		prop: 'goodsName',
		align: 'center',
	}, {
		label: '辅料编号',
		prop: 'goodsCode',
		align: 'center'
	}, {
		label: '总数量',
		prop: 'total',
		slot:true,
		align: 'center',
	}, {
		label: '已发数',
		prop: 'issuedQuantity',
		slot:true,
		align: 'center',
	}, {
		label: '未发数',
		prop: 'usendQuantity',
		slot:true,
		align: 'center',
	}],
	options: {
		selection: true,
		tHeight: '40vh',
		headerInput: true
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
	get(url, data) {
		return new Promise((res, rej) => {
			get(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	put(url,data){
		return new Promise((res,rej)=>{
			put(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	}
}

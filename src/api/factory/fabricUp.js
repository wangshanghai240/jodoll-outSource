import { post ,get,put} from '../request'

export default {
	columns: [{
		label: '面料名称',
		prop: 'name',
		align: 'center',
	}, {
		label: '面料编号',
		prop: 'code',
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
		prop: 'unsentQuantity',
		slot:true,
		align: 'center',
	}, {
		label: '库存数',
		prop: 'inventoryQuantity',
		slot:true,
		align: 'center',
	}],
	options: {
		selection: true,
		tHeight: '55vh', 
		isExpand:true,
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

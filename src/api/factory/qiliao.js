import { post ,get,put} from '../request'

export default {
	typeoptions:[{
		value: 1,
		label: '面料'
	},{
		value: 2,
		label: '辅料'
	}],
	columns: [{
		label: '类型',
		prop: 'type',
		slot:true,
		align: 'center',
	},{
		label:'名称',
		prop:'name',
		align:'center',
	},{
		label: '编号',
		prop: 'code',
		align: 'center',
	}, {
		label: '数量',
		prop: 'demandNum',
		align: 'center',
	}, {
		label:'库存余量',
		prop:'inventoryQuantity',
		align:'center'
	},{
		label: '需求',
		prop: 'isComplete',
		slot:true,
		align: 'center',
	}],
	options: {
		width: 50,
		tHeight:'50vh',
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

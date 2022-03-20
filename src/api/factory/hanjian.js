import { post ,get,put} from '../request'

export default {
	columns: [{
			label: '大类',
			prop: 'sxmc',
			align: 'center',
		}, {
			label: '供应商',
			prop: 'ghsmc',
			align: 'center'
		}, {
			label: '品名',
			prop: 'spmc',
			align: 'center',
		}, {
			label: '货品编码',
			prop: 'spdm',
			align: 'center',
		}, {
			label: '厂家货号',
			prop: 'gchh',
			align: 'center',
		}, {
			label: '面料号1',
			prop: 'mldm',
			align: 'center',
		}, {
			label: '面料号2',
			prop: 'bh2',
			align: 'center',
		}, {
			label: '成分',
			prop: 'cf',
			align: 'center',
		}, {
			label: '下单数量',
			prop: 'sl',
			align: 'center',
		}, {
			label: '含税单价',
			prop: 'gcbj',
			align: 'center',
		}, {
			label: '工厂回复交货期',
			prop: 'djyl',
			align: 'center',
		}, {
			label: '要求货期',
			prop: 'yqhq',
			align: 'center',
		}, {
			label: '备注',
			prop: 'sjwcsj',
			align: 'center',
	}],
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

import { get ,post} from '../request'

export default {
	columns: [{
		label: '节点名称',
		prop: 'nodeName',
		align: 'center',
	},{
		label: '标准完成时间',
		prop: 'timeExpected',
		align: 'center',
	},{
		label: '实际完成时间',
		prop: 'timeActual',
		align: 'center',
	},{
		label: '差异(天)',
		prop: 'difference',
		align: 'center',
	}],
	options: {
		tHeight:'70vh',
		headerWidth: '150',
		offHeight:true,
	},
	get(url,params){
		return new Promise((res,rej)=>{
			get(url,params).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
	},
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(postRes => {
				res(postRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
}
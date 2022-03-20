import { get } from '../request'

export default {
	columns: [{
		label: '名称',
		prop: 'nodeName',
		align: 'center',
	},{
		label: '开始时间',
		prop: 'startingTime',
		align: 'center',
	},{
		label: '结束时间',
		prop: 'finishTime',
		align: 'center',
	}],
	options:{
		width: 50,
		tHeight:'40vh',
	},
	get(url,params){
		return new Promise((res,rej)=>{
			get(url,params).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
	}
}
import { get , post , del , put , upload} from '../request'

export default {
	columns:[{
			label:'商品名称',
			prop:'goodsCode',
			align: 'center',
		},{
			label:'商品编号',
			prop:'goodsId',
			align: 'center',
		},{
			label:'加工厂',
			prop:'supplier',
			align: 'center',
		},{
			label:'交期',
			prop:'supplyTime',
			align: 'center',
		},{
			label:'物流状态',
			prop:'expressStatus',
			align: 'center',
		},{
			label:'需求数量',
			prop:'demandNum',
			align: 'center',
		},
	],
	options: {
		width: 50,
		tHeight: '40vh',
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
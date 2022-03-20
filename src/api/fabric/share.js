import { get , post , del , put} from '../request'

export default {
	columns:[{
			label:'甲方编码',
			prop:'materialCode',
			align: 'center',
		},{
			label:'乙方成品',
			prop:'productNo',
			align: 'center',
		},{
			label:'成份',
			prop:'component',
			align: 'center',
		},{
			label:'用毛',
			prop:'wool',
			align: 'center',
		},{
			label:'纱支/密度',
			prop:'weaving',
			align: 'center',
		},{
			label:'克重(g/m)',
			prop:'gram',
			align: 'center',
		},{
			label:'有效幅宽(cm)',
			prop:'clothWidth',
			align: 'center',
		},{
			label:'数量(米)',
			prop:'purchaseNum',
			align: 'center',
		},{
			label:'含税含运费价格(元/米)',
			prop:'amount',
			align: 'center',
		},{
			label:'到货日期',
			prop:'deliveryTime',
			align: 'center',
		}
	],
	options: {
		index: true,
		labelIndex: '序号',
		sunmmary:true,
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
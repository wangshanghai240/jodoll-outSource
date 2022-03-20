import { get , post , del , put, upload} from '../request';

const sortOptions = [{
	label:'较低',
	value:1
},{
	label:'普通',
	value:2
},{
	label:'紧急',
	value:3
},{
	label:'非常紧急',
	value:4
}];
const isPurchaseOptions = [{
	label:'否',
	value:0
},{
	label:'是',
	value:1
}];
const statusOptions = [{
	label:'待处理',
	value:1
},{
	label:'已完成',
	value:2
}];
export default {
	sortOptions:sortOptions,
	isPurchaseOptions:isPurchaseOptions,
	statusOptions:statusOptions,
	columns:[{
			label:'单据编号',
			prop:'invoicesNo',
			align: 'center',
			width: 145
		},{
			label:'辅料编号',
			prop:'ingredientsCode',
			align: 'center',
        	width: 130
		},{
			label:'辅料名称',
			prop:'ingredientsName',
			align: 'center',
        	width: 280
		},{
        	label:'原始需求',
        	prop:'designNum',
        	align: 'center',
        	width: 90
    	},{
			label:'上浮需求',
			prop:'demandNum',
			align: 'center',
        	width: 90
		},{
			label:'库存量',
			prop:'stock',
			align: 'center',
        	width: 90
		},{
			label:'预投量',
			prop:'preNum',
			align: 'center',
            width:70
		},{
			label:'备料量',
			prop:'preparationNum',
			align:'center',
			width:70
		},
		{
			label:'应采数量',
			prop:'needPurchaseNum',
			align: 'center',
        	width: 90
		},{
			label:'采购数量',
			prop:'purchaseNum',
			align: 'center',
        	width: 90
		},{
        	label:'单位',
        	prop:'unit',
        	align: 'center',
        	width: 60
   		 },{
			label:'优先级',
			prop:'sort',
			width:100,
			align: 'center',
			slot:true,
        	width: 70
		}, {
			label:'创建时间',
			prop:'createTime',
			align: 'center',
        	width: 165
		},{
			// MoonXu 2021-3-8
			label:'更新时间',
			prop:'updateTime',
			align: 'center',
        	width: 165
		},{
			label:'合同交期',
			prop:'contractDeliveryTime',
			align: 'center',
        	width: 100
		},{
			label:'交货日期',
			prop:'deliveryTime',
			align: 'center',
        	width: 100
		},{
			label:'状态',
			prop:'status',
			align: 'center',
			slot:true,
        	width: 90
		},{
			label:'供应商',
			prop:'supplierName',
			align: 'center',
        	width: 250
		},{
        	label:'单价',
        	prop:'price',
        	align: 'center',
        	width: 70
    	}
	],
	options: {
		selection: true,
		tHeight:'70vh',
		isExpand:true,
		headerInput: true,
		headerWidth: '380',
		isFixedOperateColumn : 'right'
	},
	expandColumns:[
		{
			label:'订货会',
			prop:'sourceName',
			align: 'center',
		},{
			label:'商品名称',
			prop:'goodsName',
			align: 'center',
		},{
			label:'商品编号',
			prop:'goodsCode',
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
			label:'商品数量',
			prop:'goodsNum',
			align: 'center',
		},{
			label:'单件用量',
			prop:'onePiece',
			align: 'center',
		},{
			label:'需求数量',
			prop:'demandNum',
			align: 'center',
		},
		{
			label:'备料量',
			prop:'preparationNum',
			align:'center'
		}
	],
	expandOptions: {
		tHeight:'350px',
		headerInput: true,
	},
	fabricOptions(list){
		return new Promise((res,rej)=>{
			let {data} = list;
			let newData = data.reduce((total, current)=>{
				let {ingredientsName,ingredientsCode} = current;
				total.push({label:ingredientsName+"("+ingredientsCode+")",value:ingredientsCode})
				return total
			},[])
			res(newData)
		})
	},
	selectionId(obj){
		return new Promise((res,rej)=>{
			let newArr = []
			for(let key in obj){
				let isNum = key.indexOf('Num');
				if(isNum==-1){
					newArr.push({id:key,purchaseNum:obj[key],isPurchase: 1})
				}
			}

			// let newData = Object.keys(obj).reduce((total, current)=>{
			// 	let {id} = current;
			// 	total.push({id:id,purchaseNum:num,isPurchase: 1})
			// 	return total
			// },[])
			res(newArr)
		})
	},
	get(url,data){
		return new Promise((res,rej)=>{
			get(url,data).then(success => {
				res(success)
			}).catch(error => {
				rej(error)
			})
		})
	},
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(success=>{
				res(success)
			}).catch(error=>{
				rej(error)
			})
		})
	},
	put(url,data){
		return new Promise((res,rej)=>{
			put(url,data).then(success=>{
				res(success)
			}).catch(error=>{
				rej(error)
			})
		})
	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	},
}

import { get , post , del , put , upload} from '../request'

export default {
	sortOptions:[{
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
	}],
	isPurchaseOptions:[{
		label:'否',
		value:0
	},{
		label:'是',
		value:1
	}],
	statusOptions:[{
		label:'待处理',
		value:1
	},{
		label:'已完成',
		value:2
	}],
	columns:[{
			label:'单据',
			prop:'invoicesNo',
			align: 'center',
			width: 140,
		},{
			label:'面料编号',
			prop:'materialCode',
			align: 'center',
			width: 125,
		},{
			label:'面料名称',
			prop:'materialName',
			align: 'center',
        	width: 130,
		},{
        	label:'幅宽',
        	prop:'clothWidth',
        	align: 'center',
        	width:60
	    },{
        	label:'成分',
        	prop:'component',
			overflow:true,
        	align: 'center',
        	width: 200,
   		},
		// {
        	// label:'设计用量',
        	// prop:'contractNum',
        	// align: 'center',
		// },
		{
        	label:'需求数量',
        	prop:'demandNum',
        	align: 'center',
            width:90
		},{
        	label:'库存量',
        	prop:'stock',
        	align: 'center',
            width:70
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
            width:90
		},{
			label:'采购数量',
			prop:'purchaseNum',
			align: 'center',
            width:90
		},{
			label:'优先级',
			prop:'sort',
			align: 'center',
			slot:true,
            width:70
		},{
			label:'创建时间',
			prop:'createTime',
			overflow:true,
			align: 'center',
            width:165
		},{
			// MoonXu 2021-3-8
			label:'更新时间',
			prop:'updateTime',
			overflow:true,
			align: 'center',
            width: 165
		},{
			label:'交期',
			prop:'deliveryTime',
			align: 'center',
            width:100
		},{
			label:'状态',
			prop:'status',
			align: 'center',
			slot:true
		},{
        	label:'单价',
        	prop:'price',
        	align: 'center',
        	width:60
		},{
        	label:'供应商',
        	prop:'supplierName',
        	align: 'center',
        	width: 180,
    	}
	],
	options: {
		selection: true,
		tHeight:'70vh',
		isExpand:true,
		headerInput: true,
		headerWidth: '380',
        isFixedOperateColumn: "right"
	},
	expandColumns:[
		{
			label:'订货会',
			prop:'orderMeetingName',
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
		headerInput: true,
		tHeight:'350px',
	},
	fabricOptions(list){
		return new Promise((res,rej)=>{
			let {data} = list;
			let newData = data.reduce((total, current)=>{
				let {materialName,materialCode} = current;
				total.push({label:materialName,value:materialCode})
				return total
			},[])
			res(newData)
		})
	},
	selectionId(obj){
		return new Promise((res,rej)=>{
			// let newData = list.reduce((total, current)=>{
			// 	let {id} = current;
			// 	if(Number(obj[id])){
			// 		total.push({id:id,purchaseNum:Number(obj[id]),isPurchase: 1})
			// 	}
			// 	return total
			// },[])
			let newArr = []
			for(let key in obj){
				let isNum = key.indexOf('Num')
				if(isNum==-1){
					newArr.push({id:key,purchaseNum:obj[key],isPurchase: 1})
				}
			}
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
		// return new Promise((res,rej)=>{
		// 	upload(url,data,token).then(success=>{
		// 		res(success)
		// 	}).catch(error=>{
		// 		rej(error)
		// 	})
		// })
	}
}

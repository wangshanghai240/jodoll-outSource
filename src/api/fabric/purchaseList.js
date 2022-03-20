import { get , post , del , put , upload} from '../request'
const statusOptions =[{
		label:'待处理',
		value:0
	},{
    	label:'已下单',
    	value:1
	},{
		label:'合同签订',
		value:2
	},{
		label:'船头样确认',
		value:3
	},{
		label:'大货发货',
		value:4
	},{
		label:'大货入库',
		value:5
	}];
	const qualityCheckOptions = [{ 
		label:'未质检',
		value:0
	},{
		label:'质检不通过',
		value:1
	},{
		label:'质检通过',
		value:2
	}];
export default {
	sourceOpitons:[{
		label:'订单',
		value:1
	},{
		label:'预投',
		value:2
	}],
	qualityCheckOptions:qualityCheckOptions,
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
	statusOptions:statusOptions,
	sampleCheckOptions:[{
		label:'未检查',
		value:0
	},{
		label:'未通过',
		value:1
	},{
		label:'已通过',
		value:2
	}],
	qualityOptions:[{
		label:'未质检',
		value:0
	},{
		label:'未通过',
		value:1
	},{
		label:'已通过',
		value:2
	}],
	columns:[{
		label:'单据',
		prop:'invoicesNo',
		align: 'center',
		width:145
		},{
			label:'来源',
			prop:'source',
			align: 'center',
			slot:true,
        	width:60
		},{
			label:'面料编号',
			prop:'materialCode',
			align: 'center',
        	width:130
		},{
			label:'面料名称',
			prop:'materialName',
			align: 'center',
        	width:130
		},{
			label:'幅宽',
			prop:'clothWidth',
			align: 'center',
        	width: 60
		},{
			label:'成分',
			prop:'component',
			align: 'center',
        	width: 200
		},{
			label:'单价',
			prop:'price',
			align: 'center',
        	width: 60
		},{
			label:'供货商',
			prop:'supplierName',
			align: 'center',
        	width: 180
		},{
			label:'采购数量',
			prop:'purchaseNum',
			align: 'center',
        	// slot:true,
			width: 90
		},{
			label:'优先级',
			prop:'sort',
			align: 'center',
			slot:true,
        	width: 70
		},{
			label:'交货日期',
			prop:'deliveryTime',
			align: 'center',
        	width: 100
		},{
			label:'入库时间',
			prop:'entryTime',
			align: 'center',
        	width: 100
		},{
			label:'状态',
			prop:'status',
			align: 'center',
			slot:true,
        	width: 100
		},{
			label:'入库数量',
			prop:'entryNum',
			align: 'center',
        	width: 90
		},{
			label:'船头样',
			prop:'sampleCheck',
			align: 'center',
			slot:true,
        	width: 70
		},{
			label:'质检',               // MoonXu增加 质检 
			prop:'qualityCheck',
			align: 'center',
			slot: true
		},{
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
		}
		// {
		// 	label:'创建人',
		// 	prop:'createBy',
		// 	align: 'center',
		// },{
		// 	label:'更新时间',
		// 	prop:'updateTime',
		// 	align: 'center',
		// },{
		// 	label:'更新人',
		// 	prop:'updateBy',
		// 	align: 'center',
		// }
	],
	options: {
		selection: true,
		tHeight:'70vh',
		isExpand:true,
		headerInput: true,
		headerWidth: '250',
        isFixedOperateColumn: "right"
	},
	expandColumns:[{
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
			label:'需求数量',
			prop:'demandNum',
			align: 'center',
		},{
			label:'数量',
			porp:'goodsNum',
			align:'center'
		},{
			label:'单件用量',
			porp:'onePiece',
			align:'center'
		}
	],
	expandOptions: {
		tHeight:'350px',
	},
	entryForm:[{
		type: "Input",
		label: "质检编号:",
		prop: "surfaceMaterialNo",
		placeholder: "请输入质检编号",
	},{
		type: "Date",
		label: "入库时间:",
		prop: "entryTime",
		placeholder: "请选择入库时间",
		style:"width:200px",
		change: data => {
			console.log(data)
		},
		rules: [{
			required: true, 
			message: '请选择入库时间', 
			trigger: 'blur' ,
		}],
	},{
		type: "Select",
		label: "是否全部入库",
		clearable:true,
		prop: "isEntry",
		style:"width:200px",
		options: [{
			value:0,
			label:'否'
		},{
			value:1,
			label:'是'
		}],
		change: row => {
			console.log(row)
		},
		rules: [{
			required: true, 
			message: '请选择入库状态', 
			trigger: 'blur' ,
		}],
	}],
	purchaseForm:[{
		type: "Select",
		label: "状态",
		prop: "status",
		clearable:true,
		options: statusOptions,
		style:"width:200px",
		change: row => {
			console.log(row)
		},
		placeholder: "请选择状态",
		rules: [{
			required: true,
			message: "请输入状态",
			trigger: "change"
		}],
	},{
		type: "Date",
		label: "交期:",
		prop: "deliveryTime",
		placeholder: "请选择交期",
		style:"width:200px",
		change: data => {
			console.log(data)
		},
		rules: [{
			required: true, 
			message: '请选择交期', 
			trigger: 'blur' ,
		}],
	}
	// ,
	// 	{
	// 	type: "Date",
	// 	label: "入库时间:",
	// 	prop: "entryTime",
	// 	placeholder: "请选择入库时间",
	// 	style:"width:200px",
	// 	change: data => {
	// 		console.log(data)
	// 	},
	// 	rules: [{
	// 		required: true,
	// 		message: '请选择入库时间',
	// 		trigger: 'blur' ,
	// 	}],
	// },{
	// 	type: "Select",
	// 	label: "质检情况",
	// 	prop: "qualityCheck",
	// 	style:"width:200px",
	// 	clearable:true,
	// 	options:qualityCheckOptions,
	// 	change: row => {
	// 		console.log(row)
	// 	},
	// },{
	// 	type: "Input",
	// 	inputType:'number',
	// 	label: "实际入库数量:",
	// 	prop: "entryNum",
	// 	placeholder: "请输入数量",
	// 	rules: [{
	// 		required: true,
	// 		message: "请输入实际入库数量",
	// 		trigger: "blur"
	// 	}
		// ]
	// }
	],
	selectionId(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				console.log(current)
				if(current.status != 0) return rej(current.materialCode + "已生成采购订单，不可以重复！")
                if(! current.supplierName) return rej(current.materialCode + "未选择供应商，不可以下单！")
				let {id} = current;
				total.push(id)
				return total
			},[])
			res(newData)
		})
	},
	nameOptions(list){
		return new Promise((res,rej)=>{
			let {data} = list;
			let newData = data.reduce((total, current)=>{
				let {supplierName,supplierCode} = current;
				total.push({label:supplierName,value:supplierCode})
				return total
			},[])
			res(newData)
		})
	},
	get(url,data){
		return new Promise((res,rej)=>{
			get(url,data).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	put(url,data){
		return new Promise((res,rej)=>{
			put(url,data).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	}
}
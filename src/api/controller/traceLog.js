import { get , post , del , put } from '../request'

export default {
	columns: [{
		label: '跟踪人',
		prop: 'createBy',
		align: 'center'
	}, {
		label: '时间',
		prop: 'createTime',
		align: 'center' 
	}, {
		label: '进度描述',
		prop: 'describe',
		align: 'center'
	}, {
		label: '名称',
		prop: 'name',
		align: 'center'
	}, {
		label: '供应商',
		prop: 'supplierName',
		align: 'center'
	}, {
		label: '跟踪模块',
		prop: 'model',
		align: 'center',
		slot: true
	}, {
		label: '图片',
		prop: 'fileUpload',
		align:'center',
		slot:true,
	}, {
		label: '节点',
		prop: 'stateNode',
		align: 'center',
		slot:true,
	}],
	//自定义配置
	options: {
		width: 50,
		tHeight: '40vh',
		headerInput: true
	},
	searchOptions: [{
		value: '0',
		label: '名称'
	}, {
		value: '1',
		label: '供应商'
	}, {
		value: '2',
		label: '跟踪模块'
	}, {
		value: '3',
		label: '跟踪人'
	}],
	ModelOptions: [{
		value: '1',
		label: '面料'
	}, {
		value: '2',
		label: '辅料'
	}, {
		value: '3',
		label: '工厂'
	}, {
		value: '4',
		label: '面料采购'
	}, {
		value: '5',
		label: '辅料采购'
	}],
	// 面料状态
	dqzt: [{
			value: '1',
			label: '待处理'
		}, {
			value: '2',
			label: '待采购'
		}, {
			value: '3',
			label: '已采购'
		}, {
			value: '4',
			label: '待发货'
		}, {
			value: '5',
			label: '已发货'
		}, {
			value: '6',
			label: '已完成'
		}],
	// 辅料状态
	ingredientsDqzt:[{
		value: '1',
		label: '待处理'
	}, {
		value: '2',
		label: '待采购'
	}, {
		value: '3',
		label: '已采购'
	}, {
		value: '4',
		label: '待发货'
	}, {
		value: '5',
		label: '已发货'
	}, {
		value: '6',
		label: '已完成'
	}],
	// 工厂订单状态
	factoryDqzt:[{
		value: '1',
		label: '已制函证'
	}, {
		value: '2',
		label: '已终止'
	}, {
		value: '3',
		label: '厂家已反馈'
	}, {
		value: '4',
		label: '已签合同'
	}, {
		value: '5',
		label: '产前样阶段'
	}, {
		value: '6',
		label: '生产中'
	}, {
		value: '7',
		label: '厂家已发货'
	}, {
		value: '8',
		label: '已入库'
	}, {
		value: '9',
		label: '完成'
	}],
	// 面料采购状态
	fabricPurchaseDqzt: [{
		label:'待处理',
		value:0
	},{
    	label:'生成订单',
    	value:1
	},{
		label:'询价',
		value:2
	},{
		label:'合同签订',
		value:3
	},{
		label:'船头样通过',
		value:4
	},{
		label:'船头样不通过',
		value:5
	},{
		label:'船头样入库',
		value:6
	},{
		label:'船头样出库',
		value:7
	},{
		label:'大货入库',
		value:8
	},{
		label:'大货出库',
		value:9
	}],
	// 辅料采购状态
	ingredientsPurchaseDqzt: [{
		label:'待处理',
		value:0
	},{
		label:'询价',
		value:1
	},{
		label:'合同签订',
		value:2
	},{
		label:'大货入库',
		value:3
	},{
		label:'大货出库',
		value:4
	},{
		label:'已完成',
		value:5
	}],
	traceDetail: [{
			value: 'createBy',
			label: '跟踪人'
		}, {
			value: 'createTime',
			label: '时间'
		}, 
		// {
		// 	value: 'describe',
		// 	label: '进度描述'
		// }, 
		// {
		// 	value: 'dqzt',
		// 	label: '状态更改'
		// }, 
		{
			value: 'statusLog',
			label: '状态'
		}, {
			value: 'name',
			label: '名称'
		}, {
			value: 'supplierName',
			label: '供应商'
		}, {
			value: 'model',
			label: '跟踪模块'
		},
		// {
		// 	value:'quality',
		// 	label:'品控记录'
		// },
	],
	tracLogData:{
		describe:'',
		model:'',
		goodsId:"",
		modelId:'',
		name:'',
		stateNode:'',
		fileUpload:''
	},
	tracLogForm:[{
		type: "Value",
		label: "物品名称:",
		prop: "name",
		style:"width:200px",
		clearable:true,
		placeholder: "请输入跟踪物品",
		rules: [{
			required: true,
			message: "请输入跟踪物品",
			trigger: "blur"
		}]
	},{
		type: "Value",
		label: "物品代码:",
		prop: "code",
		style:"width:200px",
		clearable:true,
		placeholder: "请输入物品代码",
		rules: [{
			required: true,
			message: "请输入物品代码", 
			trigger: "blur"
		}]
	}],
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(success=>{
				res(success)
			}).catch(error=>{
				rej(error)
			})
		})
	},
	getTracelog(url, data) {
		return new Promise((res, rej) => {
			get(url, data).then(log => {
				res(log.data)
			}).catch(error => {
				rej(error)
			})
		})
	},
	getDetail(url, data) {
		return new Promise((res, rej) => {
			get(url, data).then(log => {
				let {
					traceLogs,
					dqzt
				} = log.data;
				let obj = { ...traceLogs[0]
				};
				obj['dqzt'] = dqzt
				res(obj)
			}).catch(error => {
				rej(error)
			})
		})
	},
	putFabric(url,data){
		return new Promise((res, rej) => {
			put(url, data).then(fab => {
				
				res(fab)
			}).catch(error => {
				rej(error)
			})
		})
	}
}

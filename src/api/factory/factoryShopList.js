import { get , post , del , put , upload} from '../request'

const priorityOptions = [{
	value: 0,
	label: '无'
}, {
	value: 1,
	label: '急速'
}, {
	value: 2,
	label: '中'
}, {
	value: 3,
	label: '慢'
}]
const dqzt = [{
			label: '订货会下单',
			value: 1
		},{
			label: '工厂下单',
			value: 2
		},{
			label: '签订合同',
			value: 3
		},{
			label: '产前样齐料',
			value: 4
		},{
			label: '产前样批版',
			value: 5
		},{
			label: '大货齐料',
			value: 6
		},{
          	label: '已到料',
          	value: 6.2
        },
        {
            label: '已开裁',
            value: 6.4
        },
        {
            label: '已上线',
            value: 6.6
        },
       {
            label: '已下线',
            value: 6.8
        }
                ,{
			label: '出货检',
			value: 7
		},{
			label: '入库检',
			value: 8
		}, {
        	label: '入库完成',
        	value: 9
		}
]
const lightUp = [{
	label:'绿灯',
	value:0
},{
	label:'黄灯',
	value:1
},{
	label:'红灯',
	value:2
}]
const qiliaoOptions = [{
	value: 0,
	label: '无'
}, {
	value: 1,
	label: '产前样'
}, {
	value: 2,
	label: '大货'
}]
const states =[{
	value:1,
	label:'已完结'
},{
	value:0,
	label:'未完结'
}]
export default {
	priorityOptions: priorityOptions,
	qiliaoOptions:qiliaoOptions,
	lightUp:lightUp,
	states:states,
	prenatalSampleState:[{
		value:0,
		label:'未确认'
	},{
		value:1,
		label:'已确认'
	},{
		value:2,
		label:'已拒绝'
	}],
	sourceTypeData: [{
		label: "订货会",
		value: 1
	}],
	lx: [{
		label: '成衣',
		value: 1
	}, {
		label: '加工',
		value: 2
	}],
	//来源类型
	sourceTypeData: [{
			label: "订货会",
			value: 1
		} 
	],
	//当前状态
	dqzt: dqzt,
	columns: [{
		label: '来源类型',
		prop: 'sourceType',
		slot: true,
		align: 'center',
        width: 90,
	}, {
		label: '来源名称',
		prop: 'orderMeetingName',
		align: 'center',
        width: 200,
	},{
		label: '工厂',
		prop: 'ghsmc',
		align: 'center',
		width: 200
	}, {
		label: '订单号',
		prop: 'orderNumber',
		align: 'center',
        width: 190
	}, {
		label: '加工类型',
		prop: 'lx',
		slot:true,
		align: 'center',
        width: 90
	}, {
		label: '品类',
		prop: 'dlmc',
		align: 'center',
        width: 70
	},{
		label: '商品货号',
		prop: 'spdm',
		align: 'center',
		width: 150,
     },{
		label: '工厂货号',
		prop: 'gchh',
		align: 'center',
		width: 150,
	}, {
		label: '成分',
		prop: 'cf',
		align: 'center',
        width: 200
	}, {
		label: '数量',
		prop: 'sl',
		align: 'center',
        width: 80
	}, {
		label: '单价',
		prop: 'gcbj',
		align: 'center',
        width: 80
	}, {
		label: '要求货期',
		prop: 'yqhq',
		align: 'center',
        width: 100
	},{
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
		width: 150,
	},
	// {
	// 	label: '优先级',
	// 	prop: 'priority',
	// 	slot:true,
	// 	align: 'center',
 //        width: 70
	// }, 
	{
		label: '进度',
		prop: 'state',
		slot:true,
		align: 'center',
        width: 70
	}, {
		label: '产前样',
		prop: 'prenatalSampleState',
		slot:true,
		align: 'center',
        width: 120
	}, {
		label: '齐料状态',
		prop: 'qiliaoState',
		slot:true,
		align: 'center',
        width: 100
	}, {
		label:'当前状态',
		prop: 'dqzt',
		align: 'center',
		width: 120,
		slot:true
	},{
		label: '完成时间',
		prop: 'sjwcsj',
		align: 'center',
	    width: 165
	}
	// {
	// 	label:'批版',
	// 	prop: 'line',
	// 	slot:true,
	// 	align: 'center',
 //        width: 180
	// },
	],
	options: {
		selection: true,
		width: 50,
		tHeight: '70vh',
		headerInput: true,
		isExpand:true,
		isFixedOperateColumn: 'right'
	},
	expandColumns:[{
			label:'数量',
			prop:'count',
			align: 'center',
		},{
			label:'尺码',
			prop:'size',
			align: 'center',
		}
	],
	expandOptions: {
		tHeight:'350px',
		headerInput: true,
	},
	expandEditForm: [{
		type: "Input",
		label: "数量:",
		inputType:"number",
		prop: "count",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入数量",
	},{
		type: "Input",
		label: "尺码:",
		inputType:"number",
		prop: "size",
		//icon: 'el-icon-more',
		style:"width:200px",
		onClick: res => {
			console.log(res)
		},
		placeholder: "请输入尺码",
	}],
	searchData: {
		ghsmc: '',
		orderNumber: '',
		spmc: '',
		spdm: '',
		priority: '',
		dqzt: '',
		state:'',
		isOrder:1,
		bigState:'',
		delivery:[]
	},
	factoryShopForm: [{
		type: "Input",
		label: "工厂名称:",
		clearable:true,
		prop: "ghsmc",
		placeholder: "请输入工厂名称",
		style: "width:200px",
	}, {
		type: "Input",
		label: "订单号:",
		clearable:true,
		prop: "orderNumber",
		placeholder: "请输入订单号",
		style: "width:200px",
	}, {
		type: "Input",
		label: "商品名称:",
		clearable:true,
		prop: "spmc",
		placeholder: "请输入商品名称",
		style: "width:200px",
	}, {
		type: "Input",
		label: "货号:",
		clearable:true,
		prop: "spdm",
		placeholder: "请输入货号",
		style: "width:200px",
	}, {
		type: "Select",
		label: "优先级:",
		prop: "priority",
		options: [...priorityOptions],
		placeholder: "请选择优先级",
		clearable:true,
		style: "width:200px",
		change: row => "",
	}, {
		type: "Select",
		label: "状态:",
		prop: "dqzt",
		options: [...dqzt],
		placeholder: "请选择状态",
		clearable:true,
		style: "width:200px",
		change: row => "",
	}, {
		type: "Select",
		label: "亮灯状态:",
		prop: "state",
		options: [...lightUp],
		placeholder: "请选择亮灯状态",
		clearable:true,
		style: "width:200px",
		change: row => "",
	},{
		type: "Select",
		label: "大状态:",
		prop: "bigState",
		options: [...states],
		clearable:true,
		placeholder: "请选择类型",
		style:"width:200px",
		change: row => "",
	},{
		type: "Daterange",
		label: "交期区间:",
		prop: "delivery",
		style:"width:530px",
		change: res => {
			console.log(res)
		}
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
	put(url,data,isParams){
		return new Promise((res,rej)=>{
			put(url, data,isParams).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	get(url,params){
		return new Promise((res,rej)=>{
			get(url, params).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	},
	getSelectId(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				let {orderNumber} = current
				if(total){
					total += ','+orderNumber
				}else{
					total = orderNumber
				}
				return total
			},'')
			res(newData)
		})
	},
}
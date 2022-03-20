import { get , post , del , put } from '../request'

const statusOptions = [{
	value: 0,
	label: '已终止'
},{
	value: 1,
	label: '已制函证'
},{
	value: 2,
	label: '厂家已反馈'
},{
	value: 3,
	label: '已签合同'
},{
	value: 4,
	label: '产前样阶段'
},{
	value: 5,
	label: '生产中'
},{
	value: 6,
	label: '厂家已发货'
},{
	value: 7,
	label: '已入库'
},{
	value: 8,
	label: '完成'
}];
const ModelOptions =  [{
		value: 1,
		label: '面料'
	}, {
		value: 2,
		label: '辅料'
	}, {
		value: 3,
		label: '工厂'
	}];
export default{
	ModelOptions:ModelOptions,
	columns: [{
		label: '商品名称',
		prop: 'spmc',
		align: 'center'
	}, {
		label: '供应商',
		prop: 'ghsmc',
		align: 'center'
	}, {
		label: '操作人',
		prop: 'createBy',
		align: 'center'
	}, {
		label: '时间',
		prop: 'createTime',
		align: 'center'
	}, {
		label: '结果',
		prop: 'isPass',
		align: 'center',
		slot: true
	}, {
		label: '检查模块',
		prop: 'checkModule',
		align: 'center',
		slot: true
	}],
	options: {
		width: 50,
		tHeight: '40vh',
		headerInput: true
	},
	isPassOptions: [{
		value: 0,
		label: '不通过'
	},{
		value: 1,
		label: '通过'
	}],
	statusOptions:statusOptions,
	searchOptions: [{
		value: 0,
		label: '商品名称'
	}, {
		value: 1,
		label: '供应商'
	}, {
		value: 2,
		label: '操作人'
	}, {
		value: 3,
		label: '结果'
	}],
	qualityLogData:{
		checkModule:'',
		isPassBase:'',
		remark:''
	},
	qualityLogForm:[{
		type: "Select",
		label: "检查模块",
		clearable:true,
		prop: "checkModule",
		style:"width:200px",
		options: ModelOptions,
		change: row => {
			console.log(row)
		},
		rules: [{
			required: true, 
			message: '请选择检查模块', 
			trigger: 'blur' ,
		}],
	},{
		type: "Input",
		label: "备注:",
		style:"width:200px",
		clearable:true,
		prop: "remark",
		placeholder: "请输入检查备注",
	}],
	getQuality(quality) {
		return new Promise((res, rej) => {
			let {data} = quality;
			if(data&&data.length!==0){
				let newData = data.reduce((total, current)=>{
					let {id,description} = current;
					total.push({label:description,qualityControlId:id,isPass:''})
					return total
				},[])
				res(newData)
			}else{
				rej('数据为空')
			}
			
		})
	},
	checkDetailList(id,list){//
		return new Promise((res, rej) => {
			if(list&&list.length!==0){
				let newData = list.reduce((total, current)=>{
					let {isPass,qualityControlId,remark,image} = current;
					total.push({goodsId:id,isPass,qualityControlId,remark,image})
					return total
				},[])
				res(newData)
			}else{
				rej('数据为空')
			}
			
		})
	},
	get(url,data){
		return new Promise((res,rej)=>{
			get(url, data).then(obj => {
				res(obj)
			}).catch(error => {
				rej(error)
			})
		})
	},
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(obj=>{
				res(obj)
			}).catch(err=>{
				rej(err)
			})
		})
	}
}
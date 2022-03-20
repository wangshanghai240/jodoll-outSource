import { get , post , del , put ,upload } from '../request'

const pickerBeginDateAfter = {
	disabledDate: (time) => {
		return time.getTime() < Date.now()
	}
};
const contractStateOptions = [{
	value:0,
	label:'未签订'
},{
	value:1,
	label:'待审核'
},{
	value:2,
	label:'被拒绝'
},{
	value:3,
	label:'已签订'
}] 
const fundStateOptions = [{
	value:1,
	label:'第1阶段已申请'
},{ 
	value:2,
	label:'第1阶段已审批' 
},{
	value:3,
	label:'第2阶段已支付'
},{
	value:4,
	label:'第2阶段已申请'
},{
	value:5,
	label:'第2阶段已审批'
},{
	value:6,
	label:'全部货款已申请'
},{
	value:7,
	label:'全部货款已审批'
},{
	value:8,
	label:'全部货款已支付'
}]
const stateOptions = [{
	value:1,
	label:'初步下单'
},{
	value:2,
	label:'合同签订'
},{
	value:3,
	label:'生产中'
},{
	value:4,
	label:'已完成'
}]
const statetype = [{
	value:null,
	label:'无'
},{
	value:1,
	label:'成衣'
},{
	value:2,
	label:'加工'
}]
const types =[{
	value:1,
	label:'成衣'
},{
	value:2,
	label:'加工'
}]
export default {
	contractStateOptions:contractStateOptions,
	fundStateOptions:fundStateOptions,
	stateOptions:stateOptions,
	statetype:statetype,
	types:types,
	columns: [{
		label: '工厂名称',
		prop: 'name',
		width:200,
		align: 'center'
	},{
		label: '订单号',
		prop: 'orderNumber',
		align: 'center',
        width: 180
	},{
		label: '类型',
		prop: 'lx',
		align: 'center',
		slot:true,
        width: 60
	},{
		label: '下单时间',
		prop: 'createTime',
		align: 'center',
        width: 165
	},{
		label: '交期',
		prop: 'deliveryTime',
		align: 'center',
        width: 100
	},{
		label: '完成时间',
		prop: 'finishTime',
		align: 'center',
        width: 165
	},{
		label: '数量',
		prop: 'quantity',
		align: 'center',
        width: 70
	},{
		label: '金额',
		prop: 'totalMonery',
		align: 'center',
        width: 90
	},{
		label: '订单状态',
		prop: 'state',
		slot:true,
		width: 90,
		align: 'center'
	},{
        label: '跟单员',
        prop: 'merchandiser',
        align: 'center',
        width: 90,
    },{
		label: '创建人',
		prop: 'createBy',
		align: 'center',
        width: 130
	}],
	options: {
		selection: true,
		headerWidth: '500',
		tHeight:'70vh',
		headerInput: true,
        isFixedOperateColumn: 'right'
	},
	searchData:{
		name: "",
		orderNumber: "",
		daterange:[],
		contractState: null,
		fundState: null,
		state: null,
		lx:'',
		orderMeeting:'',
	},
	factoryListForm:[{
		type: "Input",
		label: "工厂名称:",
		prop: "name",
		placeholder: "请输入工厂名称",
		style:"width:200px",
	},{
		type: "Input",
		label: "订单号:",
		prop: "orderNumber",
		placeholder: "请输入订单号",
		style:"width:200px",
	},{
		type: "Daterange",
		label: "下单起止时间:",
		prop: "daterange",
		style:"width:530px",
		change: res => {
			console.log(res)
		}
	},
	// 	{
	// 	type: "Select",
	// 	label: "贷款状态:",
	// 	prop: "fundState",
	// 	options: [...fundStateOptions],
	// 	clearable:true,
	// 	placeholder: "请选择贷款状态",
	// 	style:"width:200px",
	// 	change: row => "",
	// },
        {
            type: "Select",
            label: "跟单员:",
            prop: "merchandiser",
            clearable:true,
            placeholder: "请选择跟单员",
            style:"width:200px",
            change: row => "",
        },


		{
		type: "Select",
		label: "订单状态:",
		prop: "state",
		options: [...stateOptions],
		clearable:true,
		placeholder: "请选择订单状态",
		style:"width:200px",
		change: row => "",
	},{
		type: "Select",
		label: "类型:",
		prop: "lx",
		options: [...types],
		clearable:true,
		placeholder: "请选择类型",
		style:"width:200px",
		change: row => "",
	},{
		type: "Select",
		label: "订货会名称:",
		prop: "sourceId",
		options: [],
		clearable:true,
		placeholder: "请选择订货会名称",
		style:"width:200px",
		change: row => "",
	}],
	confirmData:{
		finishTime:'',
		money:''
	},
	confirmForm:[{
		type: "Date",
		label: "交期:",
		prop: "finishTime",
		placeholder: "请选择交期",
		style:"width:200px",
		change: data => {
			console.log(data)
		},
		rules: [{
			required: true, 
			message: '请选择日期', 
			trigger: 'change' ,
		}],
	},{
		type: "Input",
		label: "确认金额:",
		prop: "money",
		placeholder: "请确认金额",
		style:"width:200px",
		rules: [{
			required: true,
			message: "请确认金额",
			trigger: "blur"
		}]
	}],
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
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
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
	put(url,data){
		return new Promise((res,rej)=>{
			put(url,data).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	del(url,id) {
		return new Promise((res, rej) => {
			del(url,id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	},
	getMeetingList(list) {
		return new Promise((res, rej) => {
			let {data} = list;
			let newData = data.reduce((total, current)=>{
				let {id,name} = current;
				total.push({label:name,value:id})
				return total
			},[])
			this.sourceData = newData;
			res(newData)
		})
	},
	listHandler(list){
		return new Promise((res,rej)=>{
			try{
				let options = [];
				list.forEach((item,index)=>{
					let {code:value,name:label} = item;
					options.push({value,label})
					if(index==list.length-1){
						res(options)
					}
				})
			}catch(e){
				rej(e)
			}
		})
	}
}
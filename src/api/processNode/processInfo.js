import { post , put , get , del} from '../request'
const StateOptions = [{
	value: '0',
	label: '下架'
}, {
	value: '1',
	label: '上架'
}];
const nodeOptions = [];
export default {
	StateOptions: StateOptions,
	columns: [{
		label: '流程编号',
		prop: 'code',
		align: 'center',
	}, {
		label: '流程名称',
		prop: 'name',
		align: 'center',
	}, {
		label: '状态',
		prop: 'status',
		slot:true,
		align: 'center',
	}, {
		label: '编辑时间',
		prop: 'updateTime',
		align: 'center',
	}, {
		label: '编辑人',
		prop: 'updateBy',
		align: 'center',
	}],
	options: {
		selection: true,
		tHeight: '70vh',
		headerWidth: '380',
		headerInput: true,
		isExpand:true
	},
	proInfoData: {
		code:'',
		name: '',
		status: ''
	},
	proInfoForm: [{
		type: "Input",
		label: "流程编号:",
		prop: "code",
		width: "180px",
		placeholder: "请输入流程编号",
		// 表单验证
		rules: [{
			required: true,
			message: "请输入流程编号",
			trigger: "blur"
		}]
	},{
		type: "Input",
		label: "流程名称:",
		prop: "name",
		width: "180px",
		placeholder: "请输入流程名称",
		// 表单验证
		rules: [{
			required: true,
			message: "请输入流程名称",
			trigger: "blur"
		}]
	}, {
		type: "Select",
		label: "流程状态:",
		prop: "status",
		clearable: true,
		options: StateOptions,
		placeholder: "请选择流程状态",
		style: "width:200px",
		change: row => "",
		rules: [{
			required: true,
			message: "请选择流程状态",
			trigger: "change"
		}]
	}],
	expandColumns:[{
			label:'节点编号',
			prop:'nodeCode',
			align: 'center',
		},{
			label:'节点名称',
			prop:'nodeName',
			align: 'center',
		},{
			label:'节点耗时',
			prop:'time',
			align: 'center',
		},{
			label:'前置节点',
			prop:'frontNode',
			slot:true,
			align: 'center',
		},{
			label:'后置节点',
			prop:'behindNode',
			slot:true,
			align: 'center',
		},{
			label:'编辑人',
			prop:'updateBy',
			align: 'center',
		},{
			label:'编辑时间',
			prop:'updateTime',
			align: 'center',
		}
	],
	expandOptions: {
		tHeight:'350px',
		headerInput: true,
		headerWidth: '240',
	},
	nodeOptions:nodeOptions,
	nodesData:{
		frontNode:[],//前置
		behindNode:[],//后置
		nodeCode:'',
		nodeName:'',
		time:''
	},
	nodesForm:[{
		type: "Select",
		label: "前置节点",
		clearable:true,
		multiple:true,
		tags:true,
		prop: "frontNode",
		style:"width:200px",
		options: nodeOptions,
		change: row => {
			console.log(row);
		},
	},{
		type: "Select",
		label: "后置节点",
		clearable:true,
		multiple:true,
		tags:true,
		prop: "behindNode",
		style:"width:200px",
		options: nodeOptions,
		change: row => {
			console.log(row)
		},
	},{
		type: "Input",
		label: "节点编号:",
		prop: "nodeCode",
		width: "180px",
		placeholder: "请输入节点编号",
		// 表单验证
		rules: [{
			required: true,
			message: "请输入节点编号",
			trigger: "blur"
		}]
	},{
		type: "Input",
		label: "节点名称:",
		prop: "nodeName",
		width: "180px",
		placeholder: "请输入节点名称",
		// 表单验证
		rules: [{
			required: true,
			message: "请输入节点名称",
			trigger: "blur"
		}]
	},{
		type: "Input",
		label: "节点耗时:",
		prop: "time",
		inputType:"number",
		width: "180px",
		placeholder: "请输入节点耗时",
		// 表单验证
		rules: [{
			required: true,
			message: "请输入节点耗时",
			trigger: "blur"
		}]
	}],
	calNodesData:{
		startTime :''
	},
	calNodesForm:[{
		type: "Date",
		label: "开始时间:",
		prop: "startTime",
		placeholder: "请选择开始时间",
		style:"width:200px",
		rules: [{
			required: true, 
			message: '请选择开始时间', 
			trigger: 'change'
		}],
		change: data => {
			console.log(data)
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
	put(url,data){
		return new Promise((res, rej) => {
			put(url, data).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	del(url,id){
		return new Promise((res, rej) => {
			del(url, id).then(resp => {
				res(resp)
			}).catch(err => {
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
	handleNodes(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				let {nodeId,nodeName} = current;
				total.push({value:nodeId,label:nodeName})
				return total
			},[])
			res(newData)
		})
	},
	handleForm(obj){
		return new Promise((res,rej)=>{
			let {behindNode,frontNode,...form} = obj;
			if(behindNode && behindNode.length!==0){
				let newBehindNode = behindNode.reduce((total, current)=>{
					if(total){
						total += ';'+current
					}else{
						total = current
					}
					return total
				},'')
				form['behindNode'] = newBehindNode;
			}
			if(frontNode && frontNode.length!==0){
				let newBehindNode = frontNode.reduce((total, current)=>{
					if(total){
						total += ';'+current
					}else{
						total = current
					}
					return total
				},'')
				form['frontNode'] = newBehindNode;
			}
			res(form)
		})
	},
	reverseForm(obj){
		return new Promise((res,rej)=>{
			console.log(obj);
			let {behindNode,frontNode,...form} = obj;
			if(behindNode){
				let newBehindNode =behindNode.split(';');
				form['behindNode'] = newBehindNode;
			}
			if(frontNode){
				let newBehindNode =frontNode.split(';');
				form['frontNode'] = newBehindNode;
			}
			res(form)
		})
	}
}

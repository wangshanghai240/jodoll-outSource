import { get , post , del , put , upload} from '../request'

export default {
	conData:{
		sendTime:'',
		signTime:''
	},
	conForm:[{
		type:'Date',
		change: row => {
			console.log(row)
		},
		label:'订单交期',
		prop:'sendTime',
		align: 'center',
		style:'width:260px;',
		disabled:true,
		rules: [{
			required: true,
			message: "请选择订单交期",
			trigger: "blur",
		}]
	},{ 
		type:'Date',
		change: row => {
			console.log(row)
		},
		label:'签订日期',
		prop:'signTime',
		align: 'center',
		style:'width:260px;',
		rules: [{
			required: true,
			message: "请选择签订日期",
			trigger: "blur",
		}]
	}],
	confrimColumns:[{
		label: '商品名称',
		prop: 'spmc',
		align: 'center',
	}, {
		label: '公司货号',
		prop: 'spdm',
		align: 'center',
	}, {
		label: '厂家货号',
		prop: 'gchh',
		align: 'center',
	}, {
		label: '成分',
		prop: 'cf',
		align: 'center',
	}, {
		label: '单价',
		prop: 'gcbj',
		slot:true,
		align: 'center',
	}, {
		label:'数量',
		prop:'sl',
		align:'center'
	},{
		label: '金额',
		prop: 'zj',
		align: 'center',
	}, {
		label: '货期',
		prop: 'yqhq',
		slot:true,
		align: 'center',
	}],
	confrimOptions: {
	    tHeight:'350px',
		isExpand:true
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
			put(url,data).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
	}
}
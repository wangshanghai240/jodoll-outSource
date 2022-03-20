import { get , post , del , put , upload} from '../request'

export default {
	conData:{
		totalAmount:'',
		signTime:''
	},
	conForm:[{
		type:'Value',
		label:'总金额',
		prop:'totalAmount',
		align: 'center',
		style:'width:260px;font-size:20px',
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
		label:'订单编号',
		prop:'orderNumber',
		width:130,
		align: 'center',
	},{
		label:'面料编号',
		prop:'materialCode',
		align: 'center',
        width:130,
	},{
		label:'面料名称',
		prop:'materialName',
		align: 'center',
        width:130,
	},{
		label:'幅宽',
		prop:'clothWidth',
		align: 'center',
        width:70
	},{
		label:'成分',
		prop:'component',
		align: 'center',
	},{
		label:'单价',
		prop:'price',
		slot:true,
		align: 'center',
        width: 70
	},{
		label:'供应商',
		prop:'supplierName',
		align: 'center',
	},{
		label:'采购数量',
		prop:'purchaseNum',
		align: 'center',
        width: 90
	},{
		label:'金额',
		prop:'money',
		slot:true,
		align: 'center',
        width: 90
	},{
		label:'优先级',
		prop:'sort',
		slot:true,
		align: 'center',
        width: 70
	},
	// {
	// 	label:'交期',
	// 	prop:'deliveryTime',
	// 	align: 'center',
	// },{
	// 	label:'入库完成',
	// 	prop:'isEntry',
	// 	slot:true,
	// 	align: 'center',
	// },{
	// 	label:'质检情况',
	// 	prop:'qualityCheck',
	// 	slot:true,
	// 	align: 'center',
	// },{
	// 	label:'实际入库数量',
	// 	prop:'entryNum',
	// 	align: 'center',
	// },
	{
		label:'用毛',
		prop:'wool',
		slot:true,
		width:120,
		align: 'center',
	},
	{
		label:'纱支/密度',
		prop:'weaving',
		slot:true,
		width:120,
		align: 'center',
	},
	{
		label:'克重',
		prop:'gram',
		slot:true,
		width:120,
		align: 'center',
	},
	{
		label:'交期',
		prop:'deliveryTime',
		width:160,
		align: 'center',
		slot:true,
	}],
	confrimOptions: {
	    tHeight:'350px',
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
	},
	moneyUpdate(list){
		return new Promise((res,rej)=>{
			let money = 0;
			list.reduce((total, current)=>{
				let {price,purchaseNum} = current;
				let m = price*purchaseNum;
				money = money +m
				return total
			},[])
			res(money)
		})
	}
}
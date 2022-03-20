import { get , post , del , put } from '../request';

const statusOptions = [{
	label:'待处理',
	value:1
},{
	label:'合同签订',
	value:2
}];
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
export default {
    statusOptions:statusOptions,
	columns:[{
		label:'订单编号',
		prop:'orderNumber',  
		width:200,
		align: 'center',
	},{
		label:'供应商',
		prop:'supplierName', 
		align: 'center',
	},{
		label:'总数',
		prop:'totalSum', 
		align: 'center',
	},{
		label:'金额',
		prop:'totalAmount', 
		align: 'center',
	},{
		label:'交期',
		prop:'deliveryTime',
		width:120,
		align: 'center',
	},{
		label:'下单时间',
		prop:'payTime',
		width:180,
		align: 'center',
	},{
		label:'签订日期',
		prop:'signTime',
		width:120,
		align: 'center',
	},{
		label:'状态',
		prop:'status',
		align: 'center',
		slot:true,
	}],
	options: {
		selection: true,
		tHeight:'70vh',
		isExpand:true,
		headerInput: true,
		headerWidth: '380',
    },
	expandColumns:[{
			label:'采购单据编号',
			prop:'invoicesNo',
			align: 'center',
			style:'width:260px;',
			width: 140
		},{
			label:'辅料编号',
			prop:'ingredientsCode',
			align: 'center',
		},{
			label:'辅料名称',
			prop:'ingredientsName',
			align: 'center',
			style:'width:260px;',
		},{
			type:'Input',
			label:'单价',
			prop:'price',
			align: 'center',
			style:"width:200px",
			slot:true,
        	width: 80
		},{
			label:'采购数量',
			prop:'purchaseNum',
			align: 'center',
			style:'width:260px;',
        	width: 90
		},{
			label:'金额',
			prop:'totalAmount',
			align: 'center',
			slot:true,
			style:'width:260px;',
        	width: 90
		},{
			label:'供应商',
			prop:'supplierName',
			align: 'center',
        },{
			type:'Select',
			options:[...sortOptions],
			change: row => {
				console.log(row)
			},
			label:'优先级',
			prop:'sort',
            align: 'center',
			slot:true,
			style:'width:260px;',
        	width: 70
        },{
			type:'Date',
			change: row => {
				console.log(row)
			},
			label:'交期',
			prop:'deliveryTime',
			style:"width:200px",
            align: 'center',
        	width: 100
        },{
			label:'入库完成',
			prop:'demandNum',
			align: 'center',
			style:'width:260px;',
        	width: 90
        },
        {
			label:'质检情况',
			prop:'examining',
            align: 'center',
            slot:true,
            width: 90
        },
        {
			label:'实际入库数量',
			prop:'entryNum',
			align: 'center',
            width: 115
		}
	],
	expandOptions: {
        tHeight:'350px',
        //isExpand:true,
		headerInput: true,
	},
	confrimColumns:[{
		label:'订单编号',
		prop:'orderNumber',
		width:140,
		align: 'center',
	},{
		label:'辅料编号',
		prop:'ingredientsCode',
		align: 'center',
	},{
		label:'辅料名称',
		prop:'ingredientsName',
		align: 'center',
	},{
		label:'单价',
		prop:'price',
		align: 'center',
		slot:true,
        width: 90,
	},{
		label:'采购数量',
		prop:'purchaseNum',
		align: 'center',
        width: 120,
	},{
		label:'金额',
		prop:'totalAmount',
		align: 'center',
		slot:true,
        width: 90,
	},{
		label:'供应商',
		prop:'supplierName',
		align: 'center',
	},{
		label:'优先级',
		prop:'sort',
		align: 'center',
		slot:true,
        width: 70,
	},{
		label:'状态',
		prop:'status',
		align: 'center',
		slot:true,
        width: 90,
	},{
		label:'厂家货号',
		prop:'factoryNo',
		align: 'center',
		width:120,
		slot:true
	},{
		label:'规格型号',
		prop:'productModel',
		align: 'center',
		width:120,
		slot:true
	},{
		label:'质量要求',
		prop:'qualityClaim',
		align: 'center',
		width:120,
		slot:true
	},{
		label:'备注',
		prop:'remark',
		align: 'center',
		width:200,
		slot:true
	},{
		label:'交期',
		prop:'deliveryTime',
		align: 'center',
		width: 160,
		slot:true,
	}],
	confrimOptions: {
        tHeight:'350px',
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
	del(url,id) {
		return new Promise((res, rej) => {
			del(url,id).then(list => {
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
		return upload(url,data,token,isGet)
	},
	confirmList(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				let {id,deliveryTime,factoryNo,productModel,qualityClaim,remark,price,totalAmount} = current;
				console.log(deliveryTime)
				//let time = deliveryTime.getFullYear()+"-"+(deliveryTime.getMonth()+1)+"-"+deliveryTime.getDate();
				total.push({
					'id':id,
					'deliveryTime':deliveryTime,
					'factoryNo':factoryNo,
					'productModel':productModel,
					'qualityClaim':qualityClaim,
					'remark':remark,
					'price':price,
					'totalAmount':totalAmount,
				})
				return total
			},[])
			res(newData)
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
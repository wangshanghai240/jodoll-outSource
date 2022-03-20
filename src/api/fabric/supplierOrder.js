import { get , post , del , put , upload} from '../request'
const statusOptions = [{
	value:1,
	label:'待处理'
},{
	value:2,
	label:'合同签订'
}];
export default {
	statusOptions:statusOptions,
	isEntryOptions:[{
		value:0,
		label:'否'
	},{
		value:1,
		label:'是'
	}],
	qualityCheckOptions:[{
		value:0, 
		label:'未质检'
	},{
		value:1,
		label:'质检未通过'
	},{
		value:2,
		label:'质检通过' 
	}],
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
	columns: [{
		label: '订单编号',
		prop: 'orderNumber',
		width:200,
		align: 'center',
	},{
		label: '供应商',
		prop: 'supplierName',
		align: 'center',
	},{
		label: '总数',
		prop: 'totalSum',
		align: 'center',
	},{
		label: '金额',
		prop: 'totalAmount',  
		align: 'center',
	},{
		label: '交期', 
		prop: 'deliveryTime',
		width:120,
		align: 'center',
	},{
		label: '下单时间',
		prop: 'createTime',
		width:180,
		align: 'center',
	},{
		label: '签订日期',
		prop: 'signTime',
		width:180,
		align: 'center',
	},{
		label: '状态',
		prop: 'status',
		slot:true,
		align: 'center',
	},{
		label: '操作',
		prop: 'operation',
		slot:true,
		width:400,
		align: 'center',
		tooltip:true
	}],
	options:{
		selection: true,
		width: 50,
		tHeight:'70vh',
		isExpand:true
	},
	expandColumns:[{
		label:'采购单据编号',
		prop:'invoicesNo',
		align: 'center',
		width:130
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
        width:70
	},{
		label:'成分',
		prop:'component',
		align: 'center'
	},{
		label:'单价',
		prop:'price',
		align: 'center',
        width: 70
	},{
		label:'供应商',
		prop:'supplierName',
		align: 'center'
	},{
		label:'采购数量',
		prop:'purchaseNum',
		align: 'center',
        width: 90
	},{
		label:'优先级',
		prop:'sort',
		slot:true,
		align: 'center',
        width: 70
	},{
		label:'交期',
		prop:'deliveryTime',
		align: 'center',
        width: 100
	},{
		label:'入库完成',
		prop:'isEntry',
		slot:true,
		align: 'center',
        width: 90
	},{
		label:'质检情况',
		prop:'qualityCheck',
		slot:true,
		align: 'center',
        width: 90
	},{
		label:'实际入库数量',
		prop:'entryNum',
		align: 'center',
        width: 115
	}],
	expandOptions: {
		tHeight:'350px',
		headerInput: true,
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
	del(url,id) {
		return new Promise((res, rej) => {
			del(url,id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	confirmList(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				let {id,deliveryTime,wool,weaving,gram,price} = current;
				console.log(new Date())
				total.push({id,deliveryTime,wool,weaving,gram,price})
				return total
			},[])
			res(newData)
		})
	},
}
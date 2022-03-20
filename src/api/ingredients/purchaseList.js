import { get , post , del , put , upload} from '../request';

const examiningOptions=[{
	label:'未质检',
	value:0
},{
	label:'未通过',
	value:1
},{
    label:'已通过',
    value:2
}];
const statusOptions = [{
	label:'待处理',
	value:1
},{
	label:'已下单',
	value:2
},{
	label:'合同签订',
	value:3
},{
	label:'大货发货',
	value:4
},{
	label:'大货入库',
	value:5 
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
const sampleCheckOptions = [{
	label:'未检查',
	value:0
},{
	label:'未通过',
	value:1
},{
	label:'已通过',
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
	examiningOptions:examiningOptions,
	sortOptions:sortOptions,
	statusOptions:statusOptions,
	sampleCheckOptions:sampleCheckOptions,
	columns:[{
		type:'Value',
		label:'单据编号',
		prop:'invoicesNo',
		align: 'center',
		style:'width:300px;',
        width:140
	},{
		label:'来源',
		prop:'source',
		align: 'center',
		slot:true,
		width:60
	},{
		type: 'Value',
		label:'辅料编号',
		prop:'ingredientsCode',
		align: 'center',
		style:'width:300px;',
        width:130
	},{
		type:'Value',
		label:'辅料名称',
		prop:'ingredientsName',
		align: 'center',
		style:'width:300px;',
        width: 280
	},{
		type:'Value',
		label:'供货商',
		prop:'supplierName',
		align: 'center',
		style:'width:300px;',
        width: 250
	},{
		type:'Value',
		options:[...sortOptions],
		label:'优先级',
		prop:'sort',
		align: 'center',
		slot:true,
		style:'width:300px;',
        width: 70
	},{
		type:'Value',
		label:'采购数量',
		prop:'purchaseNum',
		align: 'center',
		style:'width:300px;',
        width: 90
	},{
		type:'Input',
		label:'单价',
		prop:'price',
		align: 'center',
		style:'width:300px;',
        width: 80
	},{
		label:'金额',
		prop:'totalAmount',
		align: 'center',
		style:'width:300px;',
		slot:true,
        width: 80
	},{		
		type:'Select',
		options:[...statusOptions],
		label:'状态',
		prop:'status',
		align: 'center',
		slot:true,
		style:'width:300px;',
        width: 100
	},{
		type:'Select',
		options:[...examiningOptions],
		label:'质检情况',
		prop:'examining',
		align: 'center',
		slot:true,
		style:'width:300px;',
        width: 90
	},{
		type:'Date',
		change: row => {
			console.log(row)
		},
		label:'交期',
		prop:'deliveryTime',
		align: 'center',
		style:'width:300px;',
        width: 100
	},{
		type:'Input',
		inputType: "number",
		label:'入库数量',
		prop:'entryNum',
		align: 'center',
		style:'width:300px;',
        width: 90
	},{
		type:'Date',
		change: row => {
			console.log(row)
		},
		label:'入库时间',
		prop:'entryTime',
		align: 'center',
		style:'width:300px;',
        width: 100
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
	},],
	options: {
		selection: true,
		tHeight:'70vh',
		isExpand:true,
		headerInput: true,
		headerWidth: '250',
        isFixedOperateColumn : 'right'
	},
	expandColumns:[{
			label:'订货会',
			prop:'sourceName',
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
			prop:'goodsNum',
			align:'center'
		},{
			label:'单件用量',
			prop:'onePiece',
			align:'center'
		}
	],
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
	}],
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
			value:false,
			label:'否'
		},{
			value:true,
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
	},{
		type: "Input",
		inputType:'number',
		label: "实际入库数量:",
		prop: "entryNum",
		placeholder: "请输入数量",
		rules: [{
			required: true,
			message: "请输入实际入库数量",
			trigger: "blur"
		}]
	}],
	expandOptions: {
		tHeight:'350px',
	},
	selectionId(list){
		return new Promise((res,rej)=>{
			let newData = list.reduce((total, current)=>{
				console.log(current)
				if(current.status != 1) rej(current.ingredientsCode + "已生成采购订单，不可以重复！")
				if(! current.supplierName) rej(current.ingredientsCode + "未选择供应商，不可以下单！")
				let {id} = current;
				total.push(id)
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
}
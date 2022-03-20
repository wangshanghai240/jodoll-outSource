import { get , post , del , put } from '../request'

export default{
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
	qualityLogData:{
		checkModule:'产前样批节点',
		isPassBase:'',
		remark:'',
	},
	qualityLogForm:[{
		type: "Input",
		label: "检查模块",
		clearable:true,
		prop: "checkModule",
		style:"width:200px",
		disabled:"disabled",
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
	existenceArrs(list1,list2){
		return new Promise((res,rej)=>{
			let obj = {
				haveIds:[],
				descriptions:[]
			}
			let newArr = list2.map ( item => item.value )
			list1.forEach(item=>{
				let bol = newArr.includes(item);
				console.log(item,'是否存在',bol)
				if(bol){
					obj['haveIds'].push(item)
				}else{
					obj['descriptions'].push(item)
				}
			})
			res(obj)
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
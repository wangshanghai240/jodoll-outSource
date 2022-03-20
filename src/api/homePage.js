import { get , post , del , put} from './request'


export default {
	stateOptions:[
		{
			value: '1',
			label: '开始'
		},
		{
			value: '2',
			label: '初步下单'
		},
		{
			value: '3',
			label: '签订合同'
		},
		{
			value: '5',
			label: '已批版'
		},
		{
			value: '6.2',
			label: '已到料'
		},
		{
			value: '6.4',
			label: '已开裁'
		},
		{
			value: '6.6',
			label: '已上线'
		},
		{
			value: '6.8',
			label: '已下线'
		},
		{
			value: '7',
			label: '已出货检'
		},
		{
			value: '8',
			label: '已入库检'
		}
	],
	//品类处理
	categoryHandler(list){
		return new Promise((res, rej) => {
			let newData = list.reduce((total, current) => {
				total.push({
					label: current,
					value: current
				})
				return total
			}, [])
			res(newData)
		})
	},
	//个数处理
	itemHandler(list,stateOptions){
		return new Promise((res, rej) => {
			let obj = {
				'green':[],
				'yellow':[],
				'red':[]
			};
			stateOptions.forEach((item,index)=>{
				let greenSize = list[item.value].greenSize?list[item.value].greenSize:'';
				let yellowSize = list[item.value].yellowSize?list[item.value].yellowSize:'';
				let redSize = list[item.value].redSize?list[item.value].redSize:'';
				obj['green'].unshift(greenSize);
				obj['yellow'].unshift(yellowSize);
				obj['red'].unshift(redSize);
				
				if(index==stateOptions.length-1){
					
					res(obj)
				}
			})
		})
	},
	//数量处理
	countHandler(list){
		return new Promise((res, rej) => {
			let obj = {
				'green':[],
				'yellow':[],
				'red':[]
			};
			Object.keys(list).forEach((item,index)=>{
				let greenCount = list[item].greenCount?list[item].greenCount:'';
				let yellowCount = list[item].yellowCount?list[item].yellowCount:'';
				let redCount = list[item].redCount?list[item].redCount:'';
				obj['green'].unshift(greenCount);
				obj['yellow'].unshift(yellowCount);
				obj['red'].unshift(redCount);
				if(index==Object.keys(list).length-1){
					res(obj)
				}
			})
		})
	},
	//sku处理
	skuNameHandler(list){
		return new Promise((res, rej) => {
			let select = {};
			let nameList = [];
			let codeList = [];
			let nameData = [];
			let newData = list.reduce((total, current) => {
				let {
					code,
					name
				} = current;
				if(list.length==1){
					select[name] = true;
				}else{
					select[name] = false;
				}
				nameList.push(name)
				codeList.push(code)
				nameData.push({
					'name':name,
					'value':0
				})
				total.push({
					code,
					name
				})
				return total
			}, [])
			res({newData,select,nameList,codeList,nameData})
		})
	},
	skuHandler(list){
		return new Promise((res, rej) => {
			let item = [{
				value:list.greenSize?list.greenSize:0,
				name:'正常',
				itemStyle: {color:"#91cc75"}
			},{
				value:list.yellowSize?list.yellowSize:0,
				name:'预警',
				itemStyle: {color:"#fac858"}
			},{
				value:list.redSize?list.redSize:0,
				name:'滞后',
				itemStyle: {color:"#ee6666"}
			}];
			let count = [{
				value:list.greenCount?list.greenCount:0,
				name:'正常',
				itemStyle: {color:"#91cc75"}
			},{
				value:list.yellowCount?list.yellowCount:0,
				name:'预警',
				itemStyle: {color:"#fac858"}
			},{
				value:list.redCount?list.redCount:0,
				name:'滞后',
				itemStyle: {color:"#ee6666"}
			}];
			res({item,count})
		})
	},
	//获取工厂
	getERP(list) {
		return new Promise((res, rej) => {
			let newData = list.reduce((total, current) => {
				let {
					gcmc,
					gcdm
				} = current;
				total.push({
					label: gcmc,
					value: gcdm
				})
				return total
			}, [])
			res(newData)
		})
	},
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(ores => {
				res(ores)
			}).catch(error => {
				rej(error)
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
	}
	// import(url,data){
		
	// }
}

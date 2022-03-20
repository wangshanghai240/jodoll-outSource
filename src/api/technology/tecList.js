import {get,post,del,put,upload} from '../request'

export default {
	columns: [{
		label: '编号',
		prop: 'serial',
		align: 'center',
	}, {
		label: '大类',
		prop: 'categoryBigName',
		align: 'center',
	}, {
		label: '品类',
		prop: 'categoryName',
		align: 'center',
	}, { 
		label: '名称',
		prop: 'name',
		width:200,
		align: 'center',
	}, {
		label: '状态',
		prop: 'status',
		slot:true,
		align: 'center',
	}, {
		label: '创建人',
		prop: 'createBy',
		align: 'center',
	}, {
		label: '创建时间',
		prop: 'createTime',
		width:180,
		sortable:true,
		align: 'center',
	}, {
		label: '修改人',
		prop: 'updateBy',
		align: 'center',
	}, {
		label: '修改时间',
		prop: 'updateTime',
		width:180,
		align: 'center',
	}],
	options: {
		index:true,
		tHeight:'70vh',
		headerWidth: '300',
		headerInput: true,
	},
	searchOptions:[{
		value: 0,
		label: '正常'
	},{
		value: 1,
		label: '锁定'
	}],
	get(url,params){
		return new Promise((res,rej)=>{
			get(url,params).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
	},
	post(url,data){
		return new Promise((res,rej)=>{
			post(url,data).then(success=>{
				res(success)
			}).catch(error=>{
				rej(error)
			})
		})
	},
	delete(url,id){
		return new Promise((res, rej) => {
			del(url,id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	//尺码数据处理
	sizeHandler(list){
		return new Promise((res,rej)=>{
			let newArr = list.reduce((total,current)=>{
				let { categoryName , id , series , size , status } = current;
				let label = size + ' (' + series + ')';
				let disabled = status===1;//true为锁定
				let obj = {'key':id.toString(),'label':label,'disabled':disabled};
				total.push(obj);
				return total
			},[])
			res(newArr)
		})
	},
	//部位数据处理
	positionHandler(list){
		return new Promise((res,rej)=>{
			let newArr = list.reduce((total,current)=>{
				let { name , id ,deviationMinus , deviationPositive ,measuring } = current;
				let obj = {'label':name,'key':id.toString(),deviationMinus,deviationPositive,measuring};
				total.push(obj);
				return total;
			},[])
			res(newArr)
		})
	},
	//列配置
	cloumnsList(list) {
		return new Promise((res, rej) => {
			let newArr = list.reduce((total, current) => {
				let obj = {
					'label': current.label,
					'prop': current.key,
					'align': 'center',
					'slot': true,
				}
				total.push(obj);
				return total
			}, [])
			res(newArr)
		})
	},
	//数据源
	dataSourceList(list,list2) {
		return new Promise((res, rej) => {
			//设置两条初始数据
			let dataSource = [...list2];
			let newArr = dataSource.reduce((total, current) => {
				let obj = {}
				list.forEach((item, index) => {
					let {
						prop,
						label
					} = item;
					//将列字段 与 数据 字段匹配 并赋初始值
					if (current[prop]) {
						obj[prop] = current[prop]
					} else {
						// obj[prop] = {
						// 	id: null,
						// 	value: 0
						// }
						obj[prop] = 0
					}
				})
				total.push(obj)
				return total
			}, [])
			res(newArr)
		})
	},
	//规格表 左列数据处理
	specificationsCloumns(list,header,list2,list3,index) {//尺码表配置列,规格表配置列,list2尺码表数据,list3部位数据,index尺码下标
		return new Promise((res, rej) => {
			if (list && list.length !== 1) {
				let newArr = list.reduce((total, current) => {
					let { label , prop } = current;//名称 or 唯一标识
					let obj = {};
					//console.log('规格表表头',header)
					header.forEach((item,hIndex)=>{
						if(hIndex==0){//首列 使用 部位数据
							obj['staticCloumn'] = label
						}else if(hIndex<header.length-3){//规格表 使用 尺码表内数据 排除末尾
							//获取尺码内的数据
							let nIndex = hIndex - index;//下标
							list2.forEach(sizeItem=>{
								if(sizeItem.staticCloumn=='标准值'){
									let difference = prop!=='staticCloumn'?list2[1][prop]:0;//档差
									let num = nIndex * difference;//档差距
									obj[item.prop] = Number(sizeItem[prop]) + num;
								}else if(sizeItem.staticCloumn=='档差'){
									obj['difference'] = sizeItem[prop]
								}
							})
							//obj[item.prop] = 1;
						}
					});
					list3.forEach(item=>{
						if(label==item.label){
							obj['deviationPositive'] = item.deviationPositive;//正值
							obj['deviationMinus'] = item.deviationMinus;//负值
							obj['measuring'] = item.measuring
						}
					});
					
					if (label) {
						total.push(obj);
					}
					return total
				}, [])
				res(newArr)
			} else {
				rej('规格表列配置为空')
			}
		})
	},
	//规格表 表头数据处理
	headerData(list) {
		return new Promise((res, rej) => {
			if (list && list.length !== 0) {
				let newArr = list.reduce((total, current) => {
					let {
						label,
						key
					} = current;
					let obj = {
						'label': label,
						'prop': key,
						'align': 'center',
						'slot': true,
					}
					total.push(obj);
					return total
				}, [])
				//传入 档位
				newArr.push({
					'label': '档差',
					'prop': 'difference',
					'align': 'center',
					'slot': true,
				})
				//传入正负 误差
				newArr.push({
					'label': '允许误差(正值)',
					'prop': 'deviationPositive',
					'align': 'center',
					'slot': true,
				})
				newArr.push({
					'label': '允许误差(负值)',
					'prop': 'deviationMinus',
					'align': 'center',
					'slot': true,
				})
				//传入 测量方法
				newArr.push({
					'label': '测量方法',
					'prop': 'measuring',
					'width': 250,
					'align': 'center',
				})
				//设置 左列
				let arr = [{
					'label': '规格表',
					'prop': 'staticCloumn',
					'align': 'center',
					'slot': true,
				}];
				arr = arr.concat(newArr)
				res(arr)
			} else {
				rej('规格表头配置为空')
			}
		})
	},
	//规格表提交数据处理
	objHandler(formData,id,sizeValue,standardList,partList,specificationsDataSource,options2){
		return new Promise((res,rej)=>{
			let standardTable = specificationsDataSource.reduce((total,current)=>{
				let {deviationMinus,deviationPositive,difference,measuring,staticCloumn,id} = current;
				let standardIdList = [];
				let values = [];
				let partId = null;
				//部位赋值
				options2.forEach(item=>{
					if(item.label==staticCloumn){
						partId = Number(item.key)
					}
				})
				standardIdList = standardList.map ( item => item.id );
				standardIdList.forEach(item=>{
					let obj1 = {
						'standardId':item,
						'value':current[item]
					}
					values.push(obj1)
				})
				let objs = {
					id,
					deviationMinus,
					deviationPositive,
					difference,
					measuring,
					staticCloumn,
					standardIdList,
					values,
					partId
				}
				total.push(objs)
				return total
			},[])
			let form = {
				categoryId:formData.id,
				id:id,
				name:formData.name,
				standardId:sizeValue,//标准尺码id
				standardList,//尺码
				partList,//部位
				standardTable,//规格表
			}
			res(form)
		})
	},
	//默认数据处理
	dataSourceHandler1(dataList) {
		return new Promise((res, rej) => {
			let arr = [];
			let obj = {};
			dataList.forEach((item, index) => {
				if (obj['size'] == item.size) {
					obj[item.partName] = {
						'measure': item.measure,
						'measureError': item.measureError,
					};
				} else {
					arr.push(obj)
					obj = {}
					obj['size'] = item.size;
					obj[item.partName] = {
						'measure': item.measure,
						'measureError': item.measureError,
					};
				}
				if (index == dataList.length - 1) {
					arr.push(obj); //末尾
					arr.splice(0, 1)
					res(arr)
				}
			})
		})
	},
	dataSourceHandler2(list, data, standardList) {
		return new Promise((res, rej) => {
			console.log(standardList)
			let headerData = data.reduce((total, current) => {
				list.forEach((item, index) => {
					if (index !== 0) {
						let standard = 0;
						let isExceed = null;
						let dev1 = 0;
						let dev2 = 0;
						let size = standardList.find(x => x.label == current.size).value;
						item.partStandardValueList.forEach(parts => {
							if (parts.standardId == size) {
								let str = current[item.prop].measure - parts
								.value; //初始误差
								dev1 = -parts.deviationMinus;
								dev2 = parts.deviationPositive;
								standard = parts.value;
								if (str <= dev1 || str >= dev2) { //计算溢出值
									isExceed = false;
								} else {
									isExceed = true;
								}
							}
						})
						current[item.prop]['standard'] = standard;
						current[item.prop]['dev1'] = dev1;
						current[item.prop]['dev2'] = dev2;
						current[item.prop]['isExceed'] = isExceed;
					}
				})
				total.push(current);
				return total
			}, [])
			res(headerData)
		})
	},
	dataSourceHandler3(list){
		return new Promise((res,rej)=>{
			let obj = {};
			list.forEach(item=>{
				let size = null;
				
				Object.keys(item).forEach(key=>{
					
					if(key=='size'){
						size = item[key]
					}else{
						if(!obj[key]){
							obj[key] = {};
						}
						obj[key][size] = {...item[key]}
					}
				})
			})
			res(obj)
		})
	},
	dataSourceHandler4(list){
		return new Promise((res,rej)=>{
			let arr = [];
			Object.keys(list).forEach(key=>{
				let obj = {};
				obj = {'part':key,...list[key]};
				arr.push(obj)
			})
			arr.push({'part':''})
			res(arr)
		})
	},
	//表头处理
	headerHandler(list) {
		return new Promise((res, rej) => {
			let headerList = [];
			list.forEach((item, index) => {
				let obj = {
					'label': item.name,
					'width': 130,
					'prop': item.name,
					'deviationMinus': item.deviationMinus,
					'deviationPositive': item.deviationPositive,
					'partStandardValueList': item.partStandardValueList,
					'align': 'center',
					'columns': [{
						'label': '实测',
						'prop': 'measure',
						'align': 'center',
					}, {
						'label': '误差',
						'prop': 'measureError',
						'align': 'center',
					}]
				};
				headerList.push(obj);
				if (index == list.length - 1) {
					res(headerList)
				}
			})
		})
	},
	//新增数据处理
	headerTurnData(list, size) {
		return new Promise((res, rej) => {
			let headerData = {}
			list.forEach((item, index) => {
				if (index !== 0) {
					let standard = 0;
					let measureError = 0;
					let isExceed = null;
					let dev1 = 0;
					let dev2 = 0;
					item.partStandardValueList.forEach(parts => {
	
						if (parts.standardId == size) {
							let str = 0 - parts.value; //初始误差
							dev1 = -parts.deviationMinus;
							dev2 = parts.deviationPositive;
							measureError = str;
							standard = parts.value;
							if (str <= dev1 || str >= dev2) { //计算溢出值
								isExceed = false;
							} else {
								isExceed = true;
							}
						}
					})
					headerData[item.prop] = {
						'measure': 0,
						'measureError': measureError,
						'standard': standard,
						'dev1': dev1,
						'dev2': dev2,
						'isExceed': isExceed,
					}
				}
				if (index == list.length - 1) {
					res(headerData)
				}
			})
		})
	},
	//提交数据处理(表格)
	dataTableHandler(list) {
		return new Promise((res, rej) => {
			if (list && list.length !== 0) {
				let newArr = []
				list.forEach((item, index) => {
					let size = null;
					Object.keys(item).forEach(key => {
						if (typeof item[key] == 'number') {
							size = item[key];
						}
	
					})
					Object.keys(item).forEach(key => {
						let obj = {
							'size': size
						}
						if (typeof item[key] == 'object') {
							obj['id'] = null;
							obj['measure'] = item[key].measure;
							obj['measureError'] = item[key].measureError;
							obj['partName'] = key;
							newArr.push(obj);
						}
	
					})
	
					if (index == list.length - 1) {
						res(newArr)
					}
				})
			} else {
				rej('规格检验表不能为空')
			}
	
			//res(newArr)
		})
	},
	// sizeHandler(list){
	// 	return new Promise((res,rej)=>{
	// 		if(list&&list.length!==0){
	// 			let newArr = list.reduce((total,current)=>{
	// 				let obj = {
	// 					key:current.id.toString(),
	// 					label:current.size.toString()
	// 				}
	// 				total.push(obj);
	// 				return total
	// 			},[])
	// 			res(newArr)
	// 		}else{
	// 			rej('尺码数据异常')
	// 		}
	// 	})
	// },
}

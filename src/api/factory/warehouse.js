import {
	get,
	post,
	del,
	put
} from '../request'

export default {
	columns: [{
		label: '商品编号',
		prop: 'goodsCode',
		align: 'center',
	}, {
		label: '厂家编号',
		prop: 'factoryCode',
		align: 'center',
	}, {
		label: '总数量',
		prop: 'total',
		align: 'center',
	}, {
		label: '已发数',
		prop: 'issuedQuantity',
		align: 'center',
	}, {
		label: '未发数',
		prop: 'usendQutity',
		align: 'center',
	}, {
		label: '通知入库数',
		prop: 'quantity',
		slot: true,
		align: 'center',
	}],
	options: {
		width: 50,
		tHeight: '50vh',
	},
	//基础信息
	warehouseForm: [{
		type: "Value",
		label: "生产工厂:",
		prop: "ghsmc",
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Value",
		label: "商品编号:",
		prop: "spdm",
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Value",
		label: "商品名称:",
		prop: "spmc",
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Value",
		label: "下单量:",
		prop: "number",
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Input",
		label: "检验数:",
		inputType:'number',
		prop: "checkNumber",
		placeholder: "请输入检验数",
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Select",
		label: "阶段:",
		prop: "stage",
		options: [{
			label: '初期',
			value: 1
		}, {
			label: '中期',
			value: 2
		}, {
			label: '末期',
			value: 3
		}],
		placeholder: "阶段",
		clearable: true,
		style: "width:150px",
		labelWidth: '100px',
		change: row => "",
		// type: "Input",
		// label: "阶段:",
		// prop: "stage",
		// placeholder: "请输入阶段",
		// style: "width:150px",
		// labelWidth: '100px',
	}, {
		type: "Date",
		label: "上线日期:",
		prop: "onlineDate",
		placeholder: "请选择日期",
		style: "width:150px",
		labelWidth: '100px',
		change: data => {
			console.log(data)
		},
	}, {
		type: "Date",
		label: "交货期:",
		prop: "deliveryDate",
		placeholder: "请选择日期",
		style: "width:150px",
		labelWidth: '100px',
		change: data => {
			console.log(data)
		},
	}, {
		type: "Input",
		label: "到货数:",
		inputType:'number',
		prop: "arriveNumber",
		inputType: 'number',
		style: "width:150px",
		labelWidth: '100px',
	}, {
		type: "Input",
		label: "生产情况:",
		prop: "productionInfo",
		style: "width:600px",
		labelWidth: '100px',
	}],
	warehouseData: {
		ghsmc: null,
		spdm: null,
		spmc: null,
		number: null,
		checkNumber: null,
		stage: null,
		onlineDate: null,
		deliveryDate: null,
		arriveNumber: null,
		productionInfo: null
	},
	//面辅料点检
	fabOrFacList: [{
		id: null,
		materialName: '面料',
		isPass: null
	}, {
		id: null,
		materialName: '里料',
		isPass: null
	}, {
		id: null,
		materialName: '吊牌',
		isPass: null
	}, {
		id: null,
		materialName: '商标',
		isPass: null
	}, {
		id: null,
		materialName: '洗水唛',
		isPass: null
	}, {
		id: null,
		materialName: '尺码标',
		isPass: null
	}, {
		id: null,
		materialName: '颜色布',
		isPass: null
	}, {
		id: null,
		materialName: '合格证',
		isPass: null
	}, {
		id: null,
		materialName: '绣花',
		isPass: null
	}, {
		id: null,
		materialName: '拉链',
		isPass: null
	}, {
		id: null,
		materialName: '纽扣',
		isPass: null
	}, {
		id: null,
		materialName: '拉片',
		isPass: null
	}, {
		id: null,
		materialName: '四件扣',
		isPass: null
	}, {
		id: null,
		materialName: '装饰件',
		isPass: null
	}, {
		id: null,
		materialName: '备用扣',
		isPass: null
	}, {
		id: null,
		materialName: '干燥剂',
		isPass: null
	}],
	//要点检查
	pointsList: [{
		intoId: null,
		name: '1.主标位置订法',
		isPass: null,

		remark: '',
		fileUrl: [],
		disable: true
	}, {
		intoId: null,
		name: '2.版型标位置订法',
		isPass: null,

		remark: '',
		fileUrl: [],
		disable: true
	}, {
		intoId: null,
		name: '3.水洗唛位置订法',
		isPass: null,

		remark: '',
		fileUrl: [],
		disable: true
	}, {
		intoId: null,
		name: '4.特色标位置订法',
		isPass: null,

		remark: '',
		fileUrl: [],
		disable: true
	}, {
		intoId: null,
		name: '5.挂牌位置',
		isPass: null,

		remark: '',
		fileUrl: [],
		disable: true
	}],
	//质量问题描述
	qualityList: [{
		id: null,
		name: '',
		number: '',
		state: ''
	}],
	defectOptions:[{
		value:1,
		label:'轻微'
	},{
		value:2,
		label:'致命'
	},{
		value:3,
		label:'严重'
	}],
	//结论
	attribute: [{
		value: 0,
		label: '无'
	},{
		value: 1,
		label: '轻微'
	}, {
		value: 2,
		label: '致命'
	}, {
		value: 3,
		label: '严重'
	}],
	handleOpinions: [{
		value: 1,
		label: '接受'
	}, {
		value: 2,
		label: '复检'
	}, {
		value: 3,
		label: '再检'
	}],
	get(url, params) {
		return new Promise((res, rej) => {
			get(url, params).then(resp => {
				res(resp)
			}).catch(err => {
				rej(err)
			})
		})
	},
	post(url, data) {
		return new Promise((res, rej) => {
			post(url, data).then(postRes => {
				res(postRes)
			}).catch(error => {
				rej(error)
			})
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
			let headerData = {};
			console.log('----------')
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
	//默认数据处理
	dataSourceHandler1(dataList) {
		return new Promise((res, rej) => {
			// let oldList = [
			// 	{
			// 	    "id": 5,
			// 	    "partName": "领围",
			// 	    "size": 44,
			// 	    "measure": 5,
			// 	    "measureError": 5
			// 	},
			// 	{
			// 	    "id": 6,
			// 	    "partName": "胸围",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 7,
			// 	    "partName": "腰围",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 8,
			// 	    "partName": "下摆",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 9,
			// 	    "partName": "袖口",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 10,
			// 	    "partName": "袖肥",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 11,
			// 	    "partName": "后中长",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 12,
			// 	    "partName": "肩宽",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},{
			// 	    "id": 13,
			// 	    "partName": "前胸宽",
			// 	    "size": 44,
			// 	    "measure": 0,
			// 	    "measureError": 0
			// 	},
			// ];
			if(dataList&&dataList.length!==0){
				let arr = [];
				let obj = {};
				dataList.forEach((item, index) => {
					if (obj['size'] == item.size) {
						obj[item.partName] = {
							'id': item.id,
							'measure': item.measure,
							'measureError': item.measureError,
						};
					} else {
						arr.push(obj)
						obj = {}
						obj['size'] = item.size;
						obj[item.partName] = {
							'id': item.id,
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
			}else{
				rej('数据转换01异常:数据为空')
			}
		})
	},
	dataSourceHandler2(list, data, standardList) {
		return new Promise((res, rej) => {
			if(list&&list.length!==0&&data&&data.length!==0&&standardList&&standardList.length!==0){
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
			}else{
				rej('数据转换02异常:部位/尺码/表数据为空')
			}
		})
	},
	dataSourceHandler3(list){
		return new Promise((res,rej)=>{
			if(list&&list.length!==0){
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
			}else{
				rej('数据转换03异常:数据为空')
			}
		})
	},
	dataSourceHandler4(list){
		return new Promise((res,rej)=>{
			if(list&&list.length!==0){
				let arr = [];
				Object.keys(list).forEach(key=>{
					let obj = {};
					obj = {'part':key,...list[key]};
					arr.push(obj)
				})
				arr.push({'part':''})
				res(arr)
			}else{
				rej('数据转换04异常:数据为空')
			}
			
		})
	},
	//表数据处理
	// dataSourceHandler(list){		
	// 	return new Promise((res,rej)=>{
	// 		let sizeObj = {};//记录
	// 		let data = list.reduce((total,current)=>{
	// 			let obj = {
	// 				'size':current.size,
	// 			}
	// 			if(!sizeObj[current.size]){
	// 				sizeObj[current.size] = current.size;
	// 				obj[current.partName] = {
	// 					'id':current.id,
	// 					'measure':current.measure,
	// 					'measureError':current.measureError,
	// 				}
	// 				total.push(obj)
	// 			}else{
	// 				total.forEach(item=>{
	// 					if(item.size==current.size){
	// 						item[current.partName] = {
	// 							'id':current.id,
	// 							'measure':current.measure,
	// 							'measureError':current.measureError,
	// 						}
	// 					}
	// 				})
	// 			}
	// 			return total;
	// 		},[])
	// 		res(data)
	// 	})
	// },
	//尺码数据处理
	sizeHandler(list) {
		return new Promise((res, rej) => {
			let newArr = list.reduce((total, current) => {
				let {
					categoryName,
					id,
					series,
					size,
					status
				} = current;
				let label = size;
				let disabled = status === 1; //true为锁定
				let obj = {
					'value': id,
					'label': label,
					'disabled': disabled
				};
				total.push(obj);
				return total
			}, [])
			res(newArr)
		})
	},
	//面辅料点检验证
	validatorFab(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				if(typeof item.isPass !== 'number'){
					rej('面辅料点检 存在未判断状态')
				}
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	validatorPoint(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				if(typeof item.isPass !== 'number'){
					rej('要点检查 存在未判断状态')
				}
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	//提交数据处理(表格)
	dataTableHandler(list) {
		return new Promise((res, rej) => {
			let newArr = []
			if (list && list.length !== 0) {
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
							obj['id'] = item[key].id;
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
				res(newArr)
			}

			//res(newArr)
		})
	}
}

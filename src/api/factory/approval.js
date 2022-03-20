import {
	get,
	post,
	del,
	put
} from '../request'
export default {
	//跟单员表格
	columns: [{
		label: '',
		prop: 'td',
		slot: true,
		align: 'center',
	}],
	gridData: [],
	//跟单员 品控
	list: [{
		id: null,
		label: '主标位置订法',
		isPass: '',
		remark: '',
		images: [],
		//disable: true
	}, {
		id: null,
		label: '版型标位置订法',
		isPass: '',

		remark: '',
		images: [],
		//disable: true
	}, {
		id: null,
		label: '水洗唛位置订法',
		isPass: '',

		remark: '',
		images: [],
		//disable: true
	}, {
		id: null,
		label: '特色标位置订法',
		isPass: '',

		remark: '',
		images: [],
		//disable: true
	}, {
		id: null,
		label: '挂牌位置',
		isPass: '',

		remark: '',
		images: [],
		//disable: true
	}],
	//设计开发
	development: {
		exteriorOpinion: '',
		list: [{
			label: '辅料',
			developmentList: [{
				id: null,
				label: '纽扣',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '拉链',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '标牌',
				isPass: '',

				remark: '',
				images: []
			}]
		}, {
			label: '面料',
			developmentList: [{
				id: null,
				label: '颜色',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '手感',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '纹理',
				isPass: '',

				remark: '',
				images: []
			}]
		}, {
			label: '款式',
			developmentList: [{
				id: null,
				label: '外观效果',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '内部解构',
				isPass: '',

				remark: '',
				images: []
			}]
		}, {
			label: '其他',
			developmentList: [{
				id: null,
				label: '印花',
				isPass: '',

				remark: '',
				images: []
			}, {
				id: null,
				label: '绣花',
				isPass: '',

				remark: '',
				images: []
			}]
		}]
	},
	//技术部
	technology: {
		exteriorOpinion: '',
		list: [{
			id: null,
			label: '原工艺单要求',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '版型',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '穿着外观效果',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '规格',
			isPass: '',
			remark: '',
			images: []
		}]
	},
	//品质
	quality: {
		opinion: '',
		list: [{
			id: null,
			label: '18401+纤维含量',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '色牢度',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '起毛起球',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '纰裂',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '缩水率',
			isPass: '',
			remark: '',
			images: []
		}, {
			id: null,
			label: '产品标识',
			isPass: '',
			remark: '',
			images: []
		}]
	},
	//跟单员数据处理
	specificationList(list, data) {
		return new Promise((res, rej) => {
			let i = 0;
			let specificationList = list.reduce((total, current) => {
				data.forEach((item, index) => {
					let value = current[item].value;
					let id = current[item].id;
					let goodsId = current[item].goodsId;
					if (!total[index] || total.length == 0) {
						total.push({
							'id': id,
							'goodsId': goodsId,
							'name': item,
							'sample': Number(value),
							'offset': '',
						})
					} else {
						total[index]['offset'] = Number(value)
					}
				})
				i++;
				return total
			}, [])
			if (i == 2) {
				res(specificationList)
			} else {
				rej('跟单员数据处理失败1')
			}
		})
	},
	reverseSpecificationList(headerList,list) {
		return new Promise((res, rej) => {
			let newArr = headerList.reduce((total,current)=>{
				list.forEach((item,index)=>{
					let name = item.name;
					if(current[name]&&current.td=='来样'){
						current[name].id = item.id;
						current[name].value = item.sample;
						current[name].goodsId = item.goodsId;
					}
					if(current[name]&&current.td=='误差'){
						current[name].id = item.id;
						current[name].value = item.offset;
						current[name].goodsId = item.goodsId;
					}
				})
				total.push(current)
				return total
			},[]);
			res(newArr)
		})
	},
	headerHandler(list){
		return new Promise((res,rej)=>{
			let newArr = [{
				label: '',
				prop: 'td',
				slot: true,
				align: 'center',
			}];
			list.forEach((item,index)=>{
				let obj =  {
					label: item.partName,
					prop: item.partName,
					slot: true,
					align: 'center',
				};
				newArr.push(obj);
				if(index==list.length-1){
					res(newArr)
				}
			})
		})
	},
	tableHandler(list,tableData){
		return new Promise((res,rej)=>{
			let arr = [{
				td: '来样',
			}, {
				td: '误差',
			}];
			let data = ['td']
			list.forEach((item,index)=>{
				data.push(item.partName)
				let obj1 =  {
					'id': null,
					'value': 0,
					'goodsId': null,
					'type': 'button',
					'deviationMinus':item.deviationMinus,
					'deviationPositive':item.deviationPositive,
					// 'difference':item.difference,
					// 'specificationId':item.specificationId,
					'standardName':item.partName,
					'standardValue':item.value
				};
				let obj2 = {
					'id': null,
					'value': 0-item.value,
					'goodsId': null,
					'type': 'text',
					'deviationMinus':item.deviationMinus,
					'deviationPositive':item.deviationPositive,
				}
				arr[0][item.partName] = obj1;
				arr[1][item.partName] = obj2;
				if(index==list.length-1){
					res([arr,data])
				}
			})
			
		})
	},
	sizeHandler(list){
		return new Promise((res,rej)=>{
			if(list&&list.length!==0){
				let newArr = list.reduce((total,current)=>{
					let obj = {
						value:current.id,
						label:current.size
					}
					total.push(obj);
					return total
				},[])
				res(newArr)
			}else{
				rej('尺码数据异常')
			}
		})
	},
	sizeIdHandler(list,size){
		return new Promise((res,rej)=>{
			let value = null;
			list.forEach((item,index)=>{
				if(item.label == size){
					value = item.value
				}
				if(index==list.length-1){
					if(value!==null){
						res(value)
					}else{
						rej('暂无对应尺码')
					}
				}
			})
		})
	},
	reverSize(list,size){
		return new Promise((res,rej)=>{
			list.forEach(item=>{
				if(item.value == size){
					res(item.value)
				}
			})
		})
	},
	//上传处理
	reverseList(list, data) {
		return new Promise((res, rej) => {
			let i = 0;
			let newArr;
			let reverseList = list.reduce((total, current) => {
				if (data) {
					data.forEach((item, index) => {
						if (item.label == current.label) {
							let {
								id,
								label,
								isPass,
								remark,
								images
							} = item
							let obj = {
								id,
								label,
								isPass,
								remark,
								images
							}
							current = obj;
						}
					})
				}
				total.push(current)
				i++;
				return total
			}, [])
			newArr = data.filter(item => !list.some(items => items.label === item.label))
			if (newArr) {
				newArr.forEach(item => {
					let {
						id,
						label,
						isPass,
						remark,
						images
					} = item
					reverseList.push({
						id,
						label,
						isPass,
						remark,
						images
					})
				})
			}
			res(reverseList)
			


			// if(data){
			// 	res(data)
			// }else{
			// 	res('跟单员数据处理失败')
			// }
		})
	},
	editionCheckList(list) {
		return new Promise((res, rej) => {
			let i = 0;
			let editionCheckList = list.reduce((total, current) => {
				let {
					images,
					isPass,
					label,
					remark,
					id
				} = current;
				total.push({
					images,
					isPass,
					label,
					remark,
					id
				})
				i++;
				return total
			}, []);
			if (i == list.length) {
				res(editionCheckList)
			} else {
				rej('跟单员数据处理失败4')
			}
		})
	},
	//设计开发数据处理
	reverseDevelopmentList(list, data) {
		return new Promise((res, rej) => {
			let i = 0;
			let development = list.reduce((total, current) => {
				if (data) {
					data.forEach(item => {
						if (item.label == current.label && item.editionCheckList.length !== 0) {
							current.developmentList = item.editionCheckList;
							current['goodsId'] = item.goodsId;
						}
					})
				}
				i++;
				total.push(current)
				return total
			}, [])
			if (i == list.length) {
				res(development)
			} else {
				rej('设计开发数据处理失败')
			}
		})
	},
	developmentList(list) {
		return new Promise((res, rej) => {
			let i = 0;
			let development = list.reduce((total, current) => {
				let {
					label,
					developmentList
				} = current;
				let arr = []
				developmentList.forEach(item => {
					let {
						images,
						isPass,
						label,
						remark,
						id
					} = item;
					arr.push({
						images,
						isPass,
						label,
						remark,
						id
					})
				})
				total.push({
					label,
					'editionCheckList': arr
				})
				i++
				return total
			}, [])
			if (i == list.length) {
				res(development)
			} else {
				rej('设计开发数据处理失败')
			}
		})
	},
	//技术部or品质部
	//技术部回传
	resverseEditionCheckList(list, data) {
		return new Promise((res, rej) => {
			let i = 0;
			let editionCheckList = list.reduce((total, current) => {
				if (data) {
					data.forEach(item => {
						if (item.label == current.label) {
							let {
								id,
								label,
								isPass,
								remark,
								images
							} = item
							let obj = {
								id,
								label,
								isPass,
								remark,
								images
							}
							current = obj;
						}
					})
				}
				total.push(current)
				i++;
				return total
			}, [])
			if (i == list.length) {
				res(editionCheckList)
			} else {
				rej('技术部回传数据处理失败')
			}
		})
	},
	//品质部回传
	resverseQualityList(list, data) {
		return new Promise((res, rej) => {
			let i = 0;
			let editionCheckList = list.list.reduce((total, current) => {
				if (data) {
					data.forEach(item => {
						if (item.label == current.label) {
							let {
								id,
								label,
								isPass,
								remark,
								images
							} = item
							let obj = {
								id,
								label,
								isPass,
								remark,
								images
							}
							current = obj;
						}
					})
				}
				total.push(current)
				i++;
				return total
			}, [])
			if (i == list.list.length) {
				res(editionCheckList)
			} else {
				rej('品质部回传数据处理失败')
			}
		})
	},
	tecAdoptOrQuaAdopt(list) {
		return new Promise((res, rej) => {
			let i = 0;
			let editionCheckList = list.reduce((total, current) => {
				let {
					images,
					isPass,
					label,
					remark
				} = current;
				total.push({
					images,
					isPass,
					label,
					remark
				})
				i++;
				return total
			}, [])
			if (i == list.length) {
				res(editionCheckList)
			} else {
				rej('数据处理失败')
			}
		})
	},
	verification(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				if(typeof item.isPass !== 'boolean'){
					rej('跟单员 存在未处理状态')
				}
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	verificationDev(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				item.developmentList.forEach(items=>{
					if(typeof items.isPass !== 'boolean'){
						rej('设计开发 存在未处理状态')
					}
				})
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	verificationTec(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				if(typeof item.isPass !== 'boolean'){
					rej('技术部 存在未处理状态')
				}
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	verificationQua(list){
		return new Promise((res,rej)=>{
			list.forEach((item,index)=>{
				if(typeof item.isPass !== 'boolean'){
					rej('品质部 存在未处理状态')
				}
				if(index==list.length-1){
					res(true)
				}
			})
		})
	},
	post(url, data) {
		return new Promise((res, rej) => {
			post(url, data).then(ores => {
				res(ores)
			}).catch(error => {
				rej(error)
			})
		})
	},
	get(url, data) {
		return new Promise((res, rej) => {
			get(url, data).then(obj => {
				res(obj)
			}).catch(error => {
				rej(error)
			})
		})
	},
}

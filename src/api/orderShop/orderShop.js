import {
	get,
	post,
	del,
	put,
	upload
} from '../request'


export default {
	pickerBeginDateAfter: {
		disabledDate: (time) => {
			return time.getTime() < Date.now()
		}
	},
	//交货状态
	state: [{
		label: "未交货",
		value: 0
	}, {
		label: "已交货",
		value: 1
	}],
	//来源类型
	sourceTypeData: [{
		label: "订货会",
		value: 1
	}],
	bomType: [{
		label: "未获取",
		value: 0
	}, {
		label: "已获取",
		value: 1
	}],
	searchType: [{
		label: '未生成',
		value: 0
	}, {
		label: '已生成',
		value: 1
	}],
	//类型
	lx: [{
		label: '成衣',
		value: 1
	}, {
		label: '加工',
		value: 2
	}],
	//当前状态
	dqzt: [{
			label: '订货会下单',
			value: 1
		}, {
			label: '工厂下单',
			value: 2
		}, {
			label: '签订合同',
			value: 3
		}, {
			label: '产前样齐料',
			value: 4
		}, {
			label: '产前样批版',
			value: 5
		}, {
			label: '大货齐料',
			value: 6
		},
		{
			label: '已到料',
			value: 6.2
		},
		{
			label: '已开裁',
			value: 6.4
		},
		{
			label: '已上线',
			value: 6.6
		},
		{
			label: '已下线',
			value: 6.8
		},
		{
			label: '出货检',
			value: 7
		}, {
			label: '入库检',
			value: 8
		}, {
			label: '入库完成',
			value: 9
		}
	],
	//是否变更
	slbg: [{
		label: '否',
		value: 0
	}, {
		label: '是',
		value: 1
	}],
	sourceData: [],
	columns: [{
		label: '来源类型',
		prop: 'sourceType',
		slot: true,
		align: 'center',
		width: 90,
	}, {
		label: '来源名称',
		prop: 'orderMeetingName',
		align: 'center',
		width: 100,
	}, {
		label: '系列',
		prop: 'sxmc',
		align: 'center',
		width: 80,
	}, {
		label: '加工类型',
		prop: 'lx',
		slot: true,
		align: 'center',
		width: 90,
	}, {
		label: '工厂',
		overflow: true,
		prop: 'ghsmc',
		align: 'center',
		slot: true,
		width: 200,
	}, {
		label: '品类',
		prop: 'dlmc',
		align: 'center',
		width: 80,
	}, {
		label: '商品货号',
		prop: 'spdm',
		align: 'center',
		width: 150,
	}, {
		label: '工厂货号',
		prop: 'gchh',
		align: 'center',
		width: 150,
	}, {
		label: '初始数量',
		prop: 'initialNumber',
		align: 'center',
		width: 100,
	}, {
		label: '数量',
		prop: 'sl',
		align: 'center',
		width: 80,
	}, {
		label:'备料量',
		prop:'preparationNum',
		align:'center',
		width:80
	},
	{
		label: '面料号',
		prop: 'mldm',
		align: 'center',
		width: 150,
	}, {
		label: '要求货期',
		prop: 'yqhq',
		align: 'center',
		width: 120,
	}, {
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
		width: 150,
	}, {
		label: '进度',
		prop: 'state',
		slot: true,
		align: 'center',
		width: 60,
	}, {
		label: '状态',
		prop: 'dqzt',
		slot: true,
		align: 'center',
		width: 110,
	}, {
		label: '已生成',
		prop: 'generate',
		width: 150,
		slot: true,
		align: 'center',
	}],
	//自定义配置
	options: {
		selection: true,
		width: 50,
		tHeight: '70vh',
		headerInput: true,
		isExpand: true,
	},
	expandColumns: [{
		label: '数量',
		prop: 'count',
		align: 'center',
	}, {
		label: '尺码',
		prop: 'size',
		align: 'center',
	}],
	expandOptions: {
		tHeight: '350px',
		headerInput: true,
	},
	//获取订货会列表
	getMeetingList(list) {
		return new Promise((res, rej) => {
			let {
				data
			} = list;
			let newData = data.reduce((total, current) => {
				let {
					id,
					name
				} = current;
				total.push({
					label: name,
					value: id
				})
				return total
			}, [])
			this.sourceData = newData;
			res(newData)
		})
	},
	getQuality(quality) {
		return new Promise((res, rej) => {
			let {
				data
			} = quality;
			let newData = data.reduce((total, current) => {
				let {
					id,
					description
				} = current;
				total.push({
					label: description,
					value: id
				})
				return total
			}, [])
			res(newData)
		})
	},
	selectionId(list, bol) {
		return new Promise((res, rej) => {
			let newData = list.reduce((total, current) => {
				let {
					id,
					bomUpdate,
					spdm
				} = current;
				if (bomUpdate !== 1 && bol) {
					rej(spdm + '未获取BOM,不能生成需求')
				}
				total.push(id)
				return total
			}, [])
			res(newData)
		})
	},
	existenceArrs(list1, list2) {
		return new Promise((res, rej) => {
			let obj = {
				haveIds: [],
				descriptions: []
			}
			let newArr = list2.map(item => item.value)
			list1.forEach(item => {
				let bol = newArr.includes(item);
				console.log(item, '是否存在', bol)
				if (bol) {
					obj['haveIds'].push(item)
				} else {
					obj['descriptions'].push(item)
				}
			})
			res(obj)
		})
	},
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
			}, [{
				label: '无',
				value: '无'
			}])
			res(newData)
		})
	},
	expandNum(list) {
		return new Promise((res, rej) => {
			let newData = list.reduce((total, current) => {

				return total
			}, [])
			res(newData)
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
	delete(url, id) {
		return new Promise((res, rej) => {
			del(url, id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	put(url, data) {
		return new Promise((res, rej) => {
			put(url, data).then(putRes => {
				res(putRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	get(url, params) {
		return new Promise((res, rej) => {
			get(url, params).then(getRes => {
				res(getRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	upload(url, data, token, isGet) {
		return upload(url, data, isGet, token)
	},
	nameOptions(list) {
		return new Promise((res, rej) => {
			let {
				data
			} = list;
			let newData = data.reduce((total, current) => {
				let {
					supplierName,
					supplierCode
				} = current;
				total.push({
					label: supplierName,
					value: supplierCode
				})
				return total
			}, [])
			res(newData)
		})
	},
	uploadList(list) {
		return new Promise((res, rej) => {
			let newArr = list.reduce((total, current) => {
				let {
					id,
					spdm
				} = current;
				total.push({
					id,
					spdm
				});
				return total;
			}, [])
			res(newArr)
		})
	}
}

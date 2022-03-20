import {
	get,
	post,
	del,
	put
} from '../request'

export default {
	isQualified:[{
		value: true,
		label: '合格'
	},{
		value: false,
		label: '不合格'
	}],
	statusOptions: [{
		label: '初期',
		value: 1
	}, {
		label: '中期',
		value: 2
	}, {
		label: '末期',
		value: 3
	}],
	columns:[{
		label: '编号',
		prop: 'intoCheckCode',
		align: 'center',
	},{
		label: '商品名称',
		prop: 'goodsName',
		align: 'center',
	},{
		label: '商品编号',
		prop: 'goodsCode',
		align: 'center',
	},{
		label: '检验数',
		prop: 'checkNumber',
		align: 'center',
	},{
		label: '到货数',
		prop: 'arriveNumber',
		align: 'center',
	},{
		label: '问题属性',
		prop: 'problem',
		slot:true,
		align: 'center',
	},{
		label: '处理意见',
		prop: 'resolution',
		slot:true,
		align: 'center',
	},{
		label: '工厂',
		prop: 'factoryName',
		align: 'center',
	},{
		label: '订单号',
		prop: 'orderNumber',
		align: 'center',
	},{
		label: '阶段',
		prop: 'stage',
		slot:true,
		align: 'center',
	},{
		label: '状态',
		prop: 'tempState',
		slot:true,
		align: 'center',
	},{
		label: '创建时间',
		prop: 'createTime',
		width:105,
		sortable:true,
		align: 'center',
	},{
		label: '操作人',
		prop: 'createBy',
		align: 'center',
	}],
	options:{
		width: 50,
		tHeight:'77vh',
		// index: true,
		// labelIndex: '编号',
		headerInput: true,
		headerWidth: '240',
	},
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
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(ores => {
				res(ores)
			}).catch(error => {
				rej(error)
			})
		})
	},
	get(url,params) {
		return new Promise((res, rej) => {
			get(url,params).then(getRes => {
				res(getRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
}
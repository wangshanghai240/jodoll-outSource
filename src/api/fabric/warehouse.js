import {
 	get,
 	post,
 	del,
 	put,
	upload
 } from '../request'

 export default {
 	columns: [{
 		label: '编号',
 		prop: 'serial',
		width:110,
 		align: 'center',
 	}, {
 		label: '面料名称',
 		prop: 'materialName',
		width:110,
 		align: 'center',
 	}, {
 		label: '面料编号',
 		prop: 'materialCode',
		width:130,
 		align: 'center',
 	}, {
 		label: '检验数',
 		prop: 'checkNum',
 		align: 'center',
 	}, {
 		label: '到货数',
 		prop: 'takeNum',
 		align: 'center',
 	}, {
 		label: '检验结果',
 		prop: 'isQualified',
		width:100,
		slot:true,
 		align: 'center',
 	}, {
 		label: '工厂',
 		prop: 'clientName',
		width:200,
 		align: 'center',
 	}, {
 		label: '订单号',
 		prop: 'orderNumber',
		width:150,
 		align: 'center',
 	}, {
 		label: '创建时间',
 		prop: 'updateTime',
 		width: 180,
 		sortable: true,
 		align: 'center',
 	}, {
 		label: '检验员',
 		prop: 'updateBy',
		width: 120,
 		align: 'center',
 	}],
 	options: {
 		width: 50,
 		tHeight: '77vh',
 		headerInput: true,
 		headerWidth: '220',
 	},
 	detailsColumns: [{
 		label: '匹号',
 		prop: 'equalNo',
 		slot: true,
 		align: 'center',
 	}, {
 		label: '标长(m)',
 		prop: 'normLength',
 		slot: true,
 		align: 'center',
 	}, {
 		label: '实长(m)',
 		prop: 'realityLength',
 		slot: true,
 		align: 'center',
 	}, {
 		label: '幅宽(cm)',
 		prop: 'breadth',
 		slot: true,
 		align: 'center',
 	}, {
 		label: '分析记录(色杠,粗纱,纱结,抽丝,纬斜等)',
 		prop: 'record',
 		width: 350,
 		slot: true,
 		align: 'center',
 	}, {
 		label: '结论',
 		prop: 'verdict',
 		width: 120,
 		slot: true,
 		align: 'center',
 	}],
	category1:[
		{
			'label':'面料',
			'isPass':false
		},{
			'label':'里布',
			'isPass':false
		},{
			'label':'布袋',
			'isPass':false
		},{
			'label':'大身衬',
			'isPass':false
		}
	],
	category2:[{
			'label':'挂面衬',
			'isPass':false
		},{
			'label':'腰衬',
			'isPass':false
		},{
			'label':'无纺衬',
			'isPass':false
		},{
			'label':'领底衬',
			'isPass':false
		}],
	category3:[{
			'label':'黑炭衬',
			'isPass':false
		},{
			'label':'胸棉',
			'isPass':false
		},{
			'label':'挺胸衬',
			'isPass':false
		},{
			'label':'弹袖棉',
			'isPass':false
		}],
	category4:[{
			'label':'马尾衬',
			'isPass':false
		},{
			'label':'领底呢',
			'isPass':false
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
 			post(url, data).then(success => {
 				res(success)
 			}).catch(error => {
 				rej(error)
 			})
 		})
 	},
 	put(url, data) {
 		return new Promise((res, rej) => {
 			put(url, data).then(list => {
 				res(list)
 			}).catch(error => {
 				rej(error)
 			})
 		})
 	},
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	},
	validateObj(obj){
		return new Promise((res,rej)=>{
			let bt = false;
			Object.keys(obj).forEach((key,index)=>{
				if(!obj[key]){
					bt = true
				}
				if(Object.keys(obj).length-1==index){
					res(bt)
				}
			})
		})
	}
 }

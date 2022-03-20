import { get , post , del , put , upload} from '../request'
const problemOptions = [{
	value:0,
	label:'无',
},{
	value:1,
    label:'轻微'
},{
    value:2,
    label:'致命'
},{
    value:3,
    label:'严重'
}]
const resolutionOptions = [{ 
    value:0,
    label:'接受'
},{
    value:1,
    label:'再检'
},{
    value:2,
    label:'复检'
}]
const stageOptions=[{
	value:1,
	label:'初期'
},{
	value:2,
	label:'中期'
},{
	value:3,
	label:'末期'
}]
export default {
	problemOptions:problemOptions,
	resolutionOptions:resolutionOptions,
	stageOptions:stageOptions,
	columns: [{
		label: '编号',
		prop: 'outCheckCode',
		width:120,
		align: 'center',
	},{
		label: '商品名称',
		prop: 'goodsName',
		width:90,
		align: 'center',
	},{
		label: '商品编号',
		prop: 'goodsCode',
		width:150,
		align: 'center',
	},{
		label: '检验数',
		prop: 'checkNumber',
		align: 'center',
	},{
		label: '问题属性',
		prop: 'problemAttribute',
		slot:true,
		width:100,
		align: 'center',
	},{
		label: '处理意见',
		prop: 'resolution',
		slot:true,
		width:100,
		align: 'center',
	},{
		label: '工厂',
		prop: 'factoryName',
		align: 'center',
	},{
		label: '订单号',
		prop: 'factoryOrderNumber',
		width:180,
		align: 'center'
	},{
		label: '阶段',
		prop: 'stage',
		slot:true,
		width:100,
		align: 'center'
	},{
		label: '操作时间',
		prop: 'updateTime',
		width:190,
		align: 'center'
	},{
		label: '操作人',
		prop: 'updateBy',
		align: 'center'
	}],
	//自定义配置
	options: {
		width: 50,
		tHeight:'77vh',
		headerInput: true,
		headerWidth: '350',
	},
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(postRes => {
				res(postRes)
			}).catch(error => {
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
	put(url,data) {
		return new Promise((res, rej) => {
			put(url,data).then(putRes => {
				res(putRes)
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
	upload(url,data,token,isGet){
		return upload(url,data,isGet,token)
	}
}
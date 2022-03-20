import { get , post , del , put , upload} from '../request'

export default {
	statusOptions:[{
		label: '未提交',
		value: 1
	},{
		label: '已完成',
		value: 2
	},{
		label: '已使用',
		value: 3
	}],
	columns: [{
		label: '编号',
		prop: 'serial',
		width:120,
		align: 'center',
	},{
		label: '工厂名称',
		prop: 'name',
		width:250,
		align: 'center',
	},{
		label: '商品编号', 
		prop: 'goodsCode', 
		width:150,
		align: 'center', 
	},{
		label: '创建人',
		prop: 'createBy',
		align: 'center',
	},{
		label: '创建时间',
		prop: 'createTime',
		width:170,
		align: 'center',
	},{
		label: '修改人',
		prop: 'updateBy',
		align: 'center',
	},{
		label: '修改时间',
		prop: 'updateTime',
		width:170,
		align: 'center',
	},{
		label: '状态',
		prop: 'status',
		slot:true,
		align: 'center'
	}],
	//自定义配置
	options: {
		width: 50,
		tHeight:'77vh',
		headerInput: true,
		selection: true,
		headerWidth: 425,
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

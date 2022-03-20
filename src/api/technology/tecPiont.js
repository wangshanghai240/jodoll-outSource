import { get , post , del , put , upload} from '../request'

export default {
	columns: [{
		label: '名称',
		prop: 'theme',
		align: 'center',
	},{
		label: '排序',
		prop: 'sort',
		sortable:true,
		align: 'center',
	},{
		label: '是否显示',
		prop: 'isShow',
		slot:true,
		align: 'center',
	},{
		label: '创建人',
		prop: 'createBy',
		align: 'center',
	},{
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
	},{
		label: '修改人',
		prop: 'updateBy',
		align: 'center',
	},{
		label: '修改时间',
		prop: 'updateTime',
		align: 'center',
	}],
	//自定义配置
	options: {
		width: 50,
		tHeight:'77vh',
		headerInput: true,
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
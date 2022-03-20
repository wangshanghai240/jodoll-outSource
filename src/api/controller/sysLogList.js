import { get , post , del , put} from '../request'

export default{
	columns : [{
		label: '操作',
		prop: 'operate',
		align: 'center'
	},{
		label: '操作Ip',
		prop: 'ip',
		align: 'center'
	},  {
		label: '操作人',
		prop: 'username',
		align: 'center'
	},  {
		label: '操作时间',
		prop: 'createTime',
		align: 'center'
	}],
	//自定义配置
	options: {
		label: 'id',
		selection: true,
		index: true,
		labelIndex: '序号',
		width: 50,
		tHeight:'70vh',
		// slotcontent:true,
		// slotname:'slot'
	},
	getSysLogPage(url,data){
		return new Promise((res, rej) => {
			get(url,data).then(ores => {
				res(ores.data)
			}).catch(error => {
				rej(error)
			})
		})
	},
}
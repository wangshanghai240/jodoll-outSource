import { get , post , del , put} from './request'



export default {
	quarterOptions:[{
		label:'春夏',
		value:'01'
	},{
		label:'秋冬',
		value:'02'
	}],
	columns: [{
		label: '名称',
		prop: 'name',
		align: 'center',
		width: 150,
	},　{
		label: '创建人',
		prop: 'createBy',
		align: 'center',
		props: {
			sortable: 'sortable',
		},
        width: 150,
	}, {
		label: '创建时间',
		prop: 'createTime',
		align: 'center',
		props: {
			sortable: 'sortable',
		},
	},{
		label: '季度',
		prop: 'yearQuarter',
		align: 'center',
		 width: 90,
		slot:true
	}, {
		label: '初始总量',
		prop: 'initTotalNumber',
		align: 'center',
		width: 100,
		props: {
			sortable: 'sortable',
		}
	}, {
		label: '总量',
		prop: 'totalNumber',
		align: 'center',
		width: 100,
		props: {
			sortable: 'sortable',
		}
	}],
	//自定义配置
	options: {
		label: 'id',
		selection: true,
		index: true,
		labelIndex: '序号',
		width: 50,
		tHeight:'70vh',
		headerInput: true,
		headerWidth: '550',
		// slotcontent:true,
		// slotname:'slot'
	},
	//导出按钮
	exportBut: [{
			'title': '导入商品',
			method: () => {
				console.log('导入商品')
			}
		},
		{
			'title': '导入数量明细',
			method: () => {
				console.log('导入数量明细')
			}
		}
	],
	//操作按钮
	// operates: [{
	// 	label: 'operation',
	// 	icon: 'el-icon-edit',
	// 	method: (row, index) => {
	// 		console.log(index)
	// 	}
	// }],
	//获取全部列表
	// getMeetingList(url) {
	// 	return new Promise((res, rej) => {
	// 		get(url).then(list => {
	// 			res(list.data)
	// 		}).catch(error => {
	// 			rej(error)
	// 		})
	// 	})
	// },
	// //新增
	// addMeeting(url,data) {
	// 	return new Promise((res, rej) => {
	// 		post(url,data).then(ores => {
	// 			res(ores)
	// 		}).catch(error => {
	// 			rej(error)
	// 		})
	// 	})
	// },
	post(url,data){
		return new Promise((res, rej) => {
			post(url,data).then(ores => {
				res(ores)
			}).catch(error => {
				rej(error)
			})
		})
	},
	deleteMeeting(url,id) {
		return new Promise((res, rej) => {
			del(url,id).then(list => {
				res(list)
			}).catch(error => {
				rej(error)
			})
		})
	},
	putMeeting(url,data) {
		return new Promise((res, rej) => {
			put(url,data).then(putRes => {
				res(putRes)
			}).catch(error => {
				rej(error)
			})
		})
	},
	get(url,params){
		return new Promise((res,rej)=>{
			get(url,params).then(resp=>{
				res(resp)
			}).catch(err=>{
				rej(err)
			})
		})
	}
	// import(url,data){
		
	// }
}

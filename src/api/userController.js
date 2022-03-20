
export default{
	columns : [{
		label: '年纪',
		prop: 'age',
		align: 'center',
		props: {
			sortable: 'sortable',
		}
	}, {
		label: '姓名',
		prop: 'name',
		align: 'center',
		props: {
			sortable: 'sortable',
		}
	}, {
		label: '手机号',
		prop: 'phone',
		align: 'center',
		props: {
			sortable: 'sortable',
		}
	}, {
		label: '性别',
		prop: 'sex',
		align: 'center',
		props: {
			sortable: 'sortable',
		}
	}],
	//自定义配置
	options : {
		label: 'id',
		selection: true,
		index: true,
		labelIndex: '序号',
		width: 50,
		// slotcontent:true,
		// slotname:'slot'
	},
	//导出按钮
	exportBut : [{
			'title': '导出',
			method: () => {
				console.log('导出按钮')
			}
		},
		{
			'title': '导入',
			method: () => {
				console.log('导入按钮')
			}
		}
	],
	//操作按钮
	operates : [{
		label: 'operation',
		icon: 'el-icon-edit',
		method: (row, index) => {
			console.log(index)
		}
	}]
}



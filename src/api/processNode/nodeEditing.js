import { get , post , del , put , upload} from '../request'

export default {
	columns: [{
		label: '节点编号',
		prop: '',
		align: 'center',
	},{
		label: '节点名称',
		prop: '',
		align: 'center',
	},{
		label: '节点耗时',
		prop: '',
		align: 'center',
	},{
		label: '前置节点',
		prop: '',
		align: 'center',
	},{
		label: '后置节点',
		prop: '',
		align: 'center',
	},{
		label: '编辑人',
		prop: '',
		align: 'center',
	},{
		label: '编辑时间',
		prop: '',
		align: 'center',
	}],
	options:{
		selection: true,
		width: 50,
		tHeight:'70vh',
		headerInput: true
	}
}
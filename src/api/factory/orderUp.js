import { post ,get,put} from '../request'

export default{
	columns: [{
		label: '面料名称',
		prop: 'name',
		align: 'center',
	}, {
		label: '面料编号',
		prop: 'code',
		align: 'center'
	}, {
		label: '总数量',
		prop: 'total',
		align: 'center',
	}, {
		label: '已发数',
		prop: 'issuedQuantity',
		align: 'center',
	}, {
		label: '未发数',
		prop: 'unsentQuantity',
		align: 'center',
	}, {
		label: '库存数',
		prop: 'inventoryQuantity',
		align: 'center',
	}],
}
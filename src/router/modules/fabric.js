import Layout from '@/layout'

const fabricRoutes = [//
	{
		path: '/fabric',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'fabric',
			icon: 'supplierOrder',
			isMenu: true,
			index: 2
		},
		children: [{
				path: 'demandList',
				component: () => import('@/views/fabric/demandList'),
				name: 'fabricDemand_list',
				meta: {
					title: 'demandList'
				}
			},{
				path: 'purchaseList',
				component: () => import('@/views/fabric/purchaseList'),
				name: 'fabricPurchase_list',
				meta: {
					title: 'purchaseList'
				}
			},{
				path: 'supplierOrder',
				component: () => import('@/views/fabric/supplierOrder'),
				name: 'fabricSupplierOrder_list',
				meta: {
					title: 'supplierOrder'
				}
			},{
				path: 'warehouse',
				component: () => import('@/views/fabric/warehouse'),
				name: 'warehouse',
				meta: {
					title: 'warehouse'
				}
			}
		]
	}
]


export default fabricRoutes

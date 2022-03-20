import Layout from '@/layout'

const ingredientsRoutes = [//ingredients
	{
		path: '/ingredients',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'ingredients',
			icon: 'bug',
			isMenu: true,
            index: 4
		},
		children: [{
				path: 'demandList',
				component: () => import('@/views/ingredients/demandList'),
				name: 'ingredientsDemand_list',
				meta: {
					title: 'ingredientsDemand'
				}
			},{
				path: 'purchaseList',
				component: () => import('@/views/ingredients/purchaseList'),
				name: 'ingredientsPurchase_list',
				meta: {
					title: 'ingredientsPurchase'
				}
			},{
				path: 'supplierOrder',
				component: () => import('@/views/ingredients/supplierOrder'),
				name: 'ingredientsSupplierOrder_list',
				meta: {
					title: 'ingredientsSupplierOrder'
				}
			},{
				path: 'intwarehousing',
				component: () => import('@/views/ingredients/warehousing'),
				name: 'warehousing',
				meta: {
					title: 'warehouse'
				}
			}
		]
	}
]


export default ingredientsRoutes

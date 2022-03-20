import Layout from '@/layout'

const factoryRoutes = [//工厂
	{
		path: '/factory',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'factory',
			icon: 'factoryList',
			isMenu: true,
            index: 5
		},
		children: [{
				path: 'factoryList',
				component: () => import('@/views/factory/factoryList'),
				name: 'factoryOrder_list',
				meta: {
					title: 'factoryList'
				}
			},{
				path: 'factoryShopList',
				component: () => import('@/views/factory/factoryShopList'),
				name: 'orderGoods_list',
				meta: {
					title: 'factoryShop'
				}
			},{
				path: 'factoryDelivery',
				component: () => import('@/views/factory/factoryDelivery'),
				name: 'factoryDelivery_list',
				meta: {
					title: 'factoryDelivery'
				}
			},{
				path: 'factoryWarehousing',
				component: () => import('@/views/factory/factoryWarehousing'),
				name: 'factoryWarehousing_list',
				meta: {
					title: 'factoryWarehousing'
				}
			},{
				path: 'approval',
				component: () => import('@/views/factory/approval'),
				name: 'approval_table',
				hidden: true,
				meta: {
					title: 'approval'
				}
			}
		]
	}
]


export default factoryRoutes

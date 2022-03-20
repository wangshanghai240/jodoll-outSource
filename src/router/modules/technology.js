import Layout from '@/layout'

const technologyRoutes = [//工艺单
	{
		path: '/technology',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'technology',
			icon: 'technology',
			isMenu: true,
            index: 9
		},
		children: [{
				path: 'technologyList',
				component: () => import('@/views/technology/tecList'),
				name: 'technology_list',
				meta: {
					title: 'technologyList'
				}
			},{
				path: 'technologyPiont',
				component: () => import('@/views/technology/tecPiont'),
				name: 'technologyPiont_list',
				meta: {
					title: 'technologyPiont'
				}
			},{
				path: 'technologyRequirements',
				component: () => import('@/views/technology/tecRequirements'),
				name: 'tecRequirements_list',
				meta: {
					title: 'tecRequirements'
				}
			},{
				path: 'technologyProcess',
				component: () => import('@/views/technology/tecProcess'),
				name: 'technologyProcess_list',
				meta: {
					title: 'technologyProcess'
				}
			},{
				path: 'tecaddList',
				component: () => import('@/views/technology/components/tecaddList'),
				name: 'craft_update',
				hidden:true,
				meta: {
					title: 'tecaddList'
				}
			}
		]
	}
]


export default technologyRoutes

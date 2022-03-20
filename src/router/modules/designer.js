import Layout from '@/layout'

const designerRoutes = [
	{
		path: '/designer',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'designer',
			icon: 'designer',
			isMenu: true,
			index: 10
		},
		children: [{
				path: 'index',
				component: () => import('@/views/designer/index'),
				name: 'designer',
				meta: {
					title: 'designerList',icon: 'designer', isMenu: true
				}
			}
		]
	}
]


export default designerRoutes

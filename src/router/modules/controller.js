import Layout from '@/layout'

const controllerRoutes = [
	{
		path: '/controller',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
			title: 'controller',
			icon: 'component',
			isMenu: true,
			index: 9
		},
		children: [{
				path: 'sysLog',
				component: () => import('@/views/controller/systemLog/sysLogList'),
				name: 'sysLog_list',
				meta: {
					title: 'sysLogList',icon: 'guide', isMenu: true
				}
			}
		]
	}
]


export default controllerRoutes

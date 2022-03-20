import Layout from '@/layout'

const processNodeRoutes = [
	{
		path: '/processNode',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
		// 	title: 'processNode',
		// 	icon: 'component',
		// 	isMenu: true
        	index:8
		},
		children: [{
				path: 'processInfo',
				component: () => import('@/views/processNode/processInfo'),
				name: 'processInfo_list',
				meta: {
					title: 'processInfo',icon: 'proNode',isMenu: true
				}
			},
			// {
			// 	path: 'nodeEditing',
			// 	component: () => import('@/views/processNode/nodeEditing'),
			// 	name: 'nodeEditing',
			// 	meta: {
			// 		title: 'nodeEditing'
			// 	}
			// }
		]
	}
]


export default processNodeRoutes

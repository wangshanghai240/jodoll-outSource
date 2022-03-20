import Layout from '@/layout'

const examiningReportRoutes = [
	{
		path: '/examiningReport',
		component: Layout,
		redirect: 'noRedirect',
		meta: {
		// 	title: 'examiningReport',
		// 	icon: 'clipboard',
		// 	isMenu: true
            index: 8
		},
		children: [{
				path: 'examiningReportList',
				component: () => import('@/views/examiningReport/examiningReport'),
				name: 'examiningReport_list',
				meta: {
					title: 'examiningReportList',icon: 'clipboard',isMenu: true
				}
			}
		]
	}
]


export default examiningReportRoutes

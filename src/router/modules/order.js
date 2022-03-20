import Layout from '@/layout'

const orderRoutes = [
	{
		path: '/orderMeeting',
		component: Layout,
		redirect: 'noRedirect',
        meta: {
            index: 0
        },
		children: [{
			path: 'orderMeeting',
			component: () => import('@/views/orderMeeting/orderMeeting'),
			name: 'orderMeeting_list',
			meta: {
				title: 'orderMeeting',icon: 'lock', isMenu: true
			}
		}]
	},
	{
		path: '/orderShop',
		component: Layout,
		redirect: 'noRedirect',
        meta: {
            index: 1
        },
		children: [{
			path: 'orderShop',
			component: () => import('@/views/orderShop/orderShop'),
			name: 'goods_list',
			meta: {
				title: 'orderShop',icon: 'list', isMenu: true
			}
		}]
	}
]


export default orderRoutes

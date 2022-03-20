
import router from '@/router'
import store from './boots/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // token
import getPageTitle from '@/utils/get-page-title' //标题

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login','/facContract','/ingContract','/fatContract','/conContract'] // 白名单'/dashboard'

router.beforeEach(async (to, from, next) => {

	NProgress.start()

	// 设置网页标题 to.meta.title
	document.title = getPageTitle()

	const hasToken = getToken()

	if (hasToken) {
		if (to.path === '/login') {
			// 有token直接登陆
			next({
				path: '/'
			})
			NProgress.done()
		} else {
			//获取用户权限
			const hasRoles = store.getters.roles && store.getters.roles.length > 0
			if (hasRoles) {
				next()
			} else {
				try {

					const rol = await store.dispatch('user/getInfo1')
					await store.dispatch('user/getInfo',rol.account)
					await store.dispatch('user/authorities', rol.authorities)
					//将权限加入到路由中
					const accessRoutes = await store.dispatch('permission/generateRoutes', rol)
					router.addRoutes(accessRoutes)
					next({ ...to, replace: true })

					// //获取当前角色
					// const rol = ['admin'];//角色权限
					// //获取所有模块
					// const roles = await store.dispatch('user/getInfo',rol)
					// //将权限加入到路由中，匹配角色所拥有的路由模块
					// const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
					// router.addRoutes(accessRoutes)
					// next({ ...to, replace: true })
				} catch (error) {
					console.log('error', error)
					NProgress.done()
				}
			}
		}
	} else {
		if (whiteList.indexOf(to.path) !== -1) {
			next()
		} else {
			//next()
			next(`/login?redirect=${to.path}`)
			NProgress.done()
		}
	}
})

router.afterEach(() => {
	NProgress.done()
})

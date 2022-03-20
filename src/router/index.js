
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局 */
import Layout from '@/layout'


export const constantRoutes = [
	{
	  path: '/redirect',
	  component: Layout,
	  hidden: true,
	  children: [
	    {
	      path: '/redirect/:path(.*)',
	      component: () => import('@/views/redirect/index')
	    }
	  ]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true,
		name: '登陆',
	},
	// {
	// 	path: '/',
	// 	component: Layout,
	// 	redirect: '/dashboard',
	// 	children: [
	// 	  {
	// 	    path: 'dashboard',
	// 	    component: () => import('@/views/About'),
	// 	    name: 'dashboard',
	// 	    meta: { title: 'dashboard', icon: 'dashboard', affix: true , isMenu: true }//affix 关闭 isMenu 主菜单
	// 	  }
	// 	]
	// },
    {
        path: '/',
        component: Layout,
        redirect: '/homePage',
        children: [
            {
                path: 'homePage',
                component: () => import('@/views/homePage/index'),
                name: 'homePage',
                meta: { title: 'homePage', icon: 'dashboard', affix: true , isMenu: true }//affix 关闭 isMenu 主菜单
            }
        ]
    },
	{
		path: '/facContract',
		component: () => import('@/views/fabric/components/share'),
		hidden: true,
		name: '面料合同查看',
	},
	{
		path: '/ingContract',
		component: () => import('@/views/ingredients/components/share'),
		hidden: true,
		name: '辅料合同查看',
	},{
		path:'/fatContract',
		component: () => import('@/views/factory/components/hanjian'),
		hidden: true,
		name: '函件预览',
	},{
		path:'/conContract', 
		component: () => import('@/views/factory/components/contracthan'),
		hidden: true,
		name: '合同预览',
	}
]

/* 模块 */
const modulesFiles = require.context('./modules', true, /\.js$/)

export const asyncRoutes = modulesFiles.keys().reduce((routes, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  value.default.forEach(router=>{
	  routes.push(router)
  })
  console.log(process.env.VUE_APP_BASE_URL)
  //modules[moduleName] = value.default
  return routes
}, []).sort(function(a,b){
	if(!a.meta) return 1;
    if(!b.meta) return -1;
    return a.meta.index  - b.meta.index});


const createRouter = () => new Router({
	mode: 'hash',
	base: process.env.BASE_URL,
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router

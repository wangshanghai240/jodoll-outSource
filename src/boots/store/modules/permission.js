import {asyncRoutes, constantRoutes} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
function hasPermission(roles, route) {
    if (route.name) {
        if ("/" === route.name) return true;
        return roles.some(permission => permission.authority === route.name)
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []
    routes.forEach(route => {
        const tmp = {...route}
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    generateRoutes({commit}, roles) {
        return new Promise(resolve => {
            let list = [];
            let accessedRoutes
            if (roles.account.includes('custom')) {
                list = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles.authorities)
                accessedRoutes.forEach(e => {
                    if (e.children.length > 0) {
                        list.push(e)
                    }
                })
            }
            commit('SET_ROUTES', list)
            resolve(list)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

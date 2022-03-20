import {del, post, get} from '@/api/request'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import {MessageBox, Message} from 'element-ui'
import api from '@/api/index'

const state = {
    token: getToken(),
	userInfo:'',
    headerContent: false,
    name: '',
    avatar: '',
    introduction: '',
    buttonPermissions: [],
    roles: [],
	search:null,
	accountInfo:null,
	messageNum:0,
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
	SET_USERINFO: (state, userInfo) => {
		 state.userInfo = userInfo
	},
	SET_MESSAGENUM: (state, messageNum) => {
		 state.messageNum = messageNum
	},
	SET_SEARCH: (state, search) => {
	    state.search = search
	},
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        console.log(roles)
        state.roles = roles
    },
    SET_HEADERCONTENT: (state, headerContent) => {
        state.headerContent = headerContent
    },
    SET_BUTTON_PERMISSIONS(state, btnPermissions) {
        state.buttonPermissions = btnPermissions
    },
	SET_ACCOUNTINFO(state, data) {
	    state.accountInfo = data
	}
}

const actions = {
	setSearch({commit}, data){
		commit('SET_SEARCH', data)
	},
    // user login
    login({commit}, userInfo) {
        const {username, password} = userInfo
        return new Promise((resolve, reject) => {
            post(api.login, {username: username.trim(), password: password}).then(response => {
                Message({
                    message: response.message,
                    type: 'success',
                    duration: 5 * 1000
                })
                const {data} = response
                commit('SET_TOKEN', data.access_token)
                setToken(data.access_token)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    authorities({commit, state}, data) {
        let permissions = data;
        let permissions_btn = [];
        permissions.forEach(per => {
            if (per.authority.indexOf(":") !== -1) {
                permissions_btn.push(per)
            }
        });
        commit("SET_BUTTON_PERMISSIONS", permissions_btn);
    },
    // 获取用户的信息，并获取权限及用户信息
    getInfo1({commit, state}) {
        return new Promise((resolve, reject) => {
            get(api.userInfo).then(response => {
                const {data} = response;
                console.log("response+++",response)
                if (!data) {
                    reject('获取权限异常')
                }
				commit('SET_USERINFO', data)
				commit('SET_NAME', data.nickName)
                const {roles} = data
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    data.roles = ["editor"]
                }
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // get user info
    getInfo({commit, state}, data) {
        return new Promise((resolve, reject) => {
            //接口
            commit('SET_ROLES', data)
            resolve(data)
            // get(api.userInfo).then(response => {
            // 	const { data } = response
            // }).catch(error => {
            // 	reject(error)
            // })

            // getInfo(state.token).then(response => {
            // 	const {data} = response

            // 	if (!data) {
            // 		reject('Verification failed, please Login again.')
            // 	}

            // 	const {roles,name,avatar,introduction} = data

            // 	// roles must be a non-empty array
            // 	if (!roles || roles.length <= 0) {
            // 		reject('getInfo: roles must be a non-null array!')
            // 	}

            // 	commit('SET_ROLES', roles)
            // 	commit('SET_NAME', name)
            // 	commit('SET_AVATAR', avatar)
            // 	commit('SET_INTRODUCTION', introduction)
            // 	resolve(data)
            // }).catch(error => {
            // 	reject(error)
            // })
        })
    },

    // user logout
    logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            del(api.logout).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()

                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, {
                    root: true
                })

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    async changeRoles({commit, dispatch}, role) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)

        const {
            roles
        } = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', roles, {
            root: true
        })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, {
            root: true
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

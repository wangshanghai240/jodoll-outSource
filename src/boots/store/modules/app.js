import {
	getLanguage
} from '@/boots/lang/index'

const state = {
	sidebar: {
		opened: sessionStorage.getItem('sidebarStatus') ? !!+sessionStorage.getItem('sidebarStatus') : true,
		withoutAnimation: false
	},
	device: 'desktop',
	language: getLanguage(),
	size: sessionStorage.getItem('size') || 'small',
	menuScroll: sessionStorage.getItem('sidebarStatus') ? sessionStorage.getItem('sidebarStatus') : false,
	postParams:false,
	outCgToken:''
}

const mutations = {
	SET_OUTCGTOKEN:(state,token) => {
		state.outCgToken = token
	},
	TOGGLE_SIDEBAR: state => {
		state.sidebar.opened = !state.sidebar.opened
		state.sidebar.withoutAnimation = false
		if (state.sidebar.opened) {
			sessionStorage.setItem('sidebarStatus', 1)
		} else {
			sessionStorage.setItem('sidebarStatus', 0)
		}
	},
	CLOSE_SIDEBAR: (state, withoutAnimation) => {
		sessionStorage.setItem('sidebarStatus', 0)
		state.sidebar.opened = false
		state.sidebar.withoutAnimation = withoutAnimation
	},
	TOGGLE_DEVICE: (state, device) => {
		state.device = device
	},
	TOGGLE_MENUSCROLL: (state, menuScroll) => {
		state.menuScroll = menuScroll
		sessionStorage.setItem('menuScroll', menuScroll)
	},
	SET_SIZE: (state, size) => {
		state.size = size
		sessionStorage.setItem('size', size)
	},
	SET_LANGUAGE: (state, language) => {
		state.language = language
		sessionStorage.setItem('language', language)
	},
	SET_POSTPARAMS: (state, bol) => {
		state.postParams = bol
	}
}

const actions = {
	toggleSideBar({commit}) {
		commit('TOGGLE_SIDEBAR')
	},
	closeSideBar({commit}, {withoutAnimation}) {
		commit('CLOSE_SIDEBAR', withoutAnimation)
	},
	toggleDevice({commit}, device) {
		commit('TOGGLE_DEVICE', device)
	},
	toggleMenuScroll({commit}, menuScroll) {
		commit('TOGGLE_MENUSCROLL', menuScroll)
	},
	setSize({commit}, size) {
		// switch(size){
		// 	case 'medium':
		// 	window.document.documentElement.setAttribute('data-size', 0);
		// 	console.log(window.document.documentElement)
		// 	break;
		// 	case 'small':
		// 	window.document.documentElement.setAttribute('data-size', 1);
		// 	break;
		// 	case 'mini':
		// 	window.document.documentElement.setAttribute('data-size', 2);
		// 	break;
		// 	default:
		// 	window.document.documentElement.setAttribute('data-size', 1);
		// }
		commit('SET_SIZE', size)
	},
	setLanguage({commit}, language) {
		commit('SET_LANGUAGE', language)
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}

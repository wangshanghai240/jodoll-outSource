const state = {
	orderName:'',
	factoryList:[],
	categoryList:[],
}

const mutations = {
	SET_ORDERNAME: (state, name) => {
		state.orderName = name
	},
	REMOVE_ORDERNAME: (state) => {
		state.orderName = ''
	},
	SET_FACTORYLIST: (state, list) => {
		state.factoryList = list
	},
	SET_CATEGORYLIST: (state, list) => {
		state.categoryList = list
	}
}

const actions ={
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
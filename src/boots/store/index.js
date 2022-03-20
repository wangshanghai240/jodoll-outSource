/**
 * @FileDescription: 状态集成
 * @Author: wangpenghui
 * @Date: 2020/10/11
 * @LastEditors: wangpenghui
 * @LastEditTime: 2020/11/12
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)


const modulesFiles = require.context('./modules', true, /\.js$/)


const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

export default store

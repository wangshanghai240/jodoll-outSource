/**
 * @FileDescription: 抽取
 * @Author: wangpenghui
 * @Date: 2020/10/11
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/8
 */
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  language: state => state.app.language,//语言
  device: state => state.app.device,
  menuScroll: state => state.app.menuScroll,
  postParams: state => state.app.postParams,//post params

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  token: state => state.user.token,
  userInfo: state => state.user.userInfo,//用户信息
  messageNum: state => state.user.messageNum,//待办数
  headerContent: state => state.user.headerContent,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  search: state => state.user.search,//全局搜索条件-工厂
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  accountInfo: state => state.user.accountInfo,

  permission_routes: state => state.permission.routes,

  errorLogs: state => state.errorLog.logs,

  fixedHeader: state => state.settings.fixedHeader,
  needTagsView: state => state.settings.tagsView,
  showSettings: state => state.settings.showSettings,
  showDrawer: state => state.settings.showDrawer,//抽屉
  //中间存储
  orderName: state => state.transfer.orderName,
  factoryList: state => state.transfer.factoryList,
  categoryList: state => state.transfer.categoryList,

  button_permissions: state => state.user.buttonPermissions,
}
export default getters

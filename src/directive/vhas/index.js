import Vue from 'vue'
import store from '../../boots/store'

/**权限指令**/

const has = Vue.directive('has', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding,vnode) {
    const btnPermissions = store.getters && store.getters.button_permissions;
    // 获取指令按钮权限
    let action = binding.arg;
    let routeName = vnode.context.$route.name;
    let per = routeName + ":" + action
    let isExist = false;
    if (btnPermissions && per && btnPermissions instanceof Array && btnPermissions.length > 0) {
      isExist = btnPermissions.some(btn => btn.authority == per)
    }
    if (!isExist) {
      el.parentNode.removeChild(el);
    }
  }
});
export default has

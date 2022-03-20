<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
//import { getToken, setToken } from '@/utils/auth'
export default {
  name: 'app',
  // created() {
	 //  var that = this
	 //  document.addEventListener('visibilitychange', function() {
	 //    if (that.$store.state.app.outCgToken != getToken()&&getToken()) {
	 //      // location.reload();
		//   that.logout();
	 //    }
	 //  })
  // },
  // methods:{
	 //  async logout() {
	 //  	await this.$store.dispatch('user/logout')
	 //  	this.$router.push(`/login?redirect=${this.$route.fullPath}`)
	 //  }
  // }
}
</script>
<style lang="scss">
	#app{
		overflow: hidden;
	}
// *{ 
//  -webkit-touch-callout:none; /*系统默认菜单被禁用*/
//  -webkit-user-select:none; /*webkit浏览器*/
//  -khtml-user-select:none; /*早期浏览器*/
//  -moz-user-select:none;/*火狐*/
//  -ms-user-select:none; /*IE10*/
//  user-select:none; 
// }
@font-face {
  font-family: 'iconfont';  /* project id 2461981 */
  src: url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.eot');
  src: url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.woff') format('woff'),
  url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_2461981_tx4jrz1y1r7.svg#iconfont') format('svg');
}
</style>

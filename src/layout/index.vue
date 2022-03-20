<!--
 * @FileDescription: 右侧抽屉
 * @Author: wangpenghui
 * @Date: 2020/10/15
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/6
 -->
<template>
	<div :class="classObj" class="app-wrapper" id="layout">
		<!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
		<div :class="{hasTagsView:needTagsView}">
			<div :class="{'fixed-header':fixedHeader}">
				<navbar class="not-select"/>
				<tags-view v-if="needTagsView" />
			</div>
			<div style="display: flex;">
				<sidebar :class="device==='mobile'&&!sidebar.opened?'sidebar-container-mobile':'sidebar-container'" />
				<app-main class="main-container" :class="device==='mobile'?'main-container-mobile':''"/>
			</div>
			<!-- <right-panel v-if="showSettings">
				<Query @func="getDialog"/>
			</right-panel> -->
		</div>
		
		<Search class="search" v-model.sync="rightDialog"></Search>
	</div>
</template>

<script>
	import RightPanel from '@/components/RightPanel'
	import { AppMain, Navbar, Query, Sidebar, TagsView , Search} from './components'
	import ResizeMixin from './mixin/ResizeHandler'
	import {loading} from '@/utils'
	import { mapGetters } from 'vuex'
	
	export default {
		name: 'Layout',
		components: {RightPanel,AppMain,Navbar,Sidebar,TagsView,Query,Search},
		mixins: [ResizeMixin],
		computed: {
			...mapGetters([
				'sidebar',
				'device',
				'showSettings',
				'needTagsView',
				'fixedHeader',
				'size',
			]),
			classObj() {
				return {
					hideSidebar: !this.sidebar.opened,
					openSidebar: this.sidebar.opened,
					withoutAnimation: this.sidebar.withoutAnimation,
					mobile: this.device === 'mobile'
				}
			}
		},
		data() {
			return {
				rightDialog:false,//查询弹框
				
			}
		},
		created() {
			const docEl = document.getElementById('app')
			console.log(this.size)
			switch (this.size) {
				case 'medium':
					docEl.style = 'font-size:18px!important'
					//window.document.documentElement.setAttribute('data-size', 0)
					break;
				case 'small':
					docEl.style = 'font-size:15px!important'
					//window.document.documentElement.setAttribute('data-size', 1)
					break;
				case 'mini':
					docEl.style = 'font-size:12px!important'
					//window.document.documentElement.setAttribute('data-size', 2)
					break;
				default:
					docEl.style = 'font-size:18px!important'
					//window.document.documentElement.setAttribute('data-size', 1)
			}
		},
		methods: {
			handleClickOutside() {
				this.$store.dispatch('app/closeSideBar', {
					withoutAnimation: false
				})
			},
			getDialog(data){
				this.rightDialog = data
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~@/styles/mixin.scss";
	@import "~@/styles/variables.scss";
	
	.search{
		z-index: 80000!important;
	}
	.el-picker-panel .el-date-range-picker .el-popper{
		z-index: 80001!important;
	}
	.app-wrapper {
		@include clearfix;
		position: relative;
		height: 100%;
		width: 100%;

		&.mobile.openSidebar {
			position: fixed;
			top: 0;
		}
	}

	.drawer-bg {
		background: #000;
		opacity: 0.3;
		width: 100%;
		top: 0;
		height: 100%;
		position: absolute;
		z-index: 999;
	}

	.fixed-header {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9;
		width: calc(100% - #{$sideBarWidth});
		transition: width 0.28s;
	}

	.hideSidebar .fixed-header {
		width: calc(100% - 54px)
	}

	.mobile .fixed-header {
		width: 100%;
	}
</style>

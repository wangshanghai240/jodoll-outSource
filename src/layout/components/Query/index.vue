
<template>
	<div class="drawer-container">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="搜索" name="first" class="cardFirst">
				<drag-select @func="floatingUp"></drag-select>
			</el-tab-pane>
			<el-tab-pane label="高级搜索" name="second">
				高级搜索
			</el-tab-pane>
			<el-tab-pane label="设置" name="setting">
				<jod-i18n></jod-i18n>
			</el-tab-pane>
		</el-tabs>
		<!-- <div>
      <h3 class="drawer-title">Page style setting</h3>

      <div class="drawer-item">
        <span>Theme Color</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div>

      <div class="drawer-item">
        <span>Open Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Fixed Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>Sidebar Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div> -->
	</div>
</template>

<script>
	// import ThemePicker from '@/components/ThemePicker'
	import DragSelect from './dragSelect'
	export default {
		name: 'query',
		components: {
			DragSelect
		},
		data() {
			return {
				activeName: 'first',
				
			}
		},
		// computed: {
		//   fixedHeader: {
		//     get() {
		//       return this.$store.state.settings.fixedHeader
		//     },
		//     set(val) {
		//       this.$store.dispatch('settings/changeSetting', {
		//         key: 'fixedHeader',
		//         value: val
		//       })
		//     }
		//   },
		//   tagsView: {
		//     get() {
		//       return this.$store.state.settings.tagsView
		//     },
		//     set(val) {
		//       this.$store.dispatch('settings/changeSetting', {
		//         key: 'tagsView',
		//         value: val
		//       })
		//     }
		//   },
		//   sidebarLogo: {
		//     get() {
		//       return this.$store.state.settings.sidebarLogo
		//     },
		//     set(val) {
		//       this.$store.dispatch('settings/changeSetting', {
		//         key: 'sidebarLogo',
		//         value: val
		//       })
		//     }
		//   }
		// },
		methods: {
			floatingUp(data){
				this.$emit('func',data)
			}
			// themeChange(val) {
			//   this.$store.dispatch('settings/changeSetting', {
			//     key: 'theme',
			//     value: val
			//   })
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.drawer-container {
		padding: 24px;
		font-size: 14px;
		line-height: 1.5;
		word-wrap: break-word;

		// .drawer-title {
		// 	margin-bottom: 12px;
		// 	color: rgba(0, 0, 0, .85);
		// 	font-size: 14px;
		// 	line-height: 22px;
		// }

		// .drawer-item {
		// 	color: rgba(0, 0, 0, .65);
		// 	font-size: 14px;
		// 	padding: 12px 0;
		// }

		// .drawer-switch {
		// 	float: right
		// }
		.cardFirst{
			height: calc(100vh - 104px)!important;
		}
	}
</style>

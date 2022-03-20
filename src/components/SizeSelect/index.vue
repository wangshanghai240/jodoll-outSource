<!--
 * @FileDescription: 字体布局
 * @Author: wangpenghui
 * @Date: 2020/10/15
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/6
 -->
<template>
	<el-dropdown trigger="click" @command="handleSetSize">
		<div>
			<svg-icon class-name="size-icon" icon-class="size" />
		</div>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item v-for="item of sizeOptions" :key="item.value" :disabled="size===item.value" :command="item.value">
				{{ $t('size.'+item.label) }}
			</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				sizeOptions: [{
						label: 'default',
						value: 'default'
					},
					{
						label: 'medium',
						value: 'medium'
					},
					{
						label: 'small',
						value: 'small'
					},
					{
						label: 'mini',
						value: 'mini'
					}
				]
			}
		},
		computed: {
			...mapGetters([
			  'size',
			])
		},
		methods: {
			handleSetSize(size) {
				this.$ELEMENT.size = size
				this.$store.dispatch('app/setSize', size)
				this.refreshView()
				this.$message({
					message: '切换大小成功',
					type: 'success'
				})
			},
			refreshView() {
				this.$store.dispatch('tagsView/delAllCachedViews', this.$route)
				
				// 用于重新加载页面过渡，若是有数据缓存可用
				const {
					fullPath
				} = this.$route

				this.$nextTick(() => {
					this.$router.replace({
						path: '/redirect' + fullPath
					})
				})
			}
		}

	}
</script>

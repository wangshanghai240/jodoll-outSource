
<template>
	<div>
		<el-drag-select v-model="value" style="width:300px;" multiple placeholder="请选择">
			<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
		</el-drag-select>
		
		<div style="margin-top:30px;">
			<el-tag v-for="item of value" :key="item" style="margin-right:15px;">
				{{ item }}
			</el-tag>
		</div>
		<div class="drawer__bt">
			<el-button style="" @click="changeDialog">新增查询条件</el-button>
		</div>
		
		<div class="drawer__footer">
			<jod-calendar></jod-calendar>
			<el-button type="primary" plain style="width: 100%;margin-top: 100px;" @click="inquireAbout">查询</el-button>
		</div>
	</div>
</template>

<script>
	import ElDragSelect from '@/components/DragSelect'

	export default {

		components: {
			ElDragSelect
		},
		data(){
			return{
				value: ['Apple', 'Banana', 'Orange'],
				options: [{
					value: 'Apple',
					label: 'Apple'
				}, {
					value: 'Banana',
					label: 'Banana'
				}, {
					value: 'Orange',
					label: 'Orange'
				}, {
					value: 'Pear',
					label: 'Pear'
				}, {
					value: 'Strawberry',
					label: 'Strawberry'
				}],
			}
		},
		methods:{
			changeDialog(){
				this.$emit('func',true)
			},
			inquireAbout(){
				this.$store.commit('settings/CHANGE_SHOWDRAWER')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.drawer__bt{
		margin-top: 30px;
	}
	.drawer__footer{
		width: 100%;
		position: absolute;
		bottom: 0px;
		left: 0px;
	}
</style>

<!--
 * @FileDescription: 节点编辑
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="nodeEditing"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
		
		
		<!-- 表外 -->
		<template v-slot:content_context>
			
		</template>
	</jod-tableList>
</template>

<script>
	import nodeEditing from '@/api/processNode/nodeEditing.js'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		data(){
			return{
				gridData:[],//源数据
				columns: nodeEditing.columns,
				options: nodeEditing.options,
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
			}
		},
		methods:{
			handleChangePage(current){
				console.log(current)
			},
			handleSizeChange(page){
				console.log(page)
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			}
		}
	}
</script>

<style>
</style>

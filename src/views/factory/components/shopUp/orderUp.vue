<!--
 * @FileDescription: 面料or辅料发货组件
 * @Author: 王
 * @Date: 2021/9/26
 -->
<template>
	<div>
		<jod-tableList :dataSource="gridData" :columns="columns" :options="options"
		  @handleSelectionChange="handleSelectionChange">
		  
		
		</jod-tableList>
	</div>
</template>

<script>
	import json from '@/api/factory/orderUp.js'
	export default{
		props:{
			value:{
				type:String,
				default:''
			},
			//配置
			newOptions:{
				type:Object,
				default:()=>{
					return {
						selection: true,
						tHeight: '200',
						headerInput: true,
					}
				}
			}
		},
		data() {
			return{
				gridData:[],
				columns:json.columns,
				options: {},
			}
		},
		created() {
			console.log(this.value);
			this.options = this.newOptions;
		},
		methods:{
			handleSelectionChange(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>

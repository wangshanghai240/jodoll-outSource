<template>
	<jod-tableList :dataSource="dataSource" :columns="columns" :options="options">
	</jod-tableList>
</template>

<script>
	import skus from '@/api/fabric/sku.js'
	export default {
		name:'sku',
		props:{
			value:{
				type:String
			}
		},
		watch:{
			value(v){
				this.id = v
			},
		},
		data(){
			return{
				id:this.value,
				dataSource:[],
				columns:skus.columns,
				options:skus.options
			}
		},
		mounted() {
			this.getSku()
		},
		methods:{
			getSku(){
				skus.get(this.api.getPurchaseDetail,this.id).then(res=>{
					let {data} = res;
					this.$message.success('查询成功')
					this.dataSource = data;
				})
			}
		}
	}
</script>

<style>
</style>

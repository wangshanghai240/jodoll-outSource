<!--
 * @FileDescription: 工厂入库检-搜索
 * @Author: wangpenghui
 -->
<template>
	<transition name="fade" mode="out-in">
		<jod-formSearch labelWidth="120px" ref="searchwarehouseForm" :searchData="searchwarehouseData" :searchForm="searchwarehouseForm"
		 :searchHandle="searchwarehouseHandle">
		</jod-formSearch>
	</transition>
</template>

<script>
	import warehous from '@/api/factory/factoryWarehousing.js'
	export default {
		props:{
			value:{
				type:Object,
				default:()=>{}
			}
		},
		data(){
			return{
				//搜索配置
				searchwarehouseData: this.value,
				searchwarehouseForm:[{
					type: "Input",
					label: "检验编号:",
					prop: "intoCheckCode",
					placeholder: "请输入检验编号",
					style:"width:200px",
				},{
					type: "Input",
					label: "商品名:",
					prop: "goodsName",
					placeholder: "请输入商品名",
					style:"width:200px",
				},{
					type: "Input",
					label: "商品编号:",
					prop: "goodsCode",
					placeholder: "请输入商品编号",
					style:"width:200px",
				},{
					type: "Input",
					label: "订单号:",
					prop: "orderNumber",
					placeholder: "请输入订单号",
					style:"width:200px",
				},{
					type: "Input",
					label: "工厂:",
					prop: "factoryName",
					style:"width:200px",
					//type: "Select",
					// options: [],
					placeholder: "请输入工厂",
					// clearable:true,
					// change: row => "",
				},{
					type: "Select",
					//type: "Input",
					label: "问题属性:",
					prop: "problem",
					options: [...warehous.attribute],
					placeholder: "请输入问题属性",
					clearable:true,
					style:"width:200px",
					change: row => "",
				},{
					type: "Select",
					//type: "Input",
					label: "处理意见:",
					prop: "resolution",
					options: [...warehous.handleOpinions],
					placeholder: "请输入处理意见",
					clearable:true,
					style:"width:200px",
					change: row => "",
				}],
				searchwarehouseHandle: [{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['searchwarehouseForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									this.searchwarehouseHandle[0].loading = true;
									this.$emit('searchClose',false,this.searchwarehouseData)
								} else {
									return false;
								}
							});
						},
						hide: false,
					}, {
						label: "重置",
						type: "warning",
						handle: res => {
							this.searchwarehouseData = {
								intoCheckCode:'',
								goodsName:'',
								goodsCode:'',
								orderNumber:'',
								factoryName:'',
								problem:'',
								resolution:''
							}
							// this.$refs['searchwarehouseForm'].$refs['searchForm'].resetFields();
						},
						hide: false,
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.$emit('searchClose',false)
						},
						hide: false,
					}
				],
			}
		}
	}
</script>

<style>
</style>

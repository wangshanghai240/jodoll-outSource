<!--
 * @FileDescription: 面料入库检-搜索
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
			return {
				//搜索配置
				searchwarehouseData: this.value,
				searchwarehouseForm:[{
					type: "Input",
					label: "面料编号:",
					prop: "materialCode",
					placeholder: "请输入面料编号",
					style:"width:200px",
				},{
					type: "Input",
					label: "面料名称:",
					prop: "materialName",
					placeholder: "请输入面料名称",
					style:"width:200px",
				},{
					type: "Select",
					label: "检验结果:",
					prop: "isQualified",
					placeholder: "请选择检验结果",
					options: [...warehous.isQualified],
					clearable:true,
					style:"width:200px",
					change: row => "",
				},{
					type: "Input",
					label: "工厂:",
					prop: "clientName",
					placeholder: "请输入工厂",
					style:"width:200px",
				},{
					type: "Input",
					label: "订单号:",
					prop: "orderNumber",
					style:"width:200px",
					//type: "Select",
					// options: [],
					placeholder: "请输入订单号",
					// clearable:true,
					// change: row => "",
				},{
					//type: "Select",
					type: "Input",
					label: "检验员:",
					prop: "updateBy",
					//options: [],
					placeholder: "请输入检验员",
					//clearable:true,
					style:"width:200px",
					//change: row => "",
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
								materialCode:'',
								materialName:'',
								isQualified:'',
								clientName:'',
								orderNumber:'',
								updateBy:''
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

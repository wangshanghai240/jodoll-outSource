<template>
	<jod-dragDialog v-model="searchDialog" title="查询" class="tableDialog">
		<jod-formSearch labelWidth="120px" ref="searchForm" :searchData="searchData" :searchForm="searchForm" 
			:searchHandle="searchHandle">
		</jod-formSearch>
	</jod-dragDialog>
</template>

<script>
	export default {
		name:'search',
		props:{
			value:{
				type:Boolean,
				default:false
			}
		},
		watch:{
			value(v){
				this.searchDialog = v;
			},
			searchDialog(v){
				this.$emit('input', v)
			}
		},
		data() {
			return{
				searchDialog: this.value, //查询弹窗
				searchData: {
					daterange:[]
				},
				searchForm: [{
						type: "Daterange",
						label: "起止时间:",
						prop: "daterange",
						//pickerOptions: pickerBeginDateAfter,
						// rules: [{
						// 	type: 'array',
						// 	required: true,
						// 	message: '请选择日期',
						// 	trigger: 'change',
						// }],
						change: res => {
							console.log(res)
						}
					},
				],
				searchHandle: [{//表单按钮配置
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['searchForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.searchHandle[0].loading = true;
								let form = {
									start:this.searchData['daterange'][0],
									end:this.searchData['daterange'][1]
								}
								
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "重置",
					type: "warning",
					handle: res => {
						console.log(this.$refs['searchForm'].$refs['searchForm'])
						this.$refs['searchForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.addDialog = false;
						this.$refs['searchForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}],
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>

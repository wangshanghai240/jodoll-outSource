<!--
 * @FileDescription: 发货
 * @Author: wangpenghui
 * @Date: 2021/1/15
 -->
<template>
	<jod-formSearch labelWidth="120px" ref="deliverForm" :searchData="deliverData" :searchForm="deliverForm"
		:searchHandle="deliverHandle">
	</jod-formSearch>
</template>

<script>
	import deliverGoods from '@/api/fabric/deliverGoods.js'
	export default {
		name:'deliverForm',
		props:{
			value:String
		},
		watch:{
			value(v){
				this.deliverData.goodsId = v;
			},
		},
		data(){
			let checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("手机号不能为空"));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确的手机号"));
					}
				}
			};
			return{
				deliverData:{
					address:'',
					expressName:'',
					expressNo:'',
					goodsId:this.value,
					model:'',
					name:'',
					phone:''
				},
				deliverForm:[{
						type: "Input",
						label: "收货地址:",
						prop: "address",
						width: "180px",
						placeholder: "请填写收货地址",
						rules: [{
							required: true,
							message: "请填写收货地址",
							trigger: "blur"
						}],
					},{
						type: "Input",
						label: "快递名称:",
						prop: "expressName",
						width: "180px",
						placeholder: "请填写快递名称",
						rules: [{
							required: true,
							message: "请填写快递名称",
							trigger: "blur"
						}]
					},{
						type: "Input",
						label: "物流号:",
						prop: "expressNo",
						width: "180px",
						placeholder: "请填写物流号",
						rules: [{
							required: true,
							message: "请填写物流号",
							trigger: "blur"
						}]
					},{
						type: "Select",
						label: "模块:",
						prop: "model",
						style:"width:200px",
						clearable:true,
						options: [...deliverGoods.modelOptions],
						change: row => {
							console.log(row)
						},
						placeholder: "请选择模块",
						rules: [{
							required: true,
							message: "请选择模块",
							trigger: "change"
						}],
					},{
						type: "Input",
						label: "收货人:",
						prop: "name",
						width: "180px",
						placeholder: "请填写收货人",
						rules: [{
							required: true,
							message: "请填写收货人",
							trigger: "blur"
						}]
					},{
						type: "Input",
						label: "联系电话:",
						prop: "phone",
						width: "180px",
						placeholder: "请填写联系电话",
						rules: [{
							required: true,
							validator: checkPhone,
							trigger: "blur"
						}]
					}],
				deliverHandle:[{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['deliverForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.deliverHandle[0].loading = true;
								deliverGoods.post(this.api.express,this.deliverData).then(res=>{
									console.log(res)
									this.deliverHandle[0].loading = false;
									this.$message.success('发货申请已提交')
									this.$refs.['deliverForm'].$refs['searchForm'].resetFields();
									this.$emit('dioFalse',false)
								}).catch(err=>{
									this.$refs.['deliverForm'].$refs['searchForm'].resetFields();
									this.deliverHandle[0].loading = false;
								})
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
						this.$refs.['deliverForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.$emit('dioFalse',false)
					},
					hide: false,
				}]
			}
		}
	}
</script>

<style>
</style>

<template>
	<jod-formSearch 
	 class="searchForm" 
	 labelWidth="120px" 
	 ref="searchForm" 
	 :searchData="searchData" 
	 :searchForm="searchForm"
	 :searchHandle="searchHandle">
	</jod-formSearch>
</template>

<script>
	import processUp from '@/api/factory/processUp.js'
	import {mapGetters} from 'vuex'
	import api from '@/api/index.js'
	import { getLocalTime } from '@/utils'
	export default {
		name:'processUp',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props:{
			value:{
				type:Array
			}
		},
		watch:{
			value(v){
				console.log(v)
				this.base = v
			}
		},
		data() {
			let caseState = [{
					label: "总经办",
					value: '1'
				},
				{
					label: "品牌事业部",
					value: '2'
				},{
					label:"行政中心",
					value: '3'
				},{
					label:"生产中心",
					value: '4'
				},{
					label:"职服中心",
					value: '5'
				},{
					label:"采购中心",
					value: '6'
				},{
					label:"财务中心",
					value: '7'
				},{
					label:"人资中心",
					value: '8'
				},{
					label:"流程与信息中心",
					value: '9'
				},{
					label:"风险控制部",
					value: '10'
				},{
					label:"乔顿衬衫",
					value: '11'
				}
			];
			return {
				header:{},
				base:this.value,
				model:this.value[4],
				// 如果数据要回显后不可编辑，使用JSON.parse(JSON.stringify())转换
				searchData: {
					contactName:this.value[0],
					orderNumber: this.value[1],
					releDept: '2',
					payment: '',
					isSign: true,
					isTamp: true,
					// checkbox: [],//必要
					applyTime: this.getDate(),
					firstPaymentTime: this.getDate2(),
					contract: [],
					summary:this.value[0] + '文字合同',
					fileUpload: [],//必要
					contactNo:'',
				},
				fileName: this.value[2], // 合同函附件名
				fileUrl: this.value[3], // 合同函附件路径
				searchForm: [{
					type: "Input",
					label: "合同名称:",
					prop: "contactName",
					style:"width:200px",
					placeholder: "请输入",
				}, {
					type: "Input",
					label: "工厂订单:",
					prop: "orderNumber",
					style:"width:200px",
					placeholder: "请输入订单号",
					// 表单验证
					rules: [{
						required: true,
						message: "请输入订单号",
						trigger: "blur"
					}]
				}, {
					type: "Input",
					label: "合同编号:",
					prop: "contactNo",
					style:"width:200px",
					placeholder: "请输入",
					rules: [{
						required: true,
						message: "请输入合同编号",
						trigger: "blur"
					}]
				},{
					type: "Select",
					label: "归口部门:",
					prop: "releDept",
					// 渲染数组
					options: caseState,
					// 下拉转换
					//props: entrustProps,
					style:"width:200px",
					change: row => "",
					placeholder: "请选择部门",
				}, {
					type: "Input",
					label: "支付方式:",
					prop: "payment",
					placeholder: "请输入支付方式",
					style:"width:200px",
					rules: [{
						required: true,
						message: "请输入支付方式",
						trigger: "blur"
					}]
				}, {
					type: "Date",
					label: "申请日期:",
					prop: "applyTime",
					placeholder: "请选择日期",
					style:"width:200px",
					change: data => {
						console.log(data)
					}
				},{
					type: "Switch",
					label: "是否盖章:",
					prop: "isTamp",
				}, {
					type: "Switch",
					label: "原件是否签收:",
					prop: "isSign",
				}, {
					type: "Date",
					label: "首次付款时间:",
					prop: "firstPaymentTime",
					placeholder: "请选择日期",
					style:"width:200px",
					disable: res => {
						return true
					},
					change: time => {
						console.log(time)
					}
				}, {
					type: "Daterange",
					label: "合同期限:",
					prop: "contract",
					change: res => {
						console.log(res)
					},
					rules: [{
						required: true,
						message: "请选择合同日期",
						trigger: "blur"
					}]
				}, {
					type:"Text",
					label:"合同概要:",
					prop:"summary",
					style:"width:400px;height:200px;resize:none",
				}],
				searchHandle: [{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['searchForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.searchHandle[0].loading = true;
								var sign = ''
								var tamp = ''
								console.log(this.searchData)
								if(this.searchData.isSign == true){
									sign = 1
								}else{
									sign = 0
								}
								if(this.searchData.isTamp == true){
									tamp = 1
								}else{
									tamp = 0
								}
								let filePath = this.searchData.fileUpload.length!==0?this.searchData.fileUpload[0].response.data.fileHttpPath:'';
								console.log(this.searchData.fileUpload)
								var contractCheck = {
									applyTime:this.searchData.applyTime,
									contactName:this.searchData.contactName,
								 	contractPeriodBegin:this.searchData.contract[0],
									contractPeriodEnd:this.searchData.contract[1],
									filePath:filePath,
									firstPaymentTime:this.searchData.firstPaymentTime,
									isSign:sign,
									isTamp:tamp,
									orderNumber:this.searchData.orderNumber,
									payment:this.searchData.payment,
									releDept:this.searchData.releDept,
									summary:this.searchData.summary,
									contractNo:this.searchData.contactNo,
									model:this.model,
									fileName:this.fileName,
								}
								let formdata = new FormData();
								formdata.append('file',this.fileUrl,this.fileName);
								formdata.append('contact',JSON.stringify(contractCheck));
								// this.$store.commit('user/SET_HEADERCONTENT', true)
								processUp.post(this.api.contactCheck,formdata,{
									headers: {
										"Content-Type": "multipart/form-data"
									}
								}).then(res=>{ 
									console.log(res)
									if(res.code == 0){
										this.searchHandle[0].loading = false;
										this.$message.success('提交成功')
										this.$emit('proClose',false)
									}
								}).catch(err=>{
									this.searchHandle[0].loading = false;
								})
							} else {
								this.searchHandle[0].loading = false;
								this.$message.warning('提交失败')
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "重置",
					type: "warning",
					handle: res => {
						console.log(this.token)
						console.log(this.$refs['searchForm'].$refs['searchForm'])
						this.$refs['searchForm'].$refs['searchForm'].resetFields();
					}
				}, {
					label: "取消",
					type: "primary",
					handle: res => {
						this.$emit('proClose',true)
					}
				}],
				ruleForm: {}
			};
		},
		created() {
			this.searchForm.push({
				type: "fileUpload",
				label: "图片上传:",
				headers: {'Authorization':this.token},
				prop: "fileUpload",
				upload: process.env.VUE_APP_BASE_URL+this.api.uploadQualit,
			})
		},
		mounted() {			
			this.getList()
		},
		methods: {
			getList(){
				console.log('1',this.base)
			},
			// 下拉选择
			changeNull(row) {},
			getDate(){
				const nowDate = new Date();
				const date = {
				    year: nowDate.getFullYear(),
				    month: nowDate.getMonth() + 1,
				    date: nowDate.getDate(),
				}
				const newmonth = date.month>9?date.month:'0'+date.month
				const day = date.date>9?date.date:'0'+date.date
				// this.applyTime = date.year + '-' + newmonth + '-' + day
				var time = date.year + '-' + newmonth + '-' + day
				return time
			},
			getDate2(){
				const nowDate = new Date();
				const date = {
				    year: nowDate.getFullYear(),
				    month: nowDate.getMonth() + 1,
				    date: nowDate.getDate() + 7,
				}
				if(date.month == 1 ||date.month == 3 ||date.month == 5||date.month == 7||date.month == 8||date.month == 10||date.month == 12){
					if(date.date > 31){
						date.month = date.month + 1
						date.date = date.date - 31
					}
				}else if(date.month == 4||date.month == 6||date.month == 9||date.month == 11){
					if(date.date > 30){
						date.month = date.month + 1
						date.date = date.date - 30
					}
				}else if(date.month == 2){
					if(date.date > 28){
						date.month = date.month + 1
						date.date = date.date - 28
					}
				}
				
				const newmonth = date.month>9?date.month:'0'+date.month
				const day = date.date>9?date.date:'0'+date.date
				// this.applyTime = date.year + '-' + newmonth + '-' + day
				var time = date.year + '-' + newmonth + '-' + day
				console.log(time)
				return time
			}
		}
	}
</script>
<style lang="scss" scoped>
	.searchForm {
		padding-top: 20px;
		// height: calc(100vh - 115px);
		// overflow: scroll;
	}
</style>

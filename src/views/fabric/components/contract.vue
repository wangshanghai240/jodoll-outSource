<!--
 * @FileDescription: 面料合同确认
 * @Author: wangpenghui
 -->
<template>
	<div>
		<jod-formSearch labelWidth="120px" ref="confirmForm" :searchData="conData" :searchForm="conForm">
		</jod-formSearch>
		<el-alert
		    title="面料详情列表"
			:closable="false"
		    type="info"
		    show-icon>
		  </el-alert>
		<jod-tableList :dataSource="confrimData" :columns="confrimColumns" 
			:options="confrimOptions" ref="confirmTable">
			<template v-slot:content_context>
				<!--弹出框-->
				<!--合同流程-->
				<jod-dragDialog v-model="proUpDio" title="合同流程" class="tableDialog" :modal="false" :dialogStyle="{width: '750',widthType: 'px'}" @closeDio="proCloseDio">
					<process-up v-model="dgmc" v-if="proUpDio" :model="1" @proClose="proClose(arguments)"></process-up>
				</jod-dragDialog>
			</template>
			<!-- 金额 -->
			<template slot="money" slot-scope="{row,$index}">
				<span>{{row.price*row.purchaseNum}}</span>
			</template>
			<!-- 优先级 -->
			<template slot="sort" slot-scope="{row,$index}">
				<el-tag effect="plain" type="info" :size="size" v-if="row.sort==1">
					{{row.sort?sortOptions[row.sort-1].label:row.sort}}
				</el-tag>
				<el-tag effect="plain" type="" :size="size" v-else-if="row.sort==2">
					{{row.sort?sortOptions[row.sort-1].label:row.sort}}
				</el-tag>
				<el-tag effect="plain" type="warning" :size="size" v-else-if="row.sort==3">
					{{row.sort?sortOptions[row.sort-1].label:row.sort}}
				</el-tag>
				<el-tag effect="plain" type="danger" :size="size" v-else-if="row.sort==4">
					{{row.sort?sortOptions[row.sort-1].label:row.sort}}
				</el-tag>
			</template>
			<!-- 单价 -->
			<template slot="price" slot-scope="{row,$index}">
				<el-input v-model="row.price" @input="moneyUpdate" :size = "size"></el-input>
			</template>
			<!-- 入库完成 -->
			<template slot="isEntry" slot-scope="{row,$index}">
				<span>{{row.isEntry||row.isEntry==0?isEntryOptions[row.isEntry].label:row.isEntry}}</span>
			</template>
			<!-- 质检 -->
			<template slot="qualityCheck" slot-scope="{row,$index}">
				<span>{{qualityCheckOptions[row.qualityCheck].label}}</span>
			</template>
			<!-- 用毛 -->
			<template slot="wool" slot-scope="{row,$index}">
				<el-input v-model="row.wool" :size="size" ></el-input>
			</template>
			<!-- 纱织 -->
			<template slot="weaving" slot-scope="{row,$index}">
				<el-input v-model="row.weaving" :size="size" ></el-input>
			</template>
			<!-- 克重 -->
			<template slot="gram" slot-scope="{row,$index}">
				<el-input v-model="row.gram" :size="size" ></el-input>
			</template>
			<!--交期-->
			<template slot="deliveryTime" slot-scope="{row,$index}">
				<el-date-picker
				    value-format="yyyy-MM-dd" 
					v-model="row.deliveryTime"
					style="width: 100%;"
					type="date"
					placeholder="选择日期">
				</el-date-picker>
			</template>
		</jod-tableList>
		<transition name="fade" mode="out-in">
			<div style="height: 306px;background-color: #F2F6FC;" v-if="!textBol"></div>
			<div style="min-height: 306px;" v-if="textBol">
				<jod-ckeditor v-model="contractStyle"></jod-ckeditor>
			</div>
		</transition>
		
		
		<div style="text-align:center;margin-top: 10px;">
		     <el-button type="primary" style="width: 80px;" :size="size" :loading="confirmLoading" @click="confirmContact" :disabled="bledbtn">
		        保存
		    </el-button>
			<!-- <el-button type="primary" style="width: 120px;" :size="size" @click="confirmContact('post')">发起合同流程</el-button> -->
		    <el-button style="width: 80px;" :size="size" @click="confirmContact('cancel')">取消</el-button>
		</div> 
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import contract from '@/api/fabric/contract.js'
	import supOrder from '@/api/fabric/supplierOrder.js'
	import processUp from '../../factory/components/processUp.vue'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'processUp':processUp,
		},
		props:{
			value:{
				type:String
			},
			orderRow: {
				type:Object,
				default:()=>{}
			},
			conDialog:{
				type:Boolean
			}
		},
		watch:{
			value(v){
				console.log(v)
				this.orderNumber = v;
				this.getDetail();
			},
			conDialog(v){
				if(v){
					let {totalAmount} = this.orderRow;
					this.conData['totalAmount'] = totalAmount;
				}
			}
		},
		data(){
			return{
				//发起合同流程
				proUpDio:false,
				dgmc:[],
				orderNumber:this.value,
				bledbtn:false,
				conData:contract.conData,
				conForm:contract.conForm,
				confrimData:[],
				confrimColumns:contract.confrimColumns,
				confrimOptions:contract.confrimOptions,
				confirmLoading:false,
				sortOptions:supOrder.sortOptions,
				isEntryOptions:supOrder.isEntryOptions,
				qualityCheckOptions:supOrder.qualityCheckOptions,
				contractStyle:'',
				textBol:false
			}
		},
		created() {
			this.getDetail();
		},
		methods:{
			async getDetail(){
				if(this.orderRow.status < 2){
					this.bledbtn = false
				}else{
					this.bledbtn = true
				}
				let {totalAmount,signTime} = this.orderRow;
				this.conData['signTime'] = signTime;
				let res = await contract.get(this.api.detail,this.orderNumber)
				console.log(res);
				this.textBol = true;
				let {purchaseList,contractStyle} = res.data;
				let money = await contract.moneyUpdate(purchaseList);
				console.log(money)
				this.$nextTick(()=>{
					this.conData['totalAmount'] = money;
				})
				this.contractStyle = contractStyle;
				this.confrimData = purchaseList;
			},
			async moneyUpdate(value){
				let money = await contract.moneyUpdate(this.confrimData);
				this.conData['totalAmount'] = money;
			},
			confirmContact(row){
				console.log(this.conData.signTime)
				if(row == 'cancel'){
					this.$refs.['confirmForm'].$refs['searchForm'].resetFields();
				    this.confirmLoading = false;
					this.$emit('conClose',false,true)
				}else if(row == 'post'){
					this.dgmc = [this.confrimData[0].supplierName,this.confrimData[0].orderNumber]
					this.proUpDio = true
				}else{
					this.$refs["confirmForm"].$refs["searchForm"].validate((valid) => {
						if(valid) {
					       console.log(this.conData)
						   supOrder.confirmList(this.confrimData).then(resp=>{
							   let form = {
								   orderNumber:this.orderNumber,
								   totalAmount:this.conData['totalAmount'],
								   signTime:this.conData['signTime'],
								   contractStyle:this.contractStyle,
								   purchaseList:resp,
							   }
							   contract.put(this.api.confirm,form).then(res=>{
								   this.$message({
								   	message: '合同确认成功',
								   	type: 'success'
								   });
								   this.contractStyle='';
								   this.$refs.['confirmForm'].$refs['searchForm'].resetFields();
								   this.$emit('conClose',false)
							   })
						   })
						} else {
						    console.log("error submit!!");
							return false;
						}
					});
				}
			},
			proClose(value){
				this.proUpDio = false;
			},
			proCloseDio(value){
				this.proUpDio = value;
			}
		}
	}
</script>

<style>
</style>

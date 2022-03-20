<!--
 * @FileDescription: 工厂订单入库通知
 * @Author: wangpenghui
 -->
<template>
	<div>
		<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="warehouse"
			@handleChangePage="handleChangePage"
			@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
			
			
			<!-- 表外 -->
			<template v-slot:content_context>
				
			</template>
			
			<!-- 自定义行 -->
			<template slot="quantity" slot-scope="{row,$index}">
				<el-input size="mini" type="Number" class="textCenter"
					v-model.number="row.quantity" @input="salaryChange($event,row)" @blur="blurValue($event,row)">
				</el-input>
			</template>
		</jod-tableList>
		
		
		<div style="text-align: center;">
			<el-button type="primary" :size="size" @click="sendOut">发送</el-button>
			<el-button type="warning" :size="size"@click="cancel">取消</el-button>
		</div>
	</div>
</template>

<script>
	import json from '@/api/factory/warehouse.js'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		name:'warehouse',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props:{
			value:{
				type:String
			}
		},
		data() {
			return {
				gridData:[],//源数据
				columns: json.columns,
				options: json.options,
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
				sendOutData:[],//所要发送的数据
			}
		},
		created() {
			this.getList();
		},
		methods:{
			async getList(){
				let res = await json.get(this.api.getGoodsWarehousing,{'orderNumber':this.value});
				console.log(res)
				if(res.code==0){
					this.gridData = res.data;
				}
			},
			handleChangePage(current){
				console.log(current)
			},
			handleSizeChange(page){
				console.log(page)
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			//输入框
			salaryChange(value,row){
				if(value){
					let newValue = parseFloat(value).toFixed(0)
					console.log(row)
					if(newValue<=row.usendQutity){
						this.$set(row,'quantity',newValue)
					}else{
						this.$set(row,'quantity',row.usendQutity)
					}
				}
			},
			blurValue(value,row){
				if(row.quantity&&row.quantity!=='0'){
					let bt = true;
					this.sendOutData.forEach(item=>{
						if(item.goodsId==row.goodsId){
							bt = false;
						}
					})
					if(bt||this.sendOutData.length==0){
						this.sendOutData.push(row)
					}
				}
			},
			//发送
			async sendOut(){
				if(this.sendOutData.length==0){
					return
				}
				let res = await json.post(this.api.getGoodsWarehousing,this.sendOutData)
				if(res.code==0){
					this.cancel();
					this.$message.success('发送成功')
				}
			},
			//取消
			cancel(){
				this.$emit('close',false)
			}
		}
	}
</script>

<style>
</style>

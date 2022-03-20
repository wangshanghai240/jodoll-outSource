<template>
	<div>
		<jod-formSearch labelWidth="120px" ref="confirmForm" :searchData="conData" :searchForm="conForm">
		</jod-formSearch>
		<el-alert
		    title="工厂订单"
			:closable="false"
		    type="info"
		    show-icon>
		  </el-alert>
		<jod-tableList :dataSource="confrimData" :columns="confrimColumns" @expandChange="expandChange"
			:options="confrimOptions" ref="confirmTable" :expandAll="expandAll" :expandArr="expandArr">
			<template slot="gcbj" slot-scope="{ row, $index }">
				<el-input v-model="row.gcbj" @blur='money(row)'></el-input>
			</template>
			<template slot="yqhq" slot-scope="{ row, $index }">
				<el-date-picker value-format="yyyy-MM-dd" v-model="row.yqhq"></el-date-picker>
			</template>
			<!-- 展开 -->
			<template slot="expandForm" slot-scope="{row,$index}">
				<!-- <expand-size v-model="row.expandData" v-if="row.expandData&&row.expandData.length!==0"></expand-size>
				<div v-else style="height: 85px;text-align: center;line-height: 85px;">
					暂无数据
				</div> -->
				<jod-tableList class="expandTable" :dataSource="dataSource" :columns="expandColumns"
					:options="value&&value.length!==0?expandOptions:{tHeight:'150px'}">
					<template slot="orderVersion" slot-scope="{row,$index}">
						<span>{{row.orderVersion=='无'?'-':row.orderVersion}}</span>
					</template>
					
					<template :slot="expandColumns[index].label" v-for="(item,index) in expandColumns" slot-scope="{row,$index}">
						<div style="display: flex;justify-content: space-around;">
							<div>
								<el-input 
									v-if="row[item.prop]"  
									placeholder="数量" 
									size="mini" 
									type="Number" 
									class="textCenter" 
									v-model="row[item.prop]&&row[item.prop].count"
									@blur="savedata(row)">
								</el-input>
								<span v-else>-</span>
							</div>
						</div>
					</template>
				</jod-tableList>
			</template>
		</jod-tableList>
		<transition name="fade" mode="out-in">
			<div style="height: 306px;background-color: #F2F6FC;" v-if="!textBol"></div>
			<div style="min-height: 306px;" v-if="textBol">
				<jod-ckeditor v-model="contractStyle"></jod-ckeditor>
			</div>
		</transition>
		
		<div style="text-align:center;margin-top: 10px;">
		    <el-button type="primary" style="width: 80px;" :size="size" :loading="confirmLoading" @click="confirmContact">
		        保存
		    </el-button>
		    <el-button style="width: 80px;" :size="size" @click="confirmContact('cancel')">取消</el-button>
		</div> 
		
		
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import contract from '@/api/factory/contract.js'
	import supOrder from '@/api/fabric/supplierOrder.js'
	import {throttle , debounce} from '@/utils/validate.js'
	import { loading } from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			
		},
		props:{
			value:{
				type:String
			},
			orderRow: {
				type:Object,
				default:()=>{}
			}
		},
		watch:{
			value(v){
				this.orderNumber = v;
				this.getDetail();
			}
		},
		data(){
			return{
				// 发起合同流程
				proUpDio:false,
				dgmc:[],
				orderNumber:this.value,
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
				textBol:false,
				expandColumns: [],
				dataSource: [],
				expandOptions: {
					tHeight: '150px',
				},
				totaldata:[],
				measurementList:[],
				newmeasurementList:[],
				id:'',
				//函件预览
				sl:0,
				expandAll:null,
				expandArr:[],
				loading:null,
			}
		},
		created() {
			this.loading = loading(document.getElementsByClassName('contract')[0])
			this.getDetail();
		},
		methods:{
			getDetail(){
				console.log(this.orderNumber)
				this.confrimData = []
				contract.get(this.api.getOrderContract,{orderNumber:this.orderNumber}).then(res=>{
					this.confrimData = res.data.eshopOrMeetingGoodsList;
					console.log('1',this.confrimData)
					this.textBol = true;
					this.conData.sendTime = this.orderRow.deliveryTime
					this.conData.signTime = res.data.contractTime
					this.contractStyle = res.data.remark
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			confirmContact(row){
				if(row == 'cancel'){
					this.$emit('conClose',false)
				}else{
					this.$refs["confirmForm"].$refs["searchForm"].validate((valid) => {
						if(valid){
							console.log('2',this.confrimData)
							var data = {contractTime:this.conData.signTime,goodsList:this.confrimData,orderNumber:this.orderNumber,
							remark:this.contractStyle}
							console.log('data',data)
							contract.put(this.api.updateOrderContract,data).then(res=>{
								console.log(res)
								this.$message.success('保存成功')
								this.$emit('conClose',true)
							})
						}
					});
				}
			},
			expandChange: throttle (function(row,expandedRows){
				console.log('row',row)
				console.log('exrow',expandedRows)
				console.log('1',this.measurementList)
				if(expandedRows.length != 0){
					// this.$slots.expandForm.toggleRowExpansion(expandedRows[0],false)
					console.log('all',this.expandAll)
					console.log('arr',this.expandArr)
					this.dataSource = []
					this.measurementList = expandedRows[expandedRows.length -1].measurementGoodsList
					console.log('2',this.measurementList)
					this.id = row.id
					this.getList(this.measurementList)
				}
			},500),
			async getList(list) {
				try {
					let newList = await this.expandList(list)
					console.log('list',newList)
					this.expandColumns = newList[0];
					this.dataSource = newList[1]
				} catch (e) {
					this.$message.error(e)
				}
			},
			expandList(list) {
				return new Promise((res, rej) => {
					if (list && list.lengt !== 0) {
						let columns = [{
							'label': '尺码',
							'prop': 'count',
							'align': 'center',
							'width': 50
						}, {
							'label': '版型',
							'prop': 'orderVersion',
							'align': 'center',
							'slot': true,
							'width': 80
						}];
						let version = []
						let sizeArr = []
						let newData = list.reduce((total, current) => {
							let { id, size, count, orderVersion } = current;
							let sizeIndex = -1;//记录尺码出现位置
							sizeArr.forEach((item, index) => {
								if (item.sizeIndex == size) {
									sizeIndex = index
								}
							})
							if(sizeIndex==-1){
								console.log('-------------',sizeIndex)
								sizeArr.push({
									'sizeIndex':size
								})
								total.push({
									'label': size+'',
									'prop': size+'',
									'align': 'center',
									'slot': true,
									'mWidth': 70
								})
							}
							let i = -1;//记录版型出现的位置
							version.forEach((item, index) => {
								if (item.orderVersion == orderVersion) {
									i = index
								}
							})
							if (i == -1) {
								let length = version.length;
								version.push({
									'count': '数量',
									'orderVersion': orderVersion
								})
								version[length][size] = {
									'id': id,
									'size':size,
									'count': count,
								}
							} else {
								version[i][size] = {
									'id': id,
									'size':size,
									'count': count,
								}
							}
							return total
						}, columns)
						let arr = [newData, version]
						res(arr)
					}
				})
			},
			savedata(row){
				console.log('row',row)
				console.log('data',this.dataSource)
				this.save().then(res=>{
					console.log('id',this.id)
					console.log('data',this.confrimData)
					for(var i = 0;i<this.confrimData.length;i++){
						if(this.id == this.confrimData[i].id){
							var countsl = 0
							console.log(this.confrimData[i])
							for(var j = 0;j<this.newmeasurementList.length;j++){
								countsl = countsl + parseInt(this.newmeasurementList[j].count)
							}
							this.confrimData[i].sl = countsl
							this.confrimData[i].zj = countsl * this.confrimData[i].gcbj
							this.confrimData[i].measurementGoodsList = this.newmeasurementList
							break
						}
					}
					// this.totaldata.push(this.newmeasurementList)
				})
			},
			formConfirm(list){
				return new Promise((res,rej)=>{
					this.measurementList.forEach(item=>{
						list.forEach((total,index)=>{
							if(total.orderVersion==item.orderVersion&&total[item.size].size==item.size&&total[item.size].id==item.id){
								item.count = total[item.size].count;
							}
						})
					})
					res(this.measurementList)
				})
			},
			async save() {
				try {
					this.newmeasurementList = await this.formConfirm(this.dataSource);
					// var counts l = 0 
					// for(var i = 0;i<this.newmeasurementList.length;i++){
					// 	countsl = countsl + this.newmeasurementList[i].count
					// }
					// this.confrimData
					console.log(this.newmeasurementList)
				} catch (e) {
					this.$message.error(e)
				}
			},
			money(row){
				row.zj = parseInt(row.gcbj) * row.sl
				console.log(row)
			}
		}
	}
</script>

<style>
</style>

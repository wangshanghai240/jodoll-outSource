<!--
 * @FileDescription: 面料采购订单
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="supOrder"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage" :expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange" @expandChange="expandChange">
		<!-- 状态 -->
		<template slot="status" slot-scope="{row,$index}">
			<span>{{row.status && statusOptions[row.status-1] ?statusOptions[row.status-1].label:row.status}}</span>
		</template>
		<!-- 操作 -->
		<template slot="operation" slot-scope="{row,$index}">
			<div style="display: flex;justify-content:center">
				<el-button type="success" :size="size" plain @click="contractConfirm(row)" v-has:pact>合同</el-button>
				<el-button type="primary" :size="size" :loading="shareLoading" @click="contractShare(row)" v-has:pactView>合同函查看</el-button>
				<el-button type="warning" :size="size" plain  @click="notice(row)" v-has:enterInform>入库通知</el-button>
				<el-button v-if="row.status==1" type="danger" icon="el-icon-delete" circle :size="size"
				  :disabled="delLoading" @click="delRow(row)" v-has:del></el-button>
			</div>
		</template>
		
		
		<!-- 表外 -->
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>
			</div>
			<div class="searchBody">
				<el-select v-model="searchForm.status" style="width:125px" :size="size" clearable 
				  class="marginTop16" placeholder="状态 搜索">
					<el-option
					  v-for="item in statusOptions"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
					</el-option>
				</el-select>
				<el-input
					v-model="searchForm.supplierName"
					:size="size"
					class="marginTop16"
					style="width: 145px;margin:0 10px;"
					placeholder="名称 搜索"/>
				<el-date-picker
					v-model="searchForm.searchDate"
					type="daterange"
					:size="size"
					class="marginTop16"
					range-separator="至"
					value-format="yyyy-MM-dd"
					start-placeholder="下单起始日期"
					end-placeholder="下单结束日期"/>
				<el-button type="primary" class="marginLeft10 marginTop16" style="width: 95px;" :size="size"
				  :loading="searchLoading" @click="searchFab">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading" 
				  class="marginTop16" @click="searchFab('reset')">
					重置
				</el-button>
			</div>
			<!-- 新入库 -->
			<jod-dragDialog v-model="entryDialog" class="tableDialog" style="padding-bottom: 50px;" title="入库检" top="50px" :drag="true"
				:dialogStyle="{width: '1200',widthType: 'px'}">
				<warehous-details v-if="entryDialog" v-model="entryData" @warDetailsClose="warDetailsClose"></warehous-details>
			</jod-dragDialog>
			<!-- 船头样 -->
			<jod-dragDialog v-model="SampleCheckDialog" class="sampleCheck" title="提示"
				:dialogStyle="{width: '300',widthType: 'px'}" top="30vh">
				<h2>是否通过船头样</h2>
				<h4>当前状态 : {{sampleCheckOptions[sampleCheckBol].label}}</h4>
				<div>
					<el-button type="primary" :size="size" :loading="openSampleCheck1" @click="openSampleCheck(true)">通过</el-button>
					<el-button type="danger" :size="size" :loading="openSampleCheck2" plain @click="openSampleCheck(false)">不通过</el-button>
				</div>
			</jod-dragDialog>
			<!-- 合同确认 -->
			<jod-dragDialog v-model="conDialog" title="合同确认" :top="'10px'" :dialogStyle="{width: '95',widthType: '%'}" @closeDio="conCloseDio">
				<contarct v-model="conOrderNumber" :conDialog="conDialog" :key="reflushKey" :orderRow="orderRow" @conClose="conClose(arguments)"></contarct>
			</jod-dragDialog>
			<!-- 展开编辑 -->
			<jod-dragDialog v-model="updateDialog" title="修改"  top="30vh" :dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="purchaseForm" :searchData="purchaseData" :searchForm="purchaseForm"
				 :searchHandle="purchaseHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 跟踪日志 -->
			<jod-dragDialog class="tableDialog" v-model="traceDialog" title="跟踪日志"
			  :dialogStyle="{width: '80',widthType: '%'}">
				<trace-list v-model="traceData" source="fabricPurchase" v-if="traceDialog"></trace-list>
			</jod-dragDialog>
			<!-- sku -->
			<jod-dragDialog class="tableDialog" v-model="skuDialog" title="sku详情" :dialogStyle="{width: '80',widthType: '%'}">
				<sku v-model="supOrderId" v-if="skuDialog"></sku>
			</jod-dragDialog>
			<!-- 合同函查看 -->
			<jod-dragDialog class="tableDialog" v-model="shareDialog" title="合同函" :drag="true" top="10px"
			  :dialogStyle="{width: '1200',widthType: 'px'}">
				<share v-model="orderNumber" :orderRow="orderRow" @shareClose="shareClose(arguments)" @flushSupplierOrderList="flushSupplierOrderList(arguments)"></share>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
			<!--入库通知-->
			<jod-dragDialog v-model="warehousDio" title="入库通知单" class="tableDialog" :dialogStyle="{width: '80',widthType: '%'}">
				<transition name="fade" mode="out-in">
					<warehouse v-model="orderNumber" v-if="warehousDio" @close="warehouseClose"></warehouse>
				</transition>
			</jod-dragDialog>
		</template>

		<!-- 展开 -->
		<template slot="expandForm" slot-scope="{row,$index}">
			<jod-tableList class="" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'150px'}">
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
				<!-- 入库完成 -->
				<template slot="isEntry" slot-scope="{row,$index}">
					<span>{{row.isEntry||row.isEntry==0?isEntryOptions[row.isEntry].label:row.isEntry}}</span>
				</template>
				<!-- 质检 -->
				<template slot="qualityCheck" slot-scope="{row,$index}">
					<span>{{qualityCheckOptions[row.qualityCheck].label}}</span>
				</template>

				<template v-slot:header_input>
					<span>操作</span>
				</template>
				<template slot="operate" slot-scope="scope">
					<el-button type="success" plain :size="size" @click="entryChange(scope.row,row)">入库检</el-button>
					<el-dropdown split-button type="primary" :size="size" trigger="click" class="marginLeft10"
						@click="expandEdit(scope.row,row)">
						<span class="el-dropdown-link">
							编辑
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="isSampleCheck(scope.row,row)">
								<span>船头样确认</span>
							</el-dropdown-item>
							<el-dropdown-item @click.native="track(scope.row)">
								<span>跟踪日志</span>
							</el-dropdown-item>
							<el-dropdown-item @click.native="sku(scope.row)">
								<span>sku明细</span>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</jod-tableList>
		</template>
	</jod-tableList>
</template>

<script>
	import supOrder from '@/api/fabric/supplierOrder.js'
	import purchaseList from '@/api/fabric/purchaseList.js'
	import trace from '../controller/traceLog/traceLogList.vue'
	import skus from './components/sku.vue'
	import share from './components/share.vue'
	import contarct from './components/contract.vue'
	import {mapGetters} from 'vuex'
	import { throttle } from '@/utils/validate'
	import { loading } from '@/utils'
	import lianxidan from '../orderShop/components/lianxidanT.vue'
	import warehouse from './components/warehouse.vue'
	import warehousDetails from './components/warhouseDetails.vue'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'contarct':contarct,
			'traceList':trace,
			'sku':skus,
			'share':share,
			'lianxianUp':lianxidan,
			'warehouse':warehouse,
			'warehousDetails':warehousDetails
		},
		data(){
			return{
				domLoading:null,
				gridData:[],//源数据
				columns: supOrder.columns,
				options: supOrder.options,
				statusOptions:supOrder.statusOptions,
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
				lianDialog:false,
				hezhu:[],
				expandAll:null,//展开项
				expandArr:[],
				//搜索
				searchLoading:false,
				resetLoading:false,
				searchForm:{
					status:'',
					supplierName:'',
					searchDate:[]
				},
				traceData:{
					id: "",
					code:"",
					name:"",
					status:"",
					routers:"",
				},
				orderNumber:null,//订单编号
				conOrderNumber:null,//用于合同
				orderRow:null,//用于合同函 行数据
				//船头样
				SampleCheckDialog:false,
				sampleCheckBol:0,
				sampleCheckOptions:supOrder.sampleCheckOptions,
				openSampleCheck1:false,
				openSampleCheck2:false,
				//合同确认
				conDialog:false,
				//展开
				entryRow:null,//展开行数据
				supOrderId:null,//展开行id
				expandColumns:supOrder.expandColumns,
				expandOptions:supOrder.expandOptions,
				sortOptions:supOrder.sortOptions,
				isEntryOptions:supOrder.isEntryOptions,
				qualityCheckOptions:supOrder.qualityCheckOptions,
				reflushKey:0,
				//展开编辑
				updateDialog:false,//编辑弹窗
				purchaseData:{
					status:'',
					deliveryTime:'',
					entryTime:'',
					qualityCheck:'',
					entryNum:'',
				},
				purchaseForm:purchaseList.purchaseForm,
				purchaseHandle:[
					{
						label: "确认",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['purchaseForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									let {status,deliveryTime,entryTime,entryNum,qualityCheck} = {...this.purchaseData}
									this.purchaseHandle[0].loading = true;
									let form = {
										id:this.supOrderId,
										status,
										qualityCheck,
										deliveryTime,
										entryTime,
										entryNum
									}
									console.log(form)
									purchaseList.put(this.api.getPurchaseList,form).then(res=>{
										console.log(res)
										this.$message.success(res.message)
										supOrder.get(this.api.detail,this.entryRow.orderNumber).then(list=>{
											let {data} = list;
											this.$set(this.entryRow, 'expandData', data)
											this.purchaseHandle[0].loading = false;
											this.$refs.['purchaseForm'].$refs['searchForm'].resetFields();
											this.updateDialog = false;
										}).catch(err=>{
											this.updateDialog = false;
										})
									}).catch(err=>{
										this.updateDialog = false;
										this.purchaseHandle[0].loading = false;
									})
								} else {
									console.log('error submit!!');
									return false;
								}
							});
						},
						hide: false,
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.$nextTick(()=>{
								this.$refs.['purchaseForm'].$refs['searchForm'].resetFields();
								this.updateDialog = false;
							})
						},
						hide: false,
					}
				],
				//入库
				entryDialog:false,
				entryData:null,
				entryForm:[
					...purchaseList.entryForm,
					{
						type: "Input",
						inputType:'number',
						label: "实际入库数量:",
						prop: "entryNum",
						placeholder: "请输入数量",
						rules: [{
							required: true,
							message: "请输入实际入库数量",
							trigger: "blur"
						}]
					},
				],
				entryHandle:[
					{
						label: "确认",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['entryForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									this.entryHandle[0].loading = true;
									console.log(this.entryData)
									purchaseList.put(this.api.entry,this.entryData).then(res=>{
										this.$message.success('入库成功')
										supOrder.get(this.api.detail,this.entryRow.orderNumber).then(list=>{
											let {data} = list;
											this.$set(this.entryRow, 'expandData', data)
											this.entryHandle[0].loading = false;
											this.$refs.['entryForm'].$refs['searchForm'].resetFields();
											this.entryDialog = false;
										}).catch(err=>{
											this.entryDialog = false;
										})
									}).catch(err=>{
										this.entryHandle[0].loading = false;
									})
								} else {
									console.log('error submit!!');
									return false;
								}
							});
						},
						hide: false,
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.$nextTick(()=>{
								this.entryDialog = false;
							})
						},
						hide: false,
					},
				],
				//跟踪日志
				traceDialog:false,
				//sku
				skuDialog:false,
				//合同函
				shareLoading:false,
				shareDialog:false,
				//shareDialog2:false
				warehousDio:false,//入库通知
				delLoading:false,//删除
			}
		},
		created() {
			this.domLoading = loading(document.getElementsByClassName('app-main')[0])
		},
		mounted() {
			let {status,supplierName,searchDate:[date1,date2]} = {...this.searchForm};
			let form = {status,supplierName,startTime:date1?date1:'',endTime:date2?date2:''}
			this.getList(form).then(res=>{
				let {data} = res;
				this.domLoading.close();
				this.gridData = data.records;
				this.dataTotal = data.total;
			}).catch(err=>{
				this.domLoading.close();
			});
		},
		methods:{
			getList(){
				let {status,supplierName,searchDate:[date1,date2]} = {...this.searchForm};
				let value = {status,supplierName,startTime:date1?date1:'',endTime:date2?date2:''}

				let {currentPage:current,pageSize:size} = {...this.pagination}
				let form = {current,size,search:value}

				this.expandAll = false;
				this.expandArr = [];
				return supOrder.get(this.api.fabricSupplierOrder,form)
			},
			handleChangePage(current){
				this.domLoading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = current;

				this.getList().then(res=>{
					let {data} = res;
					this.domLoading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err=>{
					this.domLoading.close();
				});
			},
			handleSizeChange(page){
				this.domLoading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = page;
				this.getList().then(res=>{
					let {data} = res;
					this.domLoading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err=>{
					this.domLoading.close();
				});
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			searchFab: throttle (function(value){
				if(value == 'reset'){
					Object.assign(this.$data.searchForm,this.$options.data().searchForm);
					this.resetLoading = true;
				}else{
					this.searchLoading = true;
				}
                this.pagination.currentPage = 1;
				this.getList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.$message.success('查询成功')
					this.dataTotal = data.total;
					this.resetLoading = false;
					this.searchLoading = false;
				}).catch(err=>{
					this.resetLoading = false;
					this.searchLoading = false;
				})
			},2000),
			isSampleCheck(value,row){
				console.log(value)
				this.entryRow = row;
				this.SampleCheckDialog = true;
				this.supOrderId = value.id;
				this.sampleCheckBol = value.sampleCheck;
			},
			openSampleCheck(bol){
				let form = { id:this.supOrderId }
				form['sampleCheck'] = bol ? 2 : 1;
				this.openSampleCheck1 = bol;
				this.openSampleCheck2 = !bol;
				purchaseList.put(this.api.getPurchaseList,form).then(res=>{
					this.$message.success('修改成功')
					supOrder.get(this.api.detail,this.entryRow.orderNumber).then(list=>{
						let {data} = list;
						this.$set(this.entryRow, 'expandData', data)
						this.entryDialog = false;
						if(bol){this.openSampleCheck1 = false;}else{this.openSampleCheck2 = false};
						this.SampleCheckDialog = false
					}).catch(err=>{
						if(bol){this.openSampleCheck1 = false;}else{this.openSampleCheck2 = false};
					})
				}).catch(err=>{
					if(bol){ this.openSampleCheck1 = false}else{ this.openSampleCheck2 = false}
					this.SampleCheckDialog = false;
				})
			},
			contractConfirm(row){
				console.log(row)
				this.orderRow = row;
				// this.orderNumber = row.id;
				this.conOrderNumber = row.orderNumber;  // MoonXu修改，传参为orderNumber
				this.conDialog = true;
				++this.reflushKey;
				//this.conDialog2 = true;
			},
			conClose(value){
				if(value[1]){
					this.conDialog = false;
					// setTimeout(()=>{
					// 	this.conDialog2 = false;
					// },200)
				}else{
					this.getList().then(res=>{
						let {data} = res;
						this.conDialog = false;
						// setTimeout(()=>{
						// 	this.conDialog2 = false;
						// },200)
						this.gridData = data.records;
						this.dataTotal = data.total;
					}).catch(err=>{

					});
				}
			},
			conCloseDio(value){
				this.conDialog = value;
				// setTimeout(()=>{
				// 	this.conDialog2 = value;
				// },200)
			},
			closeDio(value){
				this.$refs[value].$refs['searchForm'].resetFields();
			},
			expandChange(row){
				console.log(row)
				if(row.id&&!row.expandData){
					supOrder.get(this.api.detail,row.orderNumber).then(res=>{
						let {data} = res;
						this.$set(row, 'expandData', data.purchaseList)
					})
				}
				console.log(row)
			},
			entryChange(row){
				if(row.status < 2){
					this.$message.warning('该采购单还未生成合同订单')
				}else{
					this.entryData = row;
					this.entryDialog = true
				}
			},
			expandEdit(value,row){
				console.log(value);
				this.entryRow = row;
				this.supOrderId = value.id;
				this.updateDialog = true;
				this.$nextTick(()=>{
					this.purchaseData['status'] = value.status;
					this.purchaseData['deliveryTime'] = value.deliveryTime;
					this.purchaseData['entryTime'] = value.entryTime;
					this.purchaseData['qualityCheck'] = value.qualityCheck;
					this.purchaseData['entryNum'] = value.entryNum;

				})
			},
			track(value){
				// this.supOrderId = value.id;
				this.traceData["id"] = value.id;
				this.traceData["code"] = value.materialCode;
				this.traceData["name"] = value.materialName;
				this.traceData["status"] = value.status;
				console.log(value)
				this.traceDialog = true;
			},
			sku(value){
				this.supOrderId = value.id;
				this.skuDialog = true;
				console.log(value)
			},
			//合同函查看
			contractShare(row){
				console.log(row);
				this.orderNumber = row.orderNumber;
				this.orderRow = row;
				this.shareDialog = true;
				//this.shareDialog2 = true;
				//this.shareLoading = true;
				// supOrder.get(this.api.confirm,{orderNumber:row.orderNumber}).then(res=>{
				// 	console.log(res);
				// })

			},
			shareClose(value){
				if(!value[0]){
					this.orderNumber = null
				}
				this.$message.error(value[1])
				this.shareDialog = value[0];
				// setTimeout(()=>{
				// 	this.shareDialog2 = value;
				// },200)
			},
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("面料供应商订单:"+this.multipleSelection[i].supplierName+this.multipleSelection[i].orderNumber)
				}
				this.lianDialog = true
			},
			lianClose(value){
				this.lianDialog = false;
			},
			lianCloseDio(value){
				this.lianDialog = value;
			},
			//入库通知
			notice(row){
				if(row.status!=2){
					this.$message({
						message: '合同签订的订单才能操作入库通知',
						type: 'danger'
					});
					return;
				}
				console.log(row)
				this.orderNumber = row.orderNumber;
				this.warehousDio = true;
			},
			//关闭入库通知
			warehouseClose(value){
				this.warehousDio = value
			},
			flushSupplierOrderList(value){
				setTimeout(()=>{
					this.getList().then(res=>{
						let {data} = res;
						this.shareDialog = false;
						this.gridData = data.records;
						this.dataTotal = data.total;
					}).catch(err=>{
					});
				},1000)
			},
			warDetailsClose(){
				
			},
			//删除
			async delRow(row){
				try {
					this.delLoading = true;
					let res = await supOrder.del(this.api.fabricSupplierOrder,{id:row.id});
					console.log(res);
					let list = await this.getList();
					this.gridData = list.data.records;
					this.dataTotal = list.data.total;
					this.delLoading = false;
					this.$message.success('删除成功')
				}catch(e){
					console.log(e)
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>

<!--
 * @FileDescription: 面料采购列表
 * @Author: wangpenghui
 * @Date: 2021/1/13
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/21
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="purchaseList"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage" :expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange"  @handleSelectionChange="handleSelectionChange">
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" :loading="exportLoading" @click="exportList" v-has:export>
					导出
				</el-button>
				<transition name="el-fade-in-linear">
					<el-button type="primary" :size="size" :loading="batchMergeLoading"
					  v-if="multipleSelection.length==0" @click="batchMerge" v-has:createOrder>
						批量生成订单
					</el-button>
					<el-button type="primary" :size="size" :loading="mergeLoading" @click="merge"
					  v-else v-has:createOrder>
						生成订单
					</el-button>
				</transition>
				
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
					v-model="searchForm.materialCode"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="面料号 搜索"/>
				<el-input
					v-model="searchForm.materialName"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="面料名称 搜索"/>
				<el-input
					v-model="searchForm.supplierName"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="供应商 搜索"/>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="searchLoading" 
				  class="marginTop16" @click="searchPurchaseList">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading" 
				  class="marginTop16" @click="searchPurchaseList('reset')">
					重置
				</el-button>
			</div>

			<jod-dragDialog v-model="updateDialog" class="updatePurchase" title="修改"  top="30vh" :dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="purchaseForm" :searchData="purchaseData" :searchForm="purchaseForm" v-has:update
				 :searchHandle="purchaseHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 质量检测 -->
			<jod-dragDialog v-model="qualityDialog" title="质量检测"  top="30vh" :dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="qualityForm" :searchData="qualityData" :searchForm="qualityForm"
				 :searchHandle="qualityHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 旧入库 -->
			<!-- <jod-dragDialog v-model="entryDialog" class="traceDialog" title="入库"  top="30vh"  @closeDio="closeDio"
				:dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="entryForm" :searchData="entryData" :searchForm="entryForm"
				 :searchHandle="entryHandle">
				</jod-formSearch>
			</jod-dragDialog> -->
			
			<!-- 新入库 -->
			<jod-dragDialog v-model="entryDialog" class="tableDialog" style="padding-bottom: 50px;" title="入库检" top="50px" :drag="true"
				:dialogStyle="{width: '1200',widthType: 'px'}">
				<warehous-details v-if="entryDialog" v-model="entryRow" @warDetailsClose="warDetailsClose"></warehous-details>
			</jod-dragDialog>
			
			<!-- 船头样 -->
			<jod-dragDialog v-model="SampleCheckDialog" class="sampleCheck" title="提示"
				:dialogStyle="{width: '300',widthType: 'px'}" top="30vh">
				<h2>是否通过船头样</h2>
				<h4>当前状态 : {{sampleCheckOptions[sampleCheckBol].label}}</h4>
				<div>
					<el-button type="primary" :size="size" :loading="openSampleCheck1" :disabled="openSampleCheck2"
						@click="openSampleCheck(true)">通过</el-button>
					<el-button type="danger" :size="size" :loading="openSampleCheck2" plain :disabled="openSampleCheck1"
						@click="openSampleCheck(false)">不通过</el-button>
				</div>
			</jod-dragDialog>

			<!-- 跟踪日志 -->
			<jod-dragDialog class="traceDialog" v-model="traceDialog" title="跟踪日志"
			  :dialogStyle="{width: '80',widthType: '%'}"
			  :modalClose="false">
			  <!--  @closeDio="colseTrace" -->
				<trace-list v-model="traceData" source="fabricPurchase" v-if="traceDialog"></trace-list>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
		</template>

		<template slot="source" slot-scope="{row,$index}">
			<span>{{row.source?sourceOpitons[row.source-1].label:row.source}}</span>
		</template>
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
		<template slot="status" slot-scope="{row,$index}">
			<span>{{(row.status || row.status == 0) && statusOptions[row.status] ?statusOptions[row.status].label:row.status}}</span>
		</template>
		<template slot="sampleCheck" slot-scope="{row,$index}">
			<span>{{sampleCheckOptions[row.sampleCheck].label}}</span>
		</template>
		<template slot="supplierName" slot-scope="{row,$index}">
			<span>{{row.supplierName ? row.supplierName : "无" }}</span>
		</template>
		<template slot="qualityCheck" slot-scope="{row,$index}">
			<span>{{row.qualityCheck || row.qualityCheck >= 0 ? qualityOptions[row.qualityCheck].label:row.qualityCheck}}</span>
		</template>



		<template slot="expandForm" slot-scope="{row,$index}">
			<jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'100px'}">
			</jod-tableList>
		</template>

		<template v-slot:header_input>
			<span>操作</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="success" plain  :loading="row.entryLoading" :size="size" @click="entryChange(row)" v-has:enter>入库检</el-button>
			<el-dropdown split-button :type="row.status>1?'info':'primary'" :size="size" trigger="click"
			  class="marginLeft10" :class="row.status>1?'fabricIsDisabled':''" @click="updatepurchase(row)">
				<span class="el-dropdown-link">
					修改
				</span>
				<el-dropdown-menu slot="dropdown">
					<!-- <el-dropdown-item @click.native="queryShop(row)">
						<span>查看商品明细</span>
					</el-dropdown-item> -->
					<el-dropdown-item @click.native="isSampleCheck(row)" v-has:sample>
						<span>船头样确认</span>
					</el-dropdown-item>
					<el-dropdown-item @click.native="testing(row)" v-has:examining>
						<span>检测确认</span>
					</el-dropdown-item>
					<el-dropdown-item @click.native="track(row)">
						<span>跟踪日志</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</template>

	</jod-tableList>
</template>

<script>
	import purchaseList from '@/api/fabric/purchaseList.js'
	import trace from '../controller/traceLog/traceLogList.vue'
	import {mapGetters} from 'vuex'
	import { throttle } from '@/utils/validate'
	import { loading } from '@/utils'
	import lianxidan from '../orderShop/components/lianxidanT.vue'
	import warehousDetails from './components/warhouseDetails.vue'
	export default{
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			'traceList':trace,
			'lianxianUp':lianxidan,
			'warehousDetails':warehousDetails
		},
		data(){
			return{
				columns:purchaseList.columns,
				options: purchaseList.options,
				sourceOpitons:purchaseList.sourceOpitons,
				sortOptions:purchaseList.sortOptions,
				statusOptions:purchaseList.statusOptions,
				sampleCheckOptions:purchaseList.sampleCheckOptions,
				expandColumns:purchaseList.expandColumns,
				expandOptions:purchaseList.expandOptions,
				qualityOptions:purchaseList.qualityOptions,
				gridData: [],
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				searchForm:{
					status:'',
					materialCode:'',
					materialName:'',
					supplierName:''
				},
				multipleSelection:[],//勾选
				lianDialog:false,
				hezhu:[],
				expandAll:null,//展开项
				expandArr:[],
				searchLoading:false,//搜索
				resetLoading:false,//重置
				exportLoading:false,//导出
				mergeLoading:false,//生成订单
				batchMergeLoading:false,//批量生成订单
				updateDialog:false,//修改面料
				qualityDialog:false,//质量检测
				SampleCheckDialog:false,
				traceDialog:false,//跟踪日志
				purchaseId:'',//id
				openSampleCheck1:false,
				openSampleCheck2:false,
				sampleCheckBol:0,
				purchaseData:{
					status:'',
					deliveryTime:'',
					entryTime:'',
					qualityCheck:'',
					entryNum:'',
					supplierCode:'',
					price:'',
					materialCode:''
				},
				traceData:{
					id: "",
					code:"",
					name:"",
					status:"",
					routers:"",
				},
				purchaseForm:[...purchaseList.purchaseForm,{
					type: "Select",
					label: "供应商:",
					prop: "supplierCode",
					options: this.purchaseOptions,
					style:"width:200px",
					change: row => {
						console.log(row)
					},
					placeholder: "请选择供应商",
					clearable:true,
					filterable:true,
					remote:true,
					loading:false,
					remoteMethod: query => {
						if (query !== '') {
							this.purchaseForm[2].loading = false;
							let data = {
								type: "1",
								supplierName:query
							}
							purchaseList.get(this.api.supplier,data).then(res=>{
								purchaseList.nameOptions(res).then(opt=>{
									this.purchaseForm[2].loading = false;
									this.purchaseForm[2].options = opt
								})
							}).catch(err=>{
								this.purchaseForm[2].loading = false;
							})
						} else {
						  this.purchaseForm[2].options = [];
						}
					},
					rules: [{
						required: true,
						message: "请输入供应商",
						trigger: "change"
					}],
				},{
					type: "Input",
					label: "单价:",
					prop: "price",
					clearable:true,
					style:"width:200px",
				}],
				purchaseHandle:[{
					label: "确认",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['purchaseForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								try{
									let {status,deliveryTime,entryTime,entryNum,qualityCheck,supplierCode,price,materialCode} = {...this.purchaseData}
									console.log(this.purchaseData)
									this.purchaseHandle[0].loading = true;
									//用于区分手动修改or自动填充
									let bt = this.purchaseOptions.find(x => x.label == this.purchaseData['supplierCode']);
									let supplierNames = bt?
										this.purchaseOptions.find(x => x.label === this.purchaseData['supplierCode']).label:
										this.purchaseOptions.find(x => x.value === this.purchaseData['supplierCode']).label
									let form = {
										id:this.purchaseId,
										status,
										qualityCheck,
										deliveryTime,
										entryTime,
										entryNum,
										supplierCode:bt?bt.value:supplierCode,
										price,
										materialCode,
										supplierName:supplierNames
									}
									console.log("form",form)
									purchaseList.put(this.api.getPurchaseList,form).then(res=>{
										console.log(res)
										this.$message.success('修改成功')
										this.getPurchaseList().then(list=>{
											let {data} = list;
											console.log(list)
											this.updateDialog = false;
											this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.purchaseHandle[0].loading = false;
										})
									})
								}catch(e){
									console.log(e)
									this.$message.error('修改失败')
									this.updateDialog = false;
									this.purchaseHandle[0].loading = false;
								}
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.$nextTick(()=>{
							this.$refs.['purchaseForm'].$refs['searchForm'].resetFields();
							this.updateDialog = false;
						})
					},
					hide: false,
				}],
				qualityData:{
					qualityCheck:'',
					fileUpload:[],
					surfaceMaterialNo:''
				},
				qualityForm:[{
					type: "RadioButton",
					label: "检测:",
					prop: "qualityCheck",
					change: res => {
						if(res==2&&this.qualityForm.length==1){
							let arr = [{
								type: "Input",
								label: "质检编号:",
								prop: "surfaceMaterialNo",
								placeholder: "请输入质检编号",
								rules: [{
									required: true,
									message: "请输入质检编号",
									trigger: "blur"
								}]
							},{
								type: "fileUpload",
								label: "检测报告:",
								headers: {'Authorization':this.token},
								prop: "fileUpload",
								upload: process.env.VUE_APP_BASE_URL+this.api.uploadQualit,
								rules: [{
									required: true,
									validator : (rule, value, callback) => {
										console.log(value)
										if (value.length==0) {
											return callback(new Error("文件不能为空"));
										}else{
											callback();
										}
									},
									trigger: "blur"
								}]
							}]
							this.qualityForm = this.qualityForm.concat(arr);
						}else{
							console.log(this.qualityForm)
							if(this.qualityForm.length!==1){
								this.qualityForm.splice(1,2)
							}
						}
						console.log(res)
					},
					radios: [{
						value: 2,
						label: '通过'
					},{
						value: 1,
						label: '不通过'
					}],
					rules: [{
						required: true,
						message: "请确定检测结果",
						trigger: "change"
					}]
				}],
				qualityHandle:[{
					label: "确认",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['qualityForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								let {fileUpload,qualityCheck,surfaceMaterialNo,materialCode} = {...this.qualityData}
								this.qualityHandle[0].loading = true;

								console.log('检测确认')
								let form = {
									id:this.purchaseId,
									qualityCheck,
									materialCode
								}
								console.log(qualityCheck)
								if(qualityCheck==2){
									form['filePath'] = fileUpload[0].response.data.fileHttpPath
									form['surfaceMaterialNo'] = surfaceMaterialNo
								}
								console.log(form);
								purchaseList.post(this.api.exam,form).then(res=>{
									console.log(res);
									this.$message.success('提交成功')
									this.getPurchaseList().then(list=>{
										let {data} = list;
										console.log(list)
										this.$refs['qualityForm'].$refs['searchForm'].resetFields();
										this.qualityHandle[0].loading = false;
										this.qualityDialog = false;
										this.gridData = data.records;
										this.dataTotal = data.total;
									}).catch(err=>{
										this.qualityHandle[0].loading = false;
										this.qualityDialog = false;
									})
								}).catch(err=>{
									this.qualityDialog = false;
									this.qualityHandle[0].loading = false;
								})
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.$nextTick(()=>{
							this.$refs.['qualityForm'].$refs['searchForm'].resetFields();
							this.qualityDialog = false;
						})
					},
					hide: false,
				}],
				entryRow:null,
				entryDialog:false,
				//旧入库
				// entryData:{
				// 	id:'',
				// 	entryNum:'',
				// 	entryTime:'',
				// 	isEntry:'',
				// 	surfaceMaterialNo:''
				// },
				// entryForm:[
				// 	...purchaseList.entryForm,
				// 	{
				// 		type: "Input",
				// 		inputType:'number',
				// 		label: "实际入库数量:",
				// 		prop: "entryNum",
				// 		placeholder: "请输入数量",
				// 		rules: [{
				// 			required: true,
				// 			message: "请输入实际入库数量",
				// 			trigger: "blur"
				// 		}]
				// 	}],
				// entryHandle:[{
				// 	label: "确认",
				// 	type: "primary",
				// 	loading:false,
				// 	handle: res => {
				// 		this.$refs['entryForm'].$refs['searchForm'].validate((valid) => {
				// 			if (valid) {
				// 				this.entryHandle[0].loading = true;
				// 				console.log(this.entryData)
				// 				purchaseList.put(this.api.entry,this.entryData).then(res=>{
				// 					this.$message.success('入库成功')
				// 					this.getPurchaseList().then(list=>{
				// 						let {data} = list;
				// 						this.gridData = data.records;
				// 						this.dataTotal = data.total;
				// 						this.$refs.['entryForm'].$refs['searchForm'].resetFields();
				// 						this.$set(this.entryRow,'entryLoading',false);
				// 						this.entryHandle[0].loading = false;
				// 						this.entryDialog = false;
				// 					}).catch(err=>{
				// 						this.entryHandle[0].loading = false;
				// 						this.entryDialog = false;
				// 						this.$set(this.entryRow,'entryLoading',false);
				// 					})
				// 				}).catch(err=>{
				// 					this.entryHandle[0].loading = false;
				// 				})
				// 			} else {
				// 				console.log('error submit!!');
				// 				return false;
				// 			}
				// 		});
				// 	},
				// 	hide: false,
				// },{
				// 	label: "取消",
				// 	type: "info",
				// 	handle: res => {
				// 		this.$nextTick(()=>{
				// 			this.$refs.['entryForm'].$refs['searchForm'].resetFields();
				// 			this.$set(this.entryRow,'entryLoading',false);
				// 			this.entryDialog = false;
				// 		})
				// 	},
				// 	hide: false,
				// }]
			}
		},
		mounted() {
			this.loading = loading(document.getElementsByClassName('app-main')[0])
			this.getPurchaseList().then(res=>{
				let {data} = res;
				console.log(res)
				this.gridData = data.records;
				this.dataTotal = data.total;
				this.getPurchaseOptions();
				this.loading.close();
			}).catch(err=>{
				this.loading.close();
			})
		},
		methods:{
			async getPurchaseOptions(){
				let result,options;
				try{
					result = await purchaseList.get(this.api.supplier,{supplierName:'',type:'1'});
					options = await purchaseList.nameOptions(result);
					console.log(options)
					this.purchaseOptions = options;
				}catch(e){
					this.$message.error(e)
				}
			},
			getPurchaseList(){
				let data = {
					current:this.pagination['currentPage'],
					size:this.pagination['pageSize'],
					search:{
						status:this.searchForm['status'],
						materialCode:this.searchForm['materialCode'],
						materialName:this.searchForm['materialName'],
						supplierName:this.searchForm['supplierName']
					}
				}
				this.expandAll = false;
				this.expandArr = [];
				return purchaseList.get(this.api.getPurchaseList,data)
			},
			searchPurchaseList: throttle (function(value){
				if(value == 'reset'){
					this.resetLoading = true;
					Object.assign(this.$data.searchForm,this.$options.data().searchForm);
				}else{
					this.searchLoading = true;
				}
                this.pagination.currentPage = 1;
				this.getPurchaseList().then(res=>{
					let {data} = res;
					this.$message({
						message: '查询成功',
						type: 'success'
					});
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.searchLoading = false;
					this.resetLoading = false;
				})
			},2000),
			expandChange(row){
				if(row.id&&!row.expandData){
					purchaseList.get(this.api.getPurchaseDetail,row.id).then(res=>{
						let {data} = res;
						this.$set(row, 'expandData', data)
					})
				}
			},
			updatepurchase(row){
				console.log(row)
				console.log(row.qualityCheck)
				this.purchaseId = row.id;
				this.purchaseForm[2].options = this.purchaseOptions
				this.updateDialog = true;
				this.$nextTick(()=>{
					this.purchaseData['status'] = row.status;
					this.purchaseData['deliveryTime'] = row.deliveryTime;
					this.purchaseData['entryTime'] = row.entryTime;
					this.purchaseData['qualityCheck'] = row.qualityCheck;
					this.purchaseData['entryNum'] = row.entryNum;
					this.purchaseData['supplierCode'] = row.supplierName;
					this.purchaseData['materialCode'] = row.materialCode;
					if(row.price == null){
						this.purchaseData['price'] = 0;
					}else{
						this.purchaseData['price'] = row.price;
					}

				})
				console.log('data',this.purchaseData)
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			isSampleCheck(row){
				this.SampleCheckDialog = true;
				this.purchaseId = row.id;
				this.sampleCheckBol = row.sampleCheck;
			},
			openSampleCheck(bol){
				let form = { id:this.purchaseId }
				form['sampleCheck'] = bol ? 2 : 1;
				this.openSampleCheck1 = bol;
				this.openSampleCheck2 = !bol;
				purchaseList.put(this.api.getPurchaseList,form).then(res=>{
					this.$message.success('修改成功')
					this.getPurchaseList().then(list=>{
						let {data} = list;
						console.log(list)
						this.gridData = data.records;
						this.dataTotal = data.total;
						if(bol){this.openSampleCheck1 = false;}else{this.openSampleCheck2 = false}
						this.SampleCheckDialog = false
					}).catch(err=>{
						if(bol){this.openSampleCheck1 = false;}else{this.openSampleCheck2 = false}
					})
				}).catch(err=>{
					if(bol){ this.openSampleCheck1 = false}else{ this.openSampleCheck2 = false}
					this.SampleCheckDialog = false;
				})
			},
			async merge(){
				if(this.multipleSelection.length==0) return
				this.mergeLoading = true;
				purchaseList.selectionId(this.multipleSelection).then(res=>{
					purchaseList.post(this.api.supplierOrder,res).then(res=>{
						console.log(res)
						this.getPurchaseList().then(list=>{
							let {data} = list;
							this.gridData = data.records;
							this.dataTotal = data.total;
							this.$refs.purchaseList.toggleSelection();
							this.$message.success('订单生成功！')
							this.mergeLoading = false;
						})

					}).catch(err=>{
						this.mergeLoading = false;
					})
				}).catch(err=>{
                    this.$message.error(err)
                    this.mergeLoading = false;
                })
			},
			//批量生成供应商订单
			async batchMerge(){
				try{
					this.batchMergeLoading = true;
					let FabricPurchase = {
						status:this.searchForm['status'],
						materialCode:this.searchForm['materialCode'],
						materialName:this.searchForm['materialName'],
						supplierName:this.searchForm['supplierName']
					}
					console.log(FabricPurchase)
					let res = await purchaseList.post(this.api.supplierOrderMass,FabricPurchase);
					let list = await this.getPurchaseList();
					let {data} = list;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.batchMergeLoading = false;
					this.$message.success('订单生成功！')
				}catch(e){
					console.log(e);
					this.batchMergeLoading = false;
				}
			},
			testing(row){
				this.purchaseId = row.id;
				if(row.qualityCheck==2&&this.qualityForm.length==1){
					let arr = [{
						type: "Input",
						label: "质检编号:",
						prop: "surfaceMaterialNo",
						placeholder: "请输入质检编号",
						rules: [{
							required: true,
							message: "请输入质检编号",
							trigger: "blur"
						}]
					},{
						type: "fileUpload",
						label: "检测报告:",
						headers: {'Authorization':this.token},
						prop: "fileUpload",
						upload: process.env.VUE_APP_BASE_URL+this.api.uploadQualit,
						rules: [{
							required: true,
							validator : (rule, value, callback) => {
								console.log(value)
								if (value.length==0) {
									return callback(new Error("文件不能为空"));
								}else{
									callback();
								}
							},
							trigger: "blur"
						}]
					}]
					this.qualityForm = this.qualityForm.concat(arr);
					this.$nextTick(()=>{
						this.qualityData['qualityCheck'] = row.qualityCheck;
						this.qualityData['materialCode'] = row.materialCode;
						this.qualityDialog = true;
					})
				}else{
					console.log(row.qualityCheck)

					this.$nextTick(()=>{
						if(row.qualityCheck!==2){
							this.qualityForm.splice(1,2)
						}
						this.qualityData['qualityCheck'] = row.qualityCheck;
						this.qualityData['materialCode'] = row.materialCode;
						this.qualityDialog = true;
					})
				}

			},
			handleChangePage(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value;
				this.getPurchaseList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			handleSizeChange(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getPurchaseList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			track(row){
				this.traceData["id"] = row.id;
				this.traceData["code"] = row.materialCode;
				this.traceData["name"] = row.materialName;
				this.traceData["status"] = row.status;

				this.traceDialog = true;
			},
			exportList(){
				let a = document.createElement('a');
				let obj = {
					materialCode:this.searchForm['materialCode'],
					materialName:this.searchForm['materialName'],
					supplierName:this.searchForm['supplierName']
				}
				//let str = filterUrl(JSON.stringify(obj))
				// let str = '?materialCode='+this.searchForm['materialCode']+
				// 	'&materialName='+this.searchForm['materialName']+
				// 	'&supplierName='+this.searchForm['supplierName']
				let url =process.env.VUE_APP_BASE_URL+this.api.fabircPurExport
				// console.log(url)
				// window.open(url)
				purchaseList.upload(url,obj,this.token,true).then(response=>{
					if (!response) return;
					console.log(response)
					const { data, headers } = response
					const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
					const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
					console.log(blob)
					const blobURL = window.URL.createObjectURL(blob)
					const tempLink = document.createElement('a')
					tempLink.download = decodeURI(fileName)
					tempLink.style.display = 'none'
					tempLink.href = blobURL
					document.body.appendChild(tempLink)
					tempLink.click()
					document.body.removeChild(tempLink)
					// 释放
					window.URL.revokeObjectURL(blobURL)
				})
			},
			// 旧入库
			// entryChange(row){
			// 	this.$set(row,'entryLoading',true);
			// 	this.entryData['id'] = row.id;
			// 	this.entryRow = row;
			// 	this.entryDialog = true
			// },
			
			//新入库
			entryChange(row){
				if(row.status < 2){
					this.$message.warning('该采购单还未生成合同订单')
				}else{
					this.entryRow = row;
					this.entryDialog = true
				}
			},
			// closeDio(row){
			// 	this.entryRow?this.$set(this.entryRow, 'entryLoading', false):'';
			// },
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("面料采购单:"+this.multipleSelection[i].materialCode+";"+this.multipleSelection[i].materialName)
				}
				this.lianDialog = true
			},
			colseTrace() {
				this.getPurchaseList().then(res=>{
					let {data} = res;
					console.log(res)
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.getPurchaseOptions();
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			lianClose(value){
				this.lianDialog = false;
			},
			lianCloseDio(value){
				this.lianDialog = value;
			},
			//入库关闭
			warDetailsClose(value){
				this.entryDialog = value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.expandTable .el-table__expanded-cell{
		padding: 0 50px;
	}
	/deep/.traceDialog .el-dialog__body{
		padding: 0 20px 30px 20px!important;
	}
	/deep/.fabricIsDisabled{
		.el-button-group>button:nth-child(1){
			pointer-events: none!important;
		}
	}
</style>

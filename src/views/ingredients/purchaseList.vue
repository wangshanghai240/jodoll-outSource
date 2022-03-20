<!--
 * @FileDescription: 辅料采购清单
 * @Author: MoonXu
 * @Date: 2021/1/21
 * @LastEditors: MoonXu
 * @LastEditTime: 2021/1/21
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="purchaseList"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		:expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange"  @handleSelectionChange="handleSelectionChange">
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" :loading="loading.exportLoading" @click="exportList" v-has:export>
					导出
				</el-button>
				<transition name="el-fade-in-linear">
					<el-button type="primary" :size="size" :loading="loading.batchMergeLoading"
					  v-if="multipleSelection.length==0" @click="batchMerge" v-has:createOrder>
						批量生成订单
					</el-button>
					<el-button type="primary" :size="size" :loading="loading.mergeLoading" @click="merge"
					  v-else v-has:createOrder>
						生成订单
					</el-button>
				</transition>
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>
				
			</div>
			<div class="searchBody">
				<el-input
					v-model="searchForm.ingredientsCode"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="辅料号 搜索"/>
				<el-input
					v-model="searchForm.ingredientsName"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="辅料名称 搜索"/>
				<el-input
					v-model="searchForm.supplierName"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="供应商 搜索"/>
				<el-select v-model="searchForm.status" :size="size" style="width: 145px; margin: 0 10px"
				  class="marginTop16" placeholder="请选择状态" clearable>
					<el-option
					v-for="item in statusOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="loading.searchLoading"
				  class="marginTop16" @click="searchPurchaseList">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="loading.resetLoading"
				  class="marginTop16" @click="searchPurchaseList('reset')">
					重置
				</el-button>
			</div>
			
			<!--弹出框-->
			<!--编辑-->
			<jod-dragDialog v-model="dialog.updateDialog" class="updatePurchase" title="编辑"  top="30vh">
				<jod-formSearch labelWidth="120px" ref="purchaseForm" :searchData="purchaseData" :searchForm="purchaseForm" v-has:update
				 :searchHandle="purchaseHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--入库检-->
			<jod-dragDialog v-model="dialog.entryDialog" class="tableDialog"  style="padding-bottom: 50px;" title="入库检" top="50px" :drag="true"
				:dialogStyle="{width: '1200',widthType: 'px'}" @closeDio="entrycloseDio">
				<warehous-details v-model="entryId" v-if="dialog.entryDialog" @entrycloseDio="entrycloseDio(arguments)"></warehous-details>
			</jod-dragDialog>
			<!--检测-->
			<jod-dragDialog v-model="dialog.examDialog" title="质量检测"  top="30vh" :dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="examForm" :searchData="examData" :searchForm="examForm"
				 :searchHandle="examHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--跟踪日志-->
			<jod-dragDialog class="traceDialog" v-model="dialog.traceDialog" title="跟踪日志"
			  :dialogStyle="{width: '80',widthType: '%'}" >
			    <!--  @closeDio="getList" -->
				<trace-list v-model="traceData" source="ingrePurchase" v-if="dialog.traceDialog"></trace-list>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
		</template>
		
		<!--slot字段-->
		<!--金额-->
		<template slot="totalAmount" slot-scope="{row,$index}">
			<span>{{ row.price*row.purchaseNum ? row.price*row.purchaseNum : 0 }}</span>
		</template>		
        <!--优先级-->
		<template slot="sort" slot-scope="{row,$index}">
			<el-tag effect="plain" type="info" :size="size" v-if="row.sort==1">
				{{ row.sort ? sortOptions[row.sort - 1].label : row.sort }}
			</el-tag>
			<el-tag effect="plain" type="" :size="size" v-else-if="row.sort==2">
				{{ row.sort ? sortOptions[row.sort - 1].label : row.sort }}
			</el-tag>
			<el-tag effect="plain" type="warning" :size="size" v-else-if="row.sort==3">
				{{ row.sort ? sortOptions[row.sort - 1].label : row.sort }}
			</el-tag>
			<el-tag effect="plain" type="danger" :size="size" v-else-if="row.sort==4">
				{{ row.sort ? sortOptions[row.sort - 1].label : row.sort }}
			</el-tag>
		</template>
		<template slot="source" slot-scope="{row,$index}">
			<span>{{row.source?sourceOpitons[row.source-1].label:row.source}}</span>
		</template>
		<!--状态-->
		<template slot="status" slot-scope="{row,$index}">
			<span>{{ (row.status!=null && row.status >= 0) && statusOptions[row.status - 1] ? statusOptions[row.status - 1].label : row.status }}</span>
		</template>
		<!--质检-->
		<template slot="examining" slot-scope="{row,$index}">
			<span>{{(row.examining != null && row.examining >=0 ) ? examiningOptions[row.examining].label: row.examining }}</span>
		</template>
		<!--下拉详情-->
		<template slot="expandForm" slot-scope="{row,$index}">
			<jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns" 
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'100px'}">
			</jod-tableList>
		</template>
		
		<template v-slot:header_input>
			<span>操作</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="success" plain  :loading="loading.entryLoading" :size="size" @click="handleEntry(row)">入库检</el-button>
			
			<el-dropdown split-button type="primary" :type="row.status>2?'info':'primary'" :size="size"
			  trigger="click" class="marginLeft10" :class="row.status>2?'ingreIsDisabled':''" @click="updatepurchase(row)">
				<span class="el-dropdown-link">
					修改
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="examCheck(row)" v-has:examining>
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
	import purchaseList from '@/api/ingredients/purchaseList.js'
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
			'warehousDetails':warehousDetails,
		},
		data(){
			return{
				// purchaseList.js引入的数据
				columns:purchaseList.columns,
				//form 表单
				sourceOpitons:purchaseList.sourceOpitons,
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
                        console.log(query)
                        if (query !== '') {
                            this.purchaseForm[2].loading = false;
                            let data = {
								type: "2",
                                supplierName:query,
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
                        message: "请选择供应商",
                        trigger: "change"
                    }],
                },{
					type: "Input",
                    label: "单价:",
                    prop: "price",
					style:"width:200px",
				}],
				options: purchaseList.options,
				sortOptions:purchaseList.sortOptions, // 优先级选项
				statusOptions:purchaseList.statusOptions, // 状态选项
				examiningOptions:purchaseList.examiningOptions, // 质检选项
				expandColumns:purchaseList.expandColumns,  // 展开字段
				expandOptions: purchaseList.expandOptions,
                purchaseOptions:[],// 供应商列表
				expandAll:null,//展开项
				expandArr:[],
				// 基本字段
				gridData: [],
				purchaseData:{},   // 一个purchase对象值
				entryData:{}, // 入库数据
				dataTotal:0,
				pagination:{   // 分页
					currentPage:1,
					pageSize:20
				},
				searchForm:{   // 搜索条件
					ingredientsCode:'',
					ingredientsName:'',
					supplierName:'',
					status:"",
				},
				multipleSelection:[],//勾选
				lianDialog:false,
				hezhu:[],
				entryId:'',//入库检id
				loading:{
					searchLoading:false,//搜索
					resetLoading:false,//重置
					entryLoading:false, //入库
					examLoading:false, //检测
					exportLoading:false,//导出
					mergeLoading:false,//合并
					batchMergeLoading:false,//批量
				},
				dialog:{
					updateDialog:false,//修改面料
					entryDialog:false, // 入库
					examDialog:false, // 检测
					traceDialog:false, // 跟踪日志
					qualityDialog:false,//质量检测
					traceDialog:false,//跟踪日志
				},
				traceData:{
					id: "",
					code:"",
					name:"",
					status:"",
					routers:"",
				},
				purchaseHandle:[   // 编辑的按钮操作
				{
					label: "提交", 
					type: "primary", 
					loading: false, 
					handle: (res) => {
						this.$refs["purchaseForm"].$refs["searchForm"].validate((valid) => {
							if(valid) {
								this.purchaseHandle[0].loading = true;
								let form = {
									id:this.purchaseData['id'],
									status:this.purchaseData['status'],
									deliveryTime:this.purchaseData['deliveryTime'],
									examining:this.purchaseData['examining'],
                                    supplierCode: this.purchaseData['supplierCode'],
                                    supplierName: this.purchaseOptions.find(x => x.value === this.purchaseData['supplierCode']).label,
									price:this.purchaseData['price'],
								}
								console.log(form)
								purchaseList.put(this.api.getIngredientPurchase,form).then((resp) => {
									this.getList();
									this.dialog.updateDialog = false;
									this.$message.success("修改成功");
									this.purchaseHandle[0].loading = false;
									this.$refs["purchaseForm"].$refs["searchForm"].resetFields();
								}).catch((err) => {
									this.$message.error("修改失败");
									this.purchaseHandle[0].loading = false;
								});
							} else {
								console.log("error submit!!");
								return false;
							}
							
						});
					},
					hide: false,
				},
				{
					label: "重置",
					type: "warning",
					handle: (res) => {
						this.$refs["purchaseForm"].$refs["searchForm"].resetFields();
					},
					hide: false,
				},
				{
					label: "取消",
					type: "info",
					handle: (res) => {
						this.$refs["purchaseForm"].$refs["searchForm"].resetFields();
						this.dialog.updateDialog = false;
					},
					hide: false,
				}],
				entryForm:purchaseList.entryForm,   // 入库字段
				entryHandle:[	// 入库按钮操作
				{
					label: "提交", 
					type: "primary", 
					loading: false, 
					handle: (res) => {
						this.$refs["entryForm"].$refs["searchForm"].validate((valid) => {
							if(valid) {
								this.entryHandle[0].loading = true;
								let form = {
									id:this.entryData['id'],
									surfaceMaterialNo:this.entryData['surfaceMaterialNo'],
									isEntry:this.entryData['isEntry'],
									entryNum:this.entryData['entryNum'],
									entryTime:this.entryData['entryTime'],
								}
								this.$store.commit('user/SET_HEADERCONTENT', true)   // 使用formdata传参
								purchaseList.put(this.api.ingredientPurchaseEntry,form).then(resp=>{
									this.$store.commit('user/SET_HEADERCONTENT', false)  // 关闭流
									this.getList();
									this.$message.success("入库成功");
									this.entryHandle[0].loading = false;
									this.dialog.entryDialog = false;
									this.loading.entryLoading = false;
									this.$refs["entryForm"].$refs["searchForm"].resetFields();
								}).catch((err) => {
									this.$message.danger("入库失败");
									this.entryHandle[0].loading = false;
									this.loading.entryLoading = false;
									this.dialog.entryDialog = false;
								});
							}
						});
					}
				},
				{
					label: "重置",
					type: "warning",
					handle: (res) => {
						this.$refs["entryForm"].$refs["searchForm"].resetFields();
						this.loading.entryLoading = false;
						this.entryHandle[0].loading = false;
					},
					hide: false,
				},
				{
					label: "取消",
					type: "info",
					handle: (res) => {
						this.$refs["entryForm"].$refs["searchForm"].resetFields();
						this.dialog.entryDialog = false;
						this.entryHandle[0].loading = false;
					},
					hide: false,
				}],
				examData:{}, // 检测数据
				examForm:[],  // 检测字段
				examHandle:[{     // 质量检测
					label: "确认",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['examForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								let {fileUpload,examining,surfaceMaterialNo} = {...this.examData}
								this.examHandle[0].loading = true;
								let form = {
									id:this.examData["id"],
									ingredientsCode:this.examData["ingredientsCode"],
									qualityCheck:this.examData["examining"]
								}
								if(examining==2){
									form['filePath'] = fileUpload[0].response.data.fileHttpPath
									form['surfaceMaterialNo'] = surfaceMaterialNo
								}
								purchaseList.post(this.api.getIngredientPurchase,form).then(res=>{
									this.$message.success('提交成功')
									this.getList();
									this.examHandle[0].loading = false;
									this.dialog.examDialog = false;
									this.$refs.['examForm'].$refs['searchForm'].resetFields();
								}).catch(err=>{
									this.examHandle[0].loading = false;
									this.dialog.examDialog = false;
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
							this.$refs.['examForm'].$refs['searchForm'].resetFields();
							this.dialog.examDialog = false;
						})
					},
					hide: false,
				}],
				purchaseId:"",	
			}
		},
		mounted() {
			this.loading = loading(document.getElementsByClassName('app-main')[0])
            purchaseList.get(this.api.supplier,{supplierName:"",type:"2"}).then(res=>{
                purchaseList.nameOptions(res).then(opt=>{
                    this.purchaseOptions = opt;
                })
            })
			this.getList();
		},
		methods:{
			// 基本功能
			getList() {
				this.getPurchaseList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			getPurchaseList(){   // 获取列表
				let data = {
					current:this.pagination['currentPage'],
					size:this.pagination['pageSize'],
					search:{
						ingredientsCode:this.searchForm['ingredientsCode'],
						ingredientsName:this.searchForm['ingredientsName'],
						supplierName:this.searchForm['supplierName'],
						status:this.searchForm['status'],
					}
				}
				this.expandAll = false;
				this.expandArr = [];
				return purchaseList.get(this.api.getIngredientPurchase,data)
			},
			handleSizeChange(value){  // 分页
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getList();
			},
			handleChangePage(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value;
				this.getList();
			},
			expandChange(row){    // 展开
				if(row.id&&!row.expandData){
					purchaseList.get(this.api.getIngredientPurchaseDetail,row.id+"").then(res=>{
						let {data} = res;
						this.$set(row, 'expandData', data)
					})
				}
			},
			handleSelectionChange(list){  // 多选
				this.multipleSelection = list;
			},
			// 功能方法
			searchPurchaseList: throttle (function(value){
				if(value == 'reset'){
					this.loading.resetLoading = true;
					Object.assign(this.$data.searchForm,this.$options.data().searchForm);
				}else{
					this.loading.searchLoading = true;
				}
                this.pagination.currentPage = 1;
				this.getList();
				this.loading.resetLoading = false;
				this.loading.searchLoading = false;
				this.$message({
					message: '查询成功',
					type: 'success'
				});
			},2000),
			exportList(){  // 导出
				let obj = {
					ingredientsCode:this.searchForm['ingredientsCode'],
					ingredientsName:this.searchForm['ingredientsName'],
					supplierName:this.searchForm['supplierName'],
					status:this.searchForm['status']
				}
				let url =process.env.VUE_APP_BASE_URL+this.api.ingredientPurchaseExport
				purchaseList.upload(url,obj,this.token,true).then(response=>{
					if (!response) return;
					console.log(response,"response")
					const { data, headers } = response
					const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
					const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
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
			async merge(){
				if(this.multipleSelection.length==0) return
				this.loading.mergeLoading = true;
				this.$store.commit('user/SET_HEADERCONTENT', true);
				purchaseList.selectionId(this.multipleSelection).then(res=>{
					let data = {ids:res};
					purchaseList.post(this.api.addIngredientSupplierOrder,data).then(res=>{
						this.$store.commit('user/SET_HEADERCONTENT', false)
						this.getList();
						this.$refs.purchaseList.toggleSelection();
						this.$message.success('已生成订单')
						this.loading.mergeLoading = false;
					}).catch(err=>{
						this.$store.commit('user/SET_HEADERCONTENT', false)
						this.loading.mergeLoading = false;
					})
				}).catch(err=>{
					this.$store.commit('user/SET_HEADERCONTENT', false)
                    this.$message.error(err)
                    this.loading.mergeLoading = false;
                })
			},
			//批量生成供应商订单
			async batchMerge(){
				try{
					this.loading.batchMergeLoading = true;
					let IngredientsPurchase = {
						ingredientsCode:this.searchForm['ingredientsCode'],
						ingredientsName:this.searchForm['ingredientsName'],
						supplierName:this.searchForm['supplierName'],
						status:this.searchForm['status'],
					}
					console.log(IngredientsPurchase)
					let res = await purchaseList.post(this.api.addSupplierOrderMass,IngredientsPurchase);
					console.log(res)
					this.loading.batchMergeLoading = false;
					this.getList();
					this.$message.success('订单生成功！')
				}catch(e){
					console.log(e);
					this.loading.batchMergeLoading = false;
				}
			},
		    updatepurchase(row){   // 编辑按钮
				console.log(row)
                this.purchaseForm[2].options = this.purchaseOptions;
				this.dialog.updateDialog = true;
				this.$nextTick(()=>{
					this.purchaseData = row;
				})
			},
			track(row){	// 跟踪日志
				// this.purchaseId = row.ingredientsDemandId;
				this.traceData["id"] = row.id;
				this.traceData["code"] = row.ingredientsCode;
				this.traceData["name"] = row.ingredientsName;
				this.traceData["status"] = row.status;
				this.dialog.traceDialog = true;
			},
			handleEntry(row) { // 入库
			console.log(row)
				if(row.status < 3){
					this.$message.warning('该采购单还未生成合同订单')
				}else{
					this.entryId = {id:row.id,type:1}
					this.dialog.entryDialog = true;
				}
			},
			// 时间标准化
			getDate(){
				const nowDate = new Date();
				const date = {
				    year: nowDate.getFullYear(),
				    month: nowDate.getMonth() + 1,
				    date: nowDate.getDate(),
				}
				const newmonth = date.month>10?date.month:'0'+date.month
				const day = date.date>10?date.date:'0'+date.date
				var time = date.year + '-' + newmonth + '-' + day
				return time
			},
			examCheck(row) { // 检测确认
				this.$nextTick(() => {
					this.examForm=[{
						type: "RadioButton",
						label: "检测:",
						prop: "examining",
						change: res => {
							if(res==2){
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
								this.examForm = this.examForm.concat(arr);
							}else{
								this.examForm.splice(1,2)
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
					}]
				})
				this.examData = row;
				this.dialog.examDialog = true;
				this.loading.examLoading = true;
			},
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("辅料采购单:"+this.multipleSelection[i].ingredientsCode+";"+this.multipleSelection[i].ingredientsName)
				}
				this.lianDialog = true
			},
			lianClose(value){
				this.lianDialog = false;
			},
			lianCloseDio(value){
				this.lianDialog = value;
			},
			entrycloseDio(value){
				this.dialog.entryDialog = false
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.expandTable .el-table__expanded-cell{
		padding: 0 50px;
	}
	/deep/.sampleCheck .el-dialog__body{
		text-align: center;
		padding: 0 20px 30px 20px!important;
	}
	/deep/.ingreIsDisabled{
		.el-button-group>button:nth-child(1){
			pointer-events: none!important;
		}
	}
</style>

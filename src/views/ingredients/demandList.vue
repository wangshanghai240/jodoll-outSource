<!--
 * @FileDescription: 辅料需求清单
 * @Author: moonxu
 * @Date: 2021/1/19
 * @LastEditors: moonxu
 * @LastEditTime: 2021/1/19
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="demandList" :pagination="pagination"
	 :dataTotal="dataTotal" :expandAll="expandAll" :expandArr="expandArr" @handleChangePage="handleChangePage"
	 @handleSizeChange="handleSizeChange" @expandChange="expandChange" @handleSelectionChange="handleSelectionChange">
		<!--slot字段-->
		<!--优先级-->
		<template slot="sort" slot-scope="{ row, $index }">
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
		<!--是否购买-->
		<template slot="isPurchase" slot-scope="{ row, $index }">
			<span>{{(row.isPurchase!= null && row.isPurchase >= 0) ? isPurchaseOptions[row.isPurchase].label : row.isPurchase}}</span>
		</template>
		<!--状态-->
		<template slot="status" slot-scope="{ row, $index }">
			<span>{{row.status &&  statusOptions[row.status - 1]? statusOptions[row.status - 1].label : row.status}}</span>
		</template>
		<!--下拉框 详情-->
		<template slot="expandForm" slot-scope="{ row, $index }">
			<jod-tableList class="expandTable" :dataSource="row.expandData ? row.expandData : []" :columns="expandColumns"
			 :options="row.expandData && row.expandData.length !== 0 ? expandOptions : { tHeight: '100px' } ">

				<!--隐藏发货-->
				<!-- <template v-slot:header_input> 操作 </template>
				<template slot="operate" slot-scope="scope">
					<el-button type="primary" plain :size="size" @click="deliverGoods(scope.row)">发货 </el-button>
				</template> -->
			</jod-tableList>
		</template>

		<!--表格外的内容-->
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" :loading="exportLoading" @click="exportList" v-has:export> 导出 </el-button>
				<el-button type="success" plain :loading="selectionLoading" :size="size" @click="generatePurchase('selection')" v-has:createPurchase>
					生成采购单
				</el-button>
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>
			</div>
			<div class="searchBody">
				<el-input v-model="searchForm.ingredientsCode" :size="size" style="width: 145px;"
				  class="marginTop16" placeholder="辅料号 搜索" />
				<el-input v-model="searchForm.ingredientsName" :size="size" style="width: 145px; margin: 0 10px"
				  class="marginTop16" placeholder="辅料名称 搜索" />
				<el-input v-model="searchForm.supplierName" :size="size" style="width: 145px; margin: 0 10px"
				  class="marginTop16" placeholder="供应商 搜索" />
				<el-select v-model="searchForm.status" :size="size" style="width: 145px; margin: 0 10px"
				 class="marginTop16" placeholder="请选择状态">
					<el-option
					v-for="item in statusOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-select v-model="searchForm.isPurchaseNum" :size="size" style="width: 145px;margin:0 10px;"
				  class="marginTop16" placeholder="应采数是否>0" clearable>
					<el-option
					v-for="item in purchaseNumOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" style="width: 95px" :size="size" :loading="searchLoading"
				  class="marginTop16" @click="searchDemandList">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px" :size="size" :loading="resetLoading"
				  class="marginTop16" @click="searchDemandList('reset')">
					重置
				</el-button>
			</div>
			<jod-dragDialog v-model="addDialog" class="demandAdd" :title="demandTitle" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="closeDemandForm">
				<jod-formSearch labelWidth="120px" ref="demandForm" :searchData="demandData" :searchForm="demandForm"
				 :searchHandle="prePurchaseHandler">
				</jod-formSearch>
			</jod-dragDialog>
			<!--弹出框-->
			<!-- 生成采购 -->
			<jod-dragDialog class="purchaseDialog" v-model="dialog.purchaseDialog" title="采购" :dialogStyle="diaPurStyle"
			 @closeDio="closeDio" :drag="true" top="10px">
			 <el-alert
			     title="勾选数据和实际展示数据会因状态不同产生偏差"
			 	style="margin-bottom: 10px;"
			     type="info"
			     show-icon
			 	:closable="false">
			   </el-alert>
				<jod-formSearch ref="purchaseForm" :searchData="purchaseData" :searchForm="purchaseForm"
				 :searchHandle="purchaseHandle" :labelWidth="'185px'">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 编辑 -->
			<jod-dragDialog v-model="dialog.updateDialog" class="demandAdd" title="编辑">
				<jod-formSearch labelWidth="120px" ref="demandForm" :searchData="demandData" :searchForm="demandForm" :searchHandle="demandHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 跟踪日志 -->
			<jod-dragDialog class="traceDialog" v-model="dialog.traceDialog" title="跟踪日志"
			  :dialogStyle="diaStyle">
				<!--  @closeDio="getList" -->
				<trace-list v-model="traceData" source="ingre" v-if="dialog.traceDialog"></trace-list>
			</jod-dragDialog>
			<!--发货-->
			<jod-dragDialog v-model="dialog.deliverDialog" class="deliver" title="发货">
				<deliver-form v-model="shopId" @dioFalse="dialog.deliverDialog = false"></deliver-form>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
		</template>
		
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="addIngredientsDemand">新增预投单</el-button>
		</template>
		
		<!--操作按钮-->
		<template slot="operate" slot-scope="{ row, $index }">
			<el-button type="success" plain :loading="row.selectionLoading" :size="size" @click="generatePurchase(row)" v-has:createPurchase
			 :disabled="row.status != 1">
				生成采购单
			</el-button>
			<el-button type="info" plain :loading="row.nonPurchase" :size="size" @click="nonPurchase(row)" :disabled="row.status != 1" v-has:notPurchase>
				无需采购
			</el-button>
			<el-dropdown split-button type="primary" :size="size" trigger="click" class="marginLeft10" @click="updateDemand(row)" v-has:update>
				<div class="el-dropdown-link">修改</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="track(row)">
						<span>跟踪日志</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</template>
	</jod-tableList>
</template>

<script>
	import demandList from "@/api/ingredients/demandList.js";
	import {loading} from "@/utils";
	import {mapGetters} from "vuex";
	import {throttle} from '@/utils/validate'
	import trace from "../controller/traceLog/traceLogList.vue";
	import deliverForm from "../fabric/components/deliverGoods.vue";
	import lianxidan from '../orderShop/components/lianxidanT.vue'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			traceList: trace,
			deliverForm: deliverForm,
			'lianxianUp':lianxidan,
		},
		data() {
			return {
				// demandList.js引入的数据
				columns: demandList.columns,
				options: demandList.options,
				sortOptions: demandList.sortOptions, // 优先级选项
				isPurchaseOptions: demandList.isPurchaseOptions, // 是否购买选项
				statusOptions: demandList.statusOptions, // 状态选项
				expandColumns: demandList.expandColumns, //展开项
				expandOptions: demandList.expandOptions,
				expandAll: null, //展开项
				expandbll:[],
				dialogAdd:true,
				demandTitle:'新增预投单',
				addDialog:false,
				expandArr: [],
				bll:[],
				purchaseNumOptions:[{
					value:true,
					label:"是"
				},{
					value:false,
					label:"否"
				}],
				// 基本字段
				gridData: [],
				pagination: {
					currentPage: 1,
					pageSize: 10,
				},
				dataTotal: 0,
				searchForm: { //搜索条件
					ingredientsName: "",
					ingredientsCode: "",
					supplierName: "",
					status: "",
					isPurchaseNum:"",
				},
				diaStyle: {
					width: "80",
					widthType: "%",
				},
				diaPurStyle: {
					//弹窗宽
					width: "550",
					widthType: "px",
				},
				// 加载
				loading: null,
				searchLoading: false, //搜索
				resetLoading: false, // 重置
				exportLoading: false, //导出
				selectionLoading: false, //批量加载
				purchaseLoading: false, //批量采购
				dialog: { // 弹窗
					deliverDialog: false, //发货
					purchaseDialog: false, //数量弹窗
					updateDialog: false, //编辑
					traceDialog: false, // 跟踪日志
				},
				purchaseData: {}, //采购数据
				purchaseForm: [],// 采购表单
				prePurchaseHandler:[
					{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['demandForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									let form = {
										materialCode:this.demandData['materialCode'],
										preNum:this.demandData['preNum'],
										sort:this.demandData['sort'],
									}
									this.$store.commit('user/SET_HEADERCONTENT', true)
									this.demandHandle[0].loading = true;
									demandList.post(this.api.addPrePurchase,form).then(addRes=>{
										this.$store.commit('user/SET_HEADERCONTENT', false)
										this.getDemandList().then(res=>{
											let {data} = res;
											this.demandHandle[0].loading = false;
											this.$message.success('添加成功')
											this.addDialog = false;
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$refs['demandForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.addDialog = false;
										})
									}).catch(err=>{
										this.demandHandle[0].loading = false;
										this.$store.commit('user/SET_HEADERCONTENT', false)
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
						this.$refs['demandForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.$refs['demandForm'].$refs['searchForm'].resetFields();
						this.addDialog = false;
					},
					hide: false,
				}
				],
				purchaseHandle: [ // 采购的按钮和操作
					{
						label: "提交",
						type: "primary",
						loading: false,
						handle: (res) => {
							this.$refs["purchaseForm"].$refs["searchForm"].validate((valid) => {
								if (valid) {
									this.purchaseHandle[0].loading = true;
									demandList.selectionId(this.purchaseData).then((list) => {
										this.$refs.demandList.toggleSelection();
										console.log(list)
										demandList.post(this.api.addIngredientPurchase, list).then((res) => {
											this.$message.success('生成采购成功')
											this.closePurchaseHandle();
										}).catch((err) => {
											this.closePurchaseHandle();
										});
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
						label: "取消",
						type: "info",
						handle: (res) => {
							this.closePurchaseHandle();
						},
						hide: false,
					},
				],
				multipleSelection: [], //批量源
				lianDialog:false,
				hezhu:[],
				selectRow: null, //单行
				demandData: {
					id:'',
					deliveryTime:'',
					purchaseNum:'',
					sort:''
				},
				demandForm: [],
				demandHandle: [ // 编辑的操作
					{
						label: "提交", //按钮
						type: "primary", //颜色
						loading: false, //加载
						handle: (res) => {
							this.$refs["demandForm"].$refs["searchForm"].validate((valid) => {
								if (valid) {
									this.demandHandle[0].loading = true;
									let form = {
										id: this.demandData["id"],
										deliveryTime: this.demandData["deliveryTime"],
										purchaseNum: this.demandData["purchaseNum"],
										sort: this.demandData["sort"],
									};
									demandList.put(this.api.ingredientsDemand, form).then((addRes) => {
										this.$message.success("修改成功");
										this.getList();
										this.dialog.updateDialog = false;
										this.$refs["demandForm"].$refs["searchForm"].resetFields();
										this.demandHandle[0].loading = false;
									}).catch((err) => {
										this.demandHandle[0].loading = false;
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
							this.$refs["demandForm"].$refs["searchForm"].resetFields();
						},
						hide: false,
					},
					{
						label: "取消",
						type: "info",
						handle: (res) => {
							this.$refs["demandForm"].$refs["searchForm"].resetFields();
							this.dialog.updateDialog = false;
						},
						hide: false,
					},
				],
				shopId: "", // 记录goodsId
				demandId: "", // 记录Id
				traceData:{
					id: "",
					code:"",
					name:"",
					status:"",
					routers:"",
				},

			};
		},
		mounted() { // 初始化
			this.loading = loading(document.getElementsByClassName("app-main")[0]);
			this.getList()
		},
		methods: {
			// 基本方法
			getList() {
				this.getDemandList().then((res) => {
					let {
						data
					} = res;
					console.log(res)
					this.loading.close();
					this.gridData = data.records;
					// 获取preparationNum为null的数组
					this.bll = res.data.records.filter(item=>item.preparationNum == null)
					// 给preparationNum字段赋值为0
					for(let i=0;i<this.bll.length;i++){
						this.bll[i].preparationNum = 0
					}
					// 数组去重
					this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
					console.log(this.gridData)
					this.dataTotal = data.total;
					
				}).catch((err) => {
					this.loading.close();
				});
			},
			getDemandList() {
				let data = {
					current: this.pagination["currentPage"],
					size: this.pagination["pageSize"],
					search: {
						ingredientsName: this.searchForm["ingredientsName"],
						ingredientsCode: this.searchForm["ingredientsCode"],
						supplierName: this.searchForm["supplierName"],
						status: this.searchForm["status"],
						isPurchaseNum: this.searchForm["isPurchaseNum"]
					},
				};
				this.expandAll = false;
				this.expandArr = [];
				return demandList.get(this.api.ingredientsDemand, data);
			},
			handleChangePage(value) { // 分页
				this.loading = loading(document.getElementsByClassName("app-main")[0]);
				this.pagination["currentPage"] = value;
				this.getList();
			},
			handleSizeChange(value) {
				this.loading = loading(document.getElementsByClassName("app-main")[0]);
				this.pagination["currentPage"] = 1;
				this.pagination["pageSize"] = value;
				this.getList();
			},
			expandChange(row) { // 下拉展示
				if (row.id && !row.expandData) {
					demandList.get(this.api.ingredientsDetail, {
						id: row.id
					}).then((res) => {
						let {
							data
						} = res;
						this.expandbll = data.filter(item=>item.preparationNum == null)
						console.log(this.expandbll)
						for(let i=0;i<this.expandbll.length;i++){
							this.expandbll[i].preparationNum = '0'
						}
						data = this.expandbll.concat(data).filter((item,index,arr)=>arr.indexOf(item,0) === index)
						this.$set(row, "expandData", data);
					});
				}
			},
			handleSelectionChange(list) { // 复选框/全选按钮
				this.multipleSelection = list;
			},
			// 功能方法
			searchDemandList: throttle(function(value) {
				if (value == "reset") {
					this.resetLoading = true;
					Object.assign(this.$data.searchForm, this.$options.data().searchForm);
				} else {
					this.searchLoading = true;
				}
               	this.pagination.currentPage = 1;
				this.getDemandList().then((res) => {
					let {
						data
					} = res;
					this.$message({
						message: "查询成功",
						type: "success",
					});
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.searchLoading = false;
					this.resetLoading = false;
				}).catch(err => {
					this.searchLoading = false;
					this.resetLoading = false;
				});
			}, 2000),
			deliverGoods(row) { // 发货
				console.log(row)
				this.shopId = row.goodsId;
				this.dialog.deliverDialog = true;
			},
			exportList() { // 导出
				let a = document.createElement('a');
				let obj = {
					ingredientsName: this.searchForm["ingredientsName"],
					ingredientsCode: this.searchForm["ingredientsCode"],
					supplierName: this.searchForm["supplierName"],
				}
				let url = process.env.VUE_APP_BASE_URL + this.api.exportIngredient;
				demandList.upload(url, obj, this.token, true).then(response => {
					if (!response) return;
					console.log(response)
					const {
						data,
						headers
					} = response
					const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
					const blob = new Blob([response.data], {
						type: 'application/vnd.ms-excel'
					})
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
			generatePurchase(value) { // 生成采购单
				this.purchaseData = {};
				this.purchaseForm = [];
				if(value=='selection'){
					if(this.multipleSelection.length==0){
						this.$message.warning('请先选择所要生成采购单的数据')
						return
					}
					this.selectionLoading = true;
					this.dialog.purchaseDialog = true;
					this.$nextTick(()=>{
						this.multipleSelection.forEach(item=>{
							// this.purchaseData[item.id] = ''
							if(item.status!==1) return
							this.purchaseForm.push({
								type: "Input",
								inputType:'number',
								label: item.ingredientsCode+" 数量:",
								labelWidth:'200px',
								prop: item.id,
								placeholder: "请输入采购数量",
								style:"width:150px",
								rules: [{
									required: true,
									validator: (rule, value, callback)=>{
										if (!value||value=='0') {
											return callback(new Error("数量不能为0或空"));
										} else {
											callback();
										}
									},
									trigger: "blur"
								}]
							})
							this.purchaseForm.push({
								type: "Value",
								label: "应采数量:",
								labelWidth:'100px',
								prop: item.id+"Num",
							})
							this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
							this.$set(this.purchaseData,item.id,item.purchaseNum);
							this.$set(this.purchaseData,item.id+'Num',item.needPurchaseNum);
						})
					})
				}else{
					this.$set(value, 'selectionLoading', true);
					this.dialog.purchaseDialog = true;
					this.selectRow = value;
					this.$nextTick(()=>{
						this.purchaseForm = [{
							type: "Input",
							inputType:'number',
							label: value.ingredientsCode+" 数量:",
							prop: value.id,
							placeholder: "请输入采购数量",
							labelWidth:'200px',
							style:"width:150px",
							// 表单验证
							rules: [{
								required: true,
								validator: (rule, value, callback)=>{
									if (!value||value=='0') {
										return callback(new Error("数量不能为0或空"));
									} else {
										callback();
									}
								},
								trigger: "blur"
							}]
						},{
							type: "Value",
							label: "应采数量:",
							labelWidth:'100px',
							prop: value.id+"Num",
						}]
						this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
						this.$set(this.purchaseData,value.id,value.purchaseNum);
						this.$set(this.purchaseData,value.id+'Num',value.needPurchaseNum);
					})
				}
			},
			closePurchaseHandle() { // 关闭采购
				if (this.selectRow) this.$set(this.selectRow, "selectionLoading", false);
				this.$refs["purchaseForm"].$refs["searchForm"].resetFields();
				this.purchaseHandle[0].loading = false;
				this.selectionLoading = false;
				this.dialog.purchaseDialog = false;
				this.getList();
			},
			closeDemandForm(){
				this.$refs.['demandForm'].$refs['searchForm'].resetFields();
			},
			closeDio(row) { // 关闭复选框加载状态
				this.selectRow ? this.$set(this.selectRow, "selectionLoading", false) : "";
				this.selectionLoading = false;
			},
			addIngredientsDemand(){
				this.$nextTick(()=>{
					this.demandForm = [{
							type: "Select",
							label: "辅料:",
							prop: "materialCode",
							options: [],
							style:"width:200px",
							change: row => {
								console.log(row)
							},
							placeholder: "请选择辅料",
							clearable:true,
							filterable:true,
							remote:true,
							loading:false,
							remoteMethod: query => {
								if (query !== '') {
									this.demandForm[0].loading = true;
									let data = {
										materialName:query
									}
									demandList.get(this.api.getIngredientsCode,data).then(res=>{
										demandList.fabricOptions(res).then(opt=>{
											this.demandForm[0].loading = false;
											this.demandForm[0].options = opt
										})
									}).catch(err=>{
										this.demandForm[0].loading = false;
									})
								} else {
								  this.demandForm[0].options = [];
								}
							},
							rules: [{
								required: true,
								message: "请输入面料",
								trigger: "change"
							}],
						},{
							type: "Input",
							inputType:'number',
							label: "数量:",
							prop: "preNum",
							style:"width:200px",
							placeholder: "请输入数量",
							// 表单验证
							rules: [{
								required: true,
								message: "请输入数量",
								trigger: "blur"
							}]
						},{
							type: "Select",
							label: "优先级:",
							prop: "sort",
							options: demandList.sortOptions,
							clearable:true,
							style:"width:200px",
							placeholder: "请选择优先级",
							change: row => "",
						}
					];
					this.addDialog = true;
				})
			},
			updateDemand(row) { // 修改界面
				this.dialog.updateDialog = true;
				let {id,deliveryTime,purchaseNum,sort} = row
				this.demandForm = [ //编辑表单
					{
						type: "Value",
						label: "应采数量:",
						prop: "needPurchaseNum",
						style:"width:200px",
					},{
						type: "Date",
						label: "交期:",
						prop: "deliveryTime",
						placeholder: "请选择交期",
						style:"width:200px",
						change: (data) => {
							console.log(data);
						},
						rules: [{
							required: true,
							message: "请选择交期",
							trigger: "blur",
						}, ],
					},
					{
						type: "Input",
						inputType: "number",
						label: "采购数量:",
						prop: "purchaseNum",
						style:"width:200px",
						placeholder: "请输入采购数量",
						// 表单验证
						rules: [{
							required: true,
							message: "请输入数量",
							trigger: "blur",
						}, ],
					},
					{
						type: "Select",
						label: "优先级:",
						prop: "sort",
						options: demandList.sortOptions,
						style:"width:200px",
						placeholder: "请选择优先级",
						clearable: true,
						change: row => "",
					},

				];
				this.$nextTick(() => {
					this.$refs['demandForm'].$refs['searchForm'].resetFields();
					this.demandData.id = id
					this.demandData.deliveryTime = deliveryTime
					this.demandData.purchaseNum = purchaseNum
					this.demandData.needPurchaseNum = row.needPurchaseNum;
					this.demandData.sort = sort
				});
				this.dialogAdd = false;
			},
			track(row) { // 跟踪日志
				// this.demandId = row.id;
				this.traceData["id"] = row.id;
				this.traceData["code"] = row.ingredientsCode;
				this.traceData["name"] = row.ingredientsName;
				this.traceData["status"] = row.status;
				this.dialog.traceDialog = true;
			},
			nonPurchase(row) {
				let request = {
					status: 2,
					isPurchase: 0
				};
				this.$set(row,'nonPurchase',true);
				request.id = row.id;
				if(row.needPurchaseNum>0){
					this.$confirm('是否确认无需采购?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						demandList.put(this.api.ingredientsDemand, request).then(putRes => {
							this.$message.success('操作成功')
							this.getList();
							this.$set(row,'nonPurchase',false);
							this.$refs. ['demandForm'].$refs['searchForm'].resetFields();
						}).catch(err => {
							this.$set(row,'nonPurchase',false);
						})
					}).catch(() => {
						this.$set(row,'nonPurchase',false);
					});
				}else{
					demandList.put(this.api.ingredientsDemand, request).then(putRes => {
						this.$message.success('操作成功')
						this.getList();
						this.$set(row,'nonPurchase',false);
						this.$refs. ['demandForm'].$refs['searchForm'].resetFields();
					}).catch(err => {
						this.$set(row,'nonPurchase',false);
					})
				}
			},
			closeDemandForm() {
				this.$refs['demandForm'].$refs['searchForm'].resetFields();
			},
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("辅料需求单:"+this.multipleSelection[i].ingredientsCode+";"+this.multipleSelection[i].ingredientsName)
				}
				this.lianDialog = true
			},
			lianClose(value){
				this.lianDialog = false;
			},
			lianCloseDio(value){
				this.lianDialog = value;
			}
		},
	};
</script>

<style lang="scss" scoped>
	/deep/.expandTable .el-table__expanded-cell {
		padding: 0 50px;
	}
</style>

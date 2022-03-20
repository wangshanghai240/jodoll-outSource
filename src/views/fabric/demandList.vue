<!--
 * @FileDescription: 面料需求清单
 * @Author: wangpenghui
 * @Date: 2021/1/13
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/15
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="demandList"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage" :expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange" @handleSelectionChange="handleSelectionChange">
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" :loading="exportLoading" @click="exportList" v-has:export>
					导出
				</el-button>
				<el-button type="success" plain  :loading="selectionLoading" :size="size"
				  @click="generatePurchase('selection')" v-has:createPurchase>生成采购单</el-button>
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
				<el-select v-model="searchForm.isPurchaseNum" :size="size" style="width: 145px;margin:0 10px;" 
				  class="marginTop16" placeholder="应采数是否>0" clearable>
					<el-option
					v-for="item in purchaseNumOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" style="width: 95px;margin-top: 16px;" :size="size" :loading="searchLoading" 
				  @click="searchDemandList">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;margin-top: 16px;" :size="size" :loading="resetLoading" 
				  @click="searchDemandList('reset')">
					重置
				</el-button>
			</div>
			<!-- 新增 -->
			<jod-dragDialog v-model="addDialog" class="demandAdd" :title="demandTitle" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="closeDemandForm">
				<jod-formSearch labelWidth="120px" ref="demandForm" :searchData="demandData" :searchForm="demandForm"
				 :searchHandle="demandHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 跟踪日志 -->
			<jod-dragDialog class="tableDialog" v-model="traceDialog" title="跟踪日志"
			  :dialogStyle="diaStyle">
			    <!-- @closeDio="colseTrace"-->
				<trace-list v-model="traceData" source="fabric" v-if="traceDialog"></trace-list>
			</jod-dragDialog>
			<!-- 生成采购 -->
			<jod-dragDialog class="tableDialog" v-model="purchaseDialog" title="采购" :dialogStyle="diaPurStyle"
				@closeDio="closeDio" :drag="true" top="10px">
				<el-alert
				    title="勾选数据和实际展示数据会因状态不同产生偏差"
					style="margin-bottom: 10px;"
				    type="info"
				    show-icon
					:closable="false">
				  </el-alert>
				<jod-formSearch  ref="purchaseForm" :searchData="purchaseData" :searchForm="purchaseForm"
					:searchHandle="purchaseHandle" :labelWidth="'185px'">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 发货 -->
			<jod-dragDialog v-model="deliverDialog" class="deliver" title="发货">
				<deliver-form v-model="shopId" v-if="deliverDialog" @dioFalse="deliverDialog = false"></deliver-form>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
		</template>

		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="addDemand" v-has:add>新增预投单</el-button>
		</template>

		<template slot="operate" slot-scope="{row}">
			<el-button type="success" plain  :loading="row.selectionLoading" :size="size" @click="generatePurchase(row)" :disabled = "row.status != 1" v-has:createPurchase>
				生成采购单
			</el-button>
			<el-button type="info" plain  :loading="row.nonPurchase" :size="size" @click="nonPurchase(row)" :disabled = "row.status != 1" v-has:notPurchase>
				无需采购
			</el-button>


			<el-dropdown split-button type="primary" :size="size" trigger="click" class="marginLeft10" @click="updateDemand(row)" v-has:update>
				<div class="el-dropdown-link">
					修改
				</div>
				<el-dropdown-menu slot="dropdown">
					<!-- <el-dropdown-item @click.native="queryShop(row)">
						<span>查看商品明细</span>
					</el-dropdown-item> -->
					<!-- <el-dropdown-item>
						<span @click="">发货</span>
					</el-dropdown-item> -->
					<el-dropdown-item @click.native="track(row)">
						<span>跟踪日志</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</template>

		<template slot="sort" slot-scope="{row}">
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
		<template slot="isPurchase" slot-scope="{row}">
			<span>{{row.isPurchase?isPurchaseOptions[row.isPurchase].label:row.isPurchase}}</span>
		</template>
		<template slot="status" slot-scope="{row}">
			<span>{{row.status && statusOptions[row.status-1] ?statusOptions[row.status-1].label:row.status}}</span>
		</template>

		<template slot="expandForm" slot-scope="{row}">
			<jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'100px'}">
				<!--隐藏发货-->
				<!-- <template v-slot:header_input>
					操作
				</template>
				<template slot="operate" slot-scope="scope">
					<el-button type="primary" plain :size="size" @click="deliverGoods(scope.row)">
						发货
					</el-button>
				</template> -->
			</jod-tableList>
		</template>
	</jod-tableList>
</template>

<script>
	import demandList from '@/api/fabric/demandList.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import { filterUrl , throttle } from '@/utils/validate'
	import trace from '../controller/traceLog/traceLogList.vue'
	import deliverForm from './components/deliverGoods.vue'
	import lianxidan from '../orderShop/components/lianxidanT.vue'
	export default{
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			'traceList':trace,
			'deliverForm':deliverForm,
			'lianxianUp':lianxidan,
		},
		data(){
			return{
				columns:demandList.columns,
				options: demandList.options,
				sortOptions:demandList.sortOptions,
				isPurchaseOptions:demandList.isPurchaseOptions,
				statusOptions:demandList.statusOptions,
				gridData: [],
				pagination:{
					currentPage:1,
					pageSize:10
				},
				dataTotal:0,
				//展开项
				expandColumns:demandList.expandColumns,
				expandOptions: demandList.expandOptions,
				//搜索
				searchForm:{
					status:'',
					materialCode:'',
					materialName:'',
					supplierName:'',
					isPurchaseNum:'',
				},
				searchLoading:false,
				resetLoading:false,
				exportLoading:false,
				multipleSelection:[],//批量源
				lianDialog:false,
				hezhu:[],
				bll:[],//preparationNum为null的备料量
				expandbll:[],
				expandAll:null,//展开项
				expandArr:[],
				selectRow:null,//单行
				selectionLoading:false,//批量加载
				purchaseLoading:false,//批量采购
				purchaseDialog:false,//数量弹窗
				diaPurStyle : {//弹窗宽
					width: '650',
					widthType: 'px'
				},
				deliverDialog:false,//发货弹窗
				labelWidth:'',
				purchaseData:{},
				purchaseForm: [],
				purchaseHandle: [{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['purchaseForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.purchaseHandle[0].loading = true;

								demandList.selectionId(this.purchaseData).then(list=>{
									console.log(list)
									this.$refs.demandList.toggleSelection();
									demandList.post(this.api.generatePurchase,list).then(res=>{
										console.log(res);
										if(this.selectRow) this.$set(this.selectRow, 'selectionLoading', false);
										this.$message.success('生成采购成功')
										this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
										this.purchaseHandle[0].loading = false;
										this.selectionLoading = false;
										this.purchaseDialog = false;
										this.getDemandList().then(res=>{
											let {data} = res;
											this.gridData = data.records;
											this.dataTotal = data.total;
										}).catch(err=>{})
									}).catch(err=>{
										if(this.selectRow) this.$set(this.selectRow, 'selectionLoading', false);
										this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
										this.purchaseHandle[0].loading = false;
										this.selectionLoading = false;
										this.purchaseDialog = false;
									})
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
						if(this.selectRow) this.$set(this.selectRow, 'selectionLoading', false);
						this.$refs['purchaseForm'].$refs['searchForm'].resetFields();
						this.selectionLoading = false;
						this.purchaseDialog = false;
					},
					hide: false,
				}],
				loading:null,
				addDialog:false,
				dialogAdd:true,//弹窗是否新增
				traceDialog:false,
				diaStyle : {
					width: '80',
					widthType: '%'
				},
				demandId:'',//id
				traceData:{
					id: "",
					code:"",
					name:"",
					status:"",
					routers:"",
				},
				shopId:'',
				demandTitle:'新增预投单',
				demandData:{
                    deliveryTime:'',
					materialCode:'',
					preNum:'',
					sort:1
				},
				purchaseNumOptions:[{
					value:true,
					label:"是"
				},{
					value:false,
					label:"否"
				}],
				demandForm: [],
				demandHandle: [{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['demandForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								if(this.dialogAdd){
									let form = {
										materialCode:this.demandData['materialCode'],
										preNum:this.demandData['preNum'],
										sort:this.demandData['sort'],
									}
									this.$store.commit('user/SET_HEADERCONTENT', true)
									this.demandHandle[0].loading = true;
									demandList.post(this.api.addDemand,form).then(addRes=>{
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
								}else{
									this.demandHandle[0].loading = true;
									let form = {
										id:this.demandId,
                                        deliveryTime:this.demandData['deliveryTime'],
										purchaseNum:this.demandData['preNum'],
										sort:this.demandData['sort'],
									};
									console.log(form);
									demandList.put(this.api.updateDemand,form).then(addRes=>{
										this.getDemandList().then(res=>{
											let {data} = res;
											this.demandHandle[0].loading = false;
											this.$message.success('修改成功')
											this.addDialog = false;
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$refs['demandForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.addDialog = false;
										})
									}).catch(err=>{
										this.demandHandle[0].loading = false;
									})
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
				}],
			}
		},
		mounted() {
			this.loading = loading(document.getElementsByClassName('app-main')[0])
			this.getDemandList().then(res=>{
				let {data} = res;
				console.log(res)
				this.gridData = data.records;
				this.bll = this.gridData.filter(item=>item.preparationNum == null)
				for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = '0'
				}
				this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
				this.dataTotal = data.total;
				this.loading.close();
			}).catch(err=>{
				this.loading.close();
			})
		},
		methods:{
			getDemandList(){
				let data = {
					current:this.pagination['currentPage'],
					size:this.pagination['pageSize'],
					search:{
						status:this.searchForm['status'],
						materialCode:this.searchForm['materialCode'],
						materialName:this.searchForm['materialName'],
						supplierName:this.searchForm['supplierName'],
						isPurchaseNum:this.searchForm['isPurchaseNum'],
					}
				}
				this.expandAll = false;
				this.expandArr = [];
				return demandList.get(this.api.getDemandList,data)
			},
			searchDemandList: throttle (function(value){
				if(value == 'reset'){
					this.resetLoading = true;
					Object.assign(this.$data.searchForm,this.$options.data().searchForm);
				}else{
					this.searchLoading = true;
				}
                current:this.pagination.currentPage = 1;
				this.getDemandList().then(res=>{
					let {data} = res;
					this.$message.success('搜索完成')
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.searchLoading = false;
					this.resetLoading = false;
				})
			},2000),
			expandChange(row){
				if(row.id&&!row.expandData){
					demandList.get(this.api.getDemandDetail,{'id':row.id}).then(res=>{
						console.log(res)
						let {data} = res;
						this.expandbll = data.filter(item=>item.preparationNum == null)
						console.log(this.expandbll)
						for(let i=0;i<this.expandbll.length;i++){
							this.expandbll[i].preparationNum = '0'
						}
						data = this.expandbll.concat(data).filter((item,index,arr)=>arr.indexOf(item,0) === index)
						this.$set(row, 'expandData', data)
					})
				}
			},
			exportList(){
				let a = document.createElement('a');
				let obj = {
					materialCode:this.searchForm['materialCode'],
					materialName:this.searchForm['materialName'],
					supplierName:this.searchForm['supplierName'],
					status:this.searchForm['status']
				}
				//let str = filterUrl(JSON.stringify(obj))
				// let str = '?materialCode='+this.searchForm['materialCode']+
				// 	'&materialName='+this.searchForm['materialName']+
				// 	'&supplierName='+this.searchForm['supplierName']
				let url =process.env.VUE_APP_BASE_URL+this.api.fabricExport
				// console.log(url)
				// window.open(url)
				demandList.upload(url,obj,this.token,true).then(response=>{
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

					// const fileName = response.headers['content-disposition'].match(
					//     /filename=(.*)/
					//   )[1]
					//   // 将二进制流转为blob
					//   const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
					//   if (typeof window.navigator.msSaveBlob !== 'undefined') {
					//     // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
					//     window.navigator.msSaveBlob(blob, decodeURI(filename))
					//   } else {
					//     // 创建新的URL并指向File对象或者Blob对象的地址
					//     const blobURL = window.URL.createObjectURL(blob)
					//     // 创建a标签，用于跳转至下载链接
					//     const tempLink = document.createElement('a')
					//     tempLink.style.display = 'none'
					//     tempLink.href = blobURL
					//     tempLink.setAttribute('download', decodeURI(filename))
					//     // 兼容：某些浏览器不支持HTML5的download属性
					//     if (typeof tempLink.download === 'undefined') {
					//       tempLink.setAttribute('target', '_blank')
					//     }
					//     // 挂载a标签
					//     document.body.appendChild(tempLink)
					//     tempLink.click()
					//     document.body.removeChild(tempLink)
					//     // 释放blob URL地址
					//     window.URL.revokeObjectURL(blobURL)
					//   }

					// let url = window.URL.createObjectURL(data.data)
					// let link = document.createElement('a')
					// link.style.display = 'none'
					// link.href = url
					// link.setAttribute('download', 'excel.xls')
					// document.body.appendChild(link)
					// link.click()
				})

				// a.href = url;
				// a.click();
				// this.exportLoading = true;
				// let data = {
				// 	search:{
				// 		materialCode:this.searchForm['materialCode'],
				// 		materialName:this.searchForm['materialName'],
				// 		supplierName:this.searchForm['supplierName']
				// 	}
				// }
				// demandList.get(this.api.fabricExport,data).then(res=>{
				// 	this.exportLoading = false;
				// }).catch(err=>{
				// 	this.exportLoading = false;
				// })
			},
			track(row){
				// this.demandId = row.id;
				this.traceData["id"] = row.id;
				this.traceData["code"] = row.materialCode;
				this.traceData["name"] = row.materialName;
				this.traceData["status"] = row.status;

				this.traceDialog = true;
			},
			updateDemand(row){
				console.log(row)
				this.demandTitle = '修改需求单';
				this.demandId = row.id;
				this.demandForm = [
					{
						type: "Value",
						label: "应采数量:",
						prop: "needPurchaseNum",
						style:"width:200px",
					},{
						type: "Date",
						label: "交期:",
						prop: "deliveryTime",
						style:"width:200px",
						disabled: row.status!==1,
						placeholder: "请选择交期",
						change: data => {
							console.log(data)
						},
						rules: [{
							required: true,
							message: '请选择交期',
							trigger: 'blur' ,
						}],
					},{
						type: "Input",
						inputType:'number',
						label: "数量:",
						prop: "preNum",
						disabled: row.status!==1,
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
				this.dialogAdd = false;
				this.addDialog = true;
				this.$nextTick(()=>{
					this.$refs['demandForm'].$refs['searchForm'].resetFields();
					this.demandData.deliveryTime = row.deliveryTime;
					this.demandData.preNum = row.purchaseNum;
					this.demandData.needPurchaseNum = row.needPurchaseNum;
					this.demandData.sort = row.sort;
				})
			},
			generatePurchase(value){
				this.purchaseData = {};
				this.purchaseForm = [];
				if(value=='selection'){
					if(this.multipleSelection.length==0){
						this.$message.warning('请先选择所要生成采购单的数据')
						return
					}
					this.selectionLoading = true;
					this.purchaseDialog = true;
					this.$nextTick(()=>{
						this.multipleSelection.forEach(item=>{
							// this.purchaseData[item.id] = ''
							if(item.status!==1) return
							this.purchaseForm.push({
								type: "Input",
								inputType:'number',
								label: item.materialCode+" 数量:",
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
					this.purchaseDialog = true;
					this.selectRow = value;
					this.$nextTick(()=>{
						this.purchaseForm = [{
							type: "Input",
							inputType:'number',
							label: value.materialCode+" 数量:",
							prop: value.id,
							labelWidth:'200px',
							style:"width:150px",
							placeholder: "请输入采购数量",
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
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			handleChangePage(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value;
				this.getDemandList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.bll = this.gridData.filter(item=>item.preparationNum == null)
				for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = '0'
				}
				this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
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
				this.getDemandList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.bll = this.gridData.filter(item=>item.preparationNum == null)
				for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = '0'
				}
				this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			deliverGoods(row){
				console.log(row)
				this.shopId = row.goodsId;
				this.deliverDialog = true;
			},
			closeDio(row){
				this.selectRow?this.$set(this.selectRow, 'selectionLoading', false):'';
				this.selectionLoading = false;
			},
			addDemand(){

				this.$nextTick(()=>{
					this.demandForm = [{
							type: "Select",
							label: "面料:",
							prop: "materialCode",
							options: [],
							style:"width:200px",
							change: row => {
								console.log(row)
							},
							placeholder: "请选择面料",
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
									demandList.get(this.api.getFabricCode,data).then(res=>{
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
			closeDemandForm(){
				this.$refs['demandForm'].$refs['searchForm'].resetFields();
			},
            nonPurchase(row){
			    let request = { status : 2 ,isPurchase : 0} ;
                request.id = row.id;
				this.$set(row,'nonPurchase',true)
				if(row.needPurchaseNum>0){
					this.$confirm('是否确认无需采购?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						demandList.put(this.api.getDemandList,request).then(putRes=>{
						    this.$store.commit('user/SET_HEADERCONTENT', false)
						    this.getDemandList().then(res=>{
						        let {data} = res;
								this.$set(row,'nonPurchase',false)
						        this.$message.success('操作成功')
						        this.gridData = data.records;
						        this.dataTotal = data.total;
						        this.$refs['demandForm'].$refs['searchForm'].resetFields();
						    }).catch(err=>{
								this.$set(row,'nonPurchase',false)
						        this.addDialog = false;
						    })
						}).catch(err=>{
						    this.demandHandle[0].loading = false;
						    this.$store.commit('user/SET_HEADERCONTENT', false)
						})
					}).catch(() => {
						this.demandHandle[0].loading = false;
					});
				}else{
					demandList.put(this.api.getDemandList,request).then(putRes=>{
					    this.$store.commit('user/SET_HEADERCONTENT', false)
					    this.getDemandList().then(res=>{
					        let {data} = res;
							this.$set(row,'nonPurchase',false)
					        this.$message.success('操作成功')
					        this.gridData = data.records;
					        this.dataTotal = data.total;
					        this.$refs['demandForm'].$refs['searchForm'].resetFields();
					    }).catch(err=>{
							this.$set(row,'nonPurchase',false)
					        this.addDialog = false;
					    })
					}).catch(err=>{
					    this.demandHandle[0].loading = false;
					    this.$store.commit('user/SET_HEADERCONTENT', false)
					})
				}
                
			},
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("面料需求单:"+this.multipleSelection[i].materialCode+";"+this.multipleSelection[i].materialName)
				}
				this.lianDialog = true
			},
			colseTrace() {
				this.getDemandList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.expandTable .el-table__expanded-cell{
		padding: 0 50px;
	}
	.el-dropdown-link{
		width: 100%;
		height: 100%;
	}
</style>

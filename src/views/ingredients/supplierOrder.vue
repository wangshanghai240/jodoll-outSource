<!--
 * @FileDescription: 辅料采购订单
 * @Author: MoonXu
 * @Date: 2021/1/21
 * @LastEditors: MoonXu
 * @LastEditTime: 2021/1/21
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="supplierOrder"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		:expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange"
		@handleSelectionChange="handleSelectionChange">
        <template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>
			</div>
            <div class="searchBody">
				<el-input
					v-model="searchForm.supplierName"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="供应商 搜索"/>
                <el-date-picker
                    v-model="searchForm.payTime"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
                    type="date"
                    placeholder="选择下单日期">
                </el-date-picker>
				<el-select v-model="searchForm.status" :size="size" style="width: 145px; margin: 0 10px"
				  class="marginTop16" placeholder="请选择状态">
					<el-option
					v-for="item in statusOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="loading.searchLoading"
				  class="marginTop16" @click="searchOrderList">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="loading.resetLoading"
				  class="marginTop16" @click="searchOrderList('reset')">
					重置
				</el-button>
			</div>

            <!--弹出框-->
			<!--合同流程-->
			<jod-dragDialog v-model="proUpDio" title="合同流程" class="tableDialog" :dialogStyle="{width: '750',widthType: 'px'}" @closeDio="proCloseDio">
				<process-up v-model="dgmc" :model="2" v-if="proUpDio" @proClose="proClose(arguments)"></process-up>
			</jod-dragDialog>
			<!-- 合同函查看 -->
			<jod-dragDialog class="tableDialog" v-model="shareDialog" title="合同函" :drag="true" top="10px"
			  @close="shareClose" :dialogStyle="{width: '1000',widthType: 'px'}">
				<share v-model="orderNumber" :orderRow="orderRow" @shareClose="shareClose(arguments)" v-if="shareDialog"></share>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" @closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
            <!--合同确认-->
			<jod-dragDialog v-model="dialog.confirmDialog" title="合同确认"  :top="'10px'" :dialogStyle="{width: '95',widthType: '%'}">
				<jod-formSearch labelWidth="120px" ref="confirmForm" :searchData="entityData" :searchForm="confirmForm">
				</jod-formSearch>

				<el-alert title="辅料详情列表" :closable="false" type="info" show-icon></el-alert>
                <jod-tableList :dataSource="entityData.expandData?entityData.expandData:[]" :columns="confrimColumns"
					:options="confrimOptions">
					<!--单价-->
					<template slot="price" slot-scope="{row,$index}">
						<el-input v-model="row.price"  @input="moneyUpdate" :size="size" ></el-input>
					</template>
					<!--金额-->
					<template slot="totalAmount" slot-scope="{row,$index}">
						<span>{{row.price* row.purchaseNum }}</span>
					</template>					<!--优先级-->
					<template slot="sort" slot-scope="{row,$index}">
						<el-tag effect="plain" type="info" :size="size" v-if="row.sort==1">
							{{ (row.sort) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
						</el-tag>
						<el-tag effect="plain" type="" :size="size" v-else-if="row.sort==2">
							{{ (row.sort) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
						</el-tag>
						<el-tag effect="plain" type="warning" :size="size" v-else-if="row.sort==3">
							{{ (row.sort) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
						</el-tag>
						<el-tag effect="plain" type="danger" :size="size" v-else-if="row.sort==4">
							{{ (row.sort) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
						</el-tag>
                	</template>
                	<!--状态-->
                	<template slot="status" slot-scope="{row,$index}">
                    	<!-- <span>{{(row.status!=null && row.status >=0 ) && statusOptions[row.status]? statusOptions[row.status].label: row.status }}</span> -->
                	</template>
					<!--厂家货号-->
					<template slot="factoryNo" slot-scope="{row,$index}">
						<el-input v-model="row.factoryNo" :size="size" ></el-input>
					</template>
					<!--规格型号-->
					<template slot="productModel" slot-scope="{row,$index}">
						<el-input v-model="row.productModel" :size="size" ></el-input>
					</template>
					<!--质量要求-->
					<template slot="qualityClaim" slot-scope="{row,$index}">
						<el-input v-model="row.qualityClaim" :size="size" ></el-input>
					</template>
					<!--备注-->
					<template slot="remark" slot-scope="{row,$index}">
						<el-input v-model="row.remark" :size="size" ></el-input>
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
					<div style="height: 306px;background-color: #F2F6FC;" v-if="!dialog.textBol"></div>
					<div style="min-height: 306px;" v-if="dialog.textBol">
						<jod-ckeditor v-model="contractStyle"></jod-ckeditor>
					</div>
				</transition>

                <div style="text-align:center;margin-top: 10px;">
                     <el-button type="primary" style="width: 80px;" :size="size" :loading="loading.confirmLoading" @click="confirmContact" :disabled="bledbtn">
                        保存
                    </el-button>
					<!-- <el-button type="primary" style="width: 120px;" :size="size" @click="confirmContact('post')">发起合同流程</el-button> -->
                    <el-button style="width: 80px;" :size="size" @click="confirmContact('cancel')">取消</el-button>
                </div>
			</jod-dragDialog>
			<!--入库通知-->
			<jod-dragDialog v-model="warehousDio" title="入库通知单" class="tableDialog" :dialogStyle="{width: '80',widthType: '%'}">
				<transition name="fade" mode="out-in">
					<warehouse v-model="orderNumber" v-if="warehousDio" @close="warehouseClose"></warehouse>
				</transition>
			</jod-dragDialog>
        </template>

        <!--slot字段-->
        <template slot="status" slot-scope="{row,$index}">
			<span>{{ row.status && statusOptions[row.status-1] ? statusOptions[row.status-1].label : row.status }}</span>
		</template>
        <!--下拉详情-->
		<template slot="expandForm" slot-scope="{row,index}">
			<jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'100px'}">

				<!--单价-->
				<template slot="price" slot-scope="{row,$index}">
					<span>{{(row.price ) ? row.price: 0 }}</span>
				</template>
				<!--金额-->
				<template slot="totalAmount" slot-scope="{row,$index}">
					<span>{{row.totalAmount ? row.totalAmount:0}}</span>
				</template>
                <!--优先级-->
                <template slot="sort" slot-scope="{row,$index}">
					<el-tag effect="plain" type="info" :size="size" v-if="row.sort==1">
						{{ (row.sort!=null && row.sort>= 0) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
					</el-tag>
					<el-tag effect="plain" type="" :size="size" v-else-if="row.sort==2">
						{{ (row.sort!=null && row.sort>= 0) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
					</el-tag>
					<el-tag effect="plain" type="warning" :size="size" v-else-if="row.sort==3">
						{{ (row.sort!=null && row.sort>= 0) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
					</el-tag>
					<el-tag effect="plain" type="danger" :size="size" v-else-if="row.sort==4">
						{{ (row.sort!=null && row.sort>= 0) ? purchaseSortOptions[ row.sort - 1].label :  row.sort }}
					</el-tag>
                </template>
                <!--质检-->
                <template slot="examining" slot-scope="{row,$index}">
                    <span>{{(row.examining!=null && row.examining >=0 ) ? purchaseExaminingOptions[row.examining].label: row.examining }}</span>
                </template>

				<template v-slot:header_input>
				    <span>操作</span>
				</template>
				<template slot="operate" slot-scope="{row,$index}">
				    <el-dropdown split-button type="primary" :size="size" trigger="click" class="marginLeft10" @click="handleUpdate(row,index)">
				        <span class="el-dropdown-link">
				                编辑
				        </span>
				        <el-dropdown-menu slot="dropdown">
				            <el-dropdown-item @click.native="handleEntry(row)">
				                <span>入库检</span>
				            </el-dropdown-item>
				            <el-dropdown-item @click.native="track(row)">
				                <span>跟踪日志</span>
				            </el-dropdown-item>
							<el-dropdown-item @click.native="sku(row)">
				                <span>sku明细</span>
				            </el-dropdown-item>
				        </el-dropdown-menu>
				    </el-dropdown>
				</template>


                <template v-slot:content_context>
                    <!--编辑-->
                    <jod-dragDialog v-model="dialog.updateDialog" class="updatePurchase" title="编辑" top="30vh">
                        <jod-formSearch ref="purchaseForm" :searchData="purchaseData" :searchForm="editForm"
                        :searchHandle="purchaseHandle">
                        </jod-formSearch>
                    </jod-dragDialog>
                    <!--跟踪日志-->
                    <jod-dragDialog class="traceDialog" v-model="dialog.traceDialog" title="跟踪日志"
						:dialogStyle="{width: '80',widthType: '%'}">
                        <trace-list v-model="traceData" source="ingrePurchase" v-if="dialog.traceDialog"></trace-list>
                    </jod-dragDialog>
					<!--sku明细-->
                    <jod-dragDialog class="tableDialog" v-model="dialog.skuDialog" title="sku详情" :dialogStyle="{width: '80',widthType: '%'}">
                        <jod-tableList :dataSource="skuDataSource" :columns="skuColumns" >
						</jod-tableList>
                    </jod-dragDialog>
					<!--入库检-->
					<jod-dragDialog v-model="dialog.entryDialog" class="tableDialog"  style="padding-bottom: 50px;" title="入库检" top="50px" :drag="true"
						:dialogStyle="{width: '1200',widthType: 'px'}" @closeDio="entrycloseDio">
						<warehous-details v-model="entryId" v-if="dialog.entryDialog" @entrycloseDio="entrycloseDio(arguments)"></warehous-details>
					</jod-dragDialog>
                </template>
			</jod-tableList>
		</template>

        <!--操作按钮-->
        <template v-slot:header_input>
			<span>操作</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="primary" plain  :loading="loading.confirmLoading" :size="size" @click="handleConfirm(row)" v-has:pact>合同</el-button>
			<el-button type="primary" :size="size" @click="contractShare(row)" v-has:pactView>合同函查看</el-button>
			<el-button :size="size" type="danger" plain  @click="notice(row)" v-has:enterInform>入库通知</el-button>
			<el-button v-if="row.status==1" type="danger" icon="el-icon-delete" circle :size="size"
			  :disabled="delLoading" @click="delRow(row)" v-has:del></el-button>
		</template>

    </jod-tableList>
</template>

<script>
import supplierOrder from '@/api/ingredients/supplierOrder.js';
import purchaseList from '@/api/ingredients/purchaseList.js'
import trace from '../controller/traceLog/traceLogList.vue';
import {mapGetters} from 'vuex';
import { loading } from '@/utils';
import share from './components/share.vue'
import { isNumber , throttle } from '@/utils/validate';
import lianxidan from '../orderShop/components/lianxidanT.vue';
import processUp from '../factory/components/processUp.vue'
import warehouse from './components/warehouse.vue'
import warehousDetails from './components/warhouseDetails.vue'

export default {
    computed: {
		...mapGetters([
			'size',
			'token'
		])
	},
	components: {
		'traceList':trace,
		'share':share,
		'lianxianUp':lianxidan,
		'processUp':processUp,
		'warehouse':warehouse,
		'warehousDetails':warehousDetails,
	},
    data(){
        return {
			//发起合同流程
			proUpDio:false,
			proLoading:false,
			dgmc:[],
			multipleSelection:[],//勾选
			lianDialog:false,
			hezhu:[],
            // supplierOrder.js引入内容
            columns:supplierOrder.columns,
            expandColumns:supplierOrder.expandColumns,
            options: supplierOrder.options,
            expandOptions: supplierOrder.expandOptions,
			statusOptions:supplierOrder.statusOptions,
			confrimColumns:supplierOrder.confrimColumns,
			confrimOptions:supplierOrder.confrimOptions,
            // purchaseList.js引入内容
            purchaseExpandColunms:purchaseList.expandColumns,
            purchaseOptions:purchaseList.expandOptions,
            purchaseSortOptions:purchaseList.sortOptions,   // 优先级
            purchaseExaminingOptions:purchaseList.examiningOptions,
			skuColumns:purchaseList.expandColumns,
			expandAll:null,//展开项
			expandArr:[],
			contractStyle:'',//富文本数据
            // 基本数据
            dataTotal:0,
			gridData:[],
			skuDataSource:[], // sku明细数据源
			processData:{}, // 合同审核表数据
			index:0,
            entityData:{},   //supplierOrder一个对象的数据
            pagination:{            // 分页
                currentPage:1,
				pageSize:20
			},
            searchForm:{
                supplierName:'',
                payTime:null,
				status: null,
			},
			traceData:{
				id: "",
				code:"",
				name:"",
				status:"",
				routers:"",
			},
            purchaseData:[],
            loading:{
                searchLoading:false,//搜索
				resetLoading:false,//重置
                confirmLoading:false, // 合同确认
                updateLoading:false, // 编辑
                entryLoading:false, // 入库
                traceLoading:false, // 跟踪日志
				processLoading:false, // 合同审查流程
            },
            dialog:{
                confirmDialog:false, // 合同确认
				textBol:false,//文本编辑器懒加载
                updateDialog:false, // 编辑
                traceDialog:false, // 跟踪日志
				skuDialog:false,  // sku明细
				processDialog:false, //合同审查流程
				entryDialog:false,//出库检
            },
			entryId:'',
			//合同函
			orderNumber:null,
			orderRow:null,
			shareDialog:false,
            confirmForm:[],  // 合同确认表单
            purchaseId:'',
			editForm:[{
				type:'Input',
				label:'单价',
				prop:'price',
				align: 'center',
			},{
				type:'Select',
				options:this.purchaseSortOptions,
				change: row => {
					console.log(row)
				},
				label:'优先级',
				prop:'sort',
				align: 'center',
			},{
				type:'Date',
				change: row => {
					console.log(row)
				},
				label:'交期',
				prop:'deliveryTime',
				align: 'center',
			}],
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
								price:this.purchaseData['price'],
								deliveryTime:this.purchaseData['deliveryTime'],
								sort:this.purchaseData['sort'],
							}
							purchaseList.put(this.api.getIngredientPurchase,form).then((resp) => {
									this.dialog.updateDialog = false;
                                    this.purchaseHandle[0].loading = false;
                    				this.$message.success("修改成功");
									this.$refs["purchaseForm"].$refs["searchForm"].resetFields();
									this.expandChange(this.gridData[this.index])
							}).catch((err) => {
								this.$message.danger("修改失败");
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
            entryForm:purchaseList.entryForm,
			// editForm: [],
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
								id:this.purchaseData['id'],
								surfaceMaterialNo:this.purchaseData['surfaceMaterialNo'],
								isEntry:this.purchaseData['isEntry'],
								entryNum:this.purchaseData['entryNum'],
								entryTime:this.purchaseData['entryTime'],
							}
							this.$store.commit('user/SET_HEADERCONTENT', true)   // 使用formdata传参
							purchaseList.put(this.api.ingredientPurchaseEntry,form).then(resp=>{
								this.$store.commit('user/SET_HEADERCONTENT', false)  // 关闭流
								this.getPurchaseList().then((res) => {
                       				let { data } = res;
                                    this.entryHandle[0].loading = false;
                    				this.$message.success("入库成功");
                    				this.dialog.entryDialog = false;
                                   	this.gridData = data.records;
                    				this.dataTotal = data.total;
                				    this.$refs["entryForm"].$refs["searchForm"].resetFields();
                      			}).catch((err) => {
									this.dialog.entryDialog = false;
                      			});
							}).catch((err) => {
								this.$store.commit('user/SET_HEADERCONTENT', false)
								this.$message.danger("入库失败");
								this.entryHandle[0].loading = false;
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
				},
				hide: false,
			},
			{
				label: "取消",
				type: "info",
				handle: (res) => {
					this.$refs["entryForm"].$refs["searchForm"].resetFields();
					this.dialog.entryDialog = false;
				},
				hide: false,
			}],
			warehousDio:false,
			bledbtn:false,
			delLoading:false,//删除
        }
    },
    mounted(){
        this.loading = loading(document.getElementsByClassName('app-main')[0])
		this.getOrderList().then(res=>{
			let {data} = res;
			this.gridData = data.records;
			this.dataTotal = data.total;
			this.loading.close();
		}).catch(err=>{
			this.loading.close();
	    })
    },
    methods:{
		// 基本方法
		getList() {
			this.getOrderList().then(res=>{
				let {data} = res;
				this.gridData = data.records;
				this.dataTotal = data.total;
				this.loading.close();
			}).catch(err=>{
				this.loading.close();
			})
		},
	    getOrderList(){   // 获取列表
			let data = {
				current:this.pagination['currentPage'],
				size:this.pagination['pageSize'],
				search:{
					payTime:this.searchForm['payTime'],
					supplierName:this.searchForm['supplierName'],
					status:this.searchForm['status']
				}
			}
			this.expandAll = false;
			this.expandArr = [];
			return supplierOrder.get(this.api.ingredientSupplierOrder,data)
        },
	    handleChangePage(value){
			this.loading = loading(document.getElementsByClassName('app-main')[0])
			this.pagination['currentPage'] = value;
			this.getList();
		},
		handleSizeChange(value){
	        this.loading = loading(document.getElementsByClassName('app-main')[0])
			this.pagination['currentPage'] = 1;
			this.pagination['pageSize'] = value;
			this.getList();
		},
		handleSelectionChange(list){
			this.multipleSelection = list;
		},
		// 功能方法
		searchOrderList: throttle (function(value){
			if(value == 'reset'){
				this.loading.resetLoading = true;
				Object.assign(this.$data.searchForm,this.$options.data().searchForm);
			}else{
				this.loading.searchLoading = true;
			}
           	this.pagination.currentPage = 1;
			this.getList();
			this.$message({
				message: '查询成功',
				type: 'success'
			});
			this.loading.searchLoading = false;
			this.loading.resetLoading = false;
		},2000),
        expandChange(row){    // 展开
			if(row.id){
				supplierOrder.get(this.api.ingredientSupplierOrderDetail,{orderNumber:row.orderNumber}).then(res=>{
					let {description,purchaseList} = res.data;
					this.contractStyle = description;
					this.$set(row, 'expandData', purchaseList)
				})
            }
		},
		exampleExpand(row) {
			return new Promise((resp,rej)=>{
				supplierOrder.get(this.api.ingredientSupplierOrderDetail,{orderNumber:row.orderNumber}).then(res=>{
					let {description,purchaseList} = res.data;
					this.contractStyle = description;
					let list = row;
					list.expandData = purchaseList;
					resp(list)
				}).catch(error => {
					rej(error)
				})
			})
		},
        async handleConfirm(row) {  // 合同确认
            this.$nextTick(() => {
			    this.confirmForm=[{
					type:'Value',
					label:'金额',
					prop:'totalAmount',
					align: 'center',
					style:'width:260px;font-size:20px',
				},{
					type:'Date',
					change: row => {
						console.log(row)
					},
					label:'签订日期',
					prop:'signTime',
					align: 'center',
					style:'width:260px;',
					rules: [{
						required: true,
						message: "请选择签订日期",
						trigger: "blur",
					}]
				}]
			})
			console.log(1,row)
			if(row.status < 2){
				this.bledbtn = false
			}else{
				this.bledbtn = true
			}
			let list = await this.exampleExpand(row);
			this.entityData = list;
            this.dialog.confirmDialog = true;
			let amount = 0;
			if(list.expandData){
				//let money = await supplierOrder.moneyUpdate(list.expandData);
				list.expandData.forEach(element => {
					amount = amount+ element.price*element.purchaseNum;
				});
			}
			this.entityData["totalAmount"] = amount;
			console.log(this.entityData);
			setTimeout(()=>{
				this.dialog.textBol = true;
			},300)
        },
        confirmContact(row) {
            if(row == 'cancel'){
                Object.assign(this.$data.searchForm,this.$options.data().searchForm);
                this.loading.confirmLoading = false;
                this.dialog.confirmDialog = false;
			}else if(row == 'post'){
				this.dgmc = [this.entityData.supplierName,this.entityData.orderNumber]
				console.log(this.dgmc)
				this.proUpDio = true
			}else{
				this.$refs["confirmForm"].$refs["searchForm"].validate((valid)=>{
					if(valid){
						supplierOrder.confirmList(this.entityData.expandData).then(resp=>{
							let form = {
								id:this.entityData['id'],
								totalAmount:this.entityData['totalAmount'],
								signTime:this.entityData['signTime'],
								description:this.contractStyle,
								purchaseList:resp,
							}
							supplierOrder.put(this.api.contractConfirm,form).then(res=>{
								this.entityData = {};
								this.loading.confirmLoading = false;
								this.dialog.confirmDialog = false;
								this.$message({
									message: '合同确认成功',
									type: 'success'
								});
								this.getList();
							})
						})
					} else {
						console.log("error submit!!");
						return false;
					}
				})
			}
        },
        handleUpdate(row,index) {
			this.index = index
            this.purchaseData = row;
            this.dialog.updateDialog = true;
        },
        track(row){	// 跟踪日志
			// this.purchaseId = row.id+"";
			this.traceData["id"] = row.id;
			this.traceData["code"] = row.ingredientsCode;
			this.traceData["name"] = row.ingredientsName;
			this.traceData["status"] = row.status;
			this.dialog.traceDialog = true;
        },
        handleEntry(row) {
			console.log(row)
			if(row.status < 3){
				this.$message.warning('该采购单还未生成合同订单')
			}else{
				this.entryId = {id:row.id,type:1}
				this.dialog.entryDialog = true;
			}
			// this.purchaseData = row;
			// this.loading.entryLoading = true;
			// this.dialog.entryDialog = true;
		},
		//合同函查看
		contractShare(row){
			console.log(row);
			this.orderNumber = row.orderNumber;
			this.orderRow = row;
			this.shareDialog = true;
		},
		//工作联系单
		lianxianup(){
			console.log(this.multipleSelection)
			this.beizhu = []
			for(var i=0;i<this.multipleSelection.length;i++){
				this.beizhu.push("辅料供应商订单:"+this.multipleSelection[i].supplierName+";"+this.multipleSelection[i].orderNumber)
			}
			// console.log(this.beizhu)
			this.lianDialog = true;
		},
		sku(row) {
			purchaseList.get(this.api.getIngredientPurchaseDetail,row.id+"").then(res=>{
                let {data} = res;
				this.skuDataSource = data;
			})
            this.dialog.skuDialog = true;
		},
		proClose(value){
			this.proUpDio = false;
		},
		proCloseDio(value){
			this.proUpDio = value;
		},
		lianClose(value){
			this.lianDialog = false;
		},
		lianCloseDio(value){
			this.lianDialog = value;
		},
		//入库通知
		notice(row){
			console.log(row)
			if(row.status!=2){
				this.$message({
					message: '合同签订的订单才能操作入库通知',
					type: 'danger'
				});
				return;
			}
			this.orderNumber = row.orderNumber;
			this.warehousDio = true;
		},
		//关闭入库通知
		warehouseClose(value){
			this.warehousDio = value
		},
		//金额变动触发
		async moneyUpdate(){
			let money = await supplierOrder.moneyUpdate(this.entityData.expandData);
			this.entityData["totalAmount"] = money;
		},
		shareClose(value){
			if(value[0] == false){
				setTimeout(()=>{
					this.getOrderList().then(res=>{
						let {data} = res;
						this.gridData = data.records;
						this.dataTotal = data.total;
						this.shareDialog = false
						this.loading.close();
					}).catch(err=>{
						this.loading.close();
					})
				},1000)
			}else{
				this.shareDialog = false
			}
		},
		entrycloseDio(value){
			this.dialog.entryDialog = false
		},
		//删除
		async delRow(row){
			try {
				this.delLoading = true;
				console.log(row)
				let res = await supplierOrder.del(this.api.ingredientSupplierOrder,{id:row.id})
				console.log(res);
				let list = await this.getOrderList();
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
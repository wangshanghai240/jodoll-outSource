<!--
 * @FileDescription: 商品列表
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="shopList"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage" :expandAll="expandAll" :expandArr="expandArr"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange" @handleSelectionChange="handleSelectionChange"
		:tLoad="tLoad" :tree-props="{hasChildren: 'expandData'}">
		<template v-slot:header_input>
			<el-button type="primary" :size="size" style="width: 75px;" :loading="addLoading" plain round @click="addShop" v-has:add>
				新增
			</el-button>
			<el-button type="primary" :size="size" plain round :loading="searchLoading" @click="getSourceId">
				{{searchShow?'搜索':'返回'}}
			</el-button>
		</template>

		<template slot="operate" slot-scope="{row}">
			<div style="display: flex;flex-wrap:wrap;justify-content: center;">
				<el-button :size="size" :type="row.bomUpdate=='1'?'success':''" plain class="marginRight10" 
				  @click="bom(row)">BOM</el-button>
				<el-dropdown split-button type="primary" :size="size" trigger="click" class="marginRight10" @click="updateShop(row)">
					<span class="el-dropdown-link">
						修改
					</span>
					<el-dropdown-menu slot="dropdown">
						<!-- <el-dropdown-item v-if="row.lx!==1" @click.native="fabricDemandGoods(row)">
							<span>生成面料需求单</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="ingredientsDemandGoods(row)">
							<span>生成辅料需求单</span>
						</el-dropdown-item> -->
						<el-dropdown-item @click.native="track(row)">
							<span>跟踪日志查看</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="quality(row)">
							<span>品控日志查看</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="operation(row)">
							<span >操作记录查看</span>
						</el-dropdown-item>
						<el-button type="primary" class="marginLeft10 marginTop5" plain :size="size" :loading="row.quaLoading"
							@click="getQuality(row)" style="width: 90px;">工艺单</el-button>
						<el-button type="danger" class="marginRight10 marginTop5" :size="size" @click="deleteShop(row)" v-has:del>删除</el-button>
					</el-dropdown-menu>
				</el-dropdown>
				<!--getMeetingList-->
				<!-- <el-button type="success" class="marginTop10 marginLeft0" plain :size="size" @click="updateShop(row)">修改</el-button> -->
			</div>
		</template>
		<template slot="sourceType" slot-scope="{row}">
			<span>{{row.sourceType?sourceTypeData[row.sourceType-1].label:row.sourceType}}</span>
		</template>
		<template slot="lx" slot-scope="{row}">
			<span>{{row.lx?(row.lx=='1'?'成衣':'加工'):'无'}}</span>
		</template>
		<template slot="ghsmc" slot-scope="{row}">
			<el-popover trigger="click" placement="top" >
			    <el-table :data="tableData" style="width: 250px;">
					<el-table-column prop="data" label="历史记录">

					</el-table-column>
				</el-table>
			    <div slot="reference" class="name-wrapper">
			        <span @click="history(row)" class="his">{{row.ghsmc?row.ghsmc:row.ghsmc}}</span>
			    </div>
			</el-popover>
		</template>
		<template slot="state" slot-scope="{row}">
			<svg-icon icon-class="state2" class="circle" v-if="row.state == 0" style="background: #67C23A; font-size: 18px;" @click="nodes(row)" />
			<svg-icon icon-class="state2" class="circle" v-else-if="row.state == 1" style="background: #E6A23C; font-size: 18px;" @click="nodes(row)" />
			<svg-icon icon-class="state2" class="circle" v-else-if="row.state == 2" style="background: #F56C6C; font-size: 18px;" @click="nodes(row)" />
		</template>
		<template slot="dqzt" slot-scope="{row}">
			<span v-if="row.dqzt == 6.2">{{row.dqzt?dqzt[7-1].label:row.dqzt}}</span>
            			<span v-if="row.dqzt == 6.4">{{row.dqzt?dqzt[8-1].label:row.dqzt}}</span>
            			<span v-if="row.dqzt == 6.6">{{row.dqzt?dqzt[9-1].label:row.dqzt}}</span>
            			<span v-if="row.dqzt == 6.8">{{row.dqzt?dqzt[10-1].label:row.dqzt}}</span>
                        <span v-if="row.dqzt >=7">{{row.dqzt?dqzt[row.dqzt+3].label:row.dqzt}}</span>
            			<span v-if="row.dqzt <= 6">{{row.dqzt?dqzt[row.dqzt-1].label:row.dqzt}}</span>
		</template>
		<template slot="generate" slot-scope="{row}">
			<el-tag v-if="row.fabricDemand" size="mini" style="margin: 5px;"  type="warning">面料</el-tag>
			<el-tag v-if="row.ingredientsDemand" size="mini">辅料</el-tag>
			<el-tag v-if="row.orderNumber != 0" size="mini" style="margin: 5px;" type="success">工厂</el-tag>
			<el-tag v-if="row.orderNumber == 0 & row.fabricDemand == 0 & row.ingredientsDemand == 0" size="mini" type="info">暂无</el-tag>
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<div class="categoryUpload" style="margin-bottom: 16px;">
				<el-button type="info" plain  :loading="selectionLoading" :size="size" v-has:fabricBatch
					@click="fabricDemandGoods('selection')">批量面料需求单</el-button>
				<el-button type="info" plain  :loading="selectionLoading" :size="size" v-has:ingredientsBatch
					@click="ingredientsDemandGoods('selection')">批量辅料需求单</el-button>
				<el-button type="info" plain  :size="size" @click="generateFac" v-has:factoryOrderBatch>
					<span>批量工厂订单</span>
				</el-button>
			<!-- 	<el-upload
					multiple
					style="display: inline-block;margin-left: 10px;"
					:headers="headers"
					class="meetingImport marginRight10"
					:action="uploadUlr+api.multipartByCraft"
					:on-success="uploadQuailtySucc"
					:before-upload="beforeAvatarUploads"
					:show-file-list="false">
					<el-button type="success" plain :size="size" @click="uploadQuailty()" v-has:craftBatch>
						<i class="el-icon-s-goods"></i>批量上传工艺单
					</el-button>
				</el-upload> -->
				<el-button type="primary" :size="size" :loading="exportLoading" @click="exportList" v-has:export>
					导出
				</el-button>
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>

			</div>
			<jod-dragDialog v-model="addDialog" :title="shopTitle" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="shopForm" :searchData="shopData" :searchForm="shopForm" v-has:update
				 :searchHandle="shopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 商品搜索 -->
			<jod-dragDialog v-model="searchDialog" title="商品搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchShopForm" :searchData="searchShopData" :searchForm="searchShopForm"
				 :searchHandle="searchShopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 跟踪日志 -->
			<jod-dragDialog class="traceDialog" v-model="traceDialog" title="跟踪日志"
			  :dialogStyle="diaStyle" :modalClose="false">
				<trace-list v-model="traceData" v-if="traceDialog"></trace-list>
			</jod-dragDialog>
			<!-- 品控详情 -->
			<jod-dragDialog class="traceDialog" v-model="qualityDialog" :dialogStyle="diaStyle" :modalClose="false"
				:drag="true" :top="'10px'">
				<template v-slot:title>
					<h1 style="font-weight: bold;text-align: center;margin: 0;">品 控 详 情</h1>
				</template>
				<quality-list v-model="shopId" v-if="qualityDialog" @bol="bol"></quality-list>
			</jod-dragDialog>
			<!-- 明细编辑 -->
			<jod-dragDialog v-model="expandEditDialog" title="明细编辑"  @closeDio="closeDio"
				:dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="expandEditForm" :searchData="expandEditData" :searchForm="expandEditForm"
				 :searchHandle="expandEditHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 节点进度 -->
			<jod-dragDialog v-model="nodesDialog" title="进度" :dialogStyle="{width: '800',widthType: 'px'}">
				<nodes-list v-model="goodid" v-if="nodesDialog"></nodes-list>
			</jod-dragDialog>
			<!-- 工艺单 -->
			<jod-dragDialog v-model="categoryUpDialog" title="工艺单">
				<category-up ref="cateGory" v-if="categoryUpDialog" :shop-id="shopId" @categoryUpClose="categoryUpClose"/>
			</jod-dragDialog>

			<!-- BOM单据 -->
			<jod-dragDialog class="traceDialog" v-model="bomDialog" title="BOM单据" :dialogStyle="{width: '650',widthType: 'px'}">
				<el-alert title="请选择 所要 BOM 的 单据" center :closable="false" type="success" show-icon></el-alert>
				<div style="display: flex;justify-content: space-around;flex-wrap:wrap;margin-top: 10px;">
					<div v-for="(item,index) in bomList" :key="index">
						<el-radio v-model="djbh" :label="item" border style="margin-bottom: 10px;">{{item}}</el-radio>
					</div>
				</div>
				<div style="text-align: center;margin-top: 20px;">
					<el-button type="primary" :loading="noteLoading" :disabled="noteLoading" :size="size" @click="note">确认</el-button>
				</div>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" >
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
			<!--工艺单-->
			<jod-dragDialog v-model="exportDio" title="工艺单" :dialogStyle="{width: '1200',widthType: 'px'}">
				<export-list v-model="orderid" v-if="exportDio"></export-list>
			</jod-dragDialog>
		</template>

		<!-- 展开 -->
		<template slot="expandForm" slot-scope="{row}">
			<expand-size v-model="row.expandData" v-if="row.expandData&&row.expandData.length!==0" @expandUpdate="expandUpdate"></expand-size>
			<div v-else style="height: 85px;text-align: center;line-height: 85px;">
				暂无数据
			</div>
			<!-- <jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'100px'}">
				<template v-slot:header_input>
					<span>操作</span>
				</template>
				<template slot="operate" slot-scope="scope">
					<el-button type="primary" :size="size" plain round @click="expandEdit(scope.row)">
						编辑
					</el-button>
				</template>
			</jod-tableList> -->
		</template>
	</jod-tableList>
</template>

<script>
	import orderData from '@/api/orderShop/orderShop.js'
	import { getLocalTime ,loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import category from './components/categoryUp.vue'
	import expandSize from './components/expandSize.vue'
	import trace from '../controller/traceLog/traceLogList.vue'
	import quality from '../controller/qualityLog/qualityList.vue'
	import nodes from './components/nodes.vue'
	import lianxidan from './components/lianxidanT.vue'
	import {throttle , debounce} from '@/utils/validate.js'
	import exportlist from '../technology/components/export.vue'
	export default {
		name:'shop',
		components: {
			'categoryUp':category,
			'traceList':trace,
			'qualityList':quality,
			'nodesList':nodes,
			'expandSize':expandSize,
			'lianxianUp':lianxidan,
			'exportList':exportlist
		},
		computed: {
			...mapGetters([
				'size',
				'orderName',
				'token'
			])
		},
		data() {
			// let pickerBeginDateAfter = {
			// 	disabledDate: (time) => {
			// 		return time.getTime() < Date.now()
			// 	}
			// };
			return {
				searchShow:true,//搜索是否显示
				//工艺单
				exportDio:false,
				orderid:[],
				uploadUlr:process.env.VUE_APP_BASE_URL,
				headers:{},
				uploadList:[],//工艺单上传
				columns: orderData.columns,//列
				options: orderData.options,//额外配置
				pagination:{//分页
					currentPage:1,
					pageSize:10
				},
				tableData: [],
				dqzt: orderData.dqzt,//状态
				sourceTypeData: orderData.sourceTypeData,//来源类型
				expandOptions: orderData.expandOptions,
				dataTotal: 0,//总条数
				// operates: [...orderData.operates],
				gridData: [],//源数据
				addDialog: false,//新增弹窗
				searchDialog: false,//查询弹窗
				categoryUpDialog: false,//工艺单弹窗
				nodesDialog:false,//节点弹窗
				lianDialog:false,//工作联系单
				goodid:'',
				beizhu:[],
				bll:[], //点击商品列表获取数据存储备料量字段为null的数组
				grid:[], //嘻嘻，这个数组没用
				preparationNum:[],  //存储通过搜索商品列表获取数据中才有的备料量字段preparationNum
				multipleSelection:[],
				expandAll:null,//展开项
				expandArr:[],
				selectionLoading:false,
				exportLoading:false,//导出
				//qualityBol: true,//品控是否最新数据
				addLoading: false,//新增加载
				searchLoading:false,
				search:'',//搜索
				loading:null,//遮罩层
				shopTitle:'新增商品',//弹窗标题
				dialogAdd:true,//弹窗是否新增
				shopId:'',//ID 暂用于修改
				traceDialog:false,//跟踪日志
				qualityDialog:false,//品控日志
				purchaseOptions:[],//供应商列表
				diaStyle : {
					width: '80',
					widthType: '%'
				},
				//新增or编辑配置
				shopData: {
					sourceType: '',//来源类型
					sourceId:'',//来源主键
					spdm:'',//款号
					gchh:'',//工厂货号
					lx:'',//类型
					sl:'',//数量
					bll:'',//备料量
					yqhq:'',//要求货期
					dqzt:'',//当前状态
					ghsdm:'',//供应商
				},
				shopForm: [{
						type: "Select",
						label: "来源类型:",
						prop: "sourceType",
						clearable:true,
						options: orderData.sourceTypeData,
						placeholder: "请选择来源",
						style:"width:200px",
						change: row => "",
						rules: [{
							required: true,
							message: "请选择来源",
							trigger: "change"
						}]
					},{
						type: "Select",
						label: "来源名称:",
						prop: "sourceId",
						options: [],
						placeholder: "请选择名称",
						clearable:true,
						style:"width:200px",
						change: row => "",
						rules: [{
							required: true,
							message: "请选择名称",
							trigger: "change"
						}]
					},{
						type: "Input",
						label: "商品货号:",
						prop: "spdm",
						placeholder: "请输入款号",
						style:"width:200px",
						// 表单验证
						rules: [{
							required: true,
							message: "请输入款号",
							trigger: "blur"
						}]
					},{
						type: "Input",
						label: "工厂货号:",
						prop: "gchh",
						//icon: 'el-icon-more',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入货号",
					},{
						type: "Select",
						label: "加工类型:",
						prop: "lx",
						options: orderData.lx,
						clearable:true,
						style:"width:200px",
						placeholder: "请选择类型",
						change: row => "",
						rules: [{
							required: true,
							message: "请选择类型",
							trigger: "change"
						}]
					},{
						type: "Input",
						label: "数量:",
						prop: "sl",
						disabled:false,
						icon: 'el-icon-circle-plus-outline',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入数量",
						rules: [{
							required: true,
							message: "请输入数量",
							trigger: "blur"
						}]
					},{
						// 备料量
						type:'Input',
						label:'备料量',
						prop:'bll',
						disbaled:false,
						placeholder:'请输入备料量'
					},
					{
						type: "Date",
						label: "要求货期:",
						prop: "yqhq",
						placeholder: "请选择日期",
						style:"width:200px",
						pickerOptions:orderData.pickerBeginDateAfter,
						rules: [{
							required: true,
							message: '请选择日期',
							trigger: 'change'
						}],
						change: data => {
							console.log(data)
						}
					},{
						type: "Select",
						label: "当前状态:",
						prop: "dqzt",
						clearable:true,
						options: orderData.dqzt,
						style:"width:200px",
						placeholder: "请选择当前状态", 
						change: row => "",
					},{
						type: "Select",
						label: "供应商:",
						prop: "ghsdm",
						options:[],
						style:"width:200px",
						loading:false,
						remoteMethod: query => {
							console.log('query',query)
							if (query !== '') {
								let params={
									supplierName:query
								}
								this.searchShopForm[9].loading = true
								orderData.get(this.api.getERP,params).then(res=>{
									orderData.getERP(res.data).then(list=>{
										console.log(list)
										this.shopForm[9].options = list
										this.searchShopForm[9].loading = false
									})
							
								})
							} else {
								let params={
									supplierName:''
								}
								this.searchShopForm[9].loading = true
								orderData.get(this.api.getERP,params).then(res=>{
									orderData.getERP(res.data).then(list=>{
										console.log(list)
										this.shopForm[9].options = list
										this.searchShopForm[9].loading = false
									})
								
								})
							}
						},
						change:res=>{},
						placeholder: "请选择供应商",
						filterable:true,
						remote:true,
						loading:false,
						disabled:true,
					},
				],
				exportBut: [{
						'title': '获取BOM',
						method: () => {
							console.log('导出按钮')
						}
					},
					// {
					// 	'title': '导入',
					// 	method: () => {
					// 		console.log('导入按钮')
					// 	}
					// }
				],
				shopHandle: [{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['shopForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									this.shopHandle[0].loading = true;
									if(this.dialogAdd){
										delete this.shopData['dqzt']
										delete this.shopData['ghsdm']
										console.log('shopdata',this.shopData)
										orderData.post(this.api.eShopList,this.shopData).then(addRes=>{
											this.getShopList().then(res=>{
												console.log(res)
												let {data} = res;
												this.gridData = data.records;
												this.dataTotal = data.total;
												this.$message({
													message: addRes.message,
													type: 'success'
												});
												this.shopHandle[0].loading = false;
												this.addDialog = false;
												this.$refs['shopForm'].$refs['searchForm'].resetFields();
											}).catch(err=>{
												this.shopHandle[0].loading = false;
											})
										})
									}else{
										console.log('shopdata',this.shopData)
										this.shopData['id'] = this.shopId;
										this.shopData['ghsmc'] = this.purchaseOptions.find(x => x.value === this.shopData['ghsdm']).label
										orderData.put(this.api.updateShop,this.shopData).then(addRes=>{
											this.getShopList().then(res=>{
												let {data} = res;
												this.gridData = data.records;
												this.dataTotal = data.total;
												this.$message({
													message: addRes.message,
													type: 'success'
												});
												this.shopHandle[0].loading = false;
												this.addDialog = false;
												this.$refs['shopForm'].$refs['searchForm'].resetFields();
											}).catch(err=>{
												this.shopHandle[0].loading = false;
											})

										})
									}
								} else {
									console.log(this.shopData)
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
							console.log(this.$refs['shopForm'].$refs['searchForm'])
							this.$refs['shopForm'].$refs['searchForm'].resetFields();
						},
						hide: false,
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.addDialog = false;
						},
						hide: false,
					}
				],
				//搜索配置
				searchShopData: {
					sourceType:'',//来源类型
					sourceId:'',//来源名称
					bomUpdate:'',//bom状态
					ghsdm:'',//供货商代码
					spdm:'',//商品货号
					dlmc:'',//品类
					//state:'',//交货状态
					dqzt:'',//状态
					fabricDemand:'',//面料需求
					ingredientsDemand:'',//辅料需求
					orderNumber:'',//工厂订单
					isNumberChange:'',//是否变更
					lx:'',//加工
					craftStatus:'',//工艺单
					detailsImport:'',//明细导入
					state:'',//亮灯
				},
				searchShopForm: [{
						type: "Select",
						label: "来源类型:",
						prop: "sourceType",
						clearable:true,
						options: orderData.sourceTypeData,
						placeholder: "请选择来源",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "来源名称:",
						prop: "sourceId",
						options: [],
						clearable:true,
						placeholder: "请选择名称",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "品类:",
						prop: "dlmc",
						//icon: 'el-icon-more',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入品类",
					},{
						type: "Select",
						label: "BOM状态:",
						prop: "bomUpdate",
						clearable:true,
						options: orderData.bomType,
						placeholder: "请选择状态",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "工厂:",
						prop: "ghsdm",
						//icon: 'el-icon-more',
						style:"width:200px",
						options:[],
						clearable:true,
						filterable:true,
						remote:true,
						loading:false,
						change:res=>{},
						remoteMethod: query => {
							console.log(query)
							if (query !== '') {
								let params={
									supplierName:query
								}
								this.searchShopForm[4].loading = true
								orderData.get(this.api.getERP,params).then(res=>{
									orderData.getERP(res.data).then(list=>{
										console.log(list)
										this.searchShopForm[4].options = list
										this.searchShopForm[4].loading = false
									})

								})
							} else {
								let params={
									supplierName:''
								}
								this.searchShopForm[4].loading = true
								orderData.get(this.api.getERP,params).then(res=>{
									orderData.getERP(res.data).then(list=>{
										console.log(list)
										this.searchShopForm[4].options = list
										this.searchShopForm[4].loading = false
									})
								
								})
							}
						},
						placeholder: "请输入工厂",
					},{
						type: "Input",
						label: "商品货号:",
						prop: "spdm",
						//icon: 'el-icon-more',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入货号",
					}
					// ,{
					// 	type: "Select",
					// 	label: "交货状态:",
					// 	prop: "state",
					// 	clearable:true,
					// 	options: orderData.state,
					// 	placeholder: "请选择交货状态",
					// 	style:"width:200px",
					// 	change: row => "",
					// }
					,{
						type: "Select",
						label: "状态:",
						prop: "dqzt",
						clearable:true,
						options: orderData.dqzt,
						placeholder: "请选择状态",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "面料需求:",
						prop: "fabricDemand",
						clearable:true,
						options: orderData.searchType,
						placeholder: "请选择面料",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "辅料需求:",
						prop: "ingredientsDemand",
						clearable:true,
						options: orderData.searchType,
						placeholder: "请选择辅料",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "工厂订单:",
						prop: "orderNumber",
						clearable:true,
						options: orderData.searchType,
						placeholder: "请选择工厂订单",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "数量变更:",
						prop: "isNumberChange",
						clearable:true,
						options: orderData.slbg,
						placeholder: "请选择数量",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "加工类型:",
						prop: "lx",
						clearable:true,
						options: [{
							value:1,
							label:'成衣',
							},{
							value:2,
							label:'加工',
							}],
						placeholder: "请选择加工类型",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "工艺单:",
						prop: "craftStatus",
						clearable:true,
						options: [{
							value:0,
							label:'未上传',
							},{
							value:1,
							label:'上传',
							}],
						placeholder: "请选择工艺单",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "明细导入:",
						prop: "detailsImport",
						clearable:true,
						options: [{
							value:0,
							label:'未导入',
							},{
							value:1,
							label:'已导入',
							},
							// {
							// value:2,
							// label:'无',
							// },
							],
						placeholder: "请选择明细导入",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "亮灯状态:",
						prop: "state",
						clearable:true,
						options: [{
							value:0,
							label:'绿灯',
							},{
							value:1,
							label:'黄灯',
							},{
							value:2,
							label:'红灯',
							}
						],
						placeholder: "请选择亮灯状态",
						style:"width:200px",
						change: row => "",
					}
				],
				searchShopHandle: [{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['searchShopForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									this.searchShopHandle[0].loading = true;
                                    this.pagination.currentPage = 1;
									this.getShopList().then(res=>{
										let {data} = res;
										console.log(res)
										this.gridData = data.records;
										// 拿到所有preparationNum为null的数组
										this.preparationNum = this.gridData.filter(item=>item.preparationNum == null)
										// 将null转化为0
										for(let i=0;i<this.preparationNum.length;i++){
											this.preparationNum[i].preparationNum = '0'
										}
										// 将为0的数组和原数组拼接之后去重
										this.gridData = this.preparationNum.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
										this.dataTotal = data.total;
										this.$message({
											message: '查询成功',
											type: 'success'
										});
										this.searchShopHandle[0].loading = false;
										this.searchDialog = false;
									}).catch(err=>{
										this.searchShopHandle[0].loading = false;
									})
								} else {
									console.log(this.shopData)
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
							console.log(this.$refs['searchShopForm'].$refs['searchForm'])
							this.$refs['searchShopForm'].$refs['searchForm'].resetFields();
						},
						hide: false,
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.searchDialog = false;
						},
						hide: false,
					}
				],
				//明细
				expandChangeRow:null,
				expandColumns:orderData.expandColumns,
				expandEditDialog:false,
				expandEditData:{
					id:'',
					count:'',
					size:''
				},
				expandEditForm:[
					{
						type: "Input",
						label: "数量:",
						inputType:"number",
						prop: "count",
						//icon: 'el-icon-more',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入数量",
					},{
						type: "Input",
						label: "尺码:",
						inputType:"number",
						prop: "size",
						//icon: 'el-icon-more',
						style:"width:200px",
						onClick: res => {
							console.log(res)
						},
						placeholder: "请输入尺码",
					}
				],
				expandEditHandle:[
					{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['expandEditForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									console.log(this.expandEditData)
									this.expandEditHandle[0].loading = true;
									orderData.put(this.api.category,this.expandEditData).then(res=>{
										this.$set(this.expandChangeRow,'count',this.expandEditData['count'])
										this.$set(this.expandChangeRow,'size',this.expandEditData['size'])
										this.expandEditHandle[0].loading = false;
										this.$message.success('修改成功');
										this.expandEditDialog = false;
									}).catch(err=>{
										this.expandEditHandle[0].loading = false;
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
							this.$refs['expandEditForm'].$refs['searchForm'].resetFields();
							this.expandEditDialog = false;
						},
						hide: false,
					}
				],
				bomDialog:false,//BOM单据模态框
				bomList:[],
				djbh:'',
				goodsCode:'',
				noteLoading:false,
				traceData:{
					id:'',
					routers:''
				},
				uploadQualityData:{},//工艺单上传
				rowData:null,//行暂存
			}
		},
		created() {
			this.loading = loading(document.getElementsByClassName('app-main')[0]);
			this.headers['Authorization'] = this.token;
			if(this.$route.params.type){
				this.searchShow = false;
				let {type,...data}= this.$route.params;
				let obj = {
					'type':type,
					'search':data
				}
				this.searchShopData['skipParam'] = obj;
			}
		},
		mounted(){
			this.searchShopData['sourceId'] = this.orderName;
			
			
			let params={
				supplierName:''
			}
			// orderData.get(this.api.getERP,params).then(res=>{
			// 	orderData.getERP(res.data).then(list=>{
			// 		this.purchaseOptions = list
			// 		this.shopForm[8].options = list
			// 	})
			// })
			orderData.get(this.api.getERP,params).then(res=>{
				orderData.getERP(res.data).then(list=>{
					console.log(list)
					this.purchaseOptions = list
					this.searchShopForm[4].options = list
				})
			})
			// 商品列表数据请求
			this.getShopList().then(res=>{
				console.log(res)
				let {data} = res;
				this.$store.commit('transfer/REMOVE_ORDERNAME');
				this.loading.close();
				this.gridData = data.records
				console.log(this.gridData)
				// 先拿到所有preparationNum为null的数据
				this.bll = this.gridData.filter(item=>item.preparationNum == null)
				// 然后将数据中的preparationNum字段改为0
				for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = 0
				}
				console.log(this.bll)
				// 重新赋值给gridData
				this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
				// console.log(this.gridData)
				this.dataTotal = data.total;
				
			}).catch(err=>{
				this.loading.close();
			})
		},
		methods: {
			getShopList(){
				let data = this.searchShopData;
				data['page'] = this.pagination['currentPage'];
				data['limit'] = this.pagination['pageSize'];
				console.log('data',data)

				this.expandAll = false;
				this.expandArr = [];
				return orderData.post(this.api.eShopList,data)
			},
			addShop() {
				this.addLoading = true;
				if(this.$refs['shopForm']){
					this.$refs['shopForm'].$refs['searchForm'].resetFields();
				}
				this.shopForm[8]['isShow'] = true;
				this.shopForm[9]['isShow'] = true;
				if(this.shopForm[1].options.length==0){
					orderData.get(this.api.orderList).then(res=>{
						orderData.getMeetingList(res).then(list=>{
							this.shopForm[1].options = list;
							this.addLoading = false;
							this.shopTitle = '新增商品';
							this.dialogAdd = true;
							this.addDialog = true;
						})
					}).catch(err=>{
						this.addLoading = false;
					})
				}else{
					this.addLoading = false;
					this.shopTitle = '新增商品';
					this.dialogAdd = true;
					this.addDialog = true;
				}
			},
			getSourceId(){
				if(!this.searchShow){
					this.$router.go(-1)
				}else{
					this.searchLoading = true;
					// if(this.$refs['searchShopForm']){
					// 	this.$refs['searchShopForm'].$refs['searchForm'].resetFields();
					// }
					if(this.searchShopForm[1].options.length==0){
						orderData.get(this.api.orderList).then(res=>{
							this.searchLoading = false;
							this.searchDialog = true;
							orderData.getMeetingList(res).then(list=>{
								this.searchShopForm[1].options = list;
							})
						}).catch(err=>{
							this.searchLoading = false;
						})
					}else{
						this.searchLoading = false;
						this.searchDialog = true;
					}
				}
				
			},
			updateShop(row){
				if(row.state > 6){
					this.$message.warning('该商品无法进行编辑')
				}else{
					this.shopForm[8]['isShow'] = false;
					this.shopForm[9]['isShow'] = false;
					this.shopForm[9].options = this.purchaseOptions;
					orderData.get(this.api.category,row.id).then(list=>{
						console.log(list)
						if(list.data.length !=0){
							this.shopForm[5].disabled = true
						}else{
							this.shopForm[5].disabled = false
						}
						console.log(row)
						console.log(this.shopData)
						if(this.shopForm[1].options.length==0){
							this.shopForm[9].options = this.purchaseOptions
							orderData.get(this.api.orderList).then(res=>{
								orderData.getMeetingList(res).then(list=>{
									this.shopForm[1].options = list;
									this.shopTitle = '修改商品';
									this.shopId = row.id;
									this.dialogAdd = false;
									this.addDialog = true;

									this.$nextTick(()=>{
										let {sourceType,sourceId,spdm,gchh,lx,sl,yqhq,dqzt} = row
										this.shopData = {sourceType,sourceId,spdm,gchh,lx,sl,yqhq,dqzt};
										this.shopData['ghsdm'] = row.ghsdm
									})
								})
							}).catch(err=>{
								this.addLoading = false;
							})
						}else{
							this.shopTitle = '修改商品';
							this.shopId = row.id;
							this.dialogAdd = false;
							this.addDialog = true;
							this.$nextTick(()=>{
								let {sourceType,sourceId,spdm,gchh,lx,sl,yqhq,dqzt,ghsdm} = row
								this.shopData = {sourceType,sourceId,spdm,gchh,lx,sl,yqhq,dqzt};
								this.shopData['ghsdm'] = row.ghsdm
							})
						}
					})
				}
			},
			deleteShop(row){
				this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					center: true,
					type: 'warning'
				}).then(() => {
					orderData.delete(this.api.eShopList,row.id).then(delRes=>{
						this.getShopList().then(res=>{
							let {data} = res;
							this.gridData = data.records;
							this.dataTotal = data.total;
							this.$message({
								message: delRes.message,
								type: 'success'
							});
						})
					}).catch(err=>{})
				}).catch(() => {});
			},
			handleChangePage(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value;
				this.getShopList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.bll = this.gridData.filter(item=>item.preparationNum == null)
				// 然后将数据中的preparationNum字段改为0
				for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = 0
				}
				console.log(this.bll)
				// 重新赋值给gridData
				this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					console.log(err)
					this.loading.close();
				})
			},
			handleSizeChange(value){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getShopList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.bll = this.gridData.filter(item=>item.preparationNum == null)
				    // 然后将数据中的preparationNum字段改为0
				    for(let i=0;i<this.bll.length;i++){
					this.bll[i].preparationNum = 0
				   }
				    console.log(this.bll)
				    // 重新赋值给gridData
				    this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			fabricDemandGoods(row){
				console.log(row)
				if(row=='selection'){
					if(this.multipleSelection.length==0){
						this.$message.warning('请勾选所要批量生成的面料单')
						return
					}
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					this.selectionLoading = true;
					orderData.selectionId(this.multipleSelection).then(res=>{
						console.log(res)
						orderData.post(this.api.fabricDemandGoods,res).then(success=>{
							this.getShopList().then(list=>{
								let {data} = list;
								this.gridData = data.records;
								// 先拿到所有preparationNum为null的数据
				  				this.bll = this.gridData.filter(item=>item.preparationNum == null)
								// 然后将数据中的preparationNum字段改为0
								for(let i=0;i<this.bll.length;i++){
									this.bll[i].preparationNum = 0
								}
								console.log(this.bll)
								// 重新赋值给gridData
								this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
								this.dataTotal = data.total;
								this.selectionLoading = false;
								this.loading.close()
								this.$message.success('生成面料需求单完毕')
								this.$refs.shopList.toggleSelection();
							}).catch(err=>{
								this.$refs.shopList.toggleSelection();
								this.loading.close()
								this.selectionLoading = false;
							})

						}).catch(error=>{
							this.loading.close()
							this.$message.error(error)
						})
					})
				}else{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					this.$refs.shopList.toggleSelection();
					let list = [{id:row.id}]
					orderData.selectionId(list).then(res=>{
						console.log(res)
						orderData.post(this.api.fabricDemandGoods,res).then(success=>{
							this.loading.close()
							this.$message.success('生成面料需求单完毕')
							this.$set(row,'fabricDemand',1)
						}).catch(error=>{
							this.loading.close()
							this.$message.error(error)
						})
					})
				}
			},
			async ingredientsDemandGoods(row){
				if(row=='selection'){
					if(this.multipleSelection.length==0){
						this.$message.warning('请勾选所要批量生成的辅料单')
						return
					}
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					this.selectionLoading = true;
					//row.bomUpdate=='1'
					console.log(this.multipleSelection)
					let data = {}
					try{
						let res = await orderData.selectionId(this.multipleSelection,true);
						data = {
							goodsIds:res,
							sourceId:this.multipleSelection[0].sourceId
						}
						console.log(data)
						console.log(1,data)
						this.$store.commit('user/SET_HEADERCONTENT', true)
						orderData.post(this.api.addIngredientsDemand,data).then(success=>{
							this.$store.commit('user/SET_HEADERCONTENT', false)
							this.getShopList().then(list=>{
								let {data} = list;
								this.gridData = data.records;
								// 先拿到所有preparationNum为null的数据
								this.bll = this.gridData.filter(item=>item.preparationNum == null)
								// 然后将数据中的preparationNum字段改为0
								for(let i=0;i<this.bll.length;i++){
									this.bll[i].preparationNum = 0
								}
								console.log(this.bll)
								// 重新赋值给gridData
								this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
								this.dataTotal = data.total;
								this.loading.close()
								this.selectionLoading = false;
								this.$message.success('生成辅料需求单完毕')
								this.$refs.shopList.toggleSelection();
							}).catch(err=>{
								this.loading.close()
								this.selectionLoading = false;
								this.$refs.shopList.toggleSelection();
							})
						
						})
					}catch(e){
						this.$message.error(e)
						this.loading.close();
						this.selectionLoading = false;
					}
				}else{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					this.$refs.shopList.toggleSelection();
					let list = [{id:row.id,sourceId:row.sourceId}]
					orderData.selectionId(list,true).then(res=>{
						this.$store.commit('user/SET_HEADERCONTENT', true)
						let data = {goodsIds:res,sourceId:row.sourceId}
						orderData.post(this.api.addIngredientsDemand,data).then(success=>{
							this.loading.close()
							this.$set(row,'ingredientsDemand',1)
							this.$store.commit('user/SET_HEADERCONTENT', false)
							this.$message.success('生成辅料需求单完毕')
						}).catch(error=>{
							this.loading.close()
							this.$message.error(error)
						})
					})
				}
			},
			generateFac(){
				console.log('list',this.multipleSelection)
				var list = ''
				// var sourceIdlist=''
				let form = {}
				var flag = true;//检测
				if(this.multipleSelection.length == 0){
					// this.$message.warning('请选择订单')
				}else{
					for(var i=0;i<this.multipleSelection.length;i++){
						if(!this.multipleSelection[i].ghsdm){
							flag = false;
						}
						if(i == 0){
							list = this.multipleSelection[i].id
							// sourceIdlist = this.multipleSelection[i].sourceId
						}else{
							list = list + ',' + this.multipleSelection[i].id
							// sourceIdlist =sourceIdlist + ',' + this.multipleSelection[i].sourceId
						}
					}
					form = {
						goodsIdList :list,//订货会
						// sourceId :sourceIdlist
					}
				}
				console.log('from',form)
				if(flag){
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					// 没有选择数据的情况下直接点击生成批量工厂订单需要拦截请求即先做个判断
					if(form.goodsIdList == null){
						this.$message({
							type:'warning',
							message:'请先选择数据'
						})
						// 关闭加载动画
						this.loading.close()
					}
					else{
						orderData.get(this.api.generateFactoryOrder,form).then(res=>{
						this.getShopList().then(list=>{
							let {data} = list;
							this.gridData = data.records;
							this.bll = this.gridData.filter(item=>item.preparationNum == null)
				            // 然后将数据中的preparationNum字段改为0
				          	for(let i=0;i<this.bll.length;i++){
							this.bll[i].preparationNum = 0
				   			}
				    		console.log(this.bll)
				    		// 重新赋值给gridData
				    		this.gridData = this.bll.concat(this.gridData).filter((item,index,arr)=>arr.indexOf(item,0) === index)
							this.dataTotal = data.total;
							this.$message.success('生成工厂订单完毕')
							this.loading.close()
						}).catch(err=>{
							this.loading.close()
						})
					}).catch(err=>{
						this.$message.error('生成工厂订单失败')
						this.loading.close()
					})
					}
					
				}else{
					this.$message.warning('生成订单中，存在未选择工厂的订单，请先选择工厂。')
				}
			},
			bom(row){
				let form = {
					'goodsCode':row.spdm,
					'goodsId':row.id
				}
				this.shopId = row.id;
				this.$set(row, 'bomLoading', true);
				orderData.get(this.api.getAccessoriesNum,form).then(res=>{
					console.log(res);
					if(res.data.length>1){//多条
						this.$set(row, 'bomLoading', false);
						this.bomDialog = true;
						this.rowData = row;
						this.bomList = res.data;
						this.goodsCode = row.spdm;
					}else if(res.data.length==1){//单条直接成功
						this.$set(row, 'bomLoading', false);
						this.$set(row , 'bomUpdate', 1)
						this.$message({
							message: 'BOM成功',
							type: 'success'
						});
					}
				}).catch(err=>{
					// this.$message.error('从erp获取BOM失败')
					this.$set(row, 'bomLoading', false);
				})
			},
			//原工艺单

			bol(value){
				this.qualityDialog = value;
			},

			// getQuality(row){
			// 	if(this.shopId!==row.id) {
			// 		this.$refs.cateGory.restCate();
			// 	}
			// 	this.shopId = row.id;
			// 	this.$set(row, 'quaLoading', true);
			// 	console.log(this.qualityBol)
			// 	if(this.qualityBol){
			// 		this.$refs.cateGory.getQuality();
			// 	}
			// 	this.$refs.cateGory.getQualityId(row.id).then(bol=>{
			// 		if(bol) this.categoryUpDialog = true;
			// 		this.$set(row, 'quaLoading', false);
			// 	});
			// },
			//新工艺单
			getQuality(row){
				// console.log(row);
				this.shopId = [row.id,row.gchh,row.ghsdm,row.ghsmc,row.dlmc];
				orderData.get(this.api.detailByGoods,{goodsId:row.id}).then(res=>{
					if(res.code==0){
						if(res.data){//有关联 直接跳转编辑
							// this.$router.push({path:'/technology/tecaddList',query:{goodsId:row.id,path:1}})
							//携带参数跳转操作
							this.orderid = [row.id,1]
							this.exportDio = true
						}else{
							this.$message.warning("无关联工艺单")
							// this.categoryUpDialog = true;
						}
					}
				})
			},
			track(row){
				// this.shopId = row.id;
				this.traceData.routers = '0'
				this.traceData.id = row.id
				this.traceDialog = true;
			},
			quality(row){
				console.log(row)
				this.shopId = row.id;
				this.qualityDialog = true;
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			// 导出订单
			exportList(){
				let url = process.env.VUE_APP_BASE_URL +this.api.exportShop
				orderData.upload(url,this.searchShopData,this.token,false).then(response=>{
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
			expandChange: throttle (function(row){
				if(row.id&&!row.expandData||row.expandData.length==0){
					orderData.get(this.api.category,row.id).then(res=>{
						let {data} = res;
						//orderData.expandNum(data);
						this.$set(row, 'expandData', data)
					})
				}
			},500),
			expandEdit(row){
				console.log(row)
				this.expandChangeRow = row;
				this.expandEditDialog = true;
				this.$nextTick(()=>{
					this.expandEditData['id'] = row.id
					this.expandEditData['count'] = row.count
					this.expandEditData['size'] = row.size
				})
			},
			closeDio(){
				this.$refs['expandEditForm'].$refs['searchForm'].resetFields();
			},
			//操作日志
			operation(row){
				console.log(row)
				this.$router.push({
					name: 'sysLog_list',
					params:{
						id:row.id
					}
				})
			},
			tLoad(tree, treeNode, resolve){
				console.log('123123123')
			},
			//节点对接
			nodes(row){
				// var goodid = this.gridData[0].id
				// console.log(row.id)
				this.goodid = row.id
				this.nodesDialog=true
			},
			//单据插入
			note(){
				if(!this.djbh){
					this.$message.warning('请选择 所要 BOM 的 单据');
					return
				}
				let form = {
					djbh:this.djbh,
					goodsCode:this.goodsCode,
					goodsId:this.shopId
				};
				this.noteLoading = true;
				console.log(form)
				orderData.get(this.api.note,form).then(res=>{
					this.noteLoading = false;
					this.bomDialog = false;
					this.$set(this.rowData , 'bomUpdate', 1);
					this.$message({
						message: 'BOM成功',
						type: 'success'
					});
				}).catch(e=>{
					this.noteLoading = false;
				})
			},
			//工作联系单
			lianxianup(){
				console.log(this.multipleSelection)
				this.beizhu = []
				for(var i=0;i<this.multipleSelection.length;i++){
					this.beizhu.push("订购会商品:"+this.multipleSelection[i].ghsmc+this.multipleSelection[i].dlmc+this.multipleSelection[i].spdm)
				}
				this.lianDialog = true
			},
			lianClose(value){
				console.log(value)
				this.lianDialog = false;
			},
			history(row){
				console.log(row)
				this.tableData = []
				orderData.get(this.api.listByGoodsIds,row.id).then(res=>{
					console.log(res)
					var datasupplier = res.data
					for(var i = 0;i<datasupplier.length;i++){
						this.tableData.push({data:datasupplier[i].ghsmc})
					}
				}).catch(err=>{

				})
			},
			//上传工艺单
			async uploadQuailty(){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				let list = this.multipleSelection;
				let arr = await orderData.uploadList(list)
				this.uploadList = arr;
			},
			uploadQuailtySucc(response,file, fileList){
				setTimeout(()=>{
					if(response.code==0){
						let imgArr = [];
						let list = this.uploadList;
						fileList.forEach(item=>{
							if(item.response){
								imgArr.push(item.response.data.fileHttpPath)
							}
						})
						let obj = {
							'goods':list,
							'filePaths':imgArr
						}
						console.log(obj)
						this.uploadTec(obj);
					}else{
						this.$message.error(response.message)
					}
				},500)
			},
			uploadTec: throttle (function(obj){
				orderData.post(this.api.uploadOrderAndFile,obj).then(res=>{
					console.log(res)
					this.$message.success('上传成功')
					this.loading.close()
				}).catch(err=>{
					this.loading.close()
				})
			},1000),
			beforeAvatarUpload(file) {
				console.log(file)
			    const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isPDF = file.type === 'application/pdf'
			    if (!isJPG & !isPDF & !isPNG) {
					this.$message.error('上传图片只能是 JPG/PNG/PDF 格式!');
					return false;
			    }else{
					return true
				}
			},
			beforeAvatarUploads(file){
				console.log(file)
				if(this.multipleSelection.length==0){
					this.$message.warning('请勾选所要批量上传工艺单的商品')
					return false
				}
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isPDF = file.type === 'application/pdf'
				if (!isJPG & !isPDF & !isPNG) {
					this.$message.error('上传图片只能是 JPG/PNG/PDF 格式!');
					return false;
				}else{
					return true
				}
			},
			//关闭工艺单
			categoryUpClose(value){
				this.categoryUpDialog = value
			},
			//展开数据修改触发刷新
			expandUpdate(value){
				if(value){
					this.loading = loading(document.getElementsByClassName('app-main')[0]);
					this.getShopList().then(res=>{
						console.log(res)
						let {data} = res;
						this.$store.commit('transfer/REMOVE_ORDERNAME');
						this.loading.close();
						this.gridData = data.records
						this.dataTotal = data.total;
					}).catch(err=>{
						this.loading.close();
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.traceDialog .el-dialog__body{
		padding: 0 20px 30px 20px!important;
	}
	.circle{
		border-radius: 50%;
		-moz-border-radius: 50%;
		-webkit-border-radius: 50%;
		cursor: pointer;
	}
	.his{
		cursor: pointer;
	}
</style>

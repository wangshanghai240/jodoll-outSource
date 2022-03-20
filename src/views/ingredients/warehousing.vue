<!--
 * @FileDescription: 辅料入库检
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="warList"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange">
		
		<!-- 自定义表头 -->
		<template v-slot:header_input>
			<el-button type="success" :size="size" plain round  @click="searchDialog = true" >搜索</el-button>
		</template>
		
		<template slot="isQualified" slot-scope="{row,$index}">
			<span>{{row.isQualified == true?'合格':'不合格'}}</span>
		</template>
		
		<template slot="operate" slot-scope="{row,$index}">
			<el-button :size="size" type="success" class="marginAuto0" @click="bianji(row)">详情</el-button>
			<el-button :size="size" type="primary" class="marginAuto0" @click="exportList(row)">导出</el-button>
		</template>
		
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 详情弹窗 -->
			<jod-dragDialog v-model="updateDialog" class="tableDialog" style="padding-bottom: 50px;" title="详情" top="50px" :dialogStyle="{width: '1200',widthType: 'px'}" :drag="true">
				<warehous-details v-model="checkId" v-if="updateDialog"></warehous-details>
			</jod-dragDialog>
			<!-- 辅料搜索 -->
			<jod-dragDialog v-model="searchDialog" title="搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchShopForm" :searchData="searchShopData" :searchForm="searchShopForm"
				 :searchHandle="searchShopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--导出-->
			<jod-dragDialog v-model="exportDio" :dialogStyle="{width: '900',widthType: 'px'}" top="10px" :drag="true">
				<export-list v-model="exportdata" v-if="exportDio"></export-list>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template> 
<script>
	import warehousing from '@/api/ingredients/warehousing.js'
	import warehousDetails from './components/warhouseDetails.vue'
	import exportlist from './components/export.vue'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'warehousDetails':warehousDetails,
			'exportList':exportlist,
		},
		data(){
			return {
				gridData:[],//源数据
				columns: [...warehousing.columns],
				options: {...warehousing.options},
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				checkId:{id:'',type:''},
				// 导出
				exportDio:false,
				exportdata:'',
				//搜索配置
				search:'',//搜索
				searchDialog: false,//查询弹窗
				searchShopData: {
					ingredientsName:'',//辅料名称
					ingredientsCode:'',//辅料编号
					isQualified:'',//检验结果
					clientName:'',//工厂
					orderNumber:'',//订单号
					updateBy:'',//检验员
				},
				searchShopForm: [{
						type: "Input",
						label: "辅料名称:",
						prop: "ingredientsName",
						placeholder: "请输入名称",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "辅料编号:",
						prop: "ingredientsCode",
						placeholder: "请输入编号",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "检验结果:",
						prop: "isQualified",
						options: [{
							label:'合格',
							value:true
						},{
							label:'不合格',
							value:false
						}],
						placeholder: "请选择检验结果",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "工厂:",
						prop: "clientName",
						placeholder: "请输入工厂",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "订单号:",
						prop: "orderNumber",
						placeholder: "请输入订单号",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "检验员:",
						prop: "updateBy",
						placeholder: "请输入检验员",
						style:"width:200px",
						change: row => "",
					}
				],
				searchShopHandle: [{
						label: "提交",
						type: "primary",
						handle: res => {
							this.$refs['searchShopForm']. $refs['searchForm'].validate((valid) => {
								if(valid){
                                    this.pagination.currentPage = 1;
									this.getList()
									this.searchDialog = false;
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
				dataTotal:0,
				multipleSelection:[],//勾选
				updateDialog:false
			}
		},
		mounted() {
			this.getList()
		},
		methods:{
			getList(){
				var data = {search:this.searchShopData};
				data['current'] = this.pagination['currentPage'];
				data['size'] = this.pagination['pageSize'];
				warehousing.get(this.api.ingEntryCheck,data).then(res=>{
					console.log(res)
					this.dataTotal = res.data.total
					this.gridData = res.data.records
				})
			},
			handleChangePage(current){
				console.log(current)
				this.pagination['currentPage'] = current;
				this.getList();
			},
			handleSizeChange(page){
				console.log(page)
				this.pagination['pageSize'] = page;
				this.getList();
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			searchClose(value){
				this.searchDialog = value
			},
			bianji(row){
				this.checkId['id'] = row.id
				this.checkId['type'] = 0
				this.updateDialog = true
			},
			exportList(row){
				this.exportdata = {id:row.id,updateBy:row.updateBy,serial:row.serial,orderNumber:row.orderNumber}
				this.exportDio = true
			}
		}
	}
</script>

<style>
</style>

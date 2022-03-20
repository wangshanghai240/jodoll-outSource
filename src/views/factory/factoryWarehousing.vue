<!--
 * @FileDescription: 工厂入库检
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="" :pagination="pagination"
		:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange"
		@handleSelectionChange="handleSelectionChange">

		<!-- 自定义表头 -->
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round @click="searchDialog = true">搜索</el-button>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button :size="size" @click="upDetails(row)" v-has:detail>查看详情</el-button>
			<el-button type="primary" :size="size" @click="exportRow(row)">导出</el-button>
		</template>
		<template slot="stage" slot-scope="{row,$index}">
			{{statusOptions[row.stage-1]?statusOptions[row.stage-1].label:''}}
			<!-- <el-button @click="exportShow = true"></el-button> -->
		</template>
		<template slot="tempState" slot-scope="{row,$index}">
			{{row.tempState==0?'完成':(row.tempState==1?'暂存':'无')}}
		</template>
		<!-- 问题属性 -->
		<template slot="problem" slot-scope="{row,$index}">
			{{attribute[row.problem]?attribute[row.problem].label:''}}
		</template>
		<!-- 处理意见 -->
		<template slot="resolution" slot-scope="{row,$index}">
			{{row.resolution?handleOpinions[row.resolution-1].label:''}}
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 搜索弹窗 -->
			<jod-dragDialog v-model="searchDialog" class="tableDialog" title="搜索"
				:dialogStyle="{width: '730',widthType: 'px'}">
				<search-item v-if="searchDialog" v-model="searchData" @searchClose="searchClose"></search-item>
			</jod-dragDialog>
			<!-- 详情弹窗 -->
			<jod-dragDialog v-model="detailsDialog" class="tableDialog" style="padding-bottom: 50px;" title="详情"
				top="50px" :drag="true" :dialogStyle="{width: '1200',widthType: 'px'}">
				<detail-item v-if="detailsDialog" v-model="detailsValue" :tempState="tempState" @closeDetail="closeDetail(arguments)"></detail-item>
			</jod-dragDialog>
			<!-- 导出 -->
			<jod-dragDialog v-model="exportShow" class="tableDialog" style="padding-bottom: 50px;" title="导出"
				top="50px" :drag="true" :dialogStyle="{width: '1200',widthType: 'px'}">
				<export-item v-if="exportShow" v-model="detailsValue" :rowInfo="rowInfo" @closeExport="closeExport()"></export-item>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import warehous from '@/api/factory/factoryWarehousing.js'
	import searchItem from './components/warehouseSearch.vue'
	import detailItem from './components/warehouseDetails.vue'
	import exportItem from './components/warehouseExport.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		loading
	} from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'searchItem': searchItem,
			'detailItem': detailItem,
			'exportItem':exportItem
		},
		data() {
			return {
				statusOptions:[...warehous.statusOptions],
				gridData: [], //源数据
				columns: warehous.columns,
				options: warehous.options,
				pagination: {
					currentPage: 1,
					pageSize: 20
				},
				attribute:[...warehous.attribute],//问题属性
				handleOpinions:[...warehous.handleOpinions],//处理意见
				dataTotal: 0,
				multipleSelection: [], //勾选
				searchDialog: false, //搜索
				detailsDialog: false, //详情
				searchData:{
					intoCheckCode:'',
					goodsName:'',
					goodsCode:'',
					orderNumber:'',
					factoryName:'',
					problem:'',
					resolution:''
				},
				detailsValue:{},
				exportShow:false,//导出
				rowInfo:null,
				info:null,
				tempState:null,//状态
			}
		},
		created() {
			if(this.$route.params.id||this.$route.params.orderNumber){
				console.log(this.$route.params)
				let {id,orderNumber} = this.$route.params;
				this.searchData.goodsCode = id;
				this.searchData.orderNumber = orderNumber;
			}
			let list = this.getList();
		},
		methods: {
			getList(){
				return new Promise((res,rej)=>{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					let obj = {...this.searchData};
					obj['page'] = this.pagination['currentPage'];
					obj['limit'] = this.pagination['pageSize'];
					warehous.post(this.api.goodsIntoPage, obj).then(list=>{
						this.gridData = list.data.records;
						this.dataTotal =list.data.total;
						console.log(this.gridData)
						this.loading.close();
						res(true)
					}).catch(e=>{
						this.loading.close();
						rej(e)
					})
				})
			},
			handleChangePage(current) {
				this.pagination['currentPage'] = current;
				this.getList();
				console.log(current)
			},
			handleSizeChange(page) {
				this.pagination['pageSize'] = page;
				this.getList();
				console.log(page)
			},
			handleSelectionChange(list) {
				this.multipleSelection = list;
			},
			async searchClose(value,data) {
				try{
					if(data){
						console.log(data)
						this.searchData = data;
                        this.pagination.currentPage = 1;
						let bt = await this.getList();
						if(bt) this.searchDialog = value;
					}else{
						this.searchDialog = value
					}
				}catch(e){
					this.searchDialog = value;
				}
			},
			//查看详情
			upDetails(row){
				console.log(row)
				this.detailsDialog = true;
				this.detailsValue = {id:row.id,goodsId:row.goodsId};
				this.tempState = row.tempState;
				this.rowInfo = {createBy:row.createBy,createTime:row.createTime};
			},
			//导出
			exportRow(row){
				console.log(row)
				this.detailsValue = {id:row.id,goodsId:row.goodsId};
				this.exportShow = true;
				this.rowInfo = {createBy:row.createBy,createTime:row.createTime};
			},
			closeDetail(value){//弹窗关闭 是否开启导出 是否刷新列表
				this.detailsDialog = value[0];
				console.log(value)
				if(value[1]){
					setTimeout(()=>{
						this.exportShow = !value[0];
					},500)
				}
				if(value[2]){
					if(this.$route.params.id||this.$route.params.orderNumber){
						console.log(this.$route.params)
						let {id,orderNumber} = this.$route.params;
						this.searchData.goodsCode = id;
						this.searchData.orderNumber = orderNumber;
					}
					let list = this.getList();
				}
			},
			closeExport(value){
				this.exportShow = value;
			}
		}
	}
</script>

<style>
</style>

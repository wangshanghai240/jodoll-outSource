<!--
 * @FileDescription: 面料入库检
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref=""
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
		
		<!-- 自定义表头 -->
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="searchDialog = true" >搜索</el-button>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="primary" plain :size="size" @click="entryChange(row)">详情</el-button>
			<el-button :size="size" @click="exportRow(row)">导出</el-button>
		</template>
		
		<template slot="isQualified" slot-scope="{row,$index}">
			<span>{{row.isQualified?'合格':'不合格'}}</span>
		</template>
		
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 搜索弹窗 -->
			<jod-dragDialog v-model="searchDialog" class="tableDialog" title="搜索"
				:dialogStyle="{width: '730',widthType: 'px'}">
				<search-item v-if="searchDialog" v-model="searchData" @searchClose="searchClose"></search-item>
			</jod-dragDialog>
			
			<!-- 详情弹窗 -->
			<jod-dragDialog v-model="entryDialog" class="tableDialog" style="padding-bottom: 50px;" title="入库检详情" top="50px" :drag="true"
				:dialogStyle="{width: '1200',widthType: 'px'}">
				<detail-item v-if="entryDialog" v-model="entryRow" :source="'list'" @warDetailsClose="warDetailsClose"></detail-item>
			</jod-dragDialog>
			
			<!-- 导出弹窗 -->
			<jod-dragDialog v-model="exportDialog" class="tableDialog" style="padding-bottom: 50px;" top="10px" :drag="true"
				:dialogStyle="{width: '900',widthType: 'px'}">
				<export-item v-if="exportDialog" v-model="entryRow"></export-item>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import warehouse from '@/api/fabric/warehouse.js'
	import detailItem from './components/warhouseDetails.vue'
	import exportItem from './components/warhouseExport.vue'
	import searchItem from './components/warehouseSearch.vue'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			'detailItem':detailItem,
			'exportItem':exportItem,
			'searchItem':searchItem
		},
		data(){
			return {
				gridData:[],//源数据
				columns: [...warehouse.columns],
				options: {...warehouse.options},
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
				searchDialog:false,//搜索
				searchData:{
					materialCode:'',
					materialName:'',
					isQualified:'',
					clientName:'',
					orderNumber:'',
					updateBy:''
				},
				pagination:{
					currentPage:1,
					pageSize:20
				},
				entryDialog:false,//详情
				entryRow:null,//行数据
				exportDialog:false,//导出
			}
		},
		created() {
			this.getList();
		},
		methods:{
			getList(){
				return new Promise((res,rej)=>{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					let data = {
						current:this.pagination['currentPage'],
						size:this.pagination['pageSize'],
						search:{...this.searchData}
					}
					warehouse.get(this.api.fabricEntryCheck,data).then(list=>{
						this.gridData = list.data.records;
						this.dataTotal = list.data.total;
						console.log(list);
						this.loading.close();
						res(true)
					}).catch(e=>{
						this.loading.close();
						rej(e)
					})
					
				})
			},
			handleChangePage(current){
				console.log(current)
				this.pagination['currentPage'] = current;
				this.getList();
			},
			handleSizeChange(page){
				this.pagination['pageSize'] = page;
				this.getList();
				console.log(page)
			},
			handleSelectionChange(list){
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
			//入库详情
			entryChange(row){
				this.entryRow = row;
				this.entryDialog = true
			},
			//导出
			exportRow(row){
				
				this.entryRow = row;
				this.exportDialog = true;
				
				
				// let obj = {
				// 	materialCode:row.materialCode,
				// 	materialName:row.materialName,
				// 	isQualified:row.isQualified
				// };
				// let url =process.env.VUE_APP_BASE_URL+this.api.fabricEntryExport;
				// warehouse.upload(url,obj,this.token,true).then(response=>{
				// 	if (!response) return;
				// 	console.log(response)
				// 	const { data, headers } = response
				// 	const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
				// 	const blob = new Blob([data], { type: 'application/vnd.ms-excel' })
				// 	console.log(blob)
				// 	const blobURL = window.URL.createObjectURL(blob)
				// 	const tempLink = document.createElement('a')
				// 	tempLink.download = decodeURI(fileName)
				// 	tempLink.style.display = 'none'
				// 	tempLink.href = blobURL
				// 	document.body.appendChild(tempLink)
				// 	tempLink.click()
				// 	document.body.removeChild(tempLink)
				// 	// 释放
				// 	window.URL.revokeObjectURL(blobURL)
				// })
				
			},
			//入库关闭
			warDetailsClose(value){
				this.entryDialog = value;
			}
		}
	}
</script>

<style>
</style>

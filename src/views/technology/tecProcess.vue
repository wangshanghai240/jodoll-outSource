<!--
 * @FileDescription: 工艺单列表
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :pagination="pagination" 
	:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round @click="add" v-has:add>
				新增
			</el-button>
			<el-button type="primary" :size="size" plain round @click="getId">
				搜索
			</el-button>
			<el-button type="primary" :size="size" plain round @click="exportCraft">
				批量导出
			</el-button>
			<el-upload
				style="display: inline;margin-left: 10px;"
				:action="uploadUlr+api.importCraftExcel"
				:headers="headers"
				:on-success="importChange"
				:limit="1"
				:on-exceed="importExceed"
				:file-list="fileList">
				<el-button type="warning" :size="size">
					导入工艺单
				</el-button>
			</el-upload>
		</template>
		<template slot="status" slot-scope="{row,$index}">
			<span>{{row.status ? statusOption[row.status - 1].label:''}}</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<div style="display: flex;flex-wrap:wrap;">
				<el-button type="primary" :size="size" class="marginRight10" @click="update(row)" v-has:update>修改</el-button>
				<el-button type="infor" :size="size"  class="marginRight10" @click="copy(row)" v-has:copy>复制</el-button>
				<el-button type="primary" :size="size" plain @click="send(row)" class="marginRight10" v-has:export>导出</el-button>
				<el-button v-if="row.status == 3" disabled type="info" :size="size" @click="deletes(row)">不可删除</el-button>
				<el-button v-else type="warning" :size="size" @click="deletes(row)" v-has:del>删除</el-button>
			</div>
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 商品搜索 -->
			<jod-dragDialog v-model="searchDialog" title="商品搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchShopForm" :searchData="searchShopData" :searchForm="searchShopForm"
				 :searchHandle="searchShopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--工艺单-->
			<jod-dragDialog v-model="exportDio" title="工艺单" :drag="true" top="10px" :dialogStyle="{width: '1200',widthType: 'px'}">
				<export-list v-model="orderid" v-if="exportDio"></export-list>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script> 
	import technology from '../../api/technology/tecProcess.js'
	import exportlist from './components/export.vue'
	import {mapGetters} from 'vuex'
	import { getLocalTime ,loading } from '@/utils'
	import {throttle , debounce} from '@/utils/validate.js'
	export default {
		name:'tecprocess',
		computed: {
			...mapGetters([
				'size',
				'token' 
			])
		},
		components:{
			'exportList':exportlist
		},
		data() {
			return {
				uploadUlr:process.env.VUE_APP_BASE_URL,
				headers:{},
				fileList:[],
				loading:null,
				gridData:[],
				columns:technology.columns,
				options:technology.options,
				pagination:{//分页
					currentPage:1,
					pageSize:20
				},
				statusOption:technology.statusOptions,
				dataTotal:0,
				multipleSelection:[],
				//工艺单
				exportDio:false,
				orderid:[],
				orderIds:[],
				nowTime:'',
				contentList:[],//修改内容
				demandList:[],//工艺要求
				tecValue:[],//规格表
				name:'',//版型
				norm:'',//执行标准
				remark:'',//备注
				securityType:'',//安全类型
				companyNo:'',//公司货号
				factoryNo:'',//厂家货号
				spectrum:'',//系列
				tradeName:'',//品名
				reference:'',//参考成分
				supplier:'',//供应商
				image:'',
				standardline:0,
				values:[],
				tableList:[],
				//搜索配置
				search:'',//搜索
				searchDialog: false,//查询弹窗
				searchShopData: {
					name:'',//名称
					goodsId:'',//商品编号
					status:'',//状态
				},
				searchShopForm: [{
						type: "Input",
						label: "名称:",
						prop: "name",
						placeholder: "请输入名称",
						style:"width:200px",
						change: row => "",
					},{
						type: "Input",
						label: "商品编号:",
						prop: "goodsId",
						placeholder: "请输入编号",
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "状态:",
						prop: "status",
						options:[{
							label: '未提交',
							value: 1,
						},{
							label: '已完成',
							value: 2,
						},{
							label: '已使用',
							value: 3,
						}],
						clearable:true,
						placeholder: "请选择",
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
									this.pagination['currentPage'] = 1
									this.getlist()
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
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
			this.getlist();
		},
		mounted(){
			// this.getTimes()
			
		},
		methods: {
			getlist(){
				try{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					this.gridData = []
					var data = {search:this.searchShopData};
					data['current'] = this.pagination['currentPage'];
					data['size'] = this.pagination['pageSize'];
					console.log('data',data)
					technology.get(this.api.getcraft,data).then(res=>{
						console.log(res)
						var sorts = res.data.records
						var list = this.getTime(sorts)
						for(var j=0;j<list.length;j++){
							for(var i=0;i<sorts.length;i++){
								if(new Date(sorts[i].createTime).getTime() == list[j]){
									this.gridData.push(sorts[i])
								}
							}
						}
						this.dataTotal = res.data.total;
						this.loading.close();
					})
				}catch(e){
					this.loading.close();
				}
			},
			add(){
				this.$router.push({path:'/technology/tecaddList',query:{goodsId:'',id:'',path:0}})
			},
			getId(){
				this.searchDialog = true
			},
			send(row){
				console.log(row)
				this.orderid = [row.id,0]
				this.exportDio = true
				// this.orderid = row.id
				// this.getlists()
			},
			update(row){
				this.$router.push({path:'/technology/tecaddList',query:{goodsId:row.goodsId,id:row.id,path:0}})
			},
			deletes(row){
				technology.delete(this.api.deletecraft,row.id).then(res=>{
					this.getlist()
				})
			},
			copy(row){
				technology.get(this.api.getcraftcopy,row.id+'').then(res=>{
					this.getlist()
				})
			},
			handleChangePage(value){
				this.pagination['currentPage'] = value;
				this.getlist()
			},
			handleSizeChange(value){
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getlist()
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
				console.log(this.multipleSelection)
			},
			getTime(sorts){
				var times =[]
				for(var i=0;i<sorts.length;i++){
					var time = sorts[i].createTime
					times.push(new Date(time).getTime())
				}
				times = [...new Set(times)]
				times.sort((old,New)=>{
					return old - New
				})
				console.log(times)
				return times
			},
			exportCraft(){
				this.orderIds = []
				if(this.multipleSelection.length==0){
					this.$message.warning('请勾选所导出的订单');
					return;
				}
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				for(var i=0;i<this.multipleSelection.length;i++){
					this.orderIds.push(this.multipleSelection[i].id)
				}
				let obj = {
					ids:this.orderIds.join(',')
				}
				let url =process.env.VUE_APP_BASE_URL+this.api.craftExport;
				technology.upload(url,obj,this.token,true).then(response=>{
					this.loading.close()
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
				});
			},
			importChange(response,file, fileList) {
				console.log(response)
				console.log(file)
				this.fileList = [];
				if(response.code===0){
					this.$message.success('导入成功');
					this.getlist();
				}else{
					this.$message.error('导入失败');
				}
			},
			// errChange(err){
			// 	this.$message.error('导入失败');
			// },
			importExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
		}
	}
</script>

<style>
</style>

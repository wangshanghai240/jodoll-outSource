<!--
 * @FileDescription: 要点列表
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :pagination="pagination"
	:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange">
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round @click="addShop" v-has:add>
				新增
			</el-button>
			<el-button type="primary" :size="size" plain round @click="getSourceId">
				搜索
			</el-button>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<div style="display: flex;flex-wrap:wrap;justify-content: center;">
				<el-button type="primary" :size="size" class="marginRight10" @click="update(row)" v-has:update>修改</el-button>
				<el-button type="danger" :size="size" class="marginRight10" @click="deletes(row)" v-has:del>删除</el-button>
			</div>
		</template>
		<template slot='isShow' slot-scope="{row,$index}">
			<span>{{row.isShow == true?'是':'否'}}</span>
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 商品搜索 -->
			<jod-dragDialog v-model="searchDialog" title="搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchShopForm" :searchData="searchShopData" :searchForm="searchShopForm"
				 :searchHandle="searchShopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--新增/修改-->
			<jod-dragDialog v-model="addDialog" :title="shopTitle" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="shopForm" :searchData="shopData" :searchForm="shopForm"
				 :searchHandle="shopHandle">
				</jod-formSearch>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import technology from '../../api/technology/tecPiont.js'
	import {mapGetters} from 'vuex'
	import { getLocalTime ,loading } from '@/utils'
	import {throttle , debounce} from '@/utils/validate.js'
	export default {
		name:'tecpiont',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		data() {
			return {
				loading:null,
				gridData:[],
				columns:technology.columns,
				options:technology.options,
				pagination:{//分页
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				//新增配置
				addDialog: false,//新增弹窗
				shopTitle:'',
				shopData: {
					id:null,
					isShow:'',//是否显示
					theme:'',//名称
					sort:'',//排序
				},
				shopForm: [{
						type: "Input",
						label: "要点名称:",
						prop: "theme",
						placeholder: "请输入名称",
						style:"width:200px",
						rules: [{
							required: true,
							message: "请输入名称",
							trigger: "blur"
						}]
					},{
						type: "Select",
						label: "是否显示:",
						prop: "isShow",
						options: [{
							value:false,
							label:'否'
						},{
							value:true,
							label:'是'
						}],
						placeholder: "请选择",
						style:"width:200px",
						clearable:true,
						change: row => "",
						rules: [{
							required: true,
							message: "请选择",
							trigger: "blur"
						}]
					},{
						type: "Input",
						label: "排序:",
						prop: "sort",
						placeholder: "请输入序号",
						style:"width:200px",
						rules: [{
							required: true,
							message: "请输入序号",
							trigger: "blur"
						}]
					}],
				shopHandle: [{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['shopForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									if(this.shopTitle == '新增'){
										let data = this.shopData
										console.log(data)
										technology.post(this.api.postcraftRequire,data).then(res=>{
											this.addDialog = false
											this.getlist()
										})
									}else{
										let data = this.shopData
										console.log(data)
										technology.put(this.api.postcraftRequire,data).then(res=>{
											this.addDialog = false
											this.getlist()
										})
									}
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
				search:'',//搜索
				searchDialog: false,//查询弹窗
				searchShopData: {
					theme:'',//名称
					isShow:'',//是否显示
				},
				searchShopForm: [{
						type: "Input",
						label: "名称:",
						prop: "theme",
						placeholder: "请输入名称",
						clearable:true,
						style:"width:200px",
						change: row => "",
					},{
						type: "Select",
						label: "是否显示:",
						prop: "isShow",
						options: [{
							value:false,
							label:'否'
						},{
							value:true,
							label:'是'
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
                                    this.pagination['currentPage'] = 1;
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
			this.getlist()
		},
		mounted(){
			
		},
		methods: {
			getlist(){
				try{
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					var data = {search:this.searchShopData};
					data['current'] = this.pagination['currentPage'];
					data['size'] = this.pagination['pageSize'];
					console.log('data',data)
					this.gridData = []
					technology.get(this.api.getcraftRequire,data).then(res=>{
						this.gridData = res.data.records
						console.log(this.gridData)
						this.dataTotal = res.data.total
						this.loading.close();
					})
				}catch(e){
					this.loading.close();
				}
			},
			addShop(){
				this.shopData['isShow'] = ''
				this.shopData['theme'] = ''
				this.shopData['sort'] = ''
				this.shopTitle = '新增'
				this.addDialog = true
			},
			getSourceId(){
				this.searchDialog = true
			},
			update(row){
				this.shopTitle = '修改'
				this.shopData['id'] = row.id
				this.shopData['sort'] = row.sort
				this.shopData['isShow'] = row.isShow
				this.shopData['theme'] = row.theme
				this.addDialog = true
			},
			deletes(row){
				technology.delete(this.api.deletecraftRequire,row.id).then(res=>{
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
			// getTime(){
			// 	let yy = new Date().getFullYear();
			// 	let mm = new Date().getMonth()+1;
			// 	let dd = new Date().getDate();
			// 	let hh = new Date().getHours();
			// 	let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
			// 	let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
			// 	return (yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss)
			// }
		}
	}
</script>

<style>
</style>

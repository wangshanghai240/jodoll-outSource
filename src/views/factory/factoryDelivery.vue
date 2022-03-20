<!--
 * @FileDescription: 工厂出库检
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :pagination="pagination"
		:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange">
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round @click="getSourceId">
				搜索
			</el-button>
		</template>
		<template slot="problemAttribute" slot-scope="{row,$index}">
			<span>{{row.problemAttribute?problemOptions[row.problemAttribute].label:'无'}}</span>
		</template>
		<template slot="resolution" slot-scope="{row,$index}">
			<span>{{row.resolution?resolutionOptions[row.resolution].label:''}}</span>
		</template>
		<template slot="stage" slot-scope="{row,$index}">
			<span>{{row.stage?stageOptions[row.stage-1].label:''}}</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<div style="display: flex;flex-wrap:wrap;justify-content: center;">
				<el-button type="primary" :size="size" class="marginAuto0" @click="update(row)" v-has:detail>查看详情
				</el-button>
				<el-button type="warning" :size="size" class="marginAuto5" @click="deletes(row)" v-has:export>导出
				</el-button>
				<el-upload
				  v-if="!row.file"
				  class="avatar-uploader" 
				  :action="url+api.uploadQualit"
				  :headers="headers" 
				  :limit="1" 
				  :on-exceed="handleExceed" 
				  :on-success="UploadSuccess"
				  :file-list="fileList">
					<el-button type="infor" :size="size" @click="setId(row)">回签上传</el-button>
				</el-upload>
				<el-button v-else type="info" plain :size="size" @click="downLoad(row)">回签下载</el-button>
			</div>
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 商品搜索 -->
			<jod-dragDialog v-model="searchDialog" title="搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchShopForm" :searchData="searchShopData"
					:searchForm="searchShopForm" :searchHandle="searchShopHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!--出货检-->
			<jod-dragDialog v-model="exportDio" title="出货检" :dialogStyle="{width: '1200',widthType: 'px'}" top="50px">
				<export-list v-model="exportdata" v-if="exportDio"></export-list>
			</jod-dragDialog>
			<!--详情列表-->
			<jod-dragDialog v-model="deliveryDio" title="详情列表" :dialogStyle="{width: '1200',widthType: 'px'}"
				:drag="true" top="50px">
				<delivery-List v-model="shipmentData" v-if="deliveryDio"></delivery-List>
			</jod-dragDialog>
			<!-- 图片查看 -->
			<jod-dragDialog v-model.sync="dialogVisible" class="tableDialog" :modal="false">
				<img width="100%" :src="dialogImageUrl" alt="">
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import delivery from '../../api/factory/factoryDelivery.js'
	import deliveryList from './components/deliveryList.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		getLocalTime,
		loading
	} from '@/utils'
	import {
		throttle,
		debounce
	} from '@/utils/validate.js'
	import exportlist from './components/export.vue'
	export default {
		name: 'tecprocess',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			'exportList': exportlist,
			'deliveryList': deliveryList,
		},
		data() {
			return {
				url: process.env.VUE_APP_BASE_URL,
				headers: {},
				rowId:'',//行id
				dialogImageUrl: '', //图片地址
				dialogVisible: '', //上传图片查看
				uploadItem: [], //上传暂存
				gridData: [],
				fileList:[],
				path: '',
				columns: delivery.columns,
				options: delivery.options,
				problemOptions: delivery.problemOptions,
				resolutionOptions: delivery.resolutionOptions,
				stageOptions: delivery.stageOptions,
				pagination: { //分页
					currentPage: 1,
					pageSize: 20
				},
				dataTotal: 0,
				//工艺单
				exportDio: false,
				exportdata: '',
				//详情列表
				deliveryDio: false,
				shipmentData: '',
				//搜索配置
				search: '', //搜索
				searchDialog: false, //查询弹窗
				searchShopData: {
					factoryName: '', //工厂名称
					factoryOrderNumber: '', //工厂订单编号
					goodsCode: '', //商品代码
					goodsName: '', //商品名称
					outCheckCode: '', //出库检编号
					problemAttribute: '', //问题属性
					resolution: '', //处理意见
					tempState: '',
				},
				searchShopForm: [{
					type: "Input",
					label: "工厂名称:",
					prop: "factoryName",
					placeholder: "请输入工厂",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Input",
					label: "订单号:",
					prop: "factoryOrderNumber",
					placeholder: "请输入订单号",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Input",
					label: "商品编号:",
					prop: "goodsCode",
					placeholder: "请输入检验数",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Input",
					label: "商品名:",
					prop: "goodsName",
					placeholder: "请输入名称",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Input",
					label: "检验编号:",
					prop: "outCheckCode",
					placeholder: "请输入编号",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Select",
					label: "问题属性:",
					prop: "problemAttribute",
					options: delivery.problemOptions,
					placeholder: "请选择问题属性",
					style: "width:200px",
					change: row => "",
				}, {
					type: "Select",
					label: "处理意见:",
					prop: "resolution",
					options: delivery.resolutionOptions,
					placeholder: "请选择处理意见",
					style: "width:200px",
					change: row => "",
				}],
				searchShopHandle: [{
					label: "提交",
					type: "primary",
					handle: res => {
						this.$refs['searchShopForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.pagination.currentPage = 1;
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
						this.searchShopData.factoryOrderNumber = ''
						this.searchShopData.goodsCode = ''
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.searchDialog = false;
					},
					hide: false,
				}],
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
			this.searchShopData.factoryOrderNumber = this.$route.query.factoryOrderNumber
			this.searchShopData.goodsCode = this.$route.query.goodsCode
		},
		mounted() {
			this.getlist()
		},
		methods: {
			getlist() {
				var data = {
					...this.searchShopData
				};
				data['page'] = this.pagination['currentPage'];
				data['limit'] = this.pagination['pageSize'];
				console.log('data', data)
				delivery.post(this.api.goodsOutcheck, data).then(res => {
					console.log(res)
					this.gridData = res.data.records
					this.dataTotal = res.data.total
				})
			},
			getSourceId() {
				this.searchDialog = true
			},
			deletes(row) {
				this.exportdata = {
					id: row.id,
					goodsId: row.goodsId,
					outCheckCode: row.outCheckCode
				}
				this.exportDio = true
			},
			update(row) {
				console.log(row)
				this.shipmentData = {
					id: row.id,
					goodsId: row.goodsId,
					tempState: row.tempState,
					type: 2,
					dis: true
				}
				this.deliveryDio = true
				// var data = {goodsId:row.goodsId,tempState:row.tempState}
				// delivery.get(this.api.getgoodsoutcheckId,row.id).then(res=>{
				// 	console.log(res)
				// })
			},
			handleChangePage(value) {
				this.pagination['currentPage'] = value;
				this.getlist()
			},
			handleSizeChange(value) {
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getlist()
			},
			downLoad(value) {
				console.log(value);
				let data = {
					filePath: value.file
				};
				let url = process.env.VUE_APP_BASE_URL + this.api.download
				delivery.upload(url, data, this.token, true).then(response => {
					if (!response) return;
					console.log(response)
					const {
						data,
						headers
					} = response
					console.log(data)
					console.log(headers)
					const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
					const blob = new Blob([data], {
						type: headers['content-type']
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
			setId(row){
				this.rowId = row.id;
			},
			//上传成功
			UploadSuccess(response, file, fileList) {
				console.log(response)
				console.log(file)
				console.log(fileList);
				if (response.code == 0) {
					let request = {
						'id':this.rowId,
						'file':response.data.fileHttpPath
					}
					delivery.put(this.api.backUpload, request).then(putRes => {
						this.$message.success('上传成功');
						this.getlist();
						this.fileList = [];
					}).catch(err => {
						console.log(err)
						this.$message.error('上传失败2')
					})
				} else {
					this.$message.error('上传失败1')
				}
			},
			//上传数量限制
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			//图片查看
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.response.data.fileHttpPath;
				this.dialogVisible = true;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.avatar-uploader {
		/deep/.el-upload-list__item-name {
			width: 80px;
		}
	}
</style>

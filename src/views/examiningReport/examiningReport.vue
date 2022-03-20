<!--
 * @FileDescription: 质检报告
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="shopList" :pagination="pagination"
		:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange"
		@handleSelectionChange="handleSelectionChange">
		<template v-slot:header_input>
			<el-button type="primary" :size="size" style="width: 75px;" :loading="addLoading" plain round
				@click="addEXA" v-has:add>
				新增
			</el-button>
			<el-button type="primary" :size="size" plain round @click="searchEXADialog = true">
				搜索
			</el-button>
		</template>
		<template slot="type" slot-scope="{row,$index}">
			<span>{{row.type?typeOptions[row.type-1].label:row.type}}</span>
		</template>
		<!-- 行按钮 -->
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="success" :size="size" :loading="row.previewLoading" v-has:preview @click="preview(row)"
				plain>预览</el-button>
			<el-button type="primary" :size="size" @click="updateEXA(row)" v-has:update>修改</el-button>
			<el-button type="danger" :size="size" :loading="delEXALoading" @click="delEXA(row)" v-has:del>删除</el-button>
		</template>

		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 新增、修改 -->
			<jod-dragDialog v-model="updateEXADialog" :title="updateEXATitle"
				:dialogStyle="{width: '400',widthType: 'px'}" @closeDio="closeDio">
				<jod-formSearch labelWidth="120px" ref="updateEXAForm" :searchData="updateEXAData"
					:searchForm="updateEXAForm" :searchHandle="updateEXAHandle">
				</jod-formSearch>
			</jod-dragDialog>

			<!-- 搜索 -->
			<jod-dragDialog v-model="searchEXADialog" title="搜索报告" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="searchEXAForm" :searchData="searchEXAData"
					:searchForm="searchEXAForm" :searchHandle="searchEXAHandle">
				</jod-formSearch>
			</jod-dragDialog>

			<!-- <el-dialog
			  title="在线预览"
			  class="pdf"
			  top="0"
			  :visible.sync="PDFDialog">
			  <transition name="fade" mode="out-in">
				  <jod-pdfs v-model="pdfUrl" v-if="pdfUrl"></jod-pdfs>
			  </transition>
			</el-dialog> -->
		</template>
	</jod-tableList>
</template>

<script>
	import examiningReportList from '@/api/examiningReport/examiningReportList.js'
	import {
		mapGetters
	} from 'vuex'
	import {
		loading
	} from '@/utils'
	export default {
		name: 'EXA',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		data() {
			return {
				gridData: [], //源数据
				columns: examiningReportList.columns,
				options: examiningReportList.options,
				typeOptions: examiningReportList.typeOptions,
				pagination: {
					currentPage: 1,
					pageSize: 20
				},
				dataTotal: 0, //总条数
				multipleSelection: [], //勾选
				addLoading: false, //新增
				//搜索
				searchEXADialog: false,
				searchEXAData: examiningReportList.searchData,
				searchEXAForm: examiningReportList.searchForm,
				searchEXAHandle: [{
					label: "提交",
					type: "primary",
					loading: false,
					handle: res => {
						this.$refs['searchEXAForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
                                this.pagination.currentPage = 1;
								this.searchEXAHandle[0].loading = true;
								this.getEXA().then(res => {
									let {
										data
									} = res;
									this.gridData = data.records;
									this.dataTotal = data.total;
									this.searchEXAHandle[0].loading = false;
									this.$message.success('查询成功')
									this.searchEXADialog = false;
									console.log(res)
								}).catch(err => {
									this.searchEXAHandle[0].loading = false;
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
						this.$refs['searchEXAForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.searchEXADialog = false;
					},
					hide: false,
				}],
				loading: null,
				delEXALoading: false,
				//新增.修改
				stateEXA: null, //0新增1修改
				EXAId: null,
				updateEXATitle: '',
				updateEXADialog: false,
				updateEXAData: {
					examiningNo: '',
					type: '',
					surfaceMaterialNo: ''
				},
				updateoptions: [],
				updateEXAForm: JSON.parse(JSON.stringify(examiningReportList.addEXA)),
				updateEXAHandle: [{
					label: "确定",
					type: "primary",
					loading: false,
					handle: res => {
						this.$refs['updateEXAForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.updateEXAHandle[0].loading = true;
								console.log(this.updateEXAData)
								let {
									fileUpload,
									...demo
								} = {
									...this.updateEXAData
								};
								console.log(demo)
								let from = {
									file:fileUpload[0].response.data.fileHttpPath,
									...demo
								}
								console.log(from)
								if(this.stateEXA==0){
									examiningReportList.post(this.api.examiningReport,from).then(res=>{
										this.$message.success('添加成功')
										this.updateEXAHandle[0].loading = false;
										this.updateEXADialog = false;
										this.getEXA().then(res=>{
											let {data} = res;
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
										})
									})
								}else{
									let data = {id:this.EXAId,...this.updateEXAData}
									examiningReportList.put(this.api.examiningReport,data).then(res=>{
										this.$message.success('修改成功')
										this.updateEXAHandle[0].loading = false;
										this.updateEXADialog = false;
										this.getEXA().then(res=>{
											let {data} = res;
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
										})
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
					label: "取消",
					type: "info",
					handle: res => {
						console.log(this.$refs['updateEXAForm'])
						this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
						this.updateEXADialog = false;
					},
					hide: false,
				}],
				PDFDialog: false,
				pdfUrl: '', //pdf
			}
		},
		created() {
			this.updateEXAForm.push({
				type: "Select",
				clearable: true,
				label: "类型:",
				prop: "type",
				options: this.typeOptions,
				placeholder: "请选择类型",
				style: "width:200px",
				change: row => {
					console.log('123123')
				},
				rules: [{
					required: true,
					message: "请选择类型",
					trigger: "change"
				}],
			})
			this.updateEXAForm.push({
				type: "fileUpload",
				label: "图片上传:",
				headers: {
					'Authorization': this.token
				},
				prop: "fileUpload",
				upload: process.env.VUE_APP_BASE_URL + this.api.uploadQualit,
			})
			console.log('----------------')
			console.log(this.updateEXAForm)
			this.loading = loading(document.getElementsByClassName('app-main')[0])
		},
		mounted() {

			this.getEXA().then(res => {
				let {
					data
				} = res;
				this.gridData = data.records;
				this.dataTotal = data.total;
				for (var i = 0; i < this.gridData.length; i++) {
					this.updateoptions.push({
						value: i,
						label: this.gridData[i].examiningNo
					})
				}
				console.log(this.updateoptions)
				this.loading.close();
			}).catch(err => {
				this.loading.close();
			})
		},
		methods: {
			getEXA() {
				let {
					daterange,
					...search
				} = {
					...this.searchEXAData
				};
				search = {
					startTime: daterange[0] ? daterange[0] : "",
					endTime: daterange[1] ? daterange[1] : "",
					...search
				};
				let form = {
					current: this.pagination.currentPage,
					size: this.pagination.pageSize,
					search
				};
				return examiningReportList.get(this.api.selectPage, form);
			},
			handleChangePage(value) {
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value
				this.getEXA().then(res => {
					let {
						data
					} = res;
					this.loading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err => {
					this.loading.close();
				})
			},
			handleSizeChange(value) {
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['pageSize'] = value;
				this.pagination['currentPage'] = 1;
				this.getEXA().then(res => {
					let {
						data
					} = res;
					this.loading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err => {
					this.loading.close();
				})
			},
			handleSelectionChange(list) {
				this.multipleSelection = list;
			},
			addEXA() {
				// if(this.stateEXA !== 0) {
				// 	this.updateEXAForm = [...examiningReportList.addEXA];
				// }
				this.$nextTick(() => {
					this.stateEXA = 0;
					this.updateEXADialog = true;
					this.updateEXATitle = '新增报告'
				})
			},
			updateEXA(row) {
				// if(this.stateEXA !== 1) {
				// 	this.updateEXAForm = [...examiningReportList.addEXA];
				// }
				this.stateEXA = 1;
				this.EXAId = row.id;
				this.updateEXADialog = true;
				this.updateEXATitle = '报告修改'
				this.$nextTick(() => {
					this.updateEXAData['examiningNo'] = row.examiningNo;
					this.updateEXAData['type'] = row.type;
					this.updateEXAData['surfaceMaterialNo'] = row.surfaceMaterialNo;
					if (row.file != null) {
						this.updateEXAData['fileUpload'] = [{
							name: '质检报告',
							url: row.file
						}];
					}
				})
			},
			delEXA(row) {
				this.delEXALoading = true;
				examiningReportList.del(this.api.examiningReport, row.id).then(res => {
					this.$message.success('删除成功')
					this.getEXA().then(res => {
						let {
							data
						} = res;
						this.gridData = data.records;
						this.dataTotal = data.total;
						this.delEXALoading = false;
					}).catch(err => {
						this.delEXALoading = false;
					})
				})
			},
			preview(row) {
				this.$set(row, 'previewLoading', true)
				examiningReportList.get(this.api.examiningReport, {
					id: row.id
				}).then(res => {
					console.log(res);
					if (res.code == 0 && res.data) {
						let {
							data
						} = res;
						let jpg = data.indexOf('.jpg');
						let png = data.indexOf('.png');
						let pdf = data.indexOf('.pdf');
						if (jpg !== -1 || png !== -1 || pdf !== -1) {
							//this.pdfUrl = data;
							//this.PDFDialog = true;
							window.open(data, '_blank');
						} else {
							this.$message.error('此文件不是图片类型,无法查看');
						}
						this.$set(row, 'previewLoading', false)
					} else {
						this.$message.error('文件不存在');
						this.$set(row, 'previewLoading', false)
					}

				})
			},
			closeDio() {
				this.$refs['updateEXAForm'].$refs['searchForm'].resetFields();
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.pdf .el-dialog__body {
		padding: 0 20px 10px 20px !important;
	}
</style>

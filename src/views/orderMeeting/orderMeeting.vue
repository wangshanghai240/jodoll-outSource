<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange">
		<template v-slot:content_context>
			<!-- <div class="categoryUpload">

			</div> -->
			<div class="searchBody">
				<el-date-picker v-model="searchObj['year']" type="year" placeholder="年份" :size="size" class="marginTop16" value-format="yyyy"
				  style="width: 100px;margin:0 10px;"></el-date-picker>
				<el-select v-model="searchObj['quarter']" placeholder="季度" :size="size" class="marginTop16" style="width: 80px;margin:0 10px;" clearable>
					<el-option
					  v-for="item in quarterOptions"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
					</el-option>
				</el-select>
				<el-date-picker
					v-model="searchObj['date']"
					type="daterange"
					:size="size"
					class="marginTop16" 
					range-separator="至"
					value-format="yyyy-MM-dd"
					start-placeholder="开始日期"
					end-placeholder="结束日期"/>
				<el-input
					v-model="searchObj['name']"
					:size="size"
					class="marginTop16" 
					style="width: 145px;margin:0 10px;"
					placeholder="活动名称 搜索"/>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="searchLoading"
				  class="marginTop16" @click="searchMeeting">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading"
				  class="marginTop16" @click="searchMeeting('reset')">
					重置
				</el-button>
			</div>
			<jod-dragDialog v-model="addDialog" :title="meetingTitle" :dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="meetingForm" :searchData="meetingData" :searchForm="meetingForm"
				 :searchHandle="meetingHandle">
				</jod-formSearch>
			</jod-dragDialog>
		</template>
		
		<template slot="yearQuarter" slot-scope="{row}">
			{{row.yearQuarter | yearFilter}}
		</template>
		
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="addMeeting" v-has:add>新增</el-button>
		</template>
		<template slot="operate" slot-scope="{row}">
			<div style="display: flex;margin: 5px 0;justify-content: center;">
				<el-button type="info" class="marginRight10 marginAuto0" plain :size="size" @click="queryShop(row)" v-has:view>查看</el-button>
				<el-upload
					class="meetingImport marginRight10 marginAuto0"
					:action="uploadUlr+api.importCraftExcel"
					:data="importData"
					:headers="headers"
					:on-success="importChange"
					:limit="1"
					:on-exceed="importExceed"
					:file-list="fileList">
					<el-button type="warning" :size="size" @click="importShop(row)" v-has:importCraft>
						导入工艺单
					</el-button>
				</el-upload>
				<!-- <el-button type="success" class="marginRight10 marginLeft0" style="width: 89px;" :loading="row.importLoading"
					plain :size="size" @click="importShop">导入</el-button> -->

				<el-upload v-if= "row.importStatus == 0"
					class="meetingImport marginRight10 marginAuto0"
					:action="uploadUlr+api.meetingUpload"
					:data="importData"
					:headers="headers"
					:on-success="importChange"
					:limit="1"
					:on-exceed="importExceed"
					:file-list="fileList">
					<el-button type="success" plain :size="size" @click="importClick(row)" v-has:goodsUpload>
						<i class="el-icon-s-goods"></i>商品上传
					</el-button> 
				</el-upload>

				<el-upload v-if= "row.importStatus == 1"
					class="meetingImport marginRight10 marginAuto0"
					:action="uploadUlr+api.importExcel"
					:data="importData"
					:headers="headers"
					:on-success="importChange"
					:limit="1"
					:on-exceed="importExceed"
					:file-list="fileList">
					<el-button type="success" plain :size="size" @click="importNumClick(row)" v-has:numUpload>
						<i class="el-icon-s-data"></i>数量上传
					</el-button>
				</el-upload>

				<el-dropdown split-button type="primary" :size="size" trigger="click" class="marginRight10 marginAuto0" @click="updateMeeting(row)" v-has:update>
					<span class="el-dropdown-link">
						修改
					</span>
					<el-dropdown-menu slot="dropdown">
						<!-- <el-dropdown-item @click.native="queryShop(row)">
							<span>查看商品明细</span>
						</el-dropdown-item> -->
						<el-dropdown-item @click.native="generateFab(row)">
							<span>生成面料需求单</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="generateAcc(row)">
							<span>生成辅料需求单</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="generateFac(row)">
							<span >生成工厂订单</span>
						</el-dropdown-item>
						<!-- <el-dropdown-item @click.native="uploadQuailty(row)">
							<span >上传工艺单</span>
							
						</el-dropdown-item> -->
						<el-dropdown-item @click.native="Bomput(row)">
							<span >获取BOM</span>
						</el-dropdown-item>
						<!-- <el-upload
							multiple
							:headers="headers"
							class="uploadQuailty"
							:action="uploadUlr+api.multipartByCraft"
							:on-success="uploadQuailtySucc"
							:before-upload="beforeAvatarUpload"
							:show-file-list="false">
							<el-dropdown-item @click.native="uploadQuailty(row)">
								上传工艺单
							</el-dropdown-item>
						</el-upload> -->
						
						
					</el-dropdown-menu>
				</el-dropdown>

				<!-- <el-button type="success" plain :size="size" @click="updateMeeting(row)">修改</el-button> -->
				<!-- <el-button type="danger" class="marginAuto0" :size="size" :loading="row.delLoading" 
				  @click="deleteMeeting(row)">删除</el-button> -->
			</div>


		</template>
	</jod-tableList>
</template>

<script>
	import orderData from '@/api/orderMeeting.js'
	import { loading } from '@/utils'
	import { throttle } from '@/utils/validate'
	import {mapGetters} from 'vuex'
	import api from '@/api/index'
	export default {
		name:'meeting',
		filters: {
			yearFilter (value){
				if(value){
					let year = value.slice(0,4);
					let quarter = value.slice(4,6);
					let newQuarter = '';
					if(quarter=='01'){
						newQuarter = '春夏'
					}else if(quarter=='02'){
						newQuarter = '秋冬'
					}
					let str = year+newQuarter;
					return str
				}else{
					return '暂无'
				}
			}
		},
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		data() {
			let pickerBeginDateAfter = {
				disabledDate: (time) => {
					return time.getTime() < Date.now()
				}
			};
			return {
				uploadUlr:process.env.VUE_APP_BASE_URL,
				headers:{},
				columns: orderData.columns,//列
				options: orderData.options,//额外配置
				pagination:{//分页
					currentPage:1,
					pageSize:20
				},
				dataTotal: 0,//总条数
				//exportBut:[...orderData.exportBut],
				// operates: [...orderData.operates],
				gridData: [],//源数据
				quarterOptions: orderData.quarterOptions,
				addDialog: false,//弹窗
				searchLoading:false,//搜索
				resetLoading:false,//重置
				searchObj:{//搜索条件
					name:'',
					//date:[],
					quarter:'',
					year:''
				},
				loading:null,//遮罩层
				meetingTitle:'新增订货会',//弹窗标题
				dialogAdd:true,//弹窗是否新增
				fileList:[],
				importData:{},//商品上传
				meetingId:'',//订货会ID 暂用于修改
				meetingData: {
					name: '',
					daterange:[],//活动时间
					yearQuarter:'',
				},
				meetingForm: [{//表单配置
						type: "Input",
						label: "活动名称:",
						prop: "name",
						placeholder: "活动名称",
						style:'width:180px',
						// 表单验证
						rules: [{
							required: true,
							message: "请输入活动名称",
							trigger: "blur"
						}]
					},{
						type: "Select",
						label: "季度:",
						prop: "yearQuarter",
						clearable:true,
						placeholder: "季度",
						style:'width:180px',
						options:[],
						// 表单验证
						rules: [{
							required: true,
							message: "请输入季度",
							trigger: "change"
						}]
					}
					// ,{
					// 	type: "Daterange",
					// 	label: "起止时间:",
					// 	prop: "daterange",
					// 	pickerOptions:pickerBeginDateAfter,
					// 	rules: [{
					// 		type: 'array',
					// 		required: true,
					// 		message: '请选择日期',
					// 		trigger: 'change' ,
					// 	}],
					// 	change: res => {
					// 		console.log(res)
					// 	}
					// }
				],
				meetingHandle: [{//表单按钮配置
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['meetingForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.meetingHandle[0].loading = true;
								let form = {
									name:this.meetingData['name'],
									yearQuarter:this.meetingData['yearQuarter']
									//start:this.meetingData['daterange'][0],
									//end:this.meetingData['daterange'][1]
								}
								if(this.dialogAdd){
									orderData.post(this.api.operationMeeting,form).then(addRes=>{
										this.getMeetingList().then(res=>{
											let {data} = res;
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$message({
												message: addRes.message,
												type: 'success'
											});
											this.meetingHandle[0].loading = false;
											this.addDialog = false;
											this.loading.close();
											this.$refs['meetingForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.loading.close();
											this.meetingHandle[0].loading = false;
										})

									})
								}else{
									form['id'] = this.meetingId;
									orderData.putMeeting(this.api.updateMeeting,form).then(addRes=>{
										this.getMeetingList().then(res=>{
											let {data} = res
											this.gridData = data.records;
											this.dataTotal = data.total;
											this.$message({
												message: addRes.message,
												type: 'success'
											});
											this.meetingHandle[0].loading = false;
											this.loading.close();
											this.addDialog = false;
											this.$refs['meetingForm'].$refs['searchForm'].resetFields();
										}).catch(err=>{
											this.loading.close();
											this.meetingHandle[0].loading = false;
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
					label: "重置",
					type: "warning",
					handle: res => {
						this.$refs['meetingForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.addDialog = false;
					},
					hide: false,
				}],
				uploadQualityData:{},//工艺单上传
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
			var date = new Date();
			const year = date .getFullYear();
			const nextYear = date .getFullYear() + 1;
			this.meetingForm[1].options = [{
				label:`${year}春夏`,
				value:`${year}01`
			},{
				label:`${year}秋冬`,
				value:`${year}02`
			},{
				label:`${nextYear}春夏`,
				value:`${nextYear}01`
			},{
				label:`${nextYear}秋冬`,
				value:`${nextYear}02`
			}];
		},
		mounted(){
			this.getMeetingList().then(res=>{
				let {data} = res
				this.gridData = data.records;
				this.dataTotal = data.total;
				this.loading.close();
			}).catch(err=>{
				this.loading.close();
			})
		},
		methods: {
			getMeetingList(){
				this.loading = loading(document.getElementsByClassName('app-main')[0]);
				let data = {
					page:this.pagination['currentPage'],
					limit:this.pagination['pageSize'],
					...this.searchObj
				};
				return orderData.post(this.api.operationMeeting,data)
			},
			addMeeting() {
				if(this.$refs['meetingForm']){
					this.$refs['meetingForm'].$refs['searchForm'].resetFields();
				}
				this.meetingTitle = '新增订货会';
				this.dialogAdd = true;
				this.addDialog = true;
			},
			updateMeeting(row){
				this.meetingTitle = '修改订货会';
				this.meetingId = row.id;
				this.dialogAdd = false;
				this.addDialog = true;
				this.$nextTick(()=>{
					this.meetingData.name = row.name;
					this.meetingData.daterange = [row.start,row.end];
					this.meetingData.yearQuarter = row.yearQuarter;
				})
			},
			deleteMeeting(row){
				this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					center: true,
					type: 'warning'
				}).then(() => {
					orderData.deleteMeeting(this.api.operationMeeting,row.id).then(delRes=>{
						this.$set(row, 'delLoading', true)
						this.getMeetingList().then(res=>{
							let {data} = res;
							this.gridData = data.records;
							this.dataTotal = data.total;
							this.loading.close();
							this.$message({
								message: delRes.message,
								type: 'success'
							});
							this.$set(row, 'delLoading', false)
						}).catch(e=>{
							this.loading.close();
						})
					}).catch(err=>{
						this.$set(row, 'delLoading', false)
					})
				}).catch(() => {});
			},
			handleChangePage(value){
				//this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = value;
				this.getMeetingList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			handleSizeChange(value){
				//this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getMeetingList().then(res=>{
					let {data} = res;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				}).catch(err=>{
					this.loading.close();
				})
			},
			searchMeeting: throttle (function(value){
				if(value == 'reset'){
					Object.assign(this.$data.searchObj,this.$options.data().searchObj);
					this.resetLoading = true;
				}else{
					this.searchLoading = true;
				}
                this.pagination.currentPage = 1;
				this.getMeetingList().then(res=>{
					let {data} = res;
					this.$message({
						message: '查询成功',
						type: 'success'
					});
					this.loading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.resetLoading = false;
					this.searchLoading = false;
				}).catch(err=>{
					this.loading.close();
					this.resetLoading = false;
					this.searchLoading = false;
				})
			},2000),
			queryShop(row){
				console.log(row)
				this.$store.commit('transfer/SET_ORDERNAME',row.id)
				this.$router.push({
					path: '/orderShop/orderShop'
				}).catch(()=>{})
			},
			importClick(row){
				this.importData={
					sourceId:row.id,
					sourceType:1
				}
			},
			importNumClick(row){
				this.importData={
					sourceId:row.id,
				}
			},
			importShop(row){
				this.importData={
					sourceId:row.id,
				}
				console.log(this.importData)
			},
			importChange(response,file, fileList) {
				console.log(response)
				console.log(file)
				this.fileList = [];
				if(response.code===0){
					this.getMeetingList().then(res=>{
						let {data} = res
						this.$message.success('导入成功');
						this.loading.close();
						this.gridData = data.records;
						this.dataTotal = data.total;
					}).catch(err=>{
						this.loading.close();
						this.$message.error('获取列表失败，请手动刷新');
					})
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
			generateFab(row){
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				orderData.post(this.api.generatesource,{sourceId :row.id}).then(res=>{
					this.$message.success('生成面料需求单完毕')
					this.loading.close()
				}).catch(err=>{
					this.$message.error('生成失败')
					this.loading.close()
				})
			},
			generateAcc(row){
				console.log(row)
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.$store.commit('user/SET_HEADERCONTENT', true)
				orderData.post(this.api.generateIngredients,{sourceId :row.id}).then(res=>{
					this.$store.commit('user/SET_HEADERCONTENT', false)
					this.$message.success('生成辅料需求单完毕')
					this.loading.close()
				}).catch(err=>{
					this.$store.commit('user/SET_HEADERCONTENT', false)
					this.$message.error('生成失败')
					this.loading.close()
				})
			},
			generateFac(row){
				let {id} = row;
				let form = {
					sourceType :1,//订货会
					sourceId :id
				}
				console.log(form)
				
				this.loading = loading(document.getElementsByClassName('app-main')[0])
				orderData.get(this.api.generateBySource,form).then(res=>{
					this.$message.success('生成工厂订单完毕')
					this.loading.close()
				}).catch(err=>{
					this.$message.error('生成失败')
					this.loading.close()
				})
			},
			Bomput(row){
				console.log(row.id)
				this.$message.success('BOM成功')
				orderData.get(this.api.getOrderMeeting,{sourceId:row.id})
			},
			//上传工艺单
			uploadQuailty(row){
				//this.loading = loading(document.getElementsByClassName('app-main')[0])
				this.meetingId = row.id;
			},
			uploadQuailtySucc(response,file, fileList){
				setTimeout(()=>{
					if(response.code==0){
						let imgArr = []
						fileList.forEach(item=>{
							if(item.response){
								imgArr.push(item.response.data.fileHttpPath)
							}
						})
						let id = this.meetingId;
						let obj = {
							'orderMeetingId':id,
							'filePaths':imgArr
						}
						console.log(obj)
						this.uploadTec(obj);
					}else{
						//this.loading.close()
						this.$message.error(response.message)
					}
				},500)
			},
			uploadTec: throttle (function(obj){
				orderData.post(this.api.uploadOrderAndFile,obj).then(res=>{
					console.log(res)
					this.$message.success('上传成功')
					//this.loading.close()
				}).catch(err=>{
					//this.loading.close()
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
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.uploadQuailty .el-upload{
		width: 100%;
		text-align: left;
		// position: absolute;
		// top: 60%;
	}
	.meetingImport{
		/deep/.el-upload-list__item-name{
			width: 80px;
		}
	}
</style>

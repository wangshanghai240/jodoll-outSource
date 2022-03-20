<!--
 * @FileDescription: 流程信息
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="processInfo"
		:pagination="pagination" :dataTotal="dataTotal" :expandAll="expandAll" :expandArr="expandArr" @handleChangePage="handleChangePage"
		@handleSizeChange="handleSizeChange" @expandChange="expandChange" @handleSelectionChange="handleSelectionChange">
		<!-- 表外 -->
		<template v-slot:content_context>
			<div class="categoryUpload">

			</div>
			<div class="searchBody">
				<el-input
					v-model="searchForm.name"
					:size="size"
					class="marginTop16"
					style="width: 145px;margin:0 10px;"
					placeholder="名称 搜索"/>
				<el-select v-model="searchForm.status" placeholder="请选择" clearable :size="size"
				  class="marginTop16"style="width: 100px;margin-right: 10px;">
				    <el-option
				      v-for="item in StateOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="searchLoading"
				  class="marginTop16"@click="searchPro">
					搜索
				</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading"
				  class="marginTop16"@click="searchPro('reset')">
					重置
				</el-button>
			</div>
			<!-- 流程新增 -->
			<jod-dragDialog v-model="updateProInfo" title="新增流程" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="closeDio('proInfoForm')">
				<jod-formSearch labelWidth="120px" ref="proInfoForm" :searchData="proInfoData" :searchForm="proInfoForm"
				 :searchHandle="proInfoHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 节点新增 -->
			<jod-dragDialog v-model="updateNodesDio" :title="NodesDioTitle" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="closeDio('nodesForm')">
				<jod-formSearch labelWidth="120px" ref="nodesForm" :searchData="nodesData" :searchForm="nodesForm"
				 :searchHandle="nodesHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 节点测算 -->
			<jod-dragDialog v-model="calNodesDio" title="节点测算">
				<!-- <jod-formSearch labelWidth="120px" ref="calNodesForm" :searchData="calNodesData" :searchForm="calNodesForm"
				 :searchHandle="calNodesHandle">
				</jod-formSearch> -->
				<calNodes v-model="proId" v-if="calNodesDio"></calNodes>
			</jod-dragDialog>
		</template>

		<!-- 表头 -->
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="updateProInfo = true,isUpdate = false" v-has:add>流程新增</el-button>
		</template>
		<!-- 表主体 -->
		<template slot="status" slot-scope="{row,$index}">
			<span>{{row.status?statusOptions[row.status].label:row.status}}</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<div style="display: flex;margin: 5px 0;justify-content: center;">
				<el-button type="success" :size="size" plain round @click="calNodes(row)" v-has:figure>测算</el-button>
				<el-button type="primary" :size="size" plain round @click="addNodes(row)" v-has:nodeAdd>节点新增</el-button>
				<el-button type="success" plain class="marginAuto0" :size="size" @click="updatePro(row)" v-has:update>修改</el-button>
				<el-button type="danger" class="marginAuto0" :size="size" :loading="row.delLoading" @click="delPro(row)" v-has:del>删除</el-button>
			</div>
		</template>

		<!-- 展开 -->
		<template slot="expandForm" slot-scope="{row,$index}">
			<jod-tableList class="expandTable" :dataSource="row.expandData?row.expandData:[]" :columns="expandColumns"
				:options="row.expandData&&row.expandData.length!==0?expandOptions:{tHeight:'120px',headerInput:true,headerWidth: '240'}">
				<!-- 表头 -->
				<template v-slot:header_input>
					<span>操作</span>
				</template>
				<template slot="frontNode" slot-scope="scope">
					<div v-for="item in scope.row.frontNodes">
						<div style="margin-bottom: 10px;">{{row.nodeOptions | traList(item)}}</div>
					</div>
				</template>
				<template slot="behindNode" slot-scope="scope">
					<div v-for="item in scope.row.behindNodes">
						<div style="margin-bottom: 10px;">{{row.nodeOptions | traList(item)}}</div>
					</div>
				</template>
				<!-- 表主体 -->
				<template slot="operate" slot-scope="scope">
					<el-button type="primary" :size="size" :loading="scope.row.nodesLoading" plain round @click="expandEdit(scope.row,row)">
						编辑
					</el-button>
					<el-button type="danger" :size="size" plain round :loading="scope.row.delLoading" @click="delNodes(row,scope)">
						删除
					</el-button>
				</template>
			</jod-tableList>
		</template>
	</jod-tableList>
</template>

<script>
	import processInfo from '@/api/processNode/processInfo.js'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	import { throttle } from '@/utils/validate'
	import nodes from './components/calNodes.vue'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'calNodes':nodes,
		},
		filters: {
			traList:(value,item)=>{
				if(value){
					let newStr = '';
					value.forEach(v=>{
						if(v.value==item){
							newStr = v.label
						}
					})
					return newStr
				}
			}
		},
		data(){
			return{
				that: this,
				domLoading:null,
				gridData:[],//源数据
				columns: processInfo.columns,
				options: processInfo.options,
				statusOptions: processInfo.StateOptions,
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
				expandAll:null,//展开项
				expandArr:[],
				//头搜索
				searchLoading:false,
				searchForm:{
					name:'',
					status:''
				},
				StateOptions:processInfo.StateOptions,
				resetLoading:false,//重置
				updateProInfo:false,
				proId:null,//流程ID
				//新增
				//addAodesLoading:false,
				proInfoData:processInfo.proInfoData,
				proInfoForm:processInfo.proInfoForm,
				proInfoHandle:[
					{
						label: "确定",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['proInfoForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									console.log(this.proInfoData)
									let {processId,...form} = {...this.proInfoData};
									form['id'] = processId;
									console.log(form)
									this.proInfoHandle[0].loading = true;
									if(this.isUpdate){
										processInfo.put(this.api.infoUpdate,this.proInfoData).then(res=>{
											this.$message.success(res.message)
											this.getInfoList(this.searchForm).then(res=>{
												this.proInfoHandle[0].loading = false;
												let {data} = res;
												this.gridData = data.records;
												this.dataTotal = data.total;
												this.updateProInfo = false;
											}).catch(err=>{
												this.updateProInfo = false;
											});
										}).catch(err=>{
											this.proInfoHandle[0].loading = false;
										});
									}else{
										this.getInfoList(this.proInfoData,true).then(res=>{
											this.getInfoList(this.searchForm).then(res=>{
												this.proInfoHandle[0].loading = false;
												this.$message.success('新增成功')
												let {data} = res;
												this.gridData = data.records;
												this.dataTotal = data.total;
												this.updateProInfo = false;
											}).catch(err=>{
												this.updateProInfo = false;
											});
										}).catch(err=>{
											this.proInfoHandle[0].loading = false;
										});
									}

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
							this.updateProInfo = false;
						},
						hide: false,
					}
				],
				//修改
				nodesId:null,
				isUpdate:false,
				isNodeUpdate:false,
				proInfoRow:null,//行
				//展开
				expandColumns:processInfo.expandColumns,
				expandOptions:processInfo.expandOptions,
				updateNodesDio:false,
				NodesDioTitle:'新增节点',
				nodesData:processInfo.nodesData,
				nodesForm:processInfo.nodesForm,
				nodesHandle:[
					{
						label: "确定",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['nodesForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									this.nodesHandle[0].loading = true;
									if(!this.proInfoRow&&!this.nodesId){
										this.$message.error('数据丢失');
										return
									}

									if(this.isNodeUpdate){
										let form ={
											processId:this.proInfoRow.id,
											nodeId:this.nodesId,
											...this.nodesData
										}
										console.log(form)
										processInfo.handleForm(form).then(obj=>{
											processInfo.put(this.api.update,obj).then(res=>{
												processInfo.get(this.api.getProNodes,{processId:this.proInfoRow.id}).then(res=>{
													let {data} = res;
													processInfo.handleNodes(data).then(list=>{
														this.$set(this.proInfoRow, 'nodeOptions' , list);
														this.$set(this.proInfoRow, 'expandData', data)
														this.$message.success('节点修改成功')
														this.updateNodesDio = false;
														this.nodesHandle[0].loading = false;
													})


												}).catch(err=>{
													this.nodesHandle[0].loading = false;
												})
											}).catch(err=>{
												this.nodesHandle[0].loading = false;
											})
										})

									}else{//新增
										//processInfo.post(this.api.processNode,)

										let form ={
											processId:this.proInfoRow.id,
											...this.nodesData
										}
										console.log(form)
										processInfo.handleForm(form).then(obj=>{
											processInfo.post(this.api.processNode,obj).then(res=>{
												processInfo.get(this.api.getProNodes,{processId:this.proInfoRow.id}).then(res=>{
													let {data} = res;
													processInfo.handleNodes(data).then(list=>{
														this.$set(this.proInfoRow, 'nodeOptions' , list);
														this.$set(this.proInfoRow, 'expandData', data)
														this.$message.success('节点添加成功')
														this.updateNodesDio = false;
														this.nodesHandle[0].loading = false;
													})

												}).catch(err=>{
													this.nodesHandle[0].loading = false;
												})
											}).catch(err=>{
												this.nodesHandle[0].loading = false;
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
					},{
						label: "取消",
						type: "info",
						handle: res => {
							this.updateNodesDio = false;
						},
						hide: false,
					}
				],
				//节点测算
				calNodesDio:false,
				calNodesData:processInfo.calNodesData,
				calNodesForm:processInfo.calNodesForm,
				calNodesHandle:[
					{
						label: "确定",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['calNodesForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									let form = {processId :this.proId,...this.calNodesData};
									console.log(form)
									processInfo.get(this.api.cal,form).then(res=>{

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
							this.calNodesDio = false;
						},
						hide: false,
					}
				]
			}
		},
		created() {
			this.domLoading = loading(document.getElementsByClassName('app-main')[0])
		},
		mounted() {
			this.getInfoList(this.searchForm).then(res=>{
				let {data} = res;
				this.domLoading.close();
				this.gridData = data.records;
				this.dataTotal = data.total;
			}).catch(err=>{
				this.domLoading.close();
			});
		},
		methods:{
			getInfoList(value,isPage){
				let {currentPage:page,pageSize:limit} = {...this.pagination}
				let form = {}
				if(isPage) form = {...value}
				else form = {page,limit,...value}
				console.log(form)
				this.expandAll = false;
				this.expandArr = [];
				return processInfo.post(this.api.processInfo,form)
			},
			handleChangePage(current){
				this.domLoading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = current;
				this.getInfoList(this.searchForm).then(res=>{
					let {data} = res;
					this.domLoading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err=>{
					this.domLoading.close();
				});
			},
			handleSizeChange(page){
				this.domLoading = loading(document.getElementsByClassName('app-main')[0])
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = page;
				this.getInfoList(this.searchForm).then(res=>{
					let {data} = res;
					this.domLoading.close();
					this.gridData = data.records;
					this.dataTotal = data.total;
				}).catch(err=>{
					this.domLoading.close();
				});
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			},
			searchPro: throttle (function(value){
				if(value == 'reset'){
					Object.assign(this.$data.searchForm,this.$options.data().searchForm);
					this.resetLoading = true;
				}else{
					this.searchLoading = true;
				}
                this.pagination['currentPage'] = 1;
				this.getInfoList(this.searchForm).then(res=>{
					let {data} = res;
					this.$message.success('查询成功')
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.resetLoading = false;
					this.searchLoading = false;
				}).catch(err=>{
					this.resetLoading = false;
					this.searchLoading = false;
				});
			},2000),
			closeDio(value){
				this.$refs[value].$refs['searchForm'].resetFields();
			},
			updatePro(row){
				console.log(row)
				this.isUpdate = true;
				this.updateProInfo = true;
				this.$nextTick(()=>{
					this.proInfoData['code'] = row.code;
					this.proInfoData['name'] = row.name;
					this.proInfoData['status'] = row.status;
					this.proInfoData['id'] = row.id;
				})
			},
			delPro(row){
				console.log(row)
				this.$set(row,'delLoading',true);
				processInfo.del(this.api.processInfo,row.id).then(res=>{
					this.getInfoList(this.searchForm).then(res=>{
						let {data} = res;
						this.$message.success('删除成功')
						this.$set(row,'delLoading',false);
						this.gridData = data.records;
						this.dataTotal = data.total;
					})
				}).catch(err=>{
					this.$set(row,'delLoading',false);
				})
			},
			expandChange(row){
				if(row.id&&!row.expandData){
					processInfo.get(this.api.getProNodes,{processId:row.id}).then(res=>{
						let {data} = res;
						processInfo.handleNodes(data).then(list=>{
							this.$set(row, 'nodeOptions' , list);
							this.$set(row, 'expandData', data);
						})
					})
				}
			},
			addNodes(row){
				console.log(row)
				//this.addAodesLoading = true;
				this.proInfoRow = row;
				this.isNodeUpdate = false;
				this.NodesDioTitle = '新增节点';
				if(row.expandData&&row.expandData.length!==0){
					processInfo.handleNodes(row.expandData).then(res=>{
						this.nodesForm[0].options = res;
						this.nodesForm[1].options = res;
						this.updateNodesDio = true;
						//this.addAodesLoading = false;
					})
					// this.nodesForm[0].options
				}else{
					this.nodesForm[0].options = [];
					this.nodesForm[1].options = [];
					this.updateNodesDio = true;
					//this.addAodesLoading = false;
				}
			},
			expandEdit(row,value){
				console.log(row)
				this.NodesDioTitle = '节点编辑';
				this.$set(row,'nodesLoading',true)
				this.nodesId = row.nodeId;
				this.proInfoRow = value;
				if(value.expandData.length!==0){
					processInfo.handleNodes(value.expandData).then(res=>{
						this.nodesForm[0].options = res;
						this.nodesForm[1].options = res;
						this.isNodeUpdate = true;
						processInfo.reverseForm(row).then(list=>{
							this.$set(row,'nodesLoading',false)
							this.updateNodesDio = true;
							this.$nextTick(()=>{
								let {frontNode,behindNode,nodeCode,nodeName,time} = {...list};

								this.nodesData = {frontNode,behindNode,nodeCode,nodeName,time};
							})
						})
					}).catch(err=>{
						this.$set(row,'nodesLoading',false)
					})
				}
			},
			delNodes(row,scope){
				console.log(row)
				console.log(scope)
				this.$set(scope.row,'delLoading',true)
				let form = {
					processId :scope.row.processId,
					nodeId :scope.row.nodeId
				}
				processInfo.del(this.api.deleteNodes,form).then(res=>{
					this.$message.success('删除成功')
					this.$set(scope.row,'delLoading',false)
					row.expandData.splice(scope.index,1)
					// processInfo.get(this.api.getProNodes,{processId:row.processId}).then(res=>{
					// 	let {data} = res;
					// 	this.$set(this.proInfoRow, 'expandData', data)
					// 	this.$message.success('删除成功')
					// 	this.$set(row,'delLoading',false)
					// }).catch(err=>{
					// 	this.$set(row,'delLoading',false)
					// })
				}).catch(e=>{
					this.$message.success('删除失败')
					this.$set(scope.row,'delLoading',false)
				})
			},
			calNodes(row){
				console.log(row);
				this.proId = row.id;
				this.calNodesDio = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>

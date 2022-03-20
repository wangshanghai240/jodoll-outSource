<!--
 * @FileDescription: 跟踪日志
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns | filterColumns(this.routers)" :options="options" class="traceLog">
		<template slot="model" slot-scope="{row,$index}">
			<span>{{ModelOptions[row.model-1].label}}</span>
		</template> 
		
		<template slot="stateNode" slot-scope="{row,$index}">
			<span>{{row.stateNode?StateOptions[row.stateNode - 1].label:''}}</span>
		</template>
		
		<template slot="fileUpload" slot-scope="{row,$index}">
			<el-link :type="row.fileUpload?'primary':'info'" :disabled="!row.fileUpload"
			  @click="checkPicture(row.fileUpload)">查看</el-link>
			<!-- <span @click="checkPicture(row.fileUpload)"></span> -->
		</template>
		
		<template v-slot:content_context>
			<div> 
				<el-button v-if="addBt" type="success" plain style="width: 95px;margin-bottom: 12px;" :loading="addLoading"
				 :size="size" @click="addTraceLog">新增</el-button>
			</div>
			<!-- <div class="searchBody">
				<el-select v-model="searchValue" placeholder="请选择前置条件" :size="size" clearable style="margin-right: 10px;">
				    <el-option
				      v-for="item in searchOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<transition name="fade" mode="out-in">
					<el-input
						v-if="searchValue!=='2'&&searchValue" 
						key="searchName"
						clearable
						v-model="searchName" 
						:size="size" 
						style="width: 145px;margin-right: 10px;" 
						placeholder="前置条件搜索"/>
					<el-select v-if="searchValue=='2'" key="searchModel" v-model="searchModel" placeholder="模块" :size="size" clearable style="margin-right: 10px;width: 80px;">
					    <el-option
					      v-for="item in ModelOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</transition>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="searchLoading" @click="searchTrace">搜索</el-button>
				<el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading">重置</el-button>
			</div> -->
			<!-- 图片查看 -->
			<jod-dragDialog v-model.sync="dialogVisible" class="tableDialog" :modal="false">
				<img width="100%" :src="dialogImageUrl" alt="">
			</jod-dragDialog>
			<!-- 新增 -->
			<jod-dragDialog v-model="addDialog" class="detailLog" title="新增跟踪记录" :modal="false" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="closeDemandForm">
				<jod-formSearch labelWidth="120px" ref="tracLogForm" :searchData="tracLogData"
				 :searchForm="tracLogForm"
				 :searchHandle="tracLogHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 跟踪详情 -->
			<jod-dragDialog v-model="detailDialog" :modal="false" :dialogStyle="diaStyle" class="detailLog">
				<template v-slot:title>
					<div style="font-size: 20px;font-weight: bold;display: flex;justify-content: center">跟踪详情</div>
				</template>
				<div v-for="detail in traceDetail" :key="detail.value">
					<el-row class="marginTop10">
						<el-col :span="9" :offset="3">
							<span style="font-weight: bold;font-size: 16px;">{{detail.label}}</span>
						</el-col>
						<el-col :span="12">
							<span v-if="detail.value!=='dqzt'&&detail.value!=='model'">{{detailData[detail.value]}}</span>
							<span v-else-if="detail.value=='dqzt'&&detailData.dqzt">
								<el-select v-model="putdqzt" style="width: 90px;" :disabled="disabled" placeholder="当前状态" :size="size">
								    <el-option
								      v-for="item in dqzt"
								      :key="item.value"
								      :label="item.label"
								      :value="item.value">
								    </el-option>
								</el-select>
								
								<transition name="fade" mode="out-in">
									<el-link v-if="disabled" key="edit" class="marginLeft10" icon="el-icon-edit" 
										@click="disabled = false">修改</el-link>
									<el-link v-if="!disabled" key="save" class="marginLeft10" :icon="saveIcon" :disabled="saveDisabled"
										@click="save">确定</el-link>
								</transition>
							</span>
							<span v-else-if="detail.value=='model'&&detailData.model">{{ModelOptions[detailData.model-1].label}}</span>
							<span v-else>数据空值</span>
						</el-col>
					</el-row>
				</div>
				<div>
					<!-- <el-row class="marginTop10">
						<el-col :span="9" :offset="3">
							<span style="font-weight: bold;font-size: 16px">品控记录</span>
						</el-col>
						<el-col :span="12">
							<el-link icon="el-icon-s-promotion">查看</el-link>
						</el-col>
					</el-row> -->
				</div>
			</jod-dragDialog>
		</template>
		
		<template v-slot:header_input>
			<span>操作</span>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="info" plain :size="size" :loading="row.detailLoading" @click="detail(row)">详情</el-button>
		</template>
		
	</jod-tableList>
	
	
</template>

<script>
	import traceLog from '@/api/controller/traceLog.js'
	import orderShop from '@/api/orderShop/orderShop.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	export default {
		name:'traceLogList',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props: {
			value:{
				// type: String
				type: Object
			},
			source:{
				type: String
			}
		},
		filters:{
			filterColumns:function(val,routers){
				console.log('-22-',val)
				let list = [...val];
				if(routers !== '0'){
					list = val.slice(0,val.length-1);
				}
				console.log('-11-',list)
				return list
			}
		},
		watch:{
			value(v){
				console.log('-------value',v)
				if(this.id!==v.id){
					// this.gridData = [];
					this.searchValue = '';
					this.searchName = '';
					this.searchModel = '';
				}
				this.id = v.id;
				this.routers = v.routers;
				//this.getAllList();
			}
		},
		data(){
			return {
				columns: traceLog.columns,//列
				options: traceLog.options,//配置
				// searchOptions: traceLog.searchOptions,
				ModelOptions: traceLog.ModelOptions,
				diaStyle : {
					width: '33',
					widthType: '%'
				},
				addLoading:false,//新增按钮加载状态
				StateOptions:[{label:'已开裁'},{label:'已上线'},{label:'已下线'},{label:'已到料'}],
				id:this.value.id,
				routers:this.value.routers,
				dialogVisible:false,//图片查看
				dialogImageUrl:'',//图片地址
				detailId:'',//详情id
				gridData: [],
				loading: null,
				searchData:['name','ghsmc','model','createBy'],
				searchValue:'',
				searchName:'',
				searchModel:'',
				// searchLoading:false,//查询弹窗
				detailDialog:false,//详情弹窗
				detailData:{},//详情
				traceDetail:traceLog.traceDetail,
				dqzt:traceLog.dqzt,
				ModelOptions:traceLog.ModelOptions,
				putdqzt:'',//修改当前状态
				saveIcon:'el-icon-edit',
				saveDisabled:false,
				disabled:true,
				url:null,
				//新增
				traceLogModel:null,
				addBt:false,//新增按钮
				addDialog:false,
				tracLogData:traceLog.tracLogData,
				tracLogForm:JSON.parse(JSON.stringify(traceLog.tracLogForm)),
				tracLogHandle:[{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['tracLogForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								console.log(this.tracLogData);
								if(this.tracLogData.fileUpload && this.tracLogData.fileUpload[0].response){
									let fileUpload = this.tracLogData.fileUpload[0].response.data.fileHttpPath
									this.tracLogData.fileUpload = fileUpload;
								}else{
									this.tracLogData.fileUpload = null ;
								}
								this.tracLogData.model= this.traceLogModel;
								this.tracLogData.modelId = this.tracLogData.id;
								
								traceLog.post(this.api.getTraceLog,this.tracLogData).then(res=>{
									let params = {
										modelId:this.id,
										model:this.traceLogModel
									}
									this.getTracelog(this.api.traceLogModel,params).then(res=>{
										this.gridData = res;
										this.addDialog = false
										this.$message.success('查询成功')
									}).catch(err=>{
										this.addDialog = false
									})
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
						this.addDialog = false
					},
					hide: false,
				}]
			}
		},
		created() {
			console.log('------',this.value)
			switch (this.source){
				case 'fabric':
					this.tracLogData['model']=1;
					this.traceLogModel = 1;
					this.tracLogData['modelId']=this.id;
					this.addBt = true;
					break;
				case 'ingre':
					this.tracLogData['model']=2;
					this.traceLogModel = 2;
					this.tracLogData['modelId']=this.id;
					this.addBt = true;
					break;
				case 'factory':
					this.tracLogData['model']=3;
					this.traceLogModel = 3;
					this.tracLogData['modelId']=this.id;
					this.addBt = true;
					break;
				case 'fabricPurchase':
					this.tracLogData['model']=4;
					this.traceLogModel = 4;
					this.tracLogData['modelId']=this.id;
					this.addBt = true;
					break;
				case 'ingrePurchase':
					this.tracLogData['model']=5;
					this.traceLogModel = 5;
					this.tracLogData['modelId']=this.id;
					this.addBt = true;
					break;
				 default:
					break;
			}
		},
		mounted() {
			console.log(this.source)
			if(this.source){
				this.getModel();
			}else{
				this.getAllList();
			}
			
		},
		methods:{
			getModel(){
				this.loading = loading(document.getElementsByClassName('traceLog')[0])
				let params = {
					// id:this.id,
					// model:this.traceLogModel
					modelId:this.id,
					name:'',
					ghsmc:'',
					model:'',
					createBy:''
				}
				this.getTracelog(this.api.traceLogModel,params).then(res=>{
					this.gridData = res;
					this.loading.close();
					this.$message.success('查询成功')
				}).catch(err=>{
					this.loading.close();
				})
			},
			getAllList(){
				this.loading = loading(document.getElementsByClassName('traceLog')[0])
				let params = {
					goodsId : this.id,
					name:'',
					ghsmc:'',
					model:'',
					createBy:''
				}
				this.getTracelog(this.api.getTraceLog,params).then(res=>{
					this.gridData = res;
					this.loading.close();
					this.$message({
						message: '查询成功',
						type: 'success'
					});
				}).catch(err=>{
					this.loading.close();
				});
			},
			getTracelog(url,params){
				return traceLog.getTracelog(url,params)
			},
			handleChangePage(page){
				console.log(page)
			},
			handleSizeChange(limit){
				console.log(limit)
			},
			// searchTrace(bol){
			// 	if(!this.searchValue) {
			// 		this.getAllList();
			// 		return
			// 	};
			// 	if(!bol) this.searchLoading = true;
			// 	let field = this.searchData[this.searchValue];
			// 	let params = {goodsId : this.id}
			// 	if(this.searchValue=='2'){
			// 		this.$set(params,field,this.searchModel)
			// 		if(!this.searchModel){
			// 			this.searchLoading = false;
			// 			this.$message({
			// 				message: '请选择模块',
			// 				type: 'warning'
			// 			});
			// 			return
			// 		}
			// 	}else{
			// 		this.$set(params,field,this.searchName)
			// 		if(!this.searchName){
			// 			this.searchLoading = false;
			// 			this.$message({
			// 				message: '请输入查询名称',
			// 				type: 'warning'
			// 			});
			// 			return
			// 		}
			// 	}
			// 	let url = this.api.getTraceLog;
			// 	if(this.source){
			// 		url = this.api.traceLogModel
			// 		params = {modelId : this.id}
			// 	}
			// 	this.getTracelog(url,params).then(res=>{
			// 		this.gridData = res;
			// 		console.log(res)
			// 		if(bol){
			// 			this.saveIcon = 'el-icon-edit';
			// 			this.saveDisabled = false;
			// 		}else{
			// 			this.searchLoading = false;
			// 		}
			// 		this.$message({
			// 			message: '查询成功',
			// 			type: 'success'
			// 		});
			// 		//this.dataTotal = res.length;
			// 	}).catch(err=>{
			// 		this.searchLoading = false;
			// 	});
			// },
			detail(row){
				console.log(row)
				this.detailId = row.goodsId;
				this.traceLogModel = row.model
				let params ={
					id : row.id
				}
				this.$set(row, 'detailLoading', true)
				traceLog.getDetail(this.api.detailTraceLog,params).then(res=>{
					console.log(res)
					let {dqzt} = res;
					this.putdqzt = dqzt + '';
					this.detailData = res;
					//this.dataTotal = res.length;
					this.$set(row, 'detailLoading', false)
				}).catch(err=>{
					this.$set(row, 'detailLoading', false)
				});
				this.detailDialog = true;
			},
			save(){
				let data = {
					goodsId : this.detailId,
					dqzt : Number(this.putdqzt),
					model : this.traceLogModel
				}
				console.log(data)
				this.saveIcon = 'el-icon-loading';
				this.saveDisabled = true;
				this.$store.commit('user/SET_HEADERCONTENT', true)
				traceLog.putFabric(this.api.getTraceLog,data).then(res=>{
					// this.searchTrace('true');
					this.disabled = true;
					this.$message.success('修改成功')
					this.$store.commit('user/SET_HEADERCONTENT', false)
					console.log(res)
				}).catch(err=>{
					this.saveIcon = 'el-icon-edit';
					this.$store.commit('user/SET_HEADERCONTENT', false)
					this.saveDisabled = false;
				})
			},
			closeDemandForm(){
				setTimeout(()=>{
					this.$refs.['tracLogForm'].$refs['searchForm'].resetFields();
					this.tracLogForm.splice(2,this.tracLogForm.length);
				},300)
				
			},
			//新增日志 节点数据处理
			addListHandler(list){
				return new Promise((res,rej)=>{
					let op = [{
						value:1,
						label:'已开裁'
					},{ 
						value:2,
						label:'已上线'
					},{
						value:3,
						label:'已下线',
					},{
						value:4,
						label:'已到料'
					}];
					let {status} = this.value;
					if(3<status&&status<8){
						if(list.length!==0){
							list.forEach((item,index)=>{
								let {stateNode} = item;
								let pp = op.find(oo=>{return oo.value==stateNode});
								if(pp){
									pp['disabled'] = true;
								}
								if(index==list.length-1){
									res(op)
								}
							})
						}else{
							res(op)
						}
					}else{
						res([])
					}
				})
			},
			async addTraceLog() {
				this.addLoading = true;
				let options = await this.addListHandler(this.gridData);
				let imageUp = {
					type: "fileUpload",
					label: "图片上传:",
					headers: {'Authorization':this.token},
					prop: "fileUpload",
					upload: process.env.VUE_APP_BASE_URL+this.api.uploadQualit,
				}
				let stateNodes = {
					type: "Select",
					label: "节点状态:",
					prop: "stateNode",
					style:"width:200px;",
					options:options,
					clearable:true,
					placeholder: "请选择节点状态",
					change:row=>'',
				}
				let describe = {
					type: "Text",
					label: "进度描述:",
					prop: "describe",
					style:'width:200px;height:200px;border-color:#DCDFE6;color:#606266;font-size:14px;',
					clearable:true,
					rules: [{
						required: true,
						message: "请输入进度描述",
						trigger: "blur"
					}]
				}
				// this.tracLogForm.push(status);
				console.log('---------')
				console.log(this.routers)
				if(this.routers == '0'){
					this.tracLogForm.push(stateNodes);
				}
				this.tracLogForm.push(imageUp);
				this.tracLogForm.push(describe);
				this.tracLogData = this.value;
				this.$nextTick(()=>{
					this.addLoading = false;
					this.addDialog = true;
				})
			},
			checkPicture(picture){
				this.dialogImageUrl = picture;
				this.dialogVisible = true
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>

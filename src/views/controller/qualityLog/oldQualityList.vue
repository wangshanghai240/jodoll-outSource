<!--
 * @FileDescription: 品控日志
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" class="qualityList">
		<template slot="isPass" slot-scope="{row,$index}">
			<span>{{isPassOptions[row.isPass?1:0].label}}</span>
		</template>
		<template slot="checkModule" slot-scope="{row,$index}">
			<span>{{row.checkModule&&row.checkModule!==0?ModelOptions[row.checkModule-1].label:''}}</span>
		</template>
		
		<template v-slot:content_context>
			<div class="categoryUpload">
				<el-button type="success" plain style="width: 95px;" :size="size" @click="addQuality()">新增</el-button>
			</div>
			<div class="searchBody">
				<el-select v-model="searchValue" placeholder="前置条件" :size="size" clearable style="width: 105px;margin-right: 10px;">
				    <el-option
				      v-for="item in searchOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<transition name="fade" mode="out-in">
					<el-input
						v-if="searchValue!==3&&searchValue||searchValue==0" 
						key="searchName"
						clearable
						v-model="searchName" 
						:size="size" 
						style="width: 145px;margin-right: 10px;" 
						placeholder="前置条件搜索"/>
					<el-select v-if="searchValue==3" key="searchModel" v-model="searchModel" placeholder="状态" :size="size" clearable style="margin-right: 10px;width: 145px;">
					    <el-option
					      v-for="item in isPassOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					</el-select>
				</transition>
				<el-button type="primary" style="width: 95px;" :size="size" :loading="searchLoading" @click="searchTrace">搜索</el-button>
				<!-- <el-button type="warning" style="width: 95px;" :size="size" :loading="resetLoading">重置</el-button> -->
			</div>
			<!-- 新增 -->
			<jod-dragDialog v-model="addDialog" class="detailLog" :top="'20px'" :modal="false" :dialogStyle="{width: '700',widthType: 'px'}"
				@closeDio="closeDemandForm">
				<template v-slot:title>
					<div style="font-size: 20px;font-weight: bold;display: flex;justify-content: center">新增品控记录</div>
				</template>
				<jod-formSearch labelWidth="120px" ref="qualityLogForm" :searchData="qualityLogData" :searchForm="qualityLogForm"
				 :searchHandle="qualityLogHandle" :labelTitle="'品控记录'" :context="true">
				 <template v-slot:form_context>
					 <div v-for="item in qualityOptions" style="width: 500px;">
						 <div style="display: flex;justify-content: space-between;margin-top: 10px;">
							 <div class="qualityLabel">
							 	{{ item.label }}
							 </div>
							 <el-radio-group v-model="item.isPass" size="mini" style="margin: auto 0;" @change="qualityChange($event,item)" :fill="item.fill">
								 <el-radio-button :label="true">通过</el-radio-button>
								 <el-radio-button :label="false">拒绝</el-radio-button>
							 </el-radio-group>
						 </div>
						 <div style="display: flex;justify-content: space-between;margin-top: 10px;height: 71px;">
							 <el-input
							   placeholder="备注"
							   size="mini"
							   style="width: 300px;height: 35px;"
							   v-model="item.remark"
							   clearable>
							 </el-input>
							 <div style="width: 110px;">
								 <el-upload
								   class="upload-demo"
								   :action="url+api.uploadQualit"
								   :headers="headers"
								   :on-success="handleChange"
								   :before-upload="beforeUpload"
								   :limit="1"
								   :on-exceed="handleExceed"
								   :file-list="fileList">
								   <el-button size="mini" type="primary" @click="uploadId(item)">上传</el-button>
								   <!-- :action="url+this.api.uploadQualit" -->
								 </el-upload>
							 </div>
						 </div>
					 </div>
				 </template>
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 详情 -->
			<jod-dragDialog v-model="detailDialog" :modal="false" :dialogStyle="diaStyle" class="detailLog" @closeDio="closeDio">
				<template v-slot:title>
					<div style="font-size: 20px;font-weight: bold;display: flex;justify-content: center">品控详情</div>
				</template>
				<el-row justify="center">
				  <el-col :span="6"><div style="text-align: center;font-weight: bold;font-size: 18px;">描述</div></el-col>
				  <el-col :span="6"><div style="text-align: center;font-weight: bold;font-size: 18px;">是否通过</div></el-col>
				  <el-col :span="6"><div style="text-align: center;font-weight: bold;font-size: 18px;">备注</div></el-col>
				  <el-col :span="6"><div style="text-align: center;font-weight: bold;font-size: 18px;">图片</div></el-col>
				</el-row>
				<template v-if="detailData">
					<div v-for="item in detailData['list']">
						<el-row justify="center" style="margin-top: 10px;">
							<el-col :span="6"><div style="text-align: center;">{{item.description}}</div></el-col>
							<el-col :span="6">
								<div style="text-align: center;">
									<i :class="item.isPass?'el-icon-check':'el-icon-close'" style="font-size: 18px;"></i>
								</div>
							</el-col>
							<el-col :span="6"><div style="text-align: center;">{{item.remark}}</div></el-col>
							<el-col :span="6" style="text-align: center;">
								<el-link target="_blank" v-if="item.image" @click="seeImage(item.image)">查看</el-link>
								<div v-else>暂无</div>
							</el-col>
						</el-row>
					</div>
					
					<el-row justify="center" class="marginTop10">
					  <el-col :span="12"><div style="text-align: center;font-weight: bold;font-size: 18px;">状态变更:</div></el-col>
					  <el-col :span="12"><div style="text-align: center;font-weight: bold;font-size: 18px;">{{detailData['statusStr']?detailData['statusStr']:'无'}}</div></el-col>
					</el-row>
					
					<div style="display: flex;justify-content: space-between;" class="marginTop10">
						<transition name="fade" mode="out-in">
							<el-select 
							 v-if="disabled"
							 v-model="addValue"
							 style="width: 250px!important;margin-left: 30px;"
							 multiple
							 filterable
							 allow-create
							 default-first-option
							 placeholder="请新建要点">
							</el-select>
							<div v-if="!disabled" style="background: #e5e9f2;width: 250px;height: 36px;margin-left: 30px; border-radius: 4px;"></div>
						</transition>
						
						<transition name="fade" mode="out-in">
							<el-link v-if="!disabled" key="edit" class="marginRight76" style="min-width: 75px;" icon="el-icon-edit"
								@click="disabled = true">要点新增</el-link>
							<el-link v-if="disabled" key="save" class="marginRight76" style="min-width: 75px;" :icon="saveIcon" :disabled="saveDisabled"
								@click="save">要点确认</el-link>
						</transition>
					</div>
				</template>
				
			</jod-dragDialog>
			<jod-dragDialog v-model="picturesDialog" :dialogStyle="{width: '700',widthType: 'px'}" title="图片查看" :modal="false" class="detailLog">
				<viewer :images="pictures"><img :src="pictures" style="width: 100%;height: 100%;cursor:pointer;"></viewer>
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
	import qualityLog from '@/api/controller/qualityLog.js'
	import orderShop from '@/api/orderShop/orderShop.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import api from '@/api/index'
	export default {
		name:'qualityLogList',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props: {
			value:{
				type: String
			}
		},
		watch:{
			value(v){
				if(this.id!==v){
					this.gridData = [];
					this.searchValue = '';
					this.searchName = '';
					this.searchModel = '';
				}
				this.id = v;
				this.getAllList();
			}
		},
		data(){
			return {
				url:process.env.VUE_APP_BASE_URL,
				headers:{},
				fileList:[],//新增品控 图片
				uploadItem:null,//上传暂存
				picturesDialog:false,
				pictures:[],//详情图片预览
				columns: qualityLog.columns,//列
				options: qualityLog.options,//配置
				diaStyle : {
					width: '500',
					widthType: 'px'
				},
				id:this.value,
				detailId:'',//详情id
				detailDialog:false,//详情弹窗
				gridData: [],
				searchData:['spmc','ghsmc','createBy','isPass'],
				searchOptions:qualityLog.searchOptions,
				isPassOptions:qualityLog.isPassOptions,//状态
				ModelOptions:qualityLog.ModelOptions,//模块
				searchValue:'',//搜索模块选择
				searchName:'',//搜索输入
				searchModel:'',//
				searchLoading:false,//
				pagination:{//分页
					currentPage:1,
					pageSize:20
				},
				loading:null,
				detailData:null,//详情数据
				disabled:false,
				addValue:[],
				saveDisabled:false,//要点确认
				saveIcon:'el-icon-edit',
				addDialog:false,//品控新增
				qualityOptions:[],
				qualityLogData:qualityLog.qualityLogData,
				qualityLogForm:[...qualityLog.qualityLogForm,{
					type: "RadioButton",
					label: "是否通过:",
					prop: "isPassBase",
					color: '',
					change: res => {
						this.qualityLogForm[this.qualityLogForm.length-1].color = res?"#1890ff":"#ff4949"
					},
					radios: [{
						value: true,
						label: '通过'
					},{
						value: false,
						label: '拒绝'
					}],
					rules: [{
						required: true,
						message: "请确定检查结果",
						trigger: "change"
					}]
				}],
				qualityLogHandle:[
					{
						label: "提交",
						type: "primary",
						loading:false,
						handle: res => {
							this.$refs['qualityLogForm'].$refs['searchForm'].validate((valid) => {
								if (valid) {
									let form = {...this.qualityLogData};
									form['goodsId'] = this.id;
									//console.log(form)
									
									console.log(this.qualityOptions)
									//console.log(form)
									this.pro(form);
									// console.log(result)
								}
							});
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
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
		},
		mounted() {
			this.getAllList();
		},
		methods:{
			async getAllList(){
				this.loading = loading(document.getElementsByClassName('qualityList')[0])
				let params = {
					goodsId : this.id,
					spmc:'',
					ghsmc:'',
					createBy:'',
					isPass:''
				}
				let res = await this.getqualityLog(this.api.checkPage,params);
				let {data} = res;
				this.gridData = data.records?data.records:data;
				this.loading.close()
				this.$message({
					message: '查询成功',
					type: 'success'
				});				
			},
			getqualityLog(url,data){
				return qualityLog.get(url,data)
			},
			handleChangePage(page){
				console.log(page)
			},
			handleSizeChange(limit){
				console.log(limit)
			},
			searchTrace(bol){
				if(!bol) this.searchLoading = true;
				let field = this.searchData[this.searchValue];
				let obj = {
					goodsId : this.id,
					spmc:'',
					ghsmc:'',
					createBy:'',
					isPass:''
				};
				//let obj = {}
				if(this.searchValue=='3'){
					this.$set(obj,field,this.searchModel)
					if(!this.searchModel&&this.searchModel!==0){
						this.searchLoading = false;
						this.$message({
							message: '请选择状态',
							type: 'warning'
						});
						return
					}
				}else{
					this.$set(obj,field,this.searchName)
					if(!this.searchName){
						this.searchLoading = false;
						this.$message({
							message: '请输入查询名称',
							type: 'warning'
						});
						return
					}
				}
				let params = {
					...obj
				}
				console.log(params)
				this.getqualityLog(this.api.checkPage,params).then(res=>{
					let {data} = res;
					this.gridData = data.records?data.records:data;
					this.searchLoading = false;
					this.$message({
						message: '查询成功',
						type: 'success'
					});
					//this.dataTotal = res.length;
				}).catch(err=>{
					this.searchLoading = false;
				});
			},
			detail(row){
				this.detailId = row.id;
				this.$set(row, 'detailLoading', true)
				qualityLog.get(this.api.findByCheckId,row.id).then(res=>{
					console.log(res)
					let {data} = res;
					this.detailData = data;
					this.$set(row, 'detailLoading', false)
					this.detailDialog = true;
				}).catch(err=>{
					this.$set(row, 'detailLoading', false)
				});
				
			},
			save(){
				this.saveIcon = 'el-icon-loading';
				this.saveDisabled = true;
				let data = {
					goodsId:this.id,
					descriptions:this.addValue,
				}
				console.log(data);
				qualityLog.post(this.api.addQuality,data).then(res=>{
					this.saveDisabled = false;
					this.$message.success('要点新增成功')
					this.saveIcon = 'el-icon-edit';
					this.$emit('bol',true);
					this.disabled = false;
					this.addValue=[]
				}).catch(err=>{
					this.saveDisabled = false;
					this.saveIcon = 'el-icon-edit';
				})
				// orderData.post(this.api.postQuality,data).then(res=>{
				// 	//this.$store.commit('user/SET_BEARER', false)
				// 	this.onLoading = false;
				// 	this.categoryDialog = false;
				// 	this.quality = [];
				// 	this.fileList = [];
				// 	this.$emit('bol',true);
				// 	this.$message({
				// 	  type: 'success',
				// 	  message: '添加成功!'
				// 	});
				// }).catch(err=>{
				// 	this.onLoading = false;
				// 	//this.$store.commit('user/SET_BEARER', false)
				// })
			},
			async getQuality(){
				let result,options;
				try{
					result = await qualityLog.get(this.api.listByGoodsId,this.id);
					options = await qualityLog.getQuality(result);
					this.qualityOptions = options;
					console.log(options)
				}catch(e){
					this.$message.error(e)
				}
			},
			async pro(form){//品控日志新增提交
				let result,checkDetailList;
				try{
					checkDetailList = await qualityLog.checkDetailList(this.id,this.qualityOptions)
					
					form['checkDetailList'] = checkDetailList;
					console.log(form)
					result = await qualityLog.post(this.api.createCheck,form);
					this.getAllList();
					this.addDialog = false;
				}catch(e){
					console.log(e)
				}
			},
			addQuality(){
				if(this.gridData.length == 0){
					this.$message.warning('您尚未提交品控要点，不可增加该记录')
				}else{
					this.addDialog=true;
					this.getQuality();
				}
			},
			qualityChange(v,item){
				console.log(v)
				console.log(item)
				if(v){
					this.$set(item,'fill','#1890ff')
				}else{
					this.$set(item,'fill','#ff4949')
				}
			},
			//上传成功
			handleChange(file){
				this.uploadItem['image'] = file.data.fileHttpPath
				//this.$set(this.uploadItem,'image',file.data.fileHttpPath)
				this.fileList[0] = {url:file.data.fileHttpPath};
			},
			//上传数量限制
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			//上传格式限制
			beforeUpload(file,item){
				console.log(item)
				let i = file.type.indexOf('image')
				if(i=='-1'){
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
			},
			uploadId(item){
				this.uploadItem = item
			},
			closeDio(){
				this.disabled = false;
			},
			closeDemandForm(){
				this.$refs.['qualityLogForm'].$refs['searchForm'].resetFields();
			},
			//品控详情查看图片
			seeImage(url){
				this.picturesDialog = true;
				this.pictures = [url]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.qualityLabel{
		max-width: 300px;
		line-height: 18px;
		border: 1px solid;
		padding: 5px;
		color: #ffffff;
		border-radius: 5px;
		background: #909399;
	}
</style>

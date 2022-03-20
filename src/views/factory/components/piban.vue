<!--
 * @FileDescription: 批版
 * @Author: zhuangzhangyan
 -->
<template>
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
					 </el-upload>
				 </div>
			 </div>
		 </div>
		 <div>
			<el-select
				v-model="qualitylabel" 
				style="width: 300px;" 
				:size="size" 
				multiple 
				filterable 
				@change="$forceUpdate()"
				allow-create 
				default-first-option 
				placeholder="请选择或者输入品控要点">
					<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		 </div>
	 </template>
	</jod-formSearch>
</template>

<script>
	import qualityLog from '@/api/factory/piban.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import api from '@/api/index'
	export default {
		computed: {
					...mapGetters([
						'size',
						'token'
					])
				},
				props: {
					value:{
						type: Object
					}
				},
				watch:{
					value(v){
						this.data = v;
					}
				},
				data(){
					return {
						qualitylabel:[],
						url:process.env.VUE_APP_BASE_URL,
						headers:{},
						fileList:[],//新增品控 图片
						uploadItem:null,//上传暂存
						columns: qualityLog.columns,//列
						options: qualityLog.options,//配置
						option:[],
						diaStyle : {
							width: '500',
							widthType: 'px'
						},
						data:this.value,
						id:this.value.id,
						isPassOptions:qualityLog.isPassOptions,//状态
						loading:null,
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
								label: "确认",
								type: "primary",
								loading:false,
								handle: res => {
									this.$refs['qualityLogForm'].$refs['searchForm'].validate((valid) => {
										if (valid) {
											let form = {...this.qualityLogData};
											form['goodsId'] = this.id;
											console.log(this.qualityOptions)
											this.pro(form);
											if(form.isPassBase == 'true'){
												let ratify = {goodsId:this.id,isPass:0}
												qualityLog.post(this.api.saveIsPass,ratify).then(res=>{
													this.$message.success('提交成功')
												})
											}else{
												let ratify = {goodsId:this.id,isPass:1}
												qualityLog.post(this.api.saveIsPass,ratify).then(res=>{
													this.$message.success('提交成功')
												})
											}
										}
									});
								},
							},{
								label:"新增要点",
								type: "primary",
								handle:res=>{
									qualityLog.existenceArrs(this.qualitylabel,this.option).then(res=>{
										let data = {
											goodsId:this.id,
											filePath:'',
											haveIds:res['haveIds'],
											descriptions:res['descriptions']
										}
										qualityLog.post(this.api.postQuality,data).then(res=>{
											this.qualitylabel = [];
											this.$emit('bol',true);
											this.$message({
											  type: 'success',
											  message: '添加成功!'
											});
											this.option = []
											this.getQuality();
										})
									})
								}
							}
						],
					}
				},
				created() {
					this.headers['Authorization'] = this.token;
					this.getQuality();
				},
				mounted() {
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
					getTime(){
						var date = new Date();
						var month = date.getMonth() + 1;
						var strDate = date.getDate();
						if (month >= 1 && month <= 9) {
							month = "0" + month;
						}
						if (strDate >= 0 && strDate <= 9) {
							strDate = "0" + strDate;
						}
						var currentDate = date.getFullYear() + "-" + month + "-" + strDate
						+ " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
						console.log(currentDate)
						return currentDate
					},
					getqualityLog(url,data){
						return qualityLog.get(url,data)
					},
					async getQuality(){
						let result,options;
						try{
							result = await qualityLog.get(this.api.listByGoodsId,this.id);
							options = await qualityLog.getQuality(result);
							this.qualityOptions = options;
							for(var i=0;i<options.length;i++){
								this.option.push({label:options[i].label,value:i})
							}
							console.log('options',options)
						}catch(e){
							this.$message.error(e)
						}
					},
					async pro(form){//品控日志新增提交
						let result,checkDetailList,list;
						try{
							checkDetailList = await qualityLog.checkDetailList(this.id,this.qualityOptions)
							form['checkDetailList'] = checkDetailList;
							console.log('from',form)
							list = {checkDetailList:form.checkDetailList,checkModule:0,
							goodsId:form.goodsId,isPassBase:form.isPassBase,remark:form.remark}
							result = await qualityLog.post(this.api.createCheck,list);
						}catch(e){
							console.log(e)
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
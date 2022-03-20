<!--
 * @FileDescription: 入库检
 * @Author: wangpenghui
 -->
<template>
	<transition name="fade" mode="out-in">
		<div>
			<!--基础信息-->
			<div class="info">
				<div class="margin20_0">
					<!-- <i class="el-icon-minus"></i>
					<span>基础信息</span>
					<i class="el-icon-minus"></i> -->
					<el-divider content-position="left">基础信息</el-divider>
				</div>
				<jod-formSearch labelWidth="120px" ref="warehouseForm" :disabled="!isDisabled" :searchData="warehouseData" :searchForm="warehouseForm">
				</jod-formSearch>
			</div>
			<!--规格检验-->
			<transition name="fade" mode="out-in">
				<div class="Specifications" v-if="tableShow">
					<div class="margin20_0" v-if="sizeOptions&&sizeOptions.length!==0">
						<el-divider content-position="left">规格检验</el-divider>
					</div>
					<!--规格检验表-->
					<div style="text-align: right;" v-if="sizeOptions&&sizeOptions.length!==0">
						<el-button size="mini" type="success" :disabled="!isDisabled" @click="addDialog = true">新增</el-button>
					</div>
					<jod-tableList class="tableBody" v-if="sizeOptions&&sizeOptions.length!==0" :dataSource="warehouseDataSource" :columns="warehouseColumns"
						:options="{offHeight:true,soltColumn:true}">
						<!-- 自定义表头 -->
						<template slot="column_prop" slot-scope="scope">
							<template v-for="item in scope.row">
								<el-table-column
									:label="item.label"
									:align="item.align" 
									:width="item.width">
									<template v-for="(items,indexs) in item.columns">
										<el-table-column
											:prop="items.prop"
											:label="items.label"
											:align="items.align" 
											:width="items.width">
												<!-- 行处理 -->
												<template slot-scope="{row,$index}">
													<div v-if="items.prop=='size'">
														{{row[items.prop]}}
													</div>
													<div v-else>
														<div v-if="items.prop=='measure'">
															<el-input size="mini" type="Number" class="textCenter" :disabled="!isDisabled"
																v-if="row[item.prop]" v-model.number="row[item.prop][items.prop]"
																@input="salaryChange($event,row[item.prop])">
															</el-input>
														</div>
														<div v-else :class="row[item.prop].isExceed?'colorGreen':'colorRed'">
															<span v-if="row[item.prop]">{{row[item.prop][items.prop]}}</span>
														</div>
														
													</div>
												</template>
										</el-table-column>
									</template>
								</el-table-column>
							</template>
							<el-table-column
								align="center" 
								width="120">
									<template slot="header">
										操作
									</template>
									<template slot-scope="{row,$index}">
										<el-button type="danger" :disabled="!isDisabled" size="mini" @click="delList($index)">删除</el-button>
									</template>
							</el-table-column>
						</template>
					</jod-tableList>
					<!--表新增-->
					<jod-dragDialog v-model="addDialog" class="detailLog" title="新增" :modal="false"
						:dialogStyle="{width: '300',widthType: 'px'}">
						<div style="text-align: center;">
							<el-select v-model="sizeValue" placeholder="请选择新增的尺码">
								<el-option
								  v-for="item in sizeOptions"
								  :key="item.value"
								  :label="item.label"
								  :value="item.value">
								</el-option>
							</el-select>
							<el-button style="margin-top: 20px;" type="primary" @click="addList" :loading="addLoading">确认</el-button>
						</div>
					</jod-dragDialog>
				</div>
			</transition>
			
			<!--面辅料点检-->
			<transition name="fade" mode="out-in">
				<div class="fabricOrFactory" v-if="fabOrFacShow">
					<div class="margin20_0">
						<el-divider content-position="left">面辅料点检</el-divider>
					</div>
					<el-row>
						<el-col :span="6" v-for="data in fabOrFacList">
							<div class="label" style="text-align: right;">
								<div class="label_item">
									{{ data.materialName }}
								</div>
								<el-radio-group :disabled="!isDisabled" v-model="data.isPass" size="mini" class="isPass"
									:fill="data.isPass?'#1890ff':'#ff4949'">
									<el-radio-button :label="1">通过</el-radio-button>
									<el-radio-button :label="0">拒绝</el-radio-button>
								</el-radio-group>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="fabricOrFactory" style="text-align: center;color: #909399;" v-else>
					<div class="margin20_0">
						<el-divider content-position="left">面辅料点检</el-divider>
					</div>
					<div style="padding-top: 10px;">暂无数据</div>
				</div>
			</transition>
			<!--要点检查-->
			<div class="points">
				<div class="margin20_0">
					<el-divider content-position="left">要点检查</el-divider>
				</div>
				<!-- 动态上传 -->
				<div v-for="(data,index) in pointsList">
					<el-row style="margin-top: 10px;">
						<el-col :span="6" >
							<div style="width: 100%;">
								<div class="label" v-if="data.disable||data.state!==1">
									{{ data.name }}
								</div>
								<div class="label" v-else>
									<el-input :disabled="!isDisabled" size="mini" v-model="data.name" clearable></el-input>
								</div>
							</div>
						</el-col>
						<el-col :span="6" style="text-align: center;">
							<el-radio-group :disabled="!isDisabled" v-model="data.isPass" size="mini" class="isPass" :fill="data.isPass?'#1890ff':'#ff4949'">
								<el-radio-button :label="1">通过</el-radio-button>
								<el-radio-button :label="0" type="danger">拒绝</el-radio-button>
							</el-radio-group>
						</el-col>
						<el-col :span="6">
							<el-input :disabled="!isDisabled" placeholder="备注" size="mini" class="remark" v-model="data.remark" clearable>
							</el-input>
						</el-col>
						<el-col :span="6" style="display: flex;justify-content: center;">
							<el-upload class="upload-demo" :action="url+api.uploadQualit" :headers="headers"
								:on-success="handleChange" :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed"
								:file-list="data.fileUrl" :disabled="!isDisabled">
								<el-button :disabled="!isDisabled" size="mini" type="primary" @click="uploadId(data)">上传</el-button>
							</el-upload>
							<div v-if="index>4&&isDisabled" class="addBt">
								<el-button v-if="data.state==1?true:false"  type="danger" icon="el-icon-minus" circle size="mini"
									style="margin-left: 10px;" @click="delItem(pointsList,index)"></el-button>
								<el-button v-if="index==(pointsList.length-1)" type="success" size="mini"
									icon="el-icon-plus" circle style="margin-left: 10px;" @click="pointsListAddItem">
								</el-button>
							</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<!--质量问题描述-->
			<div class="quality">
				<div class="margin20_0">
					<el-divider content-position="left">质量问题描述</el-divider>
				</div>
				<!--动态描述-->
				<div v-for="(data,index) in qualityList">
					<el-row style="margin-top: 10px;">
						<el-col :span="14">
							<div class="label">
								<span style="width: 60px;">问题:</span>
								<el-input :disabled="!isDisabled" size="mini" v-model="data.name" clearable></el-input>
							</div>
						</el-col>
						<el-col :span="4">
							<div class="label">
								<span style="width: 60px;">数量:</span>
								<el-input :disabled="!isDisabled" class="textCenter" controls-position="right" size="mini" type="Number" 
									v-model.number="data.number" clearable></el-input>
							</div>
						</el-col>
						<el-col :span="4">
							<div class="label">
								<span style="width: 60px;">缺陷:</span>
								<el-select v-model="data.state" :disabled="!isDisabled" size="mini" clearable placeholder="请选择缺陷">
									<el-option
									  v-for="item in defectOptions"
									  :key="item.value"
									  :label="item.label"
									  :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="2" v-if="isDisabled" style="padding-left: 10px;">
							<el-button type="danger" v-if="index!==0" icon="el-icon-minus" circle
								@click="delItem(qualityList,index)" size="mini"></el-button>
							<el-button v-if="index==(qualityList.length-1)" type="success" 
								icon="el-icon-plus" circle style="margin-left: 10px;" size="mini" @click="qualityListAddItem">
							</el-button>
						</el-col>
					</el-row>
					
				</div>
			</div>
			<!--结论-->
			<div class="conclusion">
				<div class="margin20_0">
					<el-divider content-position="left">结论</el-divider>
				</div>
				<el-row style="margin-top: 10px;">
					<el-col :span="12">
						<div class="label">
							<span style="width: 80px;">问题属性:</span>
							<!-- <el-checkbox-group 
							    v-model="checkedCities"
								:disabled="!isDisabled"
							    :max="1">
							    <el-checkbox v-for="item in attribute" :label="item.label" :key="item.value">{{item.label}}</el-checkbox>
							</el-checkbox-group> -->
							<el-radio-group v-model="checkedCities" :disabled="!isDisabled">
								<template v-for="item in attribute">
									<el-radio :label="item.value">{{item.label}}</el-radio>
								</template>
							</el-radio-group>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="label">
							<span style="width: 70px;">返修件数:</span>
							<el-input :disabled="!isDisabled" style="width: 200px;" class="textCenter" size="mini" type="Number"
								v-model.number="rework" clearable></el-input>
						</div>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :span="12">
						<div class="label">
							<span style="width: 80px;">处理意见:</span>
							<!-- <el-checkbox-group
							    v-model="handleValue"
								:disabled="!isDisabled"
							    :max="1">
							    <el-checkbox v-for="item in handleOpinions" :label="item.label" :key="item.value">{{item.label}}</el-checkbox>
							</el-checkbox-group> -->
							<el-radio-group v-model="handleValue" :disabled="!isDisabled">
								<template v-for="item in handleOpinions">
									<el-radio :label="item.value">{{item.label}}</el-radio>
								</template>
							</el-radio-group>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="label">
							<span style="width: 80px;">判断结论:</span>
							<el-input
							  type="textarea"
							  :disabled="!isDisabled"
							  :rows="4"
							  placeholder="请输入结论"
							  v-model="conclusion">
							</el-input>
						</div>
					</el-col>
				</el-row>
			</div>
			<!--按钮组-->
			
			<div style="text-align: center;" v-if="isDisabled">
				<el-button type="primary" @click="confirm(1)" :loading="confirmLoading">暂存</el-button>
				<el-button type="primary" @click="confirm(0)" :loading="confirmLoading">提交</el-button>
			</div>
			<div style="text-align: center;" v-else>
				<el-button type="primary" @click="exportTable">导出</el-button>
			</div>
		</div>
	</transition>
</template>

<script>
	import json from '@/api/factory/warehouse.js'
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'token'
			])
		},
		watch:{
			value(v){
				this.detailsValue = v;
			},
		},
		props:{
			value:{
				type:Object
			},
			warehousValue:{
				type:Object,
				default:()=>{}
			},
			tempState:{
				type:Number
			}
		},
		data(){
			return{
				bodyShow:false,
				detialObj:{
					goodsId:null,
					id:null
				},//用于获取详情
				isUpdate:false,//是否更新
				isUpdateId:null,
				confirmLoading:false,//提交按钮加载
				detailsValue:this.value,//基础查询
				isDisabled:false,//全局禁用
				warehouseData:{...json.warehouseData},
				warehouseForm:[...json.warehouseForm],
				//表数据
				tableShow:false,//表渲染
				warehouseDataSource:[],
				//自定义表头
				warehouseColumns:[
					{
						label:'',
						width:130,
						align: 'center',
						columns:[{
							label:'尺码',
							prop:'size',
							align: 'center',
						}]
					}
				],
				addDialog:false,//新增
				addLoading:false,
				sizeValue:'',
				//新增下拉数据
				sizeOptions:[],
				//面辅料点检
				fabOrFacShow:false,
				fabOrFacList:JSON.parse(JSON.stringify(json.fabOrFacList)),
				//要点检查
				pointsList:JSON.parse(JSON.stringify(json.pointsList)),
				url: process.env.VUE_APP_BASE_URL,
				headers: {},
				uploadItem: null, //上传暂存
				//质量问题描述
				qualityList:JSON.parse(JSON.stringify(json.qualityList)),
				defectOptions:[...json.defectOptions],
				//结论
				checkedCities:'',
				attribute:[...json.attribute],//问题属性
				handleValue:'',
				handleOpinions:[...json.handleOpinions],//处理意见
				conclusion:'',
				rework:'',//返修
			}
		},
		created() {
			if(this.warehousValue){
				this.isDisabled = true;
				let {sl,id,spmc,ghsmc,spdm} = this.warehousValue;
				this.warehouseData['id'] = id;
				this.warehouseData['number'] = sl;
				this.warehouseData['spmc'] = spmc;
				this.warehouseData['spdm'] = spdm;
				this.warehouseData['ghsmc'] = ghsmc;
				this.detialObj['goodsId'] = id;
				this.detialObj['id'] = null;
				this.fabOrFacShow = true;
				this.getTableData({'goodsId':id});
			}else{
				if(this.tempState){
					this.isDisabled = this.tempState==1?true:false;
				}
				this.detialObj['goodsId'] = this.value.goodsId;
				this.detialObj['id'] = this.value.id;
				console.log(this.value)
				this.getTableData({'goodsId':this.value.goodsId});
			}
			
			this.headers['Authorization'] = this.token;
		},
		methods:{
			//获取数据
			async getTableData(id){
				let res = await json.get(this.api.factoryStandard,id);
				if(res.data.length!==0){
					let size = await json.sizeHandler(res.data);
					this.sizeOptions = size;
					console.log(this.warehousValue)
					let res2 = await json.get(this.api.factoryPart,id);
					//console.log(res2);
					if(res2.code==0&&res2.data.length!==0){
						let header = await json.headerHandler(res2.data);
						//console.log(header);
						this.warehouseColumns = this.warehouseColumns.concat(header);
						console.log(this.warehouseColumns)
					}
				}
				setTimeout(()=>{
					this.tableShow = true;
					this.getData();
				},100)
			},
			async getData(){
				try{
					let data = await json.post(this.api.goodsIntoDetail,{...this.detialObj});
					if(data.data.id){
						this.isUpdateId = data.data.id;
						this.isUpdate = true
					}else{
						this.isUpdate = false;
					}
					if(data.data.number) this.warehouseData['number'] = data.data.number
					if(data.data.goodsName) this.warehouseData['spmc'] = data.data.goodsName
					if(data.data.goodsCode) this.warehouseData['spdm'] = data.data.goodsCode
					if(data.data.goodsCode) this.warehouseData['ghsmc'] = data.data.goodsCode
					
					this.warehouseData['arriveNumber'] = data.data.arriveNumber;
					this.warehouseData['checkNumber'] = data.data.checkNumber;
					this.warehouseData['stage'] = data.data.stage;
					this.warehouseData['onlineDate'] = data.data.onlineDate;
					this.warehouseData['deliveryDate'] = data.data.deliveryDate;
					this.warehouseData['productionInfo'] = data.data.productionInfo;
					// if(data.data.problemAttribute){
					// 	// let pro = this.attribute.map(item=>{
					// 	// 	if(item.value==data.data.problemAttribute&&item.label!==null){
								
					// 	// 		return item.label
					// 	// 	}
					// 	// })
					// 	// this.checkedCities = pro.filter(item=>item);
						
					// }
					this.checkedCities = data.data.problemAttribute;
					if(data.data.resolution){
						// let reso = this.handleOpinions.map(item=>{
						// 	if(item.value==data.data.resolution&&item.label!==null){
						// 		return item.label
						// 	}
						// })
						// this.handleValue = reso.filter(item=>item);
						this.handleValue = data.data.resolution;
					}
					this.conclusion = data.data.conclusion;
					this.rework = data.data.reworkNumber;
					//规格检验
					console.log(data)
					if(data.data.specCheckList&&data.data.specCheckList.length!==0){
						let list = data.data.specCheckList;
						let header = await json.dataSourceHandler1(list);
						let headerData = await json.dataSourceHandler2(this.warehouseColumns,header,this.sizeOptions);
						this.warehouseDataSource = headerData;
						//this.warehouseColumns = this.warehouseColumns.concat(header);
						// let dataSource = await json.dataSourceHandler(list);
						// this.warehouseDataSource = dataSource;
					}
					
					// let list = [{id:1,partName:'胸围',size:42,measure:4,measureError:5},
					// 			{id:2,partName:'腰围',size:43,measure:4,measureError:5},
					// 			{id:3,partName:'腰围',size:42,measure:1,measureError:2}];
					// let header = await json.headerHandler(list);
					// this.warehouseColumns = this.warehouseColumns.concat(header);
					// let dataSource = await json.dataSourceHandler(list);
					// this.warehouseDataSource = dataSource;
					
					
					//面辅料检点
					if(data.data.materialIntos&&data.data.materialIntos.length!==0){
						this.fabOrFacList = data.data.materialIntos;
					}
					this.fabOrFacShow = true;
					//this.fabOrFacShow = true;
					//let fabOrFacList = [{id:1,materialName:'静态测试一',isPass:false}]
					
					//要点检查
					if(data.data.pointChecks&&data.data.pointChecks.length!==0){
						let newArr = data.data.pointChecks.reduce((total,current)=>{
							if(!current.fileUrl){
								current.fileUrl = [];
							}
							total.push(current);
							return total
						},[])
						this.pointsList = newArr;
					}else{
						this.$message.error('要点数据异常，执行返回');
						this.$emit('closeDetail',false,false)
					}
					
					//质量问题描述
					if(data.data.problemIntos&&data.data.problemIntos.length!==0){
						this.qualityList = data.data.problemIntos;
					}
				}catch(e){
					if(typeof e =='string'){
						this.$message.error(e)
					}else{
						console.log(e)
					}
					this.$emit('closeDetail',false,false)
				}
			},
			//新增
			async addList(){
				if(this.sizeValue){
					this.addLoading = true;
					let size = this.sizeOptions.find(x => x.value == this.sizeValue).label
					let data = await json.headerTurnData(this.warehouseColumns,this.sizeValue);
					data['size'] = size;
					this.warehouseDataSource.push(data);
					this.addDialog = false;
					this.addLoading = false;
				}
			},
			salaryChange(event,value,row){
				console.log(this.warehouseDataSource)
				if(event==''){
					value.measure = 0
				}
				console.log(value)
				let bt = (Number(event)-Number(value.standard)).toFixed(1);
				value.measureError = Number(bt);
				if(bt<value.dev1||bt>value.dev2){
					value.isExceed = false;
				}else{
					value.isExceed = true;
				}
				//this.$set(row,'')
				// if()
				// let isExceed = 
			},
			//删除
			delList(index){
				this.warehouseDataSource.splice(index,1)
			},
			//要点检查
			//上传成功
			handleChange(response, file, fileList) {
				this.uploadItem.fileUrl[0] = {name:file.name,url:file.response.data.fileHttpPath};
			},
			//上传数量限制
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			//上传格式限制
			beforeUpload(file, item) {
				console.log(item)
				let i = file.type.indexOf('image')
				if (i == '-1') {
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
			},
			uploadId(item) {
				this.uploadItem = item?item:[];
			},
			//新增
			pointsListAddItem() {
				let item = {
					label: '',
					isPass: '',
					fill: '',
					remark: '',
					state:1,
					fileUrl: [],
				}
				this.pointsList.push(item)
			},
			qualityListAddItem(){
				let item = {
					id: null,
					problem:'',
					num:'',
					defect:''
				};
				this.qualityList.push(item)
			},
			//删除
			delItem(list,index) {
				
				list.splice(index, 1)
			},
			async confirm(value){
				try{
					this.confirmLoading = true;
					let {arriveNumber,checkNumber,deliveryDate,number,onlineDate,productionInfo,stage} = this.warehouseData;//基础信息
					let obj = {arriveNumber,checkNumber,deliveryDate,number,onlineDate,productionInfo,stage};//基础信息
					// console.log(this.warehouseData)
					// console.log(this.fabOrFacList)
					// console.log(this.pointsList)
					// console.log(this.qualityList)
					if(value==0){
						let validatorFab = await json.validatorFab(this.fabOrFacList);
						let validatorPoint = await json.validatorPoint(this.pointsList);
					}
					//规格是否检测
					if(!this.warehousValue.isAcc){
						let specCheckList = await json.dataTableHandler(this.warehouseDataSource);
						obj['specCheckList'] = specCheckList;//规格检验
					}
					obj['id'] = this.isUpdateId;
					obj['factoryName'] = this.warehouseData.ghsmc;//生产工厂
					obj['goodsCode'] = this.warehouseData.spdm;//
					obj['goodsName'] = this.warehouseData.spmc;//
					obj['number'] = this.warehouseData.number;//
					//区分来源
					if(this.warehousValue){
						obj['goodsId'] = this.warehousValue.id;
					}else{
						obj['goodsId'] = this.value.id;
					}
					obj['materialIntos'] = this.fabOrFacList;//面辅料点检
					console.log(this.pointsList)
					let newPointsList =  this.pointsList.reduce((total,current)=>{
						let obj = {...current};
						if(current.fileUrl&&current.fileUrl[0]){
							obj['fileUrl'] = current.fileUrl;
							console.log(current)
						}
						total.push(obj);
						return total;
					},[])
					obj['pointChecks'] = newPointsList;//要点检查
					
					obj['problemIntos'] = this.qualityList;//问题属性
					// this.attribute.forEach(item=>{
					// 	if(item.label==this.checkedCities){
					// 		obj['problemAttribute'] = item.value
					// 	}
					// })
					// this.handleOpinions.forEach(item=>{
					// 	if(item.label==this.handleValue){
					// 		obj['resolution'] = item.value
					// 	}
					// })
					obj['problemAttribute'] = this.checkedCities;
					obj['resolution'] = this.handleValue;
					obj['reworkNumber'] = this.rework;//返修件数
					obj['conclusion'] = this.conclusion;//结论
					obj['tempState'] = value;
					console.log(this.isUpdate)
					let url = '';
					if(this.isUpdate){
						url = this.api.factoryUpdate;
					}else{
						url = this.api.factoryAdd;
					}
					console.log(obj)
					let res = await json.post(url,obj);
					console.log(res)
					this.confirmLoading = false;
					this.$message.success('修改成功')
					if(value==0){
						this.$emit('closeDetail',false,false,true);
					}else{
						this.$emit('closeDetail',false);
					}
					
				}catch(e){
					console.log(e)
					this.confirmLoading = false;
					//this.$message.error(e)
				}
			},
			exportTable(){
				this.$emit('closeDetail',false,true)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.colorGreen{
		color: #32CD32;
	}
	.colorRed{
		color: #FF0000;
	}
	.info{
		.el-icon-minus{
			color: #0088FF;
		}
	}
	.Specifications .tableBody{
		padding-top: 15px;
	}
	.fabricOrFactory{
		padding-bottom: 10px;
		.label{
			margin: auto;
			margin-top: 10px;
			justify-content: center;
			display: flex;
			.label_item{
				width: 45px;
				display: flex;
				align-items:center;
				font-weight: bold;
				margin-right: 10px;
			}
		}
	}
	.points{
		padding-bottom: 10px;
		.label{
			font-weight: bold;
			margin-left: 35px;
		}
		.upload-demo {
			margin: auto 0;
			width: 100%;
			margin-left: 20px;
		}
		.addBt {
			display: flex;
			margin: auto 0;
			margin-right: 20px;
		}
	}
	.quality{
		.label{
			font-weight: bold;
			display: flex;
			align-items:center;
			margin-left: 35px;
		}
	}
	.conclusion{
		margin-bottom: 30px;
		.label{
			font-weight: bold;
			display: flex;
			align-items:center;
			margin-left: 25px;
		}
	}
</style>

<template>
	<transition name="fade" mode="out-in">
		<div style="">
			<!--检验部-->
			<div class="test box">
				<h3>检验部</h3>
				<el-divider content-position="left">基础信息</el-divider>
				<el-row class="marginLeft40">
					<el-col :span="20">
						<el-row>
							<el-col :span="8" class="label">
								<span class="item">客户名称:</span>
								<el-tooltip effect="dark" :content="info.clientName" placement="top">
								      <div class="item2 widthItem">{{info.clientName}}</div>
								</el-tooltip>
							</el-col>
							<el-col :span="6" class="label">
								<span class="item">合同号:</span>
								<div class="item2">{{info.contractNo}}</div>
							</el-col>
							<el-col :span="4" class="label">
								<span class="item">收货数量:</span>
								<el-input style="width: 80px;" :disabled="isDisabled" size="mini"
									type="Number" class="textCenter item2" v-model.number="info.takeNum" ></el-input>
							</el-col>
							<el-col :span="6" class="label" style="">
								<div style="display: flex;justify-content: flex-end;width: 100%;margin-right: 30px;">
									<span class="item">检验数量:</span>
									<el-input style="width: 80px;" :disabled="isDisabled" size="mini"
										type="Number" class="textCenter item2" v-model.number="info.checkNum" ></el-input>
								</div>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8" class="label">
								<span class="fontBold">成份:</span>
								<div class="item2">{{info.component}}</div>
							</el-col>
							<el-col :span="6" class="label">
								<span class="item">面料名称:</span>
								<div class="item2">{{info.materialName}}</div>
							</el-col>
							<el-col :span="4" class="label">
								<span class="fontBold">类别:</span>
								<div class="item2">{{info.classification}}</div>
							</el-col>
							<el-col :span="6" class="label">
								<div style="display: flex;justify-content: flex-end;width: 100%;margin-right: 20px;">
									<span class="item">面料编号:</span>
									<div class="item2">{{info.materialCode}}</div>
								</div>
							</el-col>
						</el-row>
					</el-col>
					<el-col :span="4">
						<!--:headers="headers"-->
						<el-upload class="avatar-uploader" :class="{disabled:uploadDisabled}" :disabled="isDisabled"
							:action="url+api.uploadQualit" :before-upload="beforeUpload"
							list-type="picture-card" :on-remove="handleRemove" :headers="headers"
							:on-preview="handlePictureCardPreview" :on-success="handleChange"
							:file-list="fileList">
							<i class="el-icon-plus"></i>
						</el-upload>
						<jod-dragDialog v-model.sync="dialogVisible" class="tableDialog" :modal="false">
							<img width="100%" :src="dialogImageUrl" alt="">
						</jod-dragDialog>

					</el-col>
				</el-row>
				<el-divider content-position="left">检验说明</el-divider>
				<h4 style="margin:40px">表面部分:</h4>
				<jod-tableList class="tableBody" style="margin: 0 40px;" :dataSource="dataSource" :columns="columns"
					:options="{offHeight:true,index: true,labelIndex: '序号',headerInput: true,headerWidth: '150',}">
					<!--自定义-->
					<template :slot="item.prop" slot-scope="{row,$index}" v-for="item in columns">
						<el-input v-if="item.prop=='equalNo'||item.prop=='record'" size="mini" :disabled="isDisabled" v-model="row[item.prop]"></el-input>
						<el-select v-else-if="item.prop=='verdict'" v-model="row[item.prop]" placeholder="" :disabled="isDisabled">
						    <el-option
						      v-for="item in verdictOptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
						<el-input v-else type="Number" size="mini" class="textCenter" :disabled="isDisabled"
						  v-model.number="row[item.prop]"></el-input>
					</template>
					<!--自定义按钮-->
					<template v-slot:header_input>
						操作
					</template>
					<template slot="operate" slot-scope="{row,$index}">
						<i class="iconfont" style="color: #409EFF" @click="addList">&#xe640;</i>
						<i class="iconfont" style="color: #F56C6C;margin-left: 10px;" @click="delList($index)">&#xe641;</i>
					</template>
				</jod-tableList>
				<h4 style="margin:40px">条格:</h4>
				<el-row style="padding-bottom: 20px;">
					<el-col :span="6" style="text-align: center;">
						<span style="margin-right: 23px;">大小:</span>
						<el-radio-group v-model="magnitude" :disabled="isDisabled">
						    <el-radio :label="1">正确</el-radio>
						    <el-radio :label="2">误差</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="6" style="text-align: center;">
						<span style="margin-right: 23px;">清晰度:</span>
						<el-radio-group v-model="definition" :disabled="isDisabled">
						    <el-radio :label="1">清晰</el-radio>
						    <el-radio :label="2">不清晰</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="6" style="text-align: center;">
						<span style="margin-right: 23px;">阴阳格条:</span>
						<el-radio-group v-model="lace" :disabled="isDisabled">
						    <el-radio :label="1">有</el-radio>
						    <el-radio :label="2">无</el-radio>
						</el-radio-group>
					</el-col>
					<el-col :span="6" style="text-align: center;">
						<span style="margin-right: 23px;">倒顺绒:</span>
						<el-radio-group v-model="velvet" :disabled="isDisabled">
						    <el-radio :label="1">有</el-radio>
						    <el-radio :label="2">无</el-radio>
						</el-radio-group>
					</el-col>
				</el-row>
				<!-- 按钮 -->
				<div class="btn" v-if="isDisabled!==null?!isDisabled:false">
					<el-button type="primary" @click="infoHandler(true)" :loading="infoLoading" v-has:check>合格</el-button>
					<el-button type="danger" @click="infoNo" :loading="infoLoading" v-has:check>不合格</el-button>
				</div>
			</div>
			<!--品管部-->
			<div class="quality box"
			  v-if="qualityShow"
			  :class="qualityControlPass!==null?(qualityControlPass?'isPassTrue':'isPassFalse'):''">
				<h3>品管部</h3>
				<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
				<el-input class="opinion" type="textarea" :disabled="qualityControlPass==null?false:true"
					:autosize="{ minRows: 5, maxRows: 8}" v-model="qualityControlOpinion"
					style="padding-bottom: 20px;"></el-input>
				<!-- 按钮 -->
				<transition name="fade" mode="out-in">
					<div class="btn" v-if="qualityControlPass==null">
						<el-button type="primary" :loading="qualityLoading" v-has:quality
						  @click="qualityHandler(true)">通过</el-button>
						<el-button type="danger" :loading="qualityLoading" v-has:quality
						  @click="qualityNo">拒绝</el-button>
					</div>
				</transition>
			</div>
			<!--采购部/客户-->
			<div class="quality box"
			  v-if="purchaseShow"
			  :class="procurementPass!==null?(procurementPass?'isPassTrue':'isPassFalse'):''">
				<h3>采购部 / 客户</h3>
				<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
				<el-input class="opinion" type="textarea" :disabled="procurementPass!==null?true:false"
					:autosize="{ minRows: 5, maxRows: 8}" v-model="procurementOpinion"
					style="padding-bottom: 20px;"></el-input>
				<!-- 按钮 -->
				<transition name="fade" mode="out-in">
					<div class="btn" v-if="procurementPass==null">
						<el-button type="primary" :loading="procurementLoading" v-has:purchase
						  @click="procurementHandler(true)">通过</el-button>
						<el-button type="danger" :loading="procurementLoading" v-has:purchase
						  @click="procurementNo">拒绝</el-button>
					</div>
				</transition>
			</div>
			<!--技术部-->
			<div class="quality box"
			  v-if="technologyShow"
			  :class="developmentPass!==null?(developmentPass?'isPassTrue':'isPassFalse'):''">
				<h3>技术部</h3>
				<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
				<el-input class="opinion" type="textarea" :disabled="developmentPass!==null?true:false"
					:autosize="{ minRows: 5, maxRows: 8}" v-model="developmentOpinion"
					style="padding-bottom: 20px;"></el-input>
				<!-- 按钮 -->
				<transition name="fade" mode="out-in">
					<div class="btn" v-if="developmentPass==null">
						<el-button type="primary" :loading="developmentLoading" v-has:technology
						  @click="developmentHandler(true)">通过</el-button>
						<el-button type="danger" :loading="developmentLoading" v-has:technology
						  @click="developmentNo">拒绝</el-button>
					</div>
				</transition>
			</div>
			<!--生产部-->
			<div class="quality box"
			  v-if="productionShow"
			  :class="productionPass!==null?(productionPass?'isPassTrue':'isPassFalse'):''">
				<h3>生产部</h3>
				<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
				<el-input class="opinion" type="textarea" :disabled="productionPass!==null?true:false"
					:autosize="{ minRows: 5, maxRows: 8}" v-model="productionOpinion"
					style="padding-bottom: 20px;"></el-input>
				<!-- 按钮 -->
				<transition name="fade" mode="out-in">
					<div class="btn" v-if="productionPass==null">
						<el-button type="primary" :loading="productionLoading" v-has:production
						  @click="productionHandler(true)">通过</el-button>
						<el-button type="danger" :loading="productionLoading" v-has:production
						  @click="productionNo">拒绝</el-button>
					</div>
				</transition>
			</div>
		</div>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex'
	import warehouse from '@/api/fabric/warehouse.js'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props:{
			value:{
				type:Object,
				default:()=>{}
			},
			source:{
				type:String
			}
		},
		data() {
			return {
				purchaseId:null,//采购单ID
				headers: {},
				url: process.env.VUE_APP_BASE_URL,
				entryId:null,//入库检ID
				entryRow:this.value,//订单信息
				isDisabled:false,//基础信息禁用
				uploadDisabled:false,//是否已上传
				dialogImageUrl: '',
				dialogVisible: false,
				infoLoading:false,//加载中
				info:{
					clientName:null,//客户名称
					contractNo:null,//合同号
					takeNum:null,//收货数量
					checkNum:null,//检验数量
					materialName:null,//面料名称
					materialCode:null,//面料编号
					classification:null,//类别
					component:null//成份
				},
				fileList:[],//图片
				dataSource:[{fabricEntryId:null,equalNo:'',normLength:'',realityLength:'',breadth:'',record:''}],//表面部分
				columns:[...warehouse.detailsColumns],
				magnitude:null,//大小
				definition:null,//清晰度
				lace:null,//阴阳格条
				velvet:null,//倒顺绒
				verdictOptions:[{//结论
					value:'合格',
					label:'合格'
				},{
					value:'不合格',
					label:'不合格'
				}],
				opinionId:null,//不合格后续操作 ID
				qualityShow:false,//品管 隐藏or显示
				qualityControlPass:null,//品管状态
				qualityLoading:false,//品管 加载中
				qualityControlOpinion:'',
				purchaseShow:false,//采购 隐藏or显示
				procurementPass:null,//采购状态
				procurementLoading:false,//采购 加载中
				procurementOpinion:'',
				technologyShow:false,//技术 隐藏or显示
				developmentPass:null,//技术部
				developmentLoading:false,//技术 加载中
				developmentOpinion:'',
				productionShow:false,//生产 隐藏or显示
				productionPass:null,//生产
				productionLoading:false,//生产部 加载中
				productionOpinion:''
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
			console.log(this.value)
			let url = '';
			//区分
			if(this.source=='list'){
				this.purchaseId = this.value.purchaseId;
				url = this.api.fabricDetail
			}else{
				this.purchaseId = this.value.id;
				url = this.api.fabricPurchaseDetail;
			}
			this.getInfo(url,this.value.id);
		},
		methods: {
			//获取
			async getInfo(url,id){
				let data = await warehouse.get(url,{id:id});
				let {image,magnitude,definition,lace,velvet,fabricEntryExplainList,
					clientName,contractNo,takeNum,checkNum,materialName,materialCode,classification,component,
					isQualified} = {...data.data};
				//基础信息
				this.entryId = data.data.id;
				this.opinionId = data.data.opinionId;
				this.info = {clientName,contractNo,takeNum,checkNum,materialName,materialCode,classification,component};
				//其他
				this.magnitude = magnitude;
				this.definition = definition;
				this.lace = lace;
				this.velvet = velvet;
				if(fabricEntryExplainList&&fabricEntryExplainList.length!==0){
					this.dataSource = fabricEntryExplainList;
				}
				if(image){
					this.uploadDisabled = true;
					this.fileList.push({name:'文件',url:image});
				}
				//状态区分
				if(!isQualified&&isQualified!==null){
					this.isDisabled = true;
					this.qualityShow = true;
					this.purchaseShow = true;
					this.technologyShow = true;
					this.productionShow = true;
				}else{
					this.isDisabled = false;
				}
				//品管部
				if(data.data.qualityControlPass!==null){
					this.qualityControlOpinion = data.data.qualityControlOpinion;
					this.qualityControlPass = data.data.qualityControlPass;
				}
				//采购部
				if(data.data.procurementPass!==null){
					this.procurementOpinion = data.data.procurementOpinion;
					this.procurementPass = data.data.procurementPass;
				}
				//技术部
				if(data.data.developmentPass!==null){
					this.developmentOpinion = data.data.developmentOpinion;
					this.developmentPass = data.data.developmentPass;
				}
				//生产部
				if(data.data.productionPass!==null){
					this.productionOpinion = data.data.productionOpinion;
					this.productionPass = data.data.productionPass;
				}
				console.log(data)
			},
			//检验部
			async infoHandler(value){
				this.infoLoading = true;
				let vObj = {
					takeNum:this.info['takeNum'],//收货数量
					checkNum:this.info['checkNum'],//检验数量
				}
				let bt = await warehouse.validateObj(vObj);
				if(bt){
					this.$message.warning('收货数量/检验数量 不能为空');
					this.infoLoading = false;
					return
				}
				let obj = {
					purchaseId:this.purchaseId,//采购单ID
					...this.info,
					image:this.fileList[0]?this.fileList[0].url:'',//图片
					fabricEntryExplainList:this.dataSource&&this.dataSource.length!==0?this.dataSource:null,//表面部分
					magnitude:this.magnitude,//大小
					definition:this.definition,//清晰度
					lace:this.lace,//阴阳格条
					velvet:this.velvet,//倒顺绒
					isQualified:value,//是否合格
				}
				console.log(obj)
				let res = await warehouse.put(this.api.addFabricDetail,obj);
				console.log(res)
				if(res.code==0){
					this.infoLoading = false;
					this.$emit('warDetailsClose',false)
				}
			},
			async infoNo(){
				let obj = {
					takeNum:this.info['takeNum'],//收货数量
					checkNum:this.info['checkNum'],//检验数量
					image:this.fileList[0]?this.fileList[0].url:'',//图片
					fabricEntryExplainList:this.dataSource,//表面部分
					magnitude:this.magnitude,//大小
					definition:this.definition,//清晰度
					lace:this.lace,//阴阳格条
					velvet:this.velvet,//倒顺绒
				}
				let bt = await warehouse.validateObj(obj);
				console.log(bt)
				if(bt){
					this.$message.warning('数据未填写完毕,无法提交')
				}else{
					this.infoHandler(false);
				}
			},
			//上传
			//上传成功
			handleChange(response, file, fileList) {
				this.fileList[0]= {name:file.name,url:file.response.data.fileHttpPath}
			},
			beforeUpload(res, file) {
				let i = res.type.indexOf('image')
				if (i == '-1') {
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
				this.uploadDisabled = true;
			},
			handleRemove(file, fileList) {
				setTimeout(()=>{
					this.uploadDisabled = false;
				},500)
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//新增
			addList(){
				if(this.isDisabled){
					return
				}
				let obj = {fabricEntryId:null,equalNo:'',normLength:'',realityLength:'',breadth:'',record:''};
				this.dataSource.push(obj);
			},
			//删除
			delList(index){
				if(this.isDisabled){
					return
				}
				this.dataSource.splice(index,1)
			},
			//品管部
			async qualityHandler(value){
				this.qualityLoading = true;
				let obj = {
					id:this.opinionId,
					entryId:this.entryId,//入库检ID
					type:1,
					qualityControlPass:value,//品管部 是否通过
					qualityControlOpinion:this.qualityControlOpinion,//品管部 审核意见
				}
				let res = await warehouse.post(this.api.addOpinion,obj);
				this.qualityControlPass = value;
				this.$message.success('操作成功');
				this.$emit('warDetailsClose',false)
			},
			qualityNo(){
				if(!this.qualityControlOpinion){
					this.$message.warning('品管部 审核意见不能为空');
					return
				}
				this.qualityHandler(false);
			},
			//采购部
			async procurementHandler(value){
				this.procurementLoading = true;
				let obj = {
					id:this.opinionId,
					entryId:this.entryId,//入库检ID
					type:1,
					procurementPass:value,
					procurementOpinion:this.procurementOpinion,
				}
				let res = await warehouse.post(this.api.addOpinion,obj);
				this.procurementPass = value;
				this.$message.success('操作成功');
				this.$emit('warDetailsClose',false);
			},
			procurementNo(){
				if(!this.procurementOpinion){
					this.$message.warning('采购部 审核意见不能为空');
					return
				}
				this.procurementHandler(false);
			},
			//技术部
			async developmentHandler(value){
				this.developmentLoading = true;
				let obj = {
					id:this.opinionId,
					entryId:this.entryId,//入库检ID
					type:1,
					developmentPass:value,
					developmentOpinion:this.developmentOpinion,
				}
				let res = await warehouse.post(this.api.addOpinion,obj);
				this.developmentPass = value;
				this.$message.success('操作成功');
				this.$emit('warDetailsClose',false)
			},
			developmentNo(){
				if(!this.developmentOpinion){
					this.$message.warning('技术部 审核意见不能为空');
					return
				}
				this.developmentHandler(false);
			},
			//生产部
			async productionHandler(value){
				this.productionLoading = true;
				let obj = {
					id:this.opinionId,
					entryId:this.entryId,//入库检ID
					type:1,
					productionPass:value,
					productionOpinion:this.productionOpinion,
				}
				let res = await warehouse.post(this.api.addOpinion,obj);
				this.productionPass = value;
				this.$message.success('操作成功');
				this.$emit('warDetailsClose',false)
			},
			productionNo(){
				if(!this.productionOpinion){
					this.$message.warning('生产部 审核意见不能为空');
					return
				}
				this.productionHandler(false);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont{
		user-select: none;
	    font-family:"iconfont" !important;
	    font-size:20px;font-style:normal;
		cursor:pointer;
	    -webkit-font-smoothing: antialiased;
	    -webkit-text-stroke-width: 0.2px;
	    -moz-osx-font-smoothing: grayscale;
	}
	.test {
		.label{
			display: flex;
			align-items:center;
			line-height: 75px;
			.item{
				font-weight: bold;
				width: 70px;
				margin-right: 5px;
			}
			.fontBold{
				font-weight: bold;
			}
			.item2{
				margin-left: 5px;
			}
			.widthItem{
				width: 200px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
	}
	.quality{
		position: relative;
		overflow: hidden;
		.opinion{
			display: flex;
			margin-top: 5px;
			margin-left:80px;
			width: 85%;
		}
	}
	/deep/.disabled .el-upload--picture-card {
		display: none;
	}

	//各主体外框
	.box {
		margin: 0 40px;
		margin-top: 20px !important;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .1);
		h3 {
			text-align: left;
			margin-left: 30px;
			padding-top: 20px;
			margin-bottom: 40px;
		}
	}

	//各主体按钮
	.btn {
		text-align: center;
		padding-bottom: 20px;
	}

	/deep/.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	/deep/.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.isPassTrue:after{
		position: absolute;
		display: block;
		content: "\e600";
		top: 10px;
		right: 10px;
		font-family:'iconfont';
		font-size: 80pt;
		font-weight: normal;
		z-index: 102;
		color: #3CB371;
	}
	.isPassFalse:after{
		position: absolute;
		display: block;
		content: "\e601";
		top: 10px;
		right: 10px;
		font-family:'iconfont';
		font-size: 80pt;
		font-weight: normal;
		z-index: 102;
		color: red;
	}
</style>

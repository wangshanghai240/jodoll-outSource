<template>
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
							<div>{{info.name}}</div>
						</el-col>
						<el-col :span="6" class="label">
							<span class="item">合同号:</span>
							<div>{{info.id}}</div>
						</el-col>
						<el-col :span="5" class="label">
							<span class="item">收货数量:</span>
							<el-input style="width: 100px;" :disabled="isDisabled" size="mini"
								type="Number" class="textCenter" v-model.number="info.receivedNum" clearable></el-input>
						</el-col>
						<el-col :span="5" class="label">
							<span class="item">检验数量:</span>
							<el-input style="width: 100px;" :disabled="isDisabled" size="mini"
								type="Number" class="textCenter" v-model.number="info.testNum" clearable></el-input>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8" class="label">
							<span class="item">辅料名称:</span>
							<div>{{info.ingredientsName}}</div>
						</el-col>
						<el-col :span="6" class="label">
							<span class="item">辅料编号:</span>
							<div>{{info.ingredientsCode}}</div>
						</el-col>
						<el-col :span="4" class="label">
							<span class="item">类别:</span>
							<div>{{info.category}}</div>
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="4">
					<!--:headers="headers"-->
					<!-- :on-preview="handlePictureCardPreview" -->
					<el-upload
					    class="avatar-uploader"
					    :class="{disabled:uploadDisabled}"
						:disabled="isDisabled"
						:action="url+api.uploadQualit"
						:before-upload="beforeUpload"
						list-type="picture-card"
						:headers="headers"
						:on-remove="handleRemove"
						:on-success="handleAvatarSuccess">
						<img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar" style="width:100%;height: 100%;"/>
						<i class="el-icon-plus" v-else></i>
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
					<el-select  v-model="row[item.prop]" v-if="item.prop == 'verdict'">
						<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">

						</el-option>
					</el-select>
					<el-input placeholder="请输入内容" :disabled="isDisabled" v-model="row[item.prop]" clearable v-else></el-input>
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
			<!-- 按钮 -->
			<div class="btn" :hidden="btnhides">
				<el-button type="primary" @click="sendTrue" v-has:check>通过</el-button>
				<el-button type="danger" @click="sendFalse" v-has:check>拒绝</el-button>
			</div>
		</div>
		<!--品管部-->
		<div class="quality box" :class="qualityPass!==null?(qualityPass?'isPassTrue':'isPassFalse'):''" :hidden="hide">
			<h3>品管部</h3>
			<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
			<el-input class="opinion" type="textarea" :disabled="qualityPass!==null?true:false"
				:autosize="{ minRows: 5, maxRows: 8}" v-model="qualityValue"></el-input>
			<!-- 按钮 -->
			<div class="btn" :hidden="qualityPass!==null?true:false">
				<el-button type="primary" @click="opiclick(1)" :disabled="btndis" v-has:quality>通过</el-button>
				<el-button type="danger" @click="opiclick(2)" :disabled="btndis" v-has:quality>拒绝</el-button>
			</div>
		</div>
		<!--采购部/客户-->
		<div class="quality box" :class="purchasePass!==null?(purchasePass?'isPassTrue':'isPassFalse'):''" :hidden="hide">
			<h3>采购部/客户</h3>
			<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
			<el-input class="opinion" type="textarea" :disabled="purchasePass!==null?true:false"
				:autosize="{ minRows: 5, maxRows: 8}" v-model="purchaseValue"></el-input>
			<!-- 按钮 -->
			<div class="btn" :hidden="purchasePass!==null?true:false">
				<el-button type="primary" @click="opiclick(3)" :disabled="btndis" v-has:purchase>通过</el-button>
				<el-button type="danger" @click="opiclick(4)" :disabled="btndis" v-has:purchase>拒绝</el-button>
			</div>
		</div>
		<!--技术部-->
		<div class="quality box" :class="technologyPass!==null?(technologyPass?'isPassTrue':'isPassFalse'):''" :hidden="hide">
			<h3>技术部</h3>
			<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
			<el-input class="opinion" type="textarea" :disabled="technologyPass!==null?true:false"
				:autosize="{ minRows: 5, maxRows: 8}" v-model="technologyValue"></el-input>
			<!-- 按钮 -->
			<div class="btn" :hidden="technologyPass != null?true:false">
				<el-button type="primary" @click="opiclick(5)" :disabled="btndis" v-has:technology>通过</el-button>
				<el-button type="danger" @click="opiclick(6)" :disabled="btndis" v-has:technology>拒绝</el-button>
			</div>
		</div>
		<!--生产部-->
		<div class="quality box" :class="productionPass!==null?(productionPass?'isPassTrue':'isPassFalse'):''" :hidden="hide">
			<h3>生产部</h3>
			<div style="text-align: left;margin-left: 80px;font-weight: bold;">审批意见:</div>
			<el-input class="opinion" type="textarea" :disabled="productionPass!==null?true:false"
				:autosize="{ minRows: 5, maxRows: 8}" v-model="productionValue"></el-input>
			<!-- 按钮 -->
			<div class="btn" :hidden="productionPass != null?true:false">
				<el-button type="primary" @click="opiclick(7)" :disabled="btndis" v-has:production>通过</el-button>
				<el-button type="danger" @click="opiclick(8)" :disabled="btndis" v-has:production>拒绝</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import warehousing from '@/api/ingredients/warehousing.js'
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import {mapGetters} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props: {
			value: {
				type: Object
			},
		},
		watch: {
			value(v) {
				this.row = v
			},
		},
		data() {
			return {
				url: process.env.VUE_APP_BASE_URL,
				headers: {},
				row:this.value,
				isDisabled:false,//基础信息禁用
				uploadDisabled:false,//是否已上传
				dialogImageUrl:'',
				dialogVisible: false,
				id:'',
				opinionId:'',
				info:{
					name:'',
					id:'',
					receivedNum:'',
					testNum:'',
					ingredientsName:'',
					ingredientsCode:'',
					category:'',
				},
				dataSource:[{specification:'',facade:'',aberration:'',record:'',verdict:''}],
				columns:[...warehousing.detailsColumns],
				statusOptions:[{
					value:'合格',
					label:'合格'
				},{
					value:'不合格',
					label:'不合格'
				}],
				hide:true,
				btnhides:false,
				btndis:false,
				qualityPass:null,//品管状态
				qualityValue:'',
				purchasePass:null,//采购状态
				purchaseValue:'',
				technologyPass:null,//技术部
				technologyValue:'',
				productionPass:null,//生产
				productionValue:''
			}
		},
		created() {
			this.headers['Authorization'] = this.token;
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList(){
				console.log(this.row)
				if(this.row.type == 0){
					warehousing.get(this.api.ingCheckDetail,{id:this.row.id}).then(res=>{
						console.log(1)
						var data = res.data
						this.hide = false
						this.btndis = true
						// this.btnhide = true
						// this.qualityPass = 1
						// this.purchasePass = 1
						// this.technologyPass = 1
						// this.productionPass = 1
						this.btnhides = true
						this.getData(data)
					})
				}else if(this.row.type == 1){
					warehousing.get(this.api.ingPurchaseDetail,{id:this.row.id}).then(res=>{
						console.log(2)
						var data = res.data
						if(data.isQualified == false){
							this.hide = false
							// this.btnhide = false
							this.btnhides = true
						}
						this.getData(data)
					})
				}
			},
			//上传
			beforeUpload(res, file) {
				let i = res.type.indexOf('image')
				if (i == '-1') {
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
				this.uploadDisabled = true;
			},
			handleRemove(file, fileList) {
				this.uploadDisabled = false;
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				console.log(file)
				this.dialogImageUrl = file.response.data.fileHttpPath;
				console.log(this.dialogImageUrl)
				this.dialogVisible = true;
			},
			handleAvatarSuccess(res, file) {
				console.log(res)
				console.log(file)
			    // this.dialogImageUrl = URL.createObjectURL(file.raw);
				this.dialogImageUrl = res.data.fileHttpPath
				console.log(this.dialogImageUrl)
			},
			addList(){
				if(this.isDisabled){
					return
				}
				let obj = {specification:'',facade:'',aberration:'',record:'',verdict:''};
				this.dataSource.push(obj);
			},
			delList(index){
				if(this.isDisabled){
					return
				}
				this.dataSource.splice(index,1)
			},
			getData(data){
				this.info.name = data.clientName
				this.info.id = data.contractNo
				this.info.receivedNum = data.takeNum
				this.info.testNum = data.checkNum
				this.info.ingredientsName = data.ingredientsName
				this.info.ingredientsCode = data.ingredientsCode
				this.info.category = data.classification
				this.dialogImageUrl = data.image
				if(data.ingredientsEntryExplainList != null){
					this.dataSource = data.ingredientsEntryExplainList
				}
				this.qualityValue = data.qualityControlOpinion
				this.qualityPass = data.qualityControlPass
				this.purchaseValue = data.procurementOpinion
				this.purchasePass = data.procurementPass
				this.technologyValue = data.developmentOpinion
				this.technologyPass = data.developmentPass
				this.productionValue = data.productionOpinion
				this.productionPass = data.productionPass
				this.opinionId = data.opinionId
				this.id = data.id
			},
			sendTrue(){
				var data ={checkNum:this.info.testNum,classification:this.info.category,clientName:this.info.name,contractNo:this.info.id,
				developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,image:this.dialogImageUrl,ingredientsCode:this.info.ingredientsCode,
				ingredientsEntryExplainList:this.dataSource,ingredientsName:this.info.ingredientsName,procurementOpinion:this.purchaseValue,
				procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
				qualityControlPass:this.qualityPass,takeNum:this.info.receivedNum}
				data['purchaseId'] = this.row.id
				// data['id'] = this.id
				data['isQualified'] = true
				warehousing.put(this.api.addIngDetail,data).then(res=>{
					console.log(res)
					this.$message.success('提交成功')
					this.$emit('entrycloseDio',false)
				})
			},
			sendFalse(){
				var data ={checkNum:this.info.testNum,classification:this.info.category,clientName:this.info.name,contractNo:this.info.id,
				developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,image:this.dialogImageUrl,ingredientsCode:this.info.ingredientsCode,
				ingredientsEntryExplainList:this.dataSource,ingredientsName:this.info.ingredientsName,procurementOpinion:this.purchaseValue,
				procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
				qualityControlPass:this.qualityPass,takeNum:this.info.receivedNum}
				data['purchaseId'] = this.row.id
				// data['id'] = this.id
				data['isQualified'] = false
				warehousing.put(this.api.addIngDetail,data).then(res=>{
					console.log(res)
					this.$message.success('提交成功')
					this.$emit('entrycloseDio',false)
				})
			},
			opiclick(value){
				if(value == 1){
					this.qualityPass = true
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 2){
					this.qualityPass = false
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 3){
					this.purchasePass = true
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 4){
					this.purchasePass = false
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 5){
					this.technologyPass = true
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 6){
					this.technologyPass = false
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 7){
					this.productionPass = true
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}else if(value == 8){
					this.productionPass = false
					var data = {developmentOpinion:this.technologyValue,developmentPass:this.technologyPass,procurementOpinion:this.purchaseValue,
					procurementPass:this.purchasePass,productionOpinion:this.productionValue,productionPass:this.productionPass,qualityControlOpinion:this.qualityValue,
					qualityControlPass:this.qualityPass,type:2}
					data['entryId'] = this.id
					if(this.opinionId != null){
						data['id'] = this.opinionId
					}
					warehousing.post(this.api.ingaddOpinion,data).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('entrycloseDio',false)
					})
				}
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
			font-weight: bold;
			line-height: 75px;
			.item{
				width: 70px;
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
		height: 330px;
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
		padding-top: 20px;
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

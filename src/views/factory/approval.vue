<!--
 * @FileDescription: 产前样批版
 * @Author: wangpenghui
 * @Date: 2021/3/12
 -->
<template>
	<div style="text-align: center;height: calc(100vh - 134px);overflow: overlay;padding-bottom: 10px;">
		<!-- 标题 -->
		<h1>产前样批版会签</h1>

		<!-- 基础信息 -->
		<div class="info box">
			<h3>基础信息</h3>
			<div class="body">
				<span>工厂 : {{information.factory}}</span>
				<span>公司货号 : {{information.itemNo}}</span>
				<span>生产数量 : {{information.count}}</span>
				<span>大货货期 : {{information.deliveryTime}}</span>
				<span>类型 : {{information.type}}</span>
			</div>
		</div>
		<!-- 图片查看 -->
		<jod-dragDialog v-model="dialogVisible" class="tableDialog" :modal="false">
			<img width="100%" :src="dialogImageUrl" alt="">
		</jod-dragDialog>
		<!-- 跟单员 -->
		<div class="operator box" :class="opeAdoptShow!==null?(opeAdoptShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>跟单员</h3>
			<!-- 表格 -->
			<div class="body">
				<div class="size" v-if="operatorTable">
					<div class="size_item">
						<el-select  v-model="operator.size" placeholder="" :size="size"
						 style="width: 80px;" @change="selectSize">
							<el-option
							  v-for="item in operatorOptions"
							  :key="item.value"
							  :label="item.label"
							  :value="item.value">
							</el-option>
						</el-select>
						<div class="text">码</div>
					</div>
					
				</div>
				<div class="table" v-if="operatorTable">
					<transition name="fade" mode="out-in">
						<jod-tableList :dataSource="operator.gridData" :columns="operator.columns"
							:options="{tHeight:'130px'}" :border="true">
							<template :slot="operator.columns[index].prop" v-for="(item,index) in operator.data"
								slot-scope="{row,$index}">
								<div style="display: flex;justify-content: space-around;" :key="index">
									<div v-if="item !== 'td'">
										<el-input  size="mini" type="Number"
										  class="textCenter" v-if="row[item].type=='button'" v-model.number="row[item].value"
										  @input="salaryChange($event,row[item])">
										</el-input>
										<div v-else :class="color(row[item])">
											{{row[item].value}}
										</div>
									</div>
									<div v-else>
										{{row[item]}}
									</div>
								</div>
							</template>
						</jod-tableList>
					</transition>
				</div>
			</div>
			<!-- 动态上传 -->
			<div v-for="(data,index) in operator.list" :key="index">
				<div style="display: flex;margin-top: 5px;">
					<div class="label" v-if="!data.disable">
						{{ data.label }}
					</div>
					<div class="label" v-else>
						<el-input  size="mini" v-model="data.label" clearable></el-input>
					</div>
					<el-radio-group  v-model="data.isPass" size="mini" class="isPass" :fill="data.isPass?'#1890ff':'#ff4949'">
						<el-radio-button :label="true">通过</el-radio-button>
						<el-radio-button :label="false" type="danger">拒绝</el-radio-button>
					</el-radio-group>
					<el-input  placeholder="备注" size="mini" class="remark" v-model="data.remark" clearable>
					</el-input>
					<el-upload class="upload-demo" :action="url+api.uploadQualit" :headers="headers"
						:on-success="handleChange"  :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed"
						:file-list="data.images" :on-preview="handlePictureCardPreview">
						<el-button  size="mini" type="primary" @click="uploadId(data)">上传</el-button>
						<!-- :action="url+this.api.uploadQualit" -->
					</el-upload>
					<div v-if="opeAdoptShow==null" class="addBt">
						<el-button v-if="data.disable" :size="size" type="danger" icon="el-icon-minus" circle
							style="margin-left: 10px;" @click="delItem(index)"></el-button>
						<el-button v-if="index==(operator.list.length-1)" type="success" :size="size"
							icon="el-icon-plus" circle style="margin-left: 10px;" @click="addItem">
						</el-button>
					</div>
				</div>
			</div>
			<div class="size" style="margin-top: 10px;">
				<div class="size_item">
					<div class="text2">设计师</div>
					<el-select  v-model="operator.user" placeholder="" :size="size"
					 style="width: 550px;" multiple filterable remote :remote-method="remoteMethod" :loading="userLoading">
						<el-option v-for="item in userOptions" :key="item.value"
						:label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- 按钮 -->
			<div class="btn" >
				<el-button v-if="opeAdoptShow==null||opeAdoptShow" :size="size" type="primary" :disabled="opeAdopt2" :loading="opeAdopt1" @click="opeAdopt(true)" v-has:merchandiser>通过</el-button>
				<el-button v-if="opeAdoptShow==null||opeAdoptShow" :size="size" type="danger" :disabled="opeAdopt1" :loading="opeAdopt2" @click="opeAdopt(false)" v-has:merchandiser>拒绝</el-button>
				<el-button v-if="opeAdoptShow==null||opeAdoptShow" :size="size" type="warning" :disabled="opeAdopt3" :loading="opeAdopt3" @click="skip()" v-has:merchandiser>跳过</el-button>
			</div>
		</div>

		<!-- 设计开发 -->
		<div class="development box" :class="devAdoptShow!==null?(devAdoptShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>设计开发</h3>
			<div v-for="(item,devIndex) in development.list" :key="devIndex" style="margin: 20px 80px;">
				<h4>{{item.label}}</h4>
				<el-row>
					<el-col :span="8" v-for="(data,iIndex) in item.developmentList" :key="iIndex">
						<div style="display: table;">
							<div class="label">
								{{ data.label }}
							</div>
							<el-radio-group :disabled="devAdoptShow!==null" v-model="data.isPass" size="mini" class="isPass" :fill="data.isPass?'#1890ff':'#ff4949'">
								<el-radio-button :label="true">通过</el-radio-button>
								<el-radio-button :label="false">拒绝</el-radio-button>
							</el-radio-group>
							<el-input placeholder="备注" :disabled="devAdoptShow!==null" size="mini" class="remark" v-model="data.remark" clearable>
							</el-input>
							<el-upload class="upload-demo" :action="url+api.uploadQualit" :headers="headers"
								:on-success="handleChange" :before-upload="beforeUpload" :limit="1"
								:on-exceed="handleExceed" :disabled="devAdoptShow!==null" :file-list="data.images"
								:on-preview="handlePictureCardPreview">
								<el-button :disabled="devAdoptShow!==null" size="mini" type="primary" @click="uploadId(data)">上传</el-button>
								<!-- :action="url+this.api.uploadQualit" -->
							</el-upload>
						</div>
					</el-col>
				</el-row>
			</div>
			<div style="text-align: left;margin-left: 80px;">审核意见:</div>
			<el-input class="opinion" type="textarea" :disabled="devAdoptShow!==null"
			  :autosize="{ minRows: 5, maxRows: 8}" v-model="development.exteriorOpinion"></el-input>
			<!-- 按钮 -->
			<div class="btn">
				<el-button v-if="devAdoptShow==null" :size="size" type="primary" :disabled="devAdopt2" :loading="devAdopt1" @click="devAdopt(true)" v-has:development>通过</el-button>
				<el-button v-if="devAdoptShow==null" :size="size" type="danger" :disabled="devAdopt1" :loading="devAdopt2" @click="devAdopt(false)" v-has:development>拒绝</el-button>
			</div>
		</div>

		<!-- 品牌外协生产部 -->
		<div class="quality box" :class="productionShow!==null?(productionShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>品牌外协生产部</h3>
			<div style="text-align: left;margin-left: 80px;">审核意见:</div>
			<el-input class="opinion" type="textarea" :disabled="productionShow!==null"
			  :autosize="{ minRows: 5, maxRows: 8}" v-model="productionOpinion"></el-input>
			<div class="btn">
				<el-button v-if="productionShow==null" :size="size" type="primary" :disabled="proAdopt2"
				  :loading="proAdopt1" @click="proAdopt(true)" v-has:product>通过</el-button>
				<el-button v-if="productionShow==null" :size="size" type="danger" :disabled="proAdopt1"
				  :loading="proAdopt2" @click="proAdopt(false)" v-has:product>拒绝</el-button>
			</div>
		</div>

		<!-- 技术部 -->
		<div class="technology box" :class="tecAdoptShow!==null?(tecAdoptShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>技术部</h3>
			<div style="height: 160px;">
				<div v-for="(item,tecIndex) in technology.list" :key="tecIndex" style="margin-left: 80px;">
					<el-col :span="12" style="height: 80px;">
						<div style="display: flex;height: 100%;">
							<div class="label">
								{{ item.label }}
							</div>
							<el-radio-group :disabled="tecAdoptShow!==null" v-model="item.isPass" size="mini" class="isPass" :fill="item.isPass?'#1890ff':'#ff4949'">
								<el-radio-button :label="true">通过</el-radio-button>
								<el-radio-button :label="false">拒绝</el-radio-button>
							</el-radio-group>
							<el-input :disabled="tecAdoptShow!==null" placeholder="备注" size="mini" class="remark" v-model="item.remark" clearable>
							</el-input>
							<el-upload class="upload-demo" :action="url+api.uploadQualit" :headers="headers"
								:on-success="handleChange" :before-upload="beforeUpload" :limit="1"
								:on-exceed="handleExceed" :disabled="tecAdoptShow!==null" :file-list="item.images"
								:on-preview="handlePictureCardPreview">
								<el-button :disabled="tecAdoptShow!==null" size="mini" type="primary" @click="uploadId(item)">上传</el-button>
								<!-- :action="url+this.api.uploadQualit" -->
							</el-upload>
						</div>
					</el-col>
				</div>
			</div>
			<div style="text-align: left;margin-left: 80px;">审核意见:</div>
			<el-input class="opinion" type="textarea" :disabled="tecAdoptShow!==null"
			  :autosize="{ minRows: 5, maxRows: 8}" v-model="technology.exteriorOpinion"></el-input>
			<!-- 按钮 -->
			<div class="btn">
				<el-button v-if="tecAdoptShow==null" :size="size" type="primary" :disabled="tecAdopt2" :loading="tecAdopt1" @click="tecAdopt(true)" v-has:technology>通过</el-button>
				<el-button v-if="tecAdoptShow==null" :size="size" type="danger" :disabled="tecAdopt1" :loading="tecAdopt2" @click="tecAdopt(false)" v-has:technology>拒绝</el-button>
			</div>
		</div>

		<!-- 品质部 -->
		<!-- <div class="quality box" :class="quaAdoptShow!==null?(quaAdoptShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>品质部</h3>
			<div style="height: 240px;">
				<div v-for="item in quality.list" style="margin-left: 80px;">
					<el-col :span="12" style="height: 80px;">
						<div style="display: flex;height: 100%;">
							<div class="label">
								{{ item.label }}
							</div>
							<el-radio-group :disabled="quaAdoptShow!==null" v-model="item.isPass" size="mini" class="isPass" :fill="item.isPass?'#1890ff':'#ff4949'">
								<el-radio-button :label="true">通过</el-radio-button>
								<el-radio-button :label="false">拒绝</el-radio-button>
							</el-radio-group>
							<el-input :disabled="quaAdoptShow!==null" placeholder="备注" size="mini" class="remark" v-model="item.remark" clearable>
							</el-input>
							<el-upload class="upload-demo" :action="url+api.uploadQualit" :headers="headers"
								:on-success="handleChange" :before-upload="beforeUpload" :limit="1"
								:on-exceed="handleExceed" :disabled="quaAdoptShow!==null" :file-list="item.images"
								:on-preview="handlePictureCardPreview">
								<el-button :disabled="quaAdoptShow!==null" size="mini" type="primary" @click="uploadId(item)">上传</el-button>
							</el-upload>
						</div>
					</el-col>
				</div>
			</div>
			<div style="text-align: left;margin-left: 80px;">外观审核意见:</div>
			<el-input class="opinion" type="textarea" :disabled="quaAdoptShow!==null" :autosize="{ minRows: 5, maxRows: 8}" v-model="quality.opinion"></el-input>
			<div class="btn">
				<el-button v-if="quaAdoptShow==null" :size="size" type="primary" :disabled="quaAdopt2" :loading="quaAdopt1" @click="quaAdopt(true)" v-has:quality>通过</el-button>
				<el-button v-if="quaAdoptShow==null" :size="size" type="danger" :disabled="quaAdopt1" :loading="quaAdopt2" @click="quaAdopt(false)" v-has:quality>拒绝</el-button>
			</div>
		</div> -->

		<!-- 整体确认 -->
		
		<div class="whole box" :class="wholeAdoptShow!==null?(!wholeAdoptShow&&isLoading?'isPassFalse':'isPassTrue'):''">
			<h3>整体确认</h3>
			<div style="text-align: left;margin-left: 80px;margin-top: 20px;">审核意见:</div>
			<el-input class="opinion" type="textarea" :autosize="{ minRows: 5, maxRows: 8}" v-model="whole"></el-input>
			<!-- 按钮 -->
			<div class="btn">
				<transition name="fade" mode="out-in">
					<div v-if="wholeAdoptShow">
						<el-button :size="size" type="primary" @click="isPreview('autograph')">
							会签单预览
						</el-button>
						<el-button :size="size" type="primary" @click="isPreview('approval')">
							批版单预览
						</el-button>
					</div>
					<div v-else>
						<el-button :size="size" type="primary"
							:disabled="opeAdoptShow==null||devAdoptShow==null||productionShow==null||tecAdoptShow==null"
							:loading="wholeAdopt1"
							@click="wholeAdopt(true)" v-has:overall>通过</el-button>
						<el-button :size="size" type="danger"
							:disabled="wholeAdopt1"
							:loading="wholeAdopt2"
							@click="wholeAdopt(false)" v-has:overall>拒绝</el-button>
					</div>
				</transition>
			</div>
		</div>
		<!-- 会签预览 -->
		<jod-dragDialog class="tableDialog" :drag="true" v-model="preview" top="10px" :dialogStyle="{width: '850',widthType: 'px'}" title="预览">
			<preview v-if="preview" v-model="goodsId" :operatorOptions="operatorOptions"></preview>
		</jod-dragDialog>
		<!-- 批版预览 -->
		<jod-dragDialog class="tableDialog" :drag="true" v-model="preview2" top="10px" :dialogStyle="{width: '850',widthType: 'px'}" title="预览">
			<preview2 v-if="preview2" v-model="goodsId" :operatorOptions="operatorOptions"></preview2>
		</jod-dragDialog>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import json from '@/api/factory/approval.js'
	import preview from './components/preview.vue'
	import preview2 from './components/preview2.vue'
	import { loading } from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			'preview':preview,
			'preview2':preview2
		},
		filters:{
			imgList(val,old){
				let list = []
			    if (val){
					console.log(val)
					list = [{name:'1',url:val}]
					return list
			    }

			}
		},
		data() {
			return {
				isLoading:false,//初始化
				url: process.env.VUE_APP_BASE_URL,
				headers: {},
				fileList: [],
				isAcc:false,//是否为配饰
				uploadItem: null, //上传暂存
				goodsId:null,
				loading:null,
				//基础信息
				information: {},
				//跟单员
				opeAdoptShow:null,
				operatorOptions:null,//跟单员尺码
				operatorTable:false,//跟单员表格
				opeAdopt1:false,
				opeAdopt2:false,
				opeAdopt3:false,
				userLoading:false,//设计师加载
				userOptions:[],//设计师列表
				operator: {
					size: '',
					user:'',
					data: [],
					gridData: [], //源数据
					columns: json.columns,
					list: JSON.parse(JSON.stringify(json.list))
				},
				//设计开发
				devAdoptShow:null,
				devAdopt1:false,
				devAdopt2:false,
				development: JSON.parse(JSON.stringify(json.development)),
				//外协生产
				productionShow:null,
				proAdopt1:false,
				proAdopt2:false,
				productionOpinion:'',
				//技术部
				tecAdoptShow:null,
				tecAdopt1:false,
				tecAdopt2:false,
				technology: JSON.parse(JSON.stringify(json.technology)),
				//品质
				quaAdoptShow:null,
				quaAdopt1:false,
				quaAdopt2:false,
				quality: JSON.parse(JSON.stringify(json.quality)),
				//整体意见
				wholeAdoptShow:null,
				wholeAdopt1:false,
				wholeAdopt2:false,
				whole:'',
				preview:false,//会签预览
				preview2:false,//批版预览
				dialogVisible:false,//图片查看
				dialogImageUrl:'',
			}
		},
		watch:{
			$route:{
				handler(to, from){
					this.isLoading = false;
					this.loading = loading(document.getElementsByClassName('app-main')[0]);
					this.headers['Authorization'] = this.token;
					this.goodsId = to.query.id;
					//this.isAcc = to.query.isAcc;
					if(!this.goodsId){
						this.$router.push({path:'/factory/factoryShopList'});
						this.loading.close();
					}else{
						// /location.reload()
						this.getData()
					}
				},
				immediate: true
			}
		},
		created() {
			this.remoteMethod('');//获取设计师
		},
		mounted() {

		},
		beforeDestroy() {
			//Object.assign(this.$data.operator, this.$options.data.call(this).operator)
		},
		methods: {
			async getData(){
				try{
					let res = await json.get(this.api.findEditionSign,{goodsId:this.goodsId});
					if(res.code==0){
						let {merchandiser,development,technology,product,quality,overallOpinion,
						  isPass,information} = res.data;
						let opeAdoptShow = merchandiser&&merchandiser.isPass!==null?!merchandiser.isPass:null;//跟单员状态;
						this.opeAdoptShow = opeAdoptShow;
						let devAdoptShow = development&&development.isPass!==null?!development.isPass:null;//设计开发状态
						this.devAdoptShow = devAdoptShow;
						let tecAdoptShow = technology&&technology.isPass!==null?!technology.isPass:null;//技术部状态
						this.tecAdoptShow = tecAdoptShow;
						
						let productionShow = product&&product.isPass!==null?!product.isPass:null;//生产部
						this.productionShow = productionShow;
						// let quaAdoptShow = quality&&quality.isPass!==null?!quality.isPass:null;//品质部状态
						// this.quaAdoptShow = quaAdoptShow;
						
						this.wholeAdoptShow = isPass;//整体状态
						this.information = information
						//跟单员动态数据
						let size = await json.get(this.api.findSize,{goodsId:this.goodsId});//获取尺码
						let newSize = [];
						if(size.data){
							console.log(size);
							newSize = await json.sizeHandler(size.data);
							console.log(newSize)
							this.operatorOptions = newSize;
						}

						//跟单员
						if(merchandiser&&merchandiser.specificationList&&merchandiser.specificationList.length!==0){
							let sizeValue = merchandiser.size?merchandiser.size:'';//merchandiser.size?merchandiser.size:'';
							let newSizeValue = '';
							if(sizeValue){
								newSizeValue = newSize.find(x => x.value == sizeValue).label;//id换label
							}
							//有尺码数据
							if(newSize){
								let sizeId = await json.sizeIdHandler(this.operatorOptions,newSizeValue);//尺码
								let res = await json.get(this.api.findValue,{standardId:sizeId,goodsId:this.goodsId});//部位
								let headerList = await json.headerHandler(res.data);//表头处理
								this.operator.columns = headerList;//表头
								let tableHandler = await json.tableHandler(res.data,this.operator.data);//表数据处理
								//this.operator.gridData = tableHandler[0];//静态表数据
								this.operator.data = tableHandler[1];
								let reverseSpecificationList = await json.reverseSpecificationList(tableHandler[0],merchandiser.specificationList);
								this.operator.size = sizeId;//尺码
								this.operator.gridData = reverseSpecificationList;//表数据
								this.operatorTable = true;
							}
							// let reverseList = await json.reverseList(this.operator.list,merchandiser.editionCheckList)
							// console.log(reverseList)
							
						}else{
							let findContent = await json.get(this.api.findContent,{goodsId:this.goodsId});
							console.log(findContent)
							findContent.data.forEach((item,index)=>{
								let obj = {
									id: null,
									label: item.content,
									isPass: '',
									remark: '',
									images: [],
								};
								this.operator.list.push(obj)
							})
						}
						if(merchandiser.editionCheckList&&merchandiser.editionCheckList.length!==0){
							this.operator.list = merchandiser.editionCheckList;//动态上传
						}
						this.operator.user = merchandiser.user;//动态上传
						//设计开发
						if(development&&development.development&&development.development.length!==0){
							let reverseDevelopmentList = await json.reverseDevelopmentList(this.development.list,development.development);
							//console.log(reverseDevelopmentList)
							this.development.exteriorOpinion = development.developmentOpinion;
							console.log(development)
							this.development.list = reverseDevelopmentList;
						}
						//生产部
						if(product){
							this.productionOpinion = product.productionOpinion;//品质部外部备注
						}
						//技术部上传
						if(technology&&technology.editionCheckList&&technology.editionCheckList.length!==0){

							let resverseEditionCheckList = await json.resverseEditionCheckList(this.technology.list,technology.editionCheckList)

							this.technology.list = resverseEditionCheckList;
							this.technology.exteriorOpinion = technology.technologyOpinion
						}
						//品质部
						// if(quality&&quality.editionCheckList&&quality.editionCheckList.length!==0){
						// 	let resverseQualityList = await json.resverseQualityList(this.quality,quality.editionCheckList)
						// 	this.quality.list = resverseQualityList;//上传
						// 	this.quality.opinion = quality.exteriorOpinion;//品质部外部备注
						// }
						this.whole = overallOpinion?overallOpinion:'';//整体备注
					}
					this.isLoading = true;
					this.loading.close();
				}catch(e){
					if(typeof e == 'string'){
						this.$message.error(e);
					}
					console.log(e)
					this.$router.push({path:'/factory/factoryShopList'});
				}finally{
					this.loading.close();
				}
			},
			//上传成功
			handleChange(response, file, fileList) {
				this.uploadItem.images[0] = {name:file.name,url:file.response.data.fileHttpPath}
				//this.uploadItem = [];
				//this.uploadItem.push({name:file,url:file.response.data.fileHttpPath})
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
				this.uploadItem = item
			},
			//跟单员
			async selectSize(value){
				let sizeId = await json.reverSize(this.operatorOptions,value)
				let res = await json.get(this.api.findValue,{standardId:sizeId,goodsId:this.goodsId});
				let headerList = await json.headerHandler(res.data);//表头处理
				this.operator.columns = headerList;//表头
				let tableHandler = await json.tableHandler(res.data,this.operator.data);//表数据处理
				this.operator.gridData = tableHandler[0];//表数据
				this.operator.data = tableHandler[1];
				this.operatorTable = true;
			},
			async opeAdopt(value) {
				
				// setTimeout(()=>{
				// 	this.opeAdopt1 = false;
				// 	this.opeAdopt2 = false;
				// 	if(value)this.opeAdoptShow = false;
				// 	else this.opeAdoptShow = true;
				// })
				try{
					let verification = await json.verification(this.operator.list);
					let {data,gridData,list,size,user} = this.operator;
					if(user.length==0){
						this.$message({
							message: '请选择设计师',
							type: 'warning'
						});
						return
					}
					this.opeAdopt3 = true;
					if(value)this.opeAdopt1 = true;
					else this.opeAdopt2 = true;
					let specificationList = [];
					console.log(gridData,data)
					if(gridData.length!==0&&data.length!==0){
						specificationList = await json.specificationList(gridData,data);
						specificationList.splice(0,1);
					}
					let editionCheckList = await json.editionCheckList(list);
					let obj = {
						editionCheckList,
						'goodsId':this.goodsId,
						'isPass':value,
						size,
						user,
						specificationList
					}
					console.log(obj)
					let res = await json.post(this.api.merchandiser,obj)
					if(res.code==0){
						this.opeAdopt3 = false;
						this.opeAdopt1 = false;
						this.opeAdopt2 = false;
						if(value)this.opeAdoptShow = false;
						else this.opeAdoptShow = true;
						this.$message.success('操作成功')
					}
				}catch(e){
					this.opeAdopt3 = false;
					this.opeAdopt1 = false;
					this.opeAdopt2 = false;
					this.$message.error(e)
				}
			},
			//跳过
			skip(){
				this.opeAdopt1 = true;
				this.opeAdopt2 = true;
				this.opeAdopt3 = true;
				json.get(this.api.skip,{'goodsId':this.goodsId}).then(res=>{
					this.opeAdopt1 = false;
					this.opeAdopt2 = false;
					this.opeAdopt3 = false;
					this.$router.go(-1);
				})
			},
			salaryChange(event,value){
				if(event==''){
					value.value = 0
				}
				let num1 = Number(event) - value.standardValue;
				let isNum = String(num1).indexOf('.')
				if(isNum!==-1){
					num1 = num1.toFixed(1)
				}
				let partName = value.standardName;
				this.$set(this.operator.gridData[1][partName],'value',num1)
			},
			color(value){
				if(value.value<=-value.deviationMinus||value.value>=value.deviationPositive){
					return 'colorRed'
				}else{
					return 'colorGreen'
				}
			},
			//新增
			addItem() {
				let item = {
					label: '',
					isPass: '',
					fill: '',
					remark: '',
					images: [],
					disable:true
				}
				this.operator.list.push(item)
			},
			//删除
			delItem(index) {
				console.log(index)
				this.operator.list.splice(index, 1)
			},
			//获取设计师
			remoteMethod(value){
				this.userLoading = true;
				json.get(this.api.getDesigner,{'keywords':value}).then(res=>{
					//this.totaldata=res.data
					let list = res.data.reduce((total,current)=>{
						if(!current.no){
							this.$message({
								message: `${current.name}数据丢失,请联系管理员`,
								type: 'warning'
							});
						}
						let obj = {
							'label':`${current.name}:${current.no}`,
							'value':current.no
						};
						total.push(obj);
						return total
					},[]);
					this.userOptions = list;
					this.userLoading = false;
				})
			},
			//设计开发
			async devAdopt(value) {
				if(value)this.devAdopt1 = true;
				else this.devAdopt2 = true;
				// setTimeout(()=>{
				// 	this.devAdopt1 = false;
				// 	this.devAdopt2 = false;
				// 	if(value)this.devAdoptShow = false;
				// 	else this.devAdoptShow = true;
				// })
				try {
					let verification = await json.verificationDev(this.development.list);
					let development = await json.developmentList(this.development.list)
					let obj = {
						'goodsId':this.goodsId,
						'isPass':value,
						development,
						'developmentOpinion':this.development.exteriorOpinion
					}
					let res = await json.post(this.api.development,obj)
					if(res.code==0){
						this.devAdopt1 = false;
						this.devAdopt2 = false;
						if(value)this.devAdoptShow = false;
						else this.devAdoptShow = true;
						this.$message.success('操作成功')
					}
				}catch(e){
					this.devAdopt1 = false;
					this.devAdopt2 = false;
					this.$message.error(e)
				}
			},
			//外协生产
			async proAdopt(value){
				console.log(value);
				if(value)this.proAdopt1 = true;
				else this.proAdopt2 = true;
				// setTimeout(()=>{
				// 	this.proAdopt1 = false;
				// 	this.proAdopt2 = false;
				// 	if(value)this.productionShow = false;
				// 	else this.productionShow = true;
				// })
				try{
					let obj = {
						'goodsId':this.goodsId,
						'isPass':value,
						'productionOpinion':this.productionOpinion
					}
					console.log(obj);
					let res = await json.post(this.api.product,obj)
					if(res.code==0){
						if(value)this.productionShow = false;
						else this.productionShow = true;
						this.$message.success('操作成功')
					}
				}catch(e){
					this.proAdopt1 = false;
					this.proAdopt2 = false;
					this.$message.error(e)
				}
			},
			//技术部
			async tecAdopt(value) {
				if(value)this.tecAdopt1 = true;
				else this.tecAdopt2 = true;
				// setTimeout(()=>{
				// 	this.tecAdopt1 = false;
				// 	this.tecAdopt2 = false;
				// 	if(value)this.tecAdoptShow = false;
				// 	else this.tecAdoptShow = true;
				// })
				try{
					let verification = await json.verificationTec(this.technology.list);
					let editionCheckList = await json.tecAdoptOrQuaAdopt(this.technology.list)
					let obj = {
						'goodsId':this.goodsId,
						'isPass':value,
						editionCheckList,
						'technologyOpinion':this.technology.exteriorOpinion
					}
					let res = await json.post(this.api.technology,obj)
					if(res.code==0){
						this.tecAdopt1 = false;
						this.tecAdopt2 = false;
						if(value)this.tecAdoptShow = false;
						else this.tecAdoptShow = true;
						this.$message.success('操作成功')
					}
				}catch(e){
					this.tecAdopt1 = false;
					this.tecAdopt2 = false;
					this.$message.error(e)
				}
			},
			//品质
			async quaAdopt(value){
				if(value)this.quaAdopt1 = true;
				else this.quaAdopt2 = true;
				try{
					let verification = await json.verificationQua(this.quality.list);
					let {list,opinion} = this.quality
					let editionCheckList = await json.tecAdoptOrQuaAdopt(list)
					let obj = {
						'goodsId':this.goodsId,
						'isPass':value,
						editionCheckList,
						'exteriorOpinion':opinion
					}
					let res = await json.post(this.api.quality,obj)
					if(res.code==0){
						this.quaAdopt1 = false;
						this.quaAdopt2 = false;
						if(value)this.quaAdoptShow = false;
						else this.quaAdoptShow = true;
						this.$message.success('操作成功')
					}
				}catch(e){
					this.quaAdopt1 = false;
					this.quaAdopt2 = false;
					this.$message.error(e)
				}
			},
			//整体意见
			async wholeAdopt(value){
				if(value)this.wholeAdopt1 = true;
				else this.wholeAdopt2 = true;
				// setTimeout(()=>{
				// 	this.wholeAdopt1 = false;
				// 	this.wholeAdopt2 = false;
				// 	if(value){
				// 		this.wholeAdoptShow = true;
				// 	}else{
				// 		this.wholeAdoptShow = false;
				// 		this.opeAdoptShow = null;
				// 		this.devAdoptShow = null;
				// 		this.productionShow = null;
				// 		this.tecAdoptShow = null;
				// 	}
				// })
				// let obj = {
				// 	'goodsId':this.goodsId,
				// 	'isPass':value,
				// 	'overallOpinion':this.whole?this.whole:'',
				// 	'user':this.operator.user
				// }
				let goodsId = this.goodsId;
				let whole = this.whole;
				let str = `?goodsId=${goodsId}&isPass=${value}&overallOpinion=${whole}&user=${this.operator.user}`
				try{
					let res = await json.post(this.api.qualityConfirm+str)
					if(res.code==0){
						this.wholeAdopt1 = false;
						this.wholeAdopt2 = false;
						if(value){
							this.wholeAdoptShow = true;
						}else{
							this.wholeAdoptShow = false;
							this.opeAdoptShow = null;
							this.devAdoptShow = null;
							this.productionShow = null;
							this.tecAdoptShow = null;
						}
						this.$message.success('操作成功')
					}
				}catch(e){
					this.$message.error(e)
					this.wholeAdopt1 = false;
					this.wholeAdopt2 = false;
				}
			},
			isPreview(value){
				if(this.productionShow!==null&&this.tecAdoptShow!==null&&this.devAdoptShow!==null&&this.opeAdoptShow!==null){
					this.preview = value=='autograph'?true:false;//会签
					this.preview2 = value=='approval'?true:false;//批版
				}else{
					this.$message.warning('存在未审批的流程')
				}
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
	.colorGreen{
		color: #32CD32;
	}
	.colorRed{
		color: #FF0000;
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
	h3 {
		padding-top: 20px;
		margin-left: 30px;
		text-align: left;
	}

	h4 {
		text-align: left;
	}

	//各主体外框
	.box {
		margin-top: 20px!important;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .1);
	}

	//各主体按钮
	.btn {
		padding-top: 20px;
		padding-bottom: 20px;
	}

	//基础信息
	.info {
		margin: 0 40px;

		.body {
			text-align: left;
			padding: 0 80px 20px 80px;
			font-weight: 600;
			display: flex;
			span {
				margin-right: 60px;
			}
		}
	}

	//跟单员
	.operator {
		position: relative;
		overflow: hidden;
		margin: 0 40px;

		.size {
			justify-content: space-between;
			margin: 0 80px;
			display: flex;
			.size_item{
				display: table;
				.text {
					padding-left: 5px;
					display: table-cell;
					//vertical-align: middle;
				}
				.text2{
					padding-right: 5px;
					display: table-cell;
					vertical-align: middle;
				}
			}
			
		}

		.table {
			margin: 10px 80px;
		}

		.label {
			text-align: left;
			min-width: 37px;
			width: 150px;
			margin: auto 0;
			margin-left: 80px;
			padding-right: 5px;
		}

		.isPass {
			margin: auto 0;
			min-width: 165px;
		}

		.remark {
			margin: auto 0;
			padding-left: 5px;
			width: 200px;
		}

		.upload-demo {
			margin: auto 0;
			margin-left: 20px;
		}

		.addBt {
			margin: auto 0;
		}
	}

	//设计开发
	.development {
		margin: 0 40px;
		position: relative;
		overflow: hidden;
		.label {
			min-width: 37px;
			margin-left: 20px;
			padding-right: 5px;
			display: table-cell;
			vertical-align: middle;
		}

		.isPass {
			display: table-cell;
			vertical-align: middle;
			min-width: 115px;
		}

		.remark {
			padding-left: 5px;
			width: 150px;
			display: table-cell;
			vertical-align: middle;
		}

		.upload-demo {
			display: table-cell;
			vertical-align: middle;
		}
		.opinion{
			display: flex;
			margin-top: 20px;
			margin-left:80px;
			width: 60%;
		}
	}

	//技术部
	.technology {
		margin: 0 40px;
		position: relative;
		overflow: hidden;
		.label {
			text-align: left;
			min-width: 37px;
			margin: auto 0;
			padding-right: 5px;
		}

		.isPass {
			margin: auto 0;
			min-width: 115px;
		}

		.remark {
			margin: auto 0;
			padding-left: 5px;
			width: 150px;
		}

		.upload-demo {
			margin: auto 0;
			margin-left: 5px;
		}
		.opinion{
			display: flex;
			margin-top: 20px;
			margin-left:80px;
			width: 60%;
		}
	}

	//品质部
	.quality {
		margin: 0 40px;
		position: relative;
		overflow: hidden;
		.label {
			text-align: left;
			min-width: 37px;
			margin: auto 0;
			padding-right: 5px;
		}

		.isPass {
			margin: auto 0;
			min-width: 115px;
		}

		.remark {
			margin: auto 0;
			padding-left: 5px;
			width: 150px;
		}

		.upload-demo {
			margin: auto 0;
			margin-left: 5px;
		}
		.opinion{
			display: flex;
			margin-top: 20px;
			margin-left:80px;
			width: 60%;
		}
	}

	//整体确认
	.whole {
		margin: 0 40px;
		position: relative;
		overflow: hidden;
		.opinion{
			display: flex;
			margin-top: 20px;
			margin-left:80px;
			width: 60%;
		}
	}
</style>

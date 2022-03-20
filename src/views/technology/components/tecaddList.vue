<!--
 * @FileDescription: 工艺单详情
 * @Author: wangpenghui
 -->
<template>
	<div style="height: calc(100vh - 115px);overflow: auto;padding-bottom: 20px;">
		<div style="width: 100%;" align="center">
			<!-- <div align="left" style="margin-left: 30px;margin-top: 10px;">
				<i class="el-icon-minus"></i>
				<span style="align-self: center;">基础信息</span>
				<i class="el-icon-minus"></i>
			</div> -->
			<div class="margin20_0">
				<el-divider content-position="left"><span style="font-size: 17px;">基础信息</span></el-divider>
			</div>
			<table style="overflow: auto;margin: 0 40px;margin-top: 10px;width: 90%;">
				<tr style="height: 60px;">
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">公司货号:</span><el-input style="width: 70%;margin-left: 10px;" v-model="companyNo" :disabled="true"></el-input></td>
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">厂家货号:</span><el-input style="width: 70%;margin-left: 10px;" v-model="factoryNo" :disabled="true"></el-input></td>
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">品名:</span><el-input style="width: 70%;margin-left: 10px;" v-model="tradeName" :disabled="true"></el-input></td>
					<td rowspan="3" style="width: 25%;height: 180px;">
						<el-upload
						class="avatar-uploader"
						:action="url+api.uploadQualit"
						:limit="1"
						list-type="picture-card"
						:headers="headers"
						:on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload"
						:on-exceed="onAvatarExceed"
						:on-remove="onAvatarRemove"
						:class="{disabled:uploadDisabled}">
							<img v-if="imageUrl" :src="imageUrl" class="avatar"  style="width:100%;height: 100%;"/>
							<i v-else class="el-icon-plus"></i>
						</el-upload>
					</td>
				</tr>
				<tr style="height: 60px;">
					<td style="width:30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">生产厂家:</span><el-input style="width: 70%;margin-left: 10px;" v-model="supplier" :disabled="true"></el-input></td>
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">执行标准:</span><el-input style="width: 70%;margin-left: 10px;" placeholder="输入执行标准" v-model="norm"></el-input></td>
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">版型:</span><el-input style="width:70%;margin-left: 10px;" placeholder="输入版型" v-model="name"></el-input></td>
				</tr>
				<tr style="height: 60px;">
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">安全类型:</span><el-input style="width: 70%;margin-left: 10px;" placeholder="输入安全类型" v-model="securityType"></el-input></td>
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">参考成份:</span><el-input style="width: 70%;margin-left: 10px;" v-model="reference" :disabled="true"></el-input></td>
					<td style="width:30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">系列:</span><el-input style="width: 70%;margin-left: 10px;" v-model="spectrum" :disabled="true"></el-input></td>
				</tr>
				<tr style="height: 60px;" :hidden="collarif">
					<td style="width: 30%;"><span style="font-size: 14px;font-weight: bold;color: rgba(0,0,0,0.7);">领型:</span><span style="color: rgba(0,0,0,0);">系列</span><el-input style="width: 70%;margin-left: 10px;" placeholder="输入领型" v-model="collar" :disabled="true"></el-input></td>
					<td style="width: 30%;"></td>
					<td style="width:30%;"></td>
				</tr>
			</table>
		</div>
		<div style="width: 100%;" align="center">
<!-- 			<div align="left" style="margin-left: 30px;">
				<i class="el-icon-minus"></i>
				<span style="align-self: center;">工艺要求</span>
				<i class="el-icon-minus"></i>
			</div> -->
			<div class="margin20_0">
				<el-divider content-position="left"><span style="font-size: 17px;">工艺要求</span></el-divider>
			</div>
			<div align="left" style="overflow: auto;margin: 0 40px;width: 90%;margin-top: 40px;margin-left: 46px;">
				<el-select v-model="reqvalue" @change="reqchangList">
					<el-option
					v-for="item in reqoptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
						
					</el-option>
				</el-select>
			</div>
			<table style="overflow: auto;margin: 0 40px;margin-top: 10px;width: 90%;" :hidden="reqhide">
				<tr>
					<td align="center" style="width: 50%;">主题</td>
					<td align="center" style="width: 50%;" colspan="2">要求</td>
				</tr>
				<tr style="height: 60px;" v-for="(item,index) in requireDemandList" :key="index">
					<td style="height: 30px;">
						<el-select v-model="item.craftRequireId" style="width: 90%;">
							<el-option
							v-for="list in optionzt"
							:key="list.value"
							:label="list.label"
							:value="list.value"></el-option>
						</el-select>
					</td>
					<td style="height: 30px;">
						<el-input v-model="item.demand" style="width: 90%;"></el-input>
					</td>
					<td style="height: 30px;">
						<el-button v-if="index + 1 == requireDemandList.length" type="primary" icon="el-icon-plus" plain class="circles" circle @click="inset(index)"></el-button>
						<el-button v-else type="primary" icon="el-icon-minus" plain class="circles" circle @click="del(index)"></el-button>
					</td>
				</tr>
			</table>
		</div> 
		<div style="margin-top: 20px;width: 100%;" align="center">
			<!-- <div align="left" style="margin-left: 30px;">
				<i class="el-icon-minus"></i>
				<span style="align-self: center;">修改内容</span>
				<i class="el-icon-minus"></i>
			</div> -->
			<div class="margin20_0">
				<el-divider content-position="left"><span style="font-size: 17px;">修改内容</span></el-divider>
			</div>
			<table style="overflow: auto;margin: 0 40px;margin-top: 10px;width: 90%;">
				<tr style="height: 60px;" v-for="(item,index) in reviseContentList" :key="index">
					<td style="width: 50%;"><el-input style="width: 90%;" v-model="item.content" placeholder="请输入修改内容"></el-input></td>
					<td style="width: 15%;height: 60px;" align="left">
						<el-upload
						width="20px"
						class="upload-demo"
						:action="url+api.uploadQualit"
						:headers="headers"
						:on-success="(response, file, fileList)=>{return onSuccess(response, file, fileList, index)}"
						:before-upload="beforeUpload"
						:limit="1"
						:on-exceed="handleExceed"
						:on-preview="handlePictureCardPreview"
						:file-list="item.fileList">
							<el-button size="small" type="primary">图片上传</el-button>
						</el-upload>
					</td>
					<td style="height: 30px;width: 35%;">
						<el-button v-if="index + 1 == reviseContentList.length" type="primary" icon="el-icon-plus" plain class="circles" circle @click="insets(index)"></el-button>
						<el-button v-else type="primary" icon="el-icon-minus" plain class="circles" circle @click="dels(index)"></el-button>
					</td>
				</tr>
				<tr>
					<td style="width: 50%;height: 250px;">
						<el-input type="textarea" style="width: 90%;" :rows="6" resize="none" maxlength="500" @input="inputtext" v-model="remark"  placeholder="备注:">
							
						</el-input>
					</td>
					<td></td>
					<td></td>
				</tr>
			</table>
		</div>
		<div style="margin-top: 10px;width: 100%;">
			<!-- <div align="left" style="margin-left: 30px;">
				<i class="el-icon-minus"></i>
				<span style="align-self: center;">规格要求</span>
				<i class="el-icon-minus"></i>
			</div> -->
			<div class="margin20_0">
				<el-divider content-position="left"><span style="font-size: 17px;">规格要求</span></el-divider>
			</div>
			<div style="overflow: auto;margin: 0 40px;width: 90%;margin-left: 5%;margin-top: 40px;">
				<el-select v-model="spevalue" @change="changList">
					<el-option
					v-for="item in speoptions"
					:key="item.value"
					:label="item.label"
					:value="item.value">
						
					</el-option>
				</el-select>
			</div>
			<div style="overflow: auto;margin: 0 40px;width: 90%;margin-left: 5%;margin-top: 10px;" :hidden="hide">
				<div class="formBody">
					<jod-formSearch labelPosition="top" ref="tecForm" :searchData="formData" :searchForm="formConfig"></jod-formSearch>
				</div>
				<!-- 尺码 部位 选择 -->
				<div class="transferBody">
					<div class="body">
						<h4>尺码选择:</h4>
						<el-transfer v-model="sizeOption" :titles="['未选', '已选']" :data="sizeList"></el-transfer>
					</div>
					<div class="body">
						<h4>部位选择:</h4>
						<el-transfer v-model="positionOption" :titles="['未选', '已选']" :data="positionList"></el-transfer>
					</div>
				</div>
				<!-- 尺码 部位 主表 -->
				<div class="sizeBody">
					<div class="body">
						<div class="body1">
							<div style="margin-right: 20px;">尺码:</div>
							<el-select v-model="sizeValue" placeholder="请选择尺码" :size="size" style="width: 140px;" @change="specificationsShow = false">
								<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key">
								</el-option>
							</el-select>
						</div>
						<div style="width: 452px;margin-left: 40px;text-align: right;">
							<el-button type="primary" :size="size" @click="generate(false)">生成规格表</el-button>
						</div>
					</div>
					<!-- 主表 -->
					<jod-tableList class="tableBody" :dataSource="dataSource" :columns="columns" :options="{tHeight:'136px'}">
			
						<template :slot="columns[index].prop" v-for="(item,index) in columns" slot-scope="{row,$index}">
							<div v-if="index!==0">
								<el-input size="mini" type="Number" class="textCenter"
									v-model.number="row[item.prop]" @input="salaryChange">
								</el-input>
							</div>
							<div v-else style="line-height: 28px;height: 28px;">{{row[item.prop]}}</div>
						</template>
					</jod-tableList> 
				</div>
				<!-- 规格表 -->
				<transition name="fade" mode="out-in">
					<div class="specifications" v-if="specificationsShow">
						<!-- 主表 -->
						<jod-tableList class="tableBody" :dataSource="specificationsDataSource" :columns="specificationsColumns"
							:options="{offHeight:true}">
							<!-- 自定义表头 -->
							<template v-slot:header_prop="scope">
								<div>{{scope.row.label}}</div>
							</template>
							<!-- 表内容 -->
							<template :slot="specificationsColumns[index].prop" v-for="(item,index) in specificationsColumns"
								slot-scope="{row,$index}">
								<div v-if="index!==0">
									<transition name="fade" mode="out-in">
										<el-input size="mini" type="Number" class="textCenter"
											v-if="row[item.prop]!=='-'" v-model.number="row[item.prop]" key="input"
											@input="salaryChange($event,item.prop,row)">
										</el-input>
										<span v-else key="sapn">-</span>
									</transition>
									
								</div>
								<div v-else style="line-height: 28px;height: 28px;">{{row[item.prop]}}</div>
							</template>
						</jod-tableList>
					</div>
				</transition>
				
				<transition name="fade" mode="out-in">
					<div style="text-align: center;" v-if="specificationsShow">
						<el-button type="primary" :size="size" @click="confirm(2)" :loading="btnLoading">确认</el-button>
						<el-button type="info" :size="size" @click="confirm(1)" :loading="btnLoading" :disabled="zcdisabled">暂存</el-button>
						<el-button type="warning" :size="size" @click="cancle" :loading="btnLoading">取消</el-button>
					</div>
					<div style="text-align: center;" v-else>
						<!-- <el-button type="warning" :size="size" @click="cancle" :loading="btnLoading">取消</el-button> -->
					</div>
				</transition>
			</div>
		</div>
		
		<!-- 图片查看 -->
		<jod-dragDialog v-model.sync="dialogVisible" :drag="true" top="10px" class="tableDialog">
			<img width="100%" :src="dialogImageUrl" alt="">
		</jod-dragDialog>
	</div>
</template>

<script>
	import json from '@/api/technology/tecList.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import api from '@/api/index'
	export default {
		computed:{
			...mapGetters([
				'size',
				'token'
			])
		}, 
		watch: {
			sizeOption(v) { //尺码
				let list = [...this.sizeList];
				let newArr1 = list.filter(item => v.some(items => items === item.key));
				this.options = newArr1;
				this.specificationsShow = false;
			},
			positionOption(v) { //部位
				let list = [...this.positionList];
				let newArr1 = list.filter(item => v.some(items => items === item.key));
				this.options2 = newArr1;
				this.getCloumns(newArr1);
				this.specificationsShow = false;
			}
		},
	    data() {
	      return {
			dialogVisible:false,//图片查看
			dialogImageUrl:'',
	        optionzt: [],
	        headers:{},
			requireDemandList:[{
				craftRequireId:'',
				demand:'',
				id:''
			}],
			fileList:[],
			reviseContentList:[{
				content:'',
				image:'',
				id:'',
				fileList:[],
			}],
			zcdisabled:false,
			url:process.env.VUE_APP_BASE_URL,
			goodsId:'',
			id:'',
			uploadDisabled:false,//是否已上传
			contentList:[],//修改内容
			demandList:[],//工艺要求
			tecValue:[],//规格表
			name:'',//版型
			norm:'',//执行标准
			remark:'',//备注
			securityType:'',//安全类型
			companyNo:'',//公司货号
			factoryNo:'',//厂家货号
			spectrum:'',//系列
			tradeName:'',//品名
			reference:'',//参考成分
			supplier:'',//供应商
			collar:'',//领型
			collarif:true,
			imageUrl:'',
			status:0,
			//要求
			reqoptions:[],
			reqvalue:'',
			reqhide:true,
			//规格
			speoptions:[{label:'自定义',value:999}],
			spevalue:'',
			isUpdate:false,
			hide:true,
			categoryByBig:[],
			formData:{
				name:'',
				id:''
			},
			formConfig:[
				{
					type: "Input",
					label: "规格名称:",
					prop: "name",
					onClick: res => {},
					placeholder: "请输入规格名称:",
					rules: [{
						required: true,
						message: "请输入活动名称",
						trigger: "blur"
					}]
				},{
					type: "Select",
					label: "品类:",
					prop: "id",
					options: this.categoryByBig,
					clearable:true,
					placeholder: "请选择品类",
					style: 'width:100%',
					change: row => {
						this.getPl(row)
					},
					rules: [{
						required: true, 
						message: '请选择品类', 
						trigger: 'blur' ,
					}],
				}
			],
			
			sizeList: [],//尺码数据
			sizeOption: [],
			
			positionList: [],//部位数据
			positionOption: [],
			
			sizeValue: '', //尺码
			options: [], //尺码数据
			sizeIndex:null,//尺码下标
			options2:[],//部位数据暂存
			loading: null, //表格遮罩层
			dataSource: [{
				staticCloumn: '标准值'
			}, {
				staticCloumn: '档差'
			}], //表格数据
			columns: [{ //表格列
				'label': '',
				'prop': 'staticCloumn',
				'align': 'center',
				'slot': true,
			}],
			specificationsShow:false,//规格表 显示/隐藏
			repeat:false,//重复点击
			specificationsDataSource: [], //规格表数据
			specificationsColumns: [{ //规格表列
				'label': '规格表',
				'prop': 'staticCloumn',
				'align': 'center',
				'slot': true,
			}],
			btnLoading:false,//按钮
			path:0,
			spedata:''
	      }
	    },
		created() {
			
		},
		mounted(){
			this.getCategoryByBig()
			this.getPoint()
			this.headers['Authorization'] = this.token;
			this.path = this.$route.query.path
			if(this.path == 0){
				this.id = this.$route.query.id
				this.goodsId = this.$route.query.goodsId
				if(this.goodsId == null){
					this.goodsId = ''
				}
				console.log(this.goodsId)
				this.getlist()
			}else if(this.path == 1 || this.path == 3){
				this.goodsId = this.$route.query.goodsId
				if(this.goodsId == null){
					this.goodsId = ''
				}
				console.log(this.goodsId)
				var data ={search:{name:'',goodsId:this.goodsId,status:''},page:1,limit:999}
				json.get(this.api.getcraft,data).then(res=>{
					console.log(res)
					this.id = res.data.records[0].id
					console.log(this.id)
					this.getlist()
				})
			}else if(this.path == 2){
				this.id = this.$route.query.id
				this.goodsId = this.$route.query.goodsId
				if(this.goodsId == null){
					this.goodsId = ''
				}
				console.log(this.goodsId)
				this.factoryNo = this.$route.query.factoryNo
				this.companyNo = this.$route.query.companyNo
				this.supplier = this.$route.query.supplier
				this.tradeName = this.$route.query.tradeName
				this.reference = this.$route.query.cf
				this.spectrum = this.$route.query.sxmc
				this.getlist()
			}
		},
		methods: {
			getlist(){
				let form = {current:1,size:999,search:{name: '',status:''}}
				json.get(this.api.specification,form).then(list=>{
					this.spedata = list.data.records
					var speList=[]
					for(var i=0;i<this.spedata.length;i++){
						speList.push({label:this.spedata[i].name,value:this.spedata[i].id})
					}
					this.speoptions = this.speoptions.concat(speList)
				})
				let formD= {category:'',categoryName: '',id: '',isShow: '',name:'',requirement: '',theme:''}
				formD['page'] = 1;
				formD['limit'] = 999;
				json.post(this.api.getTemplate,formD).then(res=>{
					var reqdata = res.data.records
					console.log('1',reqdata)
					for(var j=0;j<reqdata.length;j++){
						if(reqdata[j].isShow == 0){
							this.reqoptions.push({value:reqdata[j].name,name:reqdata[j].name})
						}
					}
					console.log('xxx',this.reqoptions)
				})
				if(this.id == ''){
					this.getData()
				}else{
					json.get(this.api.getdetail,{id:this.id}).then(res=>{
						console.log(res)
						if(res.status != 1){
							this.zcdisabled = true
						}
						this.hide = false
						this.contentList = res.data.reviseContentList
						for(var j = 0;j<this.contentList.length;j++){
							if(j == 0){
								this.reviseContentList[j]['content'] = this.contentList[j].content
								this.reviseContentList[j]['image'] = this.contentList[j].image
								this.reviseContentList[j]['id'] = this.contentList[j].id
								if(this.contentList[j].image != '' & this.contentList[j].image != null){
									this.reviseContentList[j].fileList = [{name:`图片${j+1}.jpg`,url:this.contentList[j].image}];
								}
							}else{
								this.reviseContentList.push({content:this.contentList[j].content,image:this.contentList[j].image,id:this.contentList.id,fileList:[]})
								if(this.contentList[j].image != '' & this.contentList[j].image != null){
									this.reviseContentList[j].fileList = [{name:`图片${j+1}.jpg`,url:this.contentList[j].image}];
								}
							}
							
						}
						this.demandList = res.data.requireDemandList
						for(var i = 0;i<this.demandList.length;i++){
							if(i == 0){
								this.requireDemandList[i]['craftRequireId'] = this.demandList[i].craftRequireId
								this.requireDemandList[i]['demand'] = this.demandList[i].demand
								this.requireDemandList[i]['id'] = this.demandList[i].id
							}else{
								this.requireDemandList.push({craftRequireId:this.demandList[i].craftRequireId,demand:this.demandList[i].demand,id:this.demandList[i].id})
							}
							
						}
						if(res.data.partAndSeries != null){
							this.tecValue = res.data.partAndSeries
						}else{
							this.tecValue = {categoryId:'',id:'',name:'',partList:[],standardId:'',standardList:[],standardTable:[],valueList:[]}
						}
						this.spevalue = this.tecValue.name
						this.name = res.data.name
						this.norm = res.data.norm
						this.remark = res.data.remark
						this.companyNo = res.data.companyNo
						this.factoryNo = res.data.factoryNo
						this.spectrum = res.data.spectrum
						this.tradeName = res.data.tradeName
						this.reference = res.data.reference
						this.securityType = res.data.securityType
						this.supplier = res.data.supplier
						this.imageUrl = res.data.image
						if(this.tradeName&&this.tradeName.indexOf("衬衫") >= 0){
							this.collarif = false
						}else{
							this.collarif = true
						}
						this.collar = res.data.collar
						this.isUpdate = true
						this.reqhide = false
						this.reqvalue = '自定义'
						this.getData()
					})
				}
			},
			//获取尺码or部位基础数据
			async getData() {
				try {
					//尺码
					let obj1 = {
						search:{
							name:null,
							status:null
						},
						current:1,
						size:999
					}
					//部位
					let obj2 = {
						search:{
							name:null
						},
						current:1,
						size:999
					}
					let newList1 = await json.get(this.api.standardPage,obj1);//尺码
					if(newList1.code==0){
						let size = await json.sizeHandler(newList1.data.records);
						this.sizeList = size;
					}
					
					let newList2 = await json.get(this.api.partPage,obj2);//部位
					if(newList2.code==0){
						let position = await json.positionHandler(newList2.data.records);
						this.positionList = position;
					} 
					//修改 - 赋值
					if(this.isUpdate){
						let {name,categoryId,partList,standardList,standardId,standardTable} = this.tecValue;
						let obj = {'name':name,'id':categoryId};
						//尺码
						let standard = standardList.reduce((total,current)=>{
							let {id} = current;
							total.push({'id':String(id)})
							return total
						},[])
						let newStandard = standard.map ( item => item.id )
						//部位
						let part = partList.reduce((total,current)=>{
							let {id} = current;
							total.push({'id':String(id)})
							return total
						},[])
						let newPart = part.map ( item => item.id );
						//规格表数据
						let newArr = standardTable.reduce((total,current)=>{
							let {name,difference,deviationMinus,deviationPositive,measuring,values,id} = current;
							let obj1 = {}
							values.forEach(item=>{
								obj1[item.standardId] = item.value
							})
							let obj2 = {
								id,
								'staticCloumn':name,
								'difference':difference.toString(),
								deviationMinus,
								deviationPositive,
								measuring
							}
							let newObj = {...obj1,...obj2};
							total.push(newObj);
							return total
						},[])
						let assignment = await this.assignment(obj,newStandard,newPart,standardId,newArr)
						console.log('assignment',assignment)
						this.generate(true);
						this.specificationsDataSource = newArr;
						console.log('newArr',newArr)
					}
				} catch (e) {
					this.$emit('close',{'status':false,'isClose':false})
					this.$message.error(e)
				}
			},
			assignment(obj,newStandard,newPart,standardId,newArr){
				return new Promise((res,rej)=>{
					this.formData = obj;
					this.sizeOption = newStandard;
					this.positionOption = newPart;
					this.sizeValue = String(standardId);
					console.log('1',this.formData)
					console.log('2',this.sizeOption)
					console.log('3',this.positionOption)
					console.log('4',this.sizeValue)
					res(true)
				})
			},
			//表格处理
			async getCloumns(list) {
				try {
					let arr = await json.cloumnsList(list);
					//设置初始columns
					let staticCloumnColumns = [{
						'label': '',
						'prop': 'staticCloumn',
						'align': 'center',
						'slot': true,
					}]
					staticCloumnColumns = staticCloumnColumns.concat(arr);
					this.columns = staticCloumnColumns;
					let dataList = await json.dataSourceList(staticCloumnColumns,this.dataSource);
					this.dataSource = dataList;
				} catch (e) {
					this.$message.error(e)
				}
			},
			//生成规格表
			async generate(value) {
				try {
					this.specificationsShow = false;//显示
					if(!this.sizeValue){
						this.$message.warning('请选择尺码');
						return
					}
					//控制重复点击
					if(this.repeat){
						this.$message.warning('尺码表生成中。。。')
						return 
					}
					this.repeat = true;
					//获取 自定义 表头配置数据
					let header = await json.headerData(this.options);
					this.specificationsColumns = header;
					//console.log('配置列数据：',this.columns)
					//console.log('尺码表数据：',this.dataSource)
					//获取 左列 配置数据
					//console.log('规格表表头',header)
					let index = -1;//获取 所选尺码 的下标
					header.forEach((item,i)=>{
						if(item.prop == this.sizeValue){
							index = i;
						}
					})
					this.sizeIndex = index;
					if(!value){
						let cloumns = await json.specificationsCloumns(this.columns,header,this.dataSource,this.options2,index);
						console.log('cloumns',cloumns)
						this.specificationsDataSource = cloumns;
					}
					this.specificationsShow = true;//显示
					this.repeat = false;
				} catch (e) {
					this.repeat = false;
					this.$message.warning(e)
				}
			
			},
			//规格表 尺码值 档差 发生变化时触发
			salaryChange(value,prop,row){
				if(prop&&prop=='difference'){
					let dataNum = row[this.specificationsColumns[this.sizeIndex].prop];//基础值
					let {difference} = row;//档差
					this.specificationsColumns.forEach((item,index)=>{
						if(index!==0&&index<this.specificationsColumns.length-4&&index!==this.sizeIndex){
							let sIndex = index - this.sizeIndex;
							let num = sIndex * difference;
							//this.$set(row)
							row[item.prop] = dataNum + num
						}
					})
				}else if(prop&&prop!=='deviationMinus'&&prop!=='deviationPositive'&&prop!=='measuring'&&prop!=='staticCloumn'){
					let arr = [];//存储 尺码值
					let isQqual = true;//是否 档差相同
					this.specificationsColumns.forEach((item,index)=>{
						if(index!==0&&index<this.specificationsColumns.length-4){
							arr.push(row[item.prop]);
						}
					})
					let arr2 = [];//存储 手动修改档差值
					for(let i = 0; i<arr.length-1 ; i++ ){
						let num = arr[i+1] - arr[i];
						arr2.push(num);
					}
					let s1 = new Set(arr2);//剔重
					let arr3 = [];
					for(let item of s1){
					 arr3.push(item);
					}
					if(arr3.length==1){
						row.difference = arr3[0]
					}else{
						row.difference = '-'
					}
				}
				let str = value.replace(/^\.+|[^\d.]/g,'')
				value = str
			},
			async confirm(item){
				this.$refs['tecForm'].$refs['searchForm'].validate((valid)=>{
					if(!valid){
						return false
					}
				})
				if(this.formData.name !== '' &&this.formData.id != ''){
					this.btnLoading = true;
					let standardList = [];//尺码
					let partList = [];//部位
					this.sizeOption.forEach(item=>{//尺码
						standardList.push({id:Number(item)})
					});
					this.positionOption.forEach(item=>{//部位
						partList.push({id:Number(item)})
					})
					let newArr = await json.objHandler(this.formData,this.tecValue.id,this.sizeValue,standardList,partList,this.specificationsDataSource,this.options2);
					// let res = await json.post(this.api.saveStandardTable,newArr)
					var demandlist = []
					var contentlist = []
					for(var i = 0;i<this.requireDemandList.length;i++){
						demandlist.push({craftRequireId:this.requireDemandList[i].craftRequireId,
						demand:this.requireDemandList[i].demand,id:this.requireDemandList[i].id})
					}
					for(var j = 0;j<this.reviseContentList.length;j++){
						contentlist.push({content:this.reviseContentList[j].content,image:this.reviseContentList[j].image,id:this.reviseContentList[j].id})
					}
					var data = {name:this.name,norm:this.norm,remark:this.remark,securityType:this.securityType,
					requireDemandList:demandlist,reviseContentList:contentlist,specification:newArr,companyNo:this.companyNo,
					factoryNo:this.factoryNo,goodsId:this.goodsId,id:this.id,image:this.imageUrl,reference:this.reference,
					spectrum:this.spectrum,supplier:this.supplier,tradeName:this.tradeName,collar:this.collar}
					console.log(data)
					data['status'] = item
					json.post(this.api.postcraft,data).then(res=>{
						console.log(res)
						if(res.code==0){
							this.$message.success('提交成功');
						}
						this.btnLoading = false;
						if(this.path == 0){
							this.$router.push({path:'/technology/technologyProcess'})
						}else if(this.path == 1 || this.path == 2){
							this.$router.push({path:'/orderShop/orderShop'})
						}else if(this.path == 3){
							this.$router.push({path:'/factory/factoryShopList'})
						}
					})
				}else{
					this.$message.waring('请填写规格名称和品类')
				}
				
			},
			inputtext(){
				this.fontnum = this.remark.length
			},
			inset(index){
				this.requireDemandList.push({craftRequireId:'',demand:'',id:''})
			},
			del(index){
				console.log(index)
				this.requireDemandList.splice(index,1)
			},
			insets(index){
				this.reviseContentList.push({content:'',image:'',id:'',fileList:[]})
			},
			dels(index){
				console.log(index)
				this.reviseContentList.splice(index,1)
			},
			//上传成功
			onSuccess(response, file, fileList, index){
				this.reviseContentList[index].image = response.data.fileHttpPath
				console.log(this.reviseContentList)
				this.fileList[0] = {url:response.data.fileHttpPath};
			},
			//上传数量限制
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			//上传格式限制
			beforeUpload(file,item){
				let i = file.type.indexOf('image')
				if(i=='-1'){
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = res.data.fileHttpPath
			    // this.imageUrl = URL.createObjectURL(file.raw);
				console.log(this.imageUrl)
				this.uploadDisabled = true
			},
			beforeAvatarUpload(file) {
				let i = file.type.indexOf('image')
				if(i=='-1'){
					this.$message.warning(`此上传只允许图片上传`);
					return false
				}
			},
			onAvatarExceed(file){
				this.$message.warning('只能上传一个文件')
			},
			onAvatarRemove(file){
				this.imageUrl = '';
				this.uploadDisabled = false
			},
			getCategoryByBig(){
				json.get(this.api.categoryByBig).then(res=>{
					console.log('res',res)
					if(res.code==0){
						let newArr = res.data.reduce((total,current)=>{
							let {id,name,parentId} = current;
							let obj = {
								'value':id,
								'label':name,
								'parentId': parentId
							}
							total.push(obj)
							return total
						},[])
						this.categoryByBig = newArr;
						this.formConfig[1].options = this.categoryByBig
						console.log('categoryByBig',this.categoryByBig)
					}
				})
			},
			cancle(){
				// window.opener=null;
				// window.close();
				if(this.path == 0){
					this.$router.push({path:'/technology/technologyProcess'})
				}else{
					this.$router.push({path:'/orderShop/orderShop'})
				}
			},
			getPoint(){
				var data = {search:{theme:'',isShow:''}};
				data['page'] = 1;
				data['size'] = 999;
				console.log('data',data)
				json.get(this.api.getcraftRequire,data).then(res=>{
					console.log(res)
					var records = res.data.records
					for(var i=0;i<records.length;i++){
						if(records[i].isShow == true){
							this.optionzt.push({label:records[i].theme,value:records[i].id})
						}
					}
				})
			},
			changList(item){
				if(item == 999){
					this.hide = false
					this.tecValue = {categoryId:'',id:'',name:'',partList:[],standardId:'',standardList:[],standardTable:[],valueList:[]};
					this.isUpdate = true;
					this.getData()
				}else{
					// this.changdis = true
					var categoryId = ''
					for(var i=0;i<this.spedata.length;i++){
						if(item == this.spedata[i].id){
							categoryId = this.spedata[i].categoryId
						}
					}
					json.get(this.api.findPartAndSeries,{'specificationId':item,'categoryId':categoryId}).then(res=>{
						console.log(res)
						this.tecValue = res.data;
						this.isUpdate = true;
						this.hide = false
						this.getData()
					})
				}
			},
			reqchangList(item){
				console.log(item)
				json.get(this.api.checkTemplate,item).then(res=>{
					var datalist = []
					for(var i=0;i<res.data.length;i++){
						datalist.push({craftRequireId:parseInt(res.data[i].theme),demand:res.data[i].requirement,id:''})
					}
					this.requireDemandList = datalist
					this.reqhide = false
				})
			},
			async getPl(row){
				console.log(row)
				try {
					var index = 0
					for(var j=0;j<this.categoryByBig.length;j++){
						if(this.categoryByBig[j].value == row){
							index = j
							break
						}
					}
					//部位
					let obj2 = {
						search:{
							name:null,
							categoryId:this.categoryByBig[index].parentId
						},
						current:1,
						size:999
					}
					
					let newList2 = await json.get(this.api.partPage,obj2);//部位
					let newList = newList2.data.records
					console.log('list',newList)
					let newPart = []
					for(var i=0;i<newList.length;i++){
						newPart.push(newList[i].id + '')
					}
					console.log(newPart)
					this.positionOption = newPart;
				} catch (e) {
					this.$emit('close',{'status':false,'isClose':false})
					this.$message.error(e)
				}
			},
			//图片查看
			handlePictureCardPreview(file) {
				console.log(file)
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
		},
	  }
</script>

<style lang="scss" scoped>
	.circles{
		margin-left: 10px;
		font-size: 10px;
	}
	/deep/.disabled .el-upload--picture-card {
		display: none;
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
	.el-icon-minus{
		color: #0088FF;
		align-self: center;
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
	/deep/.avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	}
	/deep/.avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	}
	/deep/.formBody .search_input{
	  	.el-form .el-form-item{
			width: 50%;
	  		margin: 0;
	  	}
	  	.el-form .el-form-item+.el-form-item{
			width: 47%;
			margin-left: 25px;
	  	}
	}
	.transferBody {
	  	min-width: 914px;
	  	display: flex;
	  	justify-content: space-between;
	  
	  	/deep/.el-transfer__buttons {
	  		padding: 0;
	  		.el-button {
	  			display: flex;
	  			margin: 0 10px;
	  			padding: 8px;
	  		}
	  		.el-button+.el-button {
	  			margin-top: 10px;
	  		}
	  	}
	}
	  
	.sizeBody>.body {
	  	display: flex;
	  	justify-content: space-between;
	  
	  	.body1 {
	  		width: 452px;
	  		display: flex;
	  		align-items: center;
	  	}
	}
	  
	.sizeBody {
	  	margin-top: 30px;
	  
	  	.tableBody {
	  		margin-top: 30px;
	  	}
	  
	  	/deep/.el-table .cell {
	  		height: 28px !important;
	  	}
	}
	/deep/.formBody .search_input{
	  	.el-form .el-form-item{
	  		width: 50%;
	  	  	margin: 0;
	  	}
	  	.el-form .el-form-item+.el-form-item{
	  		width: 47%;
	  		margin-left: 25px;
	  	}
	}
</style>

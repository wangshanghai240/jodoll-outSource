<!--
 * @FileDescription: 出货检
 * @Author: wangpenghui
 -->
<template>
	<div>
		<div style="width: 100%;" align="center" >
			<div class="margin20_0">
				<el-divider content-position="left">基础信息</el-divider>
			</div>
			<table style="width: 90%;">
				<tr style="height: 60px;" align="center">
					<td style="width: 70px;font-weight: bold;" align="left">生产工厂:</td>
					<td style="width: 160px;" align="left">{{factoryName}}</td>
					<td style="width: 70px;font-weight: bold;">商品编号:</td>
					<td style="width: 130px;" align="left">{{goodsCode}}</td>
					<td style="width: 70px;font-weight: bold;">商品名称:</td>
					<td style="width: 100px;" align="left">{{goodsName}}</td>
					<td align="left" style="width: 65px;font-weight: bold;">下单量:</td>
					<td align="left">{{number}}件</td>
					<td align="right" style="width: 100px;font-weight: bold;">检验数:</td>
					<td style="width: 140px;">
						<el-input-number v-model="checkNumber" controls-position="right" style="width: 100px;"></el-input-number>
					</td>
				</tr>
				<tr style="height: 60px;" align="center">
					<td style="width: 70px;font-weight: bold;" align="left">阶段:</td>
					<td style="width: 100px;">
						<el-select v-model="stage" placeholder="请选择" size="medium">
						    <el-option
						      v-for="item in options"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value"> 
						    </el-option>
						  </el-select>
					</td>
					<td style="font-weight: bold;">上线日期:</td>
					<td style="width: 10%">
						<el-date-picker
						      v-model="onlineDate"
						      type="date"
							  format="yyyy-MM-dd"
							  value-format="yyyy-MM-dd"
						      placeholder="选择日期">
						    </el-date-picker>
					</td>
					<td style="font-weight: bold;">交货日期:</td>
					<td>
						<el-date-picker
						      v-model="deliveryDate"
						      type="date"
							  format="yyyy-MM-dd"
							  value-format="yyyy-MM-dd"
						      placeholder="选择日期">
						    </el-date-picker>
					</td>
					<td align="left" style="font-weight: bold;">生产情况:</td>
					<td colspan="3" align="left"><el-input placeholder="输入内容" v-model="productionInfo" style="width: 100%;"></el-input></td>
				</tr>
			</table>
		</div>
		<div style="width: 100%;" align="center" >
			<div class="margin20_0" v-if="sizeOptions&&sizeOptions.length!==0">
				<el-divider content-position="left">规格检验</el-divider>
			</div>
			<div style="text-align: right;margin-bottom: 20px;" v-if="sizeOptions&&sizeOptions.length!==0">
				<el-button size="mini" type="success" @click="addDialog = true" :disabled="disableds">新增</el-button>
			</div>
			<jod-tableList class="tableBody" :dataSource="warehouseDataSource" :columns="warehouseColumns"
				:options="{offHeight:true,soltColumn:true}" v-if="sizeOptions&&sizeOptions.length!==0">
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
													<el-input size="mini" type="Number" class="textCenter" 
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
								<el-button type="danger" size="mini" @click="delList($index)">删除</el-button>
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
		<div style="width: 100%;" align="center" >
			<div class="margin20_0">
				<el-divider content-position="left">面辅料点检</el-divider>
			</div>
			<table style="width: 90%;margin-top: 20px;">
				<tr>
					<td>
						<span>面</span><span style="margin-left: 16px;margin-right: 3px;">料:</span>
						<el-radio-group v-model="mlr" size="mini" :fill="mlr == 1?'#1890ff':'#ff4949'">
						     <el-radio-button :label="1">通过</el-radio-button>
						     <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>里</span><span style="margin-left: 16px;margin-right: 3px;">料:</span>
						<el-radio-group v-model="llr" size="mini" :fill="llr?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>吊</span><span style="margin-left: 16px;margin-right: 3px;">牌:</span>
						<el-radio-group v-model="dpr" size="mini" :fill="dpr == 1?'#1890ff':'#ff4949'">
						     <el-radio-button :label="1">通过</el-radio-button>
						     <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>商</span><span style="margin-left: 16px;margin-right: 3px;">标:</span>
						<el-radio-group v-model="sbr" size="mini" :fill="sbr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
				</tr>
				<tr>
					<td>
						<span>绣</span><span style="margin-left: 16px;margin-right: 3px;">花:</span>
						<el-radio-group v-model="xhr" size="mini" :fill="xhr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>拉</span><span style="margin-left: 16px;margin-right: 3px;">链:</span>
						<el-radio-group v-model="llianr" size="mini" :fill="llianr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>纽</span><span style="margin-left: 16px;margin-right: 3px;">扣:</span>
						<el-radio-group v-model="nkr" size="mini" :fill="nkr == 1?'#1890ff':'#ff4949'">
						     <el-radio-button :label="1">通过</el-radio-button>
						     <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						<span>拉</span><span style="margin-left: 16px;margin-right: 3px;">片:</span>
						<el-radio-group v-model="lpr" size="mini" :fill="lpr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
				</tr>
				<tr>
					<td>
						洗水唛:
						<el-radio-group v-model="xsmr" size="mini" :fill="xsmr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						尺码标:
						<el-radio-group v-model="cmbr" size="mini" :fill="cmbr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						配色布:
						<el-radio-group v-model="psbr" size="mini" :fill="psbr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						合格证:
						<el-radio-group v-model="hgzr" size="mini" :fill="hgzr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
				</tr>
				<tr>
					<td>
						四件扣:
						<el-radio-group v-model="sjkr" size="mini" :fill="sjkr == 1?'#1890ff':'#ff4949'">
						     <el-radio-button :label="1">通过</el-radio-button>
						     <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						装饰件:
						<el-radio-group v-model="zsjr" size="mini" :fill="zsjr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						备用扣:
						<el-radio-group v-model="bykr" size="mini" :fill="bykr == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td>
						干燥剂:
						<el-radio-group v-model="gzjr" size="mini" :fill="gzjr == 1?'#1890ff':'#ff4949'">
						     <el-radio-button :label="1">通过</el-radio-button>
						     <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
				</tr>
			</table>
		</div>
		<div style="width: 100%;" align="center">
			<div class="margin20_0">
				<el-divider content-position="left">要点检查</el-divider>
			</div>
			<table style="margin-top: 20px;width: 90%;">
				<tr style="height: 45px;" v-for="(item,index) in pointCheckList" :key="index">
					<td style="width: 5%;">{{index+1}}.</td>
					<td style="width: 15%;"><el-input v-model="item.name" :disabled="item.isLock == 1"></el-input></td>
					<td style="width: 15%;" align="center">
						<el-radio-group v-model="item.isPass" size="mini" :fill="item.isPass == 1?'#1890ff':'#ff4949'">
						      <el-radio-button :label="1">通过</el-radio-button>
						      <el-radio-button :label="0">拒绝</el-radio-button>
						</el-radio-group>
					</td>
					<td style="width: 5%;">备注:</td>
					<td>
						<el-input v-model="item.remark"></el-input>
					</td>
					<td style="width: 15%;">
						<el-upload
						width="20px"
						class="upload-demo"
						:action="url+api.uploadQualit"
						:headers="headers"
						:on-success="(response,file,fileList)=>{return onSuccess(response,file,fileList,index)}"
						:limit="1"
						:on-exceed="handleExceed"
						:file-list="item.fileList">
							<el-button size="small" type="primary">文件上传</el-button>
						</el-upload>
					</td>
					<td style="width: 10%;">
						<el-button v-if="index + 1 == pointCheckList.length" type="success" icon="el-icon-plus" class="circles" circle @click="inset(index)"></el-button>
						<el-button type="danger" icon="el-icon-minus" class="circles" circle @click="del(index)" :disabled="item.isLock == 1"></el-button>
					</td>
				</tr>
			</table>
		</div> 
		<div style="width: 100%;" align="center">
			<div class="margin20_0">
				<el-divider content-position="left">质量问题描述</el-divider>
			</div>
			<table style="margin-top: 20px;width: 90%;">
				<tr style="height: 45px;" v-for="(item,index) in qualityProblemList" :key="index">
					<td style="width: 5%;">问题:</td>
					<td><el-input placeholder="请输入问题" v-model="item.name"></el-input></td>
					<td style="width: 10%;" align="right">数量:</td>
					<td style="width: 10%;">
						<el-input-number v-model="item.number" controls-position="right" size="small" style="width: auto;"></el-input-number>
					</td>
					<td style="width: 10%;" align="right">缺陷:</td>
					<td style="width: 10%;">
						<el-select v-model="item.state" placeholder="请选择" size="medium">
						    <el-option
						      v-for="item in wtoptions"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
					</td>
					<td style="width: 10%;height: 30px;">
						<el-button v-if="index + 1 == qualityProblemList.length" type="success" icon="el-icon-plus" class="circles" circle @click="insets(index)"></el-button>
						<el-button type="danger" icon="el-icon-minus" class="circles" circle @click="dels(index)"></el-button>
					</td>
				</tr>
			</table>
		</div>
		<div style="width: 100%;" align="center">
			<div class="margin20_0">
				<el-divider content-position="left">结论</el-divider>
			</div>
			<table style="margin-top: 10px;width: 90%;">
				<tr>
					<td style="width: 10%;">问题属性:</td>
					<td style="width: 30%;">
						<el-radio v-model="problemAttribute" label="0">无</el-radio>
						<el-radio v-model="problemAttribute" label="1">轻微</el-radio>
						<el-radio v-model="problemAttribute" label="2">致命</el-radio>
						<el-radio v-model="problemAttribute" label="3">严重</el-radio>
					</td>
					<td style="width: 10%;" valign="top" align="right" rowspan="2">判断结论:</td>
					<td style="width: 40%;" colspan="2"  rowspan="2">
						<el-input type="textarea" style="width:100%;" :rows="6" resize="none" maxlength="500" v-model="conclusion"  placeholder="请输入文本">
							
						</el-input>
					</td>
				</tr>
				<tr>
					<td style="width: 10%;">处理意见:</td>
					<td style="width: 30%;">
						<el-radio v-model="resolution" label="0">接受</el-radio>
						<el-radio v-model="resolution" label="1">再检</el-radio>
						<el-radio v-model="resolution" label="2">复检</el-radio>
					</td>
				</tr>
			</table>
		</div>
		<div align="center" style="margin-top: 10px;":hidden="hiddens">
			<el-button type="warning" @click="cacle">取消</el-button>
			<el-button type="infor" @click="send(1)">暂存</el-button>
			<el-button type="primary" @click="send(0)">提交</el-button>
		</div>
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
		props: {
			value: {
				type: Object
			},
		},
		watch: {
			value(v) {
				this.rowstate = v
			},
		},
		data() {
		  return {
			rowstate:this.value,
			gridata:'',
			disableds:false,
			hiddens:false,
			options:[{
				value:1,
				label:'初期'
			},{
				value:2,
				label:'中期'
			},{
				value:3,
				label:'末期'
			}],
			factoryName:'',
			goodsCode:'',
			goodsName:'',
			number:0,
			checkNumber:0,
			stage:1,
			onlineDate:'',
			deliveryDate:'',
			productionInfo:'',
			//规格
			standardList:[],
			partList:[],
			partLists:[],
			sizeList:[],
			sizeLists:[],
			positionList:[],
			text:'1',
			//面辅料点检
			ml:'面料',
			mlr:1,
			ll:'里料',
			llr:1,
			dp:'吊牌',
			dpr:1,
			sb:'商标',
			sbr:1,
			xsm:'洗水唛',
			xsmr:1,
			cmb:'尺码标',
			cmbr:1,
			psb:'配色布',
			psbr:1,
			hgz:'合格证',
			hgzr:1,
			xh:'绣花',
			xhr:1,
			llian:'拉链',
			llianr:1,
			nk:'纽扣',
			nkr:1,
			lp:'拉片',
			lpr:1,
			sjk:'四件扣',
			sjkr:1,
			zsj:'装饰件',
			zsjr:1,
			byk:'备用扣',
			bykr:1,
			gzj:'干燥剂',
			gzjr:1,
			//要点检查
			pointCheckList:[{
				name:'',
				remark:'',
				isPass:1,
				fileUrl:'',
				isLock: 0,
				fileList:[],
			}],
			headers:{},
			url:process.env.VUE_APP_BASE_URL,
			fileList:[],
			//质量问题
			wtoptions:[{
				value:1,
				label:'轻微'
			},{
				value:2,
				label:'致命'
			},{
				value:3,
				label:'严重'
			}],
			qualityProblemList:[{
				name:'',
				number:0,
				state:1,
			}],
			//结论
			problemAttribute:'0',
			resolution:'0',
			conclusion:'',
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
		  }
		},
		mounted(){
			this.headers['Authorization'] = this.token;
			this.getTableData({'goodsId':this.rowstate.goodsId});
			
		},
		methods:{
			//获取数据
			async getTableData(id){
				let res = await json.get(this.api.factoryStandard,id);
				if(res.data&&res.data.length!==0){
					let size = await json.sizeHandler(res.data);
					// this.sizeOptions = size;
					console.log(this.warehousValue)
					let res2 = await json.get(this.api.factoryPart,id);
					if(res2.code==0&&res2.data.length!==0){
						let header = await json.headerHandler(res2.data);
						this.warehouseColumns = this.warehouseColumns.concat(header);
						console.log('2',this.warehouseColumns)
					}
				}
				setTimeout(()=>{
					this.tableShow = true;
					this.getData()
				},100)
			},
			async getData() {
				console.log(this.rowstate)
				// let size = await json.get(this.api.findSize,{goodsId:this.rowstate.goodsId});
				// let newSize = await json.sizeHandler(size.data);
				// console.log('-----',newSize)
				// this.sizeOptions = newSize
				this.number = this.rowstate.number
				if(this.rowstate.type == 1){
					var data =this.rowstate.goodsId+'/'+this.rowstate.tempState
					json.get(this.api.getgoodsoutcheck,data).then(res=>{
						this.getlist(res)
					})
					console.log('1-----')
				}else if(this.rowstate.type == 0){
					if(this.rowstate.tempState == null){
						this.rowstate.tempState = 0
						var data =this.rowstate.goodsId+'/0'
					}else{
						var data =this.rowstate.goodsId+'/'+this.rowstate.tempState
					}
					if(this.rowstate.tempState == 0){
						json.get(this.api.getgoodsoutcheck,data).then(res=>{
							console.log(res)
							this.gridata = res.data
							this.factoryName = res.data.factoryName,
							this.goodsCode = res.data.goodsCode
							this.goodsName = res.data.goodsName
							this.checkNumber = res.data.checkNumber
							this.onlineDate = res.data.onlineDate
							this.deliveryDate = res.data.deliveryDate
							this.productionInfo = res.data.productionInfo
							this.standardList = res.data.standardList
							if(res.data.pointCheckList.length != 0){
								this.pointCheckList = res.data.pointCheckList
							}
							if(this.standardList != null){
								for(var j=0;j<this.standardList.length;j++){
									this.sizeOptions.push({value:this.standardList[j].id,label:this.standardList[j].size})
								}
								console.log(this.sizeOptions)
							}
						})
					}else{
						json.get(this.api.getgoodsoutcheck,data).then(res=>{
							this.getlist(res)
						})
					}
					console.log('0-----')
				}else{
					json.get(this.api.getgoodsoutcheckId,this.rowstate.id).then(res=>{
						this.getlist(res)
					})
					this.disableds = this.rowstate.dis
					this.hiddens = this.rowstate.dis
					console.log('2-----')
				}
			},
			async send(typeNum){
				try{
					var flag = true
					console.log(typeNum)
					
					if(typeNum == 0){
						var text = ''
						console.log(this.onlineDate,this.deliveryDate,this.productionInfo)
						if(this.onlineDate == '' || this.onlineDate == null){
							text = text + '上线日期,'
							flag = false
						}
						if(this.deliveryDate == '' || this.deliveryDate == null){
							text = text + '交货日期,'
							flag = false
						}
						if(this.productionInfo == '' || this.productionInfo == null){
							text = text + '生产情况'
							flag = false
						}
						if(flag == false){
							this.$message.warning(text+'未输入')
						}
					}
					if(flag == true){
						let materialSpotCheckList= [];
						console.log(this.sizeOptions);
						
						if(this.sizeOptions.length!==0){
							materialSpotCheckList=[{name:this.ml,isPass:this.mlr},{name:this.ll,isPass:this.llr},{name:this.dp,isPass:this.dpr},
							{name:this.sb,isPass:this.sbr},{name:this.xsm,isPass:this.xsmr},{name:this.cmb,isPass:this.cmbr},{name:this.psb,isPass:this.psbr},
							{name:this.hgz,isPass:this.hgzr},{name:this.xh,isPass:this.xhr},{name:this.llian,isPass:this.llianr},{name:this.nk,isPass:this.nkr},
							{name:this.lp,isPass:this.lpr},{name:this.sjk,isPass:this.sjkr},{name:this.zsj,isPass:this.zsjr},{name:this.byk,isPass:this.bykr},
							{name:this.gzj,isPass:this.gzjr}];
						};
						this.gridata['checkNumber'] = this.checkNumber
						this.gridata['conclusion'] = this.conclusion
						this.gridata['deliveryDate'] = this.deliveryDate
						this.gridata['qualityProblemList'] = this.qualityProblemList
						this.gridata['factoryName'] = this.factoryName
						this.gridata['goodsCode'] = this.goodsCode
						this.gridata['goodsName'] = this.goodsName
						this.gridata['number'] = this.number;
						
						this.confirmLoading = true;
						//规格是否检测
						if(!this.rowstate.isAcc){
							let specCheckList = await json.dataTableHandler(this.warehouseDataSource);
							console.log(specCheckList)
							this.gridata['specCheckList'] = specCheckList
						}
						this.gridata['onlineDate'] = this.onlineDate
						this.gridata['problemAttribute'] = this.problemAttribute
						this.gridata['productionInfo'] = this.productionInfo
						console.log('1',this.pointCheckList)
						var pointCheck = []
						for(var b=0;b<this.pointCheckList.length;b++){
							var listcheck ={name:this.pointCheckList[b].name,remark:this.pointCheckList[b].remark,
							isPass:this.pointCheckList[b].isPass,fileUrl:this.pointCheckList[b].fileUrl,isLock:this.pointCheckList[b].isLock}
							pointCheck.push(listcheck)
						}
						this.gridata['pointCheckList'] = this.pointCheckList
						this.gridata['resolution'] = this.resolution
						this.gridata['stage'] = this.stage
						this.gridata['tempState'] = typeNum;
						if(this.sizeOptions.length!==0){
							this.gridata['materialSpotCheckList'] = materialSpotCheckList
						}
						console.log('2',this.gridata)
						json.post(this.api.saveOrTemp,this.gridata).then(res=>{
							console.log(res)
							this.$message.success('提交成功')
							this.$emit('shipmentClose',false)
						})
					}
				}catch(e){
					this.$message.error(e)
				}
			},
			inset(index){
				this.pointCheckList.push({name:'',remark:'',isPass:1,fileUrl:'',fileList:[],isLock:0})
			},
			del(index){
				console.log(index)
				if(index == 0 && this.pointCheckList.length == 1){
					this.$message.warning('不能清除')
				}else{
					this.pointCheckList.splice(index,1)
				}
			},
			insets(index){
				this.qualityProblemList.push({name:'',number:0,state:1})
			},
			dels(index){
				console.log(index)
				if(index == 0 && this.qualityProblemList.length == 1){
					this.$message.warning('不能清除')
				}else{
					this.qualityProblemList.splice(index,1)
				}
			},
			inputsize(){
				this.searchShopForm[0].options = this.sizeList
				this.searchDialog = true
			},
			jswc(num,index){
				console.log(num,index)
				console.log(this.sizeLists[index].cmsize[num].bzz)
				this.sizeLists[index].cmsize[num+1].wc = this.sizeLists[index].cmsize[num].sc - this.sizeLists[index].cmsize[num].bzz
				console.log(this.sizeLists)
			},
			cacle(){
				this.$emit('shipmentClose')
			},
			async getlist(res){
				
				this.gridata = res.data
				this.factoryName = res.data.factoryName,
				this.goodsCode = res.data.goodsCode
				this.goodsName = res.data.goodsName
				this.number = res.data.number
				this.checkNumber = res.data.checkNumber
				this.stage = res.data.stage
				this.onlineDate = res.data.onlineDate
				this.deliveryDate = res.data.deliveryDate
				this.productionInfo = res.data.productionInfo
				this.partList = res.data.partList
				this.resolution = res.data.resolution + ''
				this.problemAttribute = res.data.problemAttribute + ''
				this.conclusion = res.data.conclusion
				console.log(this.resolution,this.problemAttribute)
				this.specCheckList = res.data.specCheckList
				var materialSpotCheckList = res.data.materialSpotCheckList
				console.log(materialSpotCheckList);
				if(materialSpotCheckList){
					this.mlr = materialSpotCheckList[0].isPass
					this.llr = materialSpotCheckList[1].isPass
					this.dpr = materialSpotCheckList[2].isPass
					this.sbr = materialSpotCheckList[3].isPass
					this.xsmr = materialSpotCheckList[4].isPass
					this.cmbr = materialSpotCheckList[5].isPass
					this.psbr = materialSpotCheckList[6].isPass
					this.hgzr = materialSpotCheckList[7].isPass
					this.xhr = materialSpotCheckList[8].isPass
					this.llianr = materialSpotCheckList[9].isPass
					this.nkr = materialSpotCheckList[10].isPass
					this.lpr = materialSpotCheckList[11].isPass
					this.sjkr = materialSpotCheckList[12].isPass
					this.zsjr = materialSpotCheckList[13].isPass
					this.bykr = materialSpotCheckList[14].isPass
					this.gzjr = materialSpotCheckList[15].isPass
				}
				if(res.data.pointCheckList != null){
					for(var b=0;b<res.data.pointCheckList.length;b++){
						if(b == 0){
							this.pointCheckList[b].name = res.data.pointCheckList[b].name
							this.pointCheckList[b].remark = res.data.pointCheckList[b].remark
							this.pointCheckList[b].isPass = res.data.pointCheckList[b].isPass
							this.pointCheckList[b].fileUrl = res.data.pointCheckList[b].fileUrl
							this.pointCheckList[b].id = res.data.pointCheckList[b].id
							this.pointCheckList[b].isLock = res.data.pointCheckList[b].isLock
							if(res.data.pointCheckList[b].fileUrl != null & res.data.pointCheckList[b].fileUrl != ''){
								console.log(res.data.pointCheckList[b].fileUrl.length)
								this.pointCheckList[b].fileList = [{name:'要点文件',url:res.data.pointCheckList[b].fileUrl}]
							}else{
								this.pointCheckList[b].fileList = []
							}
						}else{
							this.pointCheckList.push({name:'',remark:'',isPass:1,fileUrl:'',fileList:[]})
							this.pointCheckList[b].name = res.data.pointCheckList[b].name
							this.pointCheckList[b].remark = res.data.pointCheckList[b].remark
							this.pointCheckList[b].isPass = res.data.pointCheckList[b].isPass
							this.pointCheckList[b].fileUrl = res.data.pointCheckList[b].fileUrl
							this.pointCheckList[b].id = res.data.pointCheckList[b].id
							this.pointCheckList[b].isLock = res.data.pointCheckList[b].isLock
							if(res.data.pointCheckList[b].fileUrl != null & res.data.pointCheckList[b].fileUrl != ''){
								console.log(res.data.pointCheckList[b].fileUrl.length)
								this.pointCheckList[b].fileList = [{name:'要点文件',url:res.data.pointCheckList[b].fileUrl}]
							}else{
								this.pointCheckList[b].fileList = []
							}
						}
					}
				}
				if(res.data.qualityProblemList != null){
					for(var z=0;z<res.data.qualityProblemList.length;z++){
						if(z == 0){
							this.qualityProblemList[z].name = res.data.qualityProblemList[z].name
							this.qualityProblemList[z].number = res.data.qualityProblemList[z].number
							this.qualityProblemList[z].state = res.data.qualityProblemList[z].state
							this.qualityProblemList[z].id = res.data.qualityProblemList[z].id
						}else{
							this.qualityProblemList.push({name:'',number:'',state:1})
							this.qualityProblemList[z].name = res.data.qualityProblemList[z].name
							this.qualityProblemList[z].number = res.data.qualityProblemList[z].number
							this.qualityProblemList[z].state = res.data.qualityProblemList[z].state
							this.qualityProblemList[z].id = res.data.qualityProblemList[z].id
						}
					}
				}
				this.standardList = res.data.standardList
				if(this.standardList != null){
					for(var j=0;j<this.standardList.length;j++){
						this.sizeOptions.push({value:this.standardList[j].id,label:this.standardList[j].size})
					}
				}
				if(res.data.specCheckList&&res.data.specCheckList.length!==0){
					let list = res.data.specCheckList;
					let header = await json.dataSourceHandler1(list);
					let headerData = await json.dataSourceHandler2(this.warehouseColumns,header,this.sizeOptions);
					this.warehouseDataSource = headerData;
					console.log('1',this.warehouseDataSource)
				}
			},
			arraySort(property){
			    return function (a, b) { 
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2
			    }
			},
			//上传成功
			onSuccess(response, file, fileList, index){
				console.log(response)
				this.pointCheckList[index].fileUrl = response.data.fileHttpPath
				// this.pointCheckList[index].fileList.push({name:file.name,url:response.data.fileHttpPath})
				this.fileList[0] = {url:response.data.fileHttpPath};
			},
			//上传数量限制
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			//删除
			delList(index){
				this.warehouseDataSource.splice(index,1)
			},
			//新增
			async addList(){
				if(this.sizeValue){
					this.addLoading = true;
					let size = this.sizeOptions.find(x => x.value == this.sizeValue).label
					let data={}
					let partLists = this.gridata.partList
					data['size'] = size;
					for(var i=0;i<partLists.length;i++){
						let partStandardValueList = partLists[i].partStandardValueList
						for(var j=0;j<partStandardValueList.length;j++){
							if(partStandardValueList[j].standardId == this.sizeValue){
								data[partLists[i].name] = {dev1:partStandardValueList[j].deviationMinus,dev2:partStandardValueList[j].deviationPositive,
								isExceed:false,measure:0,measureError:partStandardValueList[j].value,
								standard:partStandardValueList[j].value}
							}
						}
					}
					// let data = await json.headerTurnData(this.warehouseColumns,this.sizeValue);
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
				console.log(1,value)
				let bt = (Number(event)-Number(value.standard)).toFixed(1);
				value.measureError = Number(bt);
				if(bt<value.dev1||bt>value.dev2){
					value.isExceed = false;
				}else{
					value.isExceed = true;
				}
			},
		}
	  }
</script>

<style lang="scss" scoped>
	.circles{
		margin-left: 10px;
		font-size: 10px;
	}
	.el-icon-minus{
		color: #0088FF;
		align-self: center;
	}
	.el-date-editor.el-input, .el-date-editor.el-input__inner {
	    width: 140px;
	}
	.borderstyle>>>.el-input__inner{
		border: 0px;
		background: rgba(0,0,0,0);
		text-align: center;
		width: 50px;
	}
	.Specifications .tableBody{
		padding-top: 15px;
	}
	.colorGreen{
		color: #32CD32;
	}
	.colorRed{
		color: #FF0000;
	}
	// 添加颜色类
	// .el-radio__input.is-checked + .el-radio__label {
	//     color: #fd7624 !important;
	// }
	// .el-radio__input.is-checked .el-radio__inner {
	//     background: #fd7624 !important;
	//     border-color: #fd7624 !important;
	// }
</style>

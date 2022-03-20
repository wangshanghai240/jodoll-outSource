<template>
	<div>
		<div align="center" id="exportlist">
			<table style="width: 1100px;border: #000000 3px solid;border-top-style: none;border-left-style: none;border-right-style: none;">
				<tr>
					<th colspan="2" style="width: 20%"><img :src="jodollImg" alt="image" style="height: 50px;width: 150px;margin-left: 10px;"/></th>
					<th colspan="4" style="width: 50%;font-size: 30px;font-weight: 400;">出货检验报告单</th>
					<th colspan="2" style="width: 20%" align="left">
						编号: {{outcheckCode}}
						<br /> 
						版本:B
					</th>
				</tr>
			</table>
			<table>
				<tr style="font-size: 15px;">
					<td colspan="2" style="width: 350px;">生产工厂:{{factoryName}}</td>
					<td colspan="2" style="width: 150px;"><span v-if="stage == 1">√</span><span v-else>□</span>初期</td>
					<td colspan="2" style="width: 150px;"><span v-if="stage == 2">√</span><span v-else>□</span>中期</td>
					<td colspan="2" style="width: 150px;"><span v-if="stage == 3">√</span><span v-else>□</span>末期</td>
				</tr>
			</table>
			<table style="width: 1100px;" border="1" cellspacing=0 cellpadding=0 >
				<tr align="center">
					<td>产品编号</td>
					<td>产品名称</td>
					<td>下单量</td>
					<td>投产量</td>
					<td>上线时间</td>
					<td>交货期</td>
					<td>检验数</td>
					<td>生产情况</td>
				</tr>
				<tr align="center">
					<td>{{goodsCode}}</td>
					<td>{{goodsName}}</td>
					<td>{{number}}</td>
					<td></td>
					<td>{{onlineDate}}</td>
					<td>{{deliveryDate}}</td>
					<td>{{checkNumber}}</td>
					<td>{{productionInfo}}</td>
				</tr>
			</table>
			<table style="width: 1100px;border-top-style: none;border-bottom-style: none;" border="1" cellspacing=0 cellpadding=0 >
				<tr align="center">
					<td rowspan="2" style="width: 70px">检验项目</td>
					<template v-for="item in headerData">
						<td colspan="3">
							<span>规格:</span>
							<span>{{item.size}}</span>
						</td>
					</template>
				</tr>
				<tr>
					<template v-for="item in headerData">
						<td align="center">
							标准
						</td>
						<td align="center">
							实测
						</td>
						<td align="center">
							误差
						</td>
					</template>
				</tr>
				<template v-for="item in newTableData">
					<tr style="height: 20px;">
						<td align="center">{{item.part}}</td>
						<template v-for="(items,index) in headerData">
							<td align="center">
								{{item[items.size]?item[items.size].standard:''}}
							</td>
							<td align="center">
								{{item[items.size]?item[items.size].measure:''}}
							</td>
							<td align="center">
								{{item[items.size]?item[items.size].measureError:''}}
							</td>
						</template>
					</tr>
				</template>
			</table>
			<table style="width: 1100px;border-top-style: none;border-bottom-style: none;" border="1" cellspacing=0 cellpadding=0 >
				<tr align="center">
					<td rowspan="2" align="center" style="width: 100px">面、辅料点检</td>
					<td style="border-bottom-style: none;border-right-style: none;">
						<span style="margin-left: 20px;">面料<span v-if="materialSpotCheckList[0].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">里料<span v-if="materialSpotCheckList[1].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">配色布<span v-if="materialSpotCheckList[6].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">合格证<span v-if="materialSpotCheckList[7].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">洗水唛<span v-if="materialSpotCheckList[4].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">尺码标<span v-if="materialSpotCheckList[5].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">吊牌<span v-if="materialSpotCheckList[2].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-bottom-style: none;border-left-style: none;">
						<span style="margin-left: 40px;">商标<span v-if="materialSpotCheckList[3].isPass == 0">□</span><span v-else>√</span></span>
					</td>
				</tr>
				<tr align="center">
					<td style="border-top-style: none;border-right-style: none;">
						<span style="margin-left: 20px;">绣花<span v-if="materialSpotCheckList[8].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">拉链<span v-if="materialSpotCheckList[9].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">四件扣<span v-if="materialSpotCheckList[12].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">干燥剂<span v-if="materialSpotCheckList[15].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">备用扣<span v-if="materialSpotCheckList[14].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">装饰件<span v-if="materialSpotCheckList[13].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;border-right-style: none;">
						<span style="margin-left: 40px;">纽扣<span v-if="materialSpotCheckList[10].isPass == 0">□</span><span v-else>√</span></span>
					</td>
					<td style="border-top-style: none;border-left-style: none;">
						<span style="margin-left: 40px;">拉片<span v-if="materialSpotCheckList[11].isPass == 0">□</span><span v-else>√</span></span>
					</td>
				</tr>
			</table>
			<table style="width: 1100px;border-top-style: none;border-bottom-style: none;" border="1" cellspacing=0 cellpadding=0 >
				<tr align="center">
					<td style="width: 80%;">质量问题描述</td>
					<td style="width: 20%;">数量</td>
				</tr>
				<tr v-for="(item,index) in qualityProblemList" :key="index">
					<td>{{item.name}}</td>
					<td align="center">{{item.number}}</td>
				</tr>
				<tr>
					<td colspan="2" style="height: 100px;" valign="top">
						判断结论:{{conclusion}}
					</td>
				</tr>
			</table>
			<table style="width: 1100px;border-top-style: none;border-bottom-style: none;" border="1" cellspacing=0 cellpadding=0 >
				<tr>
					<td rowspan="2" style="width: 5%;" align="center">
						问题属性
					</td>
					<td rowspan="2" style="width: 15%;">
						<span style="margin-left: 20px;">无<span v-if="problemAttribute == 0">√</span><span v-else >□</span></span><br />
						<span style="margin-left: 20px;">轻微<span v-if="problemAttribute == 1">√</span><span v-else >□</span></span><br />
						<span style="margin-left: 20px;">致命<span v-if="problemAttribute == 2">√</span><span v-else >□</span></span><br />
						<span style="margin-left: 20px;">严重<span v-if="problemAttribute == 3">√</span><span v-else >□</span></span>
					</td>
					<td rowspan="2" style="width: 5%;" align="center">
						处理意见
					</td>
					<td rowspan="2" style="width: 15%;">
						<span style="margin-left: 20px;">接受<span v-if="resolution == 0">√</span><span v-else >□</span></span><br />
						<span style="margin-left: 20px;">再检<span v-if="resolution == 1">√</span><span v-else >□</span></span><br />
						<span style="margin-left: 20px;">复检<span v-if="resolution == 2">√</span><span v-else >□</span></span>
					</td>
					<td style="width: 15%;" align="center">检验员</td>
					<td style="width: 15%;"></td>
					<td style="width: 15%;" align="center">工厂确认</td>
					<td style="width: 15%;"></td>
				</tr>
				<tr>
					<td align="center">日期</td>
					<td></td>
					<td align="center">日期</td>
					<td></td>
				</tr>
			</table>
		</div>
		<div align="center" style="margin-top: 20px;">
			<el-button type="primary" style="width: 95px" @click="tes">
				导出
			</el-button>
		</div>
	</div>
</template>

<script>
	import html2canvas from "html2canvas"
	import json from '@/api/technology/tecList.js'
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import {mapGetters} from 'vuex'
	import jodoll from '@/assets/jodoll.png'
	export default {
			name:'export',
			computed: {
				...mapGetters([
					'size',
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
					jodollImg:window.location.origin+jodoll,
					rowstate:this.value,
					factoryName:'',
					goodsCode:'',
					goodsName:'',
					number:'',
					checkNumber:0,
					stage:'',
					onlineDate:'',
					deliveryDate:'',
					productionInfo:'',
					problemAttribute:'',
					resolution:'',
					conclusion:'',
					outcheckCode:'',
					materialSpotCheckList:[{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					},{
						isPass:0
					}],
					qualityProblemList:[],
					specCheckList:[],
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
					sizeOptions:[],
					headerData:[],
					newTableData:[],//处理后的数据
				}
			},
			created() {
				this.getTableData({goodsId:this.rowstate.goodsId})
			},
			mounted(){
				
			},
			methods: {
				//获取基础数据
				async getTableData(id){
					let res = await json.get(this.api.factoryStandard,id);
					// let size = await json.sizeHandler(res.data);
					// this.sizeOptions = size;
					
					let res2 = await json.get(this.api.factoryPart,id);
					if(res2.code==0&&res2.data.length!==0){
						let header = await json.headerHandler(res2.data);
						this.warehouseColumns = this.warehouseColumns.concat(header);
					}
					this.outcheckCode = this.rowstate.outCheckCode
					this.getList()
				},
				getList(){
					json.get(this.api.getgoodsoutcheckId,this.rowstate.id).then(res=>{
						this.factoryName = res.data.factoryName,
						this.goodsCode = res.data.goodsCode
						this.goodsName = res.data.goodsName
						this.number = res.data.number
						this.checkNumber = res.data.checkNumber
						this.stage = res.data.stage
						this.onlineDate = res.data.onlineDate
						this.deliveryDate = res.data.deliveryDate
						this.productionInfo = res.data.productionInfo
						this.problemAttribute = res.data.problemAttribute
						this.resolution = res.data.resolution
						this.conclusion = res.data.conclusion
						this.materialSpotCheckList = res.data.materialSpotCheckList
						this.qualityProblemList = res.data.qualityProblemList
						this.specCheckList = res.data.specCheckList
						let standardList = res.data.standardList
						for(var i=0;i<standardList.length;i++){
							this.sizeOptions.push({label:standardList[i].size,value:standardList[i].id})
						}
						console.log(this.sizeOptions)
						this.getListdata()
						// var partList = res.data.partList
						// var list = []
						// for(var n=0;n<this.specCheckList.length;n++){
						// 	list.push(
						// 	{partName:this.specCheckList[n].partName,partId:this.specCheckList[n].partId,part:[{size:this.specCheckList[n].size,
						// 	bzz:'',measure:this.specCheckList[n].measure,measureError:this.specCheckList[n].measureError}]}
						// 	)
						// 	if(n==0){
						// 		this.sizeLists.push({size:this.specCheckList[n].size,cmsize:[]})
						// 		this.sizeList.push({line:1})
						// 		this.sizeList.push({line:2})
						// 		this.sizeList.push({line:3})
						// 	}else{
						// 		var flag = 0
						// 		for(var m=0;m<this.sizeLists.length;m++){
						// 			if(this.specCheckList[n].size == this.sizeLists[m].size){
						// 				flag = 1
						// 				break
						// 			}
						// 		}
						// 		if(flag == 0){
						// 			this.sizeLists.push({size:this.specCheckList[n].size,cmsize:[]})
						// 			this.sizeList.push({line:1})
						// 			this.sizeList.push({line:2})
						// 			this.sizeList.push({line:3})
						// 		}
						// 	}
						// }
						// if(partList != null){
						// 	for(var i=0;i<partList.length;i++){
						// 		for(var j=0;j<list.length;j++){
						// 			if(list[j].partName == partList[i].name){
						// 				for(var k=0;k<partList[i].partStandardValueList.length;k++){
						// 					if(list[j].partId == partList[i].partStandardValueList[k].standardId){
						// 						for(var l=0;l<list[j].part.length;l++){
						// 							list[j].part[l]['bzz'] = partList[i].partStandardValueList[k].value
						// 						}
						// 					}
						// 				}
						// 			}
						// 		}
						// 	}
						// }
						// for(var s=0;s<list.length;s++){
						// 	if(s == 0){
						// 		this.sizedata.push({partName:list[0].partName,part:[{bzz:list[0].part[0].bzz},
						// 		{measure:list[0].part[0].measure},{measureError:list[0].part[0].measureError}]})
						// 	}else{
						// 		var listflag = 0
						// 		var listindex = 0
						// 		for(var m=0;m<this.sizedata.length;m++){
						// 			if(this.sizedata[m].partName == list[s].partName){
						// 				listflag = 1
						// 				listindex = m
						// 				break
						// 			}
						// 		}
						// 		if(listflag == 0){
						// 			this.sizedata.push({partName:list[s].partName,part:[{bzz:list[s].part[0].bzz},
						// 			{measure:list[s].part[0].measure},{measureError:list[s].part[0].measureError}]})
						// 		}else{
						// 			this.sizedata[m].part.push({bzz:list[s].part[0].bzz},
						// 			{measure:list[s].part[0].measure},{measureError:list[s].part[0].measureError})
						// 		}
						// 	}
						// }
					})
				},
				async getListdata(){
					let tableData = await json.dataSourceHandler1(this.specCheckList);
					let headerData = await json.dataSourceHandler2(this.warehouseColumns,tableData,this.sizeOptions);
					let num = 8 - headerData.length;
					for(let i=0;i <num;i++){
						headerData.push({size:null});
					}
					this.headerData = headerData;
					let headerData2 = await json.dataSourceHandler3(headerData);
					let headerData3 = await json.dataSourceHandler4(headerData2);
					this.newTableData = headerData3;//表
					console.log('table',this.newTableData)
					console.log('header',this.headerData)
				},
				tes() {
					console.log('导出');
					// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
					var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("exportlist").outerHTML + "</body></html>";
					// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
					var blob = new Blob([html], {
						type: "application/vnd.ms-excel"
					});
					const blobURL = window.URL.createObjectURL(blob)
					const tempLink = document.createElement('a')
					tempLink.download = decodeURI('出货检验报告单-'+this.factoryName+'.docx')
					// tempLink.style.display = 'none'
					tempLink.href = blobURL
					document.body.appendChild(tempLink)
					tempLink.click()
					document.body.removeChild(tempLink)
					// 释放
					window.URL.revokeObjectURL(blobURL)
				},
			}
		}
</script>

<style>
</style>

 
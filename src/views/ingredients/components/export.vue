<template>
	<div>
		<div id="exportlist">
			<table style="width: 100%;">
				<tr>
					<td><img :src="jodollImg" alt="image" style="height: 50px;width: 150px;margin-left: 10px;"/></td>
					<td style="font-size:30px;font-weight: bold;width: 80%;" align="left"><span>辅料检验处理单</span></td>
				</tr>
				<tr>
					<td style="font-weight: bold;width: 40%;" align="center">编码:{{serial}}</td>
					<td style="font-weight: bold;width: 60%;" align="center">NO:{{opinionId}}</td>
				</tr>
			</table>
			<table style="width: 100%;border-bottom-style:none;" border="1" cellpadding="0" cellspacing="0">
				<tr>
					<td rowspan="3" align="center" valign="middle" style="width: 40%;height: 210px;">
						<img v-if="image" :src="image" alt="image" style="width: 250px;height: 180px;">
						<span v-else >(实物贴样)</span>
					</td>
					<td align="center" style="width: 15%;">客户名称</td>
					<td colspan="2" style="width: 15%;"> {{clientName}}</td>
					<td align="center" style="width: 15%;">类别</td>
					<td style="width: 15%;">{{classification}}</td>
					<!-- <td rowspan="4" style="width: 13%;" align="center">原辅料类别</td>
					<td style="border-right-style: none;border-bottom-style: none;width: 13%;"> 
					<span style="font-size: 16px;">洗水唛</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[0].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;width: 13%;"> 
					<span style="font-size: 16px;">纽扣</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[1].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;width: 13%;"> 
					<span style="font-size: 16px;">衣罩</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[2].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-left-style: none;border-bottom-style: none;width: 13%;"> 
					<span style="font-size: 16px;">衣架</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[3].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td> -->
				</tr>
				<!-- <tr style="height: 30px;">
					<td style="border-right-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">合格证</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[4].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">腰里</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[5].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">吊粒</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[6].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">织带</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[7].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
				</tr> -->
				<!-- <tr style="height: 30px;">
					<td style="border-right-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">尺码环</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[8].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">拉链</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[9].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">裤钩</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[10].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-left-style: none;border-bottom-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">垫肩</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[11].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
				</tr>
				<tr style="height: 30px;">
					<td style="border-right-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">薄膜袋</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[12].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">商标</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[13].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-right-style: none;border-left-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">线</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[14].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
					<td style="border-left-style: none;border-top-style: none;"> 
					<span style="font-size: 16px;">踢脚带</span>
					<img :src="hook2Img" alt="image" style="width: 14px;margin-left: 10px;" v-if="labeldata[15].pass == 1"/>
					<img :src="frameImg" alt="image" style="margin-right: 10px;width: 14px;" v-else/>
					</td>
				</tr> -->
<!-- 				<tr style="height: 30px;">
					<td align="center">客户名称</td>
					<td colspan="2"> {{clientName}}</td>
					<td align="center">成份</td>
					<td></td>
				</tr> -->
				<tr style="height: 70px;">
					<td align="center">合同号</td>
					<td colspan="2"> {{orderNumber}}</td>
					<td align="center">收货数量</td>
					<td> {{takeNum}}</td>
				</tr>
				<tr style="height: 70px;">
					<td align="center">品/色号</td>
					<td colspan="2"> {{ingredientsCode}}</td>
					<td align="center">检验数量</td>
					<td> {{checkNum}}</td>
				</tr>
				<tr style="height: 40px;">
					<td colspan="7" style="font-size: 20px;font-weight: bold;">性能指标</td>
				</tr>
			</table>
			<table style="width: 100%;border-bottom-style: none;border-top-style: none;" border="1" cellpadding="0" cellspacing="0">
				<tr align="center">
					<td style="width: 5%;">序号</td>
					<td style="width: 15%;">规格</td>
					<td style="width: 15%;">外观</td>
					<td style="width: 15%;">色差</td>
					<td>分析记录</td>
					<td style="width: 10%;">检验结论</td>
				</tr>
				<tr v-for="(item,index) in ingredientsEntryExplainList" :key="index">
					<td align="center">{{index + 1}}</td>
					<td>{{item.specification}}</td>
					<td>{{item.facade}}</td>
					<td>{{item.aberration}}</td>
					<td>{{item.record}}</td>
					<td align="center">{{item.verdict}}</td>
				</tr>
			</table>
			<table style="width: 100%;border-top-style: none;" border="1" cellpadding="0" cellspacing="0">
				<tr>
					<td colspan="4" style="height: 150px;" valign="top">品管部意见:{{qualityControlOpinion}}</td>
				</tr>
				<tr>
					<td colspan="4" style="height: 150px;" valign="top">采购部/客户意见:{{procurementOpinion}}</td>
				</tr>
				<tr>
					<td colspan="4" style="height: 150px;" valign="top">技术部批复意见:{{developmentOpinion}}</td>
				</tr>
				<tr>
					<td colspan="4" style="height: 150px;" valign="top">生产部意见:{{productionOpinion}}</td>
				</tr>
			</table>
			<table style="width: 100%;">
				<tr>
					<td style="width: 50%;font-size: 16px;">检验员:{{updateBy}}</td>
					<td style="width: 50%;font-size: 16px;">审核:</td>
				</tr>
			</table>
		</div>
		<div align="center" style="margin-top: 20px;"><el-button type="primary" @click="tes">导出</el-button></div>
	</div>
</template>

<script>
	import html2canvas from "html2canvas"
	import json from '@/api/technology/tecList.js'
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import {mapGetters} from 'vuex'
	import jodoll from '@/assets/jodoll.png'
	import hooks from '@/assets/hook.svg'
	import hooks2 from '@/assets/hook2.svg'
	import hooks3 from '@/assets/hook4.svg'
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
					this.row = v
				},
			},
			data() {
				return {
					jodollImg:window.location.origin+jodoll,
					hookImg:window.location.origin+hooks,
					hook2Img:window.location.origin+hooks2,
					frameImg:window.location.origin+hooks3,
					row:this.value,
					datasoucre:'',
					clientName:'',
					opinionId:'',
					serial:'',
					orderNumber:'',
					checkNum:'',
					takeNum:'',
					image:'',
					classification:[],
					ingredientsCode:'',
					ingredientsEntryExplainList:[],
					updateBy:'',
					qualityControlOpinion:'',//品管部
					procurementOpinion:'',//采购部
					developmentOpinion:'',//技术部
					productionOpinion:'',//生产部
					// labeldata:[{name:'洗水唛',pass:0},{name:'纽扣',pass:0},{name:'衣罩',pass:0},{name:'衣架',pass:0},{name:'合格证',pass:0},
					// {name:'腰里',pass:0},{name:'吊粒',pass:0},{name:'织带',pass:0},{name:'尺码环',pass:0},{name:'拉链',pass:0},{name:'裤钩',pass:0},
					// {name:'垫肩',pass:0},{name:'薄膜袋',pass:0},{name:'商标',pass:0},{name:'线',pass:0},{name:'踢脚带',pass:0}]
				}
			},
			created() {
				this.getList()
			},
			mounted(){
				
			},
			methods: {
				getList(){
					// var data = {ingredientsCode:this.id.ingredientsCode,ingredientsName:this.id.ingredientsName,isQualified:this.id.isQualified}
					console.log(this.row)
					this.updateBy = this.row.updateBy
					this.opinionId = this.row.orderNumber
					this.serial = this.row.serial
					json.get(this.api.ingCheckDetail,{id:this.row.id}).then(res=>{
						console.log(res)
						this.datasoucre = res.data
						this.image = this.datasoucre.image
						this.clientName = this.datasoucre.clientName
						this.orderNumber = this.datasoucre.orderNumber
						this.checkNum = this.datasoucre.checkNum
						this.takeNum = this.datasoucre.takeNum
						this.classification = this.datasoucre.classification
						// for(var i=0;i<this.classification.length;i++){
						// 	for(var j=0;j<this.labeldata.length;j++){
						// 		if(this.labeldata[j].name == this.classification[i]){
						// 			this.labeldata[j].pass =  1
						// 		}
						// 	}
						// } 
						console.log(this.classification) 
						console.log(this.labeldata)
						this.ingredientsCode = this.datasoucre.ingredientsCode
						this.qualityControlOpinion = this.datasoucre.qualityControlOpinion
						this.procurementOpinion = this.datasoucre.procurementOpinion
						this.developmentOpinion = this.datasoucre.developmentOpinion
						this.productionOpinion = this.datasoucre.productionOpinion
						this.ingredientsEntryExplainList = this.datasoucre.ingredientsEntryExplainList
					})
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
					tempLink.download = decodeURI('出货检验报告单-'+this.clientName+'.docx')
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

 
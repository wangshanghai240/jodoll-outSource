<!--
 * @FileDescription: 合同预览
 * @Author: wang
 * @Date: 2021/3/11
 -->
<template>
	<div class="share">
		<div id="exportTable" ref="imageDom">
			<table style="width: 100%;">
				<tr align="center">
					<th :colspan="linelength" style="font-size: 20px;">2021春夏订单</th>
				</tr>
				<tr style="font-weight: bold;">
					<td width="80%" :colspan="(linelength/2)+1" align="left">工厂:{{name}}</td>
					<td width="20%" :colspan="linelength/2" align="left">合同编号:</td>
				</tr>
			</table>
			<table border="1" width="100%">
				<tr align="center">
					<th width="5%">商品名称</th>
					<th width="10%">公司货号</th>
					<th width="10%">厂家货号</th>
					<th width="15%">成份</th> 
					<th width="8%">货期</th>
					<th width="3%">版型</th>
					<th width="3%">备料</th>
					<th v-for="(item,iIndex) in line" :key="iIndex">{{item}}</th>
					<th width="5%">汇总</th>
					<th width="5%">单价</th>
					<th width="5%">金额</th>
					
					<th >备注</th>
				</tr>
				<tr style="text-align: center;" v-for="(item,index) in alldata" :key="index">
					
					<td>{{item.spmc}}</td>
					<td >{{item.spdm}}</td>
					<td>{{item.gchh}}</td>
					<td >{{item.cf}}</td>
					<td>{{item.yqhq}}</td>
					<td >{{item.bx}}</td>
					<td >{{item.preparationNum}}</td>
					<td v-for="(value,iIndex) in item.linedata" :key="iIndex">{{value}}</td>
					<td>{{item.hz+item.preparationNum}}</td>
					<td>{{item.gcbj}}</td>
					<td >{{(item.hz+item.preparationNum)*item.gcbj}}</td>
					
					<td>{{item.bz}}</td>
				</tr>
				<tr align="center">
					<td>合计</td>
					<td ></td>
					<td ></td>
					<td></td>
					<td ></td>
					<td ></td>
					<td v-for="(item,index) in linedatas" :key="index"></td>
					<td></td>
					<td>{{hztotal}}</td>
					<td></td>
					<td>{{money}}</td>
					<td></td>
				</tr>
				<tr align="center">
					<td :colspan="linelength" width="100%" >注:以上货期为成品到我司仓库时间。</td>
				</tr>
			</table>
			<table width="100%" style="font-size: 16px;">
				<tr>
					<th height="20px"></th>
				</tr>
				<tr>
					<td width="80%" align="left" :colspan="(linelength/2)+1">甲方:浙江乔顿服饰股份有限公司</td>
					<td width="20%" align="left" :colspan="linelength/2">乙方:{{name}}</td>
				</tr>
				<tr>
					<td align="left" :colspan="(linelength/2)+1">甲方授权代理人:</td>
					<td align="left" :colspan="linelength/2">乙方授权代理人:</td>
				</tr>
				<tr>
					<td align="left" :colspan="(linelength/2)+1">甲方法人代表:</td>
					<td align="left" :colspan="linelength/2">乙方法人代表:</td>
				</tr>
				<tr>
					<td align="left" :colspan="(linelength/2)+1">签订日期:{{signTime}}</td>
					<td align="left" :colspan="linelength/2">签订日期:{{signTime}}</td>
				</tr>
			</table>
		</div>
		<div style="text-align: center;" v-if="change == 0">
			<el-button type="warning" style="width: 95px" @click="tes">
				导出
			</el-button>
			<el-button style="width: 95px" @click="images">
				保存图片
			</el-button>
			<el-button type="success" style="width: 95px" @click="shareContract">
				分享
			</el-button>
			<el-button type="primary" style="width: 120px;" @click="confirmContact">
				发起合同流程
			</el-button>	
		</div>
		<div style="text-align: center;" v-else>
			<el-button type="warning" style="width: 95px" @click="tes">
				导出
			</el-button>
			<el-button style="width: 95px" @click="images">
				保存图片
			</el-button>
		</div>
		<!--弹出框-->
		<el-dialog title="合同流程" :visible.sync="proUpDio" @close="proClose" :append-to-body="true">
			<process-up v-model="dgmc" v-if="proUpDio" :model="1" @proClose="proClose(arguments)"></process-up>
		</el-dialog>	
	</div>
</template>

<script>
	import hanjian from '@/api/factory/contracthan.js'
	import html2canvas from "html2canvas"
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import processUp from './processUp.vue'
	export default {
		components: {
			'processUp':processUp,
		},		
		props:{
			value:{
				type:String
			},
			confrimData:{
				type:Object,
				default:()=>{}
			}
		},
		data(){
			return{
				orderNumber:this.value,
				confrimInfo:this.confrimData,
				change:0,
				name:'',
				alldata:[],
				alldatas:[],
				money:0,
				hztotal:0,
				line:[],
				linedata:[],
				linedatas:[],
				linelength:0,
				signTime:'',
				proUpDio:false,
				dgmc:[],			
			}
		},
		created() {
			let url = this.$route.fullPath;
			console.log('url',url)
			let bol = url.indexOf('?');
			console.log('bol',bol)
			if(bol!=-1){
				let newUrl = url.slice(bol+1)
				// console.log(newUrl)
				// console.log('newUrl',newUrl.substr(0,newUrl.length-3))
				let addressUrl=decodeURIComponent(window.atob(decodeURIComponent(newUrl)));
				let obj = urlTransformationObj(addressUrl)
				this.orderNumber = obj.orderNumber
				console.log(obj)
				hanjian.get(this.api.getOrderContract,{orderNumber:obj.orderNumber}).then(res=>{
					this.change = 1
					this.confrimInfo = res.data;
					console.log(this.confrimInfo)
					console.log(this.orderNumber)
					this.getList()
				})
			}
		},
		mounted() {
			console.log(this.confrimInfo)
			this.getList()
		},
		methods:{
			async getList(){
				console.log(this.orderNumber)
				this.alldata = []
				this.alldatas = []
				this.name = this.confrimInfo.eshopOrMeetingGoodsList[0].ghsmc
				this.signTime = this.confrimInfo.contractTime
				this.line = []
				var list = ''
				for(var i = 0;i<this.confrimInfo.eshopOrMeetingGoodsList.length;i++){
					list = this.confrimInfo.eshopOrMeetingGoodsList[i].measurementGoodsList
					var flag = true
					if(list != null){
						for(var j=0;j<list.length;j++){
							for(var k=0;k<this.line.length;k++){
								if(list[j].size == this.line[k]){
									flag = false
									break
								}
							}
							if(flag == true){
								this.line.push(list[j].size)
							}
						}
					}
				}
				this.line.sort();
				this.line.sort(function (m, n) {
				 if (m < n) return -1
				 else if (m > n) return 1
				 else return 0
				});
				for(var n = 0;n<this.confrimInfo.eshopOrMeetingGoodsList.length;n++){
					list = this.confrimInfo.eshopOrMeetingGoodsList[n].measurementGoodsList
					this.linedata = []
					var version =[]
					var data = ''
					if(list != null){
						for(var m = 0;m<list.length;m++){
							var flag1 = true
							for(var b=0;b<version.length;b++){
								if(version[b] == list[m].orderVersion){
									flag1 = false
									break
								}
							}
							if(flag1 == true){
								version.push(list[m].orderVersion)
							}
						}
						for(var v = 0;v<version.length;v++){
							console.log(this.confrimInfo.eshopOrMeetingGoodsList[n].spmc)
							data = {
								spmc:this.confrimInfo.eshopOrMeetingGoodsList[n].spmc,
								spdm:this.confrimInfo.eshopOrMeetingGoodsList[n].spdm,
								gchh:this.confrimInfo.eshopOrMeetingGoodsList[n].gchh,
								cf:this.confrimInfo.eshopOrMeetingGoodsList[n].cf,
								gcbj:this.confrimInfo.eshopOrMeetingGoodsList[n].gcbj,
								yqhq:this.confrimInfo.eshopOrMeetingGoodsList[n].yqhq,
								bz:'',
								zj:this.confrimInfo.eshopOrMeetingGoodsList[n].zj,
								preparationNum:this.confrimInfo.eshopOrMeetingGoodsList[n].preparationNum
							}
							data['bx'] = version[v]
							this.linedata = []
							var total = 0
							for(var s=0;s<this.line.length;s++){
								this.linedata.push(0)
							}
							for(var c = 0;c<list.length;c++){
								if(list[c].orderVersion == version[v]){
									for(var x=0;x<this.line.length;x++){
										if(this.line[x] == list[c].size){
											total = total + list[c].count
											this.linedata[x]=list[c].count
											break
										}
									}
								}
							}
							data['hz'] = total
							this.hztotal = this.hztotal + total;
							let zj = 0;
							zj = (total+this.confrimInfo.eshopOrMeetingGoodsList[n].preparationNum)
								*this.confrimInfo.eshopOrMeetingGoodsList[n].gcbj;
							this.money = this.money + zj
							data['linedata'] = this.linedata
							this.alldata.push(data)
						}
						let preparationNum = this.confrimInfo.eshopOrMeetingGoodsList[n].preparationNum?this.confrimInfo.eshopOrMeetingGoodsList[n].preparationNum:0;
						//hztotal加上备料preparationNum
						this.hztotal = this.hztotal + preparationNum;
					}else{
						for(var m=0;m<this.line.length;m++){
							this.linedata.push(0)
						}
						data = {spmc:this.confrimInfo.eshopOrMeetingGoodsList[n].spmc,
						spdm:this.confrimInfo.eshopOrMeetingGoodsList[n].spdm,
						gchh:this.confrimInfo.eshopOrMeetingGoodsList[n].gchh,
						cf:this.confrimInfo.eshopOrMeetingGoodsList[n].cf,
						bx:'-',
						linedata:this.linedata,
						hz:0,
						gcbj:this.confrimInfo.eshopOrMeetingGoodsList[n].gcbj,
						yqhq:this.confrimInfo.eshopOrMeetingGoodsList[n].yqhq,
						bz:'',
						zj:this.confrimInfo.eshopOrMeetingGoodsList[n].zj,
						preparationNum:this.confrimInfo.eshopOrMeetingGoodsList[n].preparationNum}
						this.alldata.push(data)
					}
				}
				var indexdata = this.alldata[0].linedata
				var indexline = []
				for(var i = 0;i<indexdata.length;i++){
					if(indexdata[i] == ''){
						indexline.push(i)
					}else if(indexdata[i] == 0){
						indexdata.push(i)
					}
				}
				for(var j=1;j<this.alldata.length;j++){
					indexdata = this.alldata[j].linedata
					for(var k=0;k<indexline.length;k++){
						if(indexdata[indexline[k]] != ''){
							indexline[k] = 'false'
						}else if(indexdata[indexline[k]] != 0){
							indexline[k] = 'false'
						}
					}
					for(var n=0;n<indexline.length;n++){
						if(indexline[n] == 'false'){
							indexline.splice(n,1)
							n=0
						}
					}
				}
				for(var l=0;l<indexline.length;l++){
					this.line.splice(indexline[l]-l,1)
				}
				for(var o=0;o<this.alldata.length;o++){
					for(var l=0;l<indexline.length;l++){
						this.alldata[o].linedata.splice(indexline[l]-l,1)
					}
				}
				for(var a=0;a<this.line.length;a++){
					this.linedatas.push('')
				}
				this.linelength = this.linedatas.length + 11
			},
			tes() {
				let str = document.getElementById("exportTable").outerHTML;
				let worksheet = '合同预览'
				let uri = 'data:application/vnd.ms-excel;base64,';
				let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
				  xmlns:x="urn:schemas-microsoft-com:office:excel"
				  xmlns="http://www.w3.org/TR/REC-html40">
				  <meta charset="utf-8">
				  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
				  <x:Name>${worksheet}</x:Name>
				  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
				  </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
				  </head><body>${str}</body></html>`;
				
				const tempLink = document.createElement('a')
				tempLink.download = decodeURI('合同预览.xls')
				tempLink.href = uri + this.base64(template)
				document.body.appendChild(tempLink)
				tempLink.click()
				document.body.removeChild(tempLink)
			},
			base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			},
			images(){
				html2canvas(this.$refs.imageDom).then(canvas => {
					let imgUrl = canvas.toDataURL("image/png");
					var eleLink = document.createElement("a");
					eleLink.href = imgUrl;
					eleLink.download = "合同预览";
					document.body.appendChild(eleLink);
					eleLink.click();
					document.body.removeChild(eleLink);
				});
			},
			shareContract(){
				let url = window.location.href
				let i = url.indexOf('#');
				let newUrl = url.slice(0,i)+'#/conContract?';
				let oInput = document.createElement('input');
				let password = `orderNumber=${this.orderNumber}`;
				oInput.value = newUrl+btoa(encodeURIComponent(password));
				document.body.appendChild(oInput);
				oInput.select();
				document.execCommand("Copy");
				oInput.remove();  
				this.$message.success('复制成功，请在浏览器中粘贴')
			},
			//简单加解密
			getUrlParam(name) {
			    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			    let r = window.location.search.substr(1).match(reg);
			    if (r != null) return unescape(r[2]); return null;
			},
			confirmContact() {
				var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("exportTable").outerHTML +
					"</body></html>";
				var blob = new Blob([html], {
					type: "application/vnd.ms-excel"
				}); // 附件
				let fileName = "工厂函证.xlsx"; // 附件名
				this.dgmc = [this.name,this.orderNumber,fileName,blob,3];
				this.proUpDio = true
			},
			proClose(value){
				console.log(0)
				this.proUpDio = false;
				//this.$emit('hecloseDio',false)
			},
			proCloseDio(value){
				console.log(1)
				this.proUpDio = value;
			},
		}
	}
</script>

<style lang="scss" scoped>
	#exportTable {
		width: 1250px;
		.elTable {
			font-size: 50px !important;
		}
	}

	table {
		border-collapse: collapse;
	}
	.greenColor{
		color: #32CD32;
	}
	.img{
		display: none;
	}
</style>


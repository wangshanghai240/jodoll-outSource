<!--
 * @FileDescription: 函件预览
 * @Author: zhuangzhangyan
 * @Date: 2021/3/11
 * @LastEditors: zhuangzhangyan
 * @LastEditTime: 2021/3/11
 -->
<template> 
	<div>
		<div v-show="false" id="hige" >
			<table style="width: 100%;">
				<tr>
					<th style="text-align: left;font-size: 40px;font-weight: bold;" colspan="8"></th>
					<th colspan="5" style="text-align: center;">
						<img :src="jodollImg" alt="image" style="height: 100px;width: 200px;"/>
					</th>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 40px;font-weight: bold;">浙江乔顿服饰股份有限公司</td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;">ZheJiang QiaoDun FuShi GuFen YouXianGongSi</td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
				</tr>
				<tr>
					<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">   325011  温州高新区科技园兰江路126号品牌中心2楼</td>
				</tr>
				<tr>
					<td colspan="6"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">  电话：86    577  86556122</td>
				</tr>
				<tr>
					<td colspan="6"></td>
					<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">  传真: 86    577  86531820-8788<br>86    577  86539995</td>
				</tr>
			</table>
		</div>
		<div class="share">
			<div id="exportTable" ref="imageDom">
				<table style="width: 100%;">
					<tr>
						<th style="text-align: center;font-size: 40px;font-weight: bold;" colspan="8">浙江乔顿服饰股份有限公司</th>
						<th colspan="5" style="text-align: center;">
							<img :src="jodollImg" alt="image" style="height: 100px;width: 200px;"/>
						</th>
					</tr>
					<tr>
						<td colspan="6" style="text-align: center;font-size: 15px;font-weight: bold;">ZheJiang QiaoDun FuShi GuFen YouXianGongSi</td>
						<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">   325011  温州高新区科技园兰江路126号品牌中心2楼</td>
					</tr>
					<tr>
						<td colspan="6"></td>
						<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">  电话：86    577  86556122</td>
					</tr>
					<tr>
						<td colspan="6"></td>
						<td colspan="7" style="text-align: center;font-size: 15px;font-weight: bold;">  传真: 86    577  86531820-8788<br>86    577  86539995</td>
					</tr>
				</table>
				<div id="low">
					<table  style="width: 950px;font-weight: bold;margin: 0 25px;">
						<tr>
							<th colspan="13"></th>
						</tr>
						<tr>
							<td colspan="3" width="5%">TO:</td>
							<td colspan="10" width="95%">{{this.gsmc}}</td>
						</tr>
						<tr>
							<td colspan="3">FROM:</td>
							<td colspan="10">乔顿外协生产部/李春霞</td>
						</tr>
						<tr>
							<td colspan="3">主题:</td>
							<td colspan="10">{{this.zt}}订单及计划安排</td>
						</tr>
					</table>
					<br />
					<br />
					<div style="margin-left: 25px;">首先，感谢贵司的支持与配合</div>
					<div style="margin-left: 25px;">以下为我司{{this.zt}}后成衣采购数量，请贵司于{{this.nowdate02}}前回复最优惠含税价格以及交货期，以便尽快落实后续相关事宜，谢谢配合！</div>
					<br />
					<table border="1" style=";margin: 0 25px;" id="shareTable">
						<tr style="font-size: 15px;">
							<th width="40">大类</th>
							<!-- <th width="60">供应商</th> -->
							<th width="100">品名</th>
							<th width="110">货品编码</th>
							<th width="70">厂家货号</th>
							<th width="110">面料号1</th>
							<th width="110">面料号2</th>
							<th width="200">成分</th>
							<th width="70">下单数量</th>
							<th width="50">单价</th>
							<th width="120">工厂回复交货期</th>
							<th width="85">要求货期</th>
							<th width="50">备注</th>
						</tr>
						<tr style="text-align: center;" v-for="(item,index) in gridData" :key="index">
							<td>{{item.sxmc}}</td>
							<!-- <td>{{item.ghsmc}}</td> -->
							<td>{{item.spmc}}</td>
							<td>{{item.spdm}}</td>
							<td>{{item.gchh}}</td>
							<td>{{item.mldm}}</td>
							<td>{{item.bh2}}</td>
							<td>{{item.cf}}</td>
							<td>{{item.sl}}</td>
							<td>{{item.gcbj}}</td>
							<td></td>
							<td>{{item.yqhq}}</td>
							<td></td>
						</tr>
						<tr style="text-align: center;">
							<td> 合计 </td>
							<!-- <td>--</td> -->
							<td>--</td>
							<td>--</td>
							<td>--</td>
							<td>--</td>
							<td>--</td>
							<td>--</td>
							<td>{{this.total}}</td>
							<td>--</td>
							<td>--</td>
							<td>--</td>
							<td>--</td>
						</tr>
						<tr>
							<td colspan="13">
								<div>备注：因定货数量还在核对中，以上数量为大致的数量，具体生产数量以正式采购合同订单为准！具体修改意见以最终工艺单为准！</div>
							</td>
						</tr>
					</table>
					<table style="width: 100%;margin-left: 25px;">
						<tr>
							<td colspan="12"> </td>
							<td>
								<div>乔顿外协生产部</div>
								<div>{{this.nowdate}}</div>
							</td>
						</tr>
					</table>
				</div>
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
			</div>
			<div style="text-align: center;" v-else>
				<el-button type="warning" style="width: 95px" @click="tes">
					导出
				</el-button>
				<el-button style="width: 95px" @click="images">
					保存图片
				</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import hanjian from '@/api/factory/hanjian.js'
	import html2canvas from "html2canvas"
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import jodoll from '@/assets/jodoll.png'
	export default {
		props:{
			value:{
				type:String
			},
			orderRow:{
				type:Object,
				default:()=>{}
			}
		},
		data(){
			return{
				jodollImg:window.location.origin+jodoll,
				gridData:[],//源数据
				columns: [...hanjian.columns],
				hjdata:this.value,
				total:0,
				nowdate:'',
				nowdate02:'',//+3天
				hfdate:'',
				gsmc:'',
				zt:'',
				input:'',
				loading:null,
				orderInfo:this.orderRow,
				change :0,
			}
		},
		created() { 
			let url = this.$route.fullPath;
			console.log('url',url)
			let bol = url.indexOf('?');
			console.log('bol',bol)
			if(bol!==-1){
				this.change = 1
				let newUrl = url.slice(bol+1)
				console.log(newUrl)
				if(newUrl.substr(newUrl.length-3,3) == '%3D'){ 
					newUrl = newUrl.substr(0,newUrl.length-3) + '='
				}
				// console.log('newUrl',newUrl.substr(0,newUrl.length-3))
				let addressUrl=decodeURIComponent(window.atob(decodeURIComponent(newUrl)));
				let obj = urlTransformationObj(addressUrl)
				this.orderInfo = obj
			}
		},
		mounted() {
			this.getList()
		},
		methods:{
			getList(){
				this.gsmc=this.orderInfo.name
				const nowDate = new Date();
				const date = {
				    year: nowDate.getFullYear(),
				    month: nowDate.getMonth() + 1,
				    date: nowDate.getDate(),
				}
				const newmonth = date.month>10?date.month:'0'+date.month
				const day = date.date>10?date.date:'0'+date.date
				let day01 = date.date+3;
				let day02 = day01>9?day01:'0'+day01
				this.nowdate = date.year + '-' + newmonth + '-' + day;
				this.nowdate02 = date.year + '-' + newmonth + '-' + day02;
				console.log(this.orderInfo)
				var sourceIds = ''
				var codes = ''
				if(this.orderInfo.sourceId == null){
					sourceIds = ''
				}
				if(this.orderInfo.code == null){
					codes = ''
				}
				var data = {code:codes,orderNumber:this.orderInfo.orderNumber,sourceId:sourceIds}
				hanjian.get(this.api.confirms,data).then(list=>{
					if(list.data == null){
						const nowDate = new Date();
						const dates = {
						    year: nowDate.getFullYear(),
						    month: nowDate.getMonth() + 1,
						    date: nowDate.getDate() + 3,
						}
						console.log('dates',dates)
						if(dates.date>28){
							if(dates.month == 2){
								dates.month = dates.month + 1
								dates.date = dates.date - 28
							}else if(dates.month == 1 || dates.month == 3 || dates.month == 5 ||dates.month == 7 ||dates.month == 8 ||dates.month == 10 ||dates.month == 12){
								if(dates.date > 31){
									dates.month = dates.month + 1
									dates.date = dates.date - 31
								}
							}else if(dates.month == 4 || dates.month == 6 || dates.month == 9 ||dates.month == 11){
								if(dates.date > 30){
									dates.month = dates.month + 1
									dates.date = dates.date - 30
								}
							}
						}
						const newmonths = dates.month>10?dates.month:'0'+dates.month
						const days = dates.date>10?dates.date:'0'+dates.date
						this.hfdate = date.year + '-' + newmonth + '-' + day
					}else{
						this.gridData = list.data
						this.gsmc=this.gridData[0].ghsmc
						this.zt=this.gridData[0].orderMeetingName
						
						const nowDate = new Date();
						const date = {
						    year: nowDate.getFullYear(),
						    month: nowDate.getMonth() + 1,
						    date: nowDate.getDate(),
						}
						const newmonth = date.month>10?date.month:'0'+date.month
						const day = date.date>10?date.date:'0'+date.date
						let day01 = date.date+3;
						let day02 = day01>9?day01:'0'+day01
						this.nowdate = date.year + '-' + newmonth + '-' + day;
						this.nowdate02 = date.year + '-' + newmonth + '-' + day02;
						const dates = {
						    year: nowDate.getFullYear(),
						    month: nowDate.getMonth() + 1,
						    date: nowDate.getDate() + 3,
						}
						console.log('dates',dates)
						if(dates.date>28){
							if(dates.month == 2){
								dates.month = dates.month + 1
								dates.date = dates.date - 28
							}else if(dates.month == 1 || dates.month == 3 || dates.month == 5 ||dates.month == 7 ||dates.month == 8 ||dates.month == 10 ||dates.month == 12){
								if(dates.date > 31){
									dates.month = dates.month + 1
									dates.date = dates.date - 31
								}
							}else if(dates.month == 4 || dates.month == 6 || dates.month == 9 ||dates.month == 11){
								if(dates.date > 30){
									dates.month = dates.month + 1
									dates.date = dates.date - 30
								}
							}
						}
						const newmonths = dates.month>10?dates.month:'0'+dates.month
						const days = dates.date>10?dates.date:'0'+dates.date
						this.hfdate = dates.year + '-' + newmonths + '-' + days
						console.log(this.hfdate)
						this.total = 0
						for(var i=0; i<this.gridData.length; i++){
							this.total = this.total + this.gridData[i].sl
						}
					}
					console.log('grid',this.gridData)
				}).catch(err=>{
					conso.log(err)
					this.$message.warning('失败')
				})
				
			},
			tes() {
				console.log('导出');
				// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
				var html = "<html><head><meta charset='utf-8' /></head><body>" +  document.getElementById("hige").outerHTML + document.getElementById("low").outerHTML +"</body></html>";
				// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
				var blob = new Blob([html], {
					type: "application/vnd.ms-excel"
				});
				const blobURL = window.URL.createObjectURL(blob)
				const tempLink = document.createElement('a')
				tempLink.download = decodeURI('工厂函证-'+this.gsmc+'.xlsx')
				tempLink.style.display = 'none'
				tempLink.href = blobURL
				document.body.appendChild(tempLink)
				tempLink.click()
				document.body.removeChild(tempLink)
				// 释放
				window.URL.revokeObjectURL(blobURL)
			},
			images(){
				html2canvas(this.$refs.imageDom).then(canvas => {
					let imgUrl = canvas.toDataURL("image/png");
					var eleLink = document.createElement("a");
					eleLink.href = imgUrl;
					eleLink.download = "工厂函证-"+this.gsmc;
					document.body.appendChild(eleLink);
					eleLink.click();
					document.body.removeChild(eleLink);
				});
			},
			shareContract(){
				let url = window.location.href
				let i = url.indexOf('#');
				let newUrl = url.slice(0,i)+'#/fatContract?';
				let oInput = document.createElement('input');
				let password = `code=${this.orderInfo.code}&orderNumber=${this.orderInfo.orderNumber}&sourceId=${this.orderInfo.sourceId}`;
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	#exportTable {
		width: 1150px;
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

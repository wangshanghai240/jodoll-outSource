<!--
 * @FileDescription: 合同函查看 预览分享下载
 * @Author: wangpenghui
 -->
<template>
	<div class="share">
		<div id="exportTable" ref="imageDom" >
			<div style="text-align: left;font-size: 15px;font-weight: bold;">合同附件</div>
			<div style="text-align: center;font-size: 25px;font-weight: bold;">面料采购单</div>
			<div style="text-align: right;font-size: 15px;font-weight: bold;">附件编号:<span style="color: red;">{{orderInfo?orderInfo.orderNumber:''}}</span></div>
			<!-- <jod-tableList  :border="true" :dataSource="dataSource" :columns="columns" :options="options">
			</jod-tableList> -->
			<table border="1" style="border-collapse: collapse;width: 100%;" id="shareTable">
				<!-- <caption>
					<div style="font-size: 25px;font-weight: bold;">商品清单</div>
				</caption> --> 
				<tr style="font-size: 15px;">
					<th>序号</th>
					<th>甲方编码</th>
					<th>乙方品号</th>
					<th>成份</th>
					<th>用毛</th>
					<th>纱支/密度</th>
					<th>克重(g/m)</th>
					<th>有效幅宽(cm)</th>
					<th>数量(米)</th>
					<th>单价</th>
					<th>金额</th>
					<th>到货日期</th>
				</tr>
				<tr style="text-align: center;" v-for="(item,index) in dataSource" :key="index">
					<td>{{index+1}}</td>
					<td>{{item.materialCode?item.materialCode:'--'}}</td>
					<td>{{item.productNo?item.productNo:'--'}}</td>
					<td>{{item.component?item.component:'--'}}</td>
					<td>{{item.wool?item.wool:'--'}}</td>
					<td>{{item.weaving?item.weaving:'--'}}</td>
					<td>{{item.gram?item.gram:'--'}}</td>
					<td>{{item.clothWidth?item.clothWidth:'--'}}</td>
					<td>{{item.purchaseNum?item.purchaseNum:'--'}}</td>
					<td>{{item.price?item.price:'--'}}</td>
					<td>{{item.amount?item.amount:'--'}}</td>
					<td>{{item.deliveryTime?item.deliveryTime:'--'}}</td>
				</tr>
				<tr style="text-align: center;">
					<td> 合计 </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> -- </td>
				</tr>
				<tr>
					<td colspan="12">
						<div v-if="orderInfo.contractStyle" v-html="orderInfo.contractStyle"></div>
						<div v-else style="text-align: center;">暂无</div>
						<!-- <div>备注:</div>
						<div>1、标的物符合GB-T2664-2009 标准，及本采购单所要求的所有技术要求。</div>
						<div>2、数量浮动：±3%。出大货前，请先提供船样供甲方确认。大货按确认的船样生产，并在约定的交期前交货。</div>
						<div>3、正确标识面料正、方面：</div>
						<div style="color: #32CD32;text-indent:20px;">面料米样:(1)面料标签、或面料上，明确说明面料正、反面。</div>
						<div style="color: #32CD32;text-indent:80px;">(2)面料标签、或面料上无明确正、反面标识说明的，以贴标签的一面为面料正面。</div>
						<div style="color: #32CD32;text-indent:20px;">成卷的大货面料:(1)面料标签、或面料上，明确说明面料正、反面。</div>
						<div style="color: #32CD32;text-indent:120px;">(2)面料标签、或面料上无明确正、反面标识说明的，以面料卷取在里面的那一面为正面。</div>
						<div>4、乙方业务部门须将本合同标的物的具体要求，如实、完整地传达给其生产部门，以保证标的物完全满足合同要求。后期如有要求，沟通后以书面形式确认。</div>
						<div>5、面料为直幅中性包装，吊牌和外包装上明确标识甲方编码。除甲方信息外，不得含有任何能识别乙方的信息内容。</div>
						<div>6、其他未尽事宜，见双方签订的合同（合同编号：JCMP200406）。</div> -->
					</td>
				</tr>
			</table>
			<table style="width: 100%;border-collapse: collapse;">
				<tr>
					<td>
						<div>甲方</div>
						<div>单位名称（章）：浙江乔顿服饰股份有限公司</div>
						<div>委托代理人：</div>
						<div>日  期：{{orderInfo?orderInfo.signTime:''}}</div>
					</td>
					<td> </td>
					<td> </td>
					<td> </td>
					<td> </td> 
					<td> </td>
					<td> </td>  
					<td> </td>
					<td>
						<div>乙方</div>
						<div>单位名称（章）：{{orderInfo?orderInfo.supplierName:''}}</div>
						<div>委托代理人：</div>
						<div>日  期：{{orderInfo?orderInfo.signTime:''}}</div>
					</td>
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
		<el-dialog title="合同流程" :visible.sync="proUpDio" @close="proClose(value)" :append-to-body="true">
			<process-up v-model="dgmc" v-if="proUpDio" @proClose="proClose(arguments)"></process-up>
		</el-dialog>
	</div>
</template>

<script>
	import share from '@/api/fabric/share.js'
	import html2canvas from "html2canvas"
	import { loading } from '@/utils'
	import {urlTransformationObj} from '@/utils/validate.js'
	import processUp from '../../factory/components/processUp.vue'
	export default {
		components: {
			'processUp':processUp,
		},
		props: {
			value: {
				type: String
			},
			orderRow: {
				type:Object,
				default:()=>{}
			}
		},
		watch:{
			value(v){
				if(v){
					this.id = v;
					this.loading = loading(document.getElementsByClassName('share')[0])
					this.getList().then(res=>{
						if(res){
							for(let i = 1; i < 11; i++){
								this.calcTotal(document.getElementById('shareTable'),i);
							}
						}
						this.loading.close();
					}).catch(err=>{
						this.loading.close();
						this.$emit('shareClose',false,err)
					})
				}
			},
			orderRow(v){
				this.orderInfo = v
			}
		},
		data() {
			return {
				id: this.value,
				dataSource: [],
				columns: share.columns,
				options: share.options,
				list:[0,1,2,3,4,5,6,7,9,11],
				orderInfo:this.orderRow,
				change:0,
				loading:null,
				proUpDio:false,
				dgmc:[],
			}
		},
		created() {
			this.loading = loading(document.getElementsByClassName('share')[0])
			console.log(this.$route.fullPath)
			let url = this.$route.fullPath;
			let bol = url.indexOf('?');
			if(bol!==-1){
				this.change = 1
				let newUrl = url.slice(bol+1)
				let addressUrl=decodeURIComponent(window.atob(decodeURIComponent(newUrl)));
				let obj = urlTransformationObj(addressUrl)
				console.log(addressUrl)
				this.orderInfo = obj
				this.id = obj.orderNumber
			}
			// let id = this.$route.query.id;
			// if(id){
			// 	this.id = id
				
			// }
		},
		mounted() {
			this.getList().then(res=>{
				if(res){
					for(let i = 1; i < 11; i++){
						this.calcTotal(document.getElementById('shareTable'),i);
					}
				}
				this.loading.close();
			}).catch(err=>{
				this.loading.close();
				this.$emit('shareClose',false,err)
			})
		},
		methods: {
			getList() {
				return new Promise((res,rej)=>{
					if(this.id){
						share.get(this.api.confirm, {orderNumber: this.id}).then(list=>{
							let {purchaseList,contractStyle} = list.data;
							this.orderInfo['contractStyle'] = contractStyle;
							this.dataSource = purchaseList;
							res(true)
						}).catch(err=>{
							rej(err)
						})
					}else{
						rej('暂无合同编号')
					}
					
				})
			},
			calcTotal(table,column){
				
				let trs = table.getElementsByTagName('tr');
				let start = 1,
					end = trs.length - 2;
				let total = 0;
				for (let i = start; i < end; i++) {
					let td = trs[i].getElementsByTagName('td')[column];
					let t = parseFloat(td.innerHTML);
					let bol = this.list.includes(column)
					console.log('td',td)
					console.log('t',t)
					console.log('bol',bol)
					if (t&&!bol) total += t 
					else total='--';
					
				}
				trs[end].getElementsByTagName('td')[column].innerHTML=total;
			},
			tes() {
				console.log('导出');
				// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
				var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("exportTable").outerHTML +
					"</body></html>";
				// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象

				var blob = new Blob([html], {
					type: "application/vnd.ms-excel"
				});
				const blobURL = window.URL.createObjectURL(blob)
				const tempLink = document.createElement('a')
				tempLink.download = decodeURI('面料合同函.xlsx')
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
					eleLink.download = "面料合同函-"+this.orderRow.supplierName;
					document.body.appendChild(eleLink);
					eleLink.click();
					document.body.removeChild(eleLink);
				});
			},
			shareContract(){
				let url = window.location.href
				let i = url.indexOf('#');
				console.log(i)
				let newUrl = url.slice(0,i)+'#/facContract?';
				let oInput = document.createElement('input');
				let password = `orderNumber=${this.id}&supplierName=${this.orderRow.supplierName}&signTime=${this.orderRow.signTime}`;
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
				let fileName = "面料合同函-"+this.orderRow.supplierName+".xlsx"; // 附件名
				this.dgmc = [this.orderRow.supplierName,this.orderRow.orderNumber,fileName,blob,1];
				this.proUpDio = true
			},
			proClose(value){
				console.log(value)
				if(value[0] == false){
					this.$emit('flushSupplierOrderList',false)
					this.proUpDio = false;
				}else{
					this.proUpDio = false;
				}
			},
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
</style>

<!--
 * @FileDescription: 合同函查看 预览分享下载
 * @Author: wangpenghui
 -->
<template>
	<div class="share">
		<div id="exportTable" ref="imageDom">
			<div style="text-align: left;font-size: 15px;font-weight: bold;">合同附件</div>
			<div style="text-align: center;font-size: 25px;font-weight: bold;">辅料采购单</div>
			<div style="text-align: right;font-size: 15px;font-weight: bold;">附件编号:<span style="color: red;">{{orderInfo?orderInfo.orderNumber:''}}</span></div>
			<!-- <jod-tableList  :border="true" :dataSource="dataSource" :columns="columns" :options="options">
			</jod-tableList> -->
			<table border="1" style="width: 100%;" id="shareTable">
				<!-- <caption>
					<div style="font-size: 25px;font-weight: bold;">商品清单</div>
				</caption> -->
				<tr style="font-size: 15px;">
					<th>序号</th>
					<th>物料名称</th>
					<th>厂家货号</th>
					<th>乔顿代码</th>
					<th>规格型号</th>
					<th>数量</th>
					<th>单位</th>
					<!-- <th>含税含费单价(元)</th> -->
					<th>单价(元)</th>
					<th>金额</th>
					<th>到货日期</th>
					<th>质量要求</th>
					<th>备注</th>
				</tr>
				<tr style="text-align: center;" v-for="(item,index) in dataSource" :key="index">
					<td>{{index+1}}</td>
					<td>{{item.ingredientsName?item.ingredientsName:'-'}}</td>
					<td>{{item.factoryNo?item.factoryNo:'-'}}</td>
					<!-- <td class="exportInput" >
						<transition name="fade" mode="out-in">
							<el-input v-if="!submit" key="pt01" v-model="input" placeholder="请输入厂家货号"></el-input>
							<div v-if="submit" key="pt02">{{input}}</div>
						</transition>
					</td> -->
					<td>{{item.ingredientsCode?item.ingredientsCode:'-'}}</td>
					<!-- <td class="exportInput" >
						<transition name="fade" mode="out-in">
							<el-input v-if="!submit" key="pt03" v-model="input2" placeholder="请输入规格"></el-input>
							<div v-if="submit" key="pt04">{{input2}}</div>
						</transition>
					</td> -->
					<td>{{item.productModel?item.productModel:'--'}}</td>
					<td>{{item.purchaseNum?item.purchaseNum:'--'}}</td>
					<td>{{item.unit?item.unit:'--'}}</td>
					<td>{{item.price?item.price:'--'}}</td>
					<td>{{item.purchaseNum&&item.price?(item.purchaseNum*item.price).toFixed(2):'--'}}</td>
					<td>{{item.deliveryTime?item.deliveryTime:'--'}}</td>
					<td>{{item.qualityClaim?item.qualityClaim:'--'}}</td>
					<td>{{item.remark?item.remark:'--'}}</td>
				</tr>
				
				<tr>
					<td colspan="2" style="text-align: center;font-size: 15px;font-weight: bold;">
						采购说明
					</td>
					<td colspan="10">
						<div v-html="orderInfo.description"></div>
					</td>
				</tr>
			</table>
			<table style="width: 100%;">
				<tr>
					<td style="width: 70%;">
						<div>甲方:</div>
						<div>下单人</div>
						<div>日  期：{{orderInfo?orderInfo.signTime:''}}</div>
					</td>
					<td>
						<div>乙方:</div>
						<div>确认人：</div>
						<div>日  期：{{orderInfo?orderInfo.signTime:''}}</div>
					</td>
				</tr>
			</table>
			 
		</div>
		<div style="text-align: center;" v-if="change == 0">
			<!-- <el-button type="warning" style="width: 95px" @click="">
				保存提交
			</el-button> -->
			<el-button type="warning" :loading="exportLoading" style="width: 95px" @click="tes">
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
			<el-button type="warning" :loading="exportLoading" style="width: 95px" @click="tes">
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
		data() {
			return {
				id: this.value,
				dataSource: [],
				columns: share.columns,
				options: share.options,
				list:[0,1,2,3,4,5,10],
				exportLoading:false,
				change:0,
				submit:false,//全局提交按钮
				input: '',
				input2:'',
				loading:null,
				orderInfo:this.orderRow,
				proUpDio:false,
				dgmc:[],
			}
		},
		created() {
			this.loading = loading(document.getElementsByClassName('share')[0])
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
		},
		mounted() {
			this.getList().then(res=>{
				this.loading.close();
			})
		},
		methods: {
			getList() {
				return new Promise((res,rej)=>{
					share.get(this.api.ingConfirm, {orderNumber: this.id}).then(list=>{
						console.log(list)
						let {description,purchaseList} = list.data;
						this.orderInfo['description'] = description;
						this.dataSource = purchaseList;
						res(true)
					})
				})
			},
			tes() {
				this.submit = true;
				this.exportLoading = true;
				console.log('导出');
				setTimeout(()=>{
					// 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
					var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("exportTable").outerHTML +
						"</body></html>";
					// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
					
					var blob = new Blob([html], {
						type: "application/vnd.ms-excel"
					});
					const blobURL = window.URL.createObjectURL(blob)
					const tempLink = document.createElement('a')
					tempLink.download = decodeURI('辅料合同函.xlsx')
					tempLink.style.display = 'none'
					tempLink.href = blobURL
					document.body.appendChild(tempLink)
					tempLink.click()
					document.body.removeChild(tempLink)
					// 释放
					window.URL.revokeObjectURL(blobURL)
					this.submit = false;
					this.exportLoading = false;
				},2000)
			},
			images(){
				html2canvas(this.$refs.imageDom).then(canvas => {
					let imgUrl = canvas.toDataURL("image/png");
					var eleLink = document.createElement("a");
					eleLink.href = imgUrl;
					eleLink.download = "辅料合同函";
					document.body.appendChild(eleLink);
					eleLink.click();
					document.body.removeChild(eleLink);
				});
			},
			shareContract(){
				let url = window.location.href
				let i = url.indexOf('#');
				console.log(i)
				let newUrl = url.slice(0,i)+'#/ingContract?';
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
				let fileName = "辅料合同函.xlsx"; // 附件名
				this.dgmc = [this.orderRow.supplierName,this.orderRow.orderNumber,fileName,blob,2];
				this.proUpDio = true
			},
			proClose(value){
				console.log(value)
				if(value[0] == false){
					this.$emit('shareClose',false)
				}else{
					this.proUpDio = false;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	#exportTable {
		width: 950px;
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
	.exportInput{	

		input{
			border: 0;
			width: 100%!important;
			height:100%!important;
			line-height:100%!important;
		}
	}
</style>

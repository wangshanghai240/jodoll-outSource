<template>
	<transition name="fade" mode="out-in">
		<div v-if="exportObject!==null">
			<div id="exportTable">
				<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;">
					<tr>
						<td style="width: 38%;">
							<img :src="jodollImg" alt="image" style="height: 50px;width: 200px;margin-left: 10px;"/>
						</td>
						<td style="width: 62%;">
							<span style="font-size: 28px;font-weight: bold;">物 料 检 验 处 理 单</span>
						</td>
					</tr>
				</table>
				<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;font-size: 15px;font-weight: bold;text-align: center;">
					<tr>
						<td>
							编码：{{value.serial}}
						</td>
						<td>
							NO: {{exportObject.orderNumber}}
						</td>
					</tr>
				</table>
				<table border="2" cellpadding=0 cellspacing=0 style="width: 100%;padding: 2px;">
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;">
						<tr style="text-align: center;">
							<th rowspan="6" style="width: 45%;">
								<img style="width: 100%;" :src="exportObject.image" />
							</th>
							<td rowspan="3" style="width: 10%;text-align:justify;text-align-last:justify;padding: 0px 10px;">
								物料类别
							</td>
							<td colspan="3" rowspan="3" style="width: 43%;">
								<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;">
									<tr>
										<template v-for="item in category1">
											<td>
												{{item.label}}
											</td>
											<td v-if="item.isPass" style="width: 19px;">
												<img :src="hook2Img" alt="image" style="margin-right: 8px;width: 19px;"/>
											</td>
											<td v-else style="width: 19px">
												<img :src="frameImg" alt="image" style="margin-right: 8px;width: 19px;"/>
											</td>
										</template>
									</tr>
									<tr>
										<template v-for="item in category2">
											<td>
												{{item.label}}
											</td>
											<td v-if="item.isPass" style="border: 0px;width: 19px;">
												<img :src="hook2Img" style="margin-right: 8px;width: 19px;"/>
											</td>
											<td v-else style="border: 0px;width: 19px;">
												<img :src="frameImg" style="margin-right: 8px;width: 19px;"/>
											</td>
										</template>
									</tr>
									<tr>
										<template v-for="item in category3">
											<td>
												{{item.label}}
											</td>
											<td v-if="item.isPass" style="border: 0px;width: 19px;">
												<img :src="hook2Img" style="margin-right: 8px;width: 19px;"/>
											</td>
											<td v-else style="border: 0px;width: 19px;">
												<img :src="frameImg" style="margin-right: 8px;width: 19px;"/>
											</td>
										</template>
									</tr>
									<tr>
										<template v-for="item in category4">
											<td>
												{{item.label}}
											</td>
											<td v-if="item.isPass" style="border: 0px;width: 19px;">
												<img :src="hook2Img" style="margin-right: 8px;width: 19px;"/>
											</td>
											<td v-else style="border: 0px;width: 19px;">
												<img :src="frameImg" style="margin-right: 8px;width: 19px;"/>
											</td>
										</template>
									</tr>
								</table>

							</td>
						</tr>
						<tr></tr>
						<tr></tr>
						<tr>
							<td style="height: 30px;padding: 0px 10px;text-align: center;">客户名称</td>
							<td style="width: 20%;padding: 0 10px;text-align: center;">{{exportObject.clientName}}</td>
							<td style="width: 10%;text-align: center;;padding: 0px 10px;">成份</td>
							<td style="width: 20%;padding: 0 10px;text-align: center;">{{exportObject.component}}</td>
						</tr>
						<tr>
							<td style="height: 30px;text-align: center;padding: 0px 10px;">合同号</td>
							<td style="padding: 0 10px;text-align: center;">{{exportObject.contractNo}}</td>
							<td style="text-align: center;padding: 0px 10px;">收货数量</td>
							<td style="padding: 0 10px;text-align: center;">{{exportObject.takeNum}}</td>
						</tr>
						<tr>
							<td style="height: 30px;text-align: center;padding: 0px 10px;">品 / 色号</td>
							<td style="padding: 0 10px;text-align: center;">{{exportObject.materialCode}}</td>
							<td style="text-align: center;padding: 0px 10px;">检验数量</td>
							<td style="padding: 0 10px;text-align: center;">{{exportObject.checkNum}}</td>
						</tr>
					</table>
				</table>
				<div style="margin-left: 10px;margin-top: 5px;margin-bottom: 5px;font-weight: bold;font-size: 17px;">检验说明:</div>
				<table border="2" cellpadding=0 cellspacing=0 style="width: 100%;padding: 1px;">
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;">
						<tr>
							<th colspan="7" style="font-size: 18px;">表面部分</th>
						</tr>
						<tr style="text-align: center;">
							<td rowspan="2" style="padding: 0 10px;">序号</td>
							<td rowspan="2" style="width: 70px;">匹号</td>
							<td rowspan="2" style="padding: 0 10px;">标长 (m)</td>
							<td rowspan="2" style="padding: 0 10px;">实长 (m)</td>
							<td rowspan="2" style="padding: 0 10px;">幅宽 (cm)</td>
							<td style="width: 520px;border-bottom: 1px dashed #000000;">分析记录</td>
							<td rowspan="2" style="padding: 0 10px;">检验结论</td>
						</tr>
						<tr>
							<td style="border-top: 0px;text-align: center;">（色杠、粗纱、纱结、毛头、抽丝、纬斜等）</td>
						</tr>
						<template v-for="(item,index) in exportObject.fabricEntryExplainList">
							<tr style="height: 30px;text-align: center;">
								<td>{{index+1}}</td>
								<td>{{item.equalNo}}</td>
								<td>{{item.normLength}}</td>
								<td>{{item.realityLength}}</td>
								<td>{{item.breadth}}</td>
								<td>{{item.record}}</td>
								<td>{{item.verdict}}</td>
							</tr>
						</template>
						<tr style="height: 30px;text-align: center;">
							<td>{{exportObject.fabricEntryExplainList.length+1}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr style="height: 30px;text-align: center;">
							<td>{{exportObject.fabricEntryExplainList.length+1}}</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					</table>
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;border-top: 0px;">
						<tr>
							<th rowspan="2" style="width: 100px;font-size: 17px;">
								条格
							</th>
							<td style="text-align: center;">大小</td>
							<td style="text-align: center;">
								<span>准确</span>
								<span>( <img :src="hookImg" v-if="exportObject.magnitude=='1'" style="width: 15px;"/> )</span>
								<span>误差</span>
								<span>( <img :src="hookImg" v-if="exportObject.magnitude=='2'" style="width: 15px;"/> )</span>
							</td>
							<td style="text-align: center;">清晰度</td>
							<td style="text-align: center;">
								<span>清晰</span>
								<span>( <img :src="hookImg" v-if="exportObject.definition=='1'" style="width: 15px;"/> )</span>
								<span>不清晰</span>
								<span>( <img :src="hookImg" v-if="exportObject.definition=='2'" style="width: 15px;"/> )</span>
							</td>
						</tr>
						<tr>
							<td style="text-align: center;">阴阳条格</td>
							<td style="text-align: center;">
								<span>无</span>
								<span>( <img :src="hookImg" v-if="exportObject.lace=='1'" style="width: 15px;"/> )</span>
								<span>有</span>
								<span>( <img :src="hookImg" v-if="exportObject.lace=='2'" style="width: 15px;"/> )</span>
							</td>
							<td style="text-align: center;">倒顺绒</td>
							<td style="text-align: center;">
								<span>无</span>
								<span>( <img :src="hookImg" v-if="exportObject.velvet=='1'" style="width: 15px;"/> )</span>
								<span>有</span>
								<span>( <img :src="hookImg" v-if="exportObject.velvet=='2'" style="width: 15px;"/> )</span>
							</td>
						</tr>
						<tr>
							<th style="width: 100px;font-size: 17px;">结论</th>
							<td colspan="4" style="text-align: center;">
								<span>判定合格</span>
								<span>( <img :src="hookImg" v-if="exportObject.isQualified" style="width: 15px;"/> )</span>
								<span>判定不合格</span>
								<span>( <img :src="hookImg" v-if="!exportObject.isQualified" style="width: 15px;"/> )</span>
							</td>
						</tr>
					</table>
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;margin-top: 2px;">
						<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;height: 150px;">
							<tr>
								<td style="padding-top: 10px;padding-left: 10px;">
									处理意见:
								</td>
							</tr>
							<tr>
								<td style="padding: 10px 30px;">
									{{exportObject.qualityControlOpinion}}
								</td>
							</tr>
						</table>
					</table>
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;margin-top: 2px;">
						<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;height: 150px;">
							<tr>
								<td style="padding-top: 10px;padding-left: 10px;">
									采购部/客户意见:
								</td>
							</tr>
							<tr>
								<td style="padding: 10px 30px;">
									{{exportObject.procurementOpinion}}
								</td>
							</tr>
							<tr>
								<td style="width: 80%;text-align: right;padding-right: 50px;">
									批复人 : {{exportObject.procurementPerson}}
								</td>
								<td style="text-align: center;">
									{{exportObject.procurementTime}}
								</td>
							</tr>
						</table>
					</table>
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;margin-top: 2px;">
						<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;height: 150px;">
							<tr>
								<td style="padding-top: 10px;padding-left: 10px;">
									技术部批复意见:
								</td>
							</tr>
							<tr>
								<td style="padding: 10px 30px;">
									{{exportObject.developmentOpinion}}
								</td>
							</tr>
							<tr>
								<td style="width: 80%;text-align: right;padding-right: 50px;margin-top: 2px;">
									批复人 : {{exportObject.developmentPerson}}
								</td>
								<td style="text-align: center;">
									{{exportObject.developmentTime}}
								</td>
							</tr>
						</table>
					</table>
					<table border="1" cellpadding=0 cellspacing=0 style="width: 100%;margin-top: 2px;">
						<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;height: 150px;">
							<tr>
								<td style="padding-top: 10px;padding-left: 10px;">
									生产部意见:
								</td>
							</tr>
							<tr>
								<td style="padding: 10px 30px;">
									{{exportObject.productionOpinion}}
								</td>
							</tr>
							<tr>
								<td style="width: 80%;text-align: right;padding-right: 50px;">
									批复人 : {{exportObject.productionPerson}}
								</td>
								<td style="text-align: center;">
									{{exportObject.productionTime}}
								</td>
							</tr>
						</table>
					</table>
				</table>
				<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;margin-top: 5px;margin-bottom: 5px;font-size: 16px;">
					<tr style="height: 50px;">
						<td style="width: 30%;">检验员 : {{exportObject.qualityControlOpinion}}</td>
						<td style="width: 20%;">{{exportObject.qualityControlTime}}</td>
						<td style="width: 30%;text-align: center;">审核:</td>
						<td style="width: 20%;text-align: center;">
							<span>年</span>
							<span style="padding-left: 30px;">月</span>
							<span style="padding-left: 30px;">日</span>
						</td>
					</tr>
				</table>
			</div>
			<div style="text-align: center;margin-top: 20px;">
				<el-button type="primary" plain @click="exportTable">导出</el-button>
			</div>
		</div>
	</transition>
</template>

<script>
	import warehouse from '@/api/fabric/warehouse.js'
	import jodoll from '@/assets/jodoll.png'
	import hooks from '@/assets/hook.svg'
	import hooks2 from '@/assets/hook2.svg'
	import hooks3 from '@/assets/hook4.svg'
	export default {
		name:'warhouseExport',
		props:{
			value:{
				type:Object,
				default:()=>{}
			}
		},
		data(){
			return {
				jodollImg:window.location.origin+jodoll,
				hookImg:window.location.origin+hooks,
				hook2Img:window.location.origin+hooks2,
				frameImg:window.location.origin+hooks3,
				category1:[...warehouse.category1],//物料类别
				category2:[...warehouse.category2],//物料类别
				category3:[...warehouse.category3],//物料类别
				category4:[...warehouse.category4],//物料类别
				exportObject:null,
			}
		},
		created() {
			console.log(hooks2)
			this.getList();
		},
		methods:{
			async getList(){
				let data = await warehouse.get(this.api.fabricDetail,{id:this.value.id});
				if(data.code==0){
					let classification = data.data.classification;//物料类别
					this.category1.forEach((item,index)=>{
						if(item.label==classification){
							item.isPass = true;
						}
					});
					this.category2.forEach((item,index)=>{
						if(item.label==classification){
							item.isPass = true;
						}
					});
					this.category3.forEach((item,index)=>{
						if(item.label==classification){
							item.isPass = true;
						}
					});
					this.category4.forEach((item,index)=>{
						if(item.label==classification){
							item.isPass = true;
						}
					})
					this.exportObject = data.data;
				}
			},
			exportTable(){
				var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("exportTable").outerHTML + "</body></html>";
				// 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
				var blob = new Blob([html], {
					type: "application/vnd.ms-excel"
				});
				const blobURL = window.URL.createObjectURL(blob)
				const tempLink = document.createElement('a')
				tempLink.download = decodeURI('入库检.docx')
				// tempLink.style.display = 'none'
				tempLink.href = blobURL
				document.body.appendChild(tempLink)
				tempLink.click()
				document.body.removeChild(tempLink)
				// 释放
				window.URL.revokeObjectURL(blobURL)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont{
	    font-family:"iconfont" !important;
	    font-size:10px;font-style:normal;
	    -webkit-font-smoothing: antialiased;
	    -webkit-text-stroke-width: 0.2px;
	    -moz-osx-font-smoothing: grayscale;
	}
	.check {
		border: 1px solid #000000;
		width: 15px;
		height: 15px;
		margin: auto;
	}
	.isTrue{
		position: relative;
		overflow: hidden;
	}
	.isTrue:after{
		position: absolute;
		display: block;
		content: "\e782";
		top: -1px;
		right: -1px;
		font-family:'iconfont';
		font-size: 11pt;
		font-weight: normal;
	}
</style>

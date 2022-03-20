<template>
	<transition name="fade" mode="out-in">
		<div>
			<div id="exportTable">
				<table border="0" cellpadding=0 cellspacing=0 style="width: 100%;">
					<tr>
						<td style="width: 40%;">
							<img :src="jodollImg" alt="image" style="height: 50px;width: 200px;margin-left: 10px;"/>
						</td>
						<td style="width: 60%;">
							<span style="font-size: 28px;font-weight: bold;">入库检验报告单</span>
						</td>
					</tr>
				</table>
				<!-- <div style="display: flex;justify-content: space-around;height: 50px;">
					<img :src="jodollImg" alt="image" style="height: 50px;width: 200px;margin-left: 10px;"/>
					<span style="font-size: 28px;font-weight: bold;">入库检验报告单</span>
				</div> -->
				<table cellspacing=0 cellpadding=0 border="1" style="width: 100%;margin-top: 5px;">
					<tr>
						<template v-for="item in info">
							<th>
								{{item.label}}
							</th>
						</template>
					</tr>
					<tr>
						<template v-for="item in info">
							<td style="text-align: center;">
								{{infoForm[item.prop]}}
							</td>
						</template>
					</tr>
				</table>
				<table cellspacing=0 cellpadding=0 border="1" style="width: 100%;margin-top: 5px;">
					<tr>
						<th rowspan="2" style="text-align: center;width: 60px;">
							检验项目
						</th>
						<template v-for="item in headerData">
							<th colspan="3">
								<span style="margin-left: 20px;">规格:</span>
								<span style="font-size: 14px;line-height: 18px;padding-right: 50px;">{{item.size}}</span>
							</th>
						</template>
					</tr>
					<tr>
						<template v-for="item in headerData">
							<th>
								标准
							</th>
							<th>
								实测
							</th>
							<th>
								误差
							</th>
						</template>
					</tr>
					<template v-for="item in newTableData">
						<tr style="height: 20px;">
							<th>{{item.part}}</th>
							<template v-for="(items,index) in headerData">
								<th>
									{{item[items.size]?item[items.size].standard:''}}
								</th>
								<th>
									{{item[items.size]?item[items.size].measure:''}}
								</th>
								<th>
									{{item[items.size]?item[items.size].measureError:''}}
								</th>
							</template>
						</tr>
					</template>
					<tr>
						<th></th>
						<th :colspan="headerData.length*3">
							<table cellspacing=0 cellpadding=0 border="0" style="width: 100%;">
								<tr style="width: 100%;">
									<th>面辅料点检 : </th>
									<template v-for="item in materialIntos">
										<th>
											<td>{{item.materialName}}</td>
											<td style="padding-left: 3px;">
												<img :src="hook3Img" v-if="item.isPass=='0'"/>
												<img :src="hook2Img" v-else style="padding-right: 2px;width: 19px;"/>
											</td>
										</th>
									</template>
									
									
								</tr>
							</table>
						</th>
					</tr>
				</table>
				<table border="1" cellspacing=0 cellpadding=0 style="width: 100%;border-top: 0px;">
					<tr>
						<th style="width: 76%;font-size: 17px;">质量问题描述</th>
						<th style="width: 6%;">致命缺陷</th>
						<th style="width: 6%;">严重缺陷</th>
						<th style="width: 6%;">轻微缺陷</th>
						<th style="width: 6%;">数量</th>
					</tr>
					<template v-for="item in problemIntos">
						<tr style="height: 25px;">
							<th style="text-align: left;padding-left: 20px;">{{item.name}}</th>
							<th style="text-align: center;">
								<img :src="hooks" v-if="item.state=='2'"/>
							</th>
							<th style="text-align: center;">
								<img :src="hooks" v-if="item.state=='3'"/>
							</th>
							<th style="text-align: center;">
								<img :src="hooks" v-if="item.state=='1'"/>
							</th>
							<th style="text-align: center;">{{item.number}}</th>
						</tr>
					</template>
					
					<tr style="height: 25px;">
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					<tr style="height: 25px;">
						<th></th>
						<th></th>
						<th></th>
						<th></th>
						<th></th>
					</tr>
					<tr style="height: 55px;">
						<th style="width: 76%;text-align: left;padding-left: 5px;padding-bottom: 30px;">判定结论 : {{conclusion}}</th>
						<th style="width: 6%;text-align: left;padding-left: 5px;">
							<div>返修占比</div>
							<div style="height: 20px;text-align: center;">{{proportion}}%</div>
						</th>
						<th style="width: 6%;padding-left: 5px;">
							<div>致命</div>
							<img :src="hooks" v-if="problemAttribute=='2'"/>
							<div v-else style="height: 20px;"></div>
						</th>
						<th style="width: 6%;padding-left: 5px;">
							<div>严重</div>
							<img :src="hooks" v-if="problemAttribute=='3'"/>
							<div v-else style="height: 20px;"></div>
						</th>
						<th style="width: 6%;padding-left: 5px;">
							<div>轻微</div>
							<img :src="hooks" v-if="problemAttribute=='1'"/>
							<div v-else style="height: 20px;"></div>
						</th>
					</tr>
				</table>
				<table border="0" cellspacing=0 cellpadding=0 style="width: 100%;">
					<tr style="text-align: right;height: 30px;">
						<td>日期 : {{rowInfo.createTime}}</td>
					</tr>
					<tr style="text-align: right;height: 30px;">
						<td :colspan="4" style="padding-right: 30px;">品牌技术部</td>
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
	import json from '@/api/factory/warehouse.js'
	import jodoll from '@/assets/jodoll.png'
	import hooks from '@/assets/hook.svg'
	import hooks2 from '@/assets/hook2.svg'
	import hooks3 from '@/assets/hook4.svg'
	export default {
		name:'warehouseExport',
		props:{
			value:{
				type:Object,
				default:()=>{}
			},
			rowInfo:{
				type:Object,
				default:()=>{}
			}
		},
		watch:{
			value(v){
				this.detailsValue = v;
			}
		},
		data(){
			return{
				detailsValue:this.value,
				jodollImg:window.location.origin+jodoll,
				hooks:window.location.origin+hooks,
				hook2Img:window.location.origin+hooks2,
				hook3Img:window.location.origin+hooks3,
				title:'上衣',
				info:[
					{
						label:'产品编号',
						prop:'goodsCode'
					},{
						label:'产品名称',
						prop:'goodsName'
					},{
						label:'生产工厂',
						prop:'factoryName'
					},{
						label:'跟单员',
						prop:'createBy'
					},{
						label:'交货期',
						prop:'deliveryDate'
					},{
						label:'订单量',
						prop:'number'
					},{
						label:'入库数',
						prop:'arriveNumber'
					},{
						label:'检验数',
						prop:'checkNumber'
					}
				],
				infoForm:{},
				specificationsList:[],
				materialIntos:null,//面辅料点检
				sizeOptions:null,
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
				headerData:[],
				newTableData:[],//处理后的数据
				problemIntos:[],//问题描述
				conclusion:'',//结论
				//attribute:[...json.attribute],
				problemAttribute:null,
				proportion:0,//返修占比
			}
		},
		created() {
			this.getTableData({'goodsId':this.detailsValue.goodsId})
		},
		methods:{
			//获取基础数据
			async getTableData(id){
				let res = await json.get(this.api.factoryStandard,id);
				let size = await json.sizeHandler(res.data);
				this.sizeOptions = size;
				let res2 = await json.get(this.api.factoryPart,id);
				//console.log(res2);
				if(res2.code==0&&res2.data.length!==0){
					let header = await json.headerHandler(res2.data);
					//console.log(header);
					this.warehouseColumns = this.warehouseColumns.concat(header);
				}
				this.getData();
			},
			async getData(){
				try{
					let data = await json.post(this.api.goodsIntoDetail,{...this.detailsValue});
					let {goodsCode,goodsName,factoryName,deliveryDate,number,arriveNumber,checkNumber,materialIntos,
						specCheckList,problemIntos,conclusion,problemAttribute,reworkNumber} = data.data;
					this.infoForm = {goodsCode,goodsName,factoryName,deliveryDate,number,arriveNumber,checkNumber,createBy:this.rowInfo.createBy};
					this.materialIntos = materialIntos;
					let tableData = await json.dataSourceHandler1(specCheckList);
					let headerData = await json.dataSourceHandler2(this.warehouseColumns,tableData,this.sizeOptions);
					let num = 8 - headerData.length;
					for(let i=0;i <num;i++){
						headerData.push({size:null});
					}
					this.headerData = headerData;
					let headerData2 = await json.dataSourceHandler3(headerData);
					let headerData3 = await json.dataSourceHandler4(headerData2);
					this.newTableData = headerData3;//表
					this.problemIntos = problemIntos;//问题描述
					this.conclusion = conclusion;//结论
					this.problemAttribute = problemAttribute;//问题属性
					this.proportion = (reworkNumber/arriveNumber*100).toFixed(1);
				}catch(e){
					if(typeof e =='string'){
						this.$message.error(e)
					}else{
						console.log(e)
					}
					this.$emit('closeExport',false)
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
				tempLink.download = decodeURI('入库检验报告单.docx')
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

<style>
</style>

<!--
 * @FileDescription: 产前样预览
 * @Author: wangpenghui
 * @Date: 2021/3/13
 -->
<template>
	<transition name="fade" mode="out-in">
		<div v-if="isData">
			<div id="preBody" ref="printElement">
				<div class="top">
					<div class="left">
						<img src="@/assets/logo.jpg" style="width: 160px;" />
					</div>
					<div class="center">
						产前批版确认单
					</div>
					<div class="right">
						<div>编号:ws-cs-04-40</div>
						<div>版本:测试</div>
					</div>
				</div>
				<table
				  border="3"
				  style="width: 100.2%;border-bottom: 1px solid #000;
				    margin-top: 10px;border-collapse: collapse;line-height: 23px;">
					<th>生产工厂</th>
					<td style="text-align: center;">{{previewData.information.factory}}</td>
					<th>公司赁号</th>
					<td style="text-align: center;">{{previewData.information.itemNo}}</td>
					<th>数量</th>
					<td style="text-align: center;">{{previewData.information.count}}</td>
					<th>交货时间</th>
					<td style="text-align: center;">{{previewData.information.deliveryTime}}</td>
				</table>
				<table border="3" class="tableBox" id="previewTable">
					<tr style="font-size: 15px;">
						<td :rowspan="previewData.merchandiser.editionCheckList.length+4" class="leftT">
							外协跟单员填写
						</td>
					</tr>
					<tr style="font-size: 20px;text-align: center;">
						<td colspan="24">
							规格测量: 
							<span style="margin-left: 20px;margin-right: 20px;">{{newSizeValue}}</span>
							批版日期:  
							<span style="margin-left: 20px;">{{previewData.merchandiser.createTime}}</span>
						</td>
					</tr>
					<tr>
						<th colspan="2"></th>
						<template v-for="(item,index) in tableList">
							<th :style="index==tableList.length-1?'border-right: 3px solid #000000;':''">
								{{item.name}}
							</th>
							<!-- <th  style="width: 9%;" v-if="tableList.length-1==index">{{item.name}}</th>
							<th  style="width: 9%;" v-else-if="tableList.length-2==index">{{item.name}}</th>
							<th style="width: 9%;" v-else>{{item.name}}</th> -->
						</template>
					</tr>
					<tr>
						<th colspan="2">来样</th>
						<template v-for="(item,index) in tableList">
							<th :style="index==tableList.length-1?'border-right: 3px solid #000000;':''">
								{{item.sample}}
							</th>
							<!-- <th colspan="3" style="width: 9%;" v-if="tableList.length-1==index">{{item.sample}}</th>
							<th colspan="3" style="width: 9%;" v-else-if="tableList.length-2==index">{{item.sample}}</th>
							<th colspan="2" style="width: 9%;" v-else>{{item.sample}}</th> -->
						</template>
						
					</tr>
					<tr>
						<th colspan="2">误差</th>
						<template v-for="(item,index) in tableList">
							<th :style="index==tableList.length-1?'border-right: 3px solid #000000;':''">
								{{item.offset}}
							</th>
							<!-- <th colspan="3" style="width: 9%;" v-if="tableList.length-1==index">{{item.offset}}</th>
							<th colspan="3" style="width: 9%;" v-else-if="tableList.length-2==index">{{item.offset}}</th>
							<th colspan="2" style="width: 9%;" v-else>{{item.offset}}</th> -->
						</template>
					</tr>
					<tr>
						<td colspan="24">
							<div style="display: flex;justify-content: space-between;font-size: 16px;">
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.merchandiser.editionCheckList[0].isPass?'isTrue':''">
									</div>
									主标位置订法
								</div>
								<div style="display: flex;">
									<div class="check"
										:class="previewData.merchandiser.editionCheckList[1].isPass?'isTrue':''">
									</div>
									板型标位置订法
								</div>
								<div style="display: flex;">
									<div class="check"
										:class="previewData.merchandiser.editionCheckList[2].isPass?'isTrue':''">
									</div>
									水洗唛位置订法
								</div>
								<div style="display: flex;">
									<div class="check"
										:class="previewData.merchandiser.editionCheckList[3].isPass?'isTrue':''">
									</div>
									特色标位置订法
								</div>
								<div style="margin-right: 10px;display: flex;">
									<div class="check"
										:class="previewData.merchandiser.editionCheckList[4].isPass?'isTrue':''">
									</div>
									挂牌位
								</div>
							</div>
			
						</td>
					</tr>
					<template v-for="(item,index) in previewData.merchandiser.editionCheckList.length-2">
						<tr>
							<td colspan="1" style="text-align: center;">{{item}}.</td>
							<td colspan="23" style="text-align: left;padding-left: 20px;">
								<span v-if="previewData.merchandiser.editionCheckList[index+5]" style="display: flex;">
									<div style="width: 300px;line-height: 20px;">{{previewData.merchandiser.editionCheckList[index+5].label}}</div>
									<div style="line-height: 20px;">{{previewData.merchandiser.editionCheckList[index+5].isPass?'通过':'拒绝'}}</div>
									<div style="line-height: 20px;margin-left: 20px;">{{previewData.merchandiser.editionCheckList[index+5].remark}}</div>
								</span>
							</td>
						</tr>
					</template>
					<tr style="border-right: 3px solid #000000;">
						<td colspan="25" style="text-align: right;">
							<div style="display: flex;justify-content: flex-end;">
								<div style="margin-right: 50px;font-size: 15px;font-weight: bold;">
									{{previewData.merchandiser.isPass?'通过':'不通过'}}
								</div>
								<div style="margin-right: 50px;">
									跟单员:<span style="margin-left: 20px;font-size: 15px;font-weight: 400;">
										{{previewData.merchandiser.createBy}}
									</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td rowspan="6" class="leftT" style="padding: 10px 0;">
							设计开发填写
						</td>
						<th colspan="10">设计/研发确认内容（ √ × )</th>
						<th colspan="14">内容说明</th>
					</tr>
					<tr>
						<th colspan="10">
							<div style="display: flex;justify-content: flex-start;margin-left: 20px;">
								辅料:
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[0].editionCheckList.length!==0&&
										previewData.development.development[0].editionCheckList[0].isPass
										?'isTrue':''">
									</div>
									钮扣
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[0].editionCheckList.length!==0&&
										previewData.development.development[0].editionCheckList[1].isPass
										?'isTrue':''">
									</div>
									拉链
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[0].editionCheckList.length!==0&&
										previewData.development.development[0].editionCheckList[2].isPass
										?'isTrue':''">
									</div>
									标牌
								</div>
							</div>
						</th>
						<td colspan="14" style="text-align: center;">
							<template v-for="(item,index) in previewData.development.development[0].editionCheckList">
								<span v-if="item.remark">{{item.remark}}</span>
								<span v-if="previewData.development.development[0].editionCheckList[index+1]
									&&previewData.development.development[0].editionCheckList[index+1].remark!==''
									&&item.remark!==''">;</span>
							</template>
						</td>
					</tr>
					<tr>
						<th colspan="10" style="text-align: center;">
							<div style="display: flex;justify-content: flex-start;margin-left: 20px;">
								面料:
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[1].editionCheckList.length!==0&&
										previewData.development.development[1].editionCheckList[0].isPass
										?'isTrue':''">
									</div>
									颜色
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[1].editionCheckList.length!==0&&
										previewData.development.development[1].editionCheckList[1].isPass
										?'isTrue':''">
									</div>
									手感
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[1].editionCheckList.length!==0&&
										previewData.development.development[1].editionCheckList[2].isPass
										?'isTrue':''">
									</div>
									纹理
								</div>
							</div>
						</th>
						<td colspan="14" style="text-align: center;">
							<template v-for="(item,index) in previewData.development.development[1].editionCheckList">
								<span v-if="item.remark">{{item.remark}}</span>
								<span v-if="previewData.development.development[1].editionCheckList[index+1]
									&&previewData.development.development[1].editionCheckList[index+1].remark!==''
									&&item.remark!==''">;</span>
							</template>
						</td>
					</tr>
					<tr>
						<th colspan="10" style="text-align: center;">
							<div style="display: flex;justify-content: flex-start;margin-left: 20px;">
								款式:
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[2].editionCheckList.length!==0&&
										previewData.development.development[2].editionCheckList[0].isPass
										?'isTrue':''">
									</div>
									外观效果
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[2].editionCheckList.length!==0&&
										previewData.development.development[2].editionCheckList[1].isPass
										?'isTrue':''">
									</div>
									内部结构
								</div>
							</div>
						</th>
						<td colspan="14" style="text-align: center;">
							<template v-for="(item,index) in previewData.development.development[2].editionCheckList">
								<span v-if="item.remark">{{item.remark}}</span>
								<span v-if="previewData.development.development[2].editionCheckList[index+1]
									&&previewData.development.development[2].editionCheckList[index+1].remark!==''
									&&item.remark!==''">;</span>
							</template>
						</td>
					</tr>
					<tr>
						<th colspan="10" style="text-align: center;">
							<div style="display: flex;justify-content: flex-start;margin-left: 20px;">
								其他:
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[3].editionCheckList.length!==0&&
										previewData.development.development[3].editionCheckList[0].isPass
										?'isTrue':''">
									</div>
									印花
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check"
										:class="previewData.development.development[3].editionCheckList.length!==0&&
										previewData.development.development[3].editionCheckList[1].isPass
										?'isTrue':''">
									</div>
									绣花
								</div>
							</div>
						</th>
						<td colspan="14" style="text-align: center;">
							<template v-for="(item,index) in previewData.development.development[3].editionCheckList">
								<span v-if="item.remark">{{item.remark}}</span>
								<span v-if="previewData.development.development[3].editionCheckList[index+1]
									&&previewData.development.development[3].editionCheckList[index+1].remark!==''
									&&item.remark!==''">;</span>
							</template>
						</td>
					</tr>
					<tr>
						<td colspan="24" style="text-align: right;">
							<div style="display: flex;justify-content: flex-end;">
								<div style="margin-right: 50px;font-size: 15px;font-weight: bold;">
									{{previewData.development.isPass?'通过':'不通过'}}
								</div>
								<div style="margin-right: 50px;font-size: 15px;font-weight: 400;">
									设计/开发确认签字:<span style="margin-left: 20px;">
										{{previewData.development.createBy}}
									</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td rowspan="1" class="leftT" style="padding: 10px 0;">
							外协生产部填写
						</td>
						<th colspan="24">
							<div style="height: 150px;text-align: left;margin-left: 20px;margin-top: 10px;font-size: 15px;">
								外观审核意见: 
								<div style="margin-left: 50px;margin-top: 20px;height: 100px;">
									{{previewData.product.productionOpinion}}
								</div>
							</div>
							<div style="display: flex;justify-content: flex-end;">
								<div style="margin-right: 50px;font-size: 15px;font-weight: bold;">
									{{previewData.product.isPass?'通过':'不通过'}}
								</div>
								<div style="text-align: right;margin-right: 50px;
								  font-size: 15px;margin-bottom: 10px;">
									审核签字:<span style="margin-left: 20px;">
										{{previewData.product.createBy}}
									</span>
								</div>
							</div>
						</th>
					</tr>
					<tr>
						<td rowspan="1" class="leftT" style="padding: 10px 0;">
							技术部填写
						</td>
						<th colspan="24">
							<div style="display: flex;justify-content: space-between;">
								<div style="margin-left: 20px;">技术确认（ √ × )</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check" :class="previewData.technology.editionCheckList[0].isPass?'isTrue':''"></div>
									原工艺单要求
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check" :class="previewData.technology.editionCheckList[1].isPass?'isTrue':''"></div>
									板型
								</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check" :class="previewData.technology.editionCheckList[2].isPass?'isTrue':''"></div>
									规格
								</div>
								<div style="display: flex;margin-left: 10px;margin-right: 20px;">
									<div class="check" :class="previewData.technology.editionCheckList[3].isPass?'isTrue':''"></div>
									穿着外观效果
								</div>
							</div>
							<div style="margin-top: 30px;height: 50px;text-align: left;margin-left: 70px;">
								{{previewData.technology.technologyOpinion}}
							</div>
							<div style="display: flex;justify-content: flex-end;">
								<div style="margin-right: 50px;font-size: 15px;font-weight: bold;">
									{{previewData.technology.isPass?'通过':'不通过'}}
								</div>
								<div style="text-align: right;margin-right: 50px;
								  font-size: 15px;margin-bottom: 10px;">
									审核签字:<span style="margin-left: 20px;">
										{{previewData.technology.createBy}}
									</span>
								</div>
							</div>
						</th>
					</tr>
					<!-- <tr>
						<td rowspan="1" class="leftT">
							品质部填写
						</td>
						<th colspan="24">
							<div style="display: flex;justify-content: space-between;">
								<div style="margin-left: 20px;">项目:</div>
								<div style="display: flex;margin-left: 10px;">
									<div class="check" :class="previewData.quality.editionCheckList[0].isPass?'isTrue':''"></div>
									18401+纤维含量
								</div>
								<div style="display: flex;margin-left: 5px;">
									<div class="check" :class="previewData.quality.editionCheckList[1].isPass?'isTrue':''"></div>
									色牢度
								</div>
								<div style="display: flex;margin-left: 5px;">
									<div class="check" :class="previewData.quality.editionCheckList[2].isPass?'isTrue':''"></div>
									起毛起球
								</div>
								<div style="display: flex;margin-left: 5px;margin-right: 20px;">
									<div class="check" :class="previewData.quality.editionCheckList[3].isPass?'isTrue':''"></div>
									纰裂
								</div>
								<div style="display: flex;margin-left: 5px;margin-right: 20px;">
									<div class="check" :class="previewData.quality.editionCheckList[4].isPass?'isTrue':''"></div>
									缩水率
								</div>
								<div style="display: flex;margin-left: 5px;margin-right: 20px;">
									<div class="check" :class="previewData.quality.editionCheckList[5].isPass?'isTrue':''"></div>
									产品标识
								</div>
							</div>
							<div style="text-align: left;margin-left: 20px;margin-top: 10px;font-size: 15px;">
								外观审核意见: 
								<div style="margin-left: 50px;margin-top: 20px;height: 50px;">
									{{previewData.quality.exteriorOpinion}}
								</div>
							</div>
							<div style="text-align: right;margin-right: 150px;
								font-size: 15px;margin-bottom: 10px;">审核签字:</div>
						</th>
					</tr> -->
					
				</table>
			</div>
			<jod-print :html="printHtml" :repeat="repeat" />
			<el-button type="primary" style="margin-top: 10px;" @click="print">打印</el-button>
		</div>
	</transition>
</template>

<script>
	import json from '@/api/factory/approval.js'
	export default {
		name:'preview',
		props:{
			value:{
				type:String
			},
			operatorOptions:{
				type:Array
			},
		},
		data() {
			return {
				previewData:{},
				printHtml: '',
				newSizeValue:null,//尺码
				repeat: false, //用于重复打开打印窗口
				list1:[1,2,3,4,5,6,7,8],
				isData:false,
				tableList:null,
			}
		},
		created() {
			this.getData();
		},
		methods: {
			async getData(){
				let res = await json.get(this.api.findEditionSign,{goodsId:this.value});
				if(res.code==0){
					let num = 10-res.data.merchandiser.specificationList.length;
					let list = [...res.data.merchandiser.specificationList];
					for(let i=0;i<num;i++){
						list.push({
							goodsId: null,
							id: null,
							name: null,
							offset: null,
							sample: null
						})
					}
					this.tableList = list;
					this.previewData = res.data;
					this.isData = true;
					if(this.operatorOptions&&this.operatorOptions.length!==0){
						let newSizeValue = this.operatorOptions.find(x => x.value == res.data.merchandiser.size).label;
						this.newSizeValue = newSizeValue;
					}
				}
			},
			print() {
				this.repeat = !this.repeat;
				this.printHtml = this.$refs.printElement.innerHTML;
			},
		}
	}
</script>

<style lang="scss" scoped>
	#preBody {}
	th{
		font-weight: 400;
	}
	.top {
		display: flex;
		width: 100%;
		justify-content: space-between;
		border-bottom: 5px solid #000000;

		.left {
			margin-left: 10px;
		}

		.center {
			margin: auto 0;
			font-size: 35px;
			text-align: center;
			font-weight: normal;
		}

		.right {
			margin: auto 0;
			margin-right: 70px;
			text-align: left;
			font-size: 15px;
		}
	}
	
	.tableBox {
		width: 100%;
		border-top: 0px;
		border-collapse: collapse;
		.leftT{
			width: 40px;
			font-size: 20px;
			text-align: center;
		}
		.check {
			border: 1px solid #000000;
			width: 15px;
			height: 15px;
			margin: auto;
			margin-right: 5px;
		}
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

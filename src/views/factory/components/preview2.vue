<!--
 * @FileDescription: 批版预览
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
					<template v-for="(item,index) in previewData.merchandiser.editionCheckList.length+1">
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
					<tr>
						<td colspan="24" style="text-align: right;">
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
					
					<!-- 审核意见 -->
					<tr>
						<th colspan="24">
							<div style="text-align: left;margin-left: 20px;margin-top: 10px;font-size: 15px;">
								审核意见: 
								<div style="margin-left: 50px;margin-top: 20px;height: 50px;">
									{{previewData.overallOpinion}}
								</div>
							</div>
							<div style="display: flex;justify-content: flex-end;">
								<div style="margin-right: 50px;font-size: 15px;font-weight: bold;">
									{{previewData.isPass?'通过':'不通过'}}
								</div>
								<div style="text-align: right;margin-right: 100px;
								  font-size: 15px;margin-bottom: 10px;">
									审核签字:<span style="margin-left: 20px;">
										{{previewData.createBy}}
									</span>
								</div>
							</div>
						</th>
					</tr>
					<!-- 工厂接收意见 -->
					<tr>
						<th colspan="24">
							<div style="text-align: left;margin-left: 20px;margin-top: 10px;font-size: 15px;">
								工厂接收意见: 
								<div style="margin-left: 50px;margin-top: 20px;height: 50px;">
									
								</div>
							</div>
							<div style="text-align: right;margin-right: 150px;
								font-size: 15px;margin-bottom: 10px;">工厂确认签字:</div>
						</th>
					</tr>
				</table>
				<div style="font-size: 14px;text-align: left;">
					注：收到此表后请在两个工作日内签字回传，如有不明之处请与我司跟单人员沟通，谢谢配合！
				</div>
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

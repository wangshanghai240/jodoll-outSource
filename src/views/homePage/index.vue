<!--
 * @FileDescription: 首页
 * @Author: wangpenghui
 -->
<template>
	<div class="homePage">
		<div class="homePage_header">
			<div v-for="(item,key) in Object.keys(map)" :key="key">
				<div class="item_label">{{item}}</div>
				<div class="item_value" :style="`border-bottom: 3px solid ${styleObj[item]};color:${styleObj[item]};`" @click="changeItem(item,key+1)">
					{{map[item]}}
				</div>
			</div>
		</div>
		<div class="homePage_body">
			<div>
				<span>工厂:</span>
				<el-select :size="size" v-model="factoryValue" clearable filterable remote :remote-method="remoteMethod" :loading="loading" 
				 placeholder="工厂" style="width: 100px;">
					<el-option v-for="item in factoryOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div>
				<span>交期区间:</span>
				<el-date-picker :size="size" v-model="date" type="daterange" range-separator="至" style="width: 250px;" value-format="yyyy-MM-dd"
					start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</div>
			<div>
				<span>品类:</span>
				<el-select :size="size" v-model="categoryValue" placeholder="品类" clearable style="width: 100px;">
					<el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</div>
			<div>
				<span>状态:</span>
				<el-select :size="size" v-model="stateValue" placeholder="状态" clearable style="width: 100px;">
					<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<!-- <div>
				<span>年份:</span>
				<el-date-picker v-model="yearValue" type="year" value-format="yyyy" placeholder="年份" :size="size" clearable style="width: 100px;">
				</el-date-picker>
			</div> -->
			<div>
				<span>季度:</span>
				<el-select v-model="quarterValue" placeholder="季度" :size="size" clearable style="width: 100px;">
					<el-option v-for="item in quarterOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</div>
			<div>
				<el-button type="primary" :size="size" @click="getHomeData(true)">搜索</el-button>
			</div>
		</div>
		<div class="echartTitle">
			SKU分布图
		</div>
		<div class="homePage_echarts">
			<div class="radioValueLeft">
				<el-radio-group v-model="radioValueLeft" size="mini" @change="radioLeft">
					<el-radio-button :label="1">个数</el-radio-button>
					<el-radio-button :label="2">数量</el-radio-button>
				</el-radio-group>
			</div>
			<div class="radioValueRight">
				<el-button-group>
					<el-button type="primary" size="mini" @click="radioRight(2)">全选</el-button>
					<el-button type="info" plain size="mini" @click="radioRight(1)">取消</el-button>
				</el-button-group>
			</div>
			<div id="echarts1" :style="{width:'40%', height: '100%'}"></div>
			<div id="echarts2" :style="{width:'60%',height: '100%'}"></div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import json from '@/api/homePage.js'
	import { loading } from '@/utils'
	
	export default {
		computed: {
			...mapGetters([
				'size',
				'categoryList'
			])
		},
		// watch:{
		// 	skuSelect:{
		// 		handler(v){
		// 			console.log(v)
		// 		},
		// 		deep:true
		// 	}
		// },
		data() {
			return {
				loadingDom:null,
				radioValueLeft:'1',
				//radioValueRight:'1',
				map: {},//看板
				styleObj: {
					'总数': '#62a3eb',
					'已完成': '#91CC75',
					'未完成': '#68D6CE',
					'已逾期': '#EE6666',
					'待处理': '#FF8D1A',
					'已批版': '#FFA591',
					'已到料': '#FFC300',
					'已开裁': '#E33C64',
					'已上线': '#D43030',
					'已下线': '#A6A6A6',
					'出货检中': '#4E4E4E'
				},
				//工厂
				loading:false,
				factoryOptions: [],
				factoryValue: '',
				//交期
				date: '',
				//品类
				categoryOptions: [],
				categoryValue: '',
				//状态
				stateOptions: json.stateOptions,
				stateValue: '',
				//年份
				yearValue:'',
				//季度
				quarterOptions: [],
				quarterValue: '',
				//图表
				myChart1: null,
				diagramItem:null,
				diagramCount:null,
				merchandiserList:[],//搜索用
				skuName:null,//暂无用的options
				skuNameList:null,
				skuCodeList:null,
				skuSelect:null,
				option1:{
					tooltip: {
						trigger: 'axis',
						axisPointer: { // Use axis to trigger tooltip
							type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
						}
					},
					legend: {
						bottom: '3%',
						left: 'center',
						data: ['正常', '预警', '滞后']
					},
					grid: {
						left: '3%',
						right: '5%',
						bottom: '10%',
						containLabel: true
					},
					xAxis: {
						type: 'value'
					},
					yAxis: {
						type: 'category',
						data: ['已入库检', '已出货检', '已下线', '已上线', '已开裁',
							'已到料', '已批版', '签订合同', '初步下单', '开始'
						]
					},
					series: [{
							name: '正常',
							type: 'bar',
							stack: 'total',
							color: '#91cc75',
							label: {
								show: true,
								
							},
							emphasis: {
								focus: 'series'
							},
							data: []
						},
						{
							name: '预警',
							type: 'bar',
							stack: 'total',
							color: '#fac858',
							label: {
								show: true,
								
							},
							emphasis: {
								focus: 'series'
							},
							data: []
						},
						{
							name: '滞后',
							type: 'bar',
							stack: 'total',
							color: '#ee6666',
							label: {
								show: true,
								
							},
							emphasis: {
								focus: 'series'
							},
							data: []
						}
					]
				},
				myChart2: null,
				clickBol:false,//用于圆饼内部点击
				clickName:'',//用于圆饼名称存储
				clickTitleBol:false,//用于头部点击
				option2:{
					// title: {
					// 	text: '',
					// 	top: "3%",
					// 	textStyle: {
					// 		color: "#333",
					// 		fontSize: 24,
					// 		left: 'center'
					// 	}
					// },
					tooltip: {
						trigger: 'item'
					},
					
					legend: [{
							selected:{},
							top: '0%',
							//orient: 'vertical',
							left: 'center',
							data: []
						},
						{
							bottom: '0%',
							//orient: 'vertical',
							left: 'center',
							data: ['正常', '预警', '滞后']
						}
					],
					color: ['#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#91cc75', '#fac858', '#ee6666'],
					series: [{
							name: '人员',
							type: 'pie',
							selectedMode: 'single',
							radius: [0, '25%'],
							label: {
								position: 'inner',
								fontSize: 12
							},
							labelLine: {
								show: false
							},
							data: []
						},
						{
							name: 'SKU个数',
							type: 'pie',
							selectedMode: 'single',
							radius: ['30%', '40%'],
							label: {
								position: 'inner',
								fontSize: 12,
								formatter: '{b}: {c}\n({d}%)',
							},
							labelLine: {
								show: false
							},
							data: []
						},
					
						{
							name: 'SKU数量',
							type: 'pie',
							radius: ['45%', '65%'],
							avoidLabelOverlap: false,
							itemStyle: {
								borderRadius: 10,
								borderColor: '#fff',
								borderWidth: 2
							},
							emphasis: {},
							data: [],
							labelLine: {
								length: 20
							},
							label: {
								formatter: '{a|{a}}{abg|}\n{hr|}\n{b|{b}:}{c|{c}}\n{hr|}\n{per|{d}%}  ',
								backgroundColor: '#F6F8FC',
								borderColor: '#8C8D8E',
								borderWidth: 1,
								borderRadius: 4,
								width:75,
								rich: {
									a: {
										color: '#6E7079',
										lineHeight: 22,
										align: 'center'
									},
									hr: {
										borderColor: '#8C8D8E',
										width: '100%',
										borderWidth: 1,
										height: 0
									},
									b: {
										color: '#4C5058',
										fontSize: 14,
										fontWeight: 'bold',
										lineHeight: 33,
										align: 'center'
									},
									c:{
										fontSize: 14,
										lineHeight: 33,
										align: 'center',
										fontWeight: 'bold',
									},
									per: {
										color: '#333',
										lineHeight: 22,
										fontSize:13,
										borderRadius: 4,
										align: 'center',
										fontWeight: 'bold',
									}
					
								}
					
							},
						}
					]
				}
			}
		},
		created() {
			this.loadingDom = loading(document.getElementsByClassName('app-main')[0]);
			var date = new Date();
			const year = date .getFullYear();
			const nextYear = date .getFullYear() + 1;
			this.quarterOptions = [{
				label:`${year}春夏`,
				value:`${year}01`
			},{
				label:`${year}秋冬`,
				value:`${year}02`
			},{
				label:`${nextYear}春夏`,
				value:`${nextYear}01`
			},{
				label:`${nextYear}秋冬`,
				value:`${nextYear}02`
			}];
			try{
				//获取工厂
				this.getERP('');
				//获取跟单员
				this.getUser();
				//获取品类
				this.getCategory();
				//获取看板数据
				this.getHomeData(false);
			}catch(e){
				console.log(e)
				this.loadingDom.close();
			}
		},
		mounted() {
			// window.onresize=() => {
			//     if (this.myChart1)  this.myChart1.resize();
			//     if (this.myChart2)  this.myChart2.resize();
			// }
		},
		methods: {
			//图表
			init() {
				var that = this;
				let echarts = require('echarts')
				if(!that.myChart1){
					that.myChart1 = echarts.init(document.getElementById("echarts1"));
					that.myChart1.on('click',{componentType: 'series', seriesType: 'bar'}, function (params) {
						console.log(params);
						//跟单员
						let merchandiserList = [];
						that.skuName.forEach(item=>{
							if(that.skuSelect[item.name]){
								merchandiserList.push(item.code)
							}
						});
						//灯状态
						let schedule = '';
						switch (params.seriesName){
							case '正常':
								schedule = 1;
								break;
							case '预警':
								schedule = 2;
								break;
							case '滞后':
								schedule = 3;
								break;
						}
						//状态
						let dom = that.stateOptions.find(o=>{return o.label == params.name})
						//个数or数量
						let radioValueLeft = that.radioValueLeft;
						console.log(radioValueLeft)
						if(params.name=='开始'){
							
							console.log(merchandiserList);
							
							that.$router.push({
								name: 'goods_list',
								params: {
									'type':12,
									'startTime':that.date&&that.date.length>0?that.date[0]:'',
									'endTime':that.date&&that.date.length>0?that.date[1]:'',
									'categoryId':that.categoryValue,
									'factoryCode':that.factoryValue,
									'merchandiserList':merchandiserList,
									'quarter':that.quarterValue,
									'schedule':schedule,//灯状态
									'status':dom?dom.value:0,
								}
							})
						}else{
							that.$router.push({
								name: 'orderGoods_list',
								params: {
									'type':12,
									'startTime':that.date&&that.date.length>0?that.date[0]:'',
									'endTime':that.date&&that.date.length>0?that.date[1]:'',
									'categoryId':that.categoryValue,
									'factoryCode':that.factoryValue,
									'merchandiserList':merchandiserList,
									'quarter':that.quarterValue,
									'schedule':schedule,//灯状态
									'status':dom?dom.value:0,
								}
							})
						}
					});
				}
				if(!that.myChart2){
					that.myChart2 = echarts.init(document.getElementById("echarts2"));
					that.myChart2.on('click',{componentType: 'series', seriesType: 'pie'}, function (params) {
						console.log(params);
						if(params.seriesName=='人员'){
							that.clickTitleBol = false;//重置
							if(!that.clickBol){
								console.log(that.skuSelect);
								console.log(params);
								let dom = that.skuName.find(o=>{return o.name == params.name})
								let obj = {
									'startTime':that.date&&that.date.length>0?that.date[0]:'',
									'endTime':that.date&&that.date.length>0?that.date[1]:'',
									'categoryId':that.categoryValue,
									'factoryCode':that.factoryValue,
									'merchandiserList':[`${dom.code}`],
									'quarter':that.quarterValue,
									'status':that.stateValue?that.stateValue:0
								}
								//重置
								Object.keys(that.skuSelect).forEach(item=>{
									that.skuSelect[item] = false;
								})
								that.merchandiserList = [`${dom.code}`];
								that.getHomeData(true,obj);
							}
							that.clickBol = !that.clickBol;
						}else{
							//跟单员
							let merchandiserList = [];
							that.skuName.forEach(item=>{
								if(that.skuSelect[item.name]){
									merchandiserList.push(item.code)
								}
							});
							//灯状态
							let schedule = '';
							switch (params.name){
								case '正常':
									schedule = 1;
									break;
								case '预警':
									schedule = 2;
									break;
								case '滞后':
									schedule = 3;
									break;
							}
							//个数or数量
							let radioValueLeft = that.radioValueLeft;
							
							that.$router.push({
								name: 'orderGoods_list',
								params: {
									'type':13,
									'startTime':that.date&&that.date.length>0?that.date[0]:'',
									'endTime':that.date&&that.date.length>0?that.date[1]:'',
									'categoryId':that.categoryValue,
									'factoryCode':that.factoryValue,
									'merchandiserList':merchandiserList,
									'quarter':that.quarterValue,
									'schedule':schedule,//灯状态
									'status':that.stateValue?that.stateValue:0,
								}
							})
						}
					});
					
					
					that.myChart2.on('legendselectchanged', function (params) {
						console.log(params)
						if(params.name!=='正常'&&params.name!=='预警'&&params.name!=='滞后'){
							that.clickBol = false;//重置
							
							
							let merchandiserList = [];
							that.skuSelect[params.name] = !that.skuSelect[params.name];
							that.skuName.forEach(item=>{
								if(that.skuSelect[item.name]){
									merchandiserList.push(item.code)
								}
							})
							let obj = {
								'startTime':that.date&&that.date.length>0?that.date[0]:'',
								'endTime':that.date&&that.date.length>0?that.date[1]:'',
								'categoryId':that.categoryValue,
								'factoryCode':that.factoryValue,
								'merchandiserList':merchandiserList,
								'quarter':that.quarterValue,
								'status':that.stateValue?that.stateValue:0
							}
							that.merchandiserList = merchandiserList;
							that.getHomeData(true,obj);
							
							
							that.clickName = params.name;
							that.clickTitleBol = !that.clickTitleBol;
							//console.log(merchandiserList);
						}
						
					});
				}
				that.option1.series[0].data = that.diagramItem['green']
				that.option1.series[1].data = that.diagramItem['yellow']
				that.option1.series[2].data = that.diagramItem['red']
				that.myChart1.setOption(that.option1, true);
				that.myChart2.setOption(that.option2, true);
				that.loadingDom.close();
			},
			remoteMethod(value){
				this.loading = true;
				this.getERP(value);
			},
			//获取工厂
			async getERP(val){
				let params={
					supplierName:val
				};
				let res = await json.get(this.api.getERP,params);
				let list = await json.getERP(res.data);
				this.factoryOptions = list;
				//this.$store.commit('transfer/SET_FACTORYLIST',list)
				this.loading = false;
			},
			//获取跟单员
			async getUser(){
				let res = await json.get(this.api.findMerchandiser);
				//sku跟单员数据处理
				let skuObj = await json.skuNameHandler(res.data);
				console.log(skuObj)
				this.skuName = skuObj.newData;//姓名
				this.option2.legend[0].selected = skuObj.select;//选择
				this.skuSelect = skuObj.select;;
				this.option2.legend[0].data = skuObj.nameList;//名字legend
				this.skuNameList = skuObj.nameList;
				this.skuCodeList = skuObj.codeList;
				this.option2.series[0].data = skuObj.nameData;//名字series
				console.log(this.option2);
			},
			//获取品类
			async getCategory(){
				if(this.categoryList.length==0){
					let res = await json.get(this.api.categoryByParent);
					let cate = await json.categoryHandler(res.data);
					console.log(cate);
					this.$store.commit('transfer/SET_CATEGORYLIST',cate)
					this.categoryOptions = cate;
				}else{
					this.categoryOptions = this.categoryList;
				}
			},
			//获取看板数据
			async getHomeData(bol,value){
				try{
					let obj = value;
					if(bol) this.loadingDom = loading(document.getElementsByClassName('app-main')[0]);
					// console.log('--------------')
					// console.log(this.merchandiserList);
					console.log(obj)
					console.log('123')
					if(!obj){
						obj = {
							'startTime':this.date&&this.date.length>0?this.date[0]:'',
							'endTime':this.date&&this.date.length>0?this.date[1]:'',
							'categoryId':this.categoryValue,
							'factoryCode':this.factoryValue,
							'merchandiserList':this.merchandiserList,
							'quarter':this.quarterValue,
							'status':this.stateValue?this.stateValue:0
						};
					}
					
					let res = await json.post(this.api.homepage,obj);
					//this.map = res.data.map;
					let map = {
						'总数': res.data.map['总数'],
						'已完成': res.data.map['已完成'],
						'未完成': res.data.map['未完成'],
						'已逾期': res.data.map['已逾期'],
						'待处理': res.data.map['待处理'],
						'已批版': res.data.map['已批版'],
						'已到料': res.data.map['已到料'],
						'已开裁': res.data.map['已开裁'],
						'已上线': res.data.map['已上线'],
						'已下线': res.data.map['已下线'],
						'出货检中': res.data.map['出货检中']
					}
					this.map = map;
					
					console.log(res);
					let item = await json.itemHandler(res.data.diagramItem,this.stateOptions);
					console.log(item)
					this.diagramItem = item;//个数
					let count = await json.countHandler(res.data.diagramCount);
					this.diagramCount = count;//数量
					obj['merchandiserList'].forEach(item=>{
						let dom = this.skuName.find(o=>{return o.code == item})
						this.skuSelect[dom.name] = true;
					})
					this.option2.legend[0].selected = this.skuSelect;
					let sku = await json.skuHandler(res.data.diagramSku);
					console.log(sku)
					this.option2.series[1].data = sku.item;//sku个数
					this.option2.series[2].data = sku.count;//sku数量
					setTimeout(()=>{
						this.init()
					},500)
				}catch(e){
					console.log(e)
					this.loadingDom.close();
				}
			},
			changeItem(item,index){
				console.log(index);
				//跟单员
				let merchandiserList = [];
				this.skuName.forEach(item=>{
					if(this.skuSelect[item.name]){
						merchandiserList.push(item.code)
					}
				});
				
				if(item=='总数'){
					this.$router.push({
						name: 'goods_list',
						params: {
							'type':index,
							'startTime':this.date&&this.date.length>0?this.date[0]:'',
							'endTime':this.date&&this.date.length>0?this.date[1]:'',
							'categoryId':this.categoryValue,
							'factoryCode':this.factoryValue,
							'merchandiserList':merchandiserList,
							'quarter':this.quarterValue,
							'status':this.stateValue?this.stateValue:0,
						}
					})
				}else{
					this.$router.push({
						name: 'orderGoods_list',
						params: {
							'type':index,
							'startTime':this.date&&this.date.length>0?this.date[0]:'',
							'endTime':this.date&&this.date.length>0?this.date[1]:'',
							'categoryId':this.categoryValue,
							'factoryCode':this.factoryValue,
							'merchandiserList':merchandiserList,
							'quarter':this.quarterValue,
							'status':this.stateValue?this.stateValue:0,
						}
					})
				}
			},
			radioLeft(val){
				
				if(val==1){
					this.updateImte(false)
				}else{
					this.updateImte(true)
				}
			},
			radioRight(val){
				
				if(val==1){
					this.updateUser(false);
				}else{
					this.updateUser(true);
				}
			},
			//切换
			updateImte(bol){
				console.log(bol)
				this.option1.series[0].data = bol?this.diagramCount['green']:this.diagramItem['green'];
				this.option1.series[1].data = bol?this.diagramCount['yellow']:this.diagramItem['yellow'];
				this.option1.series[2].data = bol?this.diagramCount['red']:this.diagramItem['red'];
				this.myChart1.setOption(this.option1, true);
			},
			updateUser(bol){
				if(!bol){
					Object.keys(this.skuSelect).forEach(item=>{
						this.skuSelect[item] = false;
					})
				}
				let obj = {
					'startTime':this.date&&this.date.length>0?this.date[0]:'',
					'endTime':this.date&&this.date.length>0?this.date[1]:'',
					'categoryId':this.categoryValue,
					'factoryCode':this.factoryValue,
					'merchandiserList':bol?this.skuCodeList:[],
					'quarter':this.quarterValue,
					'status':this.stateValue?this.stateValue:0
				}
				this.merchandiserList = bol?this.skuCodeList:[];
				this.getHomeData(true,obj);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.homePage {
		padding: 20px;
		text-align: center;
		height: 100%;
		.homePage_header {
			margin: 30px auto;
			width: 100%;
			border: 1px solid rgba($color: #999999, $alpha: 0.3);
			display: flex;
			justify-content: space-around;
			padding: 50px 0;

			.item_label {
				color: #999999;
				font-size: 15px;
				font-weight: bold;
			}

			.item_value {
				padding: 5px 0 1px 0;
				font-size: 25px;
				font-weight: bold;
				cursor:pointer;
			}
		}

		.homePage_body {
			display: flex;
			justify-content: space-between;
			margin: 10px auto;
			width: 100%;

			div span {
				margin-right: 10px;
			}
		}
		
		.echartTitle{
			text-align: center;
			color: #333;
			font-weight: bold;
			font-size: 24px;
		}
		
		.homePage_echarts {
			position: relative;
			display: flex;
			justify-content: space-between;
			flex-wrap:wrap;
			align-items:center;
			margin: 30px auto;
			width: 100%;
			height: 500px;
			.radioValueLeft{
				position: absolute;
				top: 0px;
				left: 0px;
				z-index: 99;
			}
			.radioValueRight{
				position: absolute;
				top: 0px;
				right: 0px;
				z-index: 99;
			}
		}
	}
</style>

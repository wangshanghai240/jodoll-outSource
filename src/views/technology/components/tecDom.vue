<!--
 * @FileDescription: 规格列表 组件一
 * @Author: wangpenghui
 -->
<template>
	<div style="overflow: auto;margin: 0 30px;">
		<div class="formBody">
			<!-- <div>
				<h4>规格名称:</h4>
				<el-input v-model="name" :size="size" placeholder="请输入名称"></el-input>
			</div>
			<div>
				<h4>品类选择:</h4>
				
			</div> -->
			<jod-formSearch labelPosition="top" ref="tecForm" :searchData="formData" :searchForm="formConfig"></jod-formSearch>
		</div>
		<!-- 尺码 部位 选择 -->
		<div class="transferBody">
			<div class="body">
				<h4>尺码选择:</h4>
				<el-transfer v-model="sizeOption" :titles="['未选', '已选']" :data="sizeList"></el-transfer>
			</div>
			<div class="body">
				<h4>部位选择:</h4>
				<el-transfer v-model="positionOption" :titles="['未选', '已选']" :data="positionList"></el-transfer>
			</div>
		</div>
		<!-- 尺码 部位 主表 -->
		<div class="sizeBody">
			<div class="body">
				<div class="body1">
					<div style="margin-right: 20px;">尺码:</div>
					<el-select v-model="sizeValue" placeholder="请选择尺码" :size="size" style="width: 140px;" @change="specificationsShow = false">
						<el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.key">
						</el-option>
					</el-select>
				</div>
				<div style="width: 452px;margin-left: 40px;text-align: right;">
					<el-button type="primary" :size="size" @click="generate(false)">生成规格表</el-button>
				</div>
			</div>
			<!-- 主表 -->
			<jod-tableList class="tableBody" :dataSource="dataSource" :columns="columns" :options="{tHeight:'136px'}">

				<template :slot="columns[index].prop" v-for="(item,index) in columns" slot-scope="{row,$index}">
					<div v-if="index!==0">
						<el-input size="mini" type="Number" class="textCenter"
							v-model.number="row[item.prop]" @input="salaryChange">
						</el-input>
					</div>
					<div v-else style="line-height: 28px;height: 28px;">{{row[item.prop]}}</div>
				</template>
			</jod-tableList>
		</div>
		<!-- 规格表 -->
		<transition name="fade" mode="out-in">
			<div class="specifications" v-if="specificationsShow">
				<!-- 主表 -->
				<jod-tableList class="tableBody" :dataSource="specificationsDataSource" :columns="specificationsColumns"
					:options="{offHeight:true}">
					<!-- 自定义表头 -->
					<template v-slot:header_prop="scope">
						<div>{{scope.row.label}}</div>
					</template>
					<!-- 表内容 -->
					<template :slot="specificationsColumns[index].prop" v-for="(item,index) in specificationsColumns"
						slot-scope="{row,$index}">
						<div v-if="index!==0">
							<transition name="fade" mode="out-in">
								<el-input size="mini" type="Number" class="textCenter"
									v-if="row[item.prop]!=='-'" v-model.number="row[item.prop]" key="input"
									@input="salaryChange($event,item.prop,row)">
								</el-input>
								<span v-else key="sapn">-</span>
							</transition>
							
						</div>
						<div v-else style="line-height: 28px;height: 28px;">{{row[item.prop]}}</div>
					</template>
				</jod-tableList>
			</div>
		</transition>
		
		<transition name="fade" mode="out-in">
			<div style="text-align: center;" v-if="specificationsShow">
				<el-button type="primary" :size="size" @click="confirm" :loading="btnLoading">确认</el-button>
			</div>
		</transition>
		
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		loading
	} from '@/utils'
	import json from '@/api/technology/tecList.js'
	export default {
		name:'tecDom',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props:{
			value:{//品类
				type:Array
			},
			isUpdate:{
				type:Boolean,
				default:false
			},
			tecValue:{//详情数据
				type:Object,
				default:{}
			}
		},
		watch: {
			sizeOption(v) { //尺码
				let list = [...this.sizeList];
				let newArr1 = list.filter(item => v.some(items => items === item.key));
				this.options = newArr1;
				this.specificationsShow = false;
			},
			positionOption(v) { //部位
				let list = [...this.positionList];
				let newArr1 = list.filter(item => v.some(items => items === item.key));
				this.options2 = newArr1;
				this.getCloumns(newArr1);
				this.specificationsShow = false;
			}
		},
		data() {
			return {
				id:this.tecId,//规格ID
				categoryByBig:this.value,//品类
				formData:{
					name:'',
					id:''
				},
				formConfig:[
					{
						type: "Input",
						label: "规格名称:",
						prop: "name",
						style: 'min-width:452px',
						onClick: res => {},
						placeholder: "请输入规格名称:",
						rules: [{
							required: true,
							message: "请输入活动名称",
							trigger: "blur"
						}]
					},{
						type: "Select",
						label: "品类:",
						prop: "id",
						options: this.value,
						clearable:true,
						placeholder: "请选择品类",
						style: 'min-width:450px;',
						change: row => "",
						rules: [{
							required: true, 
							message: '请选择品类', 
							trigger: 'blur' ,
						}],
					}
				],
				
				sizeList: [],//尺码数据
				sizeOption: [],

				positionList: [],//部位数据
				positionOption: [],

				sizeValue: '', //尺码
				options: [], //尺码数据
				sizeIndex:null,//尺码下标
				options2:[],//部位数据暂存
				loading: null, //表格遮罩层
				dataSource: [{
					staticCloumn: '标准值'
				}, {
					staticCloumn: '档差'
				}], //表格数据
				columns: [{ //表格列
					'label': '',
					'prop': 'staticCloumn',
					'align': 'center',
					'slot': true,
				}],
				specificationsShow:false,//规格表 显示/隐藏
				repeat:false,//重复点击
				specificationsDataSource: [], //规格表数据
				specificationsColumns: [{ //规格表列
					'label': '规格表',
					'prop': 'staticCloumn',
					'align': 'center',
					'slot': true,
				}],
				
				btnLoading:false,//按钮
			};
		},
		created() {
			console.log(this.tecValue)
			this.getData();
		},
		methods: {
			//获取尺码or部位基础数据
			async getData() {
				try {
					//尺码
					let obj1 = {
						search:{
							name:null,
							status:null
						},
						current:1,
						size:999
					}
					//部位
					let obj2 = {
						search:{
							name:null
						},
						current:1,
						size:999
					}
					let newList1 = await json.get(this.api.standardPage,obj1);//尺码
					if(newList1.code==0){
						let size = await json.sizeHandler(newList1.data.records);
						this.sizeList = size;
					}
					
					let newList2 = await json.get(this.api.partPage,obj2);//部位
					if(newList2.code==0){
						let position = await json.positionHandler(newList2.data.records);
						this.positionList = position;
					}
					
					//修改 - 赋值
					if(this.isUpdate){
						let {name,categoryId,partList,standardList,standardId,standardTable} = this.tecValue;
						let obj = {'name':name,'id':categoryId};
						//尺码
						let standard = standardList.reduce((total,current)=>{
							let {id} = current;
							total.push({'id':String(id)})
							return total
						},[])
						let newStandard = standard.map ( item => item.id )
						//部位
						let part = partList.reduce((total,current)=>{
							let {id} = current;
							total.push({'id':String(id)})
							return total
						},[])
						let newPart = part.map ( item => item.id );
						//规格表数据
						let newArr = standardTable.reduce((total,current)=>{
							let {name,difference,deviationMinus,deviationPositive,measuring,values,id} = current;
							let obj1 = {}
							values.forEach(item=>{
								obj1[item.standardId] = item.value
							})
							
							let obj2 = {
								id,
								'staticCloumn':name,
								'difference':difference.toString(),
								deviationMinus,
								deviationPositive,
								measuring
							}
							let newObj = {...obj1,...obj2};
							total.push(newObj);
							return total
						},[])
						let assignment = await this.assignment(obj,newStandard,newPart,standardId,newArr)
						this.generate(true);
						this.specificationsDataSource = newArr;
						console.log(newArr)
					}
				} catch (e) {
					this.$emit('close',{'status':false,'isClose':false})
					this.$message.error(e)
				}
			},
			assignment(obj,newStandard,newPart,standardId,newArr){
				return new Promise((res,rej)=>{
					this.formData = obj;
					this.sizeOption = newStandard;
					this.positionOption = newPart;
					this.sizeValue = String(standardId);
					
					res(true)
				})
			},
			//表格处理
			async getCloumns(list) {
				try {
					let arr = await json.cloumnsList(list);
					//设置初始columns
					let staticCloumnColumns = [{
						'label': '',
						'prop': 'staticCloumn',
						'align': 'center',
						'slot': true,
					}]
					staticCloumnColumns = staticCloumnColumns.concat(arr);
					this.columns = staticCloumnColumns;
					let dataList = await json.dataSourceList(staticCloumnColumns,this.dataSource);
					this.dataSource = dataList;
				} catch (e) {
					this.$message.error(e)
				}
			},
			//生成规格表
			async generate(value) {
				try {
					this.specificationsShow = false;//显示
					if(!this.sizeValue){
						this.$message.warning('请选择尺码');
						return
					}
					//控制重复点击
					if(this.repeat){
						this.$message.warning('尺码表生成中。。。')
						return 
					}
					this.repeat = true;
					//获取 自定义 表头配置数据
					let header = await json.headerData(this.options);
					this.specificationsColumns = header;
					//console.log('配置列数据：',this.columns)
					//console.log('尺码表数据：',this.dataSource)
					//获取 左列 配置数据
					//console.log('规格表表头',header)
					let index = -1;//获取 所选尺码 的下标
					header.forEach((item,i)=>{
						if(item.prop == this.sizeValue){
							index = i;
						}
					})
					this.sizeIndex = index;
					if(!value){
						let cloumns = await json.specificationsCloumns(this.columns,header,this.dataSource,this.options2,index);
						console.log(cloumns)
						this.specificationsDataSource = cloumns;
					}
					this.specificationsShow = true;//显示
					this.repeat = false;
				} catch (e) {
					this.repeat = false;
					this.$message.warning(e)
				}

			},
			//规格表 尺码值 档差 发生变化时触发
			salaryChange(value,prop,row){
				
				if(prop&&prop=='difference'){
					let dataNum = row[this.specificationsColumns[this.sizeIndex].prop];//基础值
					let {difference} = row;//档差
					this.specificationsColumns.forEach((item,index)=>{
						if(index!==0&&index<this.specificationsColumns.length-4&&index!==this.sizeIndex){
							let sIndex = index - this.sizeIndex;
							let num = sIndex * difference;
							//this.$set(row)
							row[item.prop] = dataNum + num
						}
					})
				}else if(prop&&prop!=='deviationMinus'&&prop!=='deviationPositive'&&prop!=='measuring'&&prop!=='staticCloumn'){
					let arr = [];//存储 尺码值
					let isQqual = true;//是否 档差相同
					this.specificationsColumns.forEach((item,index)=>{
						if(index!==0&&index<this.specificationsColumns.length-4){
							arr.push(row[item.prop]);
						}
					})
					console.log(arr)
					let arr2 = [];//存储 手动修改档差值
					for(let i = 0; i<arr.length-1 ; i++ ){
						let num = (arr[i+1] - arr[i]).toFixed(2);
						arr2.push(num);
					}
					let s1 = new Set(arr2);//剔重
					let arr3 = [];
					for(let item of s1){
					 arr3.push(item);
					}
					console.log(arr3)
					if(arr3.length==1){
						row.difference = arr3[0]
					}else{
						row.difference = '-'
					}
				}
				// let str = value.replace(/^\.+|[^\d.]/g,'')
				// value = str
			},
			async confirm(){
				this.$refs['tecForm'].$refs['searchForm'].validate((valid)=>{
					if(!valid){
						return false
					}
				})
				if(this.formData.name&&this.formData.id){
					this.btnLoading = true;
					//console.log(this.specificationsDataSource)
					let standardList = [];//尺码
					let partList = [];//部位
					this.sizeOption.forEach(item=>{//尺码
						standardList.push({id:Number(item)})
					});
					this.positionOption.forEach(item=>{//部位
						partList.push({id:Number(item)})
					})
					//console.log(this.sizeOption,this.positionOption,this.options2)
					let id = this.tecValue&&this.tecValue.id?this.tecValue.id:null;
					let newArr = await json.objHandler(this.formData,id,this.sizeValue,standardList,partList,this.specificationsDataSource,this.options2);
					console.log(newArr)
					let res = await json.post(this.api.saveStandardTable,newArr)
					if(res.code==0){
						this.$message.success('新建成功');
						this.btnLoading = false;
						this.$emit('close',{'status':true,'isClose':false})
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/.formBody .search_input{
		.el-form .el-form-item{
			width: 50%;
			margin: 0;
		}
		.el-form .el-form-item+.el-form-item{
			width: 45%;
			margin-left: 25px;
		}
	}
	.transferBody {
		min-width: 914px;
		display: flex;
		justify-content: space-between;

		/deep/.el-transfer__buttons {
			padding: 0;

			.el-button {
				display: flex;
				margin: 0 10px;
				padding: 8px;
			}

			.el-button+.el-button {
				margin-top: 10px;
			}
		}
	}

	.sizeBody>.body {
		display: flex;
		justify-content: space-between;

		.body1 {
			width: 452px;
			display: flex;
			align-items: center;
		}
	}

	.sizeBody {
		margin-top: 30px;

		.tableBody {
			margin-top: 30px;
		}

		/deep/.el-table .cell {
			height: 28px !important;
		}
	}
</style>

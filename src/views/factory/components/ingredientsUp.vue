<!--
 * @FileDescription: 辅料发货
 * @Author: zhuangzhangyan
 * @Date: 2021/3/11
 * @LastEditors: 王
 * @LastEditTime: 2021/6/19
 -->
<template>
	<div>
		<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="ingredientsUp"
			:dataTotal="dataTotal" @handleSelectionChange="handleSelectionChange">
			<!-- 自定义表头 -->
			<template v-slot:header_input>
				<span>通知发货量</span>
			</template>
			
			<template slot="total" slot-scope="{row,$index}">
				<span>{{row.total == null?0:row.total}}</span>
			</template>
			
			<template slot="issuedQuantity" slot-scope="{row,$index}">
				<span>{{row.issuedQuantity == null?0:row.issuedQuantity}}</span>
			</template>
			
			<template slot="unsentQuantity" slot-scope="{row,$index}">
				<span>{{row.unsentQuantity == null?0:row.unsentQuantity}}</span>
			</template>
			
			<template slot="inventoryQuantity" slot-scope="{row,$index}">
				<span>{{row.inventoryQuantity == null || row.inventoryQuantity < 0?0:row.inventoryQuantity}}</span>
			</template>
			
			<!-- 自定义列-->
			<template slot="operate" slot-scope="{row,updateBy}">
				<el-input type="number" v-model="row.updateBy" @blur="BlurText(row,row.updateBy)"></el-input>
			</template>

		</jod-tableList>
		<div align="center">
			<el-button type="primary" size="30px" @click="send">发送</el-button>
			<el-button type="warning" size="30px" @click="calcle">取消</el-button>
		</div>
	</div>
	
</template>

<script>
	import ingredientsUp from '@/api/factory/ingredientsUp.js'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		name:'ingredientsUp',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props:{
			value:{
				type:String
			},
			selectValue:{
				type:Array
			}
		},
		watch:{
			value(v){
				console.log(v)
				this.ids = v;
			}
		},
		data(){
			return{
				gridData:[],//源数据
				columns: [...ingredientsUp.columns],
				options: { ...ingredientsUp.options},
				// pagination:{
				// 	currentPage:1,
				// 	pageSize:20
				// },
				dataTotal:0,
				multipleSelection:[],//勾选
				allSelection:[],
				ids:this.value,//发货id
			}
		},
		created() {

		},
		mounted() {
			this.gridData = this.selectValue;
		},
		methods:{
			handleSelectionChange(list){
				console.log(1)
				let array =[]
				let row = []
				console.log(list)
				for(var i =0;i<list.length;i++){
					if(list[i].updateBy == '' || list[i].updateBy == 0){
						// array = array.concat(list[i])
						if(parseFloat(list[i].unsentQuantity) > parseFloat(list[i].inventoryQuantity)){
							list[i].updateBy = Math.ceil(list[i].inventoryQuantity)
						}else{
							list[i].updateBy = Math.ceil(list[i].unsentQuantity)
						}
						row.push(list[i])
					}else{
						row.push(list[i])
					}
				}
				// this.$refs.ingredientsUp.toggleSelection(array)
				this.multipleSelection = row;
			},
			BlurText(row,index){
				var list = []
				if(!index | index == '0'){
					row.updateBy = 0
					console.log(0)
					var flag = false
					for(var i=0;i<this.multipleSelection.length;i++){
						if(this.multipleSelection[i].code == row.code){
							flag = true
							break
						}
					}
					if(flag == true){
						list.push(row)
						this.$refs.ingredientsUp.toggleSelection(list)
					}
					return
				}
				if( index > parseFloat(row.inventoryQuantity)){
					row.updateBy = parseFloat(row.inventoryQuantity)
					// this.$message.warning('发货量不能大于未发数和库存数')
					var flag = false
					for(var i=0;i<this.multipleSelection.length;i++){
						if(this.multipleSelection[i].code == row.code){
							flag = true
							break
						}
					}
					if(flag == false){
						list.push(row)
						this.$refs.ingredientsUp.toggleSelection(list)
					}
					return
				}
				if(index > 0){
					var flag = false
					for(var i=0;i<this.multipleSelection.length;i++){
						if(this.multipleSelection[i].code == row.code){
							flag = true
							break
						}
					}
					if(flag == false){
						list.push(row)
						this.$refs.ingredientsUp.toggleSelection(list)
					}
				}
			},
			send(){
				var materialRequisitionPramList = []
				var materialRequisition=[]
				this.allSelection=this.allSelection.concat(this.multipleSelection)
				console.log(this.allSelection)
				if(this.allSelection.length == 0){
					this.$message.warning('未选择订单')
					return
				}else{
					let results = []
					var resultArr = []//去重后的数组
					var flag
					for (var i=0;i<this.allSelection.length;i++){
						results.push(this.allSelection[i].factoryCode)
					}
					for (var i in results){
					    flag = true;
					    for (var j in resultArr) {
					        if (resultArr[j] == results[i]) {
					            flag = false;
					            break;
					        }
					    }
					    if (flag) {
					        resultArr.push(results[i])
					    }
					}
					console.log(resultArr)
					for (var i=0; i<resultArr.length;i++){
						for (var j=0; j<this.allSelection.length;j++){
							if(this.allSelection[j].factoryCode == resultArr[i]){
								console.log(this.allSelection[j].factoryCode == resultArr[i])
								materialRequisition.push({ingredientsCode:this.allSelection[j].code,sl:Number(this.allSelection[j].updateBy),spdm:'',
								id:this.allSelection[j].id})
							}
						}
						materialRequisitionPramList.push({factoryCode:resultArr[i],orderNumbers:this.ids,ingredientsRequisitionList:materialRequisition})
						materialRequisition=[]
					}
					ingredientsUp.put(this.api.sendIngredientsList,materialRequisitionPramList).then(res=>{
						this.allSelection=[]
						materialRequisitionPramList = []
						this.$message.success('发送成功')
						this.$emit('ingClose')
					}).catch(e=>{
						this.allSelection=[]
					})
				}
			},
			calcle(){
				this.$emit('ingClose')
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>

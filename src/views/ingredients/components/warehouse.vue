<!--
 * @FileDescription: 工厂订单入库通知
 * @Author: wangpenghui
 -->
<template>
	<div>
		<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="notices"
			:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage"
			@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
			<template v-slot:header_input>
				<span>入库通知数</span>
			</template>
			
			<template slot="total" slot-scope="{row,$index}">
				<span>{{row.total == null?0:row.total}}</span>
			</template>
			
			<template slot="issuedQuantity" slot-scope="{row,$index}">
				<span>{{row.issuedQuantity == null?0:row.issuedQuantity}}</span>
			</template>
			
			<template slot="usendQuantity" slot-scope="{row,$index}">
				<span>{{row.usendQuantity == null?0:row.usendQuantity}}</span>
			</template>
			
			<!-- 自定义列-->
			<template slot="operate" slot-scope="{row,quantity}">
				<el-input type="number" v-model="row.quantity" @blur="BlurText(row,row.quantity)"></el-input>
			</template>
		</jod-tableList>
		<div align="center">
			<el-button type="primary" size="30px" @click="sendOut">提交</el-button>
			<el-button type="warning" size="30px" @click="cancel">关闭</el-button>
		</div>
	</div>
</template>

<script>
	import notice from '@/api/ingredients/notice.js'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		name:'notice',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props:{
			value:{
				type:String
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
				columns: [...notice.columns],
				options: { ...notice.options},
				pagination:{
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				multipleSelection:[],//勾选
				allSelection:[],
				noticeOrderNumber:this.value,
			}
		},
		created() {
		},
		mounted() {
			this.getList();
		},
		methods:{
			handleChangePage(current){
				console.log(current)
				this.allSelection=this.multipleSelection
				this.pagination.currentPage=current;
				this.getList();
			},
			handleSizeChange(page){
				console.log(page)
				this.pagination.pageSize=page;
				this.getList();
			},
			handleSelectionChange(list){
				let array =[]
				let row = []
				for(var i =0;i<list.length;i++){
					if(list[i].updateBy == ''){
						array = array.concat(list[i])
					}else{
						row = row.concat(list[i])
					}
				}
				console.log(row)
				this.$refs.notice.toggleSelection(array)
				this.multipleSelection = row;
				console.log(this.multipleSelection)
			},
			FabricList(data){
				console.log(data)
				return notice.get(this.api.ingredientsSupplierOrderList,data)
			},
			getList() {
				this.FabricList({orderNumber:this.noticeOrderNumber}).then(res=>{
					var array = res.data
					if(array.length != 0){
						let index=0;
						let newArray=[];
						var page = this.pagination.pageSize
						var current = this.pagination.currentPage -1
						while(index < array.length){
							newArray.push(array.slice(index,index += page))
						}
						console.log('new',newArray)
						for(var i=0;i<newArray.length;i++){
							newArray[i] = JSON.parse(JSON.stringify(newArray[i]))
							for (var j=0;j<newArray[i].length;j++){
								newArray[i][j].updateBy=0
							}
						}
						this.gridData = newArray[current];
						console.log("gridData",this.gridData)
						this.dataTotal = array.length;
					}
				})
			},
			BlurText(row,index){
				console.log(row.inventoryQuantity,row.unsentQuantity,index)
				let boolean = new RegExp("^[1-9][0-9]*$").test(index)
				if(!index | index == '0'){
					row.updateBy = 0
					return
				}
				if(!boolean){
					row.updateBy = 0
					this.$message.warning('请输入正整数')
					return
				}
				/* if(index>row.usendQuantity){
					row.updateBy = 0
					this.$message.warning('入库数不能大于未发数')
					row.quantity = 0;
					return
				} */
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
								materialRequisition.push({materialCode:this.allSelection[j].code,sl:Number(this.allSelection[j].updateBy),spdm:'',
								id:this.allSelection[j].id})
							}
						}
						materialRequisitionPramList.push({factoryCode:resultArr[i],goodsId:'',materialRequisitionList:materialRequisition})
						materialRequisition=[]
					}
					notice.put(this.api.sendFabricList,materialRequisitionPramList).then(res=>{
						this.allSelection=[]
						materialRequisitionPramList = []
						this.$message.success('发送成功')
						this.$emit('fabClose')
					})
				}
			},
			//输入框
			salaryChange(value,row){
				let newValue = parseFloat(value).toFixed(0)
				if(newValue<=row.usendQutity){
					this.$set(row,'quantity',newValue)
				}else{
					this.$set(row,'quantity',row.usendQutity)
				}
			},
			//发送
			async sendOut(){
				let res = await notice.post(this.api.ingredientsSupplierOrderList,this.gridData)
				console.log(res)
				if(res.code==0){
					this.cancel();
					this.$message.success('发送成功')
				}
			},
			//取消
			cancel(){
				this.$emit('close',false)
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>

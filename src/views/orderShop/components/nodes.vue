<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options">
		<template slot="timeExpected" slot-scope="{row,$index}">
			<!-- <el-input v-model="row.timeExpected" :class="row.styleclass" @focus="clText(row)" @blur="BlurText(row)" @input="inText(row)" :disabled="row.bled"></el-input> -->
			<el-date-picker v-model="row.timeExpected" style="width: 150px;" value-format="yyyy-MM-dd" :disabled="row.bled" @change="BlurText(row)" :clearable="false">
				
			</el-date-picker>
		</template>
		<template slot="difference" slot-scope="{row,$index}">
			{{row.difference}}
		</template>
		<template v-slot:content_context>
			<jod-dragDialog v-model="lianDialog" title="工作联系单"  :dialogStyle="{width: '400',widthType: 'px'}" :modal="false" @closeDio="lianCloseDio">
				<lianxian-up v-model="times" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
			<!-- 弹窗框 -->
			<jod-dragDialog v-model="tianDialog" title="提示" :modal="false" :dialogStyle="{width: '300',widthType: 'px'}" top="30vh">
				<h2>影响天数为:{{day}},确认是否修改</h2>
				<div>
					<el-button type="primary" :size="size" :loading="openSampleCheck1" :disabled="openSampleCheck2" 
						@click="openSampleCheck(true)">确定</el-button>
					<el-button type="danger" :size="size" :loading="openSampleCheck2" plain :disabled="openSampleCheck1" 
						@click="openSampleCheck(false)">取消</el-button>
				</div>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import nodes from '@/api/orderShop/nodes.js'
	import lianxianUp from './lianxidan.vue'
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	export default {
		name: 'nodes',
		computed: {
			...mapGetters([
				'size',
			])
		},
		components:{
			'lianxianUp':lianxianUp,
		},
		props: {
			value: {
				type: String
			}
		},
		watch: {
			value(v) {
				this.goodId = v
			}
		},
		data() {
			return {
				goodId: this.value,
				gridData: [],
				backDate:[],
				columns: nodes.columns,
				options: nodes.options,//额外配置
				lianDialog:false,
				endtime:'',
				times:[],
				day:0,
				openSampleCheck1:false,
				openSampleCheck2:false,
				tianDialog:false,
			}
		},
		created() {
			
		},
		mounted() {
			this.getList()
		},
		methods: {
			node(data){
				return nodes.get(this.api.nodes,data)
			},
			getList(){
				var data = {goodId:this.goodId}
				var database =[]
				this.node(data).then(res=>{
					console.log(res)
					database = res.data
					for(var i = 0;i<database.length;i++){
						if(database[i].timeActual == null){
							database[i]["bled"] = false
							database[i]["difference"] = ""
						}else{
							database[i]["bled"] = true
							database[i]["difference"] = this.DateDiff(database[i].timeExpected,database[i].timeActual)
						}
					}
					console.log('---',database)
					this.gridData = database
				})
			},
			BlurText(row){
				console.log(row)
				var time = row.timeExpected
				var goodid=row.goodId
				var nodeid=row.nodeId
				this.endtime = {goodId:goodid,endTime:time,nodeId:nodeid}
				console.log(this.times)
				nodes.get(this.api.call1,this.endtime).then(res=>{
					var index = parseInt(res.data)
					console.log(index)
					if (index < 3){
						nodes.get(this.api.call1,this.endtime).then(res=>{
							index = parseInt(res.data)
							this.day = index
							this.tianDialog = true
						})
					}else{
						this.day = index
						this.tianDialog = true
					}
				})
				// var flge = true
				// var time = row.timeExpected
				// if(time == ''){
				// 	this.$message.warning('不能为空')
				// 	this.getList()
				// }
				// if(flge == true){
				// 	if(time.slice(4,5) != '-'){
				// 		this.$message.warning('日期格式为xxxx-xx-xx')
				// 		this.getList()
				// 	}
				// 	if(time.slice(7,8) != '-'){
				// 		this.$message.warning('日期格式为xxxx-xx-xx')
				// 		this.getList()
				// 	}
				// 	flge = false
				// }
				// row.styleclass = 'kuang'
			},
			// inText(row){
			// 	var time = row.timeExpected
			// 	if(time.length == 10){
			// 		if(time.slice(4,5) != '-'){
			// 			this.$message.warning('日期格式为xxxx-xx-xx')
			// 			return
			// 		}
			// 		if(time.slice(7,8) != '-'){
			// 			this.$message.warning('日期格式为xxxx-xx-xx')
			// 			return
			// 		}
			// 		var goodid=row.goodId
			// 		var nodeid=row.nodeId
			// 		this.endtime = {goodId:goodid,endTime:time,nodeId:nodeid}
			// 		console.log(this.times)
			// 		nodes.get(this.api.call1,this.endtime).then(res=>{
			// 			var index = parseInt(res.data)
			// 			console.log(index)
			// 			if (index < 3){
			// 				nodes.get(this.api.call1,this.endtime).then(res=>{
			// 					index = parseInt(res.data)
			// 					this.day = index
			// 					this.tianDialog = true
			// 				})
			// 			}else{
			// 				this.day = index
			// 				this.tianDialog = true
			// 			}
			// 		})
			// 	}
			// },
			// clText(row){
			// 	row.styleclass = 'kuang2'
			// },
			lianClose(value){
				this.lianDialog = false;
				this.getList()
			},
			lianCloseDio(value){
				this.lianDialog = value;
				this.getList()
			},
			openSampleCheck(bol){
				console.log(bol)
				if(bol == true){
					if(this.day < 3){
						console.log('1')
						nodes.get(this.api.call2,this.endtime).then(res=>{
							this.$message.success(res.message)
							this.getList()
							this.tianDialog = false
						})
					}else{
						console.log('2')
						this.$message.warning('需发起工作联系单')
						this.times = this.endtime
						this.tianDialog = false
						this.lianDialog = true
					}
				}else{
					this.tianDialog = false
					this.getList()
				}
			},
			DateDiff(sDate1,sDate2){    //sDate1和sDate2是2018-05-02格式  
			    var  aDate,  oDate1,  oDate2,  iDays  
			    aDate  =  sDate1.split("-")  
			    oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为02-05-2018格式  
			    aDate  =  sDate2.split("-")  
			    oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
			    iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
				if(Math.abs(oDate1) < Math.abs(oDate2)){
					iDays = "-"+iDays
				}else if(Math.abs(oDate1) == Math.abs(oDate2)){
					iDays = ""
				}
			    return  iDays  
			},
		}
	}
</script>

<style scoped="scoped" >
	.kuang>>>.el-input__inner{
		border: 0px;
		background: rgba(0,0,0,0);
		text-align: center;
	}
	.kuang2>>>.el-input__inner{
		/* border: 5px #000000; */
		background: rgba(0,0,0,0);
		text-align: center;
	}
</style>

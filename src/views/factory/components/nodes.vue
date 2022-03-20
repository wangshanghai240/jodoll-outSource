<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" class="traceLog">
		<template slot="difference" slot-scope="{row,$index}">
			{{row.difference}}
		</template>
	</jod-tableList>
</template>

<script>
	import nodes from '@/api/factory/nodes.js'
	import {mapGetters} from 'vuex'
	export default {
		name: 'nodes',
		computed: {
			...mapGetters([
				'size',
			])
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
				columns: nodes.columns,
				options:nodes.options
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
				this.node(data).then(res=>{
					console.log(res)
					var database = res.data
					for(var i = 0;i<database.length;i++){
						if(database[i].timeActual == null){
							database[i]["difference"] = ""
						}else{
							database[i]["difference"] = this.DateDiff(database[i].timeExpected,database[i].timeActual)
						}
					}
					this.gridData = res.data
				})
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
			}
		}
	}
</script>

<style>
</style>

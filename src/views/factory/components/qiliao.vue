<template>
	<div>
		<jod-tableList :dataSource="gridData" :columns="columns" :options="options">
			<template v-slot:content_context>
				<div style="margin-bottom: 20px;">
					<el-select v-model="value1" placeholder="请选择" style="width: 270px;" @change="changeselect">
						<el-option v-for="item in option" :key="item.value" 
					    :label="item.label" :value="item.value">
					    </el-option>
					</el-select>
				</div>
			</template>
			<template slot="type" slot-scope="{row,$index}">
				<span>{{row.type == 1?"面料":"辅料"}}</span>
			</template>
			<template slot="isComplete" slot-scope="{row,$index}">
				<span>{{row.isComplete == 0?"不足":"足够"}}</span>
			</template>
		</jod-tableList>
		<div align="center" :hidden="btnhide">
			<el-button type="primary" style="margin-left: 20px;" :disabled="show" @click="setup">确认</el-button>
			<el-button type="warning" style="margin-left: 20px;" @click="cancle">取消</el-button>
		</div>
	</div>
</template>

<script>
	import api from '@/api/index.js'
	import qiliao from '@/api/factory/qiliao.js'
	import { getLocalTime } from '@/utils'
	export default {
		props: {
			value: {
				type: Object
			},
		},
		watch: {
			value(v) {
				this.row = v
			},
		},
		data() {
		      return {
		        option:[{
					value:'0',
					label:'产前样'
				},{
					value:'1',
					label:'大货'
				}],
				row:this.value,
				value1:'0',
				gridData:[],
				columns:qiliao.columns,
				options:qiliao.options,
				show:false,
				btnhide:false,
				typeoptions:qiliao.typeoptions
		      }
		},
		mounted() {
			console.log('--------')
			console.log(this.row)
			if(this.row.qiliaoState == 2){
				this.btnhide = true
			}else if(this.row.qiliaoState == 1){
				this.show = true
			}
			this.getlist({goodId:this.row.id,orderNumber:this.row.orderNumber,type:0})
		},
		methods: {
			changeselect(val){
				console.log(this.row)
				console.log(val)
				if(this.row.qiliaoState == 1 & val == 0){
					this.show = true
					console.log(this.show)
				}else{
					this.show = false
				}
				let list = {goodId:this.row.id,orderNumber:this.row.orderNumber,type:val}
				this.getlist(list)
			},
			setup(){
				console.log(this.value1)
				let list = {goodId:this.row.id,orderNumber:this.row.orderNumber,type:this.value1}
				qiliao.post(this.api.completeStatepost,list).then(res=>{
					// console.log(res.message)
					this.$message.success(res.message)
					this.$emit('qiClose',true)
					// this.getlist(list)
				})
			},
			getlist(list){
				qiliao.get(this.api.completeState,list).then(res=>{
				    let data = res.data;
                    if(data &&  data.length > 0 ){
                        data.forEach(obj => {
                            if(!obj.demandNum){
                                obj.demandNum = 0;
							}
                            if(!obj.inventoryQuantity){
                                obj.inventoryQuantity = 0;
                            }
						});
					}
					this.gridData = data
				})
			},
			cancle(){
				this.$emit('qiClose',false)
			}
		}
	}
</script>

<style>
</style>

<template>
		<div>
			<label style="padding-right: 20px;font-size: 15px;">发送对象:</label>
			<el-select v-model="value1" multiple filterable remote :remote-method="remoteMethod" :loading="loading" placeholder="请选择" style="width: 270px;">
				<el-option v-for="item in options" :key="item.value" 
			    :label="item.label" :value="item.value">
			    </el-option>
			</el-select>
			<br />
			<br />
			<label style="font-size: 15px;">说明:</label>
			<br />
			<br />
			<textarea style="width: 100%; height: 200px;resize:none" v-model="text">
			</textarea>
			<br />
			<br />
			<div align="center">
				<el-button @click='send'>提交</el-button>
			</div>
		</div>
</template>

<script>
	import api from '@/api/index.js'
	import lianxian from '@/api/orderShop/lianxidan.js'
	import { getLocalTime } from '@/utils'
	export default {
		props: {
			value: {
				type: Array
			},
		},
		watch: {
			value(v) {
				this.endtiem = v
			},
		},
		data() {
		      return {
		        options:[],
		        value1: [],
				totaldata:'',
				endtiem:this.value,
				text:this.value,
				loading:false
		      }
		},
		created() {
			
		},
		mounted() {
			this.getNumber('')
		},
		methods: {
			// 下拉选择
			// changeNull(row) {},
			getNumber(value){
				this.getList(value);
				this.text =''
				
				for(var i=0;i<this.endtiem.length;i++){
					if(i==0){
						this.text = this.text+this.endtiem[i]
					}else{
						this.text = this.text +','+this.endtiem[i]
					}
					
				}
			},
			getList(value){
				lianxian.get(this.api.employeeList,{'keywords':value}).then(res=>{
					//this.totaldata=res.data
					let list = res.data.reduce((total,current)=>{
						// if(!current.account){
						// 	this.$message({
						// 		message: `${current.name}工号数据丢失,请联系管理员`,
						// 		type: 'warning'
						// 	});
						// }
						let obj = {
							'label':`${current.name}:${current.account}`,
							'value':current.account
						};
						if(current.account){
							total.push(obj);
						}
						return total
					},[]);
					this.options = list;
					this.loading = false;
				})
			},
			remoteMethod(value){
				this.loading = true;
				this.getList(value);
			},
			send(){
				console.log(this.value1)
				console.log(this.endtiem)
				if(this.value1 ==''){
					this.$message.warning('不能为空')
				}else{
					var workContractListProcess ={employeeNos:this.value1,filePath:'',statement:this.text}
					lianxian.post(this.api.contract,workContractListProcess).then(res=>{
						console.log(res)
						this.$message.success(`提交成功`)
						this.$emit('lianClose',false)
					})
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	
</style>

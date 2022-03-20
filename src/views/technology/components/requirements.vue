<template>
	<div>
		<el-row>
			<el-col :span="10"><div>模板名称:<el-input style="width: 68%;" v-model="name"></el-input></div></el-col>
			<el-col :span="14">
				<div style="margin-left: 5px;">品类:
				<el-select v-model="category" style="width: 50%;">
					<el-option
					v-for="item in categoryByBig"
					:key="item.value"
					:label="item.label"
					:value="item.value">
						
					</el-option>
				</el-select>
				</div>
			</el-col>
		</el-row>
		<el-row style="margin-top: 20px;">
			<el-col :span="24"><div>是否显示:<el-switch v-model="isShow" active-value='0' inactive-value='1'></el-switch></div></el-col>
		</el-row>
		<el-row style="margin-top: 20px;">
			<el-col :span="10"><div align="center">主题</div></el-col>
			<el-col :span="10"><div align="center">要求</div></el-col>
		</el-row>
		<el-row v-for="(item,index) in processRequirementTemplate" :key="index" style="margin-top: 10px;" :gutter="10">
			<el-col :span="10">
				<el-select v-model="item.theme">
					<el-option
					v-for="list in optionzt"
					:key="list.value"
					:label="list.label"
					:value="list.value"></el-option>
				</el-select>
			</el-col>
			<el-col :span="10">
				<el-input v-model="item.requirement"></el-input>
			</el-col>
			<el-col :span="4">
				<div style="margin-top: 5px;">
					<i class="iconfont" style="color: #409EFF;" @click="inset(index)">&#xe640;</i>
					<i class="iconfont" style="color: #F56C6C;margin-left: 10px;" @click="del(index)">&#xe641;</i>
				</div>
				<!-- <el-button v-if="index + 1 == requireDemandList.length" type="primary" icon="el-icon-plus" plain class="circles" circle @click="inset(index)"></el-button>
				<el-button v-else type="primary" icon="el-icon-minus" plain class="circles" circle @click="del(index)"></el-button> -->
			</el-col>
		</el-row>
		<el-row :gutter="20" style="margin-top: 20px;">
			<el-col :span="12"><div align="right"><el-button type="primary" @click="save">保存</el-button></div></el-col>
			<el-col :span="12"><div><el-button type="danger" @click="cancle">取消</el-button></div></el-col>
		</el-row>
	</div>
</template>

<script>
	import json from '@/api/technology/tecRequirements.js'
	import { loading } from '@/utils'
	import {mapGetters} from 'vuex'
	import api from '@/api/index'
	export default {
		computed:{
			...mapGetters([
				'size',
				'token'
			])
		},
		props:{
			value:{
				type:Object
			},
		},
		watch: {
			value(v){
				this.row = v
			}
		},
	    data() {
	      return {
			optionzt:[],
			processRequirementTemplate:[{category:'',categoryName:'',isShow:0,name:'',requirement:'',theme:''}],
			category:'',
			isShow:0,
			name:'',
			row:this.value,
			categoryByBig:[],
			categoryName:'',
	      }
	    },
		created() {
			
		},
		mounted(){
			this.getCategoryByBig()
		},
		methods: {
			inset(index){
				this.processRequirementTemplate.push({category:'',categoryName:'',isShow:0,name:'',requirement:'',theme:''})
			},
			del(index){
				console.log(index)
				if(this.processRequirementTemplate.length == 1){
					this.$message.warning('不能删除')
				}else{
					this.processRequirementTemplate.splice(index,1)
				}
			},
			getPoint(){
				var data = {search:{theme:'',isShow:''}};
				data['current'] = 1;
				data['size'] = 999;
				console.log('data',data)
				json.get(this.api.getcraftRequire,data).then(res=>{
					console.log(res)
					var records = res.data.records
					for(var i=0;i<records.length;i++){
						if(records[i].isShow == true){
							this.optionzt.push({label:records[i].theme,value:records[i].id + ''})
						}
					}
				})
				console.log(this.optionzt)
				if(this.row.type == 1){
					json.get(this.api.checkTemplate,this.row.name).then(res=>{
						this.isShow = res.data[0].isShow+''
						this.name = res.data[0].name
						this.category = parseInt(res.data[0].category)
						this.processRequirementTemplate = res.data
						console.log(res)
					})
				}
			},
			save(){
				for(var j=0;j<this.categoryByBig.length;j++){
					if(this.category == this.categoryByBig[j].value){
						this.categoryName = this.categoryByBig[j].label
						break
					}
				}
				for(var i=0;i<this.processRequirementTemplate.length;i++){
					this.processRequirementTemplate[i]['category'] = this.category+''
					this.processRequirementTemplate[i]['isShow'] = this.isShow
					this.processRequirementTemplate[i]['name'] = this.name
					this.processRequirementTemplate[i]['categoryName'] = this.categoryName
				}
				if(this.row.type == 0){
					json.post(this.api.postTemplate,this.processRequirementTemplate).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('reCloseDio',false)
					})
				}else{
					json.put(this.api.putTemplate,this.processRequirementTemplate).then(res=>{
						console.log(res)
						this.$message.success('保存成功')
						this.$emit('reCloseDio',false)
					})
				}
			},
			cancle(){
				this.$emit('reCloseDio',false)
			},
			getCategoryByBig(){
				json.get(this.api.categoryByBig).then(res=>{
					if(res.code==0){
						let newArr = res.data.reduce((total,current)=>{
							let {id,name} = current;
							let obj = {
								'value':id,
								'label':name
							}
							total.push(obj)
							return total
						},[])
						this.categoryByBig = newArr;
						this.getPoint()
					}
				})
			},
		},
	  }
</script>

<style lang="scss" scoped>
	.iconfont{
		user-select: none;
	    font-family:"iconfont" !important;
	    font-size:20px;font-style:normal;
		cursor:pointer;
	    -webkit-font-smoothing: antialiased;
	    -webkit-text-stroke-width: 0.2px;
	    -moz-osx-font-smoothing: grayscale;
	}
</style>

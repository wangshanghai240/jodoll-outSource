<!--
 * @FileDescription: 设计师管理
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="designer"
		@handleSelectionChange="handleSelectionChange">
		<!-- 自定义编辑列 -->
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="addShow()">新增</el-button>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="danger" :size="size" @click="deleteUser(row)" :loading="row.loading">删除</el-button>
		</template>
		<!-- 表外 -->
		<template v-slot:content_context>
			<jod-dragDialog v-model="addDialog" title="新增设计师" :dialogStyle="{width: '450',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="designerForm" :searchData="designerData" :searchForm="designerForm"
				 :searchHandle="designerHandle">
				</jod-formSearch>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import {mapGetters} from 'vuex'
	import { loading } from '@/utils'
	import json from '@/api/designer/index.js'
	
	export default{
		name:'designer',
		computed: {
			...mapGetters([
				'size'
			])
		},
		data() {
			return{
				bodyLoading:false,
				gridData:[],//源数据
				columns: json.columns,
				options: json.options,
				// pagination:{
				// 	currentPage:1,
				// 	pageSize:20
				// },
				// dataTotal:0,
				multipleSelection:[],//勾选
				addDialog:false,//设计师新增
				designerData:{
					user:''
				},
				designerForm:[{
					type: "Select",
					label: "设计师:",
					prop: "user",
					options:[],
					style:"width:200px",
					loading:false,
					placeholder: "请选择设计师",
					filterable:true,
					remote:true,
					loading:false,
					multiple:true,
					disabled:true,
					remoteMethod: query => {
						this.designerForm[0].loading = true;
						console.log('query',query)
						this.getUserList(query);
					},
					change:res=>{},
					rules: [{
						required: true,
						message: '请选择设计师',
						trigger: 'change'
					}],
				}],
				designerHandle:[{
					label: "提交",
					type: "primary",
					loading:false,
					handle: res => {
						this.$refs['designerForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								this.designerHandle[0].loading = true;
								
								let list = this.designerData['user'].reduce((total,current)=>{
									let ll = current.split(',');
									let obj = {
										'name':ll[0],
										'no':ll[1]
									};
									if(obj['no']){
										total.push(obj);
									}
									return total
								},[])
								console.log(list)
								
								this.bodyLoading = loading(document.getElementsByClassName('app-main')[0]);
								json.post(this.api.addDesigner,list).then(res=>{
									if(res.code==0){
										this.$message({
											message: '新增成功',
											type: 'success'
										});
										this.getDesigner();
										this.designerHandle[0].loading = false;
										this.addDialog = false;
									}
								}).catch(e=>{
									this.bodyLoading.close();
									this.designerHandle[0].loading = false;
								})
							} else {
								console.log(this.shopData)
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}]
			}
		},
		created() {
			this.bodyLoading = loading(document.getElementsByClassName('app-main')[0]);
			this.getDesigner();
			
		},
		methods:{
			//获取设计师列表
			async getDesigner(){
				let res = await json.get(this.api.getDesigner,{'keywords':''});
				console.log(res);
				if(res.code==0){
					this.bodyLoading.close();
					this.gridData = res.data
				}
			},
			//新增
			addShow(){
				this.addDialog = true;
				this.$nextTick(()=>{
					this.$refs['designerForm'].$refs['searchForm'].resetFields();
				})
				this.getUserList('');
			},
			//删除
			async deleteUser(row){
				this.$set(row,'loading',true)
				let list = [row.id.toString()]
				let res = await json.delete(this.api.deleteDesigner,list);
				console.log(res);
				if(res.code==0){
					this.$set(row,'loading',false)
					this.bodyLoading = loading(document.getElementsByClassName('app-main')[0]);
					this.getDesigner();
				}
			},
			async getUserList(value){
				let res = await json.get(this.api.employeeList,{'keywords':value});
				console.log(res);
				if(res.code==0){
					let list = res.data.reduce((total,current)=>{
						// if(!current.account){
						// 	this.$message({
						// 		message: `${current.name}工号数据丢失,请联系管理员`,
						// 		type: 'warning'
						// 	});
						// }
						let obj = {
							'label':`${current.name}:${current.account}`,
							'value':`${current.name},${current.account}`
						};
						
						let pp = this.gridData.find(oo=>{return oo.no==current.account});
						if(pp){
							obj['disabled'] = true;
						}
						if(current.account){
							total.push(obj);
						}
						
						return total
					},[])
					this.designerForm[0].options = list;
					this.designerForm[0].loading = false;
				}
			},
			handleSelectionChange(list){
				this.multipleSelection = list;
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>

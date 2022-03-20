<!--
 * @FileDescription: 商品列表工艺单
 * @Author: wangpenghui
 -->
<template>
	<transition name="fade" mode="out-in">
		<div v-if="!isSelect" key="newBuild">
			正在执行跳转...
		</div>
		<div v-else key="select">
			<el-row>
				<el-col :span="18">
					<jod-formSearch class="tecForm" ref="tecForm" :searchData="formData" :searchForm="formConfig"></jod-formSearch>
				</el-col>
				<el-col :span="6">
					<el-button type="primary" plain :size="size" @click="create">创建新工艺单</el-button>
				</el-col>
				
			</el-row>
			<el-row type="flex" justify="end" style="margin-top:20px;" >
				<el-button type="primary" :size="size" :loading="onLoading" @click="onSubmit">绑定</el-button>
				<el-button :size="size" @click="close">取消</el-button>
			</el-row>
		</div>
	</transition>
</template>

<script>
	import { mapGetters } from 'vuex'
	import orderData from '@/api/orderShop/orderShop.js'
	export default {
		name: 'categoryUp',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		// filters:{
		// 	tag(val,options){
		// 	    let str,bt=false;
		// 	    options.forEach(item=>{
		// 	    	if(item.value === val){
		// 	    		str = item.label;
		// 				bt = true
		// 	    	}
		// 	    })
		// 		if(bt){
		// 			return str
		// 		}else{
		// 			return val
		// 		}
			    
		// 	}
		// },
		props: {
			shopId:{
				type: Array
			},
		},
		watch: {
			shopId(v){
				this.id = v;
				//this.getDetail();
			},
		},
		data() {
			return {
				url:process.env.VUE_APP_BASE_URL,
				categoryDialog: this.categoryUpDialog,
				//categoryTitle: '工艺单',
				//quality: [],
				//options: [],
				loading: false,
				//fileList:[],
				//headers:{},
				id:this.shopId,
				onLoading:false,
				isSelect:false,//是否选择已有工艺单
				//表单检验
				option:[],//
				formData:{
					craftId:'',
				},
				formConfig:[{
						type: "Select",
						label: "关联工艺单:",
						prop: "craftId",
						options: this.option,
						clearable:true,
						filterable:true,
						style:"width:100%",
						placeholder: "请选择要关联的工艺单",
						change: row => "",
						rules: [{
							required: true, 
							message: '请选择要关联的工艺单', 
							trigger: 'blur' ,
						}],
					}
				],
				//putQuality:false,
				//imageUrl:'',
			}
		},
		created() {
			this.getDetail();
			//this.headers['Authorization'] = this.token;
		},
		methods: {
			async getDetail(){
				console.log(this.id)
				let res = await orderData.get(this.api.detailByGoods,{goodsId:this.id[0]})
				if(res.code==0){
					if(res.data){//有关联 直接跳转编辑
						this.isSelect = false
						this.$router.push({path:'/technology/tecaddList',query:{goodsId:this.id[0],path:1}})
						//携带参数跳转操作
					}else{//无关联 新建或者选择
						this.isSelect = true;
						let obj = {
							search:{
								'goodsId':null,
								'status':null
							},
							current:1,
							size:999
						}
						let craft = await orderData.get(this.api.getcraft,obj);
						if(craft.code==0){
							let {records} = craft.data;
							let newArr = records.reduce((total,current)=>{
								let {id,name,status} = current;
								if(status!==3){
									total.push({value:id,label:name})
								}
								return total;
							},[])
							this.option = newArr;
							this.formConfig[0].options = newArr;
						}
					}
				}
			},
			
			async onSubmit(){
				this.$refs['tecForm'].$refs['searchForm'].validate((valid)=>{
					if(!valid){
						return false
					}
				})
				if(this.formData&&this.formData.craftId){
					let res = await orderData.get(this.api.getbinding,{goodsId:this.id[0],'craftId':this.formData.craftId})
					if(res.code==0){
						this.$message.success('绑定成功')
						this.close();
					}
				}
			},
			close(){
				this.$emit('categoryUpClose',false) 
			},
			create(){
				this.$router.push({path:'/technology/tecaddList',query:{goodsId:this.id[0],factoryNo:this.id[1],companyNo:this.id[2],
				supplier:this.id[3],tradeName:this.id[4],id:'',cf:this.id[5],sxmc:this.id[6],path:2}})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.tecForm{
		.el-form-item{
			width: 100%;
			.el-form-item__content{
				width: 70%;
			}
		}
	}
</style>

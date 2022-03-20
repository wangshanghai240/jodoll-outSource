<!--
 * @FileDescription: 规格列表
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="nodeEditing"
		:pagination="pagination" :dataTotal="dataTotal" @handleChangePage="handleChangePage" 
		@handleSizeChange="handleSizeChange" @handleSelectionChange="handleSelectionChange">
		<!-- 表外 -->
		<template v-slot:content_context>
			<div class="searchBody">
				<el-input v-model="searchBody.name" :size="size" style="width: 145px"
					placeholder="名称 搜索" class="marginTop16" />
				<el-select v-model="searchBody.status" clearable placeholder="请选择状态"
				  class="marginTop16" style="width: 120px;;margin:0 10px;">
					<el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" style="width: 95px;" :size="size" class="marginTop16" @click="getList(true)">
					搜索
				</el-button>
			</div>
			<!-- 规格表弹窗 -->
			<jod-dragDialog v-model="addDialog" class="tableDialog" title="新建规格" :drag="true" top="10px" 
				:dialogStyle="{width: '1050',widthType: 'px'}">
				<transition name="fade" mode="out-in">
					<tec-dom v-if="addDialog" @close="close" v-model="categoryByBig" :tecValue="tecValue" :isUpdate="isUpdate"></tec-dom>
				</transition>
			</jod-dragDialog>
		</template>
		<template slot="status"  slot-scope="{row,$index}">
			<span>{{row.status == 0?"正常":"锁定"}}</span>
		</template>
		<!-- 自定义表头 -->
		<template v-slot:header_input>
			<el-button type="primary" :size="size" plain round  @click="addDialog = true,isUpdate = false" v-has:add>新建</el-button>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<el-button type="primary" :size="size" @click="update(row)" :loading="row.loading" v-has:update>修改</el-button>
			<el-button type="info" :size="size" @click="copyRow(row)" :loading="row.copyLoading" v-has:copy>复制</el-button>
			<el-button type="danger" :size="size" @click="delRow(row)" :loading="row.delLoading" v-has:del>删除</el-button>
		</template>
	</jod-tableList>
</template>

<script>
	import tecList from '@/api/technology/tecList.js'
	import tecDom from './components/tecDom.vue'
	import {mapGetters} from 'vuex'
	import {loading} from '@/utils'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		components: {
			'tecDom':tecDom,
		},
		data() {
			return {
				loading:null,
				gridData: [], //源数据
				columns: tecList.columns,
				options: tecList.options,
				pagination: {
					currentPage: 1,
					pageSize: 20
				},
				dataTotal: 0,
				multipleSelection: [], //勾选
				searchOptions:tecList.searchOptions,//搜索状态
				searchBody: {
					name: '',
					status:''
				},
				addDialog:false,//规格表弹窗
				categoryByBig:[],//品类
				isUpdate:false,//是否修改
				tecValue:null,//规格详情数据
			}
		},
		created() {
			this.getCategoryByBig();
			this.getList();
			
		},
		methods: {
			getCategoryByBig(){
				tecList.get(this.api.categoryByBig).then(res=>{
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
					}
				})
			},
			//获取列表数据
			async getList(first){
				try {
				    if(first){
                        this.pagination['currentPage'] = 1;
					}
					this.loading = loading(document.getElementsByClassName('app-main')[0])
					let search = {...this.searchBody}
					let form = {
						current:this.pagination['currentPage'],
						size:this.pagination['pageSize'],
						search}
					let res = await tecList.get(this.api.specification,form);
					if(res.code==0){
						this.gridData = res.data.records;
						this.dataTotal = res.data.total;
					}
					
				}finally{
					this.loading.close();
				}
			},
			handleChangePage(current) {
				this.pagination['currentPage'] = current;
				this.getList()
			},
			handleSizeChange(page) {
				this.pagination['pageSize'] = page;
				this.getList()
			},
			handleSelectionChange(list) {
				this.multipleSelection = list;
			},
			async update(row){//修改
				this.$set(row,'loading',true)
				let {categoryId,id} = row;
				let res = await tecList.get(this.api.findPartAndSeries,{'specificationId':id,'categoryId':categoryId})
				if(res.code==0){
					this.$set(row,'loading',false)
					this.tecValue = res.data;
					this.isUpdate = true;
					this.addDialog = true;
				}
			},
			//删除
			async delRow(row){
				this.$set(row,'delLoading',true)
				let res = await tecList.delete(this.api.specification,row.id)
				if(res.code==0){
					this.$set(row,'delLoading',false)
					this.$message.success('删除成功')
					this.getList();
				}
			},
			//复制
			async copyRow(row){
				this.$set(row,'copyLoading',true)
				let res = await tecList.get(this.api.copy,{'id':row.id})
				if(res.code==0){
					this.$set(row,'delLoading',false)
					this.$message.success('复制成功')
					this.getList();
				}
			},
			//手动触发
			close(value){
				let {status,isClose} = value;
				this.addDialog = isClose;
				if(status){
					this.getList();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>

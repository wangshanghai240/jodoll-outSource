<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :pagination="pagination"
	:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange">
	<template v-slot:header_input>
		<el-button type="primary" :size="size"  plain round class="marginRight10" @click="ineset" v-has:add>新增</el-button>
	</template>
	<template slot="isShow" slot-scope="{row,$index}">
		<span>{{row.isShow == 0?'是':'否'}}</span>
	</template>
	<template slot="operate" slot-scope="{row,$index}">
		<div style="display: flex;flex-wrap:wrap;justify-content: center;">
			<el-button type="primary" :size="size" class="marginRight10" @click="update(row)" v-has:update>修改</el-button>
			<el-button type="danger" :size="size" class="marginRight10" @click="deletes(row)" v-has:del>删除</el-button>
		</div>
	</template>
	<!-- 表外 -->
	<template v-slot:content_context>
		<!--新增-->
		<jod-dragDialog v-model="requireDio" :title="titles" :dialogStyle="{width: '600',widthType: 'px'}">
			<require v-model="requireData" v-if="requireDio" @reCloseDio="reCloseDio(arguments)"></require>
		</jod-dragDialog>
	</template>
	</jod-tableList>
</template>

<script>
	import technology from '../../api/technology/tecRequirements.js'
	import {mapGetters} from 'vuex'
	import { getLocalTime ,loading } from '@/utils'
	import {throttle , debounce} from '@/utils/validate.js'
	import require from './components/requirements.vue'
	export default {
		name:'tecpiont',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		components: {
			require:require
		},
		data() {
			return {
				gridData:[],
				columns:technology.columns,
				options:technology.options,
				pagination:{//分页
					currentPage:1,
					pageSize:20
				},
				dataTotal:0,
				requireDio:false,
				requireData:'',
				categoryByBig:[],
				titles:''
			}
		},
		created() {
			
		},
		mounted(){
			this.getlist()
		},
		methods: {
			getlist(){
				let formD= {category:'',categoryName: '',id: '',isShow: '',name:'',requirement: '',theme:''}
				formD['page'] = this.pagination['currentPage'];
				formD['limit'] = this.pagination['pageSize'];
				technology.post(this.api.getTemplate,formD).then(res=>{
					console.log(res)
					this.gridData = res.data.records
					this.dataTotal = res.data.total
				})
			},
			ineset(){
				this.titles = '新增'
				this.requireData = {type:0,name:''}
				this.requireDio = true
			},
			update(row){
				this.titles = '修改'
				this.requireData = {type:1,name:row.name}
				this.requireDio = true
			},
			deletes(row){
				technology.delete(this.api.deleteTemplate,{name:row.name}).then(res=>{
					console.log(res)
					this.$message.success('删除成功')
					this.getlist()
				})
			},
			reCloseDio(value){
				this.requireDio = false
				this.getlist()
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
					}
				})
			},
			handleChangePage(value){
				this.pagination['currentPage'] = value;
				this.getlist()
			},
			handleSizeChange(value){
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				this.getlist()
			},
		}
	}
</script>

<style>
</style>
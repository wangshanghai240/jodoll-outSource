<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" class="traceLog">
		<template v-slot:content_context>
			<div class="searchBody">
				<el-select v-model="status" placeholder="请选择" clearable :size="size" style="width: 100px;margin-right: 10px;">
				    <el-option
				      v-for="item in StateOptions"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				    </el-option>
				</el-select>
				<el-date-picker v-model="startTime" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
				</el-date-picker>
				<el-button type="primary" class="marginLeft10" style="width: 95px;" :size="size" :loading="searchLoading" @click="searchTrace">搜索</el-button>

			</div>
		</template>
	</jod-tableList>
</template>

<script>
	import calNodes from '@/api/processNode/calNodes.js'
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
				type: Number
			}
		},
		watch: {
			value(v) {
				this.proId = v
			}
		},
		data() {
			return {
				proId: this.value,
				startTime: '',
				gridData: [],
				columns: calNodes.columns,
				options: calNodes.options,
				searchLoading: false,
				status:'',
				StateOptions:[{
						value:'0',
						label:'开始时间'
					},{
						value:'1',
						label:'结束时间'
					},
				]
			}
		},
		methods: {
			searchTrace() {
				console.log(this.startTime);
				if(!this.status) {
					this.$message.warning('请选择前置条件');
					return
				}
				if(!this.startTime) return
				this.searchLoading = true;
				let form = {processId:this.proId};
				let url;
				if(this.status=='0'){
					url = this.api.cal;
					form['startTime'] = this.startTime
				}else{
					url = this.api.cal1;
					form['endTime'] = this.startTime
				}
				console.log(form);
				calNodes.get(url,form).then(res=>{
					this.$message.success(res.message)
					let {data} = res;
					this.gridData = data;
					this.searchLoading = false;
				}).catch(err=>{
					this.searchLoading = false;
				})
			},
		}
	}
</script>

<style>
</style>

<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :pagination="pagination" :dataTotal="dataTotal"
	 @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange">
		<template v-slot:content_context>
			<div class="searchBody">
				<el-date-picker v-model="dateTime" :size="size" type="datetimerange" range-separator="至" start-placeholder="开始日期"
				 end-placeholder="结束日期" class="marginTop16">
				</el-date-picker>
				<el-button type="primary" style="margin-left: 10px;" :size="size" icon="el-icon-search"
				  class="marginTop16" @click="getList(true)">搜索</el-button>
			</div>
		</template>
	</jod-tableList>
</template>

<script>
	import sysLog from "@/api/controller/sysLogList.js";
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'sysLog',
		computed: {
			...mapGetters([
				'size'
			])
		},
		data() {
			return {
				columns: sysLog.columns, //列
				options: sysLog.options, //额外配置
				pagination: {
					//分页
					currentPage: 1,
					pageSize: 20,
				},
				dataTotal: 0, //总条数
				gridData: [], //源数据
				dateTime: "",
				loading: null,
			};
		},
		created() {
			this.getList();
		},
		methods: {
			getList(first) {
				// 	this.loading = loading(
				//     document.getElementsByClassName("table_list_fix")[0]
				//   );
				if(first){
                    this.pagination["currentPage"] = 1;
				}
				this.getListByPage()
					.then((res) => {
						this.gridData = res.records;
						this.dataTotal = res.total;
						//      this.loading.close();
						//   this.loading = null;
					})
					.catch((err) => {
						console.log(err);
						//   this.loading.close();
						//   this.loading = null;
					});
			},
			getListByPage() {
				let data = {
					current: this.pagination["currentPage"],
					size: this.pagination["pageSize"],
					search: {
						endTime: this.dateTime == null ? "":this.dateTime[1],
						startTime: this.dateTime == null ? "":this.dateTime[0],
						id: this.$route.params.id ? this.$route.params.id :undefined
					},
				};
				let url = this.api.sysLogList;
				return sysLog.getSysLogPage(url, data);
			},
			handleChangePage(value) {
				this.pagination["currentPage"] = value;
				this.getList();
			},
			handleSizeChange(value) {
				//   this.pagination["currentPage"] = 1;
				this.pagination["pageSize"] = value;
				this.getList();
			},
		},
	};
</script>

<style lang="scss" scoped>
</style>

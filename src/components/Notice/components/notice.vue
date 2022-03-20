<template>
	<div class="notice">
		<div style="margin-bottom:10px;" v-if="status == 1">
			<el-button type="success" size="mini" @click="allRead">全部忽略</el-button>
		</div>
		<el-container style="height: 500px; border: 1px solid #eee">
			<el-aside width="25%" >
				<!-- <el-row :gutter="20"> -->
				<!-- <el-col :span="6"> -->

				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部" name="first">
						<template v-for="(row,index) in noticeData">
							<div class="body" @click="handleChange(row,index)" :style="selectIndex==index?'backgroundColor:#ccc':''">
								<el-badge is-dot :hidden="row.state == 1">
									<div class="item" :style="row.state == 2?'color:#333':'color:#999'">
										<span>{{index+1}}.</span>{{row.title}}
									</div>
								</el-badge>
								<br />
								<span style="color: #aaa;font-size: 12px;">{{row.createTime}}</span>
							</div>
						</template>
						
						<p class="once_font" v-if="noticeData.length < total">
							<el-link @click="hanleUpdate" style="color:#ccc;">点击加载更多</el-link>
						</p>
						<p class="once_font" v-else>已加载全部</p>
					</el-tab-pane>

					<el-tab-pane label="已办" name="second" v-if="isExit">
						<template  v-for="(row,index) in noticeData">
							<div class="body" @click="handleChange(row,index)">
								<el-badge is-dot :hidden="true">
									<div class="item" style="color: #999;">
										<span>{{index+1}}.</span>{{row.title}}
									</div>
								</el-badge>
								<br />
								<span style="color: #aaa;font-size: 12px;">{{row.createTime}}</span>
							</div>
						</template>
						
						<p class="once_font" v-if="noticeData.length < total">
							<el-link @click="hanleUpdate" style="color:#ccc;">点击加载更多</el-link>
						</p>
						<p class="once_font" v-else>已加载全部</p>
					</el-tab-pane>

					<el-tab-pane label="待办" name="third" v-if="isExit">
						<template v-for="(row,index) in noticeData">
							<div class="body">
								<el-badge is-dot :hidden="true">
									<div class="item" @click="handleChange(row,index)">
										<span>{{index+1}}.</span>{{row.title}}
									</div>
								</el-badge>
								<br />
								<span style="color: #aaa;font-size: 12px;">{{row.createTime}}</span>
							</div>
						</template>
						<p class="once_font" v-if="noticeData.length < total">
							<el-link @click="hanleUpdate" style="color:#ccc;">点击加载更多</el-link>
						</p>
						<p class="once_font" v-else>已加载全部</p>
					</el-tab-pane>
				</el-tabs>
			</el-aside>

			<el-main>
				<!-- </el-col> -->
				<!-- <el-col :span="18"> -->
				<div style="margin-left:20px;">
					<h2>{{noticeEntity.title}}</h2>
					<div v-html="noticeEntity.content"></div>
					<p style="position:absolute; bottom:50px;right:60px;">
						<el-link v-if="noticeEntity.callId != null && noticeEntity.callId != ''" style="color:#1E90FF;"
							@click="handleRoute(noticeEntity)">立即前往 &gt;&gt;</el-link>
					</p>
				</div>
				<!-- </el-col> -->
			</el-main>
			<!-- </el-row> -->
		</el-container>
	</div>
</template>

<script>
	import notice from '@/api/notice/notice.js'
	import {
		Row
	} from "element-ui";
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: "notice",
		props: {
			status: {
				type: Number
			},
			isExit: {
				type: Boolean
			}
		},
		computed: {
			...mapGetters(["messageNum"])
		},
		data() {
			return {
				activeName: "first",
				noticeData: [],
				listQuery: {
					search: {
						state: null
					},
					size: 10,
					current: 1
				},
				total: 0,
				noticeEntity: {},
				init: true,
				selectIndex:null,
			};
		},
		mounted() {
			this.getInit();
		},

		methods: {
			//待办方法
			getInit() {
				this.noticeEntity = {};
				this.noticeData = [];
				this.init = true;
				if (this.status == 0) {
					//其他
					this.getList();
				}
				if (this.status == 1) {
					//全部
					this.listQuery.search.state = null;
					this.getMessageList();
					//this.activeName = "second";
				}
			},
			getList() {
				this.$notify({
					title: '初始化',
					message: '获取其他',
					type: 'success'
				});
				// let noticeData = resp.data.records;
				// noticeData.forEach(x => {
				// 	this.noticeData.push(x);
				// });

				// this.total = resp.data.total;
				// this.listQuery.size = resp.data.size;
				// this.listQuery.current = resp.data.current;

				// if (this.init && this.noticeData.length > 0) {
				// 	this.noticeEntity = this.noticeData[0];
				// 	this.init = false;
				// }
			},
			async getMessageList() {
				let resp = await notice.get(this.api.holdTasks, this.listQuery);
				let noticeData = resp.data.records;
				noticeData.forEach(x => {
					this.noticeData.push(x);
				});

				this.total = resp.data.total;
				this.listQuery.size = resp.data.size;
				this.listQuery.current = resp.data.current;

				if (this.init && this.noticeData.length > 0) {
					this.handleChange(this.noticeData[0]);
					this.init = false;
				}
			},
			hanleUpdate() {
				this.listQuery.size = 10;
				this.listQuery.current += 1;
				this.getList();
			},
			//查看详情
			handleChange(row, index) {
				this.selectIndex = index;
				this.noticeEntity = row;
			},
			//切换Tab
			handleClick(tab, event) {
				this.noticeData = [];
				this.noticeEntity = {};
				if (tab.name === "second") {
					this.listQuery.search.state = 1;
				} else if (tab.name === "third") {
					this.listQuery.search.state = 2;
				} else {
					this.listQuery.search.state = null;
				}
				this.getMessageList();
				// console.log(tab, event);
			},
			// remove(row, index) {
			//   // let query = { noticeId: row.id };
			//   this.$confirm("此操作将永久删除该公告, 是否继续?", "提示", {
			//     confirmButtonText: "确定",
			//     cancelButtonText: "取消",
			//     type: "warning"
			//   })
			//     .then(() => {
			//       notice.delete(row.id).then(resp => {
			//         this.noticeData.splice(index, 1);
			//         this.$message({
			//           type: "success",
			//           message: "删除成功!"
			//         });
			//       });
			//     })
			//     .catch(() => {
			//       this.$message({
			//         type: "info",
			//         message: "已取消删除"
			//       });
			//     });
			// },
			allRead() {
				if(this.messageNum==0){
					this.$message.warning('暂无可忽略信息');
					return
				}
				this.$confirm('是否忽略所有消息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					notice.put(this.api.updateAll).then(resp => {
						if(resp.code==0){
							this.noticeData.forEach(item=>{
								item.state = 1
							})
							this.$store.commit('user/SET_MESSAGENUM', 0)
							this.$message.success('操作成功')
						}else{
							this.$message.error('操作失败')
						}
					})
					
				}).catch(() => {});
				

				// let query = this.noticeData.map(item => {
				// 	return {
				// 		nid: item.nid
				// 	};
				// });
				// this.noticeData = this.noticeData.map(item => {
				// 	item.state = 1;
				// 	return item;
				// });
			},
			handleRoute(row) {
				let tasksId = row.id;
				notice.put(this.api.putHoldTasks+`?tasksId=${tasksId}`).then(resp => {
					if(resp.code==0){
						this.$emit("messageVisible",{
								'callId':row.callId,
								'category':row.category,
								'state':false,
								'factoryOrderId':row.factoryOrderId,
								'goodsId':row.goodsId
							});
					}else{
						this.$message.error('操作失败')
					}
				})
				
				// this.$router.push({
				// 	path: row
				// });
				// if (this.status === 0) {
				// 	this.$emit("noticeVisible", false);
				// } else {
				// 	
				// }
			}
		}
	};
</script>

<style lang="scss" scoped>
	/* .hover_title {
    height:30px;
    border-bottom: 1px solid #ccc;
    margin-bottom:20px;

} */
	.notice{
		/deep/.el-aside{
			padding: 0px 0px;
			.el-tabs__header{
				padding: 0 5px;
			}
		}
	}
	.once_font {
		text-align: center;
		font-size: 12px;
		color: #ccc;
	}

	.hover_title:hover {
		background-color: #ccc;
	}
	.body{
		border-bottom:1px solid #ccc;
		&:active{
			background-color: #ccc;
		}
	}
	.item {
		cursor: pointer;
		font-size: 14px;
		margin: 0;
		height: 20px;
		line-height: 20px;
	}
</style>

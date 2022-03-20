<template>
	<div>
		<div class="messageBody">
			<el-badge :value="messageNum!==0?messageNum:''" :max="99" @click.native="messageVisible = true"
				class="hover-effect">
				<i class="el-icon-s-order"
					style="font-size: 28px;line-height: 80px;padding-right: 15px;padding-left: 10px;"></i>
			</el-badge>
		</div>


		<jod-dragDialog class="traceDialog" v-model="messageVisible" title="待办"
			:dialogStyle="{width: '70',widthType: '%'}">
			<notice :status="1" :is-exit="true" ref="message" v-if="messageVisible" @messageVisible="noticeClose" />
		</jod-dragDialog>

		<!--工艺单-->
		<jod-dragDialog v-model="tecExportDio" title="工艺单" :drag="true" top="10px"
			:dialogStyle="{width: '1200',widthType: 'px'}">
			<tecExportDom v-model="tecExport" v-if="tecExportDio"></tecExportDom>
		</jod-dragDialog>

		<!-- 工厂入库检导出 -->
		<jod-dragDialog v-model="facExportDio" class="tableDialog" style="padding-bottom: 50px;" title="导出" top="50px"
			:drag="true" :dialogStyle="{width: '1200',widthType: 'px'}">
			<facExportDom v-if="facExportDio" v-model="facExport" :rowInfo="rowInfo" @closeExport="closeExport()">
			</facExportDom>
		</jod-dragDialog>

		<!-- 面料 -->
		<jod-dragDialog v-model="fabExportDio" class="tableDialog" style="padding-bottom: 50px;" top="10px" :drag="true"
			:dialogStyle="{width: '900',widthType: 'px'}">
			<fabExportDom v-if="fabExportDio" v-model="fabExport"></fabExportDom>
		</jod-dragDialog>

		<!-- 辅料 -->
		<jod-dragDialog v-model="ingExportDio" class="tableDialog" style="padding-bottom: 50px;" title="详情" top="50px"
			:dialogStyle="{width: '1200',widthType: 'px'}" :drag="true">
			<ingExportDom v-model="ingExport" v-if="ingExportDio"></ingExportDom>
		</jod-dragDialog>
	</div>
</template>

<script>
	import notice from './components/notice.vue'
	import tecExportDom from '@/views/technology/components/export.vue'
	import facExportDom from '@/views/factory/components/warehouseDetails.vue'
	import fabExportDom from '@/views/fabric/components/warhouseExport.vue'
	import ingExportDom from '@/views/ingredients/components/warhouseDetails.vue'
	import noticeJson from '@/api/notice/notice.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'Notice',
		components: {
			notice,
			tecExportDom,
			facExportDom,
			fabExportDom,
			ingExportDom
		},
		computed: {
			...mapGetters(["accountInfo", "userInfo", "messageNum"])
		},
		data() {
			return {
				messageVisible: false,
				websocket: null, //实时连接
				notifications: {}, //消息提示
				lockReconnect: false, //是否连接
				timeout: 10 * 1000, //心跳间隔
				timeoutObj: null, //倒计时
				serverTimeoutObj: null,
				timeoutnum: null, //重连倒计时
				listQuery: {
					search: {
						state: 2
					},
					size: 10,
					current: 1
				},
				//工艺单
				tecExportDio: false,
				tecExport: [],
				//工厂入库检
				facExportDio: false,
				facExport: '',
				rowInfo: null,
				//面料
				fabExportDio: false,
				fabExport: null,
				//辅料
				ingExportDio: false,
				ingExport: null
			}
		},
		mounted() {
			this.$store.commit('user/SET_ACCOUNTINFO', this.userInfo.id);
			this.getMessageList();
			if ('WebSocket' in window) {
				console.log('开始')
				this.websocket = new WebSocket(this.api.message + this.accountInfo)
				this.initWebSocket()
			} else {
				alert('当前浏览器 Not support websocket')
			}
		},
		beforeDestroy() {
			console.log('执行销毁')
			this.onbeforeunload();
			clearTimeout(this.timeoutObj);
			clearTimeout(this.serverTimeoutObj);
			clearTimeout(this.timeoutnum);
		},
		methods: {
			async getMessageList() {
				let resp = await noticeJson.get(this.api.holdTasks, this.listQuery);
				console.log('----------------------------')
				this.$store.commit('user/SET_MESSAGENUM', resp.data.total)
			},
			initWebSocket() {
				// 连接错误
				this.websocket.onerror = this.setErrorMessage

				// 连接成功
				this.websocket.onopen = this.setOnopenMessage

				// 收到消息的回调
				this.websocket.onmessage = this.setOnmessageMessage

				// 连接关闭的回调
				this.websocket.onclose = this.setOncloseMessage

				// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
				window.onbeforeunload = this.onbeforeunload
			},
			reconnect() { //重新连接
				var that = this;
				console.log('重新连接')
				//console.log(that.lockReconnect)
				if (that.lockReconnect) {
					console.log('返回')
					return;
				};
				//没连接上会一直重连，设置延迟避免请求过多
				//console.log(that.timeoutnum && clearTimeout(that.timeoutnum))
				that.timeoutnum && clearTimeout(that.timeoutnum);
				that.timeoutnum = setTimeout(function() {
					//新连接
					//console.log('新连接')
					let userInfo = that.accountInfo;
					that.websocket = new WebSocket(that.api.message + this.accountInfo)
					//console.log(userInfo)
					//console.log(that.websocket)
					that.initWebSocket()
					//console.log(that.lockReconnect)
				}, 5000);
			},
			reset() { //重置心跳
				var that = this;
				//清除时间
				clearTimeout(that.timeoutObj);
				clearTimeout(that.serverTimeoutObj);
				//console.log('重置心跳')
				//重启心跳
				that.start();
			},
			start() { //开启心跳
				var self = this;
				//console.log('开启心跳')
				self.timeoutObj && clearTimeout(self.timeoutObj);
				self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
				self.timeoutObj = setTimeout(function() {
					//这里发送一个心跳，后端收到后，返回一个心跳消息，
					if (self.websocket.readyState == 1) { //如果连接正常
						self.websocket.send("heartCheck");
						//console.log('发送消息')
					} else { //否则重连
						self.lockReconnect = false;
						//console.log('发送失败，重连')
						self.websocket.close();
						self.reconnect();
					}
					self.serverTimeoutObj = setTimeout(function() {
						//超时关闭
						self.lockReconnect = false;
						//console.log('超时关闭');
						self.websocket.close()
						self.reconnect();
					}, self.timeout);

				}, self.timeout)
			},
			setOnopenMessage() {
				//开启心跳
				this.lockReconnect = true;
				this.start();
				console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
			},
			setOnmessageMessage(event) {
				console.log('---------')
				console.log(event)
				if (event.data == '1') {
					this.reset(); //收到服务器信息，心跳重置
				} else {
					let userInfo = this.accountInfo;
					this.$store.commit('user/SET_MESSAGENUM', this.messageNum + 1)
					var _this = this;
					let data = JSON.parse(event.data)
					// 根据服务器推送的消息做自己的业务处理
					// if(!this.dialogObj[v.id]){//判断是否对象中已经有值
					// 	 this.dialogObj[v.id] = this.$notify(...)
					// }
					const h = this.$createElement
					let notify = this.$notify({
						position: 'bottom-right',
						title: data.title,
						type: 'success',
						dangerouslyUseHTMLString: true,
						message: h('div', {
							class: 'message'
						}, [
							h('div', {
								class: 'btnList'
							}, [
								h('span', null, data.msg),
							]),
							h('div', {
								class: 'btnList'
							}, [
								h('button', {
										class: 'later btn-8',
										on: {
											click: this.handleRoute.bind(_this, data)
										}
									},
									'立即前往'
								)
							]),
						]),
						duration: 5000
					})
					this.notifications[data.id] = notify;
				}
				//console.log(event)
				//console.log('服务端返回：' + event.data)
			},
			setOncloseMessage() {
				//this.$message.error('WebSocket连接关闭')
				console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
			},
			setErrorMessage() {
				console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
			},
			onbeforeunload() {
				this.closeWebSocket()
			},
			closeWebSocket() {
				this.websocket.close()
			},
			//立即前往
			handleRoute(row) {
				console.log(row)
				console.log(this.notifications)
				if (this.notifications[row.id]) {
					this.notifications[row.id].close();
					delete this.notifications[row.id];
				}
				let tasksId = row.id;
				noticeJson.put(this.api.putHoldTasks + `?tasksId=${tasksId}`).then(resp => {
					if (resp.code == 0) {
						if (this.messageNum > 0) {
							this.$store.commit('user/SET_MESSAGENUM', this.messageNum - 1);
							this.noticeClose({
								'callId': row.callId,
								'category': row.category,
								'factoryOrderId': row.factoryOrderId,
								'goodsId': row.goodsId,
								'state': false
							})
						}
					} else {
						this.$message.error('操作失败')
					}
				})

				// this.$router.push({ path: row });
				// notice //已读
				//   .route("userNoticeHaveRead")
				//   .put({nid:id,uid:uid})
				//   .then(resp => {
				//     this.messageNum = this.messageNum - 1;
				//   });
			},
			noticeClose(value) {
				this.messageVisible = value.state;
				switch (value.category) {
					case 1:
						this.tecExport = [value.callId, 0];
						setTimeout(() => {
							this.tecExportDio = true;
						}, 300)
						break;
					case 2:
						this.facExport = {
							id: value.factoryOrderId,
							goodsId: value.goodsId
						};
						console.log(this.facExport)
						setTimeout(() => {
							this.facExportDio = true;
						}, 300)
						//this.rowInfo = {createBy:row.createBy,createTime:row.createTime};
						break;
					case 3:
						this.fabExport = {
							id: value.callId
						};
						setTimeout(() => {
							this.fabExportDio = true;
						}, 300)
						//this.rowInfo = {createBy:row.createBy,createTime:row.createTime};
						break;
					case 4:
						this.ingExport = {
							id: value.id,
							type: 0
						};
						setTimeout(() => {
							this.ingExportDio = true;
						}, 300)
						//this.rowInfo = {createBy:row.createBy,createTime:row.createTime};
						break;
					case 5:
						this.$router.push({path:'/factory/approval',query:{id:value.goodsId}})

				}
				if (this.messageNum > 0) {
					this.$store.commit('user/SET_MESSAGENUM', this.messageNum - 1)
				}
			},
			//工厂
			closeExport(value) {
				this.facExportDio = value;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hover-effect {
		cursor: pointer;
		transition: background-color .3s;

		&:hover {
			background-color: rgba(0, 0, 0, .025)
		}

	}

	.messageBody {
		/deep/.el-badge__content {
			top: 30px;
			right: 30px;
		}
	}

	.message {
		width: 244px;

		.later {
			float: right;
		}
	}

	button {
		padding: 3px 7px;
		border-radius: 10px;
		border: 2px solid;
		font: 16px 'Open Sans', sans-serif;
		text-transform: uppercase;
		background: none;
		outline: none;
		cursor: pointer;
		-webkit-transition: all .5s;
		transition: all .5s;
	}

	.btn-8 {
		color: #13CE66;
		border-color: #E7FAF0;
		overflow: hidden;
		position: relative;
	}

	.btn-8:before,
	.btn-8:after {
		content: "";
		position: absolute;
		z-index: -1;
		height: 100%;
		width: 0;
		top: 0;
		background-color: #E7FAF0;
		-webkit-transition: all .4s;
		transition: all .4s;
	}

	.btn-8:before {
		left: -30px;
		-webkit-transform: skew(-45deg, 0);
		transform: skew(-45deg, 0);
	}

	.btn-8:after {
		right: -30px;
		-webkit-transform: skew(-45deg, 0);
		transform: skew(-45deg, 0);
	}

	.btn-8:hover {
		color: #13CE66;
	}

	.btn-8:hover:before,
	.btn-8:hover:after {
		width: 100%;
	}
</style>

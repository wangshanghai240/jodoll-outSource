<!--
 * @FileDescription: 工厂列表
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" ref="shopList" :pagination="pagination"
		:dataTotal="dataTotal" @handleChangePage="handleChangePage" @handleSizeChange="handleSizeChange"
		@handleSelectionChange="handleSelectionChange" class="qualityList">
		<template v-slot:header_input>
			<!-- <el-button type="primary" :size="size" style="width: 75px;" :loading="addLoading" plain round @click="addShop">
				新增
			</el-button> -->
			<el-button type="primary" :size="size" plain round @click="searchDialog = true">
				搜索
			</el-button>
		</template>

		<template slot="lx" slot-scope="{ row }">
			<span>{{row.lx ? statetype[row.lx].label : '无'}}</span>
		</template>

		<!-- 		<template slot="contractState" slot-scope="{ row, $index }">
			<span>{{row.contractState?contractStateOptions[row.contractState].label:contractStateOptions[row.contractState].label}}</span>
		</template> -->

		<template slot="state" slot-scope="{ row }">
			<span>{{row.state?stateOptions[row.state - 1].label:stateOptions[row.state - 1].label}}</span>
		</template>

		<template slot="operate" slot-scope="{row}">
			<div style="display: flex;justify-content: center">
				<el-button :size="size" type="info" plain class="marginAuto0" @click="queryFactory(row)" v-has:view>查看
				</el-button>
				<el-button :size="size" type="success" class="marginAuto0" @click="hjUp(row)" v-has:cardPreview>函证预览
				</el-button>
				<!-- <el-button :size="size" type="primary" class="marginAuto0" @click="" v-has:pactConfirm>合同确认</el-button>
				<el-button :size="size" type="success" plain  @click="confirmContact(row)" v-has:pactView>合同查看</el-button> -->
				<el-dropdown split-button type="primary" :size="size" trigger="click" class="margin0_10">
					<span class="el-dropdown-link">
						合同操作
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native="hetong(row)" v-has:pactConfirm>
							<span>合同确认</span>
						</el-dropdown-item>
						<el-dropdown-item @click.native="confirmContact(row)" v-has:pactView>
							<span>合同查看</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-button :size="size" type="warning" plain @click="notice(row)" v-has:bulkEnter>大货入库通知</el-button>
				<el-button v-if="row.state==1" type="danger" icon="el-icon-delete" circle v-has:del
					:disabled="delLoading" @click="delRow(row)"></el-button>
			</div>
		</template>

		<!-- 表外 -->
		<template v-slot:content_context>
			<!-- 发货按钮 -->
			<div class="categoryUpload" style="margin-bottom: 16px;">
				<el-button type="info" plain :loading="fabLoading" :size="size" v-has:fabricShipping @click="fabUp">面料发货
				</el-button>
				<el-button type="info" plain :loading="ingLoading" :size="size" v-has:ingredientsShipping
					@click="ingUp">辅料发货</el-button>
				<el-button type="primary" :size="size" @click="lianxianup" v-has:contact>
					发起联系单
				</el-button>
				<el-button type="danger" plain :size="size" @click="exportBOM">
					辅料BOM清单导出
				</el-button>
				<el-button type="warning" plain :size="size" @click="distribution" v-has:allot>
					分配跟单员
				</el-button>
			</div>
			<!-- 搜索 -->
			<jod-dragDialog v-model="searchDialog" title="搜索" :dialogStyle="{width: '750',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="factoryListForm" :searchData="searchData"
					:searchForm="factoryListForm" :searchHandle="factoryHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 确认 -->
			<jod-dragDialog v-model="confirmDialog" class="confirmDialog" title="订单确认" top="30vh"
				:dialogStyle="{width: '400',widthType: 'px'}">
				<jod-formSearch labelWidth="120px" ref="confirmForm" :searchData="confirmData" :searchForm="confirmForm"
					:searchHandle="confirmHandle">
				</jod-formSearch>
			</jod-dragDialog>
			<!-- 面料发货 -->
			<jod-dragDialog v-model="fabricUpDio" title="面料发货" class="tableDialog"
				:dialogStyle="{width: '80',widthType: '%'}">
				<fabric-up v-model="selectionId" :selectValue="selectValue" v-if="fabricUpDio" @fabClose="fabClose(arguments)"></fabric-up>
			</jod-dragDialog>
			<!-- 辅料发货 -->
			<jod-dragDialog v-model="ingUpDio" title="辅料发货" class="tableDialog"
				:dialogStyle="{width: '80',widthType: '%'}">
				<ingredients-up v-model="selectionId" :selectValue="selectValue" v-if="ingUpDio" @ingClose="ingClose(arguments)"></ingredients-up>
			</jod-dragDialog>
			<!--合同流程-->
			<jod-dragDialog v-model="proUpDio" title="合同流程" class="tableDialog"
				:dialogStyle="{width: '750',widthType: 'px'}" @closeDio="proCloseDio">
				<process-up v-model="dgmc" v-if="proUpDio" :model="3" @proClose="proClose(arguments)"></process-up>
			</jod-dragDialog>
			<!--函证预览-->
			<jod-dragDialog v-model="hanjianDio" title="函证预览" class="tableDialog" :drag="true" top="10px"
				:dialogStyle="{width: '1200',widthType: 'px'}">
				<hanjian-up v-model="orderNumber" :orderRow="orderRow" v-if="hanjianDio"></hanjian-up>
			</jod-dragDialog>
			<!--工作联系单-->
			<jod-dragDialog v-model="lianDialog" title="工作联系单" :dialogStyle="{width: '400',widthType: 'px'}"
				@closeDio="lianCloseDio">
				<lianxian-up v-model="beizhu" v-if="lianDialog" @lianClose="lianClose(arguments)"></lianxian-up>
			</jod-dragDialog>
			<!-- 合同确认 -->
			<jod-dragDialog v-model="conDialog" title="合同确认" :dialogStyle="{width: '95',widthType: '%'}" :drag="true"
				top="10px">
				<contarct v-model="conOrderNumber" :orderRow="orderRow" @conClose="conClose(arguments)"
					v-if="conDialog"></contarct>
			</jod-dragDialog>
			<!--合同预览-->
			<jod-dragDialog v-model="hecheckDio" title="合同预览" class="tableDialog" :drag="true" top="10px"
				:dialogStyle="{width: '1300',widthType: 'px'}">
				<hecheck v-model="heorderNumber" :confrimData="confrimData" v-if="hecheckDio"></hecheck>
			</jod-dragDialog>
			<!--大货入库-->
			<jod-dragDialog v-model="warehousDio" title="入库通知单" class="tableDialog"
				:dialogStyle="{width: '80',widthType: '%'}">
				<transition name="fade" mode="out-in">
					<warehouse v-model="orderNumber" v-if="warehousDio" @close="warehouseClose"></warehouse>
				</transition>
			</jod-dragDialog>
			<!--分配跟单员-->
			<jod-dragDialog v-model="distributionDio" title="跟单员分配" :dialogStyle="{width: '500',widthType: 'px'}"
				@closeDio="disDioClose">
				<jod-formSearch ref="distributionForm" :searchData="distributionData" :searchForm="distributionForm"
					:searchHandle="distributionHandle">
				</jod-formSearch>
			</jod-dragDialog>
		</template>
	</jod-tableList>
</template>

<script>
	import factoryList from '@/api/factory/factoryList.js'
	import fabricUp from './components/fabricUp.vue'
	import ingredientsUp from './components/ingredientsUp.vue'
	import processUp from './components/processUp.vue'
	import hanjianUp from './components/hanjian.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		loading
	} from '@/utils'
	import lianxidan from '../orderShop/components/lianxidanT.vue'
	import contarct from './components/contract.vue'
	import hecheck from './components/contracthan.vue'
	import warehouse from './components/warehouse.vue'
	export default {
		computed: {
			...mapGetters([
				'size',
				'token',
				'search'
			])
		},
		components: {
			'fabricUp': fabricUp,
			'ingredientsUp': ingredientsUp,
			'processUp': processUp,
			'hanjianUp': hanjianUp,
			'lianxianUp': lianxidan,
			'contarct': contarct,
			'hecheck': hecheck,
			'warehouse': warehouse
		},
		data() {
			return {
				orderNumbers: [],
				conDialog: false,
				conOrderNumber: '',
				orderRow: null, //用于合同函 行数据
				gridData: [], //源数据
				columns: [...factoryList.columns],
				options: {
					...factoryList.options
				},
				contractStateOptions: factoryList.contractStateOptions,
				stateOptions: factoryList.stateOptions,
				pagination: {
                    currentPage:1,
                    pageSize:10,
				},
				statetype: factoryList.statetype, //状态
				dataTotal: 0, //总条数
				multipleSelection: [], //勾选
				lianDialog: false,
				hezhu: [],
				selectionId: '',//发货选中的order
				selectValue:null,//发货数据
				//addLoading:false,//新增
				searchDialog: false, //搜索
				loading: null,
				//搜索
				searchData: {
					...factoryList.searchData
				},
				factoryListForm: [...factoryList.factoryListForm],
				hjdata: '',
				dgmc: '',
				factoryHandle: [{
					label: "搜索",
					type: "primary",
					loading: false,
					handle: res => {
						this.$refs['factoryListForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
                                this.pagination.currentPage =  1;
								this.factoryHandle[0].loading = true;
								let {
									daterange,
									...form
								} = {
									...this.searchData
								};
								this.$store.dispatch('user/setSearch', {
									daterange,
									...form
								});
								form = {
									...form,
                                    page: this.pagination.currentPage,
                                    limit:  this.pagination.pageSize,
									start: daterange[0],
									end: daterange[1]
								};
								this.getFactoryList(form);
								this.factoryHandle[0].loading = false;
								this.searchDialog = false;
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "重置",
					type: "warning",
					handle: res => {
						this.$refs['factoryListForm'].$refs['searchForm'].resetFields();
						this.searchData = {
							...factoryList.searchData
						};
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.searchDialog = false;
					},
					hide: false,
				}, ],
				//订单确认
				factoryId: null, //订单id
				confirmDialog: false, //确认
				delLoading: false, //删除
				confirmData: {
					...factoryList.confirmData
				},
				confirmForm: [...factoryList.confirmForm],
				confirmHandle: [{
					label: "确认",
					type: "primary",
					loading: false,
					handle: res => {
						this.$refs['confirmForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								console.log(this.confirmData)
								this.confirmHandle[0].loading = true;
								this.orderConfirm();
								//this.$refs['confirmForm'].$refs['searchForm'].resetFields();
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.confirmDialog = false;
						this.$refs['confirmForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}],
				//发起合同流程
				proUpDio: false,
				proLoading: false,
				//面料发货
				fabricUpDio: false,
				fabLoading: false,
				//辅料发货
				ingUpDio: false,
				ingLoading: false,
				//函件预览
				hanjianDio: false,
				hanjianLoading: false,
				orderNumber: null,
				//合同预览
				hecheckDio: false,
				confrimData: [],
				heorderNumber: null,
				signTime: '',
				//大货入库
				warehousDio: false,
				distributionDio: false, //跟单员
				distributionData: {
					personnel: ''
				},
				distributionForm: [{
					type: "Radio",
					label: "",
					border: true,
					labelWidth: "10px",
					bodyStyle: "width:400px",
					style: "margin:5px",
					prop: "personnel",
					radios: [{
						value: '1',
						label: '选项一'
					}, {
						value: '2',
						label: '选项二'
					}],
					rules: [{
						required: true,
						message: "请选择跟单员",
						trigger: "change"
					}]
				}],
				distributionHandle: [{
					label: "确认",
					type: "primary",
					loading: false,
					handle: res => {
						this.$refs['distributionForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								try {
									let newArr = this.multipleSelection.map(item => item.id)
									let form = {
										factoryOrderIdList: newArr,
										merchandiser: this.distributionData.personnel
									};
									console.log(form)
									factoryList.post(this.api.allot, form).then(resp=>{
										this.distributionDio = false;
										this.$message.success('分配成功')
										this.$refs.shopList.toggleSelection();
									})
								} catch (e) {
									console.log(e)
									this.distributionDio = false;
								}
							} else {
								console.log('error submit!!');
								return false;
							}
						});
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						this.distributionDio = false;
						this.$refs.shopList.toggleSelection();
					},
					hide: false,
				}]
			}
		},
		created() {
			// if(this.search!==null){
			// 	console.log('---',this.search)
			// 	this.searchData = this.search 
			// }
			this.loading = loading(document.getElementsByClassName('app-main')[0]);
			this.getDisList(); //跟单员
		},
		mounted() {
			console.log(this.searchData)
			let {
				daterange,
				...form
			} = {
				...this.searchData
			};
			form = {
				...form,
                page: this.pagination.currentPage,
                limit:  this.pagination.pageSize,
				start: daterange[0],
				end: daterange[1]
			};
			this.getFactoryList(form)
		},
		methods: {
			async orderConfirm() {
				try {
					let conForm = {
						id: this.factoryId,
						...this.confirmData
					}
					let response = await factoryList.put(this.api.confirmMoneyAndDate, conForm);
					this.$message.success(response.message)
					this.confirmDialog = false;
					this.confirmHandle[0].loading = false;

					let {
						daterange,
						...form
					} = {
						...this.searchData
					};
					form = {
						...form,
                        page: this.pagination.currentPage,
                        limit:  this.pagination.pageSize,
						start: daterange[0],
						end: daterange[1]
					};
					this.getFactoryList(form)
				} catch (e) {
					this.confirmHandle[0].loading = false;
					this.factoryConLoad = false;
					this.factoryConDis = false;
					this.$message.error(e)
				}
			},
			//确认
			// factoryConfirm(row){
			// 	this.confirmDialog = true;
			// 	this.factoryId = row.id;
			// 	if(!row.finishTime&&!row.money){
			// 		return
			// 	}
			// 	this.$nextTick(()=>{
			// 		this.confirmData['finishTime'] = row.finishTime;
			// 		this.confirmData['money'] = row.money
			// 	})
			// },
			//获取列表基础数据
			async getFactoryList(form) {
				try {
					let res = await factoryList.post(this.api.factoryOrder, form);
					let {
						data
					} = res;
					console.log(res)
					factoryList.get(this.api.orderList).then(res => {
						factoryList.getMeetingList(res).then(list => {
							this.factoryListForm[6].options = list;
						})
					}).catch(err => {
						this.searchLoading = false;
					})
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.loading.close();
				} catch (e) {
					this.loading.close();
				}
			},
			handleChangePage(value) {
				console.log(value)
				this.pagination['currentPage'] = value;
				let {
					daterange,
					...form
				} = {
					...this.searchData
				};
				form = {
					...form,
                    page: this.pagination.currentPage,
                    limit:  this.pagination.pageSize,
					start: daterange[0],
					end: daterange[1]
				};
				this.getFactoryList(form)
			},
			handleSizeChange(value) {
				console.log(value)
				this.pagination['currentPage'] = 1;
				this.pagination['pageSize'] = value;
				let {
					daterange,
					...form
				} = {
					...this.searchData
				};
				form = {
					...form,
                    page: this.pagination.currentPage,
                    limit:  this.pagination.pageSize,
					start: daterange[0],
					end: daterange[1]
				};
				this.getFactoryList(form)
			},
			handleSelectionChange(list) {
				this.multipleSelection = list;
			},
			queryFactory(row) {
				this.$router.push({
					path: '/factory/factoryShopList',
					query: {
						id: row.orderNumber
					}
				})
			},
			proUp(row) {
				this.dgmc = [row.name, row.orderNumber]
				console.log(this.dgmc)
				this.proUpDio = true;
			},
			hjUp(row) {
				console.log(row)
				this.orderNumber = row.orderNumber;
				this.orderRow = row;
				console.log(this.orderRow)
				this.hanjianDio = true
			},
			fabUp() {
				if (this.multipleSelection.length == 0) {
					this.$message.warning('请勾选所要发货的订单')
					return
				}
				var name = this.multipleSelection[0].name
				for (var i = 1; i < this.multipleSelection.length; i++) {
					if (name != this.multipleSelection[i].name) {
						this.$message.warning('只能选择相同工厂的订单')
						return
					}
				}
				this.loading = loading(document.getElementsByClassName('app-main')[0]);
				factoryList.getSelectId(this.multipleSelection).then(res => {
					this.selectionId = res;
					
					console.log(res)
					factoryList.get(this.api.fabricList, {
						orderNumberArray: res
					}).then(list => {
						if (list.code == 0) {
							this.loading.close();
							let arr = list.data;
							arr.forEach(item=>{
								item['updateBy'] = 0;
							})
							this.selectValue = arr;
							this.fabricUpDio = true;
						}
					}).catch(()=>{
						this.loading.close();
					})
				})
			},
			ingUp() {
				if (this.multipleSelection.length == 0) {
					this.$message.warning('请勾选所要发货的订单')
					return
				}
				var name = this.multipleSelection[0].name
				for (var i = 1; i < this.multipleSelection.length; i++) {
					if (name != this.multipleSelection[i].name) {
						this.$message.warning('只能选择相同工厂的订单')
						return
					}
				}
				this.loading = loading(document.getElementsByClassName('app-main')[0]);
				factoryList.getSelectId(this.multipleSelection).then(res => {
					this.selectionId = res;
					console.log(res)
					factoryList.get(this.api.ingredientsList, {
						orderNumberArray: res
					}).then(list => {
						if (list.code == 0) {
							let arr = list.data;
							arr.forEach(item=>{
								item['updateBy'] = 0;
							})
							this.loading.close();
							this.selectValue = arr;
							this.ingUpDio = true;
						}
					}).catch(()=>{
						this.loading.close();
					})
				})
			},
			//工作联系单
			lianxianup() {
				console.log(this.multipleSelection)
				this.beizhu = []
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.beizhu.push("工厂订单:" + this.multipleSelection[i].name + ";" + this.multipleSelection[i]
						.orderNumber)
				}
				this.lianDialog = true
			},
			lianClose(value) {
				this.lianDialog = false;
			},
			lianCloseDio(value) {
				this.lianDialog = value;
			},
			proClose(value) {
				console.log(0)
				let {
					daterange,
					...form
				} = {
					...this.searchData
				};
				form = {
					...form,
                    page: this.pagination.currentPage,
                    limit:  this.pagination.pageSize,
					start: daterange[0],
					end: daterange[1]
				};
				this.getFactoryList(form)
				this.proUpDio = false;
			},
			proCloseDio(value) {
				console.log(1)
				let {
					daterange,
					...form
				} = {
					...this.searchData
				};
				form = {
					...form,
                    page: this.pagination.currentPage,
                    limit:  this.pagination.pageSize,
					start: daterange[0],
					end: daterange[1]
				};
				this.getFactoryList(form)
				this.proUpDio = value;
			},
			// hecloseDio(value){
			// 	console.log(value)
			// 	let {delivery,daterange,...form} = {...this.searchData};
			// 	form = {...form,...this.pagination,start: daterange[0],end:daterange[1],deliverystart: delivery[0],deliveryend:delivery[1]};
			// 	this.getFactoryList(form)
			// 	this.hecheckDio = false;
			// },
			fabClose(value) {
				this.fabricUpDio = false
			},
			ingClose(value) {
				this.ingUpDio = false
			},
			conClose(value) {
				console.log(value)
				if (value[0]) {
					let {
						daterange,
						...form
					} = {
						...this.searchData
					};
					form = {
						...form,
                        page: this.pagination.currentPage,
                        limit:  this.pagination.pageSize,
						start: daterange[0],
						end: daterange[1]
					};
					this.getFactoryList(form)
				}
				this.conDialog = false;
			},
			hetong(row) {
				if (row.state >= 2) {
					this.$message.warning("合同已确定，不可重复修改")
				} else {
					this.orderRow = row;
					this.conOrderNumber = row.orderNumber;
					console.log(this.conOrderNumber)
					this.conDialog = true;
				}
			},
			confirmContact(row) {
				this.confrimData = []
				this.heorderNumber = row.orderNumber
				factoryList.get(this.api.getOrderContract, {
					orderNumber: row.orderNumber
				}).then(res => {
					this.confrimData = res.data;
					// this.confrimData[0]['signTime'] = this.signTime
					console.log('data', this.confirmData)
					this.hecheckDio = true
				}).catch(err => {

				})
			},
			notice(row) {
				if (row.state < 2) { // 过滤初步下单
					this.$message.warning('签订合同后才可以进行大货发货操作！');
					return;
				}
				this.warehousDio = true;
				this.orderNumber = row.orderNumber;
				console.log(row)
			},
			warehouseClose(value) {
				this.warehousDio = value
			},
			exportBOM() {
				this.orderNumbers = []
				if (this.multipleSelection.length == 0) {
					this.$message.warning('请勾选所导出的订单');
					return;
				}
				this.loading = loading(document.getElementsByClassName('qualityList')[0])
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.orderNumbers.push(this.multipleSelection[i].orderNumber)
				}
				let obj = {
					orderNumbersOrIds: this.orderNumbers.join(','),
					type: "1"
				}
				let url = process.env.VUE_APP_BASE_URL + this.api.exportBOM
				factoryList.upload(url, obj, this.token, true).then(response => {
					this.loading.close()
					if (!response) return;
					console.log(response)
					const {
						data,
						headers
					} = response
					const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
					const blob = new Blob([data], {
						type: 'application/vnd.ms-excel'
					})
					console.log(blob)
					const blobURL = window.URL.createObjectURL(blob)
					const tempLink = document.createElement('a')
					tempLink.download = decodeURI(fileName)
					tempLink.style.display = 'none'
					tempLink.href = blobURL
					document.body.appendChild(tempLink)
					tempLink.click()
					document.body.removeChild(tempLink)
					// 释放
					window.URL.revokeObjectURL(blobURL)
				});
			},
			//删除
			async delRow(row) {
				try {
					this.delLoading = true;
					let res = await factoryList.del(this.api.deleteFactoryOrder, row.id);
					console.log(res);
					let {
						daterange,
						...form
					} = {
						...this.searchData
					};
					form = {
						...form,
                        page: this.pagination.currentPage,
                        limit:  this.pagination.pageSize,
						start: daterange[0],
						end: daterange[1]
					};
					let list = await factoryList.post(this.api.factoryOrder, form);
					let {
						data
					} = list;
					this.gridData = data.records;
					this.dataTotal = data.total;
					this.delLoading = false;
					this.$message.success('删除成功')
				} catch (e) {
					console.log(e)
				}

			},
			async getDisList() {
				try {
					let resp = await factoryList.get(this.api.showMerchandiser)
					let {
						data
					} = resp;
					let list = await factoryList.listHandler(data);
					this.distributionForm[0].radios = list;
                    this.factoryListForm[3].options = list;
				} catch (e) {
					this.$message.warning('获取跟单员失败,加载默认跟单员')
					this.distributionForm[0].radios = [];
				}
			},
			async distribution() {
				try {
					if (this.multipleSelection.length == 0) {
						this.$message.warning('请勾选分配的订单');
						return;
					}
					this.distributionDio = true;
				} catch (e) {
					this.distributionDio = false;
					console.log(e)
				}

			},
			disDioClose() {
				this.$refs['distributionForm'].$refs['searchForm'].resetFields();
                let {
                    daterange,
                    ...form
                } = {
                    ...this.searchData
                };
                form = {
                    ...form,
                    page: this.pagination.currentPage,
                    limit:  this.pagination.pageSize,
                    start: daterange[0],
                    end: daterange[1]
                };
                this.getFactoryList(form)
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>

<!--
 * @FileDescription: 展开 尺码
 * @Author: wangpenghui
 -->
<template>
	<jod-tableList class="expandTable" :dataSource="dataSource" :columns="expandColumns" 
		:options="value&&value.length!==0&&!isUpdate?expandOptions:{tHeight:'150px'}">
		<template slot="orderVersion" slot-scope="{row,$index}">
			<span>{{row.orderVersion=='无'?'-':row.orderVersion}}</span>
		</template>
		
		<template :slot="expandColumns[index].label" v-for="(item,index) in expandColumns" slot-scope="{row,$index}">
			<div style="display: flex;justify-content: space-around;">
				<div>
					<el-input 
						v-if="row[item.prop]" 
						placeholder="数量" 
						size="mini" 
						type="Number" 
						class="textCenter" 
						:class="disabled?'colorA9':''"
						v-model="row[item.prop]&&row[item.prop].count" 
						:disabled="disabled||row[item.prop]&&row[item.prop].saveDisabled">
					</el-input>
					<span v-else>-</span>
				</div>
			</div>
		</template>
		
		<template v-slot:header_input>
			<transition name="fade" mode="out-in">
				<el-button v-if="disabled" plain :size="size" @click="disabled = !disabled">修改</el-button>
				<el-button v-else type="primary" :size="size" :loading="saveLoading" :disabled="saveDisabled" @click="save">保存</el-button>
			</transition>
		</template>
		<template slot="operate" slot-scope="{row,$index}">
			<span>-</span>
		</template>
	</jod-tableList>
</template>

<script>
	import orderData from '@/api/orderShop/orderShop.js'
	import {mapGetters} from 'vuex'
	export default {
		name: 'expandSize',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props: {
			value: {
				type: Array,
			},
			//是否开启修改按钮
			isUpdate:{
				type: Boolean,
				default:false
			}
		},
		created() {
			this.getList(this.value)
		},
		data() {
			return {
				expandColumns: [],
				dataSource: [],
				expandOptions: {
					tHeight: '150px',
					headerWidth: 150,
					headerInput: true,
				},
				disabled:true,//禁用
				saveLoading:false,
				saveDisabled:false
			}
		},
		methods: {
			async getList(list) {
				try {
					let newList = await this.expandList(list)
					this.expandColumns = newList[0];
					this.dataSource = newList[1]
				} catch (e) {
					this.$message.error(e)
				}

			},
			expandList(list) {
				return new Promise((res, rej) => {
					if (list && list.lengt !== 0) {
						let columns = [ {
							'label': '版型',
							'prop': 'orderVersion',
							'align': 'center',
							'slot': true,
							'width': 60
						},
							// {
                        //     'label': '尺码',
                        //     'prop': 'count',
                        //     'align': 'center',
                        //     'width': 60
                        // },
						];
						let version = []
						let sizeArr = []
						let newData = list.reduce((total, current) => {
							let { id, size, count, orderVersion } = current;
							let sizeIndex = -1;//记录尺码出现位置
							sizeArr.forEach((item, index) => {
								if (item.sizeIndex == size) {
									sizeIndex = index
								}
							})
							if(sizeIndex==-1){
								console.log('-------------',sizeIndex)
								sizeArr.push({
									'sizeIndex':size
								})
								total.push({
									'label': size+'',
									'prop': size+'',
									'align': 'center',
									'slot': true,
									'mWidth': 70
								})
							}
							let i = -1;//记录版型出现的位置
							version.forEach((item, index) => {
								if (item.orderVersion == orderVersion) {
									i = index
								}
							})
							
							if (i == -1) {
								
								let length = version.length;
								version.push({
									'count': '数量',
									'orderVersion': orderVersion
								})
								version[length][size] = {
									'id': id,
									'size':size,
									'count': count,
								}
							} else {
								version[i][size] = {
									'id': id,
									'size':size,
									'count': count,
								}
							}
							return total
						}, columns)
						// const set = new Set(version);
						// let newVersion = [...set];
						let arr = [newData, version]
						res(arr)
					} else {
						rej('数据为空')
					}
				})
			},
			formConfirm(list){
				return new Promise((res,rej)=>{
					this.value.forEach(item=>{
						list.forEach((total,index)=>{
							if(total.orderVersion==item.orderVersion&&total[item.size].size==item.size&&total[item.size].id==item.id){
								item.count = total[item.size].count;
							}
						})
					})
					res(this.value)
				})
			},
			async save() {
				try {
					this.saveLoading = true;
					this.saveDisabled = true;
					let list = await this.formConfirm(this.dataSource);
					orderData.put(this.api.category,list).then(res=>{
						this.saveLoading = false;
						this.saveDisabled = false;
						this.disabled = true;
						this.$message.success('修改成功');
						this.$emit('expandUpdate',true)
					}).catch(err=>{
						this.saveLoading = false;
						this.saveDisabled = false;
					})
				} catch (e) {
					this.$message.error(e)
				}
				
				// item.saveIcon = 'el-icon-loading';
				// item.saveDisabled = true;
				// let form = {
				// 	'id':item.id,
				// 	'count':Number(item.count),
				// 	'size':item.size,
				// }
				
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>

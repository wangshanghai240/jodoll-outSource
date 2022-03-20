<!--
 * @FileDescription: 新品控
 * @Author: wangpenghui
 -->
<template>
	<transition name="fade" mode="out-in">
		<div style="text-align: center;">
			<!-- 产前样批版 -->
			<div class="approval box">
				<el-row>
					<el-col :span="8">
						<h4>{{edition.createTime}}</h4>
					</el-col>
					<el-col :span="8">
						<h3>产前样批版</h3>
					</el-col>
					<el-col :span="8">
						<h4>{{edition.createBy}}</h4>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<h4>检查点</h4>
					</el-col>
					<el-col :span="6">
						<h4>结果</h4>
					</el-col>
					<el-col :span="6">
						<h4>备注</h4>
					</el-col>
					<el-col :span="6">
						<h4>图片</h4>
					</el-col>
				</el-row>
				<div v-for="item in edition.editionList">
					<el-row justify="center" style="margin-top: 5px;">
						<el-col :span="6"><div style="text-align: center;">{{item.label?item.label:'无'}}</div></el-col>
						<el-col :span="6">
							<div style="text-align: center;">
								<i :class="item.isPass?'el-icon-check':'el-icon-close'" style="font-size: 18px;"></i>
							</div>
						</el-col>
						<el-col :span="6"><div style="text-align: center;">{{item.remark?item.remark:'无'}}</div></el-col>
						<el-col :span="6" style="text-align: center;">
							<el-link target="_blank" v-if="item.image" @click="seeImage(item.image)">查看</el-link>
							<div v-else>无</div>
						</el-col>
					</el-row>
				</div>
			</div>
			<!-- 出库检 -->
			<template v-for="outStock in outStockList" v-if="outStockList&&outStockList.length!==0">
				<div class="approval box">
					<el-row>
						<el-col :span="8">
							<h4>{{outStock.createTime}}</h4>
						</el-col>
						<el-col :span="8">
							<h3>出库检</h3>
						</el-col>
						<el-col :span="8">
							<h4>{{outStock.createBy}}</h4>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<h4>检查点</h4>
						</el-col>
						<el-col :span="6">
							<h4>结果</h4>
						</el-col>
						<el-col :span="6">
							<h4>备注</h4>
						</el-col>
						<el-col :span="6">
							<h4>图片</h4>
						</el-col>
					</el-row>
					<div v-for="item in outStock.editionList">
						<el-row justify="center" style="margin-top: 5px;">
							<el-col :span="6"><div style="text-align: center;">{{item.label?item.label:'无'}}</div></el-col>
							<el-col :span="6">
								<div style="text-align: center;">
									<i :class="item.isPass?'el-icon-check':'el-icon-close'" style="font-size: 18px;"></i>
								</div>
							</el-col>
							<el-col :span="6"><div style="text-align: center;">{{item.remark?item.remark:'无'}}</div></el-col>
							<el-col :span="6" style="text-align: center;">
								<el-link target="_blank" v-if="item.image" @click="seeImage(item.image)">查看</el-link>
								<div v-else>无</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</template>
			<!-- 入库检 -->
			<template v-for="enterStock in enterStockList">
				<div class="approval box">
					<el-row>
						<el-col :span="8">
							<h4>{{enterStock.createTime}}</h4>
						</el-col>
						<el-col :span="8">
							<h3>入库检</h3>
						</el-col>
						<el-col :span="8">
							<h4>{{enterStock.createBy}}</h4>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<h4>检查点</h4>
						</el-col>
						<el-col :span="6">
							<h4>结果</h4>
						</el-col>
						<el-col :span="6">
							<h4>备注</h4>
						</el-col>
						<el-col :span="6">
							<h4>图片</h4>
						</el-col>
					</el-row>
					<div v-for="item in enterStock.editionList">
						<el-row justify="center" style="margin-top: 5px;">
							<el-col :span="6"><div style="text-align: center;">{{item.label?item.label:'无'}}</div></el-col>
							<el-col :span="6">
								<div style="text-align: center;">
									<i :class="item.isPass?'el-icon-check':'el-icon-close'" style="font-size: 18px;"></i>
								</div>
							</el-col>
							<el-col :span="6"><div style="text-align: center;">{{item.remark?item.remark:'无'}}</div></el-col>
							<el-col :span="6" style="text-align: center;">
								<el-link target="_blank" v-if="item.image" @click="seeImage(item.image)">查看</el-link>
								<div v-else>无</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</template>
			
			<jod-dragDialog v-model="picturesDialog" :dialogStyle="{width: '700',widthType: 'px'}" title="图片查看" :modal="false" class="detailLog">
				<viewer :images="pictures"><img :src="pictures" style="width: 100%;height: 100%;cursor:pointer;"></viewer>
			</jod-dragDialog>
		</div>
	</transition>
</template>

<script>
	import qualityLog from '@/api/controller/qualityLog.js'
	import {
		loading
	} from '@/utils'
	import {
		mapGetters
	} from 'vuex'
	import api from '@/api/index'
	export default {
		name: 'qualityLogList',
		computed: {
			...mapGetters([
				'size',
				'token'
			])
		},
		props: {
			value: {
				type: String
			}
		},
		data() {
			return {
				id:this.value,
				picturesDialog:false,
				pictures:[],//详情图片预览
				detailData:null,
				edition:{},//产前样
				outStockList:[],//出库检
				enterStockList:[],//入库检
			}
		},
		created() {
			qualityLog.get(this.api.edition,this.id).then(res=>{
				console.log(res.data)
				let b = (JSON.stringify(res.data) == "{}");
				if(!b){
					let {edition,outStock,enterStock} = res.data;
						this.edition = edition;
						this.outStockList = outStock;
						this.enterStockList = enterStock;
					
				}else{
					this.$message.error('暂无数据')
					this.$emit('bol',false)
				}
			}).catch(e=>{
				this.$emit('bol',false)
			})
		},
		mounted() {
			//this.getAllList();
		},
		methods: {
			async getAllList() {
				this.loading = loading(document.getElementsByClassName('qualityList')[0])
				let params = {
					goodsId: this.id,
					spmc: '',
					ghsmc: '',
					createBy: '',
					isPass: ''
				}
				let res = await this.getqualityLog(this.api.checkPage, params);
				let {
					data
				} = res;
				this.gridData = data.records ? data.records : data;
				this.loading.close()
				this.$message({
					message: '查询成功',
					type: 'success'
				});
			},
			getqualityLog(url, data) {
				return qualityLog.get(url, data)
			},
			//品控详情查看图片
			seeImage(url){
				this.picturesDialog = true;
				this.pictures = [url]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		margin-top: 30px;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, .3), 0 0 6px rgba(0, 0, 0, .1);
	}
	.approval{
		padding-bottom: 20px;
	}
</style>

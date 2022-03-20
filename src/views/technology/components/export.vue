<template>
	<div>
		<div id="gyd">
			<table cellspacing=0 cellpadding=0 border="1" style="width: 100%;">
				<tr>
					<th style="border-right-style: none;" :colspan="(standardline)+1">
						<span style="font-size: 25px;font-weight: 500;">乔顿服饰产品要求</span>
					</th>
					<th style="border-left-style: none;" colspan="3">
						<span style="font-size: 18px;font-weight: 500;padding-right: 10px;">供应商:{{supplier}}</span>
					</th>
				</tr>



				<tr>
					<td :rowspan="demandList.length+1" align="center" :colspan="lengthHandler()+1">
						<img v-if="image" :src="image" alt="image" :width="!collarif?'380':'250'"
							:height="!collarif?'420':'300'" />
						<span v-else></span>
					</td>
					<td style="height: 30px;font-size: 16px;background-color: #DCDCDC;" class="title" align="center"
						:colspan="lengthHandler2()">
						工艺要求
					</td>
				</tr>
				<tr v-for="(item,index) in demandList" :key="index">
					<td style="height: 30px;width: 65px;" align="center" colspan="1"><span>{{item.name}}</span></td>
					<td style="" :colspan="lengthHandler3()">{{item.demand}}</td>
				</tr>



				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">品名
					</td>
					<td style="" :colspan="lengthHandler()">{{tradeName}}</td>
					<td class="title" style="font-size: 16px;background-color: #DCDCDC;" align="center"
						:colspan="lengthHandler2()">修改内容</td>
				</tr>
				<tr>

					<td class="title" align="center" rowspan="1"
						style="width: 80px;height: 20px;font-size: 16px;background-color: #DCDCDC;">公司货号</td>
					<td style="height: 20px" :colspan="lengthHandler()">{{companyNo}}</td>
					<td :rowspan="collarrow" valign="top" :colspan="lengthHandler()">
						<span v-for="(item,index) in contentList" :key="index">
							<span style="display: block;">{{index+1}}.{{item.content}}</span>
						</span>
					</td>
					<td :rowspan="collarrow" align="center" :colspan="lengthHandler4()">
						<span v-for="(item,index) in contentList" :key="index">
							<img v-if="item.image" :src="item.image" alt="image" width="110" height="150" />
							<span v-else></span>
						</span>
					</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">
						厂家货号</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{factoryNo}}</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">系列
					</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{spectrum}}</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">版型
					</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{name}}</td>
				</tr>
				<tr v-if="!collarif">
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">领型
					</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{collar}}</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">
						参考成份</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{reference}}</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">
						执行标准</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{norm}}</td>
				</tr>
				<tr>
					<td class="title" align="center" style="font-size: 16px;height: 20px;background-color: #DCDCDC;">
						安全类别</td>
					<td style="width: 300px;" :colspan="lengthHandler()">{{securityType}}</td>
				</tr>
				<tr>
					<th class="title" :colspan="(standardline)+4" style="font-size: 16px;background-color: #DCDCDC;">
						规格要求</th>
				</tr>
				<tr>
					<td rowspan="2" class="title" align="center"
						style="width: 50px;height: 30px;background-color: #DCDCDC;">规格表</td>
					<td v-for="(item,index) in tecValue.standardList" :key="index" class="title" colspan="1"
						align="center" style="height: 15px;width: 50px;background-color: #DCDCDC;">
						{{item.size}}
					</td>
					<td class="title" rowspan="2" align="center" style="width: 40px;background-color: #DCDCDC;">档差</td>
					<td class="title" rowspan="2" align="center" style="width: 60px;background-color: #DCDCDC;">允许误差
					</td>
					<td class="title" rowspan="2" align="center" style="width: 150px;background-color: #DCDCDC;">测量方法
					</td>
				</tr>
				<tr>
					<td v-for="(item,index) in tecValue.standardList" :key="index" class="title" align="center"
						style="background-color: #DCDCDC;height: 15px;" colspan="1">
						{{item.series}}
					</td>
				</tr>

				<tr v-for="(item,index) in tecValue.standardTable" :key="item.id">
					<td class="title" style="height: 20px;width: 50px;background-color: #DCDCDC;" align="center">
						{{item.name}}
					</td>
					<td v-for="(items,index) in item.values" :key="index" style="height: 20px;width:50px" align="center"
						colspan="1">
						{{items.value}}
					</td>
					<td style="height: 20px;width: 40px;" align="center">
						{{item.difference}}
					</td>
					<td style="height: 20px;width: 60px;" align="center">
						{{(item.deviationMinus * -1)+'～'+item.deviationPositive}}
					</td>
					<td style="height: 20px;text-align: center;">
						{{item.measuring}}
					</td>
				</tr>
			</table>
			<div style="text-align: right;">打印日期:{{nowTime}}</div>
		</div>
		<div align="center">
			<el-button type="primary" style="width: 95px" @click="tes">
				导出
			</el-button>
		</div>
	</div>
</template>

<script>
	import json from '@/api/technology/tecList.js'
	import html2canvas from "html2canvas"
	import {
		loading
	} from '@/utils'
	import {
		urlTransformationObj
	} from '@/utils/validate.js'
	import {
		mapGetters
	} from 'vuex'
	export default {
		name: 'export',
		computed: {
			...mapGetters([
				'size',
			])
		},
		props: {
			value: {
				type: Array
			}
		},
		watch: {
			value(v) {
				console.log(v)
				this.ids = v;
			}
		},
		data() {
			return {
				options: [],
				nowTime: '',
				ids: this.value,
				contentList: [], //修改内容
				demandList: [], //工艺要求
				tecValue: [], //规格表
				name: '', //版型
				norm: '', //执行标准
				remark: '', //备注
				securityType: '', //安全类型
				companyNo: '', //公司货号
				factoryNo: '', //厂家货号
				spectrum: '', //系列
				tradeName: '', //品名
				reference: '', //参考成分
				supplier: '', //供应商
				collar: '', //领型
				collarif: true,
				collarrow: 7,
				image: '',
				standardline: 0,
				standardvalues: [],
				values: [],
				tableList: [],
				valuesList: [],
			}
		},
		created() {

		},
		mounted() {
			console.log(this.ids)
			this.getlist()
		},
		methods: {
			getlist() {
				if (this.ids[1] == 0) {
					json.get(this.api.getdetail, {
						id: this.ids[0]
					}).then(res => {
						console.log('res', res)
						this.contentList = res.data.reviseContentList
						if (res.data.requireDemandList.length < 10) {
							for (var i = 0; i < 10; i++) {
								this.demandList.push({
									craftRequireId: '',
									demand: '',
									id: '',
									name: ''
								})
							}
						} else {
							for (var i = 0; i < res.data.requireDemandList.length; i++) {
								this.demandList.push({
									craftRequireId: '',
									demand: '',
									id: '',
									name: ''
								})
							}
						}
						for (var j = 0; j < res.data.requireDemandList.length; j++) {
							this.demandList[j]['craftRequireId'] = res.data.requireDemandList[j].craftRequireId
							this.demandList[j]['demand'] = res.data.requireDemandList[j].demand
							this.demandList[j]['id'] = res.data.requireDemandList[j].id
						}
						this.getTime()
						var tecValues = res.data.partAndSeries
						for (var j = 0; j < tecValues.standardTable.length; j++) {
							this.valuesList = []
							var list = tecValues.standardTable[j].values
							var lists = []
							for (var i = 0; i < list.length; i++) {
								lists.push(list[i].standardId)
							}
							lists.sort((old, New) => {
								return old - New
							})
							console.log('lists', lists)
							for (var k = 0; k < lists.length; k++) {
								for (var n = 0; n < list.length; n++) {
									if (lists[k] == list[n].standardId) {
										this.valuesList.push(list[n])
									}
								}
							}
							console.log('valuesList', this.valuesList)
							tecValues.standardTable[j].values = this.valuesList
						}
						console.log('----', tecValues)
						this.tecValue = tecValues
						this.standardline = this.tecValue.standardList.length
						this.name = res.data.name
						this.norm = res.data.norm
						this.remark = res.data.remark
						this.companyNo = res.data.companyNo
						this.factoryNo = res.data.factoryNo
						this.spectrum = res.data.spectrum
						this.tradeName = res.data.tradeName
						this.reference = res.data.reference
						this.securityType = res.data.securityType
						this.supplier = res.data.supplier

						this.collar = res.data.collar
						if (this.tradeName&&this.tradeName.indexOf("衬衫") >= 0) {
							this.collarif = false
							this.collarrow = 8
						} else {
							this.collarif = true
							this.collarrow = 7
						}

						this.image = res.data.image
						for (var i = 0; i < this.standardline; i++) {
							this.values.push({
								standardId: this.tecValue.standardList[i].id,
								value: ''
							})
						}
						for (var j = 0; j < this.tecValue.standardTable.length; j++) {
							for (var k = 0; k < this.tecValue.standardTable[j].values.length; k++) {
								for (var l = 0; l < this.standardline; l++) {
									if (this.tecValue.standardTable[j].values[k].standardId == this.values[l]
										.standardId) {
										this.values[l].value = this.tecValue.standardTable[j].values[k].value
									}
								}
							}
							this.tableList[j] = {
								name: this.tecValue.standardTable[j].name,
								values: this.values
							}
						}
						console.log('tecValue', this.tecValue)
						console.log('tableList', this.tableList)
					})
				} else if (this.ids[1] == 1) {
					json.get(this.api.detailByGoods, {
						goodsId: this.ids[0]
					}).then(res => {
						console.log(res)
						this.contentList = res.data.reviseContentList
						if (res.data.requireDemandList.length < 10) {
							for (var i = 0; i < 10; i++) {
								this.demandList.push({
									craftRequireId: '',
									demand: '',
									id: '',
									name: ''
								})
							}
						} else {
							for (var i = 0; i < res.data.requireDemandList.length; i++) {
								this.demandList.push({
									craftRequireId: '',
									demand: '',
									id: '',
									name: ''
								})
							}
						}
						for (var j = 0; j < res.data.requireDemandList.length; j++) {
							this.demandList[j]['craftRequireId'] = res.data.requireDemandList[j].craftRequireId
							this.demandList[j]['demand'] = res.data.requireDemandList[j].demand
							this.demandList[j]['id'] = res.data.requireDemandList[j].id
						}
						this.getTime()
						var tecValues = res.data.partAndSeries
						for (var j = 0; j < tecValues.standardTable.length; j++) {
							this.valuesList = []
							var list = tecValues.standardTable[j].values
							var lists = []
							for (var i = 0; i < list.length; i++) {
								lists.push(list[i].standardId)
							}
							lists.sort((old, New) => {
								return old - New
							})
							console.log('lists', lists)
							for (var k = 0; k < lists.length; k++) {
								for (var n = 0; n < list.length; n++) {
									if (lists[k] == list[n].standardId) {
										this.valuesList.push(list[n])
									}
								}
							}
							console.log('valuesList', this.valuesList)
							tecValues.standardTable[j].values = this.valuesList
						}
						this.tecValue = tecValues
						this.standardline = this.tecValue.standardList.length
						this.name = res.data.name
						this.norm = res.data.norm
						this.remark = res.data.remark
						this.companyNo = res.data.companyNo
						this.factoryNo = res.data.factoryNo
						this.spectrum = res.data.spectrum
						this.tradeName = res.data.tradeName
						this.reference = res.data.reference
						this.securityType = res.data.securityType
						this.supplier = res.data.supplier
						this.collar = res.data.collar
						if (this.tradeName.indexOf("衬衫") >= 0) {
							this.collarif = false
							this.collarrow = 8
						} else {
							this.collarif = true
							this.collarrow = 7
						}
						this.image = res.data.image
						for (var i = 0; i < this.standardline; i++) {
							this.values.push({
								standardId: this.tecValue.standardList[i].id,
								value: ''
							})
						}
						for (var j = 0; j < this.tecValue.standardTable.length; j++) {
							for (var k = 0; k < this.tecValue.standardTable[j].values.length; k++) {
								for (var l = 0; l < this.standardline; l++) {
									if (this.tecValue.standardTable[j].values[k].standardId == this.values[l]
										.standardId) {
										this.values[l].value = this.tecValue.standardTable[j].values[k].value
									}
								}
							}
							this.tableList[j] = {
								name: this.tecValue.standardTable[j].name,
								values: this.values
							}
						}
					})
				}
			},
			getTime() {
				let yy = new Date().getFullYear();
				let mm = new Date().getMonth() + 1;
				let dd = new Date().getDate();
				this.nowTime = yy + '年' + mm + '月' + dd + '日'
				this.options = []
				var data = {
					search: {
						theme: '',
						isShow: ''
					}
				};
				data['current'] = 1
				data['size'] = 999
				json.get(this.api.getcraftRequire, data).then(res => {
					for (var i = 0; i < res.data.records.length; i++) {
						this.options.push({
							id: res.data.records[i].id,
							theme: res.data.records[i].theme
						})
					}
					for (var j = 0; j < this.options.length; j++) {
						for (var k = 0; k < this.demandList.length; k++) {
							if (this.demandList[k].craftRequireId == this.options[j].id) {
								this.demandList[k].name = this.options[j].theme
							}
						}
					}
					console.log(this.demandList)
				})
			},
			tes() {
				//方法1
				// // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
				// var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementById("gyd").outerHTML + "</body></html>";
				// // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
				// var blob = new Blob([html,html], {
				// 	type: "application/vnd.ms-excel"
				// });
				// const blobURL = window.URL.createObjectURL(blob)
				// const tempLink = document.createElement('a')
				// tempLink.download = decodeURI('工艺单.xlsx')
				// // tempLink.style.display = 'none'
				// tempLink.href = blobURL
				// document.body.appendChild(tempLink)
				// tempLink.click()
				// document.body.removeChild(tempLink)
				// // 释放
				// window.URL.revokeObjectURL(blobURL)

				//方法2
				let str = document.getElementById("gyd").outerHTML;
				let worksheet = '工艺单1'
				let worksheet2 = '测试名称002'
				let uri = 'data:application/vnd.ms-excel;base64,';
				let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
				  xmlns:x="urn:schemas-microsoft-com:office:excel"
				  xmlns="http://www.w3.org/TR/REC-html40">
				  <meta charset="utf-8">
				  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook>
				  <x:ExcelWorksheets>

				  <x:ExcelWorksheet>
				  <x:Name>${worksheet}</x:Name>
				  <x:WorksheetOptions><x:DisplayGridlines/>
				  </x:WorksheetOptions>
				  </x:ExcelWorksheet>

				  </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
				  </head><body>${str}</body></html>`;
				const tempLink = document.createElement('a')
				tempLink.download = decodeURI('工艺单.xlsx')
				tempLink.href = uri + this.base64(template)
				document.body.appendChild(tempLink)
				tempLink.click()
				document.body.removeChild(tempLink)
				
			},

			base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			},
			toBase64(imgUrl) {
				// 一定要设置为let，不然图片不显示
				const image = new Image();
				// 解决跨域问题
				image.setAttribute('crossOrigin', 'anonymous');
				const imageUrl =
					'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F2c.zol-img.com.cn%2Fproduct%2F124_500x2000%2F748%2FceZOdKgDAFsq2.jpg&refer=http%3A%2F%2F2c.zol-img.com.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1626925423&t=c66a82c56d181f7741d37e6a4786af4b';
				image.src = imageUrl
				// image.onload为异步加载
				image.onload = () => {
					var canvas = document.createElement('canvas');
					canvas.width = '200';
					canvas.height = '300';
					var context = canvas.getContext('2d');
					context.drawImage(image, 0, 0, 200, 300);
					var quality = 0.8;
					// 这里的dataurl就是base64类型  
					// 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
					const dataurl = canvas.toDataURL('image/jpeg', quality);
					console.log('--------------')
					console.log(dataurl);
					this.image = dataurl
				}
			},
			lengthHandler() {
				let sum = 0;
				if (this.standardline % 2 == 0) {
					sum = this.standardline / 2
				} else {
					sum = this.standardline / 2 + 1
				}
				return sum
			},
			lengthHandler2() {
				let sum = this.standardline / 2 + 3;
				return sum
			},
			lengthHandler3() {
				let sum = this.standardline / 2 + 2;
				return sum
			},
			lengthHandler4() {
				let sum = 0;
				if (this.standardline % 2 == 0) {
					sum = 3
				} else {
					sum = 2
				}
				return sum
			},
			modify() {
				let html = ''
				this.contentList.forEach(item => {
					html += item.content + '</br>'
				});
				console.log('-------------')
				return html
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		background-color: #DCDCDC;
	}

	.borderline {
		border: #000000 1px;
		border-style: solid;
	}
</style>

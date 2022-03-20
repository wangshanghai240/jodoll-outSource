<!--
 * @FileDescription: 高拓展表单
 * @Author: wangpenghui
 * @Date: 2020/11/12
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/22
 -->
<template>
	<div class="search_input">
		
		<el-form 
		 :size="size" 
		 inline 
		 :disabled="disabled"
		 :model="searchData" 
		 :rules="rules" 
		 ref="searchForm" 
		 :label-position="labelPosition"
		 :label-width="labelWidth">
			<el-form-item 
			 v-for="item in searchForm" 
			 :key="item.prop" 
			 :prop="item.prop"
			 :label-width="item.labelWidth"
			 >
			    <!--label-->
				<template slot="label" v-if="item.type&&!item.isShow">
					{{item.label}}
				</template>
				
				<!--文本-->
				<template v-if="item.type === 'Value'">
					<template v-if="item.options == null">
						<span style="display:inline-block;" :style="item.style">{{searchData[item.prop]}}</span>
					</template>
					<template v-else>
						<span style="display:inline-block;" :style="item.style">{{ filterMapsText(item.options,searchData[item.prop])}}</span>
					</template>
				</template>
				
				<!-- 输入框 -->
				
				<el-input 
				 v-if="item.type === 'Input'&&item.inputType!=='number'&&!item.isShow" 
				 class="form_input" 
				 :type="item.inputType"
				 :style="item.style"
				 :disabled="item.disabled"
				 :clearable="item.clearable"
				 v-model="searchData[item.prop]" 
				 @input="item.input?item.input(searchData[item.prop]):''"
				 :placeholder="item.placeholder">
					<template slot="append" v-if="item.icon">
						<span style="cursor: pointer;" @click="item.onClick"><i :class="item.icon"></i></span>
					</template>
				</el-input>
				
				<el-input
				 v-if="item.type === 'Input'&&item.inputType=='number'&&!item.isShow" 
				 class="form_input" 
				 type="number"
				 :style="item.style"
				 :disabled="item.disabled"
				 :clearable="item.clearable"
				 v-model.number="searchData[item.prop]" 
				 @input="item.input?item.input(searchData[item.prop]):''"
				 :placeholder="item.placeholder">
					<template slot="append" v-if="item.icon">
						<span style="cursor: pointer;" @click="item.onClick"><i :class="item.icon"></i></span>
					</template>
				</el-input>
				
				<textarea
				v-if="item.type === 'Text'"
				class="form_input" 
				:type="item.inputType"
				:style="item.style"
				:disabled="item.disabled"
				:clearable="item.clearable"
				v-model="searchData[item.prop]" 
				@input="item.input?item.input(searchData[item.prop]):''"
				:placeholder="item.placeholder">>
					
					
				</textarea>

				<!-- 密码框 -->
				<el-input 
				 v-if="item.type === 'password'" 
				 disabled 
				 :style="item.style"
				 v-model="searchData[item.prop]" 
				 :placeholder="item.placeholder"
				 auto-complete="off">
					<template slot="append">
						<span style="cursor: pointer;" @click="item.onClick"><i :class="item.icon"></i></span>
					</template>
				</el-input>

				<!-- 下拉框 -->
				<!-- $forceUpdate() 下拉刷新,修复数据改变下拉框不变的bug -->
				<el-select 
				 v-if="item.type === 'Select'&&!item.isShow" 
				 :style="item.style"
				 v-model="searchData[item.prop]" 
				 :clearable="item.clearable"
				 :filterable="item.filterable"
				 :multiple="item.multiple"
				 :collapse-tags="item.tags"
				 :remote="item.remote"
				 :remote-method="item.remoteMethod"
				 :loading="item.loading"
				 @change="item.change(searchData[item.prop])"
				 :placeholder="item.placeholder" 
				 @visible-change="$forceUpdate()">
					<el-option 
					 v-for="op in item.options" 
					 :label="op.label" 
					 :value="op.value"
					 :disabled="op.disabled"
					 :key="op.value">
						{{ op.label }}
					</el-option>
				</el-select>

				<!-- 单选 -->
				<el-radio-group 
				 :style="item.bodyStyle"
				 v-if="item.type === 'Radio'" 
				 v-model="searchData[item.prop]">
					<el-radio 
					 v-for="ra in item.radios" 
					 :border="item.border"
					 :style="item.style"
					 :label="ra.value" 
					 :key="ra.value">
						{{ ra.label }}
					</el-radio>
				</el-radio-group>

				<!-- 组合单选按钮 -->
				<el-radio-group 
				 v-if="item.type === 'RadioButton'" 
				 v-model="searchData[item.prop]" 
				 :fill="item.color"
				 @change="item.change && item.change(searchData[item.prop])">
					<el-radio-button 
					 v-for="ra in item.radios" 
					 :label="ra.value"
					 :key="ra.value">
						{{ ra.label }}
					</el-radio-button>
				</el-radio-group>

				<!-- 复选框 -->
				<el-checkbox-group 
				 v-if="item.type === 'Checkbox'" 
				 v-model="searchData[item.prop]">
					<el-checkbox
					 v-for="ch in item.checkboxs" 
					 :label="ch.value" 
					 :key="ch.value">
						{{ ch.label }}
					</el-checkbox>
				</el-checkbox-group>
				
				<!-- <div v-if="item.type === 'Checkbox'" >
					
					<div v-for="ch in item.checkboxs" >
						{{ ch.label }}
					</div>
				</div> -->

				<!-- 日期 -->
				<el-date-picker 
				 v-if="item.type === 'Date'" 
				 v-model="searchData[item.prop]" 
				 :picker-options="item.pickerOptions"
				 value-format="yyyy-MM-dd" 
				 :disabled="item.disabled"
				 :style="item.style"
				 @change="item.change(searchData[item.prop])"
				 :placeholder="item.placeholder">
				</el-date-picker>

				<!-- 时间 -->
				<el-time-select 
				 v-if="item.type === 'Time'" 
				 v-model="searchData[item.prop]">
				</el-time-select>

				<!-- 日期时间 -->
				<el-date-picker 
				 v-if="item.type === 'DateTime'" 
				 type="datetime" 
				 v-model="searchData[item.prop]" 
				 :placeholder="item.placeholder"
				 value-format="yyyy-MM-dd hh:mm:ss" 
				 :disabled="item.disabled && item.disabled(searchData[item.prop])" 
				 @change="item.change(searchData[item.prop])">
				</el-date-picker>
				
				
				<!-- 起止时间 -->
				<el-date-picker 
				 v-if="item.type === 'Daterange'" 
				 v-model="searchData[item.prop]" 
				 type="daterange" 
				 :style="item.style"
				 start-placeholder="开始日期"
				 end-placeholder="结束日期" 
				 value-format="yyyy-MM-dd" 
				 :picker-options="item.pickerOptions"
				 @change="item.change(searchData[item.prop])">
				</el-date-picker>
				<!-- 起止时间 - 双picker -->
				<template v-if="item.type === 'doubleDate'">
					<el-form-item prop="propStart">
						<el-date-picker
						 v-model="searchData[item.propStart]" 
						 value-format="yyyy-MM-dd" 
						 :picker-options="item.pickerBeginDateBefore"
						 @change="item.change(searchData[item.propStart])" 
						 :placeholder="item.placeholder">
						</el-date-picker>
					</el-form-item>
					<span> 到 </span>
					<el-form-item prop="propEnd">
						<el-date-picker
						 v-model="searchData[item.propEnd]" 
						 value-format="yyyy-MM-dd" 
						 :picker-options="item.pickerBeginDateAfter"
						 @change="item.change(searchData[item.propEnd])" 
						 :placeholder="item.placeholder">
						</el-date-picker>
					</el-form-item>
					
					
					
				</template>

				<!-- 滑块 -->
				<el-slider style="width: 100px;" v-if="item.type === 'Slider'" v-model="searchData[item.prop]">
				</el-slider>

				<!-- 开关 -->
				<el-switch v-if="item.type === 'Switch'" v-model="searchData[item.prop]">
				</el-switch>

				<!-- 三级联动 cascader -->
				<el-cascader 
				 v-if="item.type === 'cascader'" 
				 :options="item.props.options" 
				 v-model="searchData[item.prop]"
				 :placeholder="item.props.placeholder || '请选择'" 
				 :disabled="item.props.disabled || false" 
				 :props="item.props.defaultParams"
				 @change="item.change(searchData[item.prop], item)">
				</el-cascader>
				
				<!-- 图片上传 upload -->
				<!-- <el-upload
				 v-if="item.type === 'upload'" 
				 :action="item.upload" 
				 list-type="picture-card"
				 :file-list="searchData[item.prop]"
				 :on-preview="handlePictureCardPreview"
				 :on-success="UploadSuccess"
				 :on-remove="handleRemove">
					<i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog v-el-drag :visible.sync="dialogVisible">
					<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog> -->
				
				<el-upload
				  v-if="item.type === 'fileUpload'"
				  :action="item.upload"
				  :headers="item.headers"
				  :on-success="handleChange"
				  :before-remove="beforeRemove"
				  :limit="1"
				  :on-exceed="handleExceed"
				  :file-list="searchData[item.prop]">
				  <el-button :size="size" type="primary">点击上传</el-button>
				  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
				</el-upload>
				
			</el-form-item>
			<!--自定义-->
			<el-form-item :label="labelTitle" v-if="context">
				<slot name="form_context"></slot>
			</el-form-item>
			<!-- button 操作按钮 -->
			<el-form-item class="search_input_button center" v-if="isHandle">
				<el-button 
				 v-for="item in searchHandle" 
				 :key="item.label" 
				 :type="item.type" 
				 :loading="item.loading"
				 v-waves
				 @click="item.handle()">
					<template v-if="!item.hide">
						<span>{{ item.label }}</span>
					</template>

				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import waves from '@/directive/waves/index.js'
	import {mapGetters} from 'vuex'
	export default {
		name: 'formSearch',
		directives: {
		  waves
		},
		computed: {
			...mapGetters([
				'size',
			])
		},
		props: {
			isHandle: {
				type: Boolean,
				default: true
			},
			labelWidth: {
				type: String,
				default: "120px"
			},
			labelPosition:{
				type: String,
				default: 'right'
			},
			searchForm: {
				type: Array,
				default: () => []
			},
			searchHandle: {
				type: Array,
				default: () => []
			},
			searchData: {
				type: Object,
				default: () => {}
			},
			context: {
				type: Boolean,
				default: false
			},
			labelTitle: {
				type: String,
				default: '自定义'
			},
			disabled:{
				type: Boolean,
				default: false
			}
		},
		computed: {
			// 解析表单的正则验证
			rules() {
				let rules = this.searchForm.reduce((map, i) => {
					if (i.rules) {
						map[i.prop] = i.rules;
					}
					return map;
				}, {});
				console.log('解析表单',rules)
				return rules;
			}
		},
		watch: {
			// searchData(v){
			// 	this.value = v;
			// },
			value(v){
				console.log('serarchData',v)
				this.$emit("searchData",v)
			}
		},
		data(){
			return{
				value:this.searchData,
				dialogVisible:false,
				dialogImageUrl:'',
				size:this.size,
			}
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			// UploadSuccess(res, file, fileList){
			// 	this.value['upload'] = fileList
			// },
			// emptyFileList(){
			// 	this.value['upload'] = []
			// },
			handleChange(res, file, fileList){
				console.log(fileList)
				// let list = [{
				// 	fileName:fileList[0].name,
				// 	fileHttpPath:fileList[0].response.data.fileHttpPath
				// }]
				if(res.code==0){
					this.value['fileUpload'] = fileList
				}else{
					this.removeFileList();
					this.$message.error('图片上传失败')
				}
				//this.$set(this.value,'fileUpload',fileList)
			},
			removeFileList(){
				this.value['fileUpload'] = []
			},
			beforeRemove(file, fileList) {
				return new Promise((res,rej)=>{
					this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						this.value['fileUpload'] = [];
						this.$message({
						  type: 'success',
						  message: '删除成功!'
						});
						res(true)
					}).catch(() => {
						rej(false)
					});
				})
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件`);
			},
			filterMapsText(_data, _v) {
				let item = _data.find((o) => {
					return o.key == _v;
				});
				return item == null ? "" : item.value;
			},
		}
	}
</script>
<style lang="scss" scoped>
	.center{
		display: flex;
		justify-content: space-between;
		margin-bottom: 0px;
	}
</style>

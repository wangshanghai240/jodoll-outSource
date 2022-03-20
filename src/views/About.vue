<template>
	<jod-formSearch 
	 class="searchForm" 
	 labelWidth="120px" 
	 ref="searchForm" 
	 :searchData="searchData" 
	 :searchForm="searchForm"
	 :searchHandle="searchHandle">
	</jod-formSearch>
</template>

<script>
	import api from '@/api/index.js'
	import { getLocalTime } from '@/utils'
	export default {
		data() {
			let caseState = [{
					label: "男",
					value: 1
				},
				{
					label: "女",
					value: 2
				}
			];
			// let entrustProps = {
			// 	label: "label",
			// 	value: "value"
			// };
			let checkPhone = (rule, value, callback) => {
				if (!value) {
					return callback(new Error("手机号不能为空"));
				} else {
					const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
					if (reg.test(value)) {
						callback();
					} else {
						return callback(new Error("请输入正确的手机号"));
					}
				}
			};
			let pickerBeginDateBefore = {
				disabledDate: (time) => {
					return time.getTime() < Date.now() - 3600 * 1000 * 24
				}
			};
			let pickerBeginDateAfter = {
				disabledDate: (time) => {
					if (this.searchData['propStart'] != "") {
						return time.getTime() < Date.now() || time.getTime() < getLocalTime(this.searchData['propStart']);
					} else {
						return time.getTime() < Date.now()
					}
				}
			};
			let options = [{
				value: 'zhinan',
				label: '指南',
				disabled: true,
				children: [{
					value: 'shejiyuanze',
					label: '设计原则',
					children: [{
						value: 'yizhi',
						label: '一致'
					}, {
						value: 'fankui',
						label: '反馈'
					}, {
						value: 'xiaolv',
						label: '效率'
					}, {
						value: 'kekong',
						label: '可控'
					}]
				}, {
					value: 'daohang',
					label: '导航',
					children: [{
						value: 'cexiangdaohang',
						label: '侧向导航'
					}, {
						value: 'dingbudaohang',
						label: '顶部导航'
					}]
				}]
			}, {
				value: 'zujian',
				label: '组件',
				children: [{
					value: 'basic',
					label: 'Basic',
					children: [{
						value: 'layout',
						label: 'Layout 布局'
					}, {
						value: 'color',
						label: 'Color 色彩'
					}, {
						value: 'typography',
						label: 'Typography 字体'
					}, {
						value: 'icon',
						label: 'Icon 图标'
					}, {
						value: 'button',
						label: 'Button 按钮'
					}]
				}, {
					value: 'form',
					label: 'Form',
					children: [{
						value: 'radio',
						label: 'Radio 单选框'
					}, {
						value: 'checkbox',
						label: 'Checkbox 多选框'
					}, {
						value: 'input',
						label: 'Input 输入框'
					}, {
						value: 'input-number',
						label: 'InputNumber 计数器'
					}, {
						value: 'select',
						label: 'Select 选择器'
					}, {
						value: 'cascader',
						label: 'Cascader 级联选择器'
					}, {
						value: 'switch',
						label: 'Switch 开关'
					}, {
						value: 'slider',
						label: 'Slider 滑块'
					}, {
						value: 'time-picker',
						label: 'TimePicker 时间选择器'
					}, {
						value: 'date-picker',
						label: 'DatePicker 日期选择器'
					}, {
						value: 'datetime-picker',
						label: 'DateTimePicker 日期时间选择器'
					}, {
						value: 'upload',
						label: 'Upload 上传'
					}, {
						value: 'rate',
						label: 'Rate 评分'
					}, {
						value: 'form',
						label: 'Form 表单'
					}]
				}, {
					value: 'data',
					label: 'Data',
					children: [{
						value: 'table',
						label: 'Table 表格'
					}, {
						value: 'tag',
						label: 'Tag 标签'
					}, {
						value: 'progress',
						label: 'Progress 进度条'
					}, {
						value: 'tree',
						label: 'Tree 树形控件'
					}, {
						value: 'pagination',
						label: 'Pagination 分页'
					}, {
						value: 'badge',
						label: 'Badge 标记'
					}]
				}, {
					value: 'notice',
					label: 'Notice',
					children: [{
						value: 'alert',
						label: 'Alert 警告'
					}, {
						value: 'loading',
						label: 'Loading 加载'
					}, {
						value: 'message',
						label: 'Message 消息提示'
					}, {
						value: 'message-box',
						label: 'MessageBox 弹框'
					}, {
						value: 'notification',
						label: 'Notification 通知'
					}]
				}, {
					value: 'navigation',
					label: 'Navigation',
					children: [{
						value: 'menu',
						label: 'NavMenu 导航菜单'
					}, {
						value: 'tabs',
						label: 'Tabs 标签页'
					}, {
						value: 'breadcrumb',
						label: 'Breadcrumb 面包屑'
					}, {
						value: 'dropdown',
						label: 'Dropdown 下拉菜单'
					}, {
						value: 'steps',
						label: 'Steps 步骤条'
					}]
				}, {
					value: 'others',
					label: 'Others',
					children: [{
						value: 'dialog',
						label: 'Dialog 对话框'
					}, {
						value: 'tooltip',
						label: 'Tooltip 文字提示'
					}, {
						value: 'popover',
						label: 'Popover 弹出框'
					}, {
						value: 'card',
						label: 'Card 卡片'
					}, {
						value: 'carousel',
						label: 'Carousel 走马灯'
					}, {
						value: 'collapse',
						label: 'Collapse 折叠面板'
					}]
				}]
			}, {
				value: 'ziyuan',
				label: '资源',
				children: [{
					value: 'axure',
					label: 'Axure Components'
				}, {
					value: 'sketch',
					label: 'Sketch Templates'
				}, {
					value: 'jiaohu',
					label: '组件交互文档'
				}]
			}];
			return {
				// 如果数据要回显后不可编辑，使用JSON.parse(JSON.stringify())转换
				searchData: {
					name: '',
					phone: '',
					sex: '',
					companyId: '',
					password: '',
					radio: '',
					radioButton: '',
					checkbox: [],//必要
					date: '',
					time: '',
					dateTime: '',
					daterange: [],
					propStart:'',
					propEnd: '',
					slider: 0,
					switch: '',
					cascader: [],
					upload: [],//必要
				},
				api:api,
				searchForm: [{
					type: "Input",
					label: "人员姓名:",
					inputType:"number",//类型 可选
					prop: "name",
					width: "180px",
					placeholder: "请输入",
					disabled:true,
					clearable:true,
					// 表单验证
					rules: [{
						required: true,
						message: "请输入活动名称",
						trigger: "blur"
					}]
				}, {
					type: "Input",
					label: "手机号:",
					prop: "phone",
					width: "180px",
					placeholder: "请输入",
					rules: [{
						required: true,
						validator: checkPhone,
						trigger: "blur"
					}]
				}, {
					type: "Select",
					label: "下拉 (性别):",
					prop: "sex",
					// 渲染数组
					options: caseState,
					// 下拉转换
					//props: entrustProps,
					change: row => "",
					placeholder: "请选择性别",
					rules: [{
						required: true,
						message: "请选择性别",
						trigger: "change"
					}]
				}, {
					type: "Select",
					label: "下拉 (空):",
					prop: "companyId",
					options: [],
					//props: entrustProps,
					change: row => {
						this.changeNull(row);
					},
					placeholder: "请选择",
					rules: [{
						required: true,
						message: "请选择",
						trigger: "change"
					}]
				}, {
					type: "password",
					label: "密码:",
					prop: "password",
					icon: 'el-icon-more',
					onClick: res => {
						console.log(this.searchData)
					},
					width: "180px",
					placeholder: "请输入",
					rules: [{
						required: true,
						message: "请输入密码",
						trigger: "blur"
					}]

				}, {
					type: "Radio",
					label: "单选:",
					prop: "radio",
					radios: [{
						value: '1',
						label: '选项一'
					}, {
						value: '2',
						label: '选项二'
					}]
				}, {
					type: "RadioButton",
					label: "组合单选按钮:",
					prop: "radioButton",
					change: res => {
						console.log(res)
					},
					radios: [{
						value: '1',
						label: '选项一'
					}, {
						value: '2',
						label: '选项二'
					}]
				}, {
					type: "Checkbox",
					label: "复选框:",
					prop: "checkbox",
					checkboxs: [{
						value: '1',
						label: '选项一'
					}, {
						value: '2',
						label: '选项二'
					}]
				}, {
					type: "Date",
					label: "日期:",
					prop: "date",
					placeholder: "请选择日期",
					change: data => {
						console.log(data)
					}
				}, {
					type: "Time",
					label: "时间:",
					prop: "time"
				}, {
					type: "DateTime",
					label: "日期时间:",
					prop: "dateTime",
					placeholder: "请选择日期or时间",
					disable: res => {
						return true
					},
					change: time => {
						console.log(time)
					}
				}, {
					type: "Daterange",
					label: "起止时间:",
					prop: "daterange",
					change: res => {
						console.log(res)
					}
				}, {
					type: "doubleDate",
					label: "双picker:",
					propStart: "propStart",
					propEnd: "propEnd",
					pickerBeginDateBefore: pickerBeginDateBefore,
					pickerBeginDateAfter: pickerBeginDateAfter,
					placeholder: "选择时间段",
					change: res => {
						console.log(res)
					}
				}, {
					type: "Slider",
					label: "滑块:",
					prop: "slider"
				}, {
					type: "Switch",
					label: "开关:",
					prop: "switch"
				}, {
					type: "cascader",
					label: "三级联动:",
					prop: "cascader",
					props: {
						options: options,
						//disabled: true,
						defaultParams: {
							expandTrigger: 'hover'
						}
					},
					change: (val1,val2) => {
						console.log(val1,val2)
					}
				}, {
					type: "upload",
					label: "图片上传:",
					upload: api.upload,//api.upload
					prop: "upload",
					// props: {
					// 	dialogImageUrl: options,
					// 	//disabled: true,
					// 	defaultParams: {
					// 		expandTrigger: 'hover'
					// 	}
					// }
				}],
				searchHandle: [{
					label: "提交",
					type: "primary",
					handle: res => {
						this.$refs['searchForm'].$refs['searchForm'].validate((valid) => {
							if (valid) {
								alert('submit!');
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
						console.log(this.$refs['searchForm'].$refs['searchForm'])
						this.$refs['searchForm'].$refs['searchForm'].resetFields();
					},
					hide: false,
				}, {
					label: "取消",
					type: "info",
					handle: res => {
						console.log('执行取消');
					},
					hide: false,
				}],
				ruleForm: {}
			};
		},
		methods: {
			// 下拉选择
			changeNull(row) {},
		}
	}
</script>
<style lang="scss" scoped>
	.searchForm {
		padding-top: 20px;
		height: calc(100vh - 115px);
		background-color: #D3D3D3;
		overflow: scroll;
	}
</style>

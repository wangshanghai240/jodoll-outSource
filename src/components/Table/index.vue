<!--
 * @FileDescription: 高拓展表格
 * @Author: wangpenghui
 * @Date: 2020/11/12
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/19
 -->
<template>
	<div class="table_list_fix">
		<!-- 扩展性内容 -->
		<slot name="content_context"></slot>

		<!-- table中间button eg:导出 -->
		<div v-if="exportBut && exportBut.length > 0" class="btn-operates">
			<a :key="index" :href="item.href || null" @click="item.method()" v-for="(item, index) in exportBut">
				<el-button type="primary">{{item.title}}</el-button>
			</a>
		</div>
		<!-- table表格 -->
		<el-table size="small" v-bind="options" :border="border?false:true" :data="dataSource" v-loading="loading" v-on="tableEvents"
		 ref="multipleTable" style="width: 100%;" :style="fontSize" :header-cell-style="{ background: '#f6f2ee' }" 
		 :tree-props="{children: 'children', hasChildren: 'hasChildren'}" lazy :load="load" row-key="id" stripe
		 :show-summary="options && options.sunmmary" :summary-method="getSummaries" 
		 :default-sort = "{prop: 'createTime', order: 'descending'}"
		 @expand-change="expandChange" :expand-row-keys="expandArr" :default-expand-all="expandAll"
		 @selection-change="handleSelectionChange" @row-dblclick="rowDblclick" :height="options.tHeight ?options.tHeight:(options.offHeight?'':'400')" class="crmTable">
			<!-- 手风琴 -->
			<el-table-column type="expand" v-if="options && options.isExpand">
				<template slot-scope="{row,$index}" >
				  <slot name="expandForm" :row="row" :index="$index"></slot>
				</template>
			</el-table-column>
			<!-- 复选框 -->
			<el-table-column type="selection" style="width: 55px" align="center" v-if="options && options.selection && (!options.isShow || options.isShow()) " />
			<!-- 序列 -->
			<el-table-column width="60" align="center" type="index" v-if="options && options.index" :label="options && options.labelIndex" />
			<!-- 表格数据 -->
			<el-table-column align="center" width="150px" v-for="(column, index) in columns" :key="index" v-bind="column.props"
				:prop="column.prop" :label="column.label" :align="column.align" :width="column.width" :min-width="column.mWidth"
				v-if="options && !options.soltColumn" :resizable="true" :show-overflow-tooltip="!column.tooltip" :sortable="column.sortable">
				<!-- 自定义表头 -->
				<template slot="header">
					<slot name="header_prop" :row="column" :index="index"></slot>
				</template>
				
				<template slot-scope="{row,$index}">
				  <slot v-if="column.slot" :name="column.prop" :row="row" :index="$index" ></slot>
				  <template v-else>
					  <span>
						  {{row[column.prop]||row[column.prop]==0?row[column.prop]:'' || column.content}}
					  </span>
				  </template>
				</template>
			</el-table-column>
			<!-- 自定义 用于多表头重写column -->
			<template v-if="options && options.soltColumn">
				<slot name="column_prop" :row="columns"></slot>
			</template>
			
			<el-table-column align="center" :width="hWidth" v-if="options && options.headerInput"
			  :min-width="options && options.headerMinWidth" :fixed="options && options.isFixedOperateColumn">
				<template slot="header">
					<slot name="header_input"></slot>
				</template>
				<template slot-scope="{row,$index}" >
				  <slot name="operate" :row="row" :index="$index"></slot>
				</template>
			</el-table-column>
			
			<!-- 操作按钮 -->
			<el-table-column label="操作" align="center" v-bind="options && options.props" v-if="operates && operates.length > 0" >
				<template slot-scope="scope">
					<div class="operate-group">
						<template v-for="(btn, key) in operates">
							<span :key="key" v-if="!btn.isShow || (btn.isShow && btn.isShow(scope.row, scope.$index))">
								<el-button :size="btn.size || 'small'" :type="btn.type || `text`" :icon="btn.icon" :plain="btn.plain" :disabled="btn.disabled && btn.disabled(scope.row, scope.$index)"
								 @click.native.prevent="btn.method(scope.row, scope.$index)">{{ btn.label }}{{operates.length >= 2 ? '&nbsp;&nbsp;' : ''}}</el-button>
							</span>
						</template>
					</div>
				</template>
			</el-table-column>
		</el-table>
		
		<br />
		<!-- 分页部分 -->
		<el-pagination background class="pagination" v-if="pagination" :total="dataTotal" :current-page="pagination.currentPage"
		 :page-size="pagination.pageSize" @current-change="handleChangePage" @size-change="handleSizeChange"
		 :layout="layout" :page-sizes="[10, 20, 30,50, 100, 150]" />
	</div>
</template>

<script>
	import { mapGetters } from 'vuex'
	let methods = {
		// 复选框选中项
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.$emit("handleSelectionChange", Array.from(val));
		},
		toggleSelection(rows) {
			if (rows) {
			  rows.forEach(row => {
			    this.$refs.multipleTable.toggleRowSelection(row);
			  });
			} else {
			  this.$refs.multipleTable.clearSelection();
			}
		},
		rowDblclick(row) {
			this.$emit("rowDblclick", row);
		},
		//单元格合并
		arraySpanMethod({ row, column, rowIndex, columnIndex }){
			if (columnIndex === 0) {
				return {
				  rowspan: objectSpan.rowspan,
				  colspan: objectSpan.colspan
				};
			}
		},
		// 改变分页触发事件
		handleChangePage(val) {
			this.$emit("handleChangePage", val);
		},
		handleSizeChange(val) {
			this.$emit("handleSizeChange", val);
		},
		expandChange(row,expandedRows){
			this.$emit("expandChange", row ,expandedRows);
		},
		load(tree, treeNode, resolve){
			this.$emit('tLoad',resolve)
		},
		getSummaries(param){
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index)=>{
				if (index === 0) {
					sums[index] = '合计';
					return;
				}
				const values = data.map(item => Number(item[column.property]));
				if (!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr)=>{
						const value = Number(curr);
						if (!isNaN(value)) {
							return prev + curr;
						}else {
							return prev;
						}
					},0)
					//sums[index] += ' 元';
				}else{
					sums[index] = '--';
				}
			});
			return sums;
		}
	};

	export default {
		name: "tableList",
		props: {
			layout:{
				type:String,
				default:'total, sizes, prev, pager, next, jumper'
			},
			/**
			 * @type {Array} ['production', 'development'] true
			 * @description 数据数组
			 */
			dataSource: {
				type: Array,
				default: []
			},
			/**
			 * @type {Array} [{label,prop,align,width,props,render,formatter,newjump}] true
			 * @description 列的配置
			 * @param label {String} 列头显示文字 true
			 * @param prop {String} 列数据在数据项中对应的key false
			 * @param align {'left','right','center'} 列的对齐方式 'left' false
			 * @param width {String|Number} 列宽度 false
			 * @param props {Object} 列表参数拓展属性 Table-column Attributes见elemenet文档描述 false
			 * @param render {Function(h,record){}} 生成复杂数据的渲染函数(createElement,当前行数据) false
			 * @param formatter {Function(row,columns,index){}} 数据格式化 false
			 * @param newjump {Function(row,columns,index){}} url页面跳转 false
			 */
			columns: {
				type: Array,
				default: []
			},
			/**
			 * @type {Boolean} false
			 * @description 展示外边框和列边框
			 */
			border: {
				type: Boolean,
				default: false
			},
			/**
			 * @type {Boolean} false
			 * @description 加载遮罩层
			 */
			loading: {
				type: Boolean,
				default: false
			},
			/**
			 * @type {Array} [{label,type,icon,plain,isShow,disabled,method}] false
			 * @description 列表操作列对象描述
			 * @param label {String} 列文本显示 false
			 * @param type {String} button按钮类型 'text' false
			 * @param icon {String} 按钮icon图标 false
			 * @param plain {Boolean} 是否为朴素按钮 'false' false
			 * @param isShow {Function(row,index){}} 依据状态是否显示(当前行，当前索引) false
			 * @param disabled {Function(row,index){}} 是否禁用状态 false
			 * @param method {Function(row,index){}} event事件 false
			 */ 
			operates: {
				type: Array
			},
			/**
			 * @type {Number} dataTotal false
			 * @description 分页总条数
			 */
			dataTotal: {
				type: Number,
				default: 0
			},
			/**
			 * @type {Object} {currentPage,pageSize} false
			 * @description 分页
			 * @param currentPage {number} 当前页数 true
			 * @param pageSize {number[]} 每页显示个数选择器的选项设置 true
			 */
			pagination: {
				type: Object,
				default: null
			},
			/**
			 * @type {Array} [{title,href,method}] false
			 * @description 列表导出等对象操作描述
			 * @param title {String} 按钮文本显示 true
			 * @param href {String} 下载链接 false
			 * @param method {Function(){}} event事件 false
			 */
			exportBut: {
				type: Array
			},
			/**
			 * @type {Object} {label,width,index,selection,labelIndex,slotcontent,isFixedOperateColumn} false
			 * @description 列表复选框，序列号，操作列宽度，slot自定义操作按钮等
			 * @param label {String} 复选框文本显示 false
			 * @param width {Number} 操作按钮宽度 false
			 * @param index {Boolean} 序列号 'false' false
			 * @param selection {Boolean} 复选框显示 'false' false
			 * @param labelIndex {String} 序列号文本显示 false
			 * @param slotcontent {Boolean} 自定义操作 false
			 * @param slotname {String} 自定义操作列名称 false
			 * @param isExpand {Boolean} 是否开启表格手风琴模式 false 
			 * @param tHeight {Boolean} 表格高度设置 false
			 * @param offHeight {Boolean} 表格高度自适应 false
			 * @param headerInput {Boolean} 是否开启表操作列自定义 false
			 * @param headerWidth {String} 操作列自定义宽度
			 * @param sunmmary {Boolean} 是否开启合计列
			 * @param isSpan {Boolean} 是否合并单元格
			 * @param isFixedOperateColumn {String} 是否固定操作列 left right
			 * @param soltColumn {Boolean} 是否开启自定义 false
			 */
			options: Object,
			/**
			 * @type {Object} {handleChangePage,handleSelectionChange,toggleRowSelection} false
			 * @description table事件
			 * @param handleChangePage {Function(currentPage)} 页码改变的回调(改变后的页码及每页条数) false
			 * @param handleSelectionChange {Function(selection)} 当选择项发生变化时执行 false
			 * @param toggleRowSelection {Function(dom节点)} 当前选中项的回显.清空复选框事件
			 * 
			 * false
			 */
			tableEvents: Object,
			/**
			 * @type {Array} 
			 * @description 手风琴展开项
			 */
			expandArr: {
				type: Array,
				default: () => []
			},
			/**
			 * @type {Boolean} 
			 * @description 是否全部展开项
			 */
			expandAll: {
				type: Boolean,
				default:false
			},
			/**
			 * @type {Object} 
			 * @description 合并单元格
			 */
			objectSpan: {
				type:Object,
				default:()=>{}
			}
		},
		computed: {
			...mapGetters([
			  'size',
			])
		},
		data() {
			return {
				multipleSelection: [],
				fontSize:'font-size:18px',
				hWidth:'',
			};
		},
		created() {
			switch (this.size) {
				case 'medium':
					this.fontSize = 'font-size:18px!important';
					if(!this.options.headerMinWidth){
						this.hWidth = this.options.headerWidth?this.options.headerWidth:'235px';
					}
					
					//window.document.documentElement.setAttribute('data-size', 0)
					break;
				case 'small':
					this.fontSize = 'font-size:15px!important'
					if(!this.options.headerMinWidth){
						this.hWidth = this.options.headerWidth?this.options.headerWidth-45:'225px';
					}
					
					//window.document.documentElement.setAttribute('data-size', 1)
					break;
				case 'mini':
					this.fontSize = 'font-size:12px!important';
					if(!this.options.headerMinWidth){
						this.hWidth = this.options.headerWidth?this.options.headerWidth-45:'215px';
					}
					
					//window.document.documentElement.setAttribute('data-size', 2)
					break;
				default:
					this.fontSize = 'font-size:18px!important';
					if(!this.options.headerMinWidth){
						this.hWidth = this.options.headerWidth?this.options.headerWidth:'245px';
					}
					
					//window.document.documentElement.setAttribute('data-size', 1)
			}
		},
		methods,

		mounted() {
			this.$nextTick(() => {
				this.$emit("toggleRowSelection", this.$refs.multipleTable);
			});
		},

		components: {
			render: {
				functional: true,
				props: {
					row: Object,
					render: Function,
					index: Number,
					column: {
						type: Object,
						default: null
					}
				},
				render: (h, opt) => {
					const params = {
						row: opt.props.row,
						index: opt.props.index
					};
					if (opt.props.column) params.column = opt.props.column;
					return opt.props.render(h, params);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/.has-gutter tr th:last-child{
		background:#f6f2ee
	}
	// /deep/.el-scrollbar__wrap{
	// 	overflow-x: hidden;
	// }
	.table_list_fix {
		
		overflow: hidden;
		.btn-operates {
			
			margin: 16px 0px 16px 20px;

			a {
				color: #fff;
				margin-right: 10px;
				text-decoration: none;
				display: inline-block;
			}
		}
	}

	.table-header {
		padding-top: 10px;

		.table-header_button {
			text-align: right;
			float: right;
			margin-bottom: 12px;
			line-height: 40px;
		}
	}

	.newjump {
		text-decoration: none;
		color: dodgerblue;
	}

	.pagination {
		margin-bottom: 20px;
		text-align: center;
		// position: absolute;
		// bottom: 100px;
		// left: 40%;
	}
</style>

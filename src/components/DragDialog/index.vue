<!--
 * @FileDescription: 拖拽对话框
 * @Author: wangpenghui
 * @Date: 2020/11/9
 * @LastEditors: wangpenghui
 * @LastEditTime: 2021/1/21
 -->
<template>
	<el-dialog  v-if="!drag" v-el-drag :visible.sync="dialogTableVisible" :modal="modal" :width="style?style.width:''" :title="title"
		:top="top" @dragDialog="handleDrag" @close="closeDialog" :close-on-click-modal="modalClose">
		<slot name="title" slot="title"></slot>
		<slot></slot>
	</el-dialog>
	<el-dialog v-else :visible.sync="dialogTableVisible" :modal="modal" :width="style?style.width:''" :title="title"
		:top="top" @dragDialog="handleDrag" @close="closeDialog" :close-on-click-modal="modalClose">
		<slot name="title" slot="title"></slot>
		<slot></slot>
	</el-dialog>
</template>

<script>

	export default {
		name: 'dragDialog',
		props: {
			value: {
				type: Boolean,
				default: false
			},
			dialogStyle: {
				type: Object,
				default: ()=>{}
			},
			title:{
				type:String
			},
			modal:{
				type:Boolean,
				default: true
			},
			top:{
				type:String
			},
			modalClose:{
				type:Boolean,
				default:true
			},
			drag:{
				type:Boolean
			}
		},
		watch: {
			value(v) {
				this.$emit("input", v)
				this.dialogTableVisible = v;
			},
			dialogTableVisible(v) {
				if (!v) {
					setTimeout(()=>{
						this.$emit("input", v)
					},200)
				}
			}
		},
		data() {
			return {
				dialogTableVisible: this.dialog,
				style: {}
			}
		},
		created() {
			if(this.dialogStyle){
				//console.log(this.dialogStyle)
				let style = {
					width:this.dialogStyle.width+this.dialogStyle.widthType
				}
				this.style = style
			}
		},
		methods: {
			// v-el-drag-dialog onDrag callback function
			handleDrag() {
				//this.$refs.select.blur()
			},
			closeDialog() {
				this.dialogTableVisible = false;
				this.$emit("closeDio",false)
			},
		}
	}
</script>

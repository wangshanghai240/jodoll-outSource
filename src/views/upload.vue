<template>
	<div>
		<el-upload 
		 :action="api.upload" 
		 list-type="picture-card"
		 :file-list="filList"
		 :on-preview="handlePictureCardPreview"
		 :on-success="UploadSuccess"
		 :on-remove="handleRemove">
			<i class="el-icon-plus"></i>
		</el-upload>
		<el-dialog v-el-drag :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	import api from '@/api/index.js'
	export default {
		data() {
			return {
				api:api,
				dialogImageUrl: '',
				dialogVisible: false,
				filList:[]
			};
		},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			UploadSuccess(res, file, fileList){
				this.filList = fileList;
				console.log(fileList)
			}
		}
	}
</script>

<style scoped lang="scss">

</style>

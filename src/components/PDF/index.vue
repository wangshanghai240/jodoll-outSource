<template>
	<pdf ref="pdf" :src="url"></pdf>
</template>

<script>
	import pdf from 'vue-pdf'
	export default {
		name: "pdfs",
		components: {
			pdf
		},
		props:{
			value:{
				type:String
			}
		},
		watch:{
			value(url){
				this.getNumPages(url)
			}
		},
		data() {
			return {
				url: '',
				numPages: 1,
			}
		},
		methods: {
			getNumPages(url) {
				var loadingTask = pdf.createLoadingTask(url)
				loadingTask.then(pdf => {
					this.url = loadingTask
					this.numPages = pdf.numPages
				}).catch((err) => {
					console.error('pdf加载失败')
				})
			},
		}
	}
</script>

<style>
</style>

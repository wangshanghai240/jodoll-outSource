<template>
	<div class="print">
		<iframe style="display: none;"></iframe>
	</div>
</template>
<script>
	export default {
		name: "print",
		props: {
			html: {
				type: String,
				default: ""
			},
			repeat: {
				type: Boolean,
			}
		},
		watch: {
      		html(val) {
        		if (val) {
          			this.setBodyHtml(val);
          			setTimeout(()=>{
            			this.htmlRepeat = true
          			},1000)
        		}
      		},
      		repeat(val){
        		if(this.htmlRepeat){
          			this.setBodyHtml(this.html);
        		}
      		}
    	},
		data(){
			return{
        		htmlRepeat:false,
      		}
    	},
		methods: {
			setBodyHtml(html) {
				const document = window.document;
				//var iframe = document.getElementById("print-iframe");
				const iframe = window.frames[0];
				iframe.document.head.innerHTML = document.head.innerHTML;
				iframe.document.body.innerHTML = html;

				// 图片和样式加载完成
				Promise.all([this.loadStyle(), this.loadImage()]).then(res => {
					iframe.window.print();
				}).catch(rej=>{
					this.$message.error(rej);
				});
			},
			loadStyle() {
				const iframe = window.frames[0];
				const styles = iframe.document.head.getElementsByTagName("style"); // <style>
				const links = iframe.document.head.getElementsByTagName("link"); // <link>
				let arrs = [];
				arrs = arrs.concat(...styles, ...links);
				return new Promise((resolve, reject) => {
					let bt = false
					for (let i = 0; i < arrs.length; i++) {
						
						arrs[i].onload = function() {
              				if (i === arrs.length - 1) {
								bt = true
								console.log(bt)
                				resolve("style样式模块 加载完成");
              				}
						};
					}
					setTimeout(()=>{
						if(!bt){
							reject("style样式模块 加载失败");
						}
					},3000)
				});
			},
			loadImage() {
				const iframe = window.frames[0];
				const imgs = iframe.document.body.getElementsByTagName("img"); // <img>
				return new Promise((resolve, reject) => {
					if (imgs.length === 0) {
						reject("img模块 加载失败");
					} else {
						for (let i = 0; i < imgs.length; i++) {
							imgs[i].onload = function() {
								if (i === imgs.length - 1) {
									resolve("img模块 加载完成");
								}
							};
						}
					}
				});
			}
		}
	};
</script>

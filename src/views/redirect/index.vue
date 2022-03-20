<script>
	import {mapGetters} from 'vuex'
	export default {
		computed: {
			...mapGetters([
				'size',
			])
		},
		created() {
			const { params,query } = this.$route
			const { path } = params
			const docEl = document.getElementById('app')
			switch (this.size) {
				case 'medium':
					docEl.style = 'font-size:18px!important'
					//window.document.documentElement.setAttribute('data-size', 0)
					break;
				case 'small':
					docEl.style = 'font-size:15px!important'
					//window.document.documentElement.setAttribute('data-size', 1)
					break;
				case 'mini':
					docEl.style = 'font-size:12px!important'
					//window.document.documentElement.setAttribute('data-size', 2)
					break;
				default:
					docEl.style = 'font-size:18px!important'
					//window.document.documentElement.setAttribute('data-size', 1)
			}
			
			this.$router.replace({path: '/' + path,query})
		},
		render: function(h) {
			return h()
		}
	}
</script>

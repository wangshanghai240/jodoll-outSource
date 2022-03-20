<template>
	<jod-tableList :dataSource="gridData" :columns="columns" :options="options" :exportBut="exportBut"
	:operates="operates">
		<template slot-scope="data">
			{{data.data.name}}
		</template>
	</jod-tableList>
</template>

<script>
	import userData from '@/api/userController.js'
	export default{
		data(){
			return{
				columns:[...userData.columns],
				options: {...userData.options},
				exportBut:[...userData.exportBut],
				operates:[...userData.operates],
				gridData: [],
			}
		},
		created() {
			
		}
	}
</script>

<style>
</style>

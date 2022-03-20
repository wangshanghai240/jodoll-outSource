<!--
 * @FileDescription: 小日历
 * @Author: wangpenghui
 * @Date: 2020/11/7
 * @LastEditors: wangpenghui
 * @LastEditTime: 2020/11/12
 -->
<template>
	<div class="calendar">
		<p id="monthName"></p>
		<p id="dayName"></p>
		<p id="dayNumber"></p>
		<p id="year"></p>
	</div>
</template>

<script>
	export default {
		name:'calendar',
		mounted() {
			const lang = navigator.language;

			let date = new Date();

			let dayNumber = date.getDate();
			let month = date.getMonth();
			let dayName = date.toLocaleString(lang, {
				weekday: 'long'
			})
			let monthName = date.toLocaleString(lang, {
				month: 'long'
			})
			let year = date.getFullYear()
			document.getElementById('monthName').innerHTML = monthName;

			document.getElementById('dayName').innerHTML = dayName;

			document.getElementById('dayNumber').innerHTML = dayNumber;

			document.getElementById('year').innerHTML = year;
		}
	}
</script>

<style lang="scss" scoped>
	.calendar {
		margin: auto;
		width: 200px;
		background: #e8f4ff;
		text-align: center;
		border-radius: 8px!important;
		overflow: hidden;
	}

	.calendar #monthName {
		position: relative;
		margin: 0;
		padding: 5px 10px;
		background: #a3d3ff;
		color: #1890ff;
		font-size: 30px;
	}

	.calendar #dayName {
		margin: 20px;
		font-size: 20px;
		font-weight: 300;
		color: #1890ff;
	}

	.calendar #dayNumber {
		margin: 0;
		line-height: 1em;
		font-size: 80px;
		font-weight: 700;
		color: #1890ff;
	}

	.calendar #year {
		margin-bottom: 20px;
		font-size: 20px;
		font-weight: 700;
		color: #a3d3ff;
	}
</style>

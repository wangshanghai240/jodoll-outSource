<!--
 * @FileDescription: 右侧头部
 * @Author: wangpenghui
 * @Date: 2020/10/15
 * @LastEditors: wangpenghui
 * @LastEditTime: 2020/12/30
 -->
<template>
	<div class="navbar nvabarItem">
		<!-- <span style="line-height: 80px;font-size: 30px;color: red;float: left;width: 210px;text-align: center;"
			>JODOLL</span> -->
		<el-image style="float: left;width: 210px;text-align: center;height: 80px;"
			:src="logoImg" fit="cover"></el-image>
		<hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
			@toggleClick="toggleSideBar" />

		<breadcrumb id="breadcrumb-container" class="breadcrumb-container" />


		<div class="right-menu">
			
			<template v-if="device!=='mobile'">
				<!-- <search id="header-search" class="right-menu-item hover-effect" /> -->

				<!-- <el-tooltip content="捕捉" effect="dark" placement="bottom">
					<error-log class="errLog-container hover-effect" />
				</el-tooltip>
 -->
				<el-tooltip content="待办" effect="dark" placement="bottom">
					<NoticeCmp id="notice" class="notice-container"></NoticeCmp>
				</el-tooltip>

				<el-tooltip content="全屏" effect="dark" placement="bottom">
					<screenfull id="screenfull" class="right-menu-item hover-effect" />
				</el-tooltip>


				<el-tooltip content="全局大小" effect="dark" placement="bottom">
					<size-select id="size-select" class="right-menu-item hover-effect" />
				</el-tooltip>

				<el-tooltip content="语言" effect="dark" placement="bottom">
					<lang-select class="right-menu-item hover-effect" />
				</el-tooltip>


			</template>
			<!-- <div class="right-menu-item hover-effect">
			<i class="el-icon-notebook-2 "/>
		</div> -->

			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

				<div class="avatar-wrapper">
					<div class="avatar-name">{{name}}</div>
					<img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
						class="user-avatar">
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown">
					<router-link to="/profile/index">
						<el-dropdown-item>{{ $t('navbar.profile') }}</el-dropdown-item>
					</router-link>
					<router-link to="/">
						<el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
					</router-link>
					<!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>{{ $t('navbar.github') }}</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
					<el-dropdown-item divided @click.native="logout">
						<span style="display:block;">{{ $t('navbar.logOut') }}</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import Breadcrumb from '@/components/Breadcrumb'
	import Hamburger from '@/components/Hamburger'
	import ErrorLog from '@/components/ErrorLog'
	import Screenfull from '@/components/Screenfull'
	import SizeSelect from '@/components/SizeSelect'
	import LangSelect from '@/components/LangSelect'
	import Search from '@/components/HeaderSearch'
	import NoticeCmp from '@/components/Notice'
	import logo from '@/assets/navbarLogo.jpg'

	export default {
		components: {
			Breadcrumb,
			Hamburger,
			ErrorLog,
			Screenfull,
			SizeSelect,
			Search,
			LangSelect,
			NoticeCmp
		},
		computed: {
			...mapGetters([
				'sidebar',
				// 'avatar',
				'device',
				'name'
			])
		},
		data(){
			return{
				logoImg:logo
			}
		},
		methods: {
			toggleSideBar() {
				this.$store.dispatch('app/toggleSideBar')
			},
			async logout() {
				await this.$store.dispatch('user/logout')
				this.$router.push(`/login?redirect=${this.$route.fullPath}`)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar {
		height: 80px;
		overflow: hidden;
		position: relative;
		background: #fff;
		box-shadow: 0 1px 4px rgba(0, 21, 41, .08);


		.hamburger-container {
			line-height: 80px;
			height: 100%;
			float: left;
			cursor: pointer;
			transition: background .3s;
			-webkit-tap-highlight-color: transparent;

			&:hover {
				background: rgba(0, 0, 0, .025)
			}
		}

		.breadcrumb-container {
			float: left;
		}

		.errLog-container {
			display: inline-block;
			vertical-align: top;
		}
		
		.notice-container{
			display: inline-block;
			vertical-align: top;
			font-size: 20px;
			color: #5a5e66;
			
		}

		.right-menu {
			float: right;
			height: 100%;
			
			&:focus {
				outline: none;
			}

			.right-menu-item {
				line-height: 80px;
				display: inline-block;
				padding: 0 8px;
				height: 100%;
				font-size: 20px;
				color: #5a5e66;
				vertical-align: text-bottom;

				&.hover-effect {
					cursor: pointer;
					transition: background .3s;

					&:hover {
						background: rgba(0, 0, 0, .025)
					}
				}
			}

			.avatar-container {
				margin-right: 30px;

				.avatar-wrapper {
					display: flex;
					align-items: center;
					/*垂直居中*/
					justify-content: center;
					/*水平居中*/
					position: relative;

					.avatar-name {
						margin-right: 10px;
						font-size: 16px;
					}

					.user-avatar {
						cursor: pointer;
						width: 40px;
						height: 40px;
						border-radius: 10px;
					}

					.el-icon-caret-bottom {
						cursor: pointer;
						position: absolute;
						right: -20px;
						top: 45px;
						font-size: 12px;
					}
				}
			}
		}
	}
</style>

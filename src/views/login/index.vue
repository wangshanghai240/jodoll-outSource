<template>
	<div class="content">
		<div class="content_input">
			<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

				<div class="title-container">
					<h3 class="title">登陆</h3>
				</div>

				<el-form-item prop="username">
					<el-input ref="username" v-model="loginForm.username" placeholder="User name" name="username" type="text" tabindex="1"
					 autocomplete="on">
						<span slot="prefix" style="margin-left: 5px;">
							<svg-icon icon-class="user" />
						</span>
					</el-input>
				</el-form-item>

				<el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
					<el-form-item prop="password">
						<el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="Pass word"
						 name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false"
						 @keyup.enter.native="handleLogin">
							<span slot="prefix" style="margin-left: 5px;">
								<svg-icon icon-class="password" />
							</span>
							<span slot="suffix" style="margin-right: 10px;" @click="showPwd">
								<svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
							</span>
						</el-input>
					</el-form-item>
				</el-tooltip>

				<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;height: 40px;"
				 @click.native.prevent="handleLogin">Login</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
	import Ribbons from './js/ribbon.js'
	import {
		validUsername
	} from '@/utils/validate'
	export default {
		name: 'Login',
		data() {
			const validateUsername = (rule, value, callback) => {
				if (!validUsername(value)) {
					callback(new Error('账号不在配置名单，请联系管理员！'))
				} else {
					callback()
				}
			}
			const validatePassword = (rule, value, callback) => {
				if (value.length < 6) {
					callback(new Error('The password can not be less than 6 digits'))
				} else {
					callback()
				}
			}
			return {
				loginForm: {
					username: 'custom',
					password: '123456'
				},
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						// validator: validateUsername
					}],
					password: [{
						required: true,
						trigger: 'blur',
						// validator: validatePassword
					}]
				},
				passwordType: 'password',
				capsTooltip: false,
				loading: false,
				redirect: undefined,
				otherQuery: {},
				canvas:true
			}
		},
		watch: {
			$route: {
				handler: function(route) {
					const query = route.query
					if (query) {
						this.redirect = query.redirect
						this.otherQuery = this.getOtherQuery(query)
					}
				},
				immediate: true
			}
		},
		created() {
			// window.addEventListener('storage', this.afterQRScan)
			
			let b = document.getElementById('bgCanvas')
			//b.parentNode.removeChild(b);
			b.style["display"] = "block";
		},
		beforeDestroy() {
			//cancelAnimationFrame(this.animation)
			let b = document.getElementById('bgCanvas')
			//b.parentNode.removeChild(b);
			b.style["display"] = "none";
		},
		mounted() {
			if (this.loginForm.username === '') {
				this.$refs.username.focus()
			} else if (this.loginForm.password === '') {
				this.$refs.password.focus()
			}
		},
		destroyed() {
			// window.removeEventListener('storage', this.afterQRScan)
		},
		methods: {
			checkCapslock(e) {
				const {
					key
				} = e
				this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
			},
			showPwd() {
				if (this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = true
						
						this.$store.dispatch('user/login', this.loginForm)
							.then((res) => {
								//push()返回一个rejected Promise router 新版本报错问题res.access_token
								//this.$store.commit('app/SET_OUTCGTOKEN', res.access_token);
								this.$router.push({
									path: this.redirect || '/login',
									query: this.otherQuery
								}).catch((e)=>{})
								
								this.loading = false
							})
							.catch((e) => {
								console.log(e)
								this.loading = false
							})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			getOtherQuery(query) {
				return Object.keys(query).reduce((acc, cur) => {
					if (cur !== 'redirect') {
						acc[cur] = query[cur]
					}
					return acc
				}, {})
			}
			// afterQRScan() {
			//   if (e.key === 'x-admin-oauth-code') {
			//     const code = getQueryObject(e.newValue)
			//     const codeMap = {
			//       wechat: 'code',
			//       tencent: 'code'
			//     }
			//     const type = codeMap[this.auth_type]
			//     const codeName = code[type]
			//     if (codeName) {
			//       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
			//         this.$router.push({ path: this.redirect || '/' })
			//       })
			//     } else {
			//       alert('第三方登录失败')
			//     }
			//   }
			// }
		}
	}
</script>

<style lang="scss">
	/* 修复input 背景不协调 和光标变色 */
	/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

	$bg:#283443;
	$light_gray:#fff;
	$cursor: #fff;

	@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
		.login-container .el-input input {
			color: $cursor;
		}
	}

	/* reset element-ui css */
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;
				caret-color: $cursor;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: $cursor !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
	.content .el-form-item__error{
		color: #ff4949;
		font-size: 12px;
		line-height: 1;
		padding-top: 4px;
		position: absolute;
		top: 60%;
		left: 0;
	}
</style>

<style lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

	.login-container {
		min-height: 100%;
		width: 100%;
		background-color: $bg;
		overflow: hidden;

		.login-form {
			position: relative;
			width: 520px;
			max-width: 100%;
			padding: 160px 35px 0;
			margin: 0 auto;
			overflow: hidden;
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}


		.title-container {
			position: relative;

			.title {
				font-size: 26px;
				color: $light_gray;
				margin: 0px auto 40px auto;
				text-align: center;
				font-weight: bold;
			}
		}


		.thirdparty-button {
			position: absolute;
			right: 0;
			bottom: 6px;
		}

		@media only screen and (max-width: 470px) {
			.thirdparty-button {
				display: none;
			}
		}
	}

	@charset "utf-8";

	* {
		padding: 0;
		margin: 0;
	}

	.content {
		width: 500px;
		height: 300px;
		box-sizing: border-box;
		padding: 0 50px;
		border-radius: 5px;
		box-shadow: 0px 2px 12px 0px rgba(105, 105, 105, 0.07);
		background: rgba(255, 255, 255, 0.5);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: mymove 1s ease-in-out alternate;
		overflow: hidden;
		transition: 1.5s;
	}

	@keyframes mymove {
		0% {
			width: 0px;
			height: 5px;
		}

		10% {
			width: 50px;
			height: 5px;
		}

		15% {
			width: 100px;
			height: 5px;
		}

		20% {
			width: 150px;
			height: 5px;
		}

		25% {
			width: 200px;
			height: 5px;
		}

		30% {
			width: 250px;
			height: 5px;
		}

		35% {
			width: 300px;
			height: 5px;
		}

		40% {
			width: 350px;
			height: 5px;
		}

		45% {
			width: 450px;
			height: 5px;
		}

		50% {
			width: 500px;
			height: 5px;
		}

		55% {
			height: 30px;
		}

		60% {
			height: 60px;
		}

		65% {
			height: 90px;
		}

		70% {
			height: 120px;
		}

		75% {
			height: 150px;
		}

		80% {
			height: 180px;
		}

		85% {
			height: 210px;
		}

		90% {
			height: 240px;
		}

		95% {
			height: 240px;
		}

		100% {
			height: 300px;
		}
	}

	.content_input {
		width: 300px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

	}

	.content_button {
		margin-top: 10px;
	}

	.el-input {
		margin-bottom: 25px;
	}

	.title {
		text-align: center;
		font-size: 24px;
		margin-bottom: 30px;
		font-weight: bold;
		color: #606266;
	}

	.el-button--primary {
		width: 100%;

	}
</style>

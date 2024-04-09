<!-- 蓝色简洁登录页面 -->
<template>
	<view class="login-bg">
		<br /><br /><br /><br /><br /><br /><br />
		<view class="t-login">
      <navigator style="height: 100rpx;position: absolute;width: 100rpx;top: 0;left: 0;z-index: 99999;" url="/pages/login/rootip" open-type="redirect"></navigator>
      <form class="cl">
				<view class="t-a">
					<image src="http://124.71.39.108/static/images/user.png"></image>
					<input type="text" name="phone" placeholder="请输入用户名" maxlength="11" v-model="username" />
				</view>
				<view class="t-a">
					<image src="http://124.71.39.108/static/images/pwd.png"></image>
					<input type="password" name="code" maxlength="6" placeholder="请输入密码" v-model="passwd" />
				</view>
				<button @tap="handLogin">登 录</button>
				<view class="t-c">
					<view class="t-c-txt" @tap="toReg">注册账号</view>
				</view>
			</form>
			<!--  #ifdef MP-WEIXIN -->
			<view class="t-f"><text>—————— 其他登录方式 ——————</text></view>
			<view class="t-e cl" >
				<view class="t-g" @tap="getUserInfos"><image src="http://124.71.39.108/static/images/wx2.png"></image></view>
<!--				<view class="t-g" @tap="zfbLogin()"><image src="http://124.71.39.108/static/images/qq2.png"></image></view>
				<view class="t-g" @tap="zfbLogin()"><image src="http://124.71.39.108/static/images/wb.png"></image></view>-->
			</view>
			<!--  #endif -->
		</view>
		
	</view>
</template>
<script>	
	import { savej, listj, findj, fileUrl, serverUrl } from '@/common/config/api.js'
	import {mapState, mapActions} from 'vuex'
export default {
	data() {
		return {
			username: '', //用户名
			passwd: '', //密码
			serverUrl:serverUrl
		};
	},
	onLoad() {
		this.username = this.userInfo && this.userInfo.username
		this.passwd = this.userInfo && this.userInfo.passwd
		if(this.username && this.passwd){
			this.handLogin()
		}
	},
	methods: {
		...mapActions(['updateUserInfo', 'logout']),
			toReg() {
				uni.redirectTo({
					url: './register'
				})
			},
			getUserInfos(e) {
				console.log('getsuerer--------------------------------')
				uni.showLoading({
					title: '微信登录中...'
				});
				uni.getUserProfile({
					provider: 'weixin',
					desc: '获取用户信息已获取头信息昵称',
					lang: 'zh_CN',
					success: (e) => {
						console.log(e)
						this.wechatLogin()
					},
					fail(e2) {
						console.log(e2)
					},
					complete(e3) {
		
					}
				})
			},
			wechatLogin2(e) {
		
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						let code = loginRes.code;
						let cid = 'wx2106d56eae24772e'
						let sec = '0518f699152064d287f8c222a0619d50'
						this.code = code
						let url =
							`https://api.weixin.qq.com/sns/jscode2session?appid=${cid}&secret=${sec}&js_code=${code}&grant_type=authorization_code`;
						uni.request({
							url: url,
							success: (result) => {
								console.info("wechatLogin success")
								console.info(JSON.stringify(result))
								this.open_id = result.data.openid
								this.session_key = result.data.session_key
								console.info(`openid:${this.open_id} sesskey:${this.session_key}`)
								this.handLogin()
							}
						})
						console.log(code)
					}
				});
			},
		
			wechatLogin(e) {
		
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						let code = loginRes.code;
						uni.request({
							url: this.serverUrl+"wxlogin",
							data: {
								code
							},
							success: (res) => {
								if (res.statusCode == 200) {
									console.info("wechatLogin success")
									this.open_id = res.data.openid
									this.session_key = res.data.session_key
									console.info(
										`openid:${this.open_id} sesskey:${this.session_key}`)
									this.handLogin()
								}
								//console.info(res)
							}
						})
		
		
						/* let cid = 'wx2106d56eae24772e'
						let sec = '0518f699152064d287f8c222a0619d50'
						this.code = code
						let url =
							`https://api.weixin.qq.com/sns/jscode2session?appid=${cid}&secret=${sec}&js_code=${code}&grant_type=authorization_code`;
						uni.request({
							url: url,
							success: (result) => {
								console.info("wechatLogin success")
								console.info(JSON.stringify(result))
								this.open_id = result.data.openid
								this.session_key = result.data.session_key
								console.info(`openid:${this.open_id} sesskey:${this.session_key}`)
							}
						}) */
						console.log(code)
					}
				});
			},
			handLogin() {
				console.log('------------------>handLogin')
				uni.showLoading({
					title: '登录中...'
				});
				if (this.open_id) {
					console.log('------------------>handLogin:使用openid登录:' + this.open_id)
					findj({
						params: {
							table: 'user',
							openid: this.open_id
						}
					}).then(res => {
						uni.hideLoading()
						console.log("openid find " + res)
						if (res) {
							console.log("openid login success " + res)
							this.loginSuccess(res);
						} else {
							console.log("openid login add ")
							savej({
								params: {
									table: "user",
									openid: this.open_id,
									roletype: "2"
								}
							}).then(res => {
								console.log("openid login add success " + res)
								if (res) {
									let userobj = {}
									userobj.id = res
									userobj.openid = this.open_id
									this.loginSuccess(userobj);
								}
							}).catch(err => {
								uni.hideLoading()
							})
						}
		
					}).catch(err => {
						uni.hideLoading()
					})
				} else {
					console.log('------------------>handLogin:用户名密码登录:')
					if (this.username && this.passwd) {
						findj({
							params: {
								table: 'user',
								username: this.username,
								passwd: this.passwd
							}
						}).then(res => {
							uni.hideLoading()
							if (res) {
								this.loginSuccess(res)
							} else {
								uni.showToast({
                  icon:'error',
									title: '用户名密码错误!'
								})
							}
								
						}).catch(err => {
							console.log(err)
							uni.hideLoading()	
						})
					}else{
						uni.showToast({
							icon:'none',
							title: '请检查输入'
						})
					}
					
				}
		
			},
		loginSuccess(userobj) {
			uni.hideLoading()
			console.info(JSON.stringify(userobj))
			this.updateUserInfo(userobj)
			setTimeout(function(){
		      uni.ytool.toIndex()
			},500);
			
		}
	},
	computed: {
		...mapState(['userInfo'])
	}
};
</script>
<style>
.img-a {
	width: 100%;
	position: absolute;
	bottom: 0;
}
.login-bg {
	height: 100vh;
	padding-top: 300rpx;
	background-image: url(http://124.71.39.108/static/images/bg/bg9.png);
  background-size: 100% 100%;
}

.t-login {
	width: 700rpx;
	padding: 55rpx;
	margin: 0 auto;
	font-size: 28rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0 5px 7px 0 rgba(0, 0, 0, 0.15);
	z-index: 9;
}
.t-login button {
	font-size: 28rpx;
	background: linear-gradient(to right, #F1BB55, #E38A64);
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50rpx;
}

.t-login input {
	padding: 0 20rpx 0 120rpx;
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 50rpx;
	background: #f6f6f6;
	border: 1px solid #f6f6f6;
	font-size: 28rpx;
	border-radius: 50rpx;
}

.t-login .t-a {
	position: relative;
}

.t-login .t-a image {
	width: 40rpx;
	height: 40rpx;
	position: absolute;
	left: 40rpx;
	top: 28rpx;
}

.t-login .t-b {
	text-align: left;
	font-size: 46rpx;
	color: #000;
	padding: 300rpx 0 120rpx 0;
	font-weight: bold;
}

.t-login .t-d {
	text-align: center;
	color: #999;
	margin: 80rpx 0;
}

.t-login .t-c {
	text-align: right;
	color: #666666;
	margin: 30rpx 30rpx 40rpx 0;
}

.t-login .t-c .t-c-txt {
	text-align: center;
}

.t-login .t-e {
  display: flex;
  justify-content: center;
	text-align: center;
	width: 600rpx;
	margin: 40rpx auto 0;
}

.t-login .t-g {
	float: left;
	width: 33.33%;
}

.t-login .t-e image {
	width: 70rpx;
	height: 70rpx;
}

.t-login .t-f {
	text-align: center;
	margin: 80rpx 0 0 0;
	color: #999;
}

.t-login .t-f text {
	margin-left: 20rpx;
	color: #b9b9b9;
	font-size: 27rpx;
}

.t-login .uni-input-placeholder {
	color: #aeaeae;
}

.cl {
	zoom: 1;
}

.cl:after {
	clear: both;
	display: block;
	visibility: hidden;
	height: 0;
	content: '\20';
}
</style>

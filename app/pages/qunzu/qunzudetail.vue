<template>
	<view>
		<u-navbar title="团队详细" :border="true" :placeholder="true" @leftClick="goBack" :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<image style="width: 100%;" :src="fileUrl+fobj.img" mode="widthFix"></image>
<!--			<view class="u-demo-block">
				<text class="maintitle">群功能:</text>
				<u-scroll-list indicatorColor="#fff0f0" indicatorActiveColor="#f56c6c">
					<view class="scroll-list" style="flex-direction: row;">
						<view @click="toMenuPage(item.id)" class="scroll-list__goods-item"
							v-for="(item, index) in menulist" :key="index"
							:class="[(index === 9) && 'scroll-list__goods-item&#45;&#45;no-margin-right']">
							<image class="scroll-list__goods-item__image" :src="iconbaseurl + item.thumbnail" mode="">
							</image>
							<text class="scroll-list__goods-item__text">{{ item.title }}</text>
						</view>
					</view>
				</u-scroll-list>
			</view>-->
			<view class="formitem">
				<view>标题:{{fobj.title}}</view>
			</view>
			<view class="formitem">
				<view>创建者:{{fobj.username}}</view>
			</view>
      <view class="formitem">
        <view>费用分摊方式:{{fobj.ftype}}</view>
      </view>
      <view class="formitem">
        <view>人数:{{fobj.renshu}}</view>
      </view>
      <view class="formitem">
        <view>时间:{{fobj.sdate}}</view>
      </view>
      <view class="formitem">
        <view>经验水平:{{fobj.jlevel}}</view>
      </view>
<!--      <view class="formitem">
        <view @tap="toShopDetail" style="color: #3c9cff;">场地:{{fobj.stitle}}</view>
      </view>-->
			<view class="formitem">
				<u-parse :content="fobj.note" />
			</view>



			<!-- <view class="formitem">
				<view @click="toggleFav">
					<image :src="faviconurl" style="width: 60upx;height: 60upx;" mode="heightFix"></image>
					<text>{{this.fobj.favcount}}</text>
				</view>
			</view> -->

			<view class="hpaddingctn">
				<u-button @click="toChat()" text="群聊"></u-button>
			</view>

      <view class="formitem" style="display: flex;">
          <view style="padding: 20rpx;flex: 1;">
            <u-button @tap="toChat" type="warning" text="群聊"></u-button>
          </view>
          <view style="padding: 20rpx;flex: 1;">
            <u-button @tap="toQunUsers" type="error" text="团队成员"></u-button>
          </view>
      </view>

			<view class="hpaddingctn" v-if="userInfo.id == fobj.uid">
				<u-button type="primary" text="匹配队友" @click="toPipei" />
			</view>

			<view v-if="canjiaru" class="hpaddingctn">
				<u-button type="warning" text="申请加入" @click="popshow=true" />
			</view>
			<view class="hpaddingctn" v-if="fobj.uid == userInfo.id">
				<u-button type="success" text="申请列表" @click="toYzMessage" />
			</view>

      <!--
			<imglist rightName="username" :showSearch="false" :showArrow='false' :dataList='replaylist'
				titleName="ndate" sName='note'></imglist>


			<view class="hpaddingctn">
				<u--textarea v-model="rnote" placeholder="发表你的评论吧" confirmType="done"></u--textarea>
			</view>

			<view class="hpaddingctn">
				<u-button @click="replay()" text="评论"></u-button>
			</view>
			-->

			<u-popup :closeable="true" @close="popshow=false" :show="popshow" mode="bottom">
				<view class="dialogctn">
					<u--form>
						<view class="formitem">
							<view class="formlabel">申请加入:<text
									style="color: red;font-size: 40upx;">{{fobj.title}}</text></view>
						</view>
						<u-form-item borderBottom label-width="76" label="申请理由:" prop="sqnote">
							<u--textarea v-model="sqnote" placeholder="申请理由" confirmType="done"></u--textarea>
						</u-form-item>

						<view class="hpaddingctn">
							<u-button type="primary" text="提交申请" @click="saveYzmessage" />
						</view>
					</u--form>
				</view>
			</u-popup>

		</scroll-view>
	</view>
</template>

<script>
	import {
		savej,
		listj,
		findj,
		fileUrl
	} from '@/common/config/api.js';
	import {
		mapState,
		mapActions
	} from 'vuex';
	import {
		ideautil,
		yewuutil
	} from '@/common/commontools.js';

	export default {
		components: {},
		data() {
			return {
				id: null,
				canjiaru: true,
				fileUrl: fileUrl,
				favtext: "加入收藏",
				fobj: {},
				replaylist: [],
				rnote: '',
				pingfen: 0,
				favblur: 'http://124.71.39.108/static/images/icons/favblur.png',
				favfocus: 'http://124.71.39.108/static/images/icons/favfocus.png',
				faviconurl: '',
				iconbaseurl: 'http://124.71.39.108/static/images/icons2/',
				popshow: false,
				sqnote: '',
				menulist: [{
						title: '成员',
						thumbnail: 'kefu.png',
						id: 10
					},
					/*{
						title: '',
						thumbnail: 'daohang.png',
						id: 11
					},
					{
						title: '',
						thumbnail: 'liuyanban.png',
						id: 1
					}, {
						title: '',
						thumbnail: 'yun.png',
						id: 2
					},*/
					{
						title: '公告',
						thumbnail: 'biaoqian.png',
						id: 3
					},

					/*{
						title: '',
						thumbnail: 'renzheng.png',
						id: 4
					},*/
					{
						title: '相册',
						thumbnail: 'zhibo.png',
						id: 5
					}/*,
					{
						title: '',
						thumbnail: 'youhuiquan.png',
						id: 6
					}*/
				],
			};
		},
		onLoad(params) {
			this.id = params.id
			this.fobjDetail()
		},
		methods: {
			...mapActions(['setCar']),
			toYzMessage: yewuutil.toYzMessage,
			getHtmlNote: ideautil.getHtmlNote,
      toPipei(){
          uni.itool.nto({
              url:'/pages/qunzu/pipeifriends'
          })
      },
      toShopDetail(){
          uni.itool.nto({
              url:'/pages/shops/shopdetail?pid='+this.fobj.sid
          })
      },
			toMenuPage(id) {
				if (id == 10) {
					this.toQunUsers()
				} else if (id == 11) {
					this.toQiandao()
				} else {
					this.toPosts(id)
				}
			},
			fobjDetail() {
				findj({
					params: {
						table: 'qunzu',
						id: this.id
					}
				}).then(res => {
					res.note = uni.itool.getHtmlNote(res.note)
					this.fobj = res
					this.checkFavs()
					this.listReplay()
					if (this.fobj.uid == this.userInfo.id) {
						this.canjiaru = false
					}
					let uids = this.fobj.uids
					if (ideautil.checkStrInStr(this.userInfo.id, uids)) {
						this.canjiaru = false
					}

				}).catch(err => {

				})
			},
			toggleFav() {
				let myfavs = this.userInfo.favs
				let favcount = this.fobj.favcount || 0
				console.log("favs:" + myfavs)
				if (this.faviconurl == this.favblur) {
					if (myfavs && myfavs != '0') {
						myfavs += "," + this.fobj.id
					} else {
						myfavs = this.fobj.id + ""
					}
					favcount += 1
				} else {
					myfavs = ideautil.removeStrInStr(this.fobj.id, myfavs) || "0"
					favcount -= 1
				}
				this.fobj.favcount = favcount
				savej({
					params: {
						table: "user",
						favs: myfavs,
						id: this.userInfo.id
					}
				}).then(res => {
					this.userInfo.favs = myfavs
					this.checkFavs()
					savej({
						params: {
							table: "qunzu",
							id: this.fobj.id,
							favcount: this.fobj.favcount
						}
					}).then(res => {

					}).catch(err => {

					})
				}).catch(err => {

				})
			},
			checkFavs() {
				this.faviconurl = this.favblur
				let myfavs = this.userInfo.favs
				let isfav = ideautil.checkStrInStr(this.fobj.id + "", myfavs)
				if (isfav) {
					this.faviconurl = this.favfocus
				}
			},

			goBack() {
				uni.itool.nto({
					url: '/pages/qunzu/qunzu'
				})
			},
			toChat() {
        uni.ytool.toChatUni(this.fobj.id,2)
			},
			listReplay() {
				listj({
					params: {
						table: 'replay',
						pid: this.fobj.id,
						type: 2
					}
				}).then(res => {
					this.replaylist = res
				}).catch(err => {

				})
			},
			replay() {
				if (this.rnote) {
					let fdata = {
						table: "replay",
						pid: this.fobj.id,
						note: this.rnote,
						uid: this.userInfo.id,
						username: this.userInfo.username,
						type: 2
					}
					savej({
						params: fdata
					}).then(res => {
						this.listReplay()
						this.rnote = ""
					}).catch(err => {

					})
				}
			},
			toQunUsers() {
				uni.itool.nto({
					url: '/pages/qunzu/users?pid=' + this.fobj.id
				})
			},
			mgQunUser() {
				uni.itool.nto({
					url: '/pages/qunzu/qunusermg?pid=' + this.fobj.id
				})
			},
			toPosts(type) {
				type = type || 1
				console.log('/pages/qunzu/posts?type='+type+'&pid='+this.fobj.id)
				uni.itool.nto({
					url: '/pages/qunzu/posts?type='+type+'&pid='+this.fobj.id
				})
			},
			toQiandao() {
				uni.itool.nto({
					url: `/pages/qunzu/qiandao?pid=${this.fobj.id}`
				})
			},

			saveYzmessage() {
				let yzobj = {}
				yzobj.status = "待同意"
				yzobj.tid = this.fobj.uid
				yzobj.fid = this.userInfo.id
				yzobj.fuser = this.userInfo.username
				yzobj.img = this.userInfo.img
				yzobj.note = this.sqnote
				yzobj.table = "yzmessage"
				yzobj.title = "申请加入" + this.fobj.title
				yzobj.pid = this.fobj.id
				savej({
					params: yzobj
				}).then(res => {
					uni.showToast({
						icon: 'none',
						title: '提交成功等待审核!'
					})
					this.popshow = false
				}).catch(err => {

				})
			}
		},
		computed: {
			...mapState(['carlist', 'userInfo'])
		}
	}
</script>

<style lang="scss">
	.maintitle {
		margin-bottom: 40upx;
		margin-top: 40upx;
		display: block;
		font-size: 30upx;
		color: #8f9ca2;
	}

	.scroll-list {
		@include flex(column);

		&__goods-item {
			margin-right: 20px;
			text-align: center;

			&__image {
				width: 60px;
				height: 60px;
				border-radius: 4px;
			}

			&__text {
				color: #f56c6c;
				text-align: center;
				font-size: 14px;
				margin-top: 5px;
			}
		}

		&__show-more {
			background-color: #fff0f0;
			border-radius: 3px;
			padding: 3px 6px;
			@include flex(column);
			align-items: center;

			&__text {
				font-size: 12px;
				width: 12px;
				color: #f56c6c;
				line-height: 16px;
			}
		}

		&__line {
			@include flex;
			margin-top: 10px;

			&__item {
				margin-right: 15px;

				&__image {
					width: 61px;
					height: 48px;
				}

				&__text {
					margin-top: 5px;
					color: $u-content-color;
					font-size: 12px;
					text-align: center;
				}

				&--no-margin-right {
					margin-right: 0;
				}
			}
		}
	}
</style>

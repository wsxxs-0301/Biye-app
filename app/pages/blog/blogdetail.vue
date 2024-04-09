<template>
	<view>
		<u-navbar title="详情" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<image v-if="fobj.img" class="blockimg" :src="fileUrl+fobj.img" mode="widthFix"></image>
      <showfile :fileName="fobj.video"></showfile>
			<view class="formitem">
				<view class="gprice">标题:{{fobj.title}}</view>
			</view>
			<!--<view class="formitem" @tap="toCall">
				<view class="gtitle">联系电话:{{fobj.tel}}</view>
			</view>-->
			<view class="formitem">
				<u-parse :content="fobj.note" />
			</view>
			
			<view class="formitem" style="display: flex;">
				<view @click="toggleFav">
					<image :src="faviconurl" style="width: 60upx;height: 60upx;" mode="heightFix"></image>
					<text>{{fobj.favcount}}</text>
				</view>

				<view @click="zan" style="margin-left: 20rpx">
					<image :src="zaniconurl" style="width: 60upx;height: 60upx;" mode="heightFix"></image>
					<text>{{fobj.zan}}</text>
				</view>
			</view>
			
<!--			<view class="hpaddingctn">
				<u-button @click="userDetail" text="私信"></u-button>
			</view>-->
      <view class="formitem" style="display: flex;">
          <view style="padding: 20rpx;flex: 1;">
            <u-button @tap="userDetail" type="warning" text="私信"></u-button>
          </view>
          <view style="padding: 20rpx;flex: 1;">
            <u-button @tap="toQunzu" type="error" text="关联团队"></u-button>
          </view>
      </view>
<!--			<view class="formitem">
			    <u-button type="primary" @click="toPlay" text="看文章"></u-button>
			</view>-->
			<imglist imgSize="20" tName="username" :showSearch="false" :showArrow='false' :dataList='replaylist' titleName="ndate" sName='note'></imglist>
		
		
			<view class="hpaddingctn">
				<u--textarea v-model="rnote" placeholder="发表你的评论吧" confirmType="done"></u--textarea>
			</view>
			
			<view class="hpaddingctn">
				<u-button @click="replay()" text="评论"></u-button>
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	import { savej, listj, findj, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	import { ideautil, yewuutil } from '@/common/commontools.js';

	export default {
		components:{},
		data() {
			return {
				id: null,
				fileUrl: fileUrl,
				favtext: "加入收藏",
				fobj: {
          zan:0
        },
				replaylist: [],
				rnote: '',
				pingfen:0,
				favblur:'http://124.71.39.108/static/images/icons/favblur.png',
				favfocus:'http://124.71.39.108/static/images/icons/favfocus.png',
				zanurl:'http://124.71.39.108/static/images/icons2/zan.png',
				zanfocus:'http://124.71.39.108/static/images/icons2/zan2.png',
				faviconurl:'',
				zaniconurl:'',
				zanflag:false
			};
		},
		onLoad(params) {
			this.id = params.id
			this.fobjDetail()
		},
		onShow(){
			findj({params: {table: 'zan', uid:this.userInfo.id, pid:this.fobj.id}}).then(res => {
				if(!res){
					this.zaniconurl = this.zanurl
					this.zanflag = true
				}else{
					this.zaniconurl = this.zanfocus
					this.zanflag = false
				}
			})
		},
		methods: {
			...mapActions(['setCar']),
			toBlog: yewuutil.toBlog,
      toQunzu(){
          uni.itool.nto({
              url:'/pages/qunzu/qunzudetail?id='+this.fobj.qid
          })
      },
			toPlay(){
				uni.itool.nto({
					url: '/pages/blog/play?pid='+this.fobj.id
				})
			},
			toCall(){
				uni.itool.call(this.fobj.tel)
			},
			fobjDetail() {
				findj({params: {table: 'blog', id: this.id}}).then(res => {
          res.zan = res.zan || 0
					this.fobj = res
					this.fobj.note = ideautil.getHtmlNote(res.note)
					this.checkFavs()
					this.listReplay()
					this.putHistory()
				}).catch(err => {
					
				})
			},
			toggleFav() {
				let myfavs = this.userInfo.favs
				let favcount = this.fobj.favcount || 0
				console.log("favs:"+myfavs)
				if (this.faviconurl == this.favblur) {
					if (myfavs && myfavs != '0') {
						myfavs += ","+this.fobj.id
					}else{
						myfavs = this.fobj.id+""
					}
					favcount += 1
				}else {
					myfavs = ideautil.removeStrInStr(this.fobj.id, myfavs) || "0"
					favcount -= 1
				}
				this.fobj.favcount = favcount
				savej({ params: { table: "user", favs: myfavs, id: this.userInfo.id } }).then(res => {
					this.userInfo.favs = myfavs
					this.checkFavs()
					savej({params: {table: "blog",id: this.fobj.id, favcount: this.fobj.favcount }}).then(res => {
						
					}).catch(err => {
					 
					})
				}).catch(err => {
					
				})
			},

      zan() {
        if (this.zanflag) {
          this.fobj.zan = this.fobj.zan || 0
          this.fobj.zan = this.fobj.zan*1+1
          savej({params: {table: "blog",id: this.fobj.id, zan: this.fobj.zan }}).then(res => {
            savej({params: {table:'zan',pid:this.fobj.id,uid:this.userInfo.id}}).then(res => {
              this.zanflag = false
              this.zaniconurl = this.zanfocus
            })
          })
        }else{
          uni.showToast({
            icon:'none',
            title: '已点赞'
          })
        }
      },
			checkFavs() {
				this.faviconurl = this.favblur
				let myfavs = this.userInfo.favs
				let isfav = ideautil.checkStrInStr(this.fobj.id+"",myfavs)
				if (isfav) {
					this.faviconurl = this.favfocus
				}
			},
      userDetail() {
        uni.itool.nto({
          url: '/pages/qunzu/userdetail?id=' + this.fobj.uid
        })
      },
			goBack(){
				uni.itool.nto({
					url: '/pages/index/index'
				})
			},
			toChat(){
				ideautil.toChatUni(this.fobj.uid)
			},
			listReplay(){
				listj({params: {table: 'replay', pid: this.fobj.id, type: 2}}).then(res => {
					this.replaylist = res
				}).catch(err => {
				 
				})
			},
			replay(){
				if (!this.userInfo || !this.userInfo.id) {
					uni.ytool.toLogin()
					return
				}
				if(this.rnote){
					let fdata = {
						table:"replay",
						pid: this.fobj.id,
						note: this.rnote,
						uid: this.userInfo.id,
						username: this.userInfo.username,
						type: 2
					}
					savej({params: fdata}).then(res => {
						this.listReplay()
						this.rnote = ""
					}).catch(err => {
					 
					})
				}
			},
			putHistory(){
				let id = this.fobj.id
				let hgids = uni.getStorageSync("his_ids")
				if(hgids){
					let flag = ideautil.checkStrInStr(id,hgids)
					if (!flag) {
						hgids += ","+id
					}
				}else{
					hgids = id
				}
				uni.setStorageSync("his_ids",hgids)
			},
		},
		computed: {
			...mapState(['carlist', 'userInfo'])
		}
	}
</script>

<style lang="scss">
	
</style>

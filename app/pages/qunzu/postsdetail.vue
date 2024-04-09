<template>
	<view>
		<u-navbar title="详细信息" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<image v-if="fobj.img" style="width: 100%;" :src="fileUrl+fobj.img" mode="widthFix"></image>
			<view class="formitem">
				<view class="gprice">标题:{{fobj.title}}</view>
			</view>
			<view class="formitem">
				<view class="gtitle">发布者:{{fobj.username}}</view>
			</view>
			<view v-if="fobj.type==2" class="formitem">
				<view class="gtitle">团队时间:{{fobj.sdate}}</view>
			</view>
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
				<u-button @click="toChat()" text="私信"></u-button>
			</view>
			
			<view v-if="userInfo.id == fobj.uid" class="hpaddingctn">
				<u-button type="error" text="删除" @click="delObj" />
			</view>
			
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
	import { deletej, savej, listj, findj, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	import { ideautil, yewuutil } from '@/common/commontools.js';

	export default {
		components:{  },
		data() {
			return {
				id: null,
				fileUrl: fileUrl,
				favtext: "加入收藏",
				fobj: {},
				replaylist: [],
				rnote: '',
				pingfen:0,
				favblur:'http://124.71.39.108/static/images/icons/favblur.png',
				favfocus:'http://124.71.39.108/static/images/icons/favfocus.png',
				faviconurl:'',
				pid:null
			};
		},
		onLoad(params) {
			this.id = params.id
			this.pid = params.pid
			this.fobjDetail()
		},
		methods: {
			...mapActions(['setCar']),
			fobjDetail() {
				findj({params: {table: 'posts', id: this.id}}).then(res => {
					this.fobj = res
					this.checkFavs()
					this.listReplay()
				}).catch(err => {
					
				})
			},
			delObj(){
				deletej({params: {table: 'posts', id: this.fobj.id}}).then(res => {
					this.goBack()
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
					savej({params: {table: "posts",id: this.fobj.id, favcount: this.fobj.favcount }}).then(res => {
						
					}).catch(err => {
					 
					})
				}).catch(err => {
					
				})
			},
			checkFavs() {
				this.faviconurl = this.favblur
				let myfavs = this.userInfo.favs
				let isfav = ideautil.checkStrInStr(this.fobj.id+"",myfavs)
				if (isfav) {
					this.faviconurl = this.favfocus
				}
			},
			
			goBack(){
				uni.itool.nto({
					url:`/pages/qunzu/posts?type=${this.fobj.type}&pid=${this.pid}`
				})
			},
			toChat(){
				uni.itool.nto({
					url:'../chati/chati?fid='+this.fobj.uid
				})
			},
			listReplay(){
				listj({params: {table: 'replay', pid: this.fobj.id, type: 3}}).then(res => {
					this.replaylist = res
				}).catch(err => {
				 
				})
			},
			replay(){
				if(this.rnote){
					let fdata = {
						table:"replay",
						pid: this.fobj.id,
						note: this.rnote,
						uid: this.userInfo.id,
						username: this.userInfo.username,
						type: 3
					}
					savej({params: fdata}).then(res => {
						this.listReplay()
						this.rnote = ""
					}).catch(err => {
					 
					})
				}
			}
		},
		computed: {
			...mapState(['carlist', 'userInfo'])
		}
	}
</script>

<style lang="scss">
	
</style>

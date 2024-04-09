<template>
	<view>
		<u-navbar title="详细信息" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<image v-if="fobj.img" style="width: 100%;" :src="fileUrl+fobj.img" mode="widthFix"></image>
			<view class="formitem">
				<view class="gprice">标题:{{fobj.title}}</view>
			</view>
			<view class="formitem">
				<view class="gtitle">团队时间:{{fobj.sdate}}</view>
			</view>
      <view class="formitem">
        <view class="gtitle">团队地点:{{fobj.address}}</view>
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
			<view>
			    <u-divider text="报名列表:"></u-divider>
			</view>
			<imglist imgSize="20" tName="username" :showSearch="false" :showArrow='false' :dataList='baominglist' titleName="ndate" sName='note'></imglist>
		
		
			<view class="hpaddingctn" v-if="wbm">
				<u--form labelPosition="left" :model="bobj" ref="fform">
					<u-form-item label-width="76" label="联系电话:" prop="" borderBottom="1">
						<u--input border="none" type="text" v-model="bobj.tel" />
					</u-form-item>
					<u-form-item label-width="76" label="备注:" prop="" borderBottom="1">
						<u--textarea v-model="rnote" placeholder="备注" confirmType="done"></u--textarea>
					</u-form-item>
				</u--form>
        <u-button @click="baoming()" text="报名"></u-button>
			</view>

			
		</scroll-view>
	</view>
</template>

<script>
	import { savej, listj, findj, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	import { ideautil, yewuutil } from '@/common/commontools.js';
	export default {
		components:{  },
		data() {
			return {
				id: null,
				bobj:{},
				fileUrl: fileUrl,
				favtext: "加入收藏",
				fobj: {},
				baominglist: [],
				rnote: '',
				pingfen:0,
				favblur:'http://124.71.39.108/static/images/icons/favblur.png',
				favfocus:'http://124.71.39.108/static/images/icons/favfocus.png',
				faviconurl:'',
        wbm:true
			};
		},
		onLoad(params) {
			this.id = params.id
			this.fobjDetail()
		},
		methods: {
			...mapActions(['setCar']),
			toPosts: yewuutil.toPosts,
			fobjDetail() {
				findj({params: {table: 'huodong', id: this.id}}).then(res => {
					res.note = uni.itool.getHtmlNote(res.note)
					this.fobj = res
					this.checkFavs()
					this.listReplay()
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
					savej({params: {table: "huodong",id: this.fobj.id, favcount: this.fobj.favcount }}).then(res => {
						
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
					url: '/pages/huodong/huodong'
				})
			},
			toChat(){
				uni.ytool.toChatUni(this.fobj.uid)
			},
			listReplay(){
				listj({params: {table: 'baoming', pid: this.fobj.id}}).then(res => {
					this.baominglist = res
          let bm = this.baominglist.find((item) => item.uid == this.userInfo.id)
          if(bm){
            this.wbm = false
          }
				})
			},
			baoming(){
				if(this.rnote){
					let fdata = {
						table:"baoming",
						pid: this.fobj.id,
						note: this.rnote,
						uid: this.userInfo.id,
						username: this.userInfo.username,
						tel:this.bobj.tel
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

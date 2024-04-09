<template>
	<view>
		<u-navbar title="详细信息" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			
			<view class="formitem">
				<image style="width: 150upx;" :src="fileUrl+fobj.img" mode="widthFix"></image>
			</view>
			<view class="formitem">
				<view class="formlabel">用户名:{{fobj.username}}</view>
			</view>
			<view class="formitem">
				<view class="formlabel">电话:{{fobj.tel}}</view>
			</view>
			<view class="formitem">
				<view class="formlabel">旅游资源:{{fobj.note1}}</view>
			</view>
      <view class="formitem">
        <view class="formlabel">兴趣爱好:{{fobj.note2}}</view>
      </view>
      <view class="formitem">
        <view class="formlabel">技能:{{fobj.note3}}</view>
      </view>
			<view class="formitem">
				<view class="formlabel">签名:{{fobj.note}}</view>
			</view>
			<view class="hpaddingctn">
				<u-button type="primary" text="聊天" @click="toChat(fobj.id)" />
			</view>
			<view v-if="canjiaru" class="hpaddingctn">
				<u-button type="warning" text="加为关注" @click="popshow=true" />
			</view>
			<imglist :showSearch="false" imgName="img" @clickItem="toBlogDetail" :dataList="bloglist" :imgSize="3" titleName="title" sName="note" tName="typecn" ></imglist>
			<view class="hpaddingctn">
				<u-button type="warning" text="TA的主页" @click="toBlogview" />
			</view>
			<!-- <view class="formitem">
				<u-parse :content="fobj.note" />
			</view> -->
			
			<u-popup :closeable="true" @close="popshow=false" :show="popshow" mode="bottom">
				<view class="dialogctn">
					<u--form>	
						<view class="formitem">
							<view class="formlabel">申请添加:<text style="color: red;font-size: 40upx;">{{fobj.username}}为关注</text></view>
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
	import { savej, listj, findj, fileUrl } from '@/common/config/api.js';
	import { ideautil, yewuutil } from '@/common/commontools.js';
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				tid: null,
				fileUrl: fileUrl,
				fobj: {},
				popshow: false,
				canjiaru: true,
				bloglist:[],
				sqnote:""
			};
		},
		onLoad(params) {
			this.tid = params.id
			this.fobjDetail()
		},
		methods: {
			//toChat:yewuutil.toChat,
			toBlogDetail:yewuutil.toBlogDetail,
			toChat(fid){
				uni.itool.nto({
					url: '/pages/chat/chat?fid='+fid
				})
			},
			toBlogview(){
				uni.itool.nto({
					url: '/pages/blog/bloguser?uid='+this.fobj.id
				})
			},
			fobjDetail() {
				findj({params: {table: 'user', id: this.tid}}).then(res => {
					let note = ideautil.getHtmlNote(res.note)
					res.note = note
					this.fobj = res
					let fids = this.userInfo.fids
					if (ideautil.checkStrInStr(this.fobj.id,fids) || this.userInfo.id == this.fobj.id) {
						this.canjiaru = false
					}
					listj({params: {table: 'blog',uid:this.fobj.id }}).then(res2 => {
						this.bloglist = res2
					})
				}).catch(err => {
					
				})
			},
			goBack(){
				uni.itool.nto({
					url: '/pages/qunzu/friends'
				})
			},
			saveYzmessage(){
				let yzobj = {}
				yzobj.status = "待同意"
				yzobj.tid = this.fobj.id
				yzobj.fid = this.userInfo.id
				yzobj.fuser = this.userInfo.username
				yzobj.img = this.userInfo.img
				yzobj.note = this.sqnote
				yzobj.table = "yzmessage"
				yzobj.title = "申请添加关注"
				savej({params: yzobj}).then(res => {
					uni.showToast({
						icon:'none',
						title: '提交成功等待审核!'
					})
					this.popshow = false
				})
			}
		},
		computed: {
		
		}
	}
</script>

<style lang="scss">

</style>

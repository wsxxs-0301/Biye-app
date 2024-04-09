<template>
	<view>
		<u-navbar title="申请详情" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<view class="formitem">
				<view class="formlabel">{{fobj.title}}</view>
			</view>
			<view class="formitem">
				<view class="formlabel">申请人:{{fobj.fuser}}</view>
			</view>
			<view class="formitem">
				<view class="formlabel">申请时间:{{fobj.ndate}}</view>
			</view>
			<view class="formitem">
				<view class="formlabel">审核状态:{{fobj.status}}</view>
			</view>
			<view class="formitem">
				<u-parse :content="fobj.note" />
			</view>
			<view class="hpaddingctn" v-if="fobj.status=='待同意'">
				<view class="hpaddingctn">
					<u-button type="primary" text="同意" @click="handleOpt(true)" />
				</view>
				<view class="hpaddingctn">
					<u-button type="error" text="拒绝" @click="handleOpt(false)" />
				</view>
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { listj, savej, findj, fileUrl } from '@/common/config/api.js';
	import { ideautil } from '@/common/commontools.js';
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				tid: null,
				fileUrl: fileUrl,
				fobj: {}
			};
		},
		onLoad(params) {
			this.tid = params.id
			this.fobjDetail()
		},
		onShow(){
				
		},
		methods: {
			...mapActions(['updateUserInfo']),
			fobjDetail() {
				findj({params: {table: 'yzmessage', id: this.tid}}).then(res => {
					this.fobj = res
				})
			},
			agreeYzmessage(){
				let status = "已同意"
				savej({params: {table: 'yzmessage', id:this.fobj.id, status:status }}).then(res => {
					this.fobj.status = status
					uni.showToast({
						icon:'none',
						title: '操作成功!'
					})
				})
			},
			getFriendEcah(){
				
				findj({params: {table: 'user', id: this.fobj.fid}}).then(fuser => {
					let fuserids = fuser.fids
					let mefids = this.userInfo.fids
					let tid = this.fobj.tid
					let fid = this.fobj.fid
					if (fuserids && fuserids!="0") {
						if (!ideautil.checkStrInStr(tid,fuserids)) {
							fuserids += ","+tid
						}
						
					}else{
						fuserids = tid
					}
					
					if (mefids && mefids!="0") {
						if (!ideautil.checkStrInStr(fid,mefids)) {
							mefids += ","+fid
						}
					}else{
						mefids = fid
					}
					this.userInfo.fids = mefids
					this.updateUserInfo(this.userInfo)
					savej({params: {table: 'user', id: fid, fids: fuserids }}).then(res => {
						savej({params: {table: 'user', id: tid, fids: mefids }}).then(res => {
							this.agreeYzmessage()
						})
					})
					
				})
				
			},
			addUser2Qun(){
				findj({params: {table: 'qunzu', id: this.fobj.pid}}).then(obj => {
					if (obj) {
						let uids = obj.uids
						if (uids) {
							uids += ","+this.fobj.fid
						}else{
							uids = this.fobj.fid
						}
						
						savej({params: {table: 'qunzu',id: obj.id, uids: uids }}).then(rr => {
							this.agreeYzmessage()
						})
					}
				})
			},
			handleOpt(f){
				if (f) {
					if (this.fobj.pid) {
						this.addUser2Qun()
					}else if (this.fobj.tid) {
						this.getFriendEcah()
					}
				}else{
					let status = "已拒绝"
					savej({params: {table: 'yzmessage', id:this.fobj.id, status:status }}).then(res => {
						this.fobj.status = status
					})
				}
			},
			goBack(){
				/* uni.navigateBack({
					delta:1
				}) */
				uni.itool.nto({
					url:'/pages/qunzu/yzmessage'
				})
			}
		},
		computed: {
		
		}
	}
</script>

<style lang="scss">
	
</style>

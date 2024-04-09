
<template>
	<view>
		<u-navbar title="查找朋友" :border="true" :placeholder="true" :autoBack="true"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<imglist :round="true" imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import {
		listj,
		listSqlj,
		findj,
		savej,
		deletej,
		fileUrl
	} from '@/common/config/api.js';
	import {
		mapState,
		mapActions
	} from 'vuex';


	import { ideautil, yewuutil } from '@/common/commontools.js';
	export default {
		components:{ },
		data() {
			return {
				fileUrl: fileUrl,
				fobjlist: [],
				pobj:{}
			};
		},
		onLoad(params) {
			this.refresh()
		},
		methods: {
			...mapActions(['updateUserInfo']),
			//toChat:yewuutil.toChat,
			toChat(){

			},
			userDetail(tid) {
				uni.itool.nto({
					url: '/pages/qunzu/userdetail?id=' + tid
				})
			},
			delUser(uid){
				if (uid == this.userInfo.id) {
					uni.showToast({
						icon:'none',
						title: '不能移除自己'
					})
					return
				}
				let uids = this.userInfo.fids
				uids = ideautil.removeStrInStr(uid,uids)
				uids = uids || 0
				savej({params: {table: 'user', id: this.userInfo.id, fids: uids }}).then(r => {
					this.userInfo.fids = uids
					this.updateUserInfo(this.userInfo)
					this.refresh()
				})
			},
			refresh(){
				listj({params: {table: 'user', roletype: 2 }}).then(rl => {
					this.fobjlist = rl || []
				})
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss">
	
</style>

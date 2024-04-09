
<template>
	<view>
		<u-navbar title="我的关注" leftIconSize="0" :border="true" :placeholder="true"   :autoBack="true"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
<!--			<u-tabs :list="[{id:1,title:'我的关注'},{id:2,title:'我的粉丝'}]" keyName="title" @change="onTabChange"></u-tabs>-->
			<imglist v-if="tabindex == 1" :round="true" oLabel="取消关注" @clickOp="delUser" imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>
			<imglist v-if="tabindex == 2" :round="true" @clickOp="delUser" imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>

			<!--<view class="formitem">
				<navigator url="/pages/qunzu/searchfriends">
					<u-button type="success" text="查找新朋友"></u-button>
				</navigator>
			</view>-->
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
				pobj:{},
				tabindex:1
			};
		},
		onShow(params) {
			if (!this.userInfo || !this.userInfo.id) {
				uni.ytool.toLogin()
				return
			}
			this.refresh()
		},
		methods: {
			...mapActions(['updateUserInfo']),
			//toChat:yewuutil.toChat,
			onTabChange (item){
			    /*this.tabtitle = null
			    if(item.title != '全部'){*/
			        this.tabindex = item.id
			    //}
			    this.refresh()
			},
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
				if (this.tabindex == 1) {
					let uids = this.userInfo.fids
					let sql = `select * from tbl_user where id in (${uids})`
					listSqlj({params: {sql: sql }}).then(rl => {
						this.fobjlist = rl || []
					})
				}else{
					listj({params: {table: 'user',roletype:2 }}).then(alllist => {
						let rl = []
						for (let s of alllist) {
						    let fids = s.fids
							if (fids) {
								let fidslist = fids.split(',')
								for (let ss of fidslist) {
								    if(ss == this.userInfo.id){
								    	rl.push(s)
										break
								    }
								}
							}
						}
						this.fobjlist = rl
					})
				}

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

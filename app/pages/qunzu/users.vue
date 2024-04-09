
<template>
	<view>
		<u-navbar title="成员列表" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<imglist v-if="pobj.uid == userInfo.id" oLabel="移除成员" @clickOp="delUser" imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>
			<imglist v-else imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>
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


	import { ideautil } from '@/common/commontools.js';
	export default {
		components:{},
		data() {
			return {
				fileUrl: fileUrl,
				fobjlist: [],
				pobj:{}
			};
		},
		onLoad(params) {
	
			findj({params: {table: 'qunzu', id: params.pid}}).then(res => {
				if (res) {
					this.pobj = res
					this.refresh()
				}
			})
		},
		methods: {
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
				let uids = this.pobj.uids
				uids = ideautil.removeStrInStr(uid,uids)
				console.log(uids)
				savej({params: {table: 'qunzu', id: this.pobj.id, uids: uids }}).then(r => {
					this.pobj.uids = uids
					this.refresh()
				})
			},
			refresh(){
				let uids = this.pobj.uids
				let sql = `select * from tbl_user where id in (${uids})`
				listSqlj({params: {sql: sql }}).then(rl => {
					this.fobjlist = rl || []
				}).catch(err => {
				 
				})
			},
			goBack(){
				uni.itool.nto({
					url:`/pages/qunzu/qunzudetail?id=${this.pobj.id}`
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss">
	
</style>

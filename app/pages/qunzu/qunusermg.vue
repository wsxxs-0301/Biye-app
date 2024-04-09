
<template>
	<view>
		<u-navbar title="管理群成员" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u-checkbox-group placement="column" @change="updateUids">
				<imglist cbox="选择成员" imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="username" tName="tel" @clickItem="userDetail" :dataList="fobjlist"></imglist>
			</u-checkbox-group>
			<view class="hpaddingctn">
				<u-button type="primary" text="保存" @click="saveUids" />
			</view>
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
		components:{ },
		data() {
			return {
				fileUrl: fileUrl,
				fobjlist: [],
				pobj:{},
				uids:null
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
				let uids = this.pobj.uids || ""
				
				let sql = `select * from tbl_user where id in (${uids})`
				listj({params: {table: 'user',roletype:2 }}).then(rl => {
					this.fobjlist = rl || []
					let ua = uids.split(",")
					if (this.fobjlist.length && ua.length) {
						
						for (let s of this.fobjlist) {
							let id = s.id
							if(ideautil.checkStrInList(id,ua)){
								s.checked = true
							}else{
								s.checked = false
							}
							
						}
					}
					
				}).catch(err => {
				 
				})
			},
			updateUids(e){
				let uids = this.userInfo.id
				for (let s of e) {
				    uids+=","+s
				}
				this.uids = uids
				/*let ids = e.detail.value
				let uids = this.userInfo.id
				if (ids.length) {
					for (let s of ids) {
						if (uids == null) {
							uids = s
						}else{
							uids+=","+s
						}
					}
				}
				this.uids = uids*/
			},
			saveUids(){
				savej({params: {table: 'qunzu',uids: this.uids, id:this.pobj.id }}).then(res => {
					this.refresh();
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

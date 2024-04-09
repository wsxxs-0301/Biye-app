<template>
	<view>
		<u-navbar title="申请审核" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u-tabs :list="tablist" keyName="title" @change="onTabChange"></u-tabs>
			<imglist imgName="img" :sType="2" :imgSize="1"  :fx="false" titleName="fuser" tName="title" @clickItem="fobjDetail" :dataList="fobjlist"></imglist>
			
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


	export default {
		components:{},
		data() {
			return {
				fileUrl: fileUrl,
				fobjlist: [],
				pid:0,
				tablist: [{title: '待同意'},{title: '已同意'},{title: '已拒绝'}]
			};
		},
		onLoad(params) {
			this.pid = params.pid
			listj({params: {table: 'yzmessage', tid: this.userInfo.id, status: '待同意'}}).then(rl => {
				this.fobjlist = rl || []
			})
		},
		methods: {
			fobjDetail(tid) {
				uni.itool.nto({
					url: '/pages/qunzu/yzmessagedetail?id=' + tid
				})
			},
			onTabChange (item){
				listj({params: {table: 'yzmessage', tid: this.userInfo.id, status: item.title}}).then(rl => {
					this.fobjlist = rl || []
				})
			},
			goBack() {
				uni.itool.nto({
				    url:'/pages/me/me'
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss">
	
</style>

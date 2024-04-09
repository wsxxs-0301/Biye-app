<template>
	<view>
		<u-navbar title="特色团队" :border="true" :placeholder="true" @leftClick="goBack()"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<imglist imgName="img" :sType="2" :imgSize="2"  :fx="false" titleName="title" sName="note" @clickItem="toNoticeDetail" :dataList="fobjlist"></imglist>
			
		</scroll-view>
	</view>
</template>

<script>
	import {
		listj,
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
				fobjlist: []
			};
		},
		onLoad(params) {
			listj({
				params: {
					table: 'notice'
				}
			}).then(res => {
				this.fobjlist = res
			}).catch(err => {

			})
		},
		methods: {
			toNoticeDetail(tid) {
				uni.itool.nto({
					url: '/pages/notice/noticedetail?tid=' + tid
				})
			},
			goBack() {
				uni.itool.nto({
					url:'/pages/index/index'
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="scss">
	
</style>

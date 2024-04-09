<template>
	<view>
		<u-navbar title="天气" :border="true" :placeholder="true" @leftClick="goBack()" :autoBack="false"></u-navbar>
		<view :enable-flex="true" class="svcontainer">
			<web-view :src="chaturl"></web-view>
		</view>
	</view>
</template>

<script>
	import { listj, findj, savej, deletej, fileUrl, staticUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				chaturl: '',
				staticUrl: staticUrl
			};
		},
		onLoad(params) {
			this.chaturl = this.staticUrl+'client/tianqii.html'
		},
		methods: {
			...mapActions(['updateUserInfo']),

			goBack(){
				uni.itool.nto({
					url:'/pages/me/me'
				})
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">

</style>

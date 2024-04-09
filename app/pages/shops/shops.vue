<template>
	<view>
		<u-navbar title="定点任务" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u-button type="success" @click="toMap" text="地图"></u-button>
			<imglist :imgSize="2" imgName="img" titleName="sname" @clickItem='shopDetail' :dataList='fobjList' sName='address' ></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listj, findj, savej, deletej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';

	
	export default {
		components:{},
		data() {
			return {
				fobjList:[]
			};
		},
		onLoad(params) {
			listj({params: {table: 'shop'}}).then(res => {
				this.fobjList = res
			}).catch(err => {
			 
			})
		},
		methods: {
			toMap(){
				uni.itool.nto({
					url: '/pages/unimap/unimap'
				})
			},
			shopGoods(sid){
				uni.itool.nto({
					url: '/pages/good/goodview?sid='+sid
				})
			},
			shopDetail(pid){
				uni.itool.nto({
					url: '/pages/shops/shopdetail?pid='+pid
				})
			},
			goBack(){
				uni.ytool.toIndex()
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">

</style>

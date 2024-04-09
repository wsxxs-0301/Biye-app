<template>
	<view>
		<u-navbar title="团队列表" :border="true" @leftClick="goBack" :placeholder="true" rightText="新增" @rightClick="fobjMg" :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<!-- <u-list @scrolltolower="scrolltolower" >
				<u-list-item v-for="(item,index) in fobjList" :key="item.id">
					<u-cell @click="fobjMg(item.id)" :title="item.gname" isLink />
				</u-list-item>
			</u-list> -->
			<imglist imgName="img" imgSize="1" titleName="title" @clickItem='fobjMg' :dataList='fobjList' tName='username' ></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listj, findj, savej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';

	export default {
		data() {
			return {
				fobjList: []
			};
		},
		components:{},
		onLoad(params) {
			let uid = this.userInfo.id;
			listj({params: {table: 'qunzu', uid: uid}}).then(res => {
				this.fobjList = res
			}).catch(err => {
			 
			})
		},
		onShow() {
			
		},
		methods: {
			...mapActions(['updateUserInfo']),
			fobjMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:'./qunzumg?tid='+id
				})
			},
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
<template>
	<view>
		<u-navbar title="我的发布" :border="true" :placeholder="true" rightText="新增" @rightClick="fobjMg()" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<!-- <u-list @scrolltolower="scrolltolower" >
				<u-list-item v-for="(item,index) in fobjList" :key="item.id">
					<u-cell @click="fobjMg(item.id)" :title="item.gname" isLink />
				</u-list-item>
			</u-list> -->
			<imglist imgName="img" :imgSize="3" titleName="title" @clickItem='fobjMg' :dataList='fobjList' tName="username" sName='ndate' ></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listj, findj, savej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';

	import { ideautil, yewuutil } from '@/common/commontools.js';
	export default {
		data() {
			return {
				fobjList: []
			};
		},
		components:{},
		onLoad(params) {
			let uid = this.userInfo.id;
			listj({params: {table: 'blog', uid: uid}}).then(res => {
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
					url:'./blogmg?tid='+id
				})
			},
			goBack(){
				uni.itool.nto({
					url: '/pages/me/me'
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
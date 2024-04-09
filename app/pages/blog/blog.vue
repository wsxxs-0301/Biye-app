<template>
	<view>
		<u-navbar title="文章列表" :border="true" :placeholder="true" rightText="新增" @rightClick="fobjMg()" :autoBack="true"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<swiper :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item @click="toNotice" v-for="(item,index) in noticelist">
					<image class="swiperimg" :src="fileUrl+item.img"></image>
				</swiper-item>
			</swiper>
			<u-tabs :list="typelist" keyName="title" @change="refreshObj"></u-tabs>
			<u-gap height="20" bgColor="#fff"></u-gap>
      <imglist imgSize="bloglist" @clickItem="toBlogDetail" :dataList="fobjList"></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listSqlj, listj, findj, savej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';

	import { ideautil, yewuutil } from '@/common/commontools.js';
	export default {
		data() {
			return {
				fobjList: [],
				typelist: [],
				noticelist: []
			};
		},
		components:{},
		onLoad(params) {
			let uid = this.userInfo.id;
			let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where 1=1`
			listSqlj({params: {sql: sql}}).then(res => {
				this.fobjList = res
			}).catch(err => {
			 
			})
			
			listj({params: {table: 'type'}}).then(res => {
				this.typelist = res
				this.typelist.unshift({id:0,title:"全部"})
			}).catch(err => {
				
			})
		},
		onShow() {
			
		},
		methods: {
			...mapActions(['updateUserInfo']),
			toBlogDetail:yewuutil.toBlogDetail,
			
			fobjMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:'./blogmg?tid='+id
				})
			},
			refreshObj(index){
				let typeid = null
				if(index){
					typeid = index.id==0?null:index.id
				}
				let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where 1=1`
				if (typeid) {
					sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where 1=1 and typeid=${typeid}`
				}
				listSqlj({params: {sql: sql}}).then(res => {
					this.fobjList = res
				})
			},
			
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			toNotice(){
				uni.itool.nto({
					url:"/pages/notice/notice"
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
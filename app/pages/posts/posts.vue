<template>
	<view>
		<u-navbar title="交流反馈" :border="true" :placeholder="true" rightText="新增" @rightClick="postsMg()" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<imglist :imgSize="20" titleName="title" @clickItem='toPostsDetail' :dataList="fobjList" tName="username" sName='ndate' ></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listSqlj, listj, findj, savej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	export default {
		data() {
			return {
				fobjList: [],
				ftype:1
			};
		},
		components:{},
		onLoad(params) {
			this.ftype = params.type || 1
			//let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_posts b left join tbl_user u on u.id=b.uid where 1=1`
			listj({params: {table: "posts", type: this.ftype}}).then(res => {
				this.fobjList = res
			}).catch(err => {
			 
			})
		},
		onShow() {
			
		},
		methods: {
			...mapActions(['updateUserInfo']),
			toPostsDetail(id){
				uni.itool.nto({
					url:'/pages/posts/postsdetail?id='+id
				})
			},
			postsMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:'./postsmg?totype=1&tid='+id
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
<template>
	<view>
		<u-navbar title="团队列表" :border="true" :placeholder="true" rightText="新增" @rightClick="huodongMg()" @leftClick="goBack"></u-navbar>
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
			//let sql = `select b.*,(select count(pid) from wct_replay r where r.pid=b.id) pinglun,u.img uimg from wct_huodong b left join wct_user u on u.id=b.uid where 1=1`
			listj({params: {table: "huodong"}}).then(res => {
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
					url:'/pages/huodong/huodongdetail?id='+id
				})
			},
			huodongMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:'./huodongmg?totype=1&tid='+id
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
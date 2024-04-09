<template>
	<view>
		<u-navbar title="我的点赞" :border="true" :placeholder="true" :autoBack="true"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
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
			listj({params: {table: 'zan',uid:uid }}).then(zlist => {
				let zids = ""
				for (let s of zlist) {
				    if(zids){
				    	zids+=","+s.pid
				    }else{
				    	zids = s.pid
					}
				}
				let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where b.id in (${zids})`
				listSqlj({params: {sql: sql}}).then(res => {
					this.fobjList = res
				})
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
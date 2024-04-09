<template>
	<view>
		<u-navbar title="签到列表" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<view class="hpaddingctn" v-if="ismy">
				<u-button type="primary" text="新增" @click="fobjMg()" />
			</view>
			<imglist :imgSize="2" titleName="title" @clickItem='fobjDetail' :dataList="fobjList" tLabel="考勤时间:" tColor="red" tName="sedate" sName='note' ></imglist>
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
				pobj:null,
				ismy:false
			};
		},
		components:{},
		onLoad(params) {
			let pid = params.pid
			//let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_posts b left join tbl_user u on u.id=b.uid where 1=1`
			listj({params: {table: "qiandao", pid: pid}}).then(res => {
				this.fobjList = res || []
				for (let s of this.fobjList) {
					s.sedate = s.sdate+" 到 "+s.edate
				}
				findj({params: {table: 'qunzu',id: pid}}).then(pobj => {
					this.pobj = pobj
					if (this.pobj.uid == this.userInfo.id) {
						this.ismy = true
					}
				})
			})
		},

		methods: {
			...mapActions(['updateUserInfo']),
			fobjDetail(id){
				console.log("------------------fobjDetail")
				uni.itool.nto({
					url:`/pages/qunzu/qiandaodetail?id=${id}&pid=${this.pobj.id}`
				})
			},
			fobjMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:`/pages/qunzu/qiandaomg?id=${id}&type=${this.ftype}&pid=${this.pobj.id}`
				})
			},
			
			goBack(){
				console.log("------------------goBack")
				uni.itool.nto({
					url:`/pages/qunzu/qunzudetail?id=${this.pobj.id}`
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
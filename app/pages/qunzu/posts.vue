<template>
	<view>
		<u-navbar :title="ftitle" :border="true" :placeholder="true" rightText="新增" @rightClick="fobjMg()" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<imglist v-if="ftype==1" :imgSize="20" titleName="title" @clickItem='fobjDetail' :dataList="fobjList" tName="username" sName='ndate' ></imglist>
			<imglist v-if="ftype==2" :imgSize="2" titleName="title" @clickItem='fobjDetail' :dataList="fobjList" tLabel="团队时间:" tName="sdate" sName='note' ></imglist>
			<imglist v-if="ftype==3" :imgSize="2" titleName="title" @clickItem='fobjDetail' :dataList="fobjList" tName="ndate" sName='note' ></imglist>
			<imglist v-if="ftype==4" :imgSize="2" titleName="title" @clickItem='fobjDetail' :dataList="fobjList" tName="ndate" sName='note' ></imglist>
			<imglist v-if="ftype==5" imgName="img" :imgSize="3" titleName="title" @clickItem='fobjDetail' :dataList="fobjList"  sName='ndate' ></imglist>
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
				ftype:1,
				pobj:null,
				ftitle:''
			};
		},
		components:{},
		onLoad(params) {
			this.ftype = params.type
			switch (this.ftype){
				case '1':
					this.ftitle = '帖子列表'
					break;
				case '2':
					this.ftitle = '团队列表'
					break;
				case '3':
					this.ftitle = '公告列表'
					break;
				case '4':
					this.ftitle = '资料列表'
					break;
				case '5':
					this.ftitle = '相册列表'
					break;
				case '6':
					this.ftitle = ''
					break;					
				default:
					break;
			}
			
			let pid = params.pid
			
			//let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_posts b left join tbl_user u on u.id=b.uid where 1=1`
			listj({params: {table: "posts", type: this.ftype, pid: pid}}).then(res => {
				this.fobjList = res
				findj({params: {table: 'qunzu',id: pid}}).then(pobj => {
					this.pobj = pobj
				})
			})
		},

		methods: {
			...mapActions(['updateUserInfo']),
			fobjDetail(id){
				console.log("--------------------id:"+id+" pid:"+this.pobj.id)
				uni.itool.nto({
					url:`/pages/qunzu/postsdetail?id=${id}&pid=${this.pobj.id}`
				})
			},
			fobjMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:`/pages/qunzu/postsmg?id=${id}&type=${this.ftype}&pid=${this.pobj.id}`
				})
			},
			
			goBack(){
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
<template>
	<view>
		<u-navbar title="首页" leftIconSize="0" :border="true" :placeholder="true" :autoBack="true"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<swiper :circular="true" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item @click="toNotice" v-for="(item,index) in noticelist">
					<image class="swiperimg" :src="fileUrl+item.img"></image>
				</swiper-item>
			</swiper>
			<view class="gridmenu">
<!--				<view class="gridmenuitem">
					<navigator url="/pages/unimap/unimap">
						<image class="gridmenuicon" src="http://124.71.39.108/static/nimgs/icondc/caidan.png"></image>
						<text class="gridmenutitle"></text>
					</navigator>

				</view>-->

				<view class="gridmenuitem">
					<navigator url="/pages/favs/favs">
						<image class="gridmenuicon" src="http://124.71.39.108/static/nimgs/icondc/shouchang.png"></image>
						<text class="gridmenutitle">我的收藏</text>
					</navigator>

				</view>
				<view class="gridmenuitem">
					<navigator url="/pages/blog/blogmg">
						<image class="gridmenuicon" src="http://124.71.39.108/static/nimgs/icondc/xinpin.png"></image>
						<text class="gridmenutitle">发布</text>
					</navigator>

				</view>
				<view class="gridmenuitem">
					<navigator url="/pages/blog/blogtuijian">
						<image class="gridmenuicon" src="http://124.71.39.108/static/nimgs/icondc/xihuan.png"></image>
						<text class="gridmenutitle">为我推荐</text>
					</navigator>
				</view>
			</view>
			<u-tabs :list="typelist" keyName="title" @change="refreshObj1"></u-tabs>
<!--      <u-tabs :list="citylist" keyName="title" @change="refreshObj2"></u-tabs>-->
			<view>
			    <u-divider :text="city"></u-divider>
			</view>
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
        citylist: [],
				noticelist: [],
				fileUrl:fileUrl,
        typeid:null,
        city:null
			};
		},
		components:{},
		onLoad(params) {

			
			listj({params: {table: 'type'}}).then(res => {
				this.typelist = res
				this.typelist.unshift({id:0,title:"全部"})
			})
      listj({params: {table: 'city'}}).then(res => {
        this.citylist = res
        this.citylist.unshift({id:0,title:"全部"})
      })
			listj({params: {table: 'notice' }}).then(res => {
				this.noticelist = res
			})
		},
		onShow() {
			this.refreshObj()
		},
		methods: {
			...mapActions(['updateUserInfo']),
			toBlogDetail:yewuutil.toBlogDetail,
			
			fobjMg(id){
				console.log("------------------>:aid:"+id)
				uni.itool.nto({
					url:'/pages/blog/blogmg?tid='+id
				})
			},
      refreshObj1(index){
        let typeid = null
        if(index){
          typeid = index.id==0?null:index.id
        }
        this.typeid = typeid
        this.refreshObj()
      },
      refreshObj2(index){
        let city = null
        if(index){
          city = index.id==0?null:index.title
        }
        this.city = city
        this.refreshObj()
      },
			refreshObj(){
				/*let typeid = null
				if(index){
					typeid = index.id==0?null:index.id
				}*/
				let sql = `select b.*,(select count(pid) from tbl_replay r where r.pid=b.id) pinglun,u.img uimg from tbl_blog b left join tbl_user u on u.id=b.uid where b.statecn<>'审核不通过'`
				if (this.typeid) {
					sql += ` and typeid=${this.typeid}`
				}
        if (this.city) {
          sql += ` and city='${this.city}'`
        }
				listSqlj({params: {sql: sql}}).then(res => {
          for (let s of res) {
              s.zan = s.zan*1 || 0
          }
					res = res.sort((o1,o2)=>{
						return o2.zan-o1.zan
					})
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
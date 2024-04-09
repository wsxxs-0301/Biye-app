<template>
	<view>
		<u-navbar leftIconSize="0" title="团队列表" :border="true" :placeholder="true" @leftClick="goBack" :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<!-- <u-list @scrolltolower="scrolltolower" >
				<u-list-item v-for="(item,index) in fobjList" :key="item.id">
					<u-cell @click="fobjMg(item.id)" :title="item.gname" isLink />
				</u-list-item>
			</u-list> -->
      <view class="formitem">
          <u-button type="warning" @tap="fobjMg(null)" text="创建团队"></u-button>
      </view>
			<u-tabs :list="tablist" keyName="title" @change="onTabChange"></u-tabs>
			<imglist imgName="img" imgSize="1" titleName="title" @clickItem='fobjDetail' :dataList='fobjList' tName='username' ></imglist>
		</scroll-view>
	</view>
</template>

<script>
	import { listj, findj, savej, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	import { ideautil, yewuutil } from '@/common/commontools.js'

	export default {
		data() {
			return {
				fobjList: [],
				tablist:[{title:'全部'},{title:'我的'},{title:'匹配团队'}]
			};
		},
		components:{},
		onLoad(params) {
			
		},
		onShow() {
			listj({params: {table: 'qunzu'}}).then(res => {
				this.fobjList = res
			}).catch(err => {
			 
			})
		},
		methods: {
			...mapActions(['updateUserInfo']),
			fobjMg(id){
        if(id){
          uni.itool.nto({
            url:'./qunzumg?tid='+id
          })
        }else{
          uni.itool.nto({
            url:'./qunzumg'
          })
        }

			},
			fobjDetail(id){
				uni.itool.nto({
					url:'/pages/qunzu/qunzudetail?id='+id
				})
			},
			goBack(){
				uni.itool.nto({
					url:'/pages/me/me'
				})
			},
			onTabChange(e){
				let title = e.title
				if (title=="全部") {
					listj({params: {table: 'qunzu'}}).then(res => {
						this.fobjList = res
					})
				}else if (title=="匹配团队") {
          listj({params: {table: 'qunzu'}}).then(arr => {
            this.fobjList = [arr[Math.floor(Math.random() * arr.length)]]
          })
        }else if (title == "我的") {
					listj({params: {table: 'qunzu'}}).then(list => {
						let uid = this.userInfo.id
						let tlist = []
						for (let obj of list) {
							let uids = obj.uids
							if(ideautil.checkStrInStr(uid,uids)){
								tlist.push(obj)
							}
						}
						this.fobjList = tlist
					})
				}
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">

</style>
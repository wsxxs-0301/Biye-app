<template>
	<view>
		<u-navbar title="签到详细" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<image v-if="fobj.img" style="width: 100%;" :src="fileUrl+fobj.img" mode="widthFix"></image>
			<view class="formitem">
				<view class="gprice">标题:{{fobj.title}}</view>
			</view>

			<view class="formitem">
				<view class="gtitle">发布者:{{fobj.username}}</view>
			</view>
			<view class="formitem">
				<view class="gtitle">开始时间:{{fobj.sdate}}</view>
			</view>
			<view style="margin-top: 160rpx">
				<canvas canvas-id="qrcode" style="width: 300rpx;margin: 0 auto;"/>
			</view>
			<view class="formitem" v-if="userInfo.id == fobj.uid">
			    <u-button @click="refreshEnddata" type="primary" text="刷新"></u-button>
			</view>
			<view class="formitem">
				<view class="gtitle">截止时间:{{fobj.edate}}</view>
			</view>
			<view class="formitem">
				<view class="gtitle">签到位置:{{fobj.address}}</view>
			</view>
			<view class="formitem">
				<u-parse :content="fobj.note" />
			</view>
			
			<!-- <view class="formitem">
				<view @click="toggleFav">
					<image :src="faviconurl" style="width: 60upx;height: 60upx;" mode="heightFix"></image>
					<text>{{this.fobj.favcount}}</text>
				</view>
			</view> -->
			
			<!-- <view class="hpaddingctn">
				<u-button @click="toChat()" text="私信"></u-button>
			</view> -->
			
			<view v-if="userInfo.id == fobj.uid" class="hpaddingctn">
				<u-button type="error" text="删除" @click="delObj" />
			</view>
			
			<u-tabs :list="typelist" keyName="title" @change="onTabChange"></u-tabs>
			<u-gap height="20"></u-gap>
			<imglist imgName="img" v-if="rtype==2" :round="true" imgSize="1" tName="ndate" :showSearch="false" :showArrow='false' :dataList='replaylist' titleName="username" sName='note'></imglist>
			<imglist imgName="img" v-if="rtype==1" :round="true" imgSize="1" tName="sex" :showSearch="false" :showArrow='false' :dataList='replaylist' titleName="username"></imglist>
			<imglist @clickItem="toDaiqian" imgName="img" v-if="rtype==3" :round="true" imgSize="1" tName="sex" :showSearch="false" :showArrow='false' :dataList='replaylist' titleName="username"></imglist>
			<view>

				<u-popup :closeable="true" @close="daiqianshow=false" :show="daiqianshow" mode="bottom">
					<view class="dialogctn">
						<u--form>

							<view class="formitem">
								<view style="margin-bottom: 30upx;" class="formlabel">代签设置:</view>
								<u-radio-group v-model="daiqiannote" placement="column">
									<u-radio :customStyle="{marginBottom: '15rpx', marginTop: '15rpx'}" label="已签到" name="正常">
									</u-radio>
									<u-radio :customStyle="{marginBottom: '15rpx', marginTop: '15rpx'}" label="缺勤" name="缺勤">
									</u-radio>
									<u-radio :customStyle="{marginBottom: '15rpx', marginTop: '15rpx'}" label="请假" name="请假">
									</u-radio>
								</u-radio-group>
							</view>


							<view class="formitem">
								<button type="primary" @click="daiqian()">提交</button>
							</view>
						</u--form>
					</view>
				</u-popup>
			</view>
			<view class="hpaddingctn" v-if="showqiandao">
				<view>我的位置{{mylocation.address}},坐标:{{mylocation.latitude}},{{mylocation.longitude}}</view>
				<u--form labelPosition="left">
					<u-form-item borderBottom label-width="76" label="签到码:" prop="yzm">
						<u--input type="text" border="none" v-model="yzm" />
					</u-form-item>
					<!--
					<u-form-item borderBottom label-width="76" label="备注:" prop="rnote">
						<u--input type="text" border="none" v-model="rnote" />
					</u-form-item>
					-->
				</u--form>
				<view class="hpaddingctn">
					<u-button @click="qiandao()" text="签到"></u-button>
				</view>
			</view>	
			
			
			
		</scroll-view>
	</view>
</template>

<script>

	import { listSqlj, deletej, savej, listj, findj, fileUrl } from '@/common/config/api.js';
	import {mapState, mapActions} from 'vuex';
	import { ideautil, yewuutil } from '@/common/commontools.js';

	import uQRCode from '@/common/uqrcode.js' //引入uqrcode.js
	export default {
		components:{  },
		data() {
			return {
				id: null,
				fileUrl: fileUrl,
				fobj: {},
				replaylist: [],
				rnote: '',
				pingfen:0,
				pid:null,
				yzm:'',
				rtype:1,
				typelist: [{title: '签到人员'}, {title: '已签到'}, {title: '未签到'}, {title: '缺勤'}, {title: '请假'}],
				qdusers:[],
				showqiandao:false,
				mylocation:{},
				daiqianshow:false,
				daiqiannote:'正常',
				dquser:null
			};
		},
		onLoad(params) {
			this.id = params.id
			this.pid = params.pid
			this.fobjDetail()
			uni.itool.getLocation((addressobj)=>{
				this.mylocation = addressobj
			})
		},
		methods: {
			...mapActions(['setCar']),
			createQrcode(text) {
				this.qrShow = true
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 150,
					margin: 0,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					errorCorrectLevel: uQRCode.errorCorrectLevel.H,
					success: res => {}
				})
			},
			refreshEnddata(){
				let s = this.fobj.edate
				let d = new Date(Date.parse(s.replace(/-/g, "/")));
				let times = d.getTime() + (10*6000)
				let edate = uni.itool.getNtime(times)
				savej({params: {table:"qiandao",id:this.fobj.id,edate:edate}}).then(res => {
					this.fobj.edate = edate
					this.createQrcode(this.createQrcode(this.fobj.id+"_"+Date.now()))
				})
			},
			toDaiqian(id){
				findj({params: {table: 'user', id: id}}).then(res => {
					this.dquser = res
					this.daiqianshow = true
				})
			},
			daiqian(){
				let fdata = {
					table:"qiandaoreplay",
					pid: this.fobj.id,
					note: this.daiqiannote,
					uid: this.dquser.id,
					username: this.dquser.username,
					img: this.dquser.img
				}
				savej({params: fdata}).then(res => {
					let qdtitle = "已签到"
					if (this.daiqiannote != "正常") {
						qdtitle = this.daiqiannote
					}
					this.listReplay("未签到")
					this.rnote = ""
					this.daiqianshow = false
				}).catch(err => {

				})
			},
			fobjDetail() {
				findj({params: {table: 'qiandao', id: this.id}}).then(res => {
					this.fobj = res
					let uids = this.fobj.uids
					let sql = `select * from wct_user where id in (${uids})`
					listSqlj({params: {sql: sql }}).then(rl => {
						this.qdusers = rl || []
						this.listReplay()
						this.checkStatus()
					})
					this.createQrcode(res.id+"_"+Date.now())
				}).catch(err => {
					
				})
			},
			delObj(){
				deletej({params: {table: 'qiandao', id: this.fobj.id}}).then(res => {
					this.goBack()
				})
			},
			
			goBack(){
				uni.redirectTo({
					url:`/pages/qunzu/qiandao?type=${this.fobj.type}&pid=${this.pid}`
				})
			},
			toChat(){
				uni.redirectTo({
					url:'../chati/chati?fid='+this.fobj.uid
				})
			},
			checkStatus(){
				listj({params: {table: 'qiandaoreplay', pid: this.fobj.id}}).then(res => {
					let yqdlist = res || []
					this.showqiandao = true
					for (let s of yqdlist) {
						if (s.uid == this.userInfo.id) {
							this.showqiandao = false
							break
						}
					}
					
				})
			},
			listReplay(title){
				title = title || "签到人员"
				if (title == "签到人员") {
					this.rtype = 1
					this.replaylist = this.qdusers
				}else{
					if (title == "已签到") {
						this.rtype = 2
						listj({params: {table: 'qiandaoreplay', pid: this.fobj.id}}).then(res => {
							this.replaylist = res || []
						})
					}else if (title == "缺勤") {
						this.rtype = 3
						listj({params: {table: 'qiandaoreplay', pid: this.fobj.id, note:'缺勤'}}).then(res => {
							this.replaylist = res || []
						})
					}else if (title == "请假") {
						this.rtype = 3
						listj({params: {table: 'qiandaoreplay', pid: this.fobj.id, note:'请假'}}).then(res => {
							this.replaylist = res || []
						})
					}else if (title == "未签到") {
						this.rtype = 3
						listj({params: {table: 'qiandaoreplay', pid: this.fobj.id}}).then(ylist => {
							ylist = ylist || []
							let alist = this.qdusers
							let wqdusers= []
							for (let i = 0; i < alist.length; i++) {
								let user = alist[i]
								let flag = true
								for (let j = 0; j < ylist.length; j++) {
									let yuid = ylist[j].uid
									if (yuid == user.id) {
										flag = false
										break
									}
								}
								if (flag) {
									wqdusers.push(user)
								}
							}
							this.replaylist = wqdusers
							
						})
					}
					
				}
				
			},
			qiandao(){
				let s = this.fobj.edate
				let d = new Date(Date.parse(s.replace(/-/g, "/")));
				let times = d.getTime()
				let ntime = Date.now()

				if (ntime > times) {
					uni.showToast({
						icon:'none',
						title: '超过签到时间'
					})
					return
				}
				if (this.yzm == this.fobj.yzm) {
					let fdata = {
						table:"qiandaoreplay",
						pid: this.fobj.id,
						note: "正常",
						uid: this.userInfo.id,
						username: this.userInfo.username,
						img: this.userInfo.img
					}
					savej({params: fdata}).then(res => {
						this.listReplay()
						this.rnote = ""
						this.showqiandao = false
					}).catch(err => {
					 
					})
				}else{
					uni.showToast({
						icon:'none',
						title: '签到码错误！'
					})
				}
				
				
			},

			onTabChange(item){
				let title = item.title
				this.listReplay(title)
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">
	
</style>

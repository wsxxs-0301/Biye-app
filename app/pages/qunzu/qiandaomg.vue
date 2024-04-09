<template>
	<view>
		<u-navbar title="信息管理" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u--form labelPosition="left" :model="fobj" ref="fform">

				<u-form-item borderBottom label-width="76" label="标题:" prop="title">
					<u--input type="text" border="none" v-model="fobj.title" />
				</u-form-item>
				<u-form-item borderBottom label-width="76" label="签到码:" prop="yzm">
					<u--input type="number" border="none" v-model="fobj.yzm" />
				</u-form-item>
				<u-form-item @click="toUnimapSelect" borderBottom label-width="76" label="签到位置:" prop="address">
					<u--input type="text" border="none" v-model="fobj.address" />
				</u-form-item>
				

				<ideadatetime v-model="fobj.sdate" label="开始时间"></ideadatetime>
				<ideadatetime v-model="fobj.edate" label="结束时间"></ideadatetime>
				<view class="formitem">
					<view class="formlabel">备注:</view>
					<view style="border: 1px #ddd solid;">
						<jinEdit :html="editorHtml" @getEditorContxt="getEditorContxt" v-model="fobj.note" height="300px" :uploadFileUrl="uploadUrl" placeholder="请输入内容" @editOk="editOk"></jinEdit>
					</view>

				</view>
			</u--form>

			<view class="formitem">
				<button type="primary" @click="saveFobj()">提交</button>
			</view>
			<view class="formitem" v-if="tid">
				<button type="warn" @click="delFobj()">删除</button>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import {
		listj,
		findj,
		savej,
		deletej,
		fileUrl,
		uploadUrl
	} from '@/common/config/api.js';
	import {
		mapState,
		mapActions
	} from 'vuex';
	import jinEdit from '@/components/jin-edit/jin-edit.vue';
	import {
		ideautil,
		yewuutil
	} from '@/common/commontools.js'
	//const chooseLocation = requirePlugin('chooseLocation')
	export default {
		components: {
			jinEdit
		},
		data() {
			return {
				tel: '',
				typelist: [],
				filelist: [],
				fobj: {
					title: '',
					type: 1,
					note: '',
					img: '',
					table: 'qiandao',
					address:'',
					latitude:'',
					longitude:''
				},
				tid: null,
				fileUrl: fileUrl,
				uploadUrl: uploadUrl,
				editorCtx: null,
				editorHtml: '',
				ftype: 1,
				pobj: null,
				datepickshow: false,
				datepickshow2: false
			};
		},
		onShow(){
			let point = getApp().globalData.targetAddress
			if (point) {
				this.fobj.latitude = point.latitude
				this.fobj.longitude = point.longitude
				this.fobj.address = point.address
			}
		},
		onLoad(params) {
			if (params.id && params.id !== 'undefined') {
				this.tid = params.id
			} else {
				this.fobj.type = params.type
				this.ftype = params.type
				this.fobj.pid = params.pid
			}

			console.log('tttttttid:' + params.tid + " showdel:" + this.showdel)
			if (this.tid) {
				findj({
					params: {
						table: 'qiandao',
						id: this.tid
					}
				}).then(res => {
					this.fobj = res
					this.filelist.push({
						url: this.fileUrl + res.img
					})
					console.log(this.imgfile)
					this.editorHtml = this.fobj.note
					/* this.editorCtx.setContents({
						html: this.fobj.note
					}) */

				}).catch(err => {

				})
			}
			findj({
				params: {
					table: 'qunzu',
					id: params.pid
				}
			}).then(pobj => {
				this.pobj = pobj
			})
		},
		/* onShow() {
			const location = chooseLocation.getLocation()
			console.log(location, 'location')
			if (location) {
				this.mapChooseRegion = location.name
				this.mapChooseDetail = location.address
			}
		},
		onUnload() {
			chooseLocation.setLocation(null)
		}, */
		methods: {

			//...mapActions(['']),
			hideKeyboard: ideautil.hideKeyboard,
			toUnimapSelect:ideautil.toUnimapSelect,
			chooseLocation() {
				/* const key = 'B4VBZ-PLU6W-I5MRF-ODL7U-XX5K7-UNFPN';
				const referer = 'ideabobo';
				const location = JSON.stringify({
					latitude: 39.89631551,
					longitude: 116.323459711
				});
				const category = '生活服务,娱乐休闲';

				uni.itool.nto({
					url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' +
						location + '&category=' + category
				}); */
			},
			saveFobj() {
				this.editorCtx.getContents({
					success: res => {
						this.fobj.note = res.html
						this.fobj.uid = this.userInfo.id
						this.fobj.username = this.userInfo.username
						console.log(this.filelist)

						this.fobj.uids = this.pobj.uids
						let fdata = this.fobj
						fdata.table = "qiandao"
						savej({
							params: fdata
						}).then(res => {
							this.goBack()
						}).catch(err => {

						})
					}
				})

			},
			comboboxselect(e) {
				this.fobj.typeid = e.id
				this.fobj.type = e.title
			},
			delFobj() {
				deletej({
					params: {
						table: 'qiandao',
						id: this.tid
					}
				}).then(res => {
					uni.itool.nto({
						url: './qiandao'
					})
				}).catch(err => {

				})
			},
			goBack() {
				uni.itool.nto({
					url: `/pages/qunzu/qiandao?pid=${this.fobj.pid}&type=${this.fobj.type}`
				})
			},

			editOk(res) {
				this.fobj.note = res.html
			},
			getEditorContxt(ctx) {
				this.editorCtx = ctx
				this.editorCtx.setContents({
					html: this.fobj.note
				})
			},
			dateOk(e, type) {
				this.datepickshow = false
				if (type == 1) {
					this.fobj.sdate = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
				}

			},
			dateOk2(e, type) {
				this.datepickshow2 = false
				if (type == 1) {
					this.fobj.edate = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
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

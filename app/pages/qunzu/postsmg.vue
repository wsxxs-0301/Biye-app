<template>
	<view>
		<u-navbar title="信息管理" :border="true" :placeholder="true" @leftClick="goBack"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u--form labelPosition="left" :model="fobj" ref="fform">

				<u-form-item borderBottom label-width="76" label="标题:" prop="title">
					<u--input type="text" border="none" v-model="fobj.title" />
				</u-form-item>
				<u-form-item v-if="ftype==2" label-width="76" label="团队时间" prop="sdate" borderBottom @click="datepickshow = true; hideKeyboard()"
					ref="item1">
					<u--input v-model="fobj.sdate" disabled disabledColor="#ffffff" placeholder="选择时间"
						border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<view class="formitem">
					<view class="formlabel">配图:</view>
					<idea-upload v-model="filelist"></idea-upload>
				</view>
				<view class="formitem">
					<view class="formlabel">选择文件:</view>
					<fileUpload v-model="fobj.filename"></fileUpload>
				</view>
				
				<view class="formitem">
				
					<view style="border: 1px #ddd solid;">
						<jinEdit :html="editorHtml" @getEditorContxt="getEditorContxt" v-model="fobj.note" height="300px" :uploadFileUrl="uploadUrl" placeholder="请输入内容" @editOk="editOk"></jinEdit>
					</view>
				</view>
			</u--form>
			

			<u-datetime-picker :show="datepickshow" :value="Number(new Date())" mode="datetime" closeOnClickOverlay
				@confirm="dateOk($event,1)" @cancel="dateOk($event,2)" @close="dateOk($event,0)"></u-datetime-picker>

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
					table: 'posts',
					filename:''
				},
				tid: null,
				fileUrl: fileUrl,
				uploadUrl: uploadUrl,
				editorCtx: null,
				editorHtml: '',
				ftype: 1,
				pobj: null,
				datepickshow: false,
			};
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
						table: 'posts',
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

			listj({
				params: {
					table: 'type2'
				}
			}).then(res => {
				this.typelist = res
			}).catch(err => {

			})
		},
		methods: {

			//...mapActions(['']),
			hideKeyboard: ideautil.hideKeyboard,
			saveFobj() {
				this.editorCtx.getContents({
					success: res => {
						this.fobj.note = res.html
						this.fobj.uid = this.userInfo.id
						this.fobj.username = this.userInfo.username
						console.log(this.filelist)

						this.filelist.length ? this.fobj.img = this.filelist[0].url.data : this.fobj.img = ""

						let fdata = this.fobj
						fdata.table = "posts"
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
						table: 'posts',
						id: this.tid
					}
				}).then(res => {
					uni.itool.nto({
						url: './posts'
					})
				}).catch(err => {

				})
			},
			goBack() {
				uni.itool.nto({
					url: `/pages/qunzu/posts?pid=${this.fobj.pid}&type=${this.fobj.type}`
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
			dateOk(e,type) {
				this.datepickshow = false
				if (type==1) {
					this.fobj.sdate = uni.$u.timeFormat(e.value, 'yyyy-mm-dd hh:MM:ss')
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

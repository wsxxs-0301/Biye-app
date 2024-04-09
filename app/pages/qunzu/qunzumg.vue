<template>
	<view>
		<u-navbar title="团队管理" :border="true" :placeholder="true" @leftClick="goBack" :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<view>
			<u--form>
				<u-form-item borderBottom label-width="76" label="标题:" prop="title">
					<u--input border="none" type="text" v-model="fobj.title" />
				</u-form-item>
        <ideadatetime  v-model="fobj.sdate" label="时间"></ideadatetime>
<!--        <ideaselect label="场地" showName="sname" :datalist="[typelist]" v-model="sobj"></ideaselect>-->
        <u-form-item label-width="76" label="人数:" prop="" borderBottom="1">
        	<u--input border="none" type="number" v-model="fobj.renshu" />
        </u-form-item>
        <ideaslc label="旅游经验" :datalist="[['菜鸟','一般','高手','专家','不限']]" v-model="fobj.jlevel"></ideaslc>
        <ideaslc label="费用分摊方式" :datalist="[['群主请','AA制']]" v-model="fobj.ftype"></ideaslc>
        <view class="formitem">
        	<view class="formlabel">封面图:</view>
        	<fileupload v-model="fobj.img"></fileupload>
        </view>
				<view class="formitem">
					<view class="formlabel">详情编辑:</view>
					<view style="border: 1px #ddd solid;">
							<jinEdit :html="editorHtml" @getEditorContxt="getEditorContxt" v-model="fobj.note" height="300px" :uploadFileUrl="uploadUrl" placeholder="请输入内容" @editOk="editOk"></jinEdit>
					</view>
					
				</view>
			</u--form>
			</view>
			
			
			
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
	} from '@/common/config/api.js'
	import {
		mapState,
		mapActions
	} from 'vuex';
	import jinEdit from '@/components/jin-edit/jin-edit.vue'
	import ideaUpload from '@/components/idea-upload/idea-upload.vue'
	import {
		ideautil,
		yewuutil
	} from '@/common/commontools.js'
	export default {
		components: {
			jinEdit,
			ideaUpload
		},
		data() {
			return {
				tel: '',
				typelist: [],
				filelist: [],
				fobj: {
					btype:1,
					gname: '',
					price: 0,
					note: '',
					img: '',
					sid: '',
					shop: '',
					typeid: '',
					type: '',
					table: 'qunzu'
				},
				tid: null,
				fileUrl: fileUrl,
				uploadUrl: uploadUrl,
				editorCtx:null,
				editorHtml:'',
				sshow1:false,
        sobj:{}
			};
		},
    onShow(){
      listj({params: {table: 'shop' }}).then(res => {
        this.typelist = res
      })
    },
		onLoad(params) {
			if (params.tid && params.tid !== 'undefined') {
				this.tid = params.tid
			}

			if (this.tid) {
				findj({
					params: {
						table: 'qunzu',
						id: this.tid
					}
				}).then(res => {
					this.fobj = res
					this.filelist.push({url: this.fileUrl + res.img})
					console.log(this.imgfile)
					this.editorHtml = this.fobj.note
					/* this.editorCtx.setContents({
						html: this.fobj.note
					}) */
					
				}).catch(err => {

				})
			}
			/*
			listj({
				params: {
					table: 'type'
				}
			}).then(res => {
				for (let s of res) {
					s.name = s.title
				}
				this.typelist = res
			}).catch(err => {
			
			})
			*/
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
						this.fobj.sid = this.sobj.id
            this.fobj.stitle = this.sobj.sname
						if (!this.fobj.uids) {
							this.fobj.uids = this.userInfo.id
						}
						let fdata = this.fobj
						fdata.table = "qunzu"
						savej({
							params: fdata
						}).then(res => {
							uni.itool.nto({
								url: './qunzu'
							})
						}).catch(err => {
						
						})
					} 
				})
				
			},
			comboboxselect(e){
				this.fobj.typeid = e.id
				this.fobj.type = e.title
			},
			delFobj() {
				deletej({
					params: {
						table: 'qunzu',
						id: this.fobj.id
					}
				}).then(res => {
					uni.itool.nto({
						url: './qunzu'
					})
				}).catch(err => {

				})
			},
			goBack() {
				uni.itool.nto({
					url:'/pages/qunzu/qunzu'
				})
			},
			
			editOk(res) {
				this.fobj.note = res.html
			},
			getEditorContxt(ctx){
				this.editorCtx = ctx
				this.editorCtx.setContents({
					html: this.fobj.note
				})
			},
			tSelected1(e){
				this.fobj.type = e.name
				this.fobj.typeid = e.id
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">

</style>

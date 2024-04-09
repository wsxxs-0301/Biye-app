<template>
	<view>
		<u-navbar title="管理信息" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
			<u--form>
				<u-form-item borderBottom label-width="76" label="标题:" prop="title">
					<u--input type="text" border="none" v-model="fobj.title" />
				</u-form-item>
        <ideaselect label="关联团队活动" showName="title" :datalist="[qunlist]" v-model="qunobj"></ideaselect>
<!--        <ideaslc label="选择城市" :datalist="[citylist]" v-model="fobj.city"></ideaslc>-->
				<ideaselect label="选择分类" showName="title" :datalist="[typelist]" v-model="sobj"></ideaselect>
				
				<view class="formitem">
					<view class="formlabel">配图:</view>
					<fileupload v-model="fobj.img"></fileupload>
				</view>
<!--        <view class="formitem">
        	<view class="formlabel">地址:</view>
        	<input @tap="chooseLocation" type="text" v-model="fobj.address" class="binput1" />
        </view>-->
<!--				<view class="formitem">
					<view class="formlabel">文件:</view>
					<fileupload v-model="fobj.video"></fileupload>
				</view>-->

				<view class="formitem">
					<view class="formlabel">详情编辑:</view>
					<view style="border: 1px #ddd solid;">
						<jinEdit :html="editorHtml" @getEditorContxt="getEditorContxt" v-model="fobj.note" height="300px" :uploadFileUrl="uploadUrl" placeholder="请输入内容" @editOk="editOk"></jinEdit>
					</view>
					
				</view>
<!--				<view>
					未经肖像权人同意，不得制作、使用、公开肖像权人的肖像；任何组织或者个人不得以刺探、侵扰、泄露、公开等方式侵害他人的隐私权
				</view>-->
			</u--form>
			
			<view class="formitem">
				<button type="primary" @click="saveBlog()">提交</button>
			</view>
			<view class="formitem" v-if="tid">
				<button type="warn" @click="delBlog()">删除</button>
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

	import { ideautil, yewuutil} from '@/common/commontools.js'
  import Ideaslc from "../../components/ideaslc/ideaslc.vue";
	export default {
		components: {
      Ideaslc,
			jinEdit
		},
		data() {
			return {
				tel: '',
				typelist: [],
				filelist: [],
        citylist: [],
				fobj: {
					video:'',
					address:''
				},
				tid: null,
				fileUrl: fileUrl,
				uploadUrl: uploadUrl,
				editorCtx:null,
				editorHtml:'',
				sshow1:false,
				sobj:{},
				uid:null,
				mgclist:[],
        qunlist:[],
        qunobj:{}
			};
		},
    onShow(){
      let addressobj = getApp().globalData.targetAddress
      if (addressobj) {
        this.fobj.address = addressobj.address
        this.fobj.latitude = addressobj.latitude
        this.fobj.longitude = addressobj.longitude
        getApp().globalData.targetAddress = null
      }
    },
		onLoad(params) {
			this.uid = params.uid
			if (params.tid && params.tid !== 'undefined') {
				this.tid = params.tid

			}
			console.log('tttttttid:' + params.tid + " showdel:" + this.showdel)
			if (this.tid) {
				findj({
					params: {
						table: 'blog',
						id: this.tid
					}
				}).then(res => {
					this.fobj = res
          this.fobj.note = uni.itool.getHtmlNote(this.fobj.note)
          this.sobj.id = this.fobj.typeid
          this.sobj.title = this.fobj.typecn
					//this.filelist.push({url: this.fileUrl + res.img})
					console.log(this.imgfile)
					this.editorHtml = this.fobj.note
					this.editorCtx.setContents({
						html: this.fobj.note
					})
					
				}).catch(err => {

				})
			}
			
			listj({
				params: {
					table: 'type'
				}
			}).then(res => {
				for (let s of res) {
					s.name = s.title
				}
				this.typelist = res || []
			})

      listj({
        params: {
          table: 'qunzu',
          uid:this.userInfo.id
        }
      }).then(res => {
        this.qunlist = res
      })

			listj({
				params: {
					table: 'mgc'
				}
			}).then(res => {
				this.mgclist = res
			})
		},
		methods: {
			//...mapActions(['']),
			hideKeyboard: ideautil.hideKeyboard,
      chooseLocation(){
        uni.itool.toTxmapLocation()
      },
			getUploadImg(imgurl){
				if(imgurl){
					this.fobj.img = imgurl
				}
			},
			saveBlog() {
				this.editorCtx.getContents({
					success: res => {
						for (let s of this.mgclist) {
							if (res.html.indexOf(s.title) != -1) {
								uni.showToast({
									icon:'none',
									title: '包含敏感词!'
								})
								return
							}
						}
						this.fobj.note = res.html
						this.fobj.uid = this.userInfo.id
						this.fobj.username = this.userInfo.username
						this.fobj.typeid = this.sobj.id
						this.fobj.typecn = this.sobj.title
            this.fobj.qid = this.qunobj.id
            this.fobj.qtitle = this.qunobj.title
						let fdata = this.fobj
						fdata.table = "blog"
						fdata.zan = 1
						savej({
							params: fdata
						}).then(res => {
							uni.itool.nto({
								url: './bloglist'
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
			delBlog() {
				deletej({
					params: {
						table: 'blog',
						id: this.tid
					}
				}).then(res => {
					uni.itool.nto({
						url: './blog'
					})
				}).catch(err => {

				})
			},
			goBack() {
				uni.itool.nto({
					url:'/pages/blog/bloglist'
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
				this.fobj.typecn = e.name
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

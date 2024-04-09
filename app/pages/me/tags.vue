<template>
	<view>
		<u-navbar title="我的标签" :border="true" :placeholder="true" @leftClick="goBack"  :autoBack="false"></u-navbar>
		<scroll-view :enable-flex="true" class="svcontainer">
      <view>
        <view>
          <u-divider text="资源标签:"></u-divider>
        </view>
        <view style="display: flex;flex-wrap: wrap">
          <view  class="biaoqian" v-for="item in taglist">
            <u-tag @click="toggleTag(item)" :text="item.title" :plain="!item.checked" > </u-tag>
          </view>
        </view>
      </view>

      <view>
        <view>
          <u-divider text="兴趣爱好:"></u-divider>
        </view>
        <view style="display: flex;flex-wrap: wrap">
          <view  class="biaoqian" v-for="item in taglist2">
            <u-tag type="warning" @click="toggleTag(item)" :text="item.title" :plain="!item.checked" > </u-tag>
          </view>
        </view>
      </view>

      <view>
        <view>
          <u-divider text="技能标签:"></u-divider>
        </view>
        <view style="display: flex;flex-wrap: wrap">
          <view  class="biaoqian" v-for="item in taglist3">
            <u-tag type="error" @click="toggleTag(item)" :text="item.title" :plain="!item.checked" > </u-tag>
          </view>
        </view>
      </view>


			<view class="formitem">
			    <u-button type="primary" @click="saveTags" text="保存"></u-button>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { listSqlj, listj, findj, savej, deletej, fileUrl } from 'common/config/api.js'
	import { ideautil } from '@/common/commontools.js';
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				tid: null,
				fileUrl: fileUrl,
				fobj: {},
				taglist:[],
        taglist2:[],
        taglist3:[],
				tags:'',
        tags2:'',
        tags3:''
			};
		},
		onLoad(params) {

		},
		onShow(){
			let tags = this.userInfo.tags || ''
			tags = tags+""
			let taglist = tags.split(",")
			listj({params: {table: 'tags', btype:1 }}).then(res => {
				for (let s of res) {
					s.checked = false
				    for (let g of taglist) {
				        if (g == s.id) {
				        	s.checked = true
				        }
				    }
				}
				this.taglist = res

        let tags2 = this.userInfo.tags2 || ''
        tags2 = tags2+""
        let taglist2 = tags2.split(",")
        listj({params: {table: 'tags', btype:2 }}).then(res2 => {
          for (let s of res2) {
            s.checked = false
            for (let g of taglist2) {
              if (g == s.id) {
                s.checked = true
              }
            }
          }
          this.taglist2 = res2

          let tags3 = this.userInfo.tags3 || ''
          tags3 = tags3+""
          let taglist3 = tags3.split(",")
          listj({params: {table: 'tags', btype:3 }}).then(res3 => {
            for (let s of res3) {
              s.checked = false
              for (let g of taglist3) {
                if (g == s.id) {
                  s.checked = true
                }
              }
            }
            this.taglist3 = res3
          })
        })
			})





		},
		methods: {
			...mapActions(['updateUserInfo']),
			toggleTag(item){
				if(item.checked){
					item.checked = false
				}else{
					item.checked = true
				}
			},
			saveTags(){
				let tags = ''
        let note1 = ''
				for (let s of this.taglist) {
					if (s.checked) {
						if (tags) {
							tags+=","+s.id
              note1+=","+s.title
						}else{
							tags = s.id
              note1+=s.title
						}
					}

				}

        let tags2 = ''
        let note2 = ''
        for (let s of this.taglist2) {
          if (s.checked) {
            if (tags2) {
              tags2+=","+s.id
              note2+=","+s.title
            }else{
              tags2 = s.id
              note2+=s.title
            }
          }

        }

        let tags3 = ''
        let note3 = ''
        for (let s of this.taglist3) {
          if (s.checked) {
            if (tags3) {
              tags3+=","+s.id
              note3+=","+s.title
            }else{
              tags3 = s.id
              note3+=s.title
            }
          }

        }
				savej({params: {table:'user',id:this.userInfo.id,tags:tags,tags2:tags2,tags3:tags3,note1:note1,note2:note2,note3:note3}}).then(res => {
					this.userInfo.tags = tags
          this.userInfo.tags2 = tags2
          this.userInfo.tags3 = tags3
          this.userInfo.note1 = note1
          this.userInfo.note2 = note2
          this.userInfo.note3 = note3
					this.updateUserInfo(this.userInfo)
					uni.showToast({
						icon:'none',
						title: '操作成功!'
					})
				})
			},
			goBack(){
				uni.itool.nto({
					url:'/pages/me/me'
				})
			}
		},
		computed: {
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss">
	.biaoqian{
		min-width: 100rpx;margin-right: 10rpx;margin-bottom: 10rpx;
	}
</style>

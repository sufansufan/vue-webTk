<template>
  <div class="details-comment">
    <div class="comment-editor-rate flex">
      <div class="comment-editor">
        <div class="tit flex">
          <p>用户名
            <span>未做</span>
          </p>
          <div class="flex">
            评分：
            <el-rate v-model="rateEditVal"></el-rate>
          </div>
        </div>
        <mavon-editor v-model.trim="commentEditVal" placeholder="请输入..." ref="commentEdit" :toolbars="{}" :toolbarsFlag="false" :boxShadow="false" :subfield="false" defaultOpen="edit">
        </mavon-editor>
        <div class="comment-editor-btns flex">
          <i class="el-icon-plus" title="添加图片"></i>
          <el-button type="text" @click="submitComment">发表</el-button>
        </div>
      </div>
      <div class="comment-rate">
        <p>当前版本
          <span>4</span>
        </p>
        <el-rate disabled show-score score-template="{value}" :value="gradeInfo.gradeAvg">
        </el-rate>
        <div class="rate-list">
          <div class="flex" v-for="item in gradeInfo.gradeList" :key="item.gradeName">
            <span class="tit">{{item.gradeName}}星</span>
            <p :style="{width: item.gradeRate + '%'}">
              <span class="txt">{{item.gradeRate}}%</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-toolbars flex">
      <p>
        <b>评论</b>
        <span>共{{count}}条</span>
      </p>
      <div>
        <el-radio-group v-model="options.commentVersion" size="mini">
          <el-radio-button label="00001">当前版本评论</el-radio-button>
          <el-radio-button label="00002">全部评论</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="options.sort" size="mini">
          <el-radio-button v-for="item in $store.state.comment_list_orderby" :key="item.dictId" :label="item.dictValue">{{item.dictLabel}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="comment-list" v-loading="commentLoading">
      <div v-show="!count">暂无评论</div>
      <div class="flex" v-for="(item, index) in commentList" :key="item.id">
        <div class="user flex">
          <span>
            <i class="iconfont icon-yonghu"></i>
          </span>
          <div>
            <p>这是用户名</p>
            <span>未做</span>
          </div>
        </div>
        <div class="comment">
          <el-rate disabled :value="item.grade"></el-rate>
          <div class="comment-content">{{item.comment}}</div>
          <div class="comment-content-toolbars flex">
            <p>
              {{item.topicVersion || ""}}
              <span>{{item.createTime}}</span>
            </p>
            <div ref="badge">
              <el-badge :value="item.likeNumber || 0" @click.native="addPraiseNum(index, item.id)" tiptxt="+1">
                <i class="iconfont icon-qinziAPPtubiao-"></i>
              </el-badge>
              <i v-if="item.isEssence === '00001'" class="iconfont icon-jinghua"></i>
              <i class="iconfont icon-remen1"></i>
            </div>
          </div>
          <!-- <div class="author-reply">
            <p>作者回复：</p>
            <div class="author-reply-content">
              这道题出的不好，看着乱七八糟的这道题出的不好，看着乱七八糟的这道题出的不好
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination background :page-sizes="[5, 10, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 0,
      limit: 5,
      count: 0,
      rateEditVal: 5,
      commentEditVal: "",
      options: {
        commentVersion: "00002",
        sort: "03002"
      },
      commentLoading: true,
      gradeInfo: {},
      commentList: []
    };
  },
  created() {
    this.Util.base.getDictList("comment_list_orderby");
    this.getCommentList();
  },
  watch: {
    options: {
      handler() {
        this.getCommentList();
      },
      deep: true
    }
  },
  methods: {
    getCommentList() {
      this.commentLoading = true;
      this.$axios
        .post(this.reqLink.getTopicCommentList, {
          topicId: this.$route.params.id,
          page: this.page,
          limit: this.limit,
          isCurrentCommentType: this.options.commentVersion,
          commentListOrderBy: this.options.sort
        })
        .then(({ data }) => {
          this.gradeInfo = data.grade || {
            gradeList: [],
            gradeAvg: 0
          };
          this.commentList = data.commentList.map(item => {
            item.createTime &&
              (item.createTime = this.Util.fun.formatDate(
                item.createTime,
                "yyyy-MM-dd hh:mm:ss"
              ));
            return item;
          });
          this.count = ~~data.commentListCount;
          this.commentLoading = false;
        })
        .catch(() => {
          this.commentLoading = false;
        });
    },
    submitComment() {
      if (!this.commentEditVal) {
        this.Util.base.tips("请输入评论内容");
        return;
      }
      this.$axios
        .post(this.reqLink.createTopicComment, {
          topicId: this.$route.params.id,
          commentParentId: "",
          comment: this.commentEditVal,
          commentHtml: "",
          commentImageUrls: "",
          grade: this.rateEditVal,
          createBy: ""
        })
        .then(() => {
          this.commentEditVal = "";
          this.rateEditVal = 5;
          this.getCommentList();
        });
    },
    addPraiseNum(index, cid) {
      let badge = this.$refs.badge[index].classList;
      badge.remove("add");
      setTimeout(() => {
        badge.add("add");
      }, 0);
      this.$axios
        .post(this.reqLink.createtopicCommentLike, {
          commentId: cid,
          userId: "111s",
          supportOpposeInfo: "00001"
        })
        .then(() => {});
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getCommentList();
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getCommentList();
    }
  }
};
</script>

<style lang="scss">
@keyframes bar_plus {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.4);
  }
}
.details-comment {
  padding: 10px 5px;
  .comment-editor {
    width: calc(60% - 50px);
    margin-right: 50px;
    position: relative;
    .tit {
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      > p {
        span {
          padding-left: 30px;
          color: #898989;
        }
      }
      > div {
        align-items: center;
      }
    }
    .el-rate__icon {
      font-size: 22px;
    }
    .v-note-wrapper {
      min-height: 250px;
      height: 250px;
    }
    .comment-editor-btns {
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      z-index: 9999;
      width: 100%;
      bottom: 20px;
      padding: 0 20px;
      > .el-icon-plus {
        width: 38px;
        height: 38px;
        line-height: 38px;
        font-size: 20px;
        margin-bottom: 5px;
        text-align: center;
        color: #cacaca;
        border: 1px solid #ebebeb {
          radius: 3px;
        }
        cursor: pointer;
        &:hover {
          border-color: #909090;
          color: #909090;
        }
      }
    }
  }
  .comment-rate {
    padding-top: 30px;
    width: 350px;
    min-width: 350px;
    > p {
      color: #414141;
      margin-bottom: 20px;
      span {
        padding-left: 10px;
      }
    }
    .el-rate {
      height: auto;
      display: flex;
      .el-rate__icon {
        font-size: 38px;
      }
      .el-rate__text {
        font-size: 38px;
        order: -1;
        padding-right: 10px;
      }
    }
    .rate-list {
      padding-top: 30px;
      > div {
        box-sizing: border-box;
        align-items: center;
        padding: 0 40px 0 35px;
        position: relative;
        margin-bottom: 14px;
        .tit {
          color: #a8a8a8;
          position: absolute;
          left: 0;
        }
        > p {
          height: 18px;
          background: #c3e9ff;
          border-radius: 3px;
          position: relative;
          .txt {
            position: absolute;
            left: 100%;
            top: 1px;
            padding-left: 5px;
            text-align: center;
          }
        }
      }
    }
  }
  .comment-toolbars {
    line-height: 46px;
    background: #f7f7fa;
    margin-top: 20px;
    padding: 0 20px;
    justify-content: space-between;
    > p {
      > b {
        font-size: 16px;
      }
      > span {
        padding-left: 10px;
        color: #aaa;
      }
    }
    > div > div {
      margin-left: 20px;
    }
  }
  .comment-list {
    padding: 15px;
    > div {
      border-bottom: 1px solid #ebebeb;
      padding: 20px 0;
      > .user {
        width: 160px;
        min-width: 160px;
        margin-right: 20px;
        > span {
          padding-right: 15px;
          > i {
            font-size: 35px;
            color: #e2e2e2;
          }
          > img {
            width: 29px;
            height: 29px;
            border-radius: 50%;
          }
        }
        > div {
          padding-top: 7px;
          > p {
            color: #414141;
            padding-bottom: 7px;
          }
          > span {
            color: #999;
          }
        }
      }
      > .comment {
        padding-top: 4px;
        position: relative;
        width: 100%;
        > .comment-content {
          padding-top: 10px;
          line-height: 28px;
          font-size: 16px;
          color: #434343;
        }
        .comment-content-toolbars {
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          color: #999;
          > p > span {
            padding-left: 40px;
          }
          > div {
            &.add {
              .el-badge::before {
                display: block;
              }
            }
            .el-badge {
              &::before {
                content: attr(tiptxt);
                position: absolute;
                display: none;
                top: -23px;
                right: -15px;
                opacity: 0;
                width: 20px;
                height: 20px;
                color: $eleColor;
                animation: bar_plus 1s ease;
              }
              cursor: pointer;
              .el-badge__content {
                background: none;
                color: $eleColor;
              }
            }
            > .icon-jinghua {
              position: absolute;
              font-size: 48px;
              color: #f00;
              top: -8px;
              right: 0;
            }
            > .icon-remen1 {
              margin-left: 20px;
              font-size: 24px;
              color: #f00;
            }
          }
        }
        .author-reply {
          border-top: 1px solid #ebebeb;
          margin-top: 15px;
          padding-top: 15px;
          > p {
            color: $eleColor;
            padding-bottom: 10px;
          }
          > div {
            line-height: 28px;
            font-size: 16px;
            color: #434343;
          }
        }
      }
    }
  }
}
</style>

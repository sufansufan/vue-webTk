<template>
  <div class="all-question-box">
    <div class="flex">
      <div :class="{'tree-box-left': true, 'is-show-tree': !isShowType.includes('tree')}">
        <KnowledgeTree width="319px" height="calc(100vh - 240px)" @updataCommand="updataCommand" @treeCheck="treeCheck" noBor checkbox ref="tree"></KnowledgeTree>
      </div>
      <div class="content-box-right flex">
        <div class="subject-list">
          <el-collapse-transition>
            <div v-show="isShowType.includes('search')" class="subject-list-options">
              <dl v-for="o in options" :key="o.type">
                <dt>{{o.title}}：</dt>
                <dd>
                  <el-radio-group v-model="o.value" size="mini">
                    <el-radio-button label="all">全部</el-radio-button>
                    <el-radio-button v-for="item in $store.state[o.type]" :key="item.dictId" :label="item.dictTypeValue">{{item.dictTypeLabel}}
                      <i class="count">{{item.count}}</i>
                    </el-radio-button>
                  </el-radio-group>
                </dd>
              </dl>
            </div>
          </el-collapse-transition>
          <div class="subject-list-btns flex">
            <div class="flex">
              <span>显示：</span>
              <el-checkbox-group v-model="display" size="medium">
                <el-checkbox-button label="img">图片</el-checkbox-button>
                <el-checkbox-button label="type">选项</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div>
              <el-checkbox-group v-model="isShowType" size="medium">
                <el-checkbox-button label="tree">知识树</el-checkbox-button>
                <el-checkbox-button label="search">搜索条件</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div>
              <el-button type="primary" size="medium" @click="reOptions">重置搜索条件</el-button>
            </div>
            <div>
              <el-pagination background :page-sizes="sizes" :current-page="page + 1" :page-size="limit" layout="total, sizes, prev, slot, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                <slot>
                  <span class="page-slot">{{count ? page + 1 : 0}}/{{Math.ceil(count / limit)}}</span>
                </slot>
              </el-pagination>
            </div>
          </div>
          <div class="subject-list-sort-or-search flex">
            <div class="subject-sort">
              <span>排序方式：</span>
              <el-radio-group v-model="subjectSort" size="small" class="topic-sort">
                <el-radio-button v-for="item in topicSort" :class="{down: (sortType.type === item.dictValue && sortType.isASC === '00001')}" :key="item.dictId" :label="item.dictValue" @click.native.prevent="sortBy(item)">{{item.dictLabel}}</el-radio-button>
              </el-radio-group>
            </div>
            <div class="subject-search">
              <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="subjectSearch" @keyup.enter.native="handleSubjectSearch">
                <el-button slot="append" @click="handleSubjectSearch">搜索</el-button>
              </el-input>
            </div>
          </div>
          <div class="subject-content" v-loading="loading">
            <dl v-for="(item, index) in subjectList" :key="item.id" :class="{actived: isInTitCar(item.id), 'not-show-img': !display.includes('img') }">
              <dt>
                <b>{{index + 1 + page * limit}}</b>
                <div class="flex">
                  <b>{{item.year}}</b>
                  <span class="markdown-body" v-html="Util.fun.md2html(item.topicContent)"></span>
                </div>
              </dt>
              <dd v-show="display.includes('type')" class="answer-sort" :sort="item.topicOptionLayout">
                <div v-for="(answer, index) in item.topicAnswer" :key="answer.id" :class="{answer: true, 'right-key': answer.isCorrect === '00001'}">
                  <b>{{ answerOptions(index) }}</b>
                  <div class="answer-html markdown-body" v-html="Util.fun.md2html(answer.optionContent)"></div>
                  <i class="iconfont icon-duigou"></i>
                </div>
              </dd>
              <dd class="subjuect-item-no">
                ID 0{{item.number}}
              </dd>
              <dd class="subjuect-item-tools">
                <div>
                  <p @click="titleCarChange('add', item, $event)">
                    <el-button :type="titleCarCount(item.id, 'id') === 1 ? 'danger' : 'primary'" size="mini" :icon="titleCarCount(item.id, 'id') === 1 ? 'el-icon-delete' : 'el-icon-plus'"></el-button>
                    {{titleCarCount(item.id, 'id') === 1 ? '移出试题车' : '加入试题车'}}
                  </p>
                  <p>
                    <el-button type="primary" size="mini" icon="el-icon-download"></el-button>
                    下载
                  </p>
                  <p @click="$router.push({path: 'details/' + item.id})">
                    <el-button type="primary" size="mini" icon="el-icon-more"></el-button>
                    详情
                  </p>
                </div>
                <div>
                  <p>{{item.uploadDate}}</p>
                  <p>组卷
                    <span>{{item.groupPageNumber}}</span>
                  </p>
                  <p>真题
                    <span>{{item.realNumber}}</span>
                  </p>
                  <p>错误率
                    <span>{{item.mistakeRate}}</span>
                  </p>
                  <p>难度
                    <span>{{item.difficultLevel}}</span>
                  </p>
                  <p>评论数
                    <span>231</span>
                  </p>
                </div>
              </dd>
            </dl>
            <div v-show="!subjectList.length" class="empty-text">oh~~没有数据哦!</div>
            <div class="pagination">
              <el-pagination background :page-sizes="sizes" :current-page="page + 1" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="subject-cart" ref="cart">
          <div>
            <dl>
              <dt>
                <p><img src="@/assets/images/icon/gwc.png"></p>
                <b>试题车</b>
              </dt>
              <dd>
                <div>
                  <p>选择题</p>
                  <span>{{titleCarCount('00201')}}</span>
                </div>
                <div>
                  <p>填空题</p>
                  <span>{{titleCarCount('00202')}}</span>
                </div>
                <div>
                  <p>解答题</p>
                  <span>{{titleCarCount('00203')}}</span>
                </div>
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-delete" @click="titleCarChange('clear')">清空</el-button>
                </div>
              </dd>
            </dl>
          </div>
          <div>
            <el-button size="mini" type="text">进入组卷</el-button>
          </div>
          <div>
            <p><img src="@/assets/images/icon/phone.png"></p>
            客户端
          </div>
          <div>
            <el-button size="mini" type="text" @click.native="scrollTop">
              <b>TOP</b>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="cart-ball" ref="ball"></div>
  </div>
</template>

<script>
import KnowledgeTree from "../KnowledgeTree";
export default {
  components: {
    KnowledgeTree
  },
  data() {
    return {
      page: 0,
      limit: 5,
      sizes: [5, 10, 30, 50],
      count: 0,
      sizeChange: 10,
      display: ["img", "type"],
      loading: true,
      options: [
        {
          title: "题型",
          type: "subject_type",
          value: "all"
        },
        {
          title: "难度",
          type: "difficult_level",
          value: "all"
        },
        {
          title: "适用年级",
          type: "grade",
          value: "all"
        },
        {
          title: "教材版本",
          type: "textbook_version",
          value: "all"
        },
        {
          title: "来源",
          type: "source",
          value: "all"
        },
        {
          title: "年份",
          type: "year",
          value: "all"
        }
      ],
      isShowType: ["tree", "search"],
      subjectSort: "02801",
      sortType: {
        type: "02801",
        isASC: "00001"
      },
      subjectSearch: "",
      subjectList: [],
      titleCar: [],
      tree: {
        stu_department: {},
        stu_subject: {}
      },
      treeIds: [],
      topicSort: []
    };
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    },
    treeIds: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  created() {
    this.Util.base.getDictList("subject_type", true);
    this.Util.base.getDictList("textbook_version", true);
    this.Util.base.getDictList("year", true);
    this.Util.base.getDictList("source", true);
    this.Util.base.getDictList("grade", true);
    this.Util.base.getDictList("difficult_level", true);
    this.Util.base.getDictList("topic_sort_way");
    this.$nextTick().then(() => {
      this.topicSort = this.$store.state.topic_sort_way.map(item => {
        if (item.dictValue !== "02801") {
          item.isASC = "00001";
        }
        return item;
      });
    });
    this.getData();
  },
  methods: {
    answerOptions(ind) {
      return this.Util.fun.getAnswerOpt(ind);
    },
    sortBy(item) {
      this.subjectSort = item.dictValue;
      if (this.sortType.type === item.dictValue && item.dictValue !== "02801") {
        this.sortType.isASC =
          this.sortType.isASC === "00002" ? "00001" : "00002";
      } else {
        this.sortType = {
          type: item.dictValue,
          isASC: item.dictValue === "02801" ? "00001" : "00002"
        };
      }
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$axios
        .post(this.reqLink.getTopicList, {
          page: this.page,
          limit: this.limit,
          topicInfo: {
            idAndTopicName: this.subjectSearch,
            startDate: "",
            endDate: "",
            status: "",
            uploadUser: {
              phone: "",
              userName: ""
            },
            checkUser: {
              phone: "",
              userName: ""
            },
            recheckUser: {
              phone: "",
              userName: ""
            },
            checkStartDate: "",
            checkEndDate: "",
            recheckStartDate: "",
            recheckEndDate: "",
            value: "",
            stuDepartment: "",
            stuSubject: "",
            topicClasses: this.getOptions("subject_type"),
            userGrede: this.getOptions("grade"),
            source: this.getOptions("source"),
            knowledgeId: this.treeIds.join(","),
            difficultLevel: this.getOptions("difficult_level"),
            textbookVersion: this.getOptions("textbook_version"),
            year: this.getOptions("year"),
            memberLabelIds: "",
            sortType: [this.sortType]
          }
        })
        .then(({ data }) => {
          this.count = data.count || 0;
          this.subjectList = data.list;
          this.subjectList.map(item => {
            item.uploadDate &&
              (item.uploadDate = this.Util.fun.formatDate(
                item.uploadDate,
                "yyyy-MM-dd"
              ));
            return item;
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOptions(type) {
      let value = this.options.filter(item => item.type === type)[0]["value"];
      return value === "all" ? "" : value;
    },
    reOptions() {
      this.options = this.options.map(item => {
        item.value = "all";
        return item;
      });
    },
    titleCarChange(type, item, e) {
      switch (type) {
        case "add":
          if (this.titleCar.some(v => v.id === item.id)) {
            const index = this.titleCar.findIndex(v => v.id === item.id);
            this.titleCar.splice(index, 1);
          } else {
            this.titleCar.push(item);
            const cart = this.$refs.cart,
              ball = this.$refs.ball.cloneNode(true);
            document.body.appendChild(ball);
            ball.style.left = e.pageX + "px";
            ball.style.top = e.pageY + "px";
            ball.style.display = "block";
            ball.style.visibility = "initial";
            setTimeout(() => {
              ball.style.left = cart.offsetLeft + 27 + "px";
              ball.style.top = cart.offsetTop + 16 + "px";
              ball.style.visibility = "hidden";
            }, 1);
          }
          break;
        case "clear":
          this.titleCar = [];
          break;
      }
    },
    titleCarCount(val, type = "topicClasses") {
      let count = this.titleCar.filter(item => item[type] === val);
      return count.length;
    },
    isInTitCar(id) {
      return this.titleCar.some(item => item.id === id);
    },
    updataCommand(item) {
      this.tree[item.dictType] = item;
    },
    treeCheck(id, checked) {
      if (checked) {
        this.treeIds.push(id);
      } else {
        this.treeIds.splice(this.treeIds.findIndex(item => item === id), 1);
      }
    },
    scrollTop() {
      document.querySelector(".el-main").scrollTop = 0;
    },
    handleSubjectSearch() {
      this.getData("search");
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getData();
    }
  }
};
</script>

<style lang="scss">
.all-question-box {
  .tree-box-left {
    background: #fff;
    padding: 20px 0 20px 20px;
    margin-right: 26px;
    transition: all 0.5s;
    &.is-show-tree {
      width: 0;
      overflow: hidden;
      padding: 0;
      margin: 0;
    }
  }
  .content-box-right {
    width: 100%;
    .subject-list {
      width: calc(100% - 95px);
      padding: 20px;
      background: #fff;
      .subject-list-options {
        border: 1px solid #ebebeb {
          radius: 4px;
        }
        padding: 0 15px;
        dl {
          display: flex;
          border-bottom: 1px dotted #d9d9d9;
          line-height: 39px;
          &:last-child {
            border: none;
          }
          dt {
            color: #a7a7a7;
            padding: 0 10px;
            width: 100px;
            min-width: 100px;
          }
          dd {
            display: flex;
            flex-wrap: wrap;
            &:hover .el-radio-group .count {
              display: block;
            }
            .el-radio-group {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              line-height: 40px;
              position: relative;
              .count {
                display: none;
                position: absolute;
                bottom: -12px;
                left: 50%;
                transform: translateX(-50%);
                font-style: initial;
                font-size: 12px;
                color: #929292;
              }
              .is-active .el-radio-button__inner {
                background: none !important;
                color: $eleColor !important;
              }
              .el-radio-button__inner {
                margin-right: 38px;
                color: #3f3f3f !important;
                cursor: pointer;
                border: 0;
                padding: 0;
                font-size: 14px;
              }
              .el-radio-button:focus:not(.is-focus):not(:active),
              .el-radio-button__orig-radio:checked + .el-radio-button__inner {
                box-shadow: none !important;
              }
            }
          }
        }
      }
      .subject-list-btns {
        margin: 20px 30px 0;
        justify-content: space-between;
        flex-wrap: wrap;
        > div {
          align-items: center;
          margin: 0 20px 20px 0;
        }
        .page-slot {
          padding: 0 5px;
          background-color: #f4f4f5;
          color: #606266;
          min-width: 30px;
          border-radius: 2px;
          height: 28px !important;
          line-height: 28px !important;
          text-align: center;
        }
      }
      .subject-list-sort-or-search {
        background: #f7f7fa;
        line-height: 46px;
        align-items: center;
        justify-content: space-between;
        .subject-sort {
          > span {
            color: #999;
            padding: 0 30px;
          }
          .el-radio-button:focus:not(.is-focus):not(:active) {
            box-shadow: none !important;
          }
          .topic-sort > label:first-child ~ label {
            position: relative;
            > span {
              padding: 9px 25px 9px 15px;
            }
            &.is-active {
              &::after {
                border-bottom-color: #fff;
              }
              &::before {
                border-top-color: #2bad82;
              }
            }
            &.down {
              &::after {
                border-bottom-color: #2bad82;
              }
              &::before {
                border-top-color: #fff;
              }
            }
            &::after,
            &::before {
              content: "";
              width: 0;
              height: 0;
              position: absolute;
              right: 6px;
              top: 4px;
              border: 6px solid;
              border-color: transparent transparent #ddd transparent;
            }
            &::before {
              top: 18px;
              border-color: #ddd transparent transparent transparent;
              z-index: 9;
            }
          }
        }
        .subject-search {
          margin-right: 5px;
        }
      }

      .subject-content {
        .empty-text {
          display: block;
          text-align: center;
          padding: 20px 0 0;
        }
        dl {
          margin: 10px 0;
          position: relative;
          border: 1px solid #ebebeb {
            radius: 4px;
          }
          transition: all 0.5s;
          &.not-show-img img {
            display: none;
          }
          &.actived {
            // box-shadow: 0 0 5px $eleColor;
            // background: linear-gradient(#fff 73%, $eleColor);
            border-color: $eleColor;
          }
          dt {
            padding: 15px;
            display: flex;
            > b {
              padding-right: 20px;
            }
            line-height: 24px;
            > div > b {
              color: $eleColor;
              padding-right: 10px;
            }
          }
          dd {
            margin: 15px 28px;
            &,
            > div {
              display: flex;
            }
            > div:not(.subjuect-item-tools) {
              line-height: 42px;
              background: #f9f9fb;
              padding: 0 10px;
              b {
                padding-right: 15px;
                color: $eleColor;
                font-size: 20px;
              }
            }
            &.subjuect-item-no {
              margin: 0;
              padding: 0 30px 10px 0;
              justify-content: flex-end;
              color: #959595;
            }
            &.subjuect-item-tools {
              margin: 0;
              padding: 0;
              height: 40px;
              background: #f7f7fa;
              width: 100%;
              > div:first-child {
                margin-left: 15px;
                flex: 1;
                > p {
                  width: -webkit-fill-available;
                  min-width: max-content;
                  cursor: pointer;
                  &:hover {
                    color: $eleColor;
                  }
                }
                .el-button {
                  padding: 3px 5px;
                }
              }
              > div:last-child {
                display: flex;
                justify-content: flex-end;
                flex: 1.5;
                p {
                  width: -webkit-fill-available;
                  min-width: max-content;
                  span {
                    color: $eleColor;
                    padding-left: 5px;
                  }
                }
              }
            }
            &.answer-sort {
              flex-wrap: wrap;
              justify-content: space-between;
              > .answer {
                margin-bottom: 20px;
                position: relative;
                .answer-html {
                  overflow: hidden;
                  width: 100%;
                  padding: 15px 0;
                  .base {
                    display: inline-flex;
                    flex-wrap: wrap;
                  }
                }
                .iconfont {
                  display: none;
                }
                &.right-key {
                  .iconfont {
                    // display: block;
                    position: absolute;
                    bottom: -5px;
                    right: -15px;
                    font-size: 60px;
                    color: $eleColor;
                    &::after {
                      content: "正确答案";
                      transform: rotate(-44deg);
                      position: absolute;
                      font-size: 12px;
                      left: 12px;
                      top: -22px;
                    }
                  }
                }
              }
              &[sort="01801"] > div {
                width: calc(100% - 32px) !important;
              }
              &[sort="01802"] > div {
                width: calc(50% - 32px) !important;
              }
              &[sort="01803"] > div {
                width: calc(25% - 32px) !important;
              }
            }
          }
        }
      }
    }
    .subject-cart {
      position: fixed;
      right: 7px;
      top: calc(50% - 234px);
      color: #434343;
      transition: all 0.5s;
      > div {
        background: #fff;
        width: 69px;
        border: 1px solid #ebecf0;
        border-right: none;
        margin-bottom: 10px;
        text-align: center;
        padding: 10px 0;
        border-radius: 4px 0 0 4px;
        &:first-child {
          padding-bottom: 6px;
        }
        &:nth-child(3) > p {
          padding-bottom: 5px;
        }
        > .el-button--text.el-button--mini {
          padding: 0;
        }
        > dl {
          dt > p {
            padding-bottom: 5px;
          }
          dd > div {
            margin: 0 6px;
            border-top: 1px solid #f0f0f0;
            padding-top: 10px;
            &:not(:last-child) {
              margin-top: 10px;
            }
            font-size: 12px;
            &:last-child {
              text-align: left;
              border: 0;
              .el-button--mini {
                padding: 7px 8px;
              }
            }
            & > span {
              display: block;
              padding-top: 5px;
              color: $eleColor;
            }
          }
        }
      }
    }
  }
}
.cart-ball {
  display: none;
  position: absolute;
  width: 20px;
  height: 20px;
  background: #2fb48a;
  border-radius: 50%;
  left: 0;
  top: 0;
  transition: 0.5s top linear, 0.5s left ease-in, 0.1s 0.5s visibility linear;
}
</style>

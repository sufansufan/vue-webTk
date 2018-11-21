<template>
  <div class="analysis-template">
    <el-tabs v-model="editableTabsId" type="card" editable @edit="handleTabsEdit" @tab-click="tabsClick">
      <el-tab-pane v-for="(item, i) in editableTabs" :key="item.id" :label="item.analysisTempleteName" :name="item.id">
        <div class="analysis-content">
          <div class="align-right flex">
            <el-select v-model="topicAnalysisId" placeholder="请选择" @change="val => analysisTempChange(val, i)">
              <el-option v-for="item in analysisOptions" :key="item.id" :label="item.analysisTempleteName" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="analysis-setp">
            <div v-for="(stepItem, ind) in analysisSetpContent" v-if="item.topicAnalysisTempleteExpand[ind]" :key="stepItem.id">
              <p>{{stepItem.topicAnalysisTempleteExpand}}</p>
              <div v-if="stepItem.richTextType === '01601'">
                <mavon-editor v-model="item.topicAnalysisTempleteExpand[ind].analysisContent[0].stepContent" placeholder="请输入..." :ref="'mdEditor_' + i + '_' + ind" @imgAdd="(filename, url) => $imgAdd('mdEditor_' + i + '_' + ind, filename, url)" @imgDel="$imgDel"></mavon-editor>
              </div>
              <div v-else-if="stepItem.richTextType === '01602'">
                <div v-for="(step, index) in item.topicAnalysisTempleteExpand[ind].analysisContent" :key="index" :ref="'stepItem'+i" @click="editStep(i, ind, index, step)">
                  <div class="step-item flex">
                    <b class="ind">{{index + 1}}</b>
                    <div class="answer-html markdown-body" v-html="Util.fun.md2html(step.stepContent)"></div>
                    <div class="icon-operation">
                      <i class="el-icon-error delete" @click.prevent="delStep(index, item.topicAnalysisTempleteExpand[ind].analysisContent)"></i>
                      <i class="el-icon-edit editing"></i>
                    </div>
                  </div>
                </div>
                <div class="add-step flex">
                  <el-button type="primary" size="mini" icon="el-icon-plus" @click="addStep(i, ind, item.topicAnalysisTempleteExpand[ind].analysisContent)"></el-button>
                  添加步骤
                </div>
                <mavon-editor v-model="editorVal" placeholder="请输入..." :editable="checkedAnalysisNo !== null" ref="mdStepEditor" @imgAdd="(filename, url) => $imgAdd('mdStepEditor', filename, url)" @imgDel="$imgDel"></mavon-editor>
              </div>
              <div v-else>
                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="item.topicAnalysisTempleteExpand[ind].analysisContent[0].stepContent">
                </el-input>
              </div>
            </div>
            <div class="flex saved-step">
              <el-button type="primary" icon="el-icon-check" @click="savedAnalysis(item)">保存</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="!editableTabs.length">请添加解析</div>
  </div>
</template>

<script>
export default {
  props: {
    add: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      labelContentLoading: true,
      editableTabsId: "",
      topicAnalysisId: "",
      labelCheckedVal: "",
      editableTabs: [],
      analysisOptions: [],
      analysisSetpContent: [],
      editorVal: "选择需要编辑的题目",
      checkedAnalysisNo: null,
      analysisStepOpts: [],
      imgFiles: {}
    };
  },
  created() {
    this.Util.base.getDictList("rich_text_type");
    !this.add &&
      this.getData(() => {
        if (this.editableTabs.length) {
          this.editableTabsId = this.editableTabs[0].id;
          this.topicAnalysisId = this.editableTabs[0].topicAnalysisId;
        }
      });

    this.getAnalysisOptions().then(() => {
      this.renderAnalysis();
    });
  },
  watch: {
    editorVal(nVal, oVal) {
      if (this.checkedAnalysisNo === null) {
        return;
      }
      let { tabIndex, itemIndex, index } = this.checkedAnalysisNo;
      this.editableTabs[tabIndex].topicAnalysisTempleteExpand[
        itemIndex
      ].analysisContent[index].stepContent = nVal;
    },
    editableTabsId(prev, next) {
      if (prev !== "0") {
        this.labelCheckedVal = this.editableTabs.filter(
          item => item.id === this.editableTabsId
        )[0].analysisTempleteName;
        this.renderAnalysis();
      }
    }
  },
  methods: {
    getData(succ) {
      this.$axios
        .post(this.reqLink.getKonwledgeAnalysis, {
          id: this.$route.params.id,
          userId: this.$store.state.user.userId
        })
        .then(({ data }) => {
          this.editableTabs = data.list || [];
          succ && succ();
        });
    },
    getAnalysisOptions() {
      return this.$axios
        .post(this.reqLink.getTopicAnalysisTempleteList, {
          stuDepartment: "",
          stuSubject: ""
        })
        .then(({ data }) => {
          this.analysisOptions = data.list || [];
          if (this.analysisOptions.length) {
            let content = this.analysisOptions.filter(
              item => item.id === this.topicAnalysisId
            )[0];
            this.initAnalysisObj(
              content
                ? content.analysisTempleteContent
                : this.analysisOptions[0].analysisTempleteContent
            );
          }
        });
    },
    tabsClick(item) {
      this.editorVal = "选择需要编辑的题目";
      this.checkedAnalysisNo = null;
      let index = item.index;
      this.topicAnalysisId = this.editableTabs[index].topicAnalysisId;
      this.toggleActiveClass(index);
    },
    toggleActiveClass(index, itemIndex = null) {
      this.$nextTick().then(() => {
        let refs = this.$refs["stepItem" + index] || [];
        refs.forEach((item, i) => {
          item.classList[i === itemIndex ? "add" : "remove"]("actived");
        });
      });
    },
    analysisTempChange(itemId, index) {
      let oldId = this.editableTabs[index].topicAnalysisId;
      if (oldId !== itemId) {
        this.$confirm(`是否确认切换解析模板(切换后数据将丢失)?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.initAnalysisObj(
              this.analysisOptions.filter(item => item.id === itemId)[0]
                .analysisTempleteContent
            );
            this.editableTabs[index].topicAnalysisId = itemId;
            this.editableTabs[index].topicAnalysisTempleteExpand = JSON.parse(
              JSON.stringify(this.analysisStepOpts)
            );
            this.renderAnalysis();
            this.savedAnalysis(this.editableTabs[index]);
          })
          .catch(() => {
            this.topicAnalysisId = oldId;
          });
      }
      // this.topicAnalysisId = "";
    },
    addStep(tabIndex, ind, item) {
      let index = item.length;
      this.toggleActiveClass(tabIndex, index);
      item.push({
        id: "",
        stepNumber: "",
        stepContent: "",
        stepContentHtml: ""
      });
      this.checkedAnalysisNo = {
        tabIndex,
        itemIndex: ind,
        index
      };
      this.editorVal = item[index].stepContent;
    },
    editStep(tabIndex, itemIndex, index, item) {
      this.toggleActiveClass(tabIndex, index);
      this.checkedAnalysisNo = {
        tabIndex,
        itemIndex,
        index
      };
      this.editorVal = item.stepContent;
    },
    delStep(index, item) {
      this.$confirm(`是否删除该步骤-${index + 1}-?`, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          item.splice(index, 1);
          this.editorVal = "选择需要编辑的题目";
          this.checkedAnalysisNo = null;
        })
        .catch(() => {});
    },
    renderAnalysis() {
      this.editableTabs.length &&
        this.analysisOptions.forEach(item => {
          if (item.id === this.topicAnalysisId) {
            this.analysisSetpContent = item.analysisTempleteContent;
          }
        });
    },
    initAnalysisObj(arr) {
      this.analysisStepOpts = arr.map(item => ({
        topicAnalysisTempleteId: item.id,
        analysisContent: [
          {
            id: "",
            stepNumber: "",
            stepContent: "",
            stepContentHtml: ""
          }
        ]
      }));
    },
    savedAnalysis(item) {
      this.$axios
        .post(this.reqLink.createAndUpdateKonwledgeAnalysis, {
          Loading: true,
          topicId: this.$route.params.id,
          analysis: [item]
        })
        .then(res => {
          this.getData();
          this.Util.base.tips("操作成功！", "success");
        });
    },
    $imgAdd(editor, pos, $file) {
      // 缓存图片信息
      this.imgFiles[pos] = $file;
      this.uploadImg(editor);
    },
    $imgDel(pos) {
      delete this.imgFiles[pos];
    },
    uploadImg(editor) {
      let formData = new FormData();
      for (let _img in this.imgFiles) {
        formData.append("files", this.imgFiles[_img]);
      }
      this.$axios
        .post(this.reqLink.uploadFile, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(({ data }) => {
          let urls = data.data.urls;
          urls.forEach((item, index) => {
            this.$refs[editor][0].$img2Url(index, this.$http + item);
          });
          formData = null;
        });
    },
    handleTabsEdit(itemId, action) {
      if (action === "add") {
        let len = this.editableTabs.length,
          lastItem = this.editableTabs[this.editableTabs.length - 1],
          index = lastItem ? lastItem.sort + 1 : 0,
          o = JSON.parse(JSON.stringify(this.editableTabs));
        o.push({
          id: "",
          topicAnalysisId: len
            ? this.topicAnalysisId
            : this.analysisOptions[0].id,
          sort: index,
          topicAnalysisTempleteExpand: JSON.parse(
            JSON.stringify(this.analysisStepOpts)
          )
        });
        this.$axios
          .post(this.reqLink.createAndUpdateKonwledgeAnalysis, {
            Loading: true,
            topicId: this.$route.params.id,
            analysis: o
          })
          .then(res => {
            this.getData();
            this.Util.base.tips("添加成功！", "success");
          });
      }
      if (action === "remove") {
        let index = this.editableTabs.findIndex(item => item.id === itemId);
        this.$confirm(`是否删除该标签页？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$axios
              .post(this.reqLink.deleteTopicAnalysis, {
                Loading: true,
                id: itemId
              })
              .then(res => {
                this.getData(() => {
                  if (
                    this.editableTabsId === itemId &&
                    this.editableTabs.length
                  ) {
                    this.editableTabsId = this.editableTabs[
                      this.editableTabs.index - 1
                    ].id;
                  }
                });
                this.Util.base.tips("删除成功！", "success");
              });
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss">
.analysis-template {
  background: #fff;
  padding: 15px 0;
  .align-right {
    justify-content: flex-end;
  }
  .parsing-content {
    > .title {
      align-items: center;
      margin-top: 10px;
      > div {
        margin-right: 15px;
      }
    }
  }

  .el-tabs__nav-scroll {
    overflow: initial;
  }
  .el-tabs--card > .el-tabs__header {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    .el-tabs__item.is-active.is-closable {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        background: #fff;
        width: 100%;
        height: 1px;
      }
    }
  }
  .analysis-setp {
    .saved-step {
      justify-content: center;
    }
    > div {
      margin: 0 20px 20px;
      > p {
        padding: 20px 0;
        color: #828282;
      }
      .add-step {
        background: #f7f7fa;
        height: 40px;
        margin-bottom: 20px;
        padding: 0 15px;
        justify-content: flex-end;
        align-items: center;
        .el-button--mini {
          padding: 5px 7px;
          margin-right: 10px;
        }
      }
      .actived {
        .step-item {
          border-color: $eleColor;
          .icon-operation .editing {
            display: block;
          }
        }
      }
      .step-item {
        position: relative;
        padding: 10px 70px 15px 15px;
        min-height: 65px;
        border: 1px solid #ebebeb {
          radius: 3px;
        }
        > .answer-html {
          overflow: hidden;
          width: 100%;
          padding-bottom: 15px;
          .base {
            display: inline-flex;
            flex-wrap: wrap;
          }
        }
        margin-bottom: 15px;
        .ind {
          font-size: 18px;
          color: $eleColor;
          padding-right: 15px;
        }
        .icon-operation {
          color: $eleColor;
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column-reverse;
          justify-content: flex-end;
          .editing {
            font-size: 35px;
            margin-bottom: 5px;
            display: none;
          }
          .delete {
            display: none;
            font-size: 35px;
            cursor: pointer;
          }
        }
        &:hover {
          .delete {
            display: block;
          }
        }
      }
    }
  }
}
</style>

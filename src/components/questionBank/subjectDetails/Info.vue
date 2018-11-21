<template>
  <div class="details-info">
    <el-form :model="options" :rules="rules" ref="ruleForm" label-width="6px">
      <div class="details-info-options">
        <div class="flex">
          <div class="tit">题目来源：</div>
          <el-form-item label="*" prop="topicType">
            <el-select v-model="options.topicType" placeholder="来源">
              <el-option v-for="item in $store.state.topic_type" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*" v-show="options.topicType === '02202'" prop="topicSource.source">
            <el-select v-model="options.topicSource.source" placeholder="来源">
              <el-option v-for="item in $store.state.source" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="*" v-show="options.topicType === '02202' && options.topicSource.source === '00508'" prop="topicSource.value">
            <div class="inp">
              <el-input v-model="customVal" :placeholder="customLabel.length === 5 ? '' : '自定义标签，逗号隔开最多五个'" :disabled="customLabel.length === 5">
                <div v-show="customLabel.length" slot="prepend">
                  <el-tag type="success" closable v-for="(item, index) in customLabel" :key="index" @close="removeTag(index)">{{item}}</el-tag>
                </div>
              </el-input>
            </div>
          </el-form-item>
        </div>
        <div class="flex">
          <div class="tit">标签：</div>
          <div>
            <div class="flex">
              <el-form-item label="*" prop="stuDepartment">
                <el-select v-model="options.stuDepartment" placeholder="学部">
                  <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*" prop="stuSubject">
                <el-select v-model="options.stuSubject" placeholder="科目">
                  <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*" prop="topicClasses">
                <el-select v-model="options.topicClasses" placeholder="题型">
                  <el-option v-for="item in $store.state.subject_type" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="memberLabelArr">
                <el-select class="inp" v-model="memberLabelArr" multiple filterable default-first-option placeholder="请选择会员级别">
                  <el-option v-for="item in memberLevel" :key="item.id" :label="item.memName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flex" style="align-items: end;">
              <el-form-item>
                <el-select v-model="options.knowledgeId" placeholder="知识点选择">
                  <el-option v-for="(item, index) in selectedTree" :key="index" :label="index" :value="index">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="*" prop="difficultLevel">
                <el-select v-model="options.difficultLevel" placeholder="难度选择">
                  <el-option v-for="item in $store.state.difficult_level" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="textbookVersion">
                <el-select v-model="options.textbookVersion" placeholder="教材版本">
                  <el-option v-for="item in $store.state.textbook_version" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="year">
                <el-select v-model="options.year" placeholder="年份选择">
                  <el-option v-for="item in $store.state.year" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" @click="$refs['ruleForm'].resetFields()">清除设置条件</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="details-info-editor">
        <p class="tit">题目内容</p>
        <div class="editor-box">
          <mavon-editor v-model="editorVal" placeholder="请输入..." ref="editorContent" @imgAdd="(filename, url) => $imgAdd('editorContent', filename, url)" @imgDel="$imgDel"></mavon-editor>
        </div>
      </div>
      <div class="subject-options">
        <div class="flex">
          <p class="tit">题目选项</p>
          <div>
            布局：
            <el-radio-group v-model="options.topicOptionLayout" size="mini">
              <el-radio-button v-for="item in $store.state.topic_option_layout" :key="item.dictValue" :label="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="answer-list flex" :sort="options.topicOptionLayout">
          <div ref="answerList" v-for="(item, index) in topicInfo.topicAnswer" :key="index" :class="{'right-key': item.isCorrect === '00001'}" @click="editAnswer(index, item)">
            <b class="answer-ind">{{ Util.fun.getAnswerOpt(index) }}</b>
            <div class="answer-html markdown-body" v-html="Util.fun.md2html(item.optionContent)"></div>
            <div class="is-correct" @click.prevent="isCorrectChange(index)">
              <el-checkbox>正确答案</el-checkbox>
            </div>
            <div class="icon-operation">
              <i class="el-icon-error delete" @click.prevent="deleteAnswer(index)"></i>
              <i class="el-icon-edit editing"></i>
            </div>
            <i class="iconfont icon-duigou"></i>
          </div>
          <div v-show="topicInfo.topicAnswer && topicInfo.topicAnswer.length < 8" @click="addAnswer">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div class="editor-box">
          <mavon-editor v-model="answerEditorVal" placeholder="请输入..." :editable="checkedAnswerNo !== null" ref="answerEditor" @imgAdd="(filename, url) => $imgAdd('answerEditor', filename, url)" @imgDel="$imgDel"></mavon-editor>
        </div>
      </div>
      <div class="answer-btns">
        <el-button type="primary" @click="savedInfo('ruleForm')">保存</el-button>
        <el-button type="primary">保存并提交至下一步</el-button>
      </div>
    </el-form>
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
      xx: "",
      topicInfo: {
        id: "",
        topicAnswer: [],
        topicContentHtml: "",
        status: "",
        isFromFactory: "",
        isPutaway: "",
        currExeFlowId: "",
        intoStatus: "",
        version: "",
        uploadDate: ""
      },
      memberLevel: [],
      selectedTree: [],
      customVal: "",
      customArr: [],
      memberLabelArr: ["1"],
      options: {
        stuSubject: "",
        stuDepartment: "",
        topicType: "",
        topicClasses: "",
        difficultLevel: "",
        textbookVersion: "",
        memberLabelIds: "",
        year: "",
        topicSource: {
          id: "",
          source: "",
          value: ""
        },
        knowledgeId: "",
        topicOptionLayout: "01803"
      },
      rules: {
        topicType: [
          { required: true, message: "请选择来源", trigger: "change" }
        ],
        stuDepartment: [
          { required: true, message: "请选择学部", trigger: "change" }
        ],
        stuSubject: [
          { required: true, message: "请选择科目", trigger: "change" }
        ],
        topicClasses: [
          { required: true, message: "请选择题型", trigger: "change" }
        ],
        difficultLevel: [
          { required: true, message: "请选择难度", trigger: "change" }
        ]
      },
      editorVal: "", // $${1+\frac{e^{-8pi}}{1+x}}$$
      imgFiles: {}, // 图片容器
      answerEditorVal: "选择需要编辑的题目",
      checkedAnswerNo: null
    };
  },
  created() {
    this.Util.base.getDictList("topic_type");
    this.Util.base.getDictList("source");
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("subject_type");
    this.Util.base.getDictList("difficult_level");
    this.Util.base.getDictList("textbook_version");
    this.Util.base.getDictList("year");
    this.Util.base.getDictList("topic_option_layout");
    !this.add && this.getData();
    this.getMemberLevel();
  },
  watch: {
    answerEditorVal(nVal, oVal) {
      if (this.checkedAnswerNo === null) {
        return;
      }
      this.topicInfo.topicAnswer[this.checkedAnswerNo].optionContent = nVal;
    }
  },
  computed: {
    customLabel() {
      this.customVal = this.customVal.replace("，", ",");
      this.customArr.push(...this.customVal.split(","));
      this.customArr.pop();
      this.customArr.map(item => {
        this.customVal = this.customVal.replace(item + ",", "");
      });
      return this.customArr;
    }
  },
  methods: {
    getData() {
      this.$axios
        .post(this.reqLink.getTopicInfo, {
          id: this.$route.params.id
        })
        .then(({ data }) => {
          const info = data.topicInfo;
          // this.topicInfo = data.topicInfo;
          const null2Str = o => {
            if (o.topicSource === null) {
              o.topicSource = {
                id: "",
                source: "",
                value: ""
              };
            }
            for (let i in o) {
              if (toString.call(o[i]) === "[object Null]") o[i] = "";
              // else if (toString.call(o[i]) === "[object Object]")
              //   null2Str(o[i]);
            }
          };
          null2Str(info);
          for (let i in this.topicInfo) {
            this.topicInfo[i] = info[i];
          }
          for (let i in this.options) {
            this.options[i] = info[i];
          }
          this.editorVal = this.options.topicContent;
          this.customArr = this.options.topicSource.value.split(",");
          this.memberLabelArr =
            this.options.memberLabelIds === ""
              ? []
              : this.options.memberLabelIds.split(",");
          // this.options = Object.assign({}, this.options, this.topicInfo);
        });
    },
    getMemberLevel() {
      this.$axios.post(this.reqLink.getMemberList, {}).then(({ data }) => {
        this.memberLevel = data.memberList;
      });
    },
    removeTag(index) {
      this.options.topicSource.value.splice(index, 1);
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
          let urls = data.urls;
          urls.forEach((item, index) => {
            this.$refs[editor].$img2Url(index, this.$http + item);
          });
          formData = null;
        });
    },
    editAnswer(index, item) {
      this.answerEditorVal = item.optionContent;
      this.notCheckedAnswer(index);
    },
    addAnswer() {
      this.topicInfo.topicAnswer.push({
        id: "",
        isCorrect: "00002",
        itemSort: "",
        optionContent: "",
        optionContentHtml: ""
      });
      this.$nextTick(() => {
        this.notCheckedAnswer(this.topicInfo.topicAnswer.length - 1, "add");
      });
    },
    deleteAnswer(index) {
      this.notCheckedAnswer();
      this.$confirm(
        `是否删除该答案-${this.Util.fun.getAnswerOpt(index)}-?`,
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.topicInfo.topicAnswer.splice(index, 1);
          this.checkedAnswerNo = null;
          this.answerEditorVal = "选择需要编辑的题目";
        })
        .catch(() => {});
    },
    isCorrectChange(index) {
      this.notCheckedAnswer();
      this.topicInfo.topicAnswer = this.topicInfo.topicAnswer.map((item, i) => {
        item.isCorrect = i === index ? "00001" : "00002";
        return item;
      });
    },
    savedInfo(formName) {
      if (this.options.topicType === "02202") {
        this.rules = Object.assign({}, this.rules, {
          "topicSource.source": [
            { required: true, message: "请选择题目类型来源", trigger: "change" }
          ]
        });
        if (this.options.topicSource.source === "00508") {
          this.rules = Object.assign({}, this.rules, {
            "topicSource.value": [
              { required: true, message: "请输入自定义标签", trigger: "blur" }
            ]
          });
        }
      }
      this.$nextTick().then(() => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let options = JSON.parse(JSON.stringify(this.options));
            options.memberLabelIds = this.memberLabelArr.join(",");
            options.knowledgeId = this.selectedTree.join(",");
            options.topicSource.value = this.customArr.join(",");
            let topicInfo = Object.assign({}, this.topicInfo, {
              topicContent: this.editorVal,
              ...options
            });
            this.$axios
              .post(this.reqLink.createAndUpdateTopicInfo, {
                Loading: true,
                topicInfo
              })
              .then(res => {
                this.Util.base.tips("保存成功！", "success");
                if (this.add) {
                  this.$router.push({ name: "myupload" });
                } else {
                  this.getData();
                }
              });
          } else {
            return false;
          }
        });
      });
    },
    notCheckedAnswer(index = null, type) {
      this.checkedAnswerNo = index;
      type === "add" && (this.answerEditorVal = "");
      if (!this.topicInfo.topicAnswer.length) return;
      this.$refs.answerList.forEach((item, i) => {
        item.classList[i === index ? "add" : "remove"]("actived");
      });
    }
  }
};
</script>

<style lang="scss">
.details-info {
  p.tit {
    color: #797979;
  }
  .details-info-options {
    margin: 10px 0;
    > div {
      flex-wrap: wrap;
      > div {
        position: relative;
        > div {
          flex-wrap: wrap;
        }
        &.tit {
          width: 90px;
          line-height: 34px;
          color: #aeaeae;
          text-align: justify;
          text-align-last: justify;
        }
        & > label {
          position: absolute;
          z-index: 9;
          left: 5px;
          top: 3px;
          color: transparent;
        }
        & > .el-form-item__content {
          margin-left: 0 !important;
        }
        &:last-child {
          &.is-success {
            .el-input-group__prepend {
              border-color: #67c23a;
            }
            .inp {
              input:focus {
                border-color: #67c23a;
              }
            }
          }
          > div {
            & > .el-form-item__error {
              position: absolute;
              top: 35px;
            }
            & > div {
              margin: 0 20px 20px 0;
              position: relative;

              &.inp {
                width: 400px;
                margin-bottom: 0;
                > .is-disabled input {
                  background: transparent;
                }
                .el-input-group__prepend {
                  background: transparent;
                  padding: 0 5px;
                  .el-tag {
                    margin-right: 5px;
                  }
                }
                input {
                  border-left: 0;
                  padding-left: 0;
                  &:focus {
                    border-color: #dcdfe6;
                  }
                }
              }
              & > label {
                position: absolute;
                z-index: 9;
                left: 5px;
                top: 3px;
                color: transparent;
              }
              & > .el-form-item__content {
                margin-left: 0 !important;
                > .inp {
                  width: 417px;
                }
              }
            }
          }
        }
        margin: 0 20px 20px 0;
      }
    }
  }

  .editor-box {
    margin: 20px 10px;
  }
  .subject-options {
    > div {
      justify-content: space-between;
      align-items: stretch;
    }
    .answer-list {
      margin-top: 15px;
      border: 1px solid #ebebeb {
        radius: 3px;
      }
      padding: 15px;
      justify-content: flex-start;
      flex-wrap: wrap;
      > div {
        position: relative;
        background: #f9f9fb;
        color: #333334;
        display: flex;
        border: 1px solid #f5f5f5 {
          radius: 3px;
        }
        width: 242px;
        min-height: 153px;
        margin: 15px;
        padding: 10px;
        cursor: pointer;
        transition: all 0.5s;
        .icon-operation {
          color: $eleColor;
          position: absolute;
          right: 5px;
          top: 5px;
          display: flex;
          flex-direction: row-reverse;
          justify-content: flex-end;
          .editing {
            font-size: 16px;
            margin-right: 5px;
            display: none;
          }
          .delete {
            display: none;
            font-size: 20px;
          }
        }
        &.actived {
          border-color: $eleColor;
          .editing {
            display: block;
          }
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
        .answer-ind {
          color: $eleColor;
          padding-right: 15px;
          font-size: 20px;
        }
        .is-correct {
          position: absolute;
          bottom: 5px;
          left: calc(50% - 40px);
          display: none;
          .el-checkbox__label {
            color: $eleColor;
          }
        }
        &:last-child {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover {
            > i {
              color: $eleColor;
            }
          }
          > i {
            font-size: 64px;
            color: #e7e7e7;
          }
        }
        .iconfont {
          display: none;
        }
        &:hover {
          &:not(.right-key) {
            .is-correct {
              display: block;
            }
          }
          .delete {
            display: block;
          }
        }
        &.right-key {
          .iconfont {
            display: block;
            position: absolute;
            bottom: -15px;
            right: -20px;
            font-size: 60px;
            color: $eleColor;
            &::after {
              content: "正确答案";
              transform: rotate(-44deg);
              position: absolute;
              font-size: 12px;
              left: 12px;
              top: 5px;
            }
          }
        }
      }
      &[sort="01801"] > div {
        width: calc(100% - 52px);
      }
      &[sort="01802"] > div {
        width: calc(50% - 52px);
      }
      &[sort="01803"] > div {
        width: calc(25% - 52px);
      }
    }
  }
  .answer-btns {
    margin: 20px 0;
    text-align: center;
  }
}
</style>

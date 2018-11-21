<template>
  <div class="batch-import">
    <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    <div class="batch-import-body">
      <el-steps :active="stepIndex" align-center>
        <el-step title="选择要导入的文件"></el-step>
        <el-step title="查看导入预览"></el-step>
        <el-step title="确认导入系统"></el-step>
      </el-steps>
      <div class="flex" v-if="stepIndex === 0">
        <el-upload drag :action="reqLink.getTopicInfoByFile" :before-upload="file => beforeAvatarUpload(file, 'excel')">
          <h1>EXCEL文件</h1>
          <div class="select-template" @click.stop="()=>{return false}">
            <div>
              <el-popover placement="bottom" title="选择使用的模板" width="200" trigger="click">
                <div class="flex">
                  <el-select v-model="uploadTemplateId" placeholder="请选择">
                    <el-option v-for="item in temolateList" :key="item.id" :label="item.analysisTempleteName" :value="item.id">
                    </el-option>
                  </el-select>
                  <el-button type="primary" size="mini" :disabled="!uploadTemplateId" @click="startUpload('uploadExcel')" style="margin-left: 10px;">上传</el-button>
                </div>
                <el-button type="text" slot="reference">请选择使用的模板类型</el-button>
              </el-popover>
            </div>
          </div>
          <el-button size="small" type="primary" ref="uploadExcel" style="opacity: 0">点击上传</el-button>
          <div class="el-upload__tip" slot="tip">只能上传execl文件，且不超过5MB
            <el-popover placement="bottom" title="选择需要的模板类型" width="200" trigger="click" @show="fileType = '02901'">
              <div class="down-temp flex">
                <el-select clearable v-model="options.stuDepartment" placeholder="学部">
                  <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
                <el-select clearable v-model="options.stuSubject" placeholder="科目">
                  <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                  </el-option>
                </el-select>
              </div>
              <el-select clearable v-model="downTemplateId" placeholder="请选择">
                <el-option v-for="item in temolateList" :key="item.id" :label="item.analysisTempleteName" :value="item.id">
                </el-option>
              </el-select>
              <el-button type="text" slot="reference">下载模板</el-button>
            </el-popover>
          </div>
        </el-upload>
        <el-upload drag action="/" :before-upload="file => beforeAvatarUpload(file, 'word')">
          <h1>WORD文件</h1>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传word文件，且不超过500kb
            <el-button type="text">下载模板</el-button>
          </div>
        </el-upload>
        <el-upload class="upload-demo" drag action="/" :before-upload="file => beforeAvatarUpload(file, 'word')">
          <h1>图片压缩包</h1>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传EXCEL文件，且不超过500kb
            <el-button type="text" disabled>无需模板</el-button>
          </div>
        </el-upload>
      </div>
      <div class="steps-two" v-if="stepIndex === 1">
        <div class="flex">
          <div class="progress">
            <p>导入进度：</p>
            <el-progress :stroke-width="14" :percentage="progress"></el-progress>
            <p>导入结果：</p>
            <div class="upload-txt">
              <p>
                <span>导入数据</span>{{fileUploadRes.importCount}}
              </p>
              <p class="success">
                <span>成功数据</span>{{fileUploadRes.successCount}}
              </p>
              <p class="error">
                <span>失败数据</span>{{fileUploadRes.errorCount}}
              </p>
            </div>
          </div>
        </div>
        <div class="options flex">
          <el-select clearable v-model="importOptions.topicContentIntegrity" placeholder="题目内容不限">
            <el-option v-for="item in $store.state.topic_content_full_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictLabel">
            </el-option>
          </el-select>
          <el-select clearable v-model="importOptions.analysisIntegrity" placeholder="解析内容不限">
            <el-option v-for="item in $store.state.topic_content_full_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictLabel">
            </el-option>
          </el-select>
          <el-select clearable v-model="importOptions.topicProperty" placeholder="题目属性不限">
            <el-option v-for="item in $store.state.topic_propertis_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictLabel">
            </el-option>
          </el-select>
        </div>
        <div class="table-list">
          <el-table :data="tabData" tooltip-effect="dark">
            <el-table-column label="索引" width="55" align="center">
              <template slot-scope="scope">
                {{(scope.$index + 1) + limit * page}}
              </template>
            </el-table-column>
            <el-table-column label="题目" prop="topicContent">
            </el-table-column>
            <el-table-column label="题目内容" prop="topicContentIntegrity" width="100" align="center">
            </el-table-column>
            <el-table-column label="解析一" prop="analysisIntegrity" width="100" align="center">
            </el-table-column>
            <el-table-column label="题目属性" prop="topicProperty" width="100" align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="fileUploadRes.successCount" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
        <div class="flex operation-btns">
          <el-button type="warning" @click="reUpload">重新上传</el-button>
          <el-button type="primary" @click="nextStep">确定导入</el-button>
        </div>
      </div>
      <div class="steps-end flex" v-if="stepIndex === 3">
        <div class="upload-txt">
          <h3>上传中，请稍候...</h3>
          <el-button type="primary" @click="reUpload">继续上传</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 0,
      limit: 10,
      stepIndex: 0,
      temolateList: [],
      uploadTemplateId: "",
      downTemplateId: "",
      progress: 0,
      fileType: "",
      fileUploadRes: {},
      tabData: [],
      options: {
        stuDepartment: "",
        stuSubject: ""
      },
      importOptions: {
        topicContentIntegrity: "",
        analysisIntegrity: "",
        topicProperty: ""
      }
    };
  },
  created() {
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("file_type");
    this.Util.base.getDictList("topic_content_full_status");
    this.Util.base.getDictList("topic_propertis_status");
    this.getTemplate();
  },
  watch: {
    options: {
      handler() {
        this.downTemplateId = "";
        this.getTemplate();
      },
      deep: true
    },
    downTemplateId(newVal) {
      if (newVal) {
        this.downTemplate();
      }
    },
    importOptions: {
      handler() {
        this.getTabData();
      },
      deep: true
    }
  },
  methods: {
    getTemplate() {
      this.$axios
        .post(this.reqLink.getTopicAnalysisTempleteList, {
          stuDepartment: this.options.stuDepartment,
          stuSubject: this.options.stuSubject
        })
        .then(({ data }) => {
          this.temolateList = data.list || [];
        });
    },
    downTemplate() {
      this.$axios
        .post(
          this.reqLink.getTopicTempleteFile,
          {
            analysisId: this.downTemplateId,
            fileType: this.fileType
          },
          {
            responseType: "arraybuffer"
          }
        )
        .then(data => {
          let blob = new Blob([data]),
            a = document.createElement("a");
          a.download = "data.xls";
          a.href = window.URL.createObjectURL(blob);
          a.click();
          window.URL.revokeObjectURL(a.href);
        });
    },
    startUpload(target) {
      this.$refs[target].$el.click();
    },
    beforeAvatarUpload(file, type) {
      let typeErr = false;
      switch (type) {
        case "excel":
          if (
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel"
          ) {
            this.fileType = "02901";
          } else {
            typeErr = true;
          }
          break;
        case "word":
          if (
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            this.fileType = "02902";
          } else {
            typeErr = true;
          }
          break;
      }
      if (typeErr) {
        this.Util.base.tips("上传文件必须是" + type + "格式", "error");
        return false;
      }
      this.stepIndex = 1;
      let formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", this.fileType);
      formData.append("analysisId", this.uploadTemplateId);
      this.$axios
        .post(this.reqLink.getTopicInfoByFile, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            this.progress =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          }
        })
        .then(({ data }) => {
          this.fileUploadRes = data;
          this.fileUploadRes.topicInfo.map(item => {
            item.topicContentIntegrity = this.$store.state.topic_content_full_status.filter(
              v => v.dictValue === item.topicContentIntegrity
            )[0].dictLabel;
            item.analysisIntegrity = this.$store.state.topic_content_full_status.filter(
              v => v.dictValue === item.analysisIntegrity
            )[0].dictLabel;
            item.topicProperty = this.$store.state.topic_propertis_status.filter(
              v => v.dictValue === item.topicProperty
            )[0].dictLabel;
          });
          this.getTabData();
        });
      return false;
    },
    reUpload() {
      this.stepIndex = 0;
      this.fileUploadRes = {};
      this.tabData = [];
    },
    nextStep() {
      this.stepIndex = 3;
      this.$axios
        .post(this.reqLink.createTopicInfoByFile, {
          Loading: true,
          fileType: this.fileType
        })
        .then(({ data }) => {
          console.log(data);
        });
    },
    getTabData() {
      this.tabData = this.fileUploadRes.topicInfo;
      for (let i in this.importOptions) {
        this.tabData = this.tabData.filter(
          item =>
            item[i] === this.importOptions[i] || this.importOptions[i] === ""
        );
      }
      this.tabData = this.tabData.slice(
        this.page * this.limit,
        this.limit * (this.page + 1)
      );
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getTabData();
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getTabData();
    }
  }
};
</script>

<style lang="scss">
.down-temp > div {
  margin: 0 10px 10px 0;
  &:last-child {
    margin: 0;
  }
}
.batch-import {
  height: 100%;
  .select-template {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    padding-top: 100px;
    z-index: 999;
  }
  .upload-txt {
    padding-left: 20px;
    > p {
      line-height: 28px;
      color: #409eff;
      &.success {
        color: #2fb48a;
      }
      &.error {
        color: #f56c6c;
      }
      span {
        padding-right: 20px;
      }
    }
  }
  .steps-two {
    width: 80%;
    margin: 10px auto;
    > div:first-child {
      align-items: baseline;
      justify-content: space-between;
      .progress {
        margin-bottom: 10px;
        > p {
          padding: 10px 0;
        }
        .el-progress__text {
          margin-left: 8px;
          font-size: 14px !important;
        }
        width: 50%;
      }
    }
    .options {
      margin-bottom: 20px;
      justify-content: space-between;
    }
    .operation-btns {
      justify-content: center;
    }
  }
  .steps-end {
    width: 80%;
    margin: 50px auto !important;
  }
  .batch-import-body {
    background: #fff;
    margin-top: 20px;
    padding: 50px 26px;
    min-height: calc(100% - 174px);
    > .flex {
      margin: 50px 0;
      justify-content: space-between;
      h1 {
        padding-top: 30px;
      }
    }
    .el-step.is-horizontal {
      .is-wait {
        .el-step__icon.is-text {
          background: #dcdcdc;
          color: #fff;
          border-color: #dcdcdc;
        }
      }
      .el-step__title {
        font-size: 14px;
      }
      .is-process {
        .el-step__icon.is-text {
          border-color: $eleColor;
          color: $eleColor;
        }
      }
      .is-finish {
        .el-step__icon.is-text {
          background: $eleColor;
          color: #fff;
        }
        .el-step__line {
          height: 3px;
          background: $eleColor;
        }
      }
      .el-step__line {
        top: 20px;
        height: 3px;
        background: #dcdcdc;
      }
    }
    .el-step__icon.is-text {
      width: 41px;
      height: 41px;
    }
  }
}
</style>

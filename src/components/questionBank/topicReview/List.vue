<template>
  <div class="topic-review-warp" :class="{'is-show-tree': isShowType}">
    <transition name="el-fade-in-linear">
      <router-view v-if="$route.fullPath.includes('details')"></router-view>
      <div v-else class="flex">
        <div class="tree-box-left">
          <KnowledgeTree @treeCheck="treeCheck" noBor checkbox></KnowledgeTree>
        </div>
        <div class="topic-review">
          <div class="select-options">
            <div>
              <el-date-picker clearable v-model="options.selectTimes" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-select clearable v-model="options.topicStatus" placeholder="审核状态不限">
                <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :disabled="item.dictValue === '01401'" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-input clearable placeholder="上传人/电话" v-model.trim="uploadUser.value" style="width: 200px;" @keyup.enter.native="search(uploadUser)">
                <el-button slot="append" icon="el-icon-search" @click="search(uploadUser)"></el-button>
              </el-input>
              <el-input clearable placeholder="初审人/电话" v-model.trim="checkUser.value" style="width: 200px;" @keyup.enter.native="search(checkUser)">
                <el-button slot="append" icon="el-icon-search" @click="search(checkUser)"></el-button>
              </el-input>
              <el-input clearable placeholder="复审人/电话" v-model.trim="recheckUser.value" style="width: 200px;" @keyup.enter.native="search(recheckUser)">
                <el-button slot="append" icon="el-icon-search" @click="search(recheckUser)"></el-button>
              </el-input>
              <el-date-picker clearable v-model="options.checkDate" type="daterange" start-placeholder="初审开始日期" end-placeholder="初审结束日期" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-date-picker clearable v-model="options.recheckDate" type="daterange" start-placeholder="复审开始日期" end-placeholder="复审结束日期" :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-input clearable v-model="options.customVal" placeholder="自定义标签" style="width: 400px;"></el-input>
              <el-select clearable v-model="options.stuDepartment" placeholder="学部不限">
                <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select clearable v-model="options.stuSubject" placeholder="科目不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select clearable v-model="options.subjectType" placeholder="题型">
                <el-option v-for="item in $store.state.subject_type" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select clearable v-model="options.difficultLevel" placeholder="难度">
                <el-option v-for="item in $store.state.difficult_level" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select clearable v-model="options.textbookVersion" placeholder="教材版本">
                <el-option v-for="item in $store.state.textbook_version" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-select clearable v-model="options.year" placeholder="年份">
                <el-option v-for="item in $store.state.year" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <el-input clearable v-model="idAndTopicName" placeholder="关键字 / ID" style="width: 400px;" @keyup.enter.native="search(null)">
                <el-button slot="append" icon="el-icon-search" @click="search(null)"></el-button>
              </el-input>
              <el-select clearable v-model="options.member" multiple filterable allow-create default-first-option placeholder="会员级别" style="width: 400px;">
                <el-option v-for="item in memberList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <p>
                <el-checkbox v-model="isShowType">知识树</el-checkbox>
              </p>
            </div>
          </div>
          <div class="table-list">
            <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column label="题目ID" width="100px" align="center">
                <template slot-scope="scope">0{{ scope.row.number }}</template>
              </el-table-column>
              <el-table-column label="题目" show-overflow-tooltip width="300">
                <template slot-scope="scope">
                  <el-button type="text" @click="$router.push({path: 'topicReview/details/' + scope.row.id})">
                    <span class="markdown-body" v-html="Util.fun.md2html(scope.row.topicContent)"></span>
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column label="学部" width="100px" align="center">
              </el-table-column>
              <el-table-column label="科目" width="100px" align="center">
              </el-table-column>
              <el-table-column prop="topicClasses" label="题型" width="100px" align="center">
              </el-table-column>
              <el-table-column label="难度" width="100px" align="center">
              </el-table-column>
              <el-table-column label="教材" width="100px" align="center">
              </el-table-column>
              <el-table-column label="年份" width="100px" align="center">
              </el-table-column>
              <el-table-column label="会员级别" width="100px" align="center">
              </el-table-column>
              <el-table-column label="上传日期" width="100px" align="center">
              </el-table-column>
              <el-table-column prop="status" label="审核状态" width="90px" align="center">
              </el-table-column>
              <el-table-column label="上传人" width="100px" align="center">
              </el-table-column>
              <el-table-column label="初审人" width="100px" align="center">
              </el-table-column>
              <el-table-column label="复审人" width="100px" align="center">
              </el-table-column>
              <el-table-column label="操作" width="210px" fixed="right" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="$router.push({path: 'topicReview/details/' + scope.row.id})">详情</el-button>
                  <el-button type="text" @click="topicOperation(scope.row.id, 'delete')">删除</el-button>
                  <el-button type="text" v-if="scope.row.status === '待审核'" @click="topicExamine(scope.row.id, 'examine')">审核</el-button>
                  <el-button type="text" v-if="scope.row.status === '待审核'">指定复审</el-button>
                  <el-button type="text" v-if="scope.row.status === '审核通过'" @click="topicOperation(scope.row.id, scope.row.isPutaway === '00001' ? 'down' : 'up')">{{ scope.row.isPutaway === '00001' ? "下架" : "上架" }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex">
            <el-button type="primary" :disabled="multipleSelection.length <= 1" @click="topicOperation(null, 'alldel')">批量删除</el-button>
            <el-button type="primary" :disabled="multipleSelection.length <= 1">批量指定复审</el-button>
            <el-button type="primary" :disabled="multipleSelection.length <= 1">批量审核通过</el-button>
            <el-button type="primary" :disabled="multipleSelection.length <= 1">批量下架</el-button>
          </div>
          <div class="pagination">
            <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </transition>
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
      limit: 10,
      count: 0,
      tabLoading: true,
      tableData: [],
      multipleSelection: [],
      memberList: [],
      isShowType: false,
      examineVal: "",
      uploadUser: {
        phone: "",
        userName: "",
        value: ""
      },
      checkUser: {
        phone: "",
        userName: "",
        value: ""
      },
      recheckUser: {
        phone: "",
        userName: "",
        value: ""
      },
      idAndTopicName: "",
      options: {
        selectTimes: "",
        topicStatus: "",
        checkDate: "",
        recheckDate: "",
        customVal: "",
        stuDepartment: "",
        stuSubject: "",
        subjectType: "",
        difficultLevel: "",
        textbookVersion: "",
        year: "",
        member: ""
      },
      treeIds: []
    };
  },
  created() {
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("topic_status");
    this.Util.base.getDictList("subject_type");
    this.Util.base.getDictList("difficult_level");
    this.Util.base.getDictList("textbook_version");
    this.Util.base.getDictList("year");
    this.getData();
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
  methods: {
    getData() {
      this.tabLoading = true;
      let uploadUser = Object.assign({}, this.uploadUser),
        checkUser = Object.assign({}, this.checkUser),
        recheckUser = Object.assign({}, this.recheckUser);
      delete uploadUser.value;
      delete checkUser.value;
      delete recheckUser.value;
      this.$axios
        .post(this.reqLink.getTopicList, {
          page: this.page,
          limit: this.limit,
          interfaceType: 2,
          topicInfo: {
            idAndTopicName: this.idAndTopicName,
            startDate: Array.isArray(this.options.selectTimes)
              ? this.options.selectTimes[0]
              : "",
            endDate: Array.isArray(this.options.selectTimes)
              ? this.options.selectTimes[1]
              : "",
            status: this.topicStatus,
            uploadUser: uploadUser,
            checkUser: checkUser,
            recheckUser: recheckUser,
            checkStartDate: Array.isArray(this.options.checkDate)
              ? this.options.checkDate[0]
              : "",
            checkEndDate: Array.isArray(this.options.checkDate)
              ? this.options.checkDate[1]
              : "",
            recheckStartDate: Array.isArray(this.options.recheckDate)
              ? this.options.recheckDate[0]
              : "",
            recheckEndDate: Array.isArray(this.options.recheckDate)
              ? this.options.recheckDate[1]
              : "",
            value: "",
            stuDepartment: this.options.stuDepartment,
            stuSubject: this.options.stuSubject,
            topicClasses: this.options.subjectType,
            knowledgeId: this.treeIds.join(","),
            difficultLevel: this.options.difficultLevel,
            textbookVersion: this.options.textbookVersion,
            year: this.options.year,
            memberLabelIds: "",
            sortType: [
              {
                type: "02801",
                isASC: "00001"
              }
            ]
          }
        })
        .then(({ data }) => {
          this.count = data.count || 0;
          this.tableData = data.list;
          this.tableData = this.tableData.map(item => {
            item.createDateTime &&
              (item.createDateTime = this.Util.fun.formatDate(
                item.createDateTime,
                "yyyy-MM-dd"
              ));
            item.status = this.Util.fun.code2txt(item.status, "topic_status");
            item.topicClasses = this.Util.fun.code2txt(
              item.topicClasses,
              "subject_type"
            );
            return item;
          });
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    treeCheck(id, checked) {
      if (checked) {
        this.treeIds.push(id);
      } else {
        this.treeIds.splice(this.treeIds.findIndex(item => item === id), 1);
      }
    },
    search(obj) {
      if (obj) {
        let isNum = /^\d+$/,
          val = obj.value;
        if (isNum.test(val)) {
          obj.phone = val;
          obj.userName = "";
        } else {
          obj.userName = val;
          obj.phone = "";
        }
      }
      this.getData();
    },
    getOptions(type) {
      for (let i in this.options) {
        if (i === type) {
          return this.options[i];
        }
      }
    },
    topicOperation(id, type) {
      const o = {};
      switch (type) {
        case "upload":
          o.txt = "上传该";
          o.link = "updateTopicForUpload";
          o.type = "one";
          break;
        case "delete":
          o.txt = "删除该";
          o.link = "deleteTopic";
          o.type = "one";
          break;
        case "alldel":
          o.txt = "批量删除所选";
          o.link = "deleteTopic";
          break;
        case "down":
        case "up":
          o.txt = type === "down" ? "下" : "上" + "架该";
          o.link = "updateTopicForDownway";
          o.type = "one";
          break;
      }
      let params = {
        Loading: true,
        id: o.type === "one" ? id : this.multipleSelection.join(",")
      };
      if (type === "down" || type === "up") {
        params = Object.assign({}, params, {
          operationType: type === "down" ? 1 : 0
        });
      }
      this.$confirm(`是否${o.txt}题目?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$axios.post(this.reqLink[o.link], params).then(() => {
            this.Util.base.tips("操作成功", "success");
            this.getData();
          });
        })
        .catch(() => {});
    },
    topicExamine(id, type) {
      const params = {
        id: type === "examine" ? id : this.multipleSelection.join(","),
        checkUserId: "00001",
        checkType: "",
        checkRemark: ""
      };
      let self = this,
        h = this.$createElement;
      this.examineVal = "";
      const examine = () => {
        this.$axios
          .post(this.reqLink.updateTopicForAudit, {
            Loading: true,
            ...params
          })
          .then(() => {
            this.Util.base.tips("操作成功", "success");
            this.getData();
          });
      };

      this.$msgbox({
        title: "审核当前题目",
        message: h("div", null, [
          h("p", null, "请输入审核备注"),
          h(
            "el-input",
            {
              on: {
                input(val) {
                  self.examineVal = val;
                }
              }
            },
            ""
          )
        ]),
        distinguishCancelAndClose: true,
        showCancelButton: true,
        closeOnClickModal: false,
        onfirmButtonText: "通过",
        cancelButtonText: "不通过"
      })
        .then(() => {
          params.checkType = "00001";
          params.checkRemark = this.examineVal;
          examine(params);
        })
        .catch(action => {
          if (action === "cancel") {
            params.checkType = "00002";
            params.checkRemark = this.examineVal;
            examine(params);
          }
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id);
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
.topic-review-warp {
  &.is-show-tree {
    .topic-review {
      width: calc(100% - 337px);
    }
    .tree-box-left {
      width: auto;
      padding: 20px 0 20px 20px;
      margin-right: 26px;
    }
  }
  .tree-box-left {
    overflow: hidden;
    width: 0;
    background: #fff;
    transition: all 0.5s;
    .zss-left-box {
      width: 290px !important;
    }
  }
  .topic-review {
    box-sizing: border-box;
    background: #fff;
    padding: 20px;
    width: 100%;
    height: 100%;
    .select-options {
      display: flex;
      align-items: baseline;
      & > div {
        > * {
          margin: 0 20px 20px 0;
        }
      }
    }
  }
}
</style>

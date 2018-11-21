<template>
  <div>
    <transition name="el-fade-in-linear">
      <router-view v-if="$route.fullPath.includes('batchImport')"></router-view>
      <router-view v-else-if="$route.fullPath.includes('details')"></router-view>
      <div v-else class="question-bank-factory">
        <div class="select-options">
          <div>
            <el-date-picker clearable v-model="options.selectTimes" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <el-select clearable v-model="options.topicStatus" placeholder="审核状态不限">
              <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.topic_content_full_status" placeholder="题目内容不限">
              <el-option v-for="item in $store.state.topic_content_full_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.analysis_content_full_status" placeholder="解析内容不限">
              <el-option v-for="item in $store.state.topic_content_full_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.topic_flow_status" placeholder="流程不限">
              <el-option v-for="item in $store.state.topic_flow_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.topic_propertis_status" placeholder="题目属性不限">
              <el-option v-for="item in $store.state.topic_propertis_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.stuDepartment" placeholder="学部不限">
              <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
            <el-select clearable v-model="options.stuSubject" placeholder="科目不限">
              <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
              </el-option>
            </el-select>
          </div>
          <div class="flex">
            <el-button type="primary">创建</el-button>
            <el-button type="primary">流程设置</el-button>
            <el-button type="primary">重置搜索条件</el-button>
            <el-button type="primary" @click="$router.push({path: 'questionBankFactory/batchImport'})">批量导入</el-button>
          </div>
        </div>
        <div class="table-list">
          <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="题目ID" width="100px" align="center">
              <template slot-scope="scope">0{{ scope.row.number }}</template>
            </el-table-column>
            <el-table-column label="题目" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({path: 'topicReview/details/' + scope.row.id})">
                  <span class="markdown-body" v-html="Util.fun.md2html(scope.row.topicContent)"></span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createDateTime" label="创建日期" width="100px" align="center">
            </el-table-column>
            <el-table-column prop="topicContentIntegrity" label="题目内容" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="analysisIntegrity" label="解析一" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="topicProperty" label="题目属性" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="status" label="审核状态" width="80px" align="center">
            </el-table-column>
            <el-table-column label="操作" width="210px" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.status === '草稿' || scope.row.status === '审核不通过'" @click="topicOperation(scope.row.id, 'upload')">上传</el-button>
                <el-button type="text" @click="$router.push({path: 'questionBankFactory/details/' + scope.row.id})">详情</el-button>
                <el-button type="text" v-if="scope.row.status === '草稿' || scope.row.status === '审核不通过'" @click="topicOperation(scope.row.id, 'delete')">删除</el-button>
                <el-button type="text">退回</el-button>
                <el-button type="text">下步</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 0,
      limit: 10,
      count: 0,
      tabLoading: true,
      tableData: [],
      options: {
        selectTimes: [],
        topicStatus: "",
        topic_content_full_status: "",
        analysis_content_full_status: "",
        topic_flow_status: "",
        topic_propertis_status: "",
        stuDepartment: "",
        stuSubject: ""
      }
    };
  },
  created() {
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("topic_status");
    this.Util.base.getDictList("topic_content_full_status");
    this.Util.base.getDictList("topic_flow_status");
    this.Util.base.getDictList("topic_propertis_status");
    this.getData();
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.tabLoading = true;
      this.$axios
        .post(this.reqLink.findTopicFactoryInfoList, {
          page: this.page,
          limit: this.limit,
          startDate: "",
          endDate: "",
          auditStatus: "",
          topicStatus: "",
          analysisStatus: "",
          flowStatus: "",
          topicPropertyStatus: "",
          stuDepartment: "",
          stuSubject: ""
        })
        .then(({ data }) => {
          this.count = data.count || 0;
          this.tableData = data.list;
          this.tableData = this.tableData.map(item => {
            item.createDateTime =
              item.createDateTime &&
              this.Util.fun.formatDate(
                item.createDateTime,
                "yyyy-MM-dd hh:mm:ss"
              );
            item.status = this.Util.fun.code2txt(item.status, "topic_status");
            item.topicContentIntegrity = this.Util.fun.code2txt(
              item.topicContentIntegrity,
              "topic_content_full_status"
            );
            item.analysisIntegrity = this.Util.fun.code2txt(
              item.analysisIntegrity,
              "topic_content_full_status"
            );
            item.topicProperty = this.Util.fun.code2txt(
              item.topicProperty,
              "topic_propertis_status"
            );
            return item;
          });
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    getOptions(type) {
      for (let i in this.options) {
        if (i === type) {
          return this.options[i];
        }
      }
    },
    topicOperation(id, type) {
      this.$confirm(
        `是否${
          type === "upload"
            ? "上传该"
            : type === "delete" ? "删除该" : "批量删除所选"
        }题目?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.$axios
            .post(
              this.reqLink[
                type === "upload" ? "updateTopicForUpload" : "deleteTopic"
              ],
              {
                Loading: true,
                id: type === "alldel" ? this.multipleSelection.join(",") : id
              }
            )
            .then(() => {
              this.Util.base.tips("操作成功", "success");
              this.getData();
            });
        })
        .catch(() => {});
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
.question-bank-factory {
  box-sizing: border-box;
  background: #fff;
  padding: 20px;
  height: 100%;
  .select-options {
    display: flex;
    align-items: baseline;
    & > div {
      &:first-child {
        width: 90%;
      }
      &:last-child {
        width: 279px;
        justify-content: space-between;
        align-items: baseline;
        flex-wrap: wrap;
        > button {
          width: 116px;
          margin-right: 0;
        }
      }
      > * {
        margin: 0 20px 20px 0;
      }
    }
  }
}
</style>

<template>
  <div class="my-upload">
    <transition name="el-fade-in-linear">
      <router-view v-if="$route.fullPath.includes('details')"></router-view>
      <div v-else>
        <div class="select-options">
          <div>
            <el-date-picker clearable v-model="options.selectTimes" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <el-select clearable v-model="options.topicStatus" placeholder="审核状态不限">
              <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
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
            <el-button type="primary" @click="$router.push({path: './addtopic'})">创建</el-button>
          </div>
        </div>
        <div class="table-list">
          <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" :selectable="row => deletingState.includes(row.status)">
            </el-table-column>
            <el-table-column label="题目ID" width="150px" align="center">
              <template slot-scope="scope">0{{ scope.row.number }}</template>
            </el-table-column>
            <el-table-column label="题目" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="$router.push({path: 'myUpload/details/' + scope.row.id})">
                  <span class="markdown-body" v-html="Util.fun.md2html(scope.row.topicContent)"></span>
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createDateTime" label="创建日期" width="150px" align="center">
            </el-table-column>
            <el-table-column prop="status" label="审核状态" width="150px" align="center">
            </el-table-column>
            <el-table-column label="操作" width="150px" align="center">
              <template slot-scope="scope">
                <el-button type="text" v-if="uploadingState.includes(scope.row.status)" @click="topicOperation(scope.row.id, 'upload')">上传</el-button>
                <el-button type="text" @click="$router.push({path: 'myUpload/details/' + scope.row.id})">详情</el-button>
                <el-button type="text" v-if="deletingState.includes(scope.row.status)" @click="topicOperation(scope.row.id, 'delete')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button type="primary" :disabled="multipleSelection.length <= 1" @click="topicOperation(null, 'alldel')">批量删除</el-button>
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
      multipleSelection: [],
      deletingState: ["草稿", "审核不通过"], // 可删除的状态
      uploadingState: ["草稿"], // 可上传的状态
      options: {
        selectTimes: [],
        topicStatus: "",
        stuDepartment: "",
        stuSubject: ""
      }
    };
  },
  created() {
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("topic_status");
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
        .post(this.reqLink.getTopicList, {
          page: this.page,
          limit: this.limit,
          topicInfo: {
            idAndTopicName: "",
            startDate: this.options.length ? this.options.selectTimes[0] : "",
            endDate: this.options.length ? this.options.selectTimes[1] : "",
            status: this.getOptions("topicStatus"),
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
            stuDepartment: this.getOptions("stuDepartment"),
            stuSubject: this.getOptions("stuSubject"),
            topicClasses: "",
            knowledgeId: "",
            difficultLevel: "",
            textbookVersion: "",
            year: "",
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
.my-upload {
  background: #fff;
  padding: 20px;
  .select-options {
    display: flex;
    & > div {
      > * {
        margin: 0 20px 20px 0;
      }
    }
  }
}
</style>

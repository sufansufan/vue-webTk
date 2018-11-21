<template>
  <div class="papers-manage">
    <div class="select-options">
      <div>
        <el-date-picker clearable v-model="options.selectTimes" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select clearable v-model="options.releaseStatus" placeholder="发布状态不限">
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
        <el-input clearable placeholder="发布者姓名/电话" v-model.trim="releaseUser.value" style="width: 250px;" @keyup.enter.native="search(releaseUser)">
          <el-button slot="append" icon="el-icon-search" @click="search(releaseUser)"></el-button>
        </el-input>
        <el-input clearable placeholder="班级名称/班级ID" v-model.trim="classNature.value" style="width: 285px;" @keyup.enter.native="search(classNature)">
          <el-button slot="append" icon="el-icon-search" @click="search(classNature)"></el-button>
        </el-input>
        <el-input clearable placeholder="关键字/组卷ID" v-model.trim="keyWord.value" style="width: 350px;" @keyup.enter.native="search(keyWord)">
          <el-button slot="append" icon="el-icon-search" @click="search(keyWord)"></el-button>
        </el-input>
        <el-button type="primary" @click="$router.push({path: 'foundPaper'})">创建组卷</el-button>
        <el-button type="primary" @click="resetCondition">重置搜索条件</el-button>
        <el-button type="primary" @click="$router.push({path: 'intelligencePaper'})">智能组卷</el-button>
      </div>
    </div>
    <div class="pagination">
      <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page+1">
      </el-pagination>
    </div>
    <div class="table-list">
      <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="组卷ID" width="100px" align="center">
          <template slot-scope="scope">0{{ scope.row.number }}</template>
        </el-table-column>
        <el-table-column label="组卷名称">
        </el-table-column>
        <el-table-column prop="createDateTime" label="班级列表" width="100px" align="center">
        </el-table-column>
        <el-table-column prop="topicContentIntegrity" label="人员列表" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="analysisIntegrity" label="创建日期" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="topicProperty" label="发布者" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="status" label="科目" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="status" label="答卷人数" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="status" label="发布状态" width="80px" align="center">
        </el-table-column>
        <el-table-column label="操作" width="230px" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.status === '未发布'" @click="releaseOperation(scope.row.id, 'release')">发布</el-button>
            <el-button type="text" v-else-if="scope.row.status === '发布'" @click="releaseOperation(scope.row.id, 'recall')">撤回</el-button>
            <el-button type="text" @click="$refs.dialog.dialogVisible = true">分享</el-button>
            <el-button type="text" @click="releaseOperation(scope.row.id, 'delete')">删除</el-button>
            <el-button type="text">清空答卷</el-button>
            <el-button type="text">班级</el-button>
            <el-button type="text">人员</el-button>
            <el-button type="text">阅卷人员</el-button>
            <el-button type="text" @click="$router.push({path: 'details/' + scope.row.id})">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="primary" :disabled="multipleSelection.length <= 1" @click="releaseOperation(null, 'alldel')">批量删除</el-button>
    <div class="pagination">
      <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page+1">
      </el-pagination>
    </div>
    <Dialog ref="dialog" title="分享" titbg width="35%" top="250px">
      <div class="share-box">
        <p>组卷链接</p>
        <div>
          <p>http://tk.zzpxx.com/exam/020301023</p>
          <el-button type="primary">复制</el-button>
        </div>
        <div>
          <img src="@/assets/images/u7.png" alt="">
          <el-button type="primary">开始答卷</el-button>
        </div>
        <el-button type="primary" @click="$refs.dialog.dialogVisible = false">关闭</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "_c/common/Dialog.vue";
export default {
  components: {
    Dialog
  },
  data() {
    return {
      page: 0,
      limit: 10,
      count: 0,
      tabLoading: false,
      tableData: [],
      multipleSelection: [],
      keyWord: {
        name: "",
        figure: "",
        value: ""
      },
      releaseUser: {
        name: "",
        figure: "",
        value: ""
      },
      classNature: {
        name: "",
        figure: "",
        value: ""
      },
      options: {
        selectTimes: [],
        releaseStatus: "",
        stuDepartment: "",
        stuSubject: ""
      }
    };
  },
  watch: {
    options: {
      handler() {
        this.getData("clearPage");
      },
      deep: true
    }
  },
  methods: {
    getData(clearPage) {
      this.$axios
        .post(this.reqLink.getTopicList, {
          page: clearPage ? (this.page = 0) : this.page,
          limit: this.limit,
          interfaceType: 2,
          topicInfo: {}
        })
        .then(({ data }) => {
          this.count = data.count || 0;
          this.tableData = data.list;
          this.tabLoading = false;
        })
        .catch(() => {
          this.tabLoading = false;
        });
    },
    releaseOperation(id, type) {
      const o = {};
      switch (type) {
        case "release":
          o.txt = "发布该";
          o.link = "";
          o.type = "one";
          break;
        case "recall":
          o.txt = "撤回该";
          o.link = "";
          o.type = "one";
          break;
        case "delete":
          o.txt = "删除";
          o.link = "";
          o.type = "one";
          break;
        case "alldel":
          o.txt = "批量删除所选";
          o.link = "";
          break;
      }
      this.$confirm(`是否${o.txt}组卷?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$axios
            .post(this.reqLink[o.link], {
              Loading: true,
              id: o.type === "one" ? id : this.multipleSelection.join(",")
            })
            .then(() => {
              this.Util.base.tips("操作成功", "success");
              this.getData();
            });
        })
        .catch(() => {});
    },
    search(obj) {
      if (obj) {
        let isNum = /^\d+$/,
          val = obj.value;
        if (isNum.test(val)) {
          obj.figure = val;
          obj.name = "";
        } else {
          obj.name = val;
          obj.figure = "";
        }
      }
      this.getData("clearPage");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id);
    },
    handleSizeChange(val) {
      this.limit = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getData();
    },
    resetCondition() {
      this.options = {};
      this.keyWord.value = "";
      this.releaseUser.value = "";
      this.classNature.value = "";
      this.getData("clearPage");
    }
  }
};
</script>

<style lang="scss">
.papers-manage {
  box-sizing: border-box;
  background: #fff;
  padding: 20px;
  .select-options {
    display: flex;
    align-items: baseline;
    & > div {
      &:first-child {
        width: 100%;
        > button {
          width: 116px;
          margin-right: 20px;
        }
      }
      > * {
        margin: 0 20px 20px 0;
      }
    }
  }
  .share-box {
    min-height: 300px;
    text-align: center;
    & > p {
      text-align: left;
      font-size: 16px;
    }
    & > div {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      > p {
        width: auto;
        height: 32px;
        box-shadow: 5px #43cfb9;
        line-height: 32px;
        padding: 0px 20px;
        box-sizing: border-box;
      }
      > button {
        width: 100px;
        height: 32px;
      }
      > img {
        width: 100px;
        height: 100px;
        margin-left: 20px;
      }
    }
    & > button {
      width: 116px;
      margin-top: 40px;
    }
  }
}
</style>

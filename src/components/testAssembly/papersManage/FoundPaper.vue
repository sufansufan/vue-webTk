<template>
  <div class="found-paper-box">
    <div class="go-back">
      <el-button type="primary" @click="$router.back(-1)">返回</el-button>
    </div>
    <div class="found-paper-list">
      <div class="base-title">试题车</div>
      <div class="select-options">
        <div>
          <el-select clearable v-model="options.stuDepartment" placeholder="学部不限">
            <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
          <el-select clearable v-model="options.stuSubject" placeholder="科目不限">
            <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
          <el-input clearable placeholder="关键字/组卷ID" v-model.trim="keyWord.value" style="width: 350px;" @keyup.enter.native="search(keyWord)">
            <el-button slot="append" icon="el-icon-search" @click="search(keyWord)"></el-button>
          </el-input>
          <el-button type="primary" icon="el-icon-delete">清空试题车</el-button>
          </div>
      </div>
      <div class="question-type-box">
        <strong>选择题 <span>63</span></strong>
        <strong>填空题 <span>5</span></strong>
        <strong>解答题 <span>5</span></strong>
      </div>
      <div class="table-list">
        <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="题目ID" width="100px" align="center">
            <template slot-scope="scope">0{{ scope.row.number }}</template>
          </el-table-column>
          <el-table-column label="题目" prop="createDateTime">
          </el-table-column>
          <el-table-column prop="createDateTime" label="题型" width="100px" align="center">
          </el-table-column>
          <el-table-column prop="topicContentIntegrity" label="难度" width="60px" align="center">
          </el-table-column>
          <el-table-column prop="analysisIntegrity" label="适用年级" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="topicProperty" label="教材版本" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="status" label="来源" width="80px" align="center">
          </el-table-column>
          <el-table-column prop="status" label="年份" width="80px" align="center">
          </el-table-column>
          <el-table-column label="操作" width="100px" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button type="text">详情</el-button>
              <el-button type="text" @click="delPaper(scope.row.id, 'del')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button type="primary" :disabled="multipleSelection.length <= 1" @click="delPaper(null, 'alldel')">批量删除</el-button>
      <div class="pagination">
        <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page+1">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      limit: 10,
      page: 0,
      count: 0,
      tabLoading: false,
      tableData: [
        {
          createDateTime: "123123123"
        }
      ],
      multipleSelection: [],
      options: {
        stuDepartment: "",
        stuSubject: ""
      },
      keyWord: {
        keyName: "",
        keyId: "",
        value: ""
      }
    };
  },
  created() {
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.id);
    },
    delPaper(id, type) {
      this.$confirm("是否该组卷?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$axios
            .post(this.reqLink, {
              id: type === "del" ? id : this.multipleSelection.join(",")
            })
            .then(() => {
              this.Util.base.tips("操作成功", "success");
              this.getData();
            });
        })
        .catch(() => {});
    },
    search() {},
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
.found-paper-box {
  .go-back {
    margin-bottom: 26px;
  }
  .found-paper-list {
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    .select-options {
      display: flex;
      flex-wrap: flex;
      align-items: baseline;
      margin-top: 20px;
      & > div {
        width: 100%;
        > * {
          margin: 0 20px 20px 0;
        }
      }
    }
    .question-type-box {
      margin-bottom: 20px;
      & > strong {
        margin-right: 20px;
        span {
          color: #2fb48a;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>

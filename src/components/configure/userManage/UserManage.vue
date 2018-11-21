<template>
  <div class="user-manage-box">
    <div class="select-options">
      <div>
        <el-date-picker clearable v-model="options.selectTimes" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select clearable v-model="options.user" placeholder="角色不限">
          <!-- <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option> -->
        </el-select>
        <el-select clearable v-model="options.memberLevel" placeholder="会员级别不限">
          <!-- <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option> -->
        </el-select>
        <el-select clearable v-model="options.parallel" placeholder="是否平行线不限">
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
        <el-select clearable v-model="options.authenticationStatus" placeholder="认证状态不限">
          <!-- <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option> -->
        </el-select>
        <el-select clearable v-model="options.teacherStu" placeholder="老师学生不限">
          <el-option label="老师" value="老师"></el-option>
          <el-option label="学生" value="学生"></el-option>
        </el-select>
        <el-input clearable placeholder="姓名/人员ID" v-model.trim="userName.value" style="width: 270px;" @keyup.enter.native="search(keyWord)">
          <el-button slot="append" icon="el-icon-search" @click="search(keyWord)"></el-button>
        </el-input>
        <el-input clearable placeholder="手机号" v-model.trim="userPhone.value" style="width: 270px;" @keyup.enter.native="search(null)">
          <el-button slot="append" icon="el-icon-search" @click="search(null)"></el-button>
        </el-input>
        <el-button type="primary" @click="alterUserManage(null)">新建</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="createDateTime" label="用户名" width="300px">
          </el-table-column>
          <el-table-column prop="topicContentIntegrity" label="手机号" align="center">
          </el-table-column>
          <el-table-column prop="analysisIntegrity" label="角色" align="center">
          </el-table-column>
          <el-table-column prop="topicProperty" label="老师/学生" align="center">
          </el-table-column>
          <el-table-column prop="status" label="资料提交时间" align="center">
          </el-table-column>
          <el-table-column prop="status" label="认证状态" align="center">
          </el-table-column>
          <el-table-column prop="status" label="是否平行线" align="center">
          </el-table-column>
          <el-table-column prop="status" label="会员级别" align="center">
          </el-table-column>
          <el-table-column label="操作" width="230px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="alterUserManage(scope.row)">编辑</el-button>
              <el-button type="text" @click="delUserManage(scope.row.id)">删除</el-button>
              <el-button type="text">冻结</el-button>
              <el-button type="text">认证</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div class="pagination">
      <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page+1">
      </el-pagination>
    </div>
    <Dialog ref="datailEditDialog" :title="userManageName" width="40%" top="100px" titbg>
      <div class="user-manage-dialog">
        <DetailedEdit @click="$refs.datailEditDialog.dialogVisible = false"></DetailedEdit>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "_c/common/Dialog.vue";
import DetailedEdit from "_c/configure/userManage/DetailedEdit.vue";
export default {
  components: {
    Dialog,
    DetailedEdit
  },
  data() {
    return {
      page: 0,
      limit: 10,
      count: 0,
      tabLoading: false,
      userManageName: "",
      tableData: [],
      options: {
        selectTimes: [],
        user: "",
        memberLevel: "",
        parallel: "",
        authenticationStatus: "",
        teacherStu: ""
      },
      userName: {
        name: "",
        nameId: "",
        value: ""
      },
      userPhone: {
        value: ""
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
    getData(clearPage) {},
    alterUserManage(row) {
      if (row === null) {
        this.userManageName = "新增";
      } else {
        this.userManageName = "编辑";
      }
      this.$refs.datailEditDialog.dialogVisible = true;
    },
    delUserManage(id) {
      this.$confirm("是否删除用户组信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then()
        .catch(() => {});
    },
    search() {
      this.getData("clearPage");
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
.user-manage-box {
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  .select-options {
    display: flex;
    align-items: baseline;
    & > div {
      > * {
        margin: 0 20px 20px 0;
      }
    }
  }
  .user-manage-dialog {
    min-height: 620px;
  }
}
</style>

<template>
  <div class="user-group-box">
    <div class="select-options">
      <div>
        <el-input clearable placeholder="用户组名称" v-model.trim="userGroupName" style="width: 240px;" @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div>
        <el-button type="primary" @click="alterUserGroup(null)">新建</el-button>
      </div>
    </div>
    <div class="table-list">
      <el-table :data="tableData" style="width: 100%" v-loading="tabloading">
        <el-table-column prop="date" label="用户组名称" align="center">
        </el-table-column>
        <el-table-column prop="date" label="用户数量" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="alterUserGroup(scope.row)">编辑</el-button>
            <el-button type="text" @click="delUserGroup(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background :page-sizes="[10, 30, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="count" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page+1">
      </el-pagination>
    </div>
    <Dialog ref="userDialog" :title="userDialogName" titbg width="40%">
      <div class="user-dialog-box">
        <div>
          <p>用户组名称</p>
          <el-input v-model="userOrganizeName" placeholder="请输入用户组名称"></el-input>
        </div>
        <div class="permissions">
          <div>
            <p>功能权限</p>
            <div class="fun-permissions">
              <el-tree :data="funList" show-checkbox node-key="id" :default-expand-all="true" :props="defaultProps">
              </el-tree>
            </div>
          </div>
          <div>
            <p>标签权限</p>
            <div class="tab-permissions">
              <p>科目</p>
              <el-select clearable v-model="label.stuSubject" multiple  placeholder="科目不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <p>适用年级</p>
              <el-select clearable v-model="label.stuSubject" multiple  placeholder="年级不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <p>难度</p>
              <el-select clearable v-model="label.stuSubject" multiple  placeholder="难度不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <p>来源</p>
              <el-select clearable v-model="label.stuSubject" multiple  placeholder="来源不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
              <p>会员级别</p>
              <el-select clearable v-model="label.stuSubject" multiple  placeholder="会员级别不限">
                <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
                </el-option>
              </el-select>
            </div>
            <div class="btn-permissions">
              <el-button type="primary" @click="savePermissions">保存</el-button>
              <el-button type="info" @click="$refs.userDialog.dialogVisible = false">取消</el-button>
            </div>
          </div>
        </div>
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
      userGroupName: "",
      userOrganizeName: "",
      userDialogName: "",
      tabloading: false,
      tableData: [],
      label: {
        stuSubject: []
      },
      funList: [
        {
          id: 1,
          label: "题库",
          children: [
            {
              id: 11,
              label: "全部题目"
            },
            {
              id: 12,
              label: "我的上传"
            },
            {
              id: 13,
              label: "题目审核"
            },
            {
              id: 14,
              label: "题目工厂"
            },
            {
              id: 15,
              label: "模板解析"
            }
          ]
        },
        {
          id: 2,
          label: "组卷",
          children: [
            {
              id: 21,
              label: "组卷管理"
            },
            {
              id: 22,
              label: "班级管理"
            },
            {
              id: 23,
              label: "统计查询"
            }
          ]
        },
        {
          id: 3,
          label: "答卷",
          children: [
            {
              id: 31,
              label: "我的班级"
            },
            {
              id: 32,
              label: "我的答卷"
            }
          ]
        },
        {
          id: 4,
          label: "阅卷",
          children: [
            {
              id: 41,
              label: "我的班级"
            },
            {
              id: 42,
              label: "我的阅卷"
            }
          ]
        },
        {
          id: 5,
          label: "练习",
          children: [
            {
              id: 51,
              label: "错题本"
            },
            {
              id: 52,
              label: "知识树练习"
            }
          ]
        },
        {
          id: 6,
          label: "配置",
          children: [
            {
              id: 61,
              label: "用户组"
            },
            {
              id: 62,
              label: "用户管理"
            },
            {
              id: 63,
              label: "个人信息"
            },
            {
              id: 64,
              label: "会员配置"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    getData(clearPage) {},
    delUserGroup(id) {
      this.$confirm("是否删除用户组信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then()
        .catch(() => {});
    },
    alterUserGroup(row) {
      this.$refs.userDialog.dialogVisible = true;
      if (row === null) {
        this.userDialogName = "新增";
      } else {
        this.userDialogName = "编辑";
      }
    },
    savePermissions() {
      if (!this.userOrganizeName) {
        this.Util.base.tips("用户组名称不能为空", "error");
        return;
      }
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
.user-group-box {
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  .select-options {
    display: flex;
    align-items: baseline;
    margin-bottom: 20px;
    & > div > .el-input-group {
      margin-right: 20px;
    }
  }
  .user-dialog-box {
    max-height: 700px;
    & > div {
      &:first-child > p {
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
    & > .permissions {
      font-size: 16px;
      margin-top: 20px;
      display: flex;
      & > div:first-child {
        width: 50%;
        padding-right: 20px;
        & > .fun-permissions {
          width: 100%;
          height: 600px;
          margin-top: 20px;
          overflow-y: auto;
          .el-tree-node__label {
            font-size: 16px;
          }
        }
      }
      & > div:last-child {
        width: 50%;
        position: relative;
        & > .tab-permissions {
          margin-top: 20px;
          p {
            margin: 10px 0;
          }
          .el-select {
            width: 100%;
          }
        }
        & > .btn-permissions {
          position: absolute;
          bottom: 20px;
          left: 0px;
          right: 0px;
          text-align: center;
          button {
            width: 100px;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>

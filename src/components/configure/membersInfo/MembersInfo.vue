<template>
  <div class="members-info-box">
    <div class="members-hender flex">
      <div class="base-title">会员信息</div>
    </div>
    <div class="table-list">
      <el-table :data="tableData" tooltip-effect="dark" v-loading="tabLoading">
          <el-table-column label="姓名" align="center">
          </el-table-column>
          <el-table-column prop="createDateTime" label="会员级别">
          </el-table-column>
          <el-table-column prop="topicContentIntegrity" label="步骤解锁" align="center">
          </el-table-column>
          <el-table-column prop="analysisIntegrity" label="知识树解锁" align="center">
          </el-table-column>
          <el-table-column prop="topicProperty" label="组卷数(每天)" align="center">
          </el-table-column>
          <el-table-column prop="status" label="班级数(累计)" align="center">
          </el-table-column>
          <el-table-column prop="status" label="班级人数(每班)" align="center">
          </el-table-column>
          <el-table-column prop="status" label="会员数" align="center">
          </el-table-column>
          <el-table-column prop="status" label="标识" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="editMembers(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>
    <div class="standard-integral">
      <div class="base-title">积分标准</div>
      <ul>
        <li>
          <strong>步骤解锁积分</strong>
          <div>
             <el-input-number v-model="integral.stepNum" :min="0"></el-input-number>
          </div>
        </li>
        <li>
          <strong>知识树解锁积分</strong>
          <div>
             <el-input-number v-model="integral.treeNum" :min="0"></el-input-number>
          </div>
        </li>
        <li>
          <strong>题目做对得分</strong>
          <div>
             <el-input-number v-model="integral.subjectNum" :min="0"></el-input-number>
          </div>
        </li>
        <li>
          <strong>知识树分支最大得分</strong>
          <div>
             <el-input-number v-model="integral.branchNum" :min="0"></el-input-number>
          </div>
        </li>
      </ul>
    </div>
    <Dialog ref="membersDialog" title="编辑" titbg width='35%' top='250px'>
      <div class="members-dialog-box">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="ruleFrom-box">
          <div class="flex">
            <el-form-item label="名称" prop="membersName">
              <el-input v-model="ruleForm.membersName"></el-input>
            </el-form-item>
            <el-form-item label="标识" class="upload-box">
              <el-upload list-type="picture" action="">
                <el-button size="small" type="primary"  class="upload-btn">点击上传</el-button>
              </el-upload>
              <div class="upload-img">
                <img src="" alt="">
              </div>
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item label="步骤解锁">
              <el-select v-model="ruleForm.step" clearable placeholder="请选择折扣">
                <el-option v-for="item in 9" :key="item" :label="item+'折'" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="知识数解锁">
              <el-select v-model="ruleForm.tree" clearable  placeholder="请选择折扣">
                <el-option v-for="item in 9" :key="item" :label="item+'折'" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="flex number-btn">
            <el-form-item label="组卷数(每天)">
              <el-input-number v-model="ruleForm.paperNum" :min="0" size="small"></el-input-number>
            </el-form-item>
            <el-form-item label="班级数(每天)">
              <el-input-number v-model="ruleForm.classNum" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="班级人数(每班)">
              <el-input-number v-model="ruleForm.peopleNum" :min="0"></el-input-number>
            </el-form-item>
          </div>
          <div class="button-btn">
            <el-button type="primary" @click="saveMembers('ruleForm')">保存</el-button>
            <el-button type="primary" @click="$refs.membersDialog.dialogVisible = false">取消</el-button>
          </div>
        </el-form>
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
      tabLoading: false,
      tableData: [],
      integral: {
        stepNum: "",
        treeNum: "",
        subjectNum: "",
        branchNum: ""
      },
      ruleForm: {
        membersName: "",
        step: "",
        paperNum: "",
        classNum: "",
        peopleNum: ""
      },
      rules: {
        membersName: [
          { min: 1, max: 5, message: "名称最长为12个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    editMembers(row) {
      this.$refs.membersDialog.dialogVisible = true;
    },
    saveMembers(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.members-info-box {
  padding: 20px;
  background: #fff;
  box-sizing: border-box;
  .members-hender {
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .standard-integral {
    & > ul {
      margin-top: 20px;
      & > li {
        width: 30%;
        height: auto;
        background: #f7f7fa;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 2px 20px;
        & > strong {
          line-height: 35px;
        }
        & .el-input-number--small .el-input-number__increase,
        .el-input-number--small .el-input-number__decrease {
          height: 34px;
          width: 34px;
          border-radius: 50%;
          position: absolute;
          top: 0px;
          border: none;
          background: #fff;
          color: #000;
          line-height: 34px;
        }
        & .el-input-number--small .el-input-number__increase {
          right: -5px;
        }
        & .el-input-number--small .el-input-number__decrease {
          left: -40px;
        }
        & .el-input__inner {
          padding: 0px;
          border: none;
          width: 34px;
          border-radius: 50%;
          color: #2fb48a;
        }
        & .el-input-number {
          width: 70px;
        }
      }
    }
  }
  .members-dialog-box {
    min-height: 300px;
    & > .ruleFrom-box {
      & > div:first-child {
        justify-content: space-between;
        & > .el-form-item {
          width: 100%;
          margin-right: 15px;
        }
        & > .el-form-item:last-child {
          margin-right: 0;
        }
        .upload-box {
          position: relative;
        }
        .upload-btn {
          position: absolute;
          top: 32px;
          left: 0px;
        }
        .upload-img {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 80px;
          height: 80px;
          background: #f7f7fa;
          & > img {
            width: 100%;
            height: 100%;
          }
        }
      }
      & > div:nth-of-type(2) {
        & > .el-form-item {
          width: 100%;
          margin-right: 15px;
          .el-select {
            width: 100%;
          }
        }
        & > .el-form-item:last-child {
          margin-right: 0px;
        }
      }
      & > .number-btn {
        justify-content: space-between;
        flex-wrap: wrap;
        & .el-input--small .el-input__inner {
          height: 32px !important;
        }
      }
      & > .button-btn {
        text-align: center;
        & > button {
          width: 116px;
          margin-top: 20px;
        }
      }
    }
  }
}
</style>

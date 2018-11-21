<template>
  <div class="user-manage-detail">
    <el-form ref="ruleForm" :model="ruleForm" class="ruleform-box">
      <div class="flex">
        <el-form-item label="姓名">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item label="手机号">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
      </div>
      <div class="select-type">
        <el-form-item label="平行线">
          <el-select clearable  v-model="ruleForm.parallel" placeholder="是否平行线不限">
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师/学生">
          <el-select clearable  v-model="ruleForm.teacherStu" placeholder="老师学生不限">
            <el-option label="老师" value="老师"></el-option>
            <el-option label="学生" value="学生"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select clearable  v-model="ruleForm.grade" placeholder="年级">
          <!-- <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option> -->
        </el-select>
        </el-form-item>
      </div>
      <div class="material">
          <div>
            <p>资料认证</p>
            <p>
              <img src="" alt="">
              <img src="" alt="">
              <img src="" alt="">
              <img src="" alt="">
            </p>
            <p>最后修改日期：2018年4月9日01:07:21</p>
          </div>
          <div>
            <p>是否认证</p>
            <el-switch v-model="ruleForm.Authentication"></el-switch>
          </div>
      </div>
      <div class="member flex">
          <el-form-item label="会员级别">
            <el-select clearable  v-model="ruleForm.memberLevel" placeholder="会员级别">
            <!-- <el-option v-for="item in $store.state.topic_status" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            </el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="会员有效期">
            <el-date-picker v-model="ruleForm.memberDate" type="date" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
      </div>
      <el-form-item label="角色">
        <br/>
        <el-checkbox label="技术" v-model="ruleForm.technology"></el-checkbox>
        <el-checkbox label="学科组长" v-model="ruleForm.subjectLeader"></el-checkbox>
        <el-checkbox label="学校校长" v-model="ruleForm.schoolLeader"></el-checkbox>
        <el-checkbox label="区域校长" v-model="ruleForm.regionLeader"></el-checkbox>
        <el-checkbox label="市场" v-model="ruleForm.market"></el-checkbox>
        <el-checkbox label="教务" v-model="ruleForm.educational"></el-checkbox>
      </el-form-item>
      <div class="btn-ruleform">
        <el-button type="primary" @click="saveUserManage('ruleForm')">保存</el-button>
        <el-button type="info" @click="$emit('click')">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        userName: "",
        phone: "",
        parallel: "",
        teacherStu: "",
        grade: "",
        Authentication: "",
        memberLevel: "",
        memberDate: "",
        technology: "",
        subjectLeader: "",
        schoolLeader: "",
        regionLeader: "",
        market: "",
        educational: ""
      }
      /* rules: {} */
    };
  },
  methods: {
    saveUserManage(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (volid) {
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.user-manage-detail {
  .el-form-item__label {
    font-size: 16px;
  }
  .ruleform-box {
    & > .select-type {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    & > .flex {
      justify-content: space-between;
      .el-form-item--small.el-form-item {
        width: 48%;
      }
    }
    & > .member {
      margin-top: 10px;
      .el-select,
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
  .material {
    display: flex;
    & > div:first-child {
      width: 70%;
      margin-right: 20px;
      p:first-child {
        font-size: 16px;
      }
      p:nth-of-type(2) {
        width: 100%;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        margin: 5px 0px;
        img {
          width: 80px;
          height: 60px;
          display: block;
          background: #f5f5f5;
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }
    }
    & > div:last-child {
      p:first-child {
        font-size: 16px;
      }
      .el-switch {
        margin-top: 5px;
      }
    }
  }
  .btn-ruleform {
    text-align: center;
    margin-top: 50px;
    & > button {
      width: 116px;
    }
  }
}
</style>

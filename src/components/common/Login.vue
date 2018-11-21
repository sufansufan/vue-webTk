<template>
  <div class="login-reg-box">
    <div class="login-box" ref="loginBox">
      <div class="logo"></div>
      <i class="qrcode-login"></i>
      <el-tabs v-model="activeName" class="login-tabs">
        <el-tab-pane label="老师" name="teacher"></el-tab-pane>
        <el-tab-pane label="学生" name="student"></el-tab-pane>
      </el-tabs>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="input-ruleForm">
        <el-form-item prop="username">
          <el-input v-model.trim="ruleForm.username" placeholder="手机号/用户名" auto-complete="off" @keyup.native.enter="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码" auto-complete="off" @keyup.native.enter="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="submitForm('ruleForm')" :loading="isLogin">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tools flex">
        <el-checkbox v-model="autoLogin">下次自动登录</el-checkbox>
        <div>
          <el-button type="text">忘记密码</el-button>
          <span> | </span>
          <el-button type="text" @click="showLoginBox">立即注册</el-button>
        </div>
        <Register @showLoginBox="showLoginBox"></Register>
      </div>
    </div>
    <div class="copy-right">
      豫ICP备16002186号-5 / 豫ICP证130164号 河南省公安局二七分局备案编号:110105000501
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import Register from "./Register";
export default {
  components: {
    Register
  },
  data() {
    return {
      activeName: "student",
      autoLogin: false,
      isLogin: false,
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号/用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["SET_TOKEN"]),
    ...mapActions(["LOGIN_CHECK", "GET_USERINFO"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isLogin = true;
          this.LOGIN_CHECK({
            loginNameOrUserPhone: this.ruleForm.username,
            password: this.ruleForm.password
          })
            .then(() => {
              this.isLogin = false;
              this.GET_USERINFO();
              this.$message.success("登录成功");
            })
            .catch(() => {
              this.isLogin = false;
            });
        } else {
          return false;
        }
      });
    },
    showLoginBox() {
      this.$refs.loginBox.classList.toggle("is-reg");
    }
  }
};
</script>

<style lang="scss">
.login-reg-box {
  background: url("../../assets/images/login_reg_bg.png") no-repeat;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  position: relative;
  .copy-right {
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    line-height: 30px;
    color: #eaeaea;
  }
  .login-box {
    width: 380px;
    height: 480px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 0 18px #2f7966;
    &.is-reg {
      .qrcode-login {
        display: none;
      }
      .register-main {
        right: 0;
        bottom: 15px;
        width: 100%;
        height: auto;
        opacity: 1;
      }
    }
    .logo {
      width: 195px;
      height: 66px;
      background: #2fb48a;
      position: absolute;
      top: -33px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 30px;
      box-shadow: 0 0 5px #4d8375;
    }
    .qrcode-login {
      width: 0;
      height: 0;
      position: absolute;
      border: 38px solid;
      border-color: #f5f5f5 #f5f5f5 transparent transparent;
      border-radius: 0 20px 0 0;
      right: 0;
      top: 0;
      cursor: pointer;
      &::after {
        content: "";
        width: 35px;
        height: 34px;
        position: absolute;
        top: -22px;
        right: -23px;
        background: url("../../assets/images/qrcode.png") no-repeat;
      }
    }
    .login-tabs {
      padding: 0 33px;
      .el-tabs__item {
        width: 70px;
        text-align: center;
        height: 50px;
        font-size: 17px;
      }
      .el-tabs__nav {
        margin: 50px auto 0;
        float: none;
        width: 140px;
      }
    }
    .login-tools {
      padding: 0 33px;
      margin-top: 70px;
      justify-content: space-between;
      align-items: center;
      > div:nth-last-child(2) {
        color: #ccc;
      }
    }
  }
}
.input-ruleForm {
  padding: 0 33px;
  .el-form-item__content {
    margin: 25px 0 0 0 !important;
    .el-input__inner {
      height: 44px !important;
    }
  }
  .btn {
    width: 100%;
    height: 44px;
  }
}
</style>

<template>
  <div class="register-main">
    <el-tabs v-model="registerType" @tab-click="tabClick">
      <el-tab-pane label="老师" name="00101"></el-tab-pane>
      <el-tab-pane label="学生" name="00102"></el-tab-pane>
    </el-tabs>
    <div class="orLogin">已有帐号？
      <el-button type="text" @click="$emit('showLoginBox')">登录</el-button>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="input-ruleForm">
      <el-form-item prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="手机号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="loginName">
        <el-input v-model="ruleForm.loginName" placeholder="用户名" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input type="password" v-model="ruleForm.repassword" placeholder="确认密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item prop="validCode">
        <el-input class="vcode" v-model="ruleForm.validCode" maxlength="4" placeholder="验证码" auto-complete="off">
          <template slot="append">
            <el-button type="text" @click="getAutenCode" :disabled="!validCodeText.show">{{ vcodeText }}</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="agreement">
        <el-checkbox v-model="ruleForm.agreement" :label="true" name="agreement">我已同意
          <el-button type="text">《用户协议》</el-button>
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="submitForm('ruleForm')" :loading="isLock">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import config from "@/config";
import { mapMutations } from "vuex";
import { checkLogin } from "@/api/user";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const checkVCode = (rule, value, callback) => {
      if (!Number.isInteger(+value) || value.toString().length !== 4) {
        callback(new Error("请输入4位数字验证码"));
      } else {
        callback();
      }
    };
    return {
      isLock: false,
      registerType: "00102",
      validCodeText: {
        show: true,
        second: 0,
        default: "获取验证码"
      },
      ruleForm: {
        phone: "",
        loginName: "",
        password: "",
        repassword: "",
        validCode: "",
        agreement: []
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" }
        ],
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "请输入5-20位长度的用户名",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "请输入8-20位长度的密码",
            trigger: "blur"
          }
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        validCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: checkVCode, trigger: "blur" }
        ],
        agreement: [
          {
            type: "array",
            required: true,
            message: "必须同意用户协议",
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    vcodeText() {
      return this.validCodeText.second === 0
        ? this.validCodeText.default
        : this.validCodeText.second;
    }
  },
  methods: {
    ...mapMutations(["SET_TOKEN"]),
    tabClick(tab) {
      this.registerType = tab.name;
    },
    getAutenCode() {
      if (this.ruleForm.phone === "" || this.ruleForm.phone.length !== 11) {
        this.$message.error("请输入11位手机号!");
        return;
      }
      this.validCodeText.show = false;
      this.$axios
        .post(this.reqLink.getAutenCode, {
          userPhone: this.ruleForm.phone,
          longinType: this.registerType
        })
        .then(res => {
          let timer = null,
            second = config.regWaitTime;
          timer = setInterval(() => {
            this.validCodeText.second = second;
            second--;
            if (second < 0) {
              clearInterval(timer);
              this.validCodeText.show = true;
            }
          }, 1000);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { phone, loginName, password, validCode } = this.ruleForm;
          this.isLock = true;
          this.$axios
            .post(this.reqLink.register, {
              phone,
              validCode,
              loginName,
              password,
              userType: this.registerType
            })
            .then(res => {
              const { data } = res;
              checkLogin({ key: data.authSignature })
                .then(res => {
                  const { data } = res;
                  this.isLock = false;
                  this.SET_TOKEN(data.token);
                  this.$router.push({
                    path: "home"
                  });
                  this.$message.success("注册成功");
                })
                .catch(() => {
                  this.isLock = false;
                });
            })
            .catch(() => {
              this.isLock = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.register-main {
  position: absolute;
  right: 0;
  bottom: 0;
  transition: all 0.3s;
  z-index: 9999;
  background: #fff;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  .orLogin {
    position: absolute;
    right: 32px;
    top: 5px;
    color: #a7a7a7;
  }
  .el-tabs {
    padding: 0 33px;
  }
  .input-ruleForm .el-form-item__content {
    margin: 0 !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 12px;
  }
  .el-form-item--small {
    .el-form-item__error {
      position: absolute;
      left: auto;
      top: auto;
      right: 5px;
      bottom: 5px;
    }
    &:nth-last-child(3) {
      .el-form-item__error {
        right: 110px;
      }
      .el-input-group__append {
        width: 64px;
        text-align: center;
      }
    }
    &:nth-last-child(2) {
      margin-bottom: 4px;
      .el-form-item__error {
        bottom: 11px;
      }
    }
  }
}
</style>

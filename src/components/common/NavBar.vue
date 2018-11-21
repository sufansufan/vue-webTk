<template>
  <el-row :class="{'nav-box': true, collapse: !$store.state.nav_collapse}">
    <el-col :span="24">
      <div class="logo-box">
        <img id="logo" src="@/assets/images/logo.png">
        <span id="logo-text">题霸霸</span>
      </div>
      <el-menu :default-active="$route.fullPath" class="el-menu-vertical-demo" router :collapse="!$store.state.nav_collapse">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon"><img src="@/assets/images/icon/tiku.png"></i>
            <span>题库</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/questionBank/allQuestions">全部题目</el-menu-item>
            <el-menu-item index="/questionBank/myUpload">我的上传</el-menu-item>
            <el-menu-item index="/questionBank/topicReview">题目审核</el-menu-item>
            <el-menu-item index="/questionBank/questionBankFactory">题库工厂</el-menu-item>
            <el-menu-item index="/questionBank/labelManagement">标签管理</el-menu-item>
            <el-menu-item index="/questionBank/parsingTemplate">解析模板</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon"><img src="@/assets/images/icon/zj.png"></i>
            <span slot="title">组卷</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/testAssembly/papersManage">组卷管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="">班级管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="">统计查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/">
          <i class="el-icon"><img src="@/assets/images/icon/dj.png"></i>
          <span slot="title">答卷</span>
        </el-menu-item>
        <el-menu-item index="/">
          <i class="el-icon"><img src="@/assets/images/icon/yj.png"></i>
          <span slot="title">阅卷</span>
        </el-menu-item>
        <el-menu-item index="/">
          <i class="el-icon"><img src="@/assets/images/icon/lx.png"></i>
          <span slot="title">练习</span>
        </el-menu-item>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon"><img src="@/assets/images/icon/pz.png"></i>
            <span slot="title">配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/configure/userGroup">用户组</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="/configure/userManage">用户管理</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="/configure/personalInfor">个人信息</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="/configure/membersInfo">会员配置</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false
    };
  }
};
</script>

<style lang="scss">
.nav-box {
  width: 226px;
  transition: width 0.3s;
  #logo-text {
    display: none;
  }
  &.collapse {
    width: 64px;
    #logo {
      display: none;
    }
    #logo-text {
      display: block;
      color: #fff;
      font-size: 20px;
      padding-top: 5px;
      letter-spacing: 10px;
      writing-mode: vertical-lr;
    }
    .el-menu .el-icon {
      padding: 0;
    }
    .el-submenu__title span,
    .el-menu-item span {
      display: none;
    }
  }
}
.logo-box {
  background: $logoBgColor;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.el-menu {
  border: 0;
  text-align: left;
  .el-menu-item-group__title {
    display: none;
  }
  .el-menu-item,
  .el-submenu__title {
    font-size: 16px !important;
  }
  .el-submenu .el-menu-item {
    padding-left: 90px !important;
    font-size: 15px !important;
    height: 46px;
    line-height: 46px;
    color: #757575;
    &.is-active {
      background: #f5f6fa !important;
      border-left: 4px solid $eleColor;
      padding-left: 86px !important;
      color: $eleColor;
      font-weight: bold;
    }
  }
  .el-icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    padding: 0 20px;
    justify-content: center;
  }
}
</style>

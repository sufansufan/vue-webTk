<template>
  <div id="header">
    <div class="position">
      <el-button type="primary" size="mini" :icon="$store.state.nav_collapse ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'" @click="()=>$store.commit('NAV_COllAPSE_CHANGE')"></el-button>
      <el-breadcrumb separator="/" v-show="$route.fullPath !== '/home'">
        <el-breadcrumb-item v-for="(item, index) in path" :key="index" :to="{ path: item.path }">{{item.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-info">
      <span class="head-url"><img :src="userInfo.headUrl" :style="{display: userInfo.headUrl || 'none' }"></span>
      <span>{{ userInfo.userName }}</span>
      <span>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <img src="@/assets/images/icon/vip.png">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户中心</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <span><img src="@/assets/images/icon/pxx.png"></span>
      <span><img src="@/assets/images/icon/ls.png"></span>
      <span><img src="@/assets/images/icon/rz.png"></span>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      path: [],
      userInfo: this.$store.state.user
    };
  },
  created() {
    this.getPath();
  },
  watch: {
    "$route.matched"() {
      this.getPath();
    }
  },
  methods: {
    ...mapActions(["LOGOUT"]),
    getPath() {
      this.path = this.$route.matched
        .filter(item => item.meta.title)
        .map(item => {
          return {
            title: item.meta.title,
            path: ""
          };
        });
      this.path.unshift({
        title: "首页",
        path: "/home"
      });
    },
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.LOGOUT().then(() => {
            this.$message.success("退出成功");
            this.$router.push({ name: "login" });
          });
          break;
      }
    }
  }
};
</script>

<style lang="scss">
#header {
  height: 60px;
  line-height: 60px;
  padding: 0 26px;
  color: $gloFontColor;
  display: flex;
  justify-content: space-between;
  .position {
    margin-left: 26px \9;
    display: flex;
    .el-button {
      height: 29px;
      margin: 15px 10px 0 0;
    }
    .el-breadcrumb__item {
      line-height: 60px;
      color: $cccc;
      .el-breadcrumb__inner,
      span.el-breadcrumb__inner a {
        color: $cccc;
      }
      &:last-child > span {
        color: $gloFontColor;
      }
      &:first-child ~ .el-breadcrumb__item span {
        font-weight: normal;
        cursor: default;
      }
    }
  }
  .user-info {
    display: flex;
    align-items: center;
    span {
      display: inline-flex;
      align-self: center;
      margin-right: 20px;
      &.head-url {
        width: 29px;
        height: 29px;
        background: url("../../assets/images/icon/tx.png") left center no-repeat;
      }
      &:first-child {
        margin-right: 5px;
        & + span {
          color: #000;
        }
      }
      .el-dropdown {
        height: 40px;
        .el-icon--right {
          margin-top: 12px;
        }
      }
    }
  }
}
</style>

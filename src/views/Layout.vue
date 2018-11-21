<template>
  <div class="el-container">
    <div class="el-aside">
      <NavBar></NavBar>
    </div>
    <div class="el-warp">
      <div class="el-header">
        <Header></Header>
      </div>
      <div class="el-main">
        <transition name="slide-fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/NavBar";
import Header from "@/components/common/Header";
export default {
  components: {
    NavBar,
    Header
  }
};
</script>

<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
.slide-fade-enter {
  transform: translateX(30px);
  opacity: 0;
}
.el-container {
  .el-header {
    height: 60px;
    padding: 0;
  }
  .el-aside {
    background-color: #fff;
    color: #333;
    text-align: center;
    width: max-content;
    height: 100vh;
  }
  .el-warp {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-main {
      background-color: #f5f6fa;
      padding: 26px 26px 0;
      height: calc(100vh - 60px);
      > div:first-child {
        box-sizing: border-box;
      }
    }
  }
}
</style>

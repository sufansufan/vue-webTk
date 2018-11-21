<template>
  <div class="subject-details">
    <div class="go-back">
      <el-button type="primary" @click="$router.back(-1)">返回</el-button>
    </div>
    <div class="subject-details-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="info">
          <Info :add="isAdd"></Info>
        </el-tab-pane>
        <el-tab-pane label="解析" name="analysis">
          <Analysis :add="isAdd"></Analysis>
        </el-tab-pane>
        <el-tab-pane label="操作历史" name="history" v-if="!isAdd">
          <History ref="history"></History>
        </el-tab-pane>
        <el-tab-pane label="评论" name="comment" v-if="!isAdd">
          <Comment></Comment>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    Info: resolve => require(["./Info"], resolve),
    Analysis: resolve => require(["./Analysis"], resolve),
    History: resolve => require(["./History"], resolve),
    Comment: resolve => require(["./Comment"], resolve)
  },
  data() {
    return {
      activeName: "info"
    };
  },
  computed: {
    isAdd() {
      return this.$route.fullPath.includes("addtopic");
    }
  },
  watch: {
    activeName(newVal) {
      if (this.isAdd) {
        newVal === "history" && this.$refs.history.getHistory();
      }
    }
  }
};
</script>

<style lang="scss">
.subject-details {
  .go-back {
    margin-bottom: 26px;
  }
  .subject-details-main {
    background: #fff;
    padding: 20px 26px;
  }
}
</style>

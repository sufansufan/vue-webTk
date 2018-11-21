<template>
  <el-dialog :title="title || '标题'" :visible.sync="dialogVisible" :width="width || '70%'" :top="top || '70px'" :close-on-click-modal="false" :class="{titbg: titbg !== undefined, 'align-center': center}" @close="closed" center>
    <slot></slot>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    titbg: undefined,
    closed: {
      type: Function,
      default: () => {}
    },
    width: String,
    top: String,
    center: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false // 是否显示
    };
  }
};
</script>

<style lang="scss">
.titbg .el-dialog__header {
  background: #f5f5f5;
  padding: 10px 0 9px;
  height: 24px;
  line-height: 24px;
  border-bottom: 1px solid #eee;
  .el-dialog__headerbtn {
    top: 15px;
  }
}
.align-center .el-dialog {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 !important;
}
</style>

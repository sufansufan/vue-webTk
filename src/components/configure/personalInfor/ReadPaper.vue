<template>
  <div class="read-paper-box">
    <dl>
      <dt class="base-title">阅卷</dt>
      <dd>
        <div class="read-ratio">
          <p class="flex">
            <span>总题数：<strong>5233</strong></span>
            <span>总题数：<strong>5233</strong></span>
            <span>总正确率： <strong>5233</strong></span>
          </p>
          <p>
            <span>近30日表现：</span>
            <strong>2018年4月9日开始计算</strong>
          </p>
          <p>
            <span>上传题数</span>
            <em>全服TOP 10%</em>
            <el-progress :stroke-width="18" :percentage="90" color="#ffc064"></el-progress>
          </p>
          <p>
            <span>组卷数</span>
            <em>全服TOP 10%</em>
            <el-progress :stroke-width="18" :percentage="60" color="#ffe562"></el-progress>
          </p>
          <p>
            <span>阅卷数</span>
            <em>全服TOP 10%</em>
            <el-progress :stroke-width="18" :percentage="30" color="#fbae91"></el-progress>
          </p>
        </div>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.read-paper-box {
  padding: 20px 0px 0px;
  .read-ratio {
    padding: 20px;
    flex-wrap: wrap;
    & > p {
      margin-bottom: 16px;
      color: #898989;
      position: relative;
      & > strong {
        color: #000;
      }
      & > .el-progress {
        margin-top: 10px;
      }
      & > em {
        font-style: initial;
        position: absolute;
        right: 0;
      }
    }
    & > p:first-child {
      justify-content: space-between;
      & > span > b {
        color: #3db992;
      }
      & > span > strong {
        color: #000;
      }
    }
  }
}
</style>

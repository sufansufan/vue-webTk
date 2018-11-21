<template>
  <div class="answer-paper-box">
    <dl>
      <dt class="base-title">答卷</dt>
      <dd>
        <div class="answer-ratio">
          <p class="flex">
            <span>总题数：<strong>5233</strong></span>
            <span>总正确率： <b>85.6%</b></span>
          </p>
          <p>
            <span>近30日同年级表现：</span>
            <strong>2018年4月9日开始计算</strong>
          </p>
          <p>
            <span>正确率</span>
            <em>全服TOP 10%</em>
            <el-progress :stroke-width="18" :percentage="90" color="#ffc064"></el-progress>
          </p>
          <p>
            <span>评分</span>
            <em>全服TOP 10%</em>
            <el-progress :stroke-width="18" :percentage="60" color="#ffe562"></el-progress>
          </p>
          <p>
            <span>题数</span>
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
.answer-paper-box {
  padding: 20px 0px 0px;
  .answer-ratio {
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

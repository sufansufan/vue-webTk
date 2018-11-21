<template>
  <div class="home">
    <dl>
      <dt>
        <div class="base-title">
          最新入库
        </div>
        <div class="right-options">
          <el-select v-model="newPushVal" placeholder="学部">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="newPushVal" placeholder="科目">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </dt>
      <dd>
        <ul>
          <li v-for="(item, index) in 7" :data-index="~~index+1" :key="index">2004年印度洋发生了强烈地震，并引发海啸，造成500万人受灾，国际社会发扬人道主义精神为灾民捐助救</li>
        </ul>
      </dd>
    </dl>
    <dl>
      <dt>
        <el-tabs v-model="frActiveName">
          <el-tab-pane label="答卷" name="answerSheet">
            <div class="fr-box">
              <p>
                <span>积分：
                  <b>1386</b>
                </span>
                <span>年级：
                  <b>三年级</b>
                </span>
                <span>总题数：
                  <b>189</b>
                </span>
              </p>
              <p>
                <span>正确率：
                  <strong>85.6%</strong>
                </span>
              </p>
              <p>
                <span>近30日表现：
                  <strong>2018年4月7日开始计算</strong>
                </span>
              </p>
              <p>
                <span>上传错题</span>
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
          </el-tab-pane>
          <el-tab-pane label="上传组阅卷" name="upload">上传组阅卷</el-tab-pane>
        </el-tabs>
      </dt>
    </dl>
    <dl>
      <dt>
        <div class="base-title">
          热门题目
        </div>
        <div class="right-options">
          <el-select v-model="newPushVal" placeholder="学部">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="newPushVal" placeholder="科目">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </dt>
      <dd>
        <ul>
          <li v-for="(item, index) in 7" :data-index="~~index+1" :key="index">2004年印度洋发生了强烈地震，并引发海啸，造成500万人受灾，国际社会发扬人道主义精神为灾民捐助救</li>
        </ul>
      </dd>
    </dl>
    <dl>
      <dt>
        <div class="base-title">
          错题排行
        </div>
        <div class="right-options">
          <el-select v-model="newPushVal" placeholder="学部">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="newPushVal" placeholder="科目">
            <el-option v-for="(item, index) in newPush" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
      </dt>
      <dd>
        <ul>
          <li v-for="(item, index) in 7" :data-index="~~index+1" :key="index">2004年印度洋发生了强烈地震，并引发海啸，造成500万人受灾，国际社会发扬人道主义精神为灾民捐助救</li>
        </ul>
      </dd>
    </dl>
    </div>
</template>

<script>
export default {
  data() {
    return {
      newPushVal: "",
      newPush: [],
      frActiveName: "answerSheet"
    };
  }
};
</script>

<style lang="scss">
.home {
  background: #fff;
  min-height: calc(100% - 24px);
  padding: 24px 24px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  dl {
    width: calc(50% - 18px);
    margin-bottom: 40px;
    dt {
      display: flex;
      justify-content: space-between;
      & > .el-tabs {
        width: 100%;
      }
      .right-options {
        .el-input--suffix {
          width: 112px;
          margin-left: 12px;
        }
      }
      .fr-box {
        background: #f9f9fb;
        padding: 38px;
        color: #898989;
        font-size: $gloFontSize;
        border: 1px solid #f5f5f5 {
          radius: 5px;
        }
        p {
          margin-bottom: 16px;
          position: relative;
          &:first-child {
            display: flex;
            justify-content: space-between;
          }
          strong {
            color: #000;
          }
          b {
            color: $gloFontColor;
          }
          em {
            font-style: initial;
            position: absolute;
            right: 0;
          }
          .el-progress-bar__outer {
            margin-top: 15px;
          }
          .el-progress__text {
            font-size: 16px !important;
            margin-top: 15px;
            color: #000;
          }
        }
      }
    }
    dd {
      ul {
        padding: 10px 0;
        li {
          height: 42px;
          line-height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          background: #f9f9fb;
          border: 1px solid #f5f5f5 {
            radius: 5px;
          }
          margin-top: 10px;
          padding: 0 10px 0 50px;
          position: relative;
          font-size: $gloFontSize;
          &::after {
            content: attr(data-index);
            position: absolute;
            width: 28px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            color: #fff;
            left: 10px;
            top: 7px;
            background: #c7e5e0;
            border-radius: 50%;
          }
          &[data-index="1"]::after {
            background: #ffa443;
          }
          &[data-index="2"]::after {
            background: #ffd143;
          }
          &[data-index="3"]::after {
            background: #ffe555;
          }
        }
      }
    }
  }
}
</style>

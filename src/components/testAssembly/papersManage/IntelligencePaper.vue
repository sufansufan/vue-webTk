<template>
  <div class="intelligence-paper">
    <div class="go-back">
      <el-button type="primary" @click="$router.back(-1)">返回</el-button>
    </div>
    <div class="intelligence-paper-box">
      <div class="base-title">题目范围</div>
      <div class="select-options">
        <el-select clearable v-model="options.stuDepartment" placeholder="学部不限">
          <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="科目不限">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="题型">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="知识树选择">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="难度选择">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="教材版本">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-select clearable v-model="options.stuSubject" placeholder="年份选择">
          <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
          </el-option>
        </el-select>
        <el-input clearable placeholder="关键字/组卷ID" v-model.trim="keyWord.value" style="width: 420px;" @keyup.enter.native="search(keyWord)">
            <el-button slot="append" icon="el-icon-search" @click="search(keyWord)"></el-button>
          </el-input>
      </div>
      <div class="base-title">题型分布</div>
      <div class="choose-count">
        <div>
          <el-input-number v-model="chooseCount.choice" controls-position="right" @change="handleChange" :min="1" :max="10"  label="选择题"></el-input-number>
          <el-input-number v-model="chooseCount.choice" controls-position="right" @change="handleChange" :min="1" :max="10"  label="填空题"></el-input-number>
          <el-input-number v-model="chooseCount.choice" controls-position="right" @change="handleChange" :min="1" :max="10"  label="解答题"></el-input-number>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      options: {
        stuDepartment: "",
        stuSubject: ""
      },
      keyWord: {
        value: "",
        keyName: "",
        ketId: ""
      },
      chooseCount: {
        choice: ""
      }
    };
  }
};
</script>

<style lang="scss">
.intelligence-paper {
  .go-back {
    margin-bottom: 26px;
  }
  .intelligence-paper-box {
    padding: 20px;
    background: #fff;
    box-sizing: border-box;
    .select-options {
      margin-top: 20px;
      & > * {
        margin: 0 20px 20px 0;
      }
    }
    .choose-count {
      & > div {
        & > .el-input__inner {
          position: relative;
          & > p {
            width: 50px;
            height: 32px;
            background: red;
            position: absolute;
            top: 0;
          }
        }
      }
    }
  }
}
</style>

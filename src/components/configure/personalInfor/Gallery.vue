<template>
  <div class="gallery-photo-box">
    <div>
      <div class="base-title">图库</div>
      <div>
        <el-button type="primary" @click="selectImg">选择</el-button>
        <el-button type="primary" @click="uploadImg">上传</el-button>
      </div>
    </div>
    <div class="photo-details">
      <div>
        <p>2018 年 5 月 5 日</p>
        <ul class="photo-list">
          <li ref="photoList" v-for="item in 6" :key="item">
            <img src="" alt="">
            <span>PNG</span>
            <el-checkbox v-show="checkboxStutas" ref="checkboxList"></el-checkbox>
          </li>
        </ul>
      </div>
      <div>
        <p>2018 年 5 月 5 日</p>
        <ul class="photo-list">
          <li>
            <img src="" alt="">
            <span>PNG</span>
          </li>
          <li>
            <img src="" alt="">
            <span>PNG</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkboxStutas: false
    };
  },
  methods: {
    selectImg() {
      this.checkboxStutas = true;
    },
    uploadImg() {
      /*  this.$refs.checkboxList.filter(item => item.$el.classList[2]);
      console.log(this.$refs.checkboxList.filter(item => item.$el.classList)); */
    }
  }
};
</script>

<style lang="scss">
.gallery-photo-box {
  padding-top: 10px;
  & > div:first-child {
    display: flex;
    justify-content: space-between;
  }
  .photo-details {
    margin-top: 20px;
    padding: 10px 20px 20px;
    border: 1px solid $borderColor;
    border-radius: 4px;
    color: #898989;
    & > div {
      margin-top: 10px;
    }
    .photo-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      & > li {
        width: 162px;
        height: 100px;
        margin-right: 10px;
        margin-top: 10px;
        background: #f3f3f3;
        position: relative;
        & > img {
          width: 100%;
          height: 100%;
        }
        & > span {
          position: absolute;
          bottom: 0;
          right: 0;
          color: #000;
        }
        & > .el-checkbox {
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
  }
}
</style>

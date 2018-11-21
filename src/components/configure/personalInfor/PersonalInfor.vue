<template>
  <div class="personal-info-box">
    <dl>
      <dt>
        <div class="base-title">基本信息</div>
        <el-button type="primary" @click="editInfo" v-if="!editStatus">编辑</el-button>
        <el-button type="primary" @click="saveInfo" v-else>保存</el-button>
      </dt>
      <dd>
        <ul>
          <li>
            <div>
              <img src="@/assets/images/par.png" alt="">
            </div>
          </li>
          <li>
            <p>
              <span>姓名：</span>
              <strong v-if="!editStatus">平行线</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>手机号：</span>
              <strong v-if="!editStatus">15512341234</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>邮箱：</span>
              <strong v-if="!editStatus">123456789@qq.com</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>积分：</span>
              <strong v-if="!editStatus">1000</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>年级：</span>
              <strong v-if="!editStatus">一年级</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>会员级别：</span>
              <strong v-if="!editStatus">地平线</strong>
              <el-input v-else></el-input>
            </p>
            <p>
              <span>解锁钥匙：</span>
              <img src="@/assets/images/icon/key.png" alt="" v-if="!editStatus">
              <strong v-if="!editStatus">×20</strong>
              <el-input v-else></el-input>
            </p>
          </li>
          <li>
            <p>认证:</p>
            <div class="authentication">
              <div>
                <img src="" alt="">
              </div>
              <div>
                <img src="" alt="">
              </div>
              <div>
                <img src="" alt="">
              </div>
              <el-button type="text" v-if="editStatus">上传认证资料</el-button>
            </div>
            <p v-if="!editStatus">最后修改日期：2018年4月9日01:07:21</p>
          </li>
        </ul>
      </dd>
    </dl>
    <div class="answer-read-box">
      <div>
        <Answer-paper></Answer-paper>
      </div>
      <p class="line"></p>
      <div>
        <Read-paper></Read-paper>
      </div>
    </div>
    <div class="gallery-box">
      <Gallery></Gallery>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    AnswerPaper: resolve => require(["./AnswerPaper"], resolve),
    ReadPaper: resolve => require(["./ReadPaper"], resolve),
    Gallery: resolve => require(["./Gallery"], resolve)
  },
  data() {
    return {
      editStatus: false
    };
  },
  methods: {
    editInfo() {
      this.editStatus = true;
    },
    saveInfo() {
      this.editStatus = false;
    }
  }
};
</script>

<style lang="scss">
.personal-info-box {
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  dl > dt {
    display: flex;
    justify-content: space-between;
  }
  dd > ul {
    width: 100%;
    height: auto;
    display: flex;
    padding-top: 35px;
    li {
      height: 100%;
    }
    & > li:first-child {
      width: 13%;
      height: 100%;
      & > div {
        text-align: center;
        width: 70%;
        height: 70%;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    & > li:nth-of-type(2) {
      width: auto;
      height: auto;
      padding-left: 30px;
      display: flex;
      flex-wrap: wrap;
      & > p {
        width: 33.33%;
        align-items: baseline;
        margin-top: 10px;
        span {
          color: #8a8a8a;
          padding-right: 30px;
          margin-left: 10px;
        }
        &:nth-of-type(5) {
          span {
            padding-right: 43px;
          }
        }
        &:nth-of-type(6) {
          span {
            padding-right: 3px;
          }
        }
        &:nth-of-type(7) {
          span {
            padding-right: 2px;
          }
        }
        & > .el-input {
          width: 200px;
        }
      }
    }
    & > li:last-child {
      width: 30%;
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
      .authentication {
        width: auto;
        height: auto;
        margin: -15px 0px 10px 50px;
        padding-right: 20px;
        display: flex;
        flex-wrap: wrap;
        & > button {
          height: 32px;
          line-height: 15px;
        }
        & > div {
          width: 40px;
          height: 40px;
          background: #f3f3f3;
          border-radius: 50%;
          margin-right: 10px;
          & > img {
            width: 100%;
            height: 100%;
          }
        }
      }
      & > p {
        color: #8a8a8a;
      }
      & > p:last-child {
        margin-top: 10px;
      }
    }
  }
  .answer-read-box {
    width: 100%;
    height: auto;
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-top: 1px solid $borderColor;
    border-bottom: 1px solid $borderColor;
    & > div {
      width: 48%;
    }
    .line {
      margin: 20px 0px;
      border: 1px solid $borderColor;
    }
  }
  .gallery-box {
    margin-top: 20px;
  }
}
</style>

<template>
  <div class="parsing-template">
    <div class="label-options">
      <span>标签</span>
      <el-select clearable v-model="options.stuDepartment" placeholder="学部">
        <el-option v-for="item in $store.state.stu_department" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
        </el-option>
      </el-select>
      <el-select clearable v-model="options.stuSubject" placeholder="科目">
        <el-option v-for="item in $store.state.stu_subject" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
        </el-option>
      </el-select>
    </div>
    <el-tabs v-model="editableTabsId" type="card" editable @edit="handleTabsEdit">
      <el-tab-pane v-for="item in editableTabs" :key="item.id" :label="item.analysisTempleteName" :name="item.id">
        <div class="parsing-content">
          <p>解析名称</p>
          <div class="title flex">
            <el-input style="width: 40%;" v-model="labelCheckedVal" placeholder="请输入内容"></el-input>
            <el-button type="primary" @click="savedTabsTitle(item)">保存</el-button>
          </div>
          <ParsingLabel :dataList="item" :stuDepartment="options.stuDepartment" :stuSubject="options.stuSubject" @updateList="updateList"></ParsingLabel>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import ParsingLabel from "./ParsingLabel";
export default {
  components: {
    ParsingLabel
  },
  data() {
    return {
      labelContentLoading: true,
      editableTabsId: "",
      options: {
        stuDepartment: "",
        stuSubject: ""
      },
      labelCheckedVal: "",
      editableTabs: [],
      source: null
    };
  },
  created() {
    this.Util.base.getDictList("rich_text_type");
    this.Util.base.getDictList("stu_subject");
    this.Util.base.getDictList("stu_department");
    this.getData(() => {
      if (this.editableTabs.length) {
        this.editableTabsId = this.editableTabs[0].id;
      }
    });
    this.source = new EventSource(
      "http://192.168.1.107:8081/PxxTiKu/home/a/topicBank/getInputTopicStatus"
    );
    this.source.onmessage = function(event) {
      console.log(event.data);
    };
    this.source.onerror = function(error) {
      console.log(error);
    };
  },
  beforeDestroy() {
    this.source.close();
  },
  watch: {
    options: {
      handler() {
        this.getData();
      },
      deep: true
    },
    editableTabsId(prev, next) {
      if (prev !== "0") {
        this.labelCheckedVal = this.editableTabs.filter(
          item => item.id === this.editableTabsId
        )[0].analysisTempleteName;
      }
    }
  },
  methods: {
    getData(succ) {
      this.$axios
        .post(this.reqLink.getTopicAnalysisTempleteList, {
          stuDepartment: this.options.stuDepartment,
          stuSubject: this.options.stuSubject
        })
        .then(({ data }) => {
          this.editableTabs = data.list || [];
          succ && succ();
        });
    },
    updateList() {
      this.getData();
    },
    handleTabsEdit(itemId, action) {
      if (action === "add") {
        let len = this.editableTabs.length,
          lastItem = this.editableTabs[this.editableTabs.length - 1],
          index = lastItem ? lastItem.analysisTempleteSort + 1 : 0;
        this.$axios
          .post(this.reqLink.createAndUpdateTopicAnalysisTemplete, {
            Loading: true,
            analysisTemplete: {
              analysisTempleteContent: [],
              stuDepartment: this.options.stuDepartment,
              stuSubject: this.options.stuSubject,
              analysisTempleteName: "解析" + (len + 1),
              analysisTempleteSort: index
            }
          })
          .then(() => {
            this.getData(() => {
              len === 0 && (this.editableTabsId = this.editableTabs[0].id);
            });
            this.Util.base.tips("添加成功！", "success");
          });
      }
      if (action === "remove") {
        let index = this.editableTabs.findIndex(item => item.id === itemId);
        this.$confirm(`是否删除该标签页？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            this.$axios
              .post(this.reqLink.deleteTopicAnalysisTemplete, {
                Loading: true,
                id: itemId
              })
              .then(() => {
                this.getData(() => {
                  if (
                    this.editableTabsId === itemId &&
                    this.editableTabs.length
                  ) {
                    this.editableTabsId = this.editableTabs[index - 1].id;
                  }
                });
                this.Util.base.tips("删除成功！", "success");
              });
          })
          .catch(() => {});
      }
    },
    savedTabsTitle(item) {
      if (!this.labelCheckedVal) {
        this.Util.base.tips("解析名称不能为空", "error");
        return;
      }
      item.analysisTempleteName = this.labelCheckedVal;
      item.stuDepartment = this.options.stuDepartment;
      item.stuSubject = this.options.stuSubject;
      this.$axios
        .post(this.reqLink.createAndUpdateTopicAnalysisTemplete, {
          Loading: true,
          analysisTemplete: item
        })
        .then(() => {
          this.Util.base.tips("解析名称更新成功!", "success");
        });
    }
  }
};
</script>

<style lang="scss">
.parsing-template {
  background: #fff;
  padding: 26px;
  .label-options {
    margin-bottom: 20px;
    > div {
      margin-left: 15px;
    }
  }
  .parsing-content {
    > .title {
      align-items: center;
      margin-top: 10px;
      > div {
        margin-right: 15px;
      }
    }
  }

  .el-tabs__nav-scroll {
    overflow: initial;
  }
  .el-tabs--card > .el-tabs__header {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    .el-tabs__item.is-active.is-closable {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -2px;
        background: #fff;
        width: 100%;
        height: 1px;
      }
    }
  }
}
</style>

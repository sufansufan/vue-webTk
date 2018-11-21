<template>
  <div class="tree-nodes-box">
    <div class="tree-list-top-tools flex">
      <div>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="treeEdit('add')">新增</el-button>
      </div>
    </div>
    <div class="tree-node-list">
      <div class="tit flex">
        <span>名称</span>
        <span>类型</span>
        <span></span>
      </div>
      <transition-group name="list-complete" tag="div">
        <div class="tree-list-item" v-for="(item, index) in dataList.analysisTempleteContent" :key="item.id">
          <p>{{ item.topicAnalysisTempleteExpand }}</p>
          <p>{{ type2txt(item.richTextType) }}</p>
          <div class="node-right-tools">
            <i class="el-icon-delete" @click="treeNodeRemove(index, item)" title="删除"></i>
            <i class="el-icon-edit" @click="treeEdit(item, index)" title="编辑"></i>
            <i class="el-icon-upload2" @click="treeNodeMove(index, 'up')" title="上移"></i>
            <i class="el-icon-download" @click="treeNodeMove(index, 'down')" title="下移"></i>
          </div>
        </div>
      </transition-group>
      <span class="empty-text" v-show="!dataList.analysisTempleteContent.length">无子节点</span>
    </div>
    <!-- 树节点新增/编辑弹框 -->
    <Dialog ref="treeDialog" width="400px" :title="treeDialogTitle" titbg center>
      <div class="tree-edit-inp">
        <p>名称</p>
        <p>
          <el-input v-model="treeCheckeNode.topicAnalysisTempleteExpand" placeholder="请输入名称"></el-input>
        </p>
        <p>类型</p>
        <p>
          <el-select v-model="treeCheckeNode.richTextType" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in $store.state.rich_text_type" :key="item.dictId" :label="item.dictLabel" :value="item.dictValue">
            </el-option>
          </el-select>
        </p>
        <p>
          <el-button size="small" type="primary" @click="savedTreeChange" icon="el-icon-check">保存</el-button>
        </p>
      </div>
    </Dialog>
  </div>

</template>

<script>
import Dialog from "@/components/common/Dialog";
export default {
  props: {
    dataList: {
      type: Object,
      default() {
        return {};
      }
    },
    stuDepartment: {
      type: String,
      default: ""
    },
    stuSubject: {
      type: String,
      default: ""
    }
  },
  components: {
    Dialog
  },
  data() {
    return {
      treeDialogTitle: "",
      treeCheckeNode: {
        id: "",
        richTextType: "01601",
        topicAnalysisTempleteExpand: "",
        topicAnalysisTempleteSort: 0
      },
      isEditDialog: false,
      rules: {
        "treeCheckeNode.topicAnalysisTempleteExpand": [
          { required: true, message: "请输入名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    type2txt(type) {
      let res = this.$store.state.rich_text_type.filter(
        item => item.dictValue === type
      );
      if (res.length) {
        return res[0].dictLabel;
      } else {
        return type;
      }
    },
    treeNodeRemove(index, item) {
      this.$confirm(
        `是否删除 [ ${item.topicAnalysisTempleteExpand} ] ？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.$axios
            .post(this.reqLink.deleteTopicAnalysisTempleteContent, {
              Loading: true,
              id: item.id
            })
            .then(res => {
              this.Util.base.tips("删除成功！", "success");
              this.$emit("updateList");
            });
        })
        .catch(() => {});
    },
    treeEdit(item) {
      if (item === "add") {
        this.treeDialogTitle = "新增";
        this.isEditDialog = false;
        this.treeCheckeNode = {
          id: "",
          richTextType: "01601",
          topicAnalysisTempleteExpand: "",
          topicAnalysisTempleteSort: 0
        };
      } else {
        this.treeDialogTitle = "编辑";
        this.isEditDialog = true;
        this.treeCheckeNode = JSON.parse(JSON.stringify(item));
      }
      this.$refs.treeDialog.dialogVisible = true;
    },
    savedTreeChange() {
      if (!this.treeCheckeNode.topicAnalysisTempleteExpand) {
        this.Util.base.tips("数据不能为空", "error");
        return;
      }
      let o = JSON.parse(JSON.stringify(this.dataList)),
        index = this.dataList.analysisTempleteContent.findIndex(
          item => item.id === this.treeCheckeNode.id
        );
      if (this.isEditDialog) {
        o.analysisTempleteContent[index] = this.treeCheckeNode;
      } else {
        o.analysisTempleteContent.push(this.treeCheckeNode);
      }
      this.nodeChange(o, () => {
        this.$refs.treeDialog.dialogVisible = false;
        if (this.isEditDialog) {
          this.dataList.analysisTempleteContent[
            index
          ].topicAnalysisTempleteExpand = this.treeCheckeNode.topicAnalysisTempleteExpand;
        } else {
          this.$emit("updateList");
        }
        this.Util.base.tips(
          this.isEditDialog ? "修改成功" : "添加成功",
          "success"
        );
      });
    },
    treeNodeMove(index, type) {
      if (index === 0 && type === "up") {
        this.Util.base.tips("已经在最上了，无法继续向上移动~");
        return;
      } else if (
        index === this.dataList.analysisTempleteContent.length - 1 &&
        type === "down"
      ) {
        this.Util.base.tips("已经在最下了，无法继续向下移动~");
        return;
      }
      let { analysisTempleteContent } = this.dataList,
        tNode = analysisTempleteContent[index],
        ind = type === "up" ? index - 1 : index + 1;
      tNode.topicAnalysisTempleteSort =
        analysisTempleteContent[ind].topicAnalysisTempleteSort;
      if (type === "up") {
        analysisTempleteContent[ind].topicAnalysisTempleteSort += 1;
      } else {
        analysisTempleteContent[ind].topicAnalysisTempleteSort -= 1;
      }
      analysisTempleteContent.splice(index, 1);
      analysisTempleteContent.splice(ind, 0, tNode);
      this.nodeChange(this.dataList, () => {
        this.Util.base.tips("位置已更新!", "success");
      });
    },
    nodeChange(params, succ) {
      params.stuDepartment = this.stuDepartment;
      params.stuSubject = this.stuSubject;
      let reqParams = {
        analysisTemplete: params,
        Loading: true
      };
      this.$axios
        .post(this.reqLink.createAndUpdateTopicAnalysisTemplete, reqParams)
        .then(() => {
          succ && succ();
        });
    }
  }
};
</script>

<style lang="scss">
.tree-nodes-box {
  & > p {
    margin: 20px 0;
    font-size: 14px;
    color: #434343;
  }
  .tree-list-top-tools {
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    & > div > p {
      font-size: 14px;
      color: #434343;
    }
    .el-breadcrumb {
      margin: 10px 0;
      & > .el-breadcrumb__item {
        & > span {
          color: $eleColor;
        }
        &:not(:last-child) > span {
          color: #a7a7a7;
        }
      }
    }
  }
  .tree-edit-inp {
    p {
      margin-bottom: 20px;
      &:last-child {
        text-align: right;
        margin: 0;
      }
    }
  }
  .tree-node-list {
    height: calc(100vh - 386px);
    overflow-y: auto;
    border: 1px solid #ebebeb {
      radius: 3px;
    }
    .tit {
      justify-content: space-between;
      padding: 0 0 15px 15px;
      > span {
        display: inline-block;
        width: 40%;
        &:last-child {
          width: 140px;
        }
      }
    }
    padding: 15px;
    .tree-list-item {
      background: #f8f8fb;
      margin-bottom: 15px;
      line-height: 38px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      // transition: all 0.3s;
      &:last-child {
        margin-bottom: 0;
      }
      & > .node-right-tools > i {
        width: 25px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        background: #fff;
        color: $eleColor;
        cursor: pointer;
        margin-left: 8px;
        border: 1px solid #ededf0 {
          radius: 50%;
        }
        transition: all 0.3s;
        &:hover {
          background: $eleColor;
          color: #fff;
          border-color: #fff;
        }
      }
    }
  }
}
</style>

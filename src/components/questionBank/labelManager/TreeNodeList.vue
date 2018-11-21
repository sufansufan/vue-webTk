<template>
  <div class="tree-nodes-box">
    <div class="tree-list-top-tools flex">
      <div>
        <slot name="location"></slot>
        <slot name="tips"></slot>
      </div>
      <div>
        <el-button size="small" icon="el-icon-plus" :disabled="!location.length" @click="treeEdit('add')">新增</el-button>
      </div>
    </div>

    <div class="tree-node-list">
      <transition-group name="list-complete" tag="div">
        <div class="tree-list-item" v-for="(item, index) in data" :key="item[keys.id]">
          <p>{{ item[keys.label] }}</p>
          <div class="node-right-tools">
            <i class="el-icon-delete" @click="treeNodeRemove(index, item)" title="删除"></i>
            <i class="el-icon-edit" @click="treeEdit(item, index)" title="编辑"></i>
            <i class="el-icon-upload2" @click="treeNodeMove(index, 'up')" title="上移"></i>
            <i class="el-icon-download" @click="treeNodeMove(index, 'down')" title="下移"></i>
          </div>
        </div>
      </transition-group>
      <span class="empty-text" v-show="!data.length">无子节点</span>
    </div>
    <!-- 树节点新增/编辑弹框 -->
    <Dialog ref="treeDialog" width="400px" :title="treeDialogTitle" titbg center>
      <div class="tree-edit-inp">
        <p>名称</p>
        <p>
          <el-input v-model="treeCheckeNode[0][keys.label]" placeholder="请输入名称"></el-input>
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
    keys: {
      type: Object,
      default() {
        return {
          id: "id",
          label: "nodeName",
          sort: "nodeSort",
          type: null
        };
      }
    },
    data: {
      type: Array,
      default: () => []
    },
    checkedTreeNodes: {
      type: Array,
      default: () => []
    },
    location: {
      type: Array,
      default: () => []
    },
    stuDepartment: {
      type: Object,
      default() {
        return {
          dictLabel: "加载中..."
        };
      }
    },
    stuSubject: {
      type: Object,
      default() {
        return {
          dictLabel: "加载中..."
        };
      }
    }
  },
  components: {
    Dialog
  },
  data() {
    return {
      treeDialogTitle: "",
      treeCheckeNode: [{ [this.keys.label]: "" }],
      isEditDialog: false
    };
  },
  methods: {
    treeNodeRemove(index, item) {
      this.$confirm(`是否删除 [ ${item[this.keys.label]} ] ？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$axios
            .post(
              this.reqLink[
                this.keys.type ? "deleteDictInfo" : "deleteKonwledgeTree"
              ],
              {
                Loading: true,
                id: item[this.keys.id]
              }
            )
            .then(() => {
              this.Util.base.tips("删除成功！", "success");
              this.checkedTreeNodes.splice(index, 1);
            });
        })
        .catch(() => {});
    },
    treeEdit(item, index) {
      if (item === "add") {
        this.treeCheckeNode[0][this.keys.label] = "";
        this.treeDialogTitle = "新增";
        this.isEditDialog = false;
      } else {
        this.treeDialogTitle = "编辑";
        this.isEditDialog = true;
        this.treeCheckeNode = [JSON.parse(JSON.stringify(item)), index];
      }
      this.$refs.treeDialog.dialogVisible = true;
    },
    savedTreeChange() {
      let o = JSON.parse(JSON.stringify(this.checkedTreeNodes)),
        parentId = this.keys.type
          ? null
          : this.location.length
            ? this.location[this.location.length - 1].id
            : null,
        addItem = {};
      if (this.isEditDialog) {
        o[this.treeCheckeNode[1]] = this.treeCheckeNode[0];
      } else {
        addItem = {
          id: "",
          [this.keys.label]: this.treeCheckeNode[0][this.keys.label],
          [this.keys.type ? "dictType" : "parentId"]: this.keys.type
            ? this.keys.type
            : parentId,
          [this.keys.sort]:
            o
              .map(item => item[this.keys.sort])
              .sort()
              .pop() + 1
        };
        o.push(addItem);
      }
      this.nodeChange(o, parentId, () => {
        this.$refs.treeDialog.dialogVisible = false;
        if (this.isEditDialog) {
          this.$set(
            this.checkedTreeNodes,
            this.treeCheckeNode[1],
            this.treeCheckeNode[0]
          );
        } else {
          this.checkedTreeNodes.push(addItem);
        }
        this.Util.base.tips(
          this.isEditDialog ? "修改成功" : "添加成功",
          "success"
        );
        if (this.keys.type) {
          this.Util.base.getDictList(this.keys.type);
        } else {
          this.$emit("treeUpdata");
        }
      });
    },
    treeNodeMove(index, type) {
      if (index === 0 && type === "up") {
        this.Util.base.tips("已经在最上了，无法继续向上移动~");
        return;
      } else if (
        index === this.checkedTreeNodes.length - 1 &&
        type === "down"
      ) {
        this.Util.base.tips("已经在最下了，无法继续向下移动~");
        return;
      }
      let tNode = this.checkedTreeNodes[index],
        ind = type === "up" ? index - 1 : index + 1;
      tNode[this.keys.sort] = this.checkedTreeNodes[ind][this.keys.sort];
      if (type === "up") {
        this.checkedTreeNodes[ind][this.keys.sort] += 1;
      } else {
        this.checkedTreeNodes[ind][this.keys.sort] -= 1;
      }
      this.checkedTreeNodes.splice(index, 1);
      this.checkedTreeNodes.splice(ind, 0, tNode);
      this.nodeChange(
        this.checkedTreeNodes,
        this.keys.type ? null : this.location[this.location.length - 1].id,
        () => {
          this.Util.base.tips("位置已更新!", "success");
          this.keys.type || this.$emit("treeUpdata");
        }
      );
    },
    nodeChange(params, pid, succ) {
      if (!params.every(val => val.nodeName !== "")) {
        this.Util.base.tips("名称不能为空！");
        return;
      }
      params = params.map((item, index) => {
        let o = {
          [this.keys.id]: item[this.keys.id] || "",
          [this.keys.label]: item[this.keys.label],
          [this.keys.sort]: item[this.keys.sort] || 0
        };
        if (this.keys.type) {
          o = Object.assign({}, o, {
            dictType: this.keys.type,
            dictValue: item.dictValue
          });
        } else {
          o = Object.assign({}, o, { parentId: pid === "00001" ? 0 : pid });
        }
        return o;
      });
      let reqParams = {
        [this.keys.type ? "list" : "treeList"]: params,
        Loading: true
      };
      this.keys.type ||
        (reqParams = Object.assign({}, reqParams, {
          stuDepartment: this.stuDepartment.dictValue,
          stuSubject: this.stuSubject.dictValue
        }));
      this.$axios
        .post(
          this.reqLink[
            this.keys.type
              ? "createAndUpdateAndDeleteDictInfo"
              : "creatAndUpdateKonwledgeTree"
          ],
          reqParams
        )
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
    height: calc(100vh - 302px);
    overflow-y: auto;
    border: 1px solid #ebebeb {
      radius: 3px;
    }
    padding: 15px;
    .tree-list-item {
      background: #f8f8fb;
      margin-bottom: 15px;
      line-height: 38px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      transition: all 0.3s;
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

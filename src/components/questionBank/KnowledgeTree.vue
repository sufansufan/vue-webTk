<template>
  <div class="zss-left-box" :style="{width, borderRight: noBor === undefined ? '1px solid #ebebeb': 'none'}">
    <div class="knowledge-box">
      <div class="base-title">知识树选择</div>
      <div class="zss-select-box flex">
        <el-dropdown trigger="click" @command="treeToolCommand">
          <span class="el-dropdown-link">
            {{stu_department.dictLabel}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in $store.state.stu_department" :key="item.dictValue" :command="item">
              {{item.dictLabel}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" @command="treeToolCommand">
          <span class="el-dropdown-link">
            {{stu_subject.dictLabel}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in $store.state.stu_subject" :key="item.dictValue" :command="item">
              {{item.dictLabel}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="el-tree-search">
          <el-input v-show="searchBox" ref="searchBox" placeholder="请输入..." v-model="treeSearchVal">
          </el-input>
          <i @click="treeSearch" class="el-icon-search"></i>
        </div>
      </div>
      <div class="knowledge-tree" :style="{height}">
        <el-tree class="filter-tree" :props="treeProps" node-key="id" :default-expanded-keys="defaultExpandedKeys" v-loading="treeLoading" :check-on-click-node="checkbox === undefined" :data="treeData" :filter-node-method="filterTree" highlight-current ref="knowledgeTree" @node-click="treeClick" @check-change="treeCheck" :show-checkbox="checkbox !== undefined">
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkbox: {
      type: String,
      default: undefined
    },
    width: {
      type: String,
      default: "362px"
    },
    height: {
      type: String,
      default: "calc(100vh - 272px)"
    },
    noBor: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      treeProps: {
        label: "nodeName"
      },
      searchBox: false,
      treeSearchVal: "",
      defaultExpandedKeys: ["00001"],
      treeLoading: true,
      treeData: [],
      stu_department: {},
      stu_subject: {}
    };
  },
  watch: {
    treeSearchVal(val) {
      this.$refs.knowledgeTree.filter(val);
    }
  },
  created() {
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("stu_subject");
    this.$nextTick().then(() => {
      let departmentFirst = this.$store.state.stu_department[0],
        subjectFirst = this.$store.state.stu_subject[0];
      subjectFirst && (this.stu_subject = subjectFirst);
      departmentFirst && (this.stu_department = departmentFirst);
      this.$emit("updataCommand", subjectFirst);
      this.$emit("updataCommand", departmentFirst);
      this.getTree();
    });
  },
  methods: {
    getTree() {
      this.treeLoading = true;
      this.$axios
        .post(this.reqLink.getKonwledgeTreeList, {
          stuDepartment: this.stu_department.dictValue,
          stuSubject: this.stu_subject.dictValue,
          nodeName: "",
          nodeId: "",
          userId: ""
        })
        .then(({ data }) => {
          let { list } = data;
          this.treeLoading = false;
          this.treeData = [
            {
              children: list,
              id: "00001",
              isUnlock: null,
              needIntergral: "",
              nodeName: "根节点",
              nodeSort: 0,
              parentIds: 0,
              parentNames: ""
            }
          ];
        })
        .catch(() => {
          this.treeLoading = false;
        });
    },
    treeToolCommand(item) {
      this.$emit("updataCommand", item);
      this[item.dictType] = item;
      this.getTree();
    },
    treeSearch() {
      let inp = this.$refs.searchBox;
      if (!inp.value) this.searchBox = !this.searchBox;
      // inp.$el.children[0].focus();
    },
    treeClick(o) {
      let treeClickLocation = this.Util.fun.getJsonLevel(this.treeData, {
        targetKey: "id",
        targetId: o.id
      });
      this.$emit("treeClick", o.children, treeClickLocation);
    },
    treeCheck(o, checked) {
      if (o.id !== "00001") {
        this.$emit("treeCheck", o.id, checked);
      }
    },
    filterTree(value, data) {
      if (!value) return true;
      return data.nodeName.includes(value);
    }
  }
};
</script>

<style lang="scss">
.knowledge-tree {
  height: calc(100vh - 272px);
  overflow-y: auto;
}
.zss-left-box {
  border-right: 1px solid #ebebeb;
  .zss-select-box {
    margin: 20px 15px 10px 0;
    height: 34px;
    align-items: center;
    .el-tree-search {
      flex: 1;
      display: inline-flex;
      justify-content: flex-end;
      align-items: center;
      .el-icon-search {
        margin-left: 10px;
      }
    }
    .el-dropdown {
      margin-right: 20px;
      color: #a9a9ab;
    }
  }
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content
// ,.el-tree-node:first-child[aria-checked="true"] {
 {
  background: #f1f1f6;
  border-right: 3px solid $eleColor;
}
.el-tree-node__content .el-tree-node__label {
  color: #000;
  font-size: 16px;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  position: absolute;
  right: 10px;
  &:not(.is-leaf)::before {
    content: "\E604";
    font-size: 14px;
    color: #000;
    font-weight: bold;
  }
}
</style>

<template>
  <div class="label-management">
    <el-tabs v-model="activeName">
      <el-tab-pane label="知识树" class="flex" name="tree">
        <KnowledgeTree @updataCommand="updataCommand" @treeClick="treeClick"></KnowledgeTree>
        <div class="tree-right-box">
          <TreeNodes :data="checkedTreeNodes" :checkedTreeNodes="checkedTreeNodes" :location="treeClickLocation" :stuDepartment="stu_department" :stuSubject="stu_subject" @treeUpdata="treeUpdata">
            <el-breadcrumb separator-class="el-icon-arrow-right" slot="location">
              <el-breadcrumb-item v-for="item in treeClickLocation" :key="item.id">{{ item.nodeName }}</el-breadcrumb-item>
            </el-breadcrumb>
            <p slot="tips">子节点</p>
          </TreeNodes>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学部" name="xb">
        <TreeNodes :data="$store.state.stu_department" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'stu_department'}" :checkedTreeNodes="$store.state.stu_department">
          <p slot="tips">学部</p>
        </TreeNodes>
      </el-tab-pane>
      <el-tab-pane label="科目" name="km">
        <TreeNodes :data="$store.state.stu_subject" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'stu_subject'}" :checkedTreeNodes="$store.state.stu_subject">
          <p slot="tips">科目</p>
        </TreeNodes>
      </el-tab-pane>
      <el-tab-pane label="难度" name="nd">
        <TreeNodes :data="$store.state.difficult_level" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'difficult_level'}" :checkedTreeNodes="$store.state.difficult_level">
          <p slot="tips">难度</p>
        </TreeNodes>
      </el-tab-pane>
      <el-tab-pane label="适用年级" name="synj">
        <TreeNodes :data="$store.state.grade" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'grade'}" :checkedTreeNodes="$store.state.grade">
          <p slot="tips">适用年级</p>
        </TreeNodes>
      </el-tab-pane>
      <el-tab-pane label="来源" name="ly">
        <TreeNodes :data="$store.state.source" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'source'}" :checkedTreeNodes="$store.state.source">
          <p slot="tips">来源</p>
        </TreeNodes>
      </el-tab-pane>
      <el-tab-pane label="教材版本" name="jcbb">
        <TreeNodes :data="$store.state.textbook_version" :keys="{id: 'dictId', label:'dictLabel', sort: 'sort', type:'textbook_version'}" :checkedTreeNodes="$store.state.textbook_version">
          <p slot="tips">教材版本</p>
        </TreeNodes>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import KnowledgeTree from "../KnowledgeTree";
import TreeNodes from "./TreeNodeList";
export default {
  components: {
    KnowledgeTree,
    TreeNodes
  },
  data() {
    return {
      activeName: "tree",
      stu_department: {
        dictLabel: "加载中..."
      },
      stu_subject: {
        dictLabel: "加载中..."
      },
      checkedTreeNodes: [],
      treeClickLocation: []
    };
  },
  created() {
    // 获取常量
    this.Util.base.getDictList("difficult_level");
    this.Util.base.getDictList("grade");
    this.Util.base.getDictList("source");
    this.Util.base.getDictList("textbook_version");
    this.Util.base.getDictList("stu_department");
    this.Util.base.getDictList("stu_subject");
  },
  methods: {
    treeUpdata() {
      this.defaultExpandedKeys = [
        this.treeClickLocation.length
          ? this.treeClickLocation[this.treeClickLocation.length - 1].id
          : ""
      ];
    },
    updataCommand(item) {
      this[item.dictType] = item;
    },
    treeClick(children, location) {
      this.checkedTreeNodes = children;
      this.treeClickLocation = location;
    }
  }
};
</script>

<style lang="scss">
.label-management {
  background: #fff;
  padding: 20px 26px;
  .el-tabs__item {
    font-size: 16px;
  }
  .tree-right-box {
    width: calc(100% - 416px);
    padding: 0 16px 0 37px;
  }
}
.list-complete-item {
  transition: all 1s;
}
.list-complete-enter,
.list-complete-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

<template>
  <div class="details-history">
    <ul>
      <li v-for="item in historyList" :key="item.id">
        {{ item.createTime }} - {{item.operationContent}}
      </li>
      <li v-if="!historyList.length">暂无操作历史</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      historyList: []
    };
  },
  methods: {
    getHistory() {
      this.$axios
        .post(this.reqLink.getTopicOperationHistory, {
          id: this.$route.params.id
        })
        .then(({ data }) => {
          this.historyList = data.list.map(item => {
            item.createTime &&
              (item.createTime = this.Util.fun.formatDate(
                item.createTime,
                "yyyy-MM-dd hh:mm:ss"
              ));
            return item;
          });
        });
    }
  }
};
</script>

<style lang="scss">
.details-history {
  padding: 26px;
  border: 1px solid #e4e7ed {
    radius: 3px;
  }
  li {
    line-height: 26px;
  }
}
</style>

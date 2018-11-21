import Vue from "vue";
const Mock = require("mockjs");
const g = d => Mock.mock(d);

require.config({
  paths: {
    mock: "http://mockjs.com/dist/mock"
  }
});
Mock.mock(Vue.prototype.reqLink.getKonwledgeTreeList, () => {
  return g({
    "list|10-20": [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        "id|+1": 1,
        nodeName: "@csentence(3, 5)",
        "children|1-5": [
          {
            "id|+1": 99,
            nodeName: "@csentence(3, 5)",
            "children|10-50": [
              { "id|+1": 999, nodeName: "@csentence(3, 5)", children: [] }
            ]
          }
        ]
      }
    ]
  });
});

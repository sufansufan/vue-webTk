import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import user from "./module/user";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

const storage = () => {
  return {
    ls: {
      set(name, data) {
        localStorage.setItem(name, data);
      },
      get(name) {
        return JSON.parse(localStorage.getItem(name));
      }
    },
    ss: {
      set(name, data) {
        sessionStorage.setItem(name, data);
      },
      get(name) {
        return JSON.parse(sessionStorage.getItem(name));
      }
    }
  };
};
const win = storage();

export default new Vuex.Store({
  state: {
    nav_collapse: win.ls.get("nav_collapse") || false, // 左侧导航栏收缩标识
    stu_subject: [], // 科目
    stu_department: [], // 学部
    difficult_level: [], // 难度
    grade: [], // 适用年级
    source: [], // 来源
    textbook_version: [], // 教材版本
    subject_type: [], // 题型
    year: [], // 年份
    topic_sort_way: [], // 题目排序方式
    topic_status: [], // 题目状态
    topic_type: [], // 题目类型
    topic_option_layout: [], // 题目布局
    rich_text_type: [], // 富文本类型
    topic_content_full_status: [], // 题目内容以及解析内容完整度
    topic_flow_status: [], // 题目流程状态
    topic_propertis_status: [], // 题目属性状态
    file_type: [], // 文件类型
    comment_list_orderby: [] // 题目评论列表
  },
  mutations: {
    // 设置状态栏收缩
    NAV_COllAPSE_CHANGE(state) {
      state.nav_collapse = !state.nav_collapse;
      win.ls.set("nav_collapse", state.nav_collapse);
    },
    STU_SUBJECT(state, data) {
      state.stu_subject = data;
    },
    STU_DEPARTMENT(state, data) {
      state.stu_department = data;
    },
    DIFFICULT_LEVEL(state, data) {
      state.difficult_level = data;
    },
    GRADE(state, data) {
      state.grade = data;
    },
    SOURCE(state, data) {
      state.source = data;
    },
    TEXTBOOK_VERSION(state, data) {
      state.textbook_version = data;
    },
    SUBJECT_TYPE(state, data) {
      state.subject_type = data;
    },
    YEAR(state, data) {
      state.year = data;
    },
    TOPIC_SORT_WAY(state, data) {
      state.topic_sort_way = data;
    },
    TOPIC_STATUS(state, data) {
      state.topic_status = data;
    },
    TOPIC_TYPE(state, data) {
      state.topic_type = data;
    },
    TOPIC_OPTION_LAYOUT(state, data) {
      state.topic_option_layout = data;
    },
    RICH_TEXT_TYPE(state, data) {
      state.rich_text_type = data;
    },
    TOPIC_CONTENT_FULL_STATUS(state, data) {
      state.topic_content_full_status = data;
    },
    TOPIC_FLOW_STATUS(state, data) {
      state.topic_flow_status = data;
    },
    TOPIC_PROPERTIS_STATUS(state, data) {
      state.topic_propertis_status = data;
    },
    FILE_TYPE(state, data) {
      state.file_type = data;
    },
    COMMENT_LIST_ORDERBY(state, data) {
      state.comment_list_orderby = data;
    }
  },
  actions: {},
  modules: {
    user
  },
  plugins: [vuexLocal.plugin]
});

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import axios from "./config/axios.config";
import reqLink from "./config/request.address";
import Util from "./utils/util";

import "babel-polyfill";

import Element from "element-ui"; // 引入element

import mavonEditor from "./utils/editor.md";

Vue.prototype.$axios = axios;

import "./assets/css/normalize.css"; // 全局样式初始化
import "mavon-editor/dist/css/index.css"; // 编辑器样式

Vue.use(reqLink);
// require("./config/mock");
// Vue.prototype.$ELEMENT = { size: "small", zIndex: 3000 };
Vue.use(Element, { size: "small", zIndex: 3000 });
Vue.use(Util);
Vue.use(mavonEditor.mavonEditor);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

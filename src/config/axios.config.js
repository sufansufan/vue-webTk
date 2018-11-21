import Vue from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "@/utils/tools";
import { Loading, Message } from "element-ui"; // 引入element

Vue.prototype.$http =
  process.env.NODE_ENV === "development" ? "" : "http://192.168.1.123:8080";

axios.defaults.baseURL = Vue.prototype.$http + "/PxxTiKu/home/";
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf8";

const Loadings = (text, time = 30000) => {
  Vue.prototype.$ELEMENT = { size: "small", zIndex: 9999 };
  const loading = Loading.service({
    lock: true,
    text: text || "正在处理您的请求，请稍候...",
    spinner: "el-icon-loading",
    color: "#fff",
    background: "rgba(0, 0, 0, 0.7)"
  });

  setTimeout(() => {
    if (loading.visible) {
      Message.error("请求超时");
      loading.close();
    }
  }, time); // 超时设定 30s

  return loading;
};
let loadingInstance = null;
const globalParams = {
  source: "PC",
  token: "",
  vcode: "1",
  appKey: "7da1a0e6967f4050b7b1f8e4c8bab2ed"
};
// http request 请求拦截器
axios.interceptors.request.use(
  config => {
    globalParams.token = Cookies.get(TOKEN_KEY);
    if (config.data.Loading) {
      loadingInstance = Loadings();
      delete config.data.Loading;
    }
    if (config.headers["Content-Type"] === "multipart/form-data") {
      config.data.append("source", globalParams.source);
      config.data.append("token", globalParams.token);
      config.data.append("vcode", globalParams.vcode);
      config.data.append("appKey", globalParams.appKey);
    } else {
      config.data = Object.assign({}, config.data, globalParams);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response 服务器响应拦截器
axios.interceptors.response.use(
  response => {
    loadingInstance && loadingInstance.close();
    if (response.data.code === "10000") {
      return response.data;
    } else {
      Message({
        showClose: true,
        message: response.data.errmsg,
        type: "error"
      });
      return Promise.reject(response.data);
    }
  },
  error => {
    if (error.response) {
      Message({
        message: error.response.errmsg,
        type: "error",
        duration: 5000
      });
      switch (error.response.code) {
        case 401:
          // 这里写清除token的代码
          break;
        default:
      }
    }
    loadingInstance && loadingInstance.close();
    return Promise.reject(error);
  }
);

export default axios;

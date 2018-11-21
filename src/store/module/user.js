import { login, checkLogin, getUserInfo } from "@/api/user";
import { TOKEN_KEY, setToken, getToken } from "@/utils/tools";
import router from "@/router";
import { getParams } from "@/utils/tools";

export default {
  state: {
    userName: "", // 用户名
    userId: "", // 用户id
    headUrl: "", // 用户头像
    authStatus: "", // 用户认证状态
    isPxx: "", // 是否是平行线
    msgNumber: "", // 未读消息数
    userType: "", // 用户类型
    roleName: "", //用户级别
    access: "", // 权限
    [TOKEN_KEY]: getToken() // token
  },
  mutations: {
    SET_HEADURL(state, url) {
      state.headUrl = url;
    },
    SET_USERID(state, id) {
      state.userId = id;
    },
    SET_USERNAME(state, name) {
      state.userName = name;
    },
    SET_AUTHSTATUS(state, status) {
      state.authStatus = status;
    },
    SET_ISPXX(state, status) {
      state.isPxx = status;
    },
    SET_MSGNUMBER(state, num) {
      state.msgNumber = num;
    },
    SET_USERTYPE(state, type) {
      state.userType = type;
    },
    SET_ROLENAME(state, name) {
      state.roleName = name;
    },
    SET_ACCESS(state, access) {
      state.access = access;
    },
    SET_TOKEN(state, token) {
      state[TOKEN_KEY] = token;
      setToken(token);
    }
  },
  actions: {
    // 登录
    LOGIN_CHECK({ commit }, { loginNameOrUserPhone, password }) {
      return new Promise((resolve, reject) => {
        login({ loginNameOrUserPhone, password })
          .then(res => {
            const data = res.data;
            resolve(data.authSignature);
          })
          .catch(err => {
            reject(err);
          });
      }).then(data => {
        return new Promise((resolve, reject) => {
          checkLogin({ key: data })
            .then(res => {
              const data = res.data;
              commit("SET_TOKEN", data.token);
              let fullPath = getParams("redirect");
              fullPath = fullPath && fullPath.replace(/%2F/g, "/");
              router.push({
                path: fullPath || "home"
              });
              resolve(data.token);
            })
            .catch(err => {
              reject(err);
            });
        });
      });
    },
    // 退出登录
    LOGOUT({ commit }) {
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        // commit('setAccess', [])
        resolve();
      });
    },
    // 获取用户相关信息
    GET_USERINFO({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(res => {
            const { ...info } = res.data.userInfo;
            commit("SET_HEADURL", info.headUrl);
            commit("SET_USERID", info.id);
            commit("SET_USERNAME", info.userName);
            commit("SET_AUTHSTATUS", info.authStatus);
            commit("SET_ISPXX", info.isPxx);
            commit("SET_MSGNUMBER", info.msgNumber);
            commit("SET_ROLENAME", info.roleName);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};

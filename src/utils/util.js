import Vuex from "../store/store";
import katex from "katex";
import mavonEditor from "./editor.md";

const md = mavonEditor.mdIt;

export default {
  install(Vue) {
    const V = Vue.prototype;
    V.Util = {
      base: {
        /**
         * 根据条件返回数据库字典
         * @param type
         * @param count 是否统计数目
         * @example this.Util.base.getDictList(type);
         */
        getDictList(type, count = false) {
          V.$axios
            .post(
              V.reqLink[count ? "getTopicCountByType" : "getDictListByType"],
              {
                dictType: type
              }
            )
            .then(({ data }) => {
              const { list } = data;
              Vuex.commit(type.toLocaleUpperCase(), list);
            });
        },
        tips(str, type = "warning") {
          V.$notify({ title: "Tips：", message: str, type: type });
        }
      },
      fun: {
        /**
         * 根据条件返回所属数据层级
         * @param location
         * @param targetId
         * @example this.Util.fun.getJsonLevel(location, targetId);
         */
        getJsonLevel(location, { targetKey, targetId }) {
          const JsonLevel = [];
          (function getJsonLevel(data, targetId, parent) {
            Array.isArray(data) &&
              data.forEach((item, index) => {
                if (item[targetKey] !== targetId) {
                  item.children &&
                    getJsonLevel(item.children, targetId, [data, index]);
                } else {
                  parent &&
                    getJsonLevel(location, parent[0][parent[1]][targetKey]);
                  JsonLevel.push(item);
                }
              });
          })(location, targetId);
          return JsonLevel;
        },
        /**
         * 根据时间戳获取时间
         * @param date 时间戳
         * @param fmt 显示格式
         * @example this.Util.fun.formatDate(date, "yyyy-MM-dd hh:mm");
         */ formatDate(date, fmt) {
          date = new Date(date);
          if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
          }
          let o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds()
          };
          for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
              let str = o[k] + "";
              fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
              );
            }
          }
          function padLeftZero(str) {
            return ("00" + str).substr(str.length);
          }
          return fmt;
        },
        /**
         * 根据下标返回英文题目选项
         * @param ind 下标
         * @example this.Util.fun.getAnswerOpt(0);
         */
        getAnswerOpt(ind = 0) {
          const EN = ["A", "B", "C", "D", "E", "F", "G", "H"];
          return EN[ind];
        },
        /**
         * 根据公式解析成html
         * @param  传入需要解析的值
         * @example this.Util.fun.md2html(str);
         */
        md2html(str) {
          let htm = md.render(str);
          let queryStr = htm.match(/\${1,2}(.*?)\${1,2}/g) || [];
          queryStr.forEach(item => {
            htm = htm.replace(
              item,
              katex.renderToString(item.replace(/\$/g, ""))
            );
          });
          return htm;
        },
        /**
         * 根据code返回对应常量中文
         * @param 传入的code值
         * @param 传入的常量类型
         * @example this.Util.fun.code2txt('01401', 'status', dictName)
         */
        code2txt(code, type) {
          if (!code) return "";
          let data = Vuex.state[type].filter(item => item.dictValue === code);
          if (data && data.length) {
            return data[0].dictLabel;
          }
          return "";
        }
      }
    };
  }
};

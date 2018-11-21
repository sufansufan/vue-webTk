import Cookies from "js-cookie";
// cookie保存的天数
import config from "@/config";

export const TOKEN_KEY = "token";

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: config.cookieExpires || 1 });
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};

/**
 * @param {String} target
 * @description 从URL中解析参数
 */
export const getParams = name => {
  var result = window.location.href.match(
    new RegExp("[?&]" + name + "=([^&]+)", "i")
  );
  if (result == null || result.length < 1) {
    return "";
  }
  return result[1];
};

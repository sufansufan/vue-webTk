import Vue from "vue";
import axios from "@/config/axios.config";
import { JSEncrypt } from "jsencrypt";
import config from "@/config";

const encryptor = new JSEncrypt();
encryptor.setPublicKey(config.publicKey);

export const login = ({ loginNameOrUserPhone, password }) => {
  const data = { loginNameOrUserPhone, password, requestType: 1 };
  return axios.post(Vue.prototype.reqLink.userLogin, data);
};

export const checkLogin = ({ key }) => {
  const res = encryptor.decrypt(key).split(";");
  const data = { userId: res[0], noncestr: res[2] };
  return axios.post(Vue.prototype.reqLink.authenCheck, data);
};

export const getUserInfo = ({ token }) => {
  return axios.post(Vue.prototype.reqLink.getUserLoginInfo, { token });
};

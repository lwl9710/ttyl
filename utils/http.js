import Request from "../libs/request";
import { baseURL } from "../config/env";
import { getToken } from "./auth";


const http = new Request();

http.configs.baseURL = baseURL;

//添加请求拦截器
http.interceptor.request.use(configs=>{
	wx.showLoading({ title: "加载中..." });
	let token = getToken();
	if(token)configs.headers["Authorization"] = token;
	configs.headers["Content-Type"] = "Application/json;charset=UTF-8";
	return configs;
},()=>wx.hideLoading())

//添加响应拦截器
http.interceptor.response.use(response=>{
	wx.hideLoading();
	return response.data;
},()=>wx.hideLoading())

export default http;
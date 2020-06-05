/*
开发信息:
	作者: OneDay
	时间: 2019.11.26
	名称: wx简易请求器
	版本: 1.0.0
	介绍: 这是一个基于Promise的wx请求工具
功能介绍:
	实例属性:
		get/post(url: String[,data: Object,options: Object]): Promise
			url: 请求的链接/地址
			data: 发送的数据
			options: 可选配置项同原生request API提供的配置会覆盖默认配置
	原型属性:
		request: 配置同原生request API,提供Promise操作
		interceptor 全局拦截器
			request.interceptors	目前添加的request拦截器
			response.interceptors	目前添加的response拦截器
			request/response.use(fn: Function[,errFn: Function]) 安装拦截器
				fn:	拦截器处理函数接收configs对象
				errFn: 错误时的处理接收Error对象
		configs: 全局配置
			baseURL: 基础请求路径
			headers: 基础请求头
			timeout: 请求超时时间,默认30s
注: ************************    执行前请务必先生成实例    ************************
*/

export default (function(){
	const interceptor = {
		request: [],
		response: []
	}
	
	function Request(){
		this.get = function(url,data,options){
			return this.request(Object.assign({},options,{method: "get",url,data}));
		}
		this.post = function(url,data,options){
			return this.request(Object.assign({},options,{method: "post",url,data}));
		}
	}
	
	Request.prototype.interceptor = {
		request: {
			interceptors: interceptor.request,
			use: function(fn,errFn){
				if(errFn){
					interceptor.request.push({fn,errFn});
				}else{
					interceptor.request.push({fn});
				}	
			}
		},
		response: {
			interceptors: interceptor.response,
			use: function(fn,errFn){
				if(errFn){
					interceptor.response.push({fn,errFn});
				}else{
					interceptor.response.push({fn});
				}	
			}
		}
	}
	
	Request.prototype.configs = {
		baseURL: "",
		headers: {},
		timeout: 30 * 1000
	}
	
	Request.prototype.request = function(options){
		let configs = Object.assign({},this.configs,options);
		for(let i = 0;i < interceptor.request.length;i++){
			try{
				configs = interceptor.request[i].fn(configs);
			}catch(err){
				typeof interceptor.request[i].errFn === "function" && interceptor.request[i].errFn(err);
				return Promise.reject();
			}
		}
		return new Promise((resolve,reject)=>{
			wx.request({
				url: configs.baseURL + configs.url,
				method: options.method || "get",
				header: configs.headers,
				timeout: configs.timeout,
				data: options.data || {},
				dataType: configs.dataType || "json",
				success(res){
					for(let i = 0;i < interceptor.response.length;i++){
						try{
							res = interceptor.response[i].fn(res,options.meta || {});
						}catch(err){
							typeof interceptor.response[i].errFn === "function" && interceptor.response[i].errFn(err);
							return reject(err);
						}
					}
					resolve(res);
				},
				fail(err){
					try{
						interceptor.response.forEach(handle=>handle.errFn(err));
					}finally{
						reject(err);
					}
				}
			})
		})
	}
	
	return Request;
})()
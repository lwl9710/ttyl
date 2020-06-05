import http from "../../utils/http";

//测试接口
export function test() {
  return http.get("https://www.baidu.com");
}
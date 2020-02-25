// 先安装
import axios from 'axios'

export function request(config){
    // return new Promise((resolve, reject) => {
        // 1.创建axios的实例  不用全局的
        const instance = axios.create({
        baseURL:'http://123.207.32.32:8000/api/hy',
        timeout:5000
        })


        // 拦截器
        // 请求拦截
        instance.interceptors.request.use(config => {
          return config
        }, err => {
          console.log(err);
        })

        // 响应拦截
        instance.interceptors.response.use(res => {
          return res.data
        }, err => {
          console.log(err);
        })

        // 发送真正的网络请求  返回一个promise
        return instance(config)
}

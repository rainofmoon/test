import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
})
//请求拦截器 
instance.interceptors.request.use((config) => {
    //添加token
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}` 
    }
    return config
},
    (error) => (Promise.reject(error))
)
//相应拦截器 ，统一处理 code或错误
instance.interceptors.response.use((response) => {

    //可以直接获取需要的数据，或者进行其他处理
    return response.data
},
    (error) => {
        return Promise.reject(error)
    }
)
const http =  {
    get (url,params,...config) {
        return instance.get(url,{params},{...config})
    },
    post (url,data,...config) {
        return instance.post(url,{data},{...config})
    },
    put (url,param,...config) {
        return instance.put(url,{param},{...config})
    }
}
export default http;
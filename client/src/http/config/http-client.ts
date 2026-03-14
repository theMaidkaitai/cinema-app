
import axios, {type AxiosInstance} from 'axios'
import config from "./index.ts"


const $authHost: AxiosInstance = axios.create({
    baseURL: config.ApiUrl,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
    },
})

const $nonAuthHost: AxiosInstance = axios.create({
    baseURL: config.ApiUrl,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
    },
})


const authInterceptor = (config: any) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("tokenAccess")}`
    return config
}


$authHost.interceptors.request.use(authInterceptor)
$authHost.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/sign'
        }
        return Promise.reject(error)
    }
)

export {
    $nonAuthHost,
    $authHost
}



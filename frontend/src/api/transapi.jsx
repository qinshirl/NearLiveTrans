import axios from "axios";
import { transBaseURL } from "./http";

//axois packing
const URL = transBaseURL + "/translate";
const token = localStorage.getItem("token");
const transinstance = axios.create({
  baseURL: URL,
  headers: { token }
})

let requestCount = 0

// display loading
function showLoading() {
  if (requestCount === 0) {
    var dom = document.createElement('div')
    dom.setAttribute('id', 'loading')
    document.body.appendChild(dom)
    ReactDOM.render(<Spin tip="loading..." size="large" />, dom)
  }
  requestCount++
}

// hide loading
function hideLoading() {
  requestCount--
  if (requestCount === 0) {
    document.body.removeChild(document.getElementById('loading'))
  }
}

//add request interceptor
transinstance.interceptors.request.use(
  (config) => {
    //process request
    let authorization = localStorage.getItem("token")
    if (authorization) {
      config.headers["token"] = authorization;
      config.headers["Content-Type"] = "application/json";
    }
    return config
  },
  (error) => {
    //process request error
    return Promise.reject(error)
  }
)

//add response interceptor
transinstance.interceptors.response.use(
  (response) => {
    // process response
    return response
  },
  (error) => {
    //process response error
    return Promise.reject(error)
  }
)



export default transinstance
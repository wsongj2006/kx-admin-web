import axios from 'axios'
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      // console.log(token)
      config.headers.Authorization = token
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
            return error.response
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });
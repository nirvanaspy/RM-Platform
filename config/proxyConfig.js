module.exports = {
  proxy: {
    '/api': {
      target: 'http://192.168.31.134:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
    '/flowable-modeler': {
      target: 'http://192.168.31.134:8080/',  // 接口域名
      changeOrigin: true,  //是否跨域
      /*pathRewrite: (path) => {
        return "/flowable-modeler"
      }*/
    },
    '/flowable-admin': {
      target: 'http://localhost:8080/',  // 接口域名
      changeOrigin: true,  //是否跨域
      /*pathRewrite: (path) => {
        return "/flowable-modeler"
      }*/
    },
    '/flowable-idm': {
      target: 'http://localhost:8080/',  // 接口域名
      changeOrigin: true,  //是否跨域
      /*pathRewrite: (path) => {
        return "/flowable-modeler"
      }*/
    },
    '/flowable-task': {
      target: 'http://localhost:8080/',  // 接口域名
      changeOrigin: true,  //是否跨域
      /*pathRewrite: (path) => {
        return "/flowable-modeler"
      }*/
    },
  }
}

V.conf.init({
  "baseURL": "",
  "proxy": {
    "API": {
      "location": "/api",
      "proxy_pass": "http://192.168.13.3:9528",
      "supplement": {
        "changeOrigin": true,
        "ws": true
      }
    }
  },
  "secretKey": "jkhfahgiohHJSFHA131H2KSDFSHdsfsfF",
  "appId": 0
})

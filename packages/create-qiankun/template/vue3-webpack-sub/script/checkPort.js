const net = require('net');
const os = require('os');

const _defaultHosts = ['0.0.0.0', '127.0.0.0'];

function checkPort(port, host) {
  return new Promise((resolve, reject) => {
    const server = net
      .createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true); // 端口已被占用
        } else {
          reject(err); // 其他错误
        }
      })
      .once('listening', () => {
        server.close();
        resolve(false); // 端口可用
      })
      .listen(port, host);
  });
}

// 要检测的端口
const port = 7890;

Promise.all(_defaultHosts.map((host) => checkPort(port, host)))
  .then((isUsed) => {
    console.log(isUsed, 'isUsed');
  })
  .catch((err) => {
    console.log(err);
    if (err.code == 'EADDRINUSE' || err.code == 'EACCES') {
      return console.log(`端口 ${port} 已被占用`);
    } else {
      return console.log(`端口 ${port} 不可用`);
    }
  });

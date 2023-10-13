const commonPorts = [21, 22, 23, 25, 53, 80, 110, 443, 3306, 8080];

export function generatePort(created: number[] = []) {
  // 特定的常用端口和系统端口
  let port;
  do {
    // 随机生成一个端口号（1 - 65535）
    port = Math.floor(Math.random() * 65535) + 1;
  } while (commonPorts.includes(port) || port <= 1024 || created.includes(port));

  return port;
}

let http = require("http");
let fs = require("fs");
let url = require("url");
// process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程。
let port = process.argv[2];
// process.argv 启动Node.js进程时的命令行参数
// process.argv = [
//     'E:\\node\\node.exe', //启动Node.js进程的可执行文件所在的绝对路径
//     'C:\\Users\\Administrator\\Desktop\\static-server\\server.js', //当前执行的JavaScript文件路径
//     '8888' //其他命令行参数
//   ]

if (!port) {
  console.log("请指定端口号\n比如 nodemon server.js 3000");
  process.exit(1); //终止当前进程，并返回给定的code
}

let server = http.createServer((request, response) => {
  let parsedUrl = url.parse(request.url, true);
  let pathWithQuery = request.url;
  let queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }

  let path = parsedUrl.pathname;
  let query = parsedUrl.query;
  let method = request.method;

  console.log(`有请求发送过来啦！路径（带查询参数）为：${pathWithQuery}`);

  response.statusCode = 200;
  // 默认为index.html
  const filePath = path === "/" ? "/index.html" : path;
  // 获取到最后一个点的索引
  const index = filePath.lastIndexOf(".");
  // 获取到输入的后缀名
  const suffix = filePath.substring(index);
  const fileTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };
  response.setHeader(
    "Content-Type",
    `${fileTypes[suffix]||'text/html'};charset=utf-8`
  );
  let content;
  try {
    content = fs.readFileSync(`./public${filePath}`);
  } catch (error) {
    content = "文件不存在";
    response.statusCode = 404;
  }
  response.write(content);
  response.end();
});

server.listen(port);
console.log(`监听${port}成功\n请打开 http://localhost:${port}`);

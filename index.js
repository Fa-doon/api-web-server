const http = require("http");
const fs = require("fs");

const hostName = "localhost";
const port = 4040;

const htmlPage = fs.readFileSync("./index.html", "utf-8");

const server = http.createServer((req, res) => {
  let path = req.url;
  let method = req.method;

  switch (true) {
    case path === "/" ||
      (path.toLowerCase() === "/index.html" && method === "GET"):
      res.setHeader("content-type", "text/html");
      res.writeHeader(200);
      res.write(htmlPage.replace("{{%CONTENT%}}", "This is the home page"));
      res.end();
      break;

    case path.toLowerCase() === "/about.html" && method === "GET":
      res.setHeader("content-type", "text/html");
      res.writeHeader(200);
      res.write(htmlPage.replace("{{%CONTENT%}}", "This is the about page"));
      res.end();
      break;

    default:
      const file = fs.readFileSync("./404.html", "utf-8");
      res.end(file);
  }
});

server.listen(port, hostName, () => {
  console.log(`Listening on port http://${hostName}:${port}`);
});

const http = require("http");
const fs = require("fs");

const HOSTNAME = "localhost";
const PORT = 4040;

const responseHandler =
  (req, res) =>
  ({ code, data = null, error = null }) => {
    res.setHeader("content-type", "application/json");
    res.writeHeader(code);
    res.write(JSON.stringify({ data, error }));
    return res.end();
  };

let items = [];

const server = http.createServer((req, res) => {
  const response = responseHandler(req, res);

  // creating an item
  if (req.url === "/v1/items" && req.method === "POST") {
    let body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const bufferBody = Buffer.concat(body).toString();
      const bodyParsed = JSON.parse(bufferBody);
      items.push({
        ...bodyParsed,
        id: Math.floor(Math.random() * 200).toString(),
      });
      console.log(items);
    });
    res.end();
  }

  // Getting all items
  if (req.url === "/v1/items" && req.method === "GET") {
    return response({ data: items, code: 200 });
  }

  // Getting one item
  if (req.url.startsWith("/v1/items/") && req.method === "GET") {
    const id = req.url.split("/")[3];
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return response({ code: 404, error: "Item not found" });
    }

    const itemFound = items[itemIndex];
    response({ data: itemFound, code: 200 });
  }

  //Updating an item
  if (req.url.startsWith("/v1/items/") && req.method === "PATCH") {
    let body = [];
    const id = req.url.split("/")[3];
    let itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return response({ error: "Item not found", code: 404 });
    }

    let itemsAvailable = items[itemIndex];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const bufferBody = Buffer.concat(body).toString();
      const bodyParsed = JSON.parse(bufferBody);
      itemsAvailable = { ...itemsAvailable, ...bodyParsed };

      return response({ data: itemsAvailable, code: 200 });
    });
  }

  //Deleting an item
  if (req.url.startsWith("/v1/items/") && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    let itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return response({ error: "Item not found", code: 404 });
    }

    items.splice(itemIndex, 1);
    return response({ code: 200, data: items });
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running on http://${HOSTNAME}:${PORT}`);
});

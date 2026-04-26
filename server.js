const http = require("http");
const fs = require("fs");

const PORT = 3000;
const FILE_PATH = "./movies.json";
function readMovies(callback) {
  fs.readFile(FILE_PATH, "utf8", (err, data) => {
    if (err) {
      callback([]);
      return;
    }

    callback(JSON.parse(data));
  });
}
function writeMovies(movies, callback) {
  fs.writeFile(FILE_PATH, JSON.stringify(movies, null, 2), callback);
}
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}
const server = http.createServer((req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);
 if (req.method === "GET" && req.url === "/movies") {
    readMovies((movies) => {
      sendResponse(res, 200, movies);
    });
  }});
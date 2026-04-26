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
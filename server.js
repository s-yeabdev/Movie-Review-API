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
  }
 else if (req.method === "GET" && urlParts[1] === "movies" && id) {
    readMovies((movies) => {
      const movie = movies.find((m) => m.id === id);

      if (!movie) {
        return sendResponse(res, 404, {
          message: "Movie not found",
        });
      }

      sendResponse(res, 200, movie);
    });
  }
 else if (req.method === "POST" && req.url === "/movies") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newMovie = JSON.parse(body);
    if (!newMovie.title || !newMovie.rating) {
        return sendResponse(res, 400, {
          message: "Title and rating are required",
        });
      }
     readMovies((movies) => {
        newMovie.id = movies.length ? movies[movies.length - 1].id + 1 : 1;

        movies.push(newMovie);

        writeMovies(movies, (err) => {
          if (err) {
            return sendResponse(res, 500, {
              message: "Error saving movie",
            });
          }

          sendResponse(res, 201, {
            message: "Movie added successfully",
            movie: newMovie,
          });
        });
      });
    });
  }
 else if (req.method === "PUT" && urlParts[1] === "movies" && id) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const updatedData = JSON.parse(body);
     if (!updatedData.title || !updatedData.rating) {
        return sendResponse(res, 400, {
          message: "Title and rating are required",
        });
      }

      readMovies((movies) => {
        const movieIndex = movies.findIndex((m) => m.id === id);

        if (movieIndex === -1) {
          return sendResponse(res, 404, {
            message: "Movie not found",
          });
        }

        movies[movieIndex] = {
          ...movies[movieIndex],
          ...updatedData,
          id: id,
        };

        writeMovies(movies, (err) => {
          if (err) {
            return sendResponse(res, 500, {
              message: "Error updating movie",
            });
          }

          sendResponse(res, 200, {
            message: "Movie updated successfully",
            movie: movies[movieIndex],
          });
        });
      });
    });
  }
});
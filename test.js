var kompressor = require("./lib/kompressor.js"),
   fs = require('fs');

fs.readFile("./index.html", "utf8", function (err, file) {
   if (err) throw err;

   console.log(kompressor(file, true));
});

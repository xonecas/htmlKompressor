var kompressor = require("../lib/kompressor.js"),
   fs = require('fs');

fs.readFile("./test/index.html", "utf8", function (err, file) {
   if (err) throw err;

   console.log(kompressor(file, true));
});

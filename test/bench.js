var kompressor = require("../lib/kompressor.js"),
   fs = require('fs');

fs.readFile("./test/hugeFile.html", "utf8", function (err, file) {
   if (err) throw err;

   console.time('compression');
   kompressor(file, true);
   console.timeEnd('compression');
});

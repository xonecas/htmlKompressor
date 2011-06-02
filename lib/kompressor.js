// by @xonecas based on https://github.com/tylerhall/html-compressor.git
module.exports = function (source, noComments) {
   var lines = source.split("\n"),
      insidePre = false, kompressed = "";

   while (lines.length > 0) {
      var line = lines.shift();

      if (!insidePre) {
         var start = line.match(/<pre/);
         if (start) {
            line.replace(/^\s+/, ""); // only before the pre tag

            // does it end in the same line?
            var end = line.match(/<\/pre>/);
            if (end && end.index > start.index)
               line.replace(/\s+$/, "");
            else
               insidePre = true;
         }
         else { // no pre
            line.trim();
            line.replace(/\s\s+/, ""); // condense spaces
         }
      }
      else { // inside pre tag
         var end = line.match(/<\/pre>/);
         if (end) {
            line.replace(/\s+$/, "");
            insidePre = false;
         }
      }
      
      kompressed += (insidePre)? line+"\n": line;
   } // end while

   if (noComments) { // remove comments
      kompressed = kompressed.replace(/<\!--.*?--\>/g, "");
   }

   return kompressed;
}


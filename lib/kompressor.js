// by @xonecas based on https://github.com/tylerhall/html-compressor.git
module.exports = function (source, noComments) {
   if (noComments) { // remove comments
      source = source.replace(/<\!--.*?--\>/g, "");
   }

   var lines = source.split("\n"),
      insidePre = false, kompressed = "";

   while (lines.length > 0) {
      var line = lines.shift();

      if (!insidePre) {
         var start = line.match(/<pre/);
         if (start) {
            line = line.replace(/^\s+/, ""); // only before the pre tag

            // does it end in the same line?
            var end = line.match(/<\/pre>/);
            if (end && end.index > start.index)
               line = line.replace(/\s+$/, "");
            else {
               line += "\n";
               insidePre = true;
            }
         }
         else { // no pre 
            line = line.trim();
            if (line !== "") { //don't parse blank lines.
               line = line.replace(/\s+/g, " "); // condense spaces
               line += " "; // separate what would be 2 lines with a space
            }               // so that we don't mangle content.
         }
      }
      else { // inside pre tag
         var end = line.match(/<\/pre>/);
         if (end) {
            line = line.replace(/\s+$/, "");
            insidePre = false;
         }
         else
            line += "\n"; //put back new line
      }
      
      kompressed += line;
   } // end while

   return kompressed;
}


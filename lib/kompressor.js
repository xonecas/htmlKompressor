var excludedTags = 'pre|script|style'
  , regExcludeStart = new RegExp('<(' + excludedTags + ')')
  , regExcludeEnd = new RegExp('<\/(' + excludedTags + ')');

// by @xonecas based on https://github.com/tylerhall/html-compressor.git
module.exports = function (source, noComments) {
   if (noComments) { // remove comments
      source = source.replace(/<\!--(:!if).*?--\>/g, "");
   }

   var lines = source.split("\n"),
      insideExcluded = false, kompressed = "";

   while (lines.length > 0) {
      var line = lines.shift();

      if (!insideExcluded) {
         var start = line.match(regExcludeStart);
         if (start) {
            line = line.replace(/^\s+/, ""); // only before the pre tag

            // does it end in the same line?
            var end = line.match(regExcludeEnd);
            if (end && end.index > start.index)
               line = line.trim();
            else {
               line += "\n";
               insideExcluded = true;
            }
         }
         else { // not inside excluded tag
            line = line.trim();
            if (line !== "") { //don't parse blank lines.
               line = line.replace(/\s+/g, " "); // condense spaces
               line += " "; // separate what would be 2 lines with a space
            }               // so that we don't mangle content.
         }
      }
      else { // inside excluded tag
         if (regExcludeEnd.test(line)) {
            line = line.trim();
            insideExcluded = false;
         }
         else {
           line.trim();
           line += "\n"; //put back new line
         }
      }
      
      kompressed += line;
   } // end while

   return kompressed;
}


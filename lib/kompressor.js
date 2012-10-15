var excludedTags = 'pre|script|style'
  , regExcludeStart = new RegExp('<(' + excludedTags + ')')
  , regExcludeEnd = new RegExp('<\/(' + excludedTags + ')');

// by @xonecas based on https://github.com/tylerhall/html-compressor.git
module.exports = function (source, noComments) {
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

   if (noComments) { // remove comments, we are now in oneline mode, no need to handle multiline in regex 

      //remove conditionnal comments in script
      kompressed = kompressed.replace(/<script ([^>]*?)>\s*?<!--/ , "<script $1>");
      //replace conditional comments by special tokens
      kompressed = kompressed.replace(/<!--\s*\[if(.*?)endif\]\s*-->/gi, "<@@@--\[if$1endif\]--@@@>");
      //remove standard comments
      kompressed = kompressed.replace(/<!--[^@@@]*?-->/g, "");
      //get conditional comments back
      kompressed = kompressed.replace(/<@@@--\[if(.*?)endif\]--@@@>/gi, "<!--\[if$1endif\]-->");

   }

   return kompressed;
}


var excludedTags = "pre|script|style|textarea",
  regExcludeStart = new RegExp("<(" + excludedTags + ")", "i"),
  regExcludeEndWithoutNewStart = new RegExp("</(" + excludedTags + ")>(?!.*<(" + excludedTags + "))", "i");

function removeExtraBlank(line) {
  line = line.trim();
  if (line) {
    //don't parse blank lines.
    line += " "; // separate what would be 2 lines with a space
  } // so that we don't mangle content.
  return line;
}

// the minifier will remove blank when possible
// and will add a space at the end of a line to avoid mangling
module.exports = function(source, noComments) {
  var lines = source.split("\n"),
    insideExcluded = false,
    kompressed = "";
  while (lines.length) {
    var line = lines.shift();
    if (line) {
      if (!insideExcluded) {
        var start = line.match(regExcludeStart);
        if (start) {
          // does it end in the same line?
          var end = line.match(regExcludeEndWithoutNewStart);
          if (end && end.index > start.index) {
            line = removeExtraBlank(line);
          } else {
            line = line.replace(/^\s+/, ""); // only before the excluded tag
            line += "\n";
            insideExcluded = true;
          }
        } else {
          line = removeExtraBlank(line);
        }
      } else {
        // inside excluded tag
        if (regExcludeEndWithoutNewStart.test(line)) {
          line = line.replace(/^\s+/, ""); // only before the pre tag
          if (line) {
            //don't parse blank lines.
            line += " "; // separate what would be 2 lines with a space
          } // so that we don't mangle content.
          insideExcluded = false;
        } else {
          line += "\n"; //put back new line
        }
      }
      kompressed += line;
    }
  } // end while

  if (noComments) {
    // remove comments, we are now in oneline mode, no need to handle multiline in regex
    //remove comments in pre
    kompressed = kompressed.replace(/<pre([^>]*?)>\s*?<!--/gi, "<pre$1>@@@");
    //remove comments in script
    kompressed = kompressed.replace(/<script([^>]*?)>[\s*\/]?<!--/gi, "<script$1>@@@");
    kompressed = kompressed.replace(/<script([^>]*?)>\s*?\/\/<!--/gi, "<script$1>//@@@");
    //remove comments in style
    kompressed = kompressed.replace(/<style([^>]*?)>\s*?<!--/gi, "<style$1>@@@");
    //remove comments in textarea
    kompressed = kompressed.replace(/<textarea([^>]*?)>\s*?<!--/gi, "<textarea$1>@@@");
    //replace conditional comments by special tokens
    kompressed = kompressed.replace(/<!--\s*\[if(.*?)endif\]\s*-->/gi, "<@@@--[if$1endif]--@@@>");
    //remove standard comments
    kompressed = kompressed.replace(/<!--[^@@@]*?-->/g, "");
    //get conditional comments back
    kompressed = kompressed.replace(/<@@@--\[if(.*?)endif\]--@@@>/gi, "<!--[if$1endif]-->");
    //get comment in textarea back
    kompressed = kompressed.replace(/<textarea([^>]*?)>@@@/gi, "<textarea$1><!--");
    //get comment in style back
    kompressed = kompressed.replace(/<style([^>]*?)>@@@/gi, "<style$1><!--");
    //get comment in script back
    kompressed = kompressed.replace(/<script([^>]*?)>@@@/gi, "<script$1><!--");
    kompressed = kompressed.replace(/<script([^>]*?)>\/\/@@@/gi, "<script$1>//<!--");
    //get comment in pre back
    kompressed = kompressed.replace(/<pre([^>]*?)>@@@/gi, "<pre$1><!--");
  }
  return kompressed;
};

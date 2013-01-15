var
  Kompressor = require('../lib/kompressor'),
  vows = require('vows'),
  assert = require('assert')

vows.describe('We test minifying HTML').addBatch({
  'Given some html': {
    'topic': '<html><head></head><body>hello\r\nworld\r\n\t\ttabs</body></html>',

    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      }
    }
  },
  'Given some html with comments, ': {
    'topic': '<!--[if gte IE 9]><!-->\r\n<html lang="fr">\r\n<!--<![endif]-->\n<html><head><!-- [if IE ]><style>fuck {color:red}</style><![endif]--></head><body><!-- comment 1 -->hello world<!-- another comment with [ ! --><!-- <form name="NavForm" method="get" action="/casinoexpress_web/z_catalog/rechercheNormaleResultat/(layout=7.01-8_108_7_109_110_0_114_111_112_0_133_113_127_0_88_124_0_0_117_118&uiarea=0)/.do"> --></body></html>',

    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html, true), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML ': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      },
      'and there\'s no more comment except conditionnal comments': function(obj) {
        assert.equal(obj.transformedBody,'<!--[if gte IE 9]><!--> <html lang="fr"> <!--<![endif]--> <html><head><!--[if IE ]><style>fuck {color:red}</style><![endif]--></head><body>hello world</body></html>');
      }
    }
  },
  'Given some html with scripts': {
    'topic': '<html><head><script>var toto=1;\r\ntoto=3;\r\n</script></head><body>hello\r\nworld\r\n\t\ttabs</body></html>',

    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      },
      'and script tags should remain untouched': function(obj) {
        assert.isTrue(/<script>var toto=1;\r\ntoto=3;\r\n<\/script>/.test(obj.transformedBody));
      }
    }
  },
  'Given some html with comment in scripts': {
    'topic': '<html><head><script><!--//[[CDATA\r\nvar toto=1;\r\ntoto=3;\r\n]]//--></script></head><body>hello\r\nworld\r\n\t\ttabs</body></html>',

    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html, true), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      },
      ' and HTML comments in script tags should be removed': function(obj) {
        assert.isTrue(/<script><!--\/\/\[\[CDATA\r\nvar toto=1;\r\ntoto=3;\r\n\]\]\/\/--><\/script>/.test(obj.transformedBody));
      },

    }
  },
  'Given some html with scripts followed by script': {
    'topic':'<html><head><script>var toto=1;toto=3;</script><script>\r\nvar tata=1;\r\ndocument.write(tata);\r\n</script></head><body>hello\r\nworld\r\n\t\ttabs</body></html>',
    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html, true), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      },
      ' and scripts should remain untouched': function(obj) {
        assert.isTrue(/<script>var toto=1;toto=3;<\/script><script>\r\nvar tata=1;\r\ndocument\.write\(tata\);\r\n<\/script>/.test(obj.transformedBody));
      },

    }
  },
  'Given some html with style': {
    'topic': '<html><head><style>.toto {color:red}\r\n.toto a {text-decoration:none}\r\n</style></head><body>hello\r\nworld\r\n\t\ttabs</body></html>',

    'when minifying': {
      'topic': function(html) {
        var inputLength = html.length;
        return {'transformedBody':Kompressor(html), 'inputLength':inputLength};
      },
      'the minified HTML is smaller than original HTML': function(obj) {
        assert.isTrue(obj.transformedBody.length < obj.inputLength);
      },
      'and script tags should remain untouched': function(obj) {
        assert.isTrue(/<style>.toto {color:red}\r\n.toto a {text-decoration:none}\r\n<\/style>/.test(obj.transformedBody));
      }
    }
  },
  'Given some html with a textarea': {
    'topic': '<textarea>Super text\r\nSuper</textarea>',

    'when minifying': {
      'topic': function(html) {
        return Kompressor(html);
      },
      'the content of the textarea tags should remain untouched': function(obj) {
        assert.isTrue(/<textarea>Super text\r\nSuper<\/textarea>/.test(obj));
      }
    }
  },
  'Given some html with urls with spaces': {
    'topic': Kompressor("\t <tag  src=\"/  test.jpg\"  href='/  test2.html' other = \"  other  attribute  \"  />  \r\n<tag title=\"  Title  \" /> \t        "),
    'the content of attributes should remain untouched, only spaces at the beginning and the end of line should be condensed': function(obj) {
      assert.equal(obj,
                   '<tag  src="/  test.jpg"  href=\'/  test2.html\' other = "  other  attribute  "  /> <tag title="  Title  " /> ');
    }
  }
}).export(module); // Run it

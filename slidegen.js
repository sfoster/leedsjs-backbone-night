var md = require("markdown").markdown, 
    fs = require("fs");
    
// load markdown file
// parse and generate html version
// print output

function createSlides(cb){
  var output = "";
  var stack = [];
  var slides = [];

  function renderSlides(tree){
    tree.shift();
    var pair, 
        slides = [],
        depth = 0;
    while((pair = tree.shift())){
      var tag = pair.shift();
          content = null;
      
      while((content = pair.shift())){
        if(typeof content =="string") {
          slides.push('<div class="slide step '+tag+'"  data-x="0" data-y="-1500">'+content+'</div>');
        } else {
          tree.unshift( content );
        }
      }
    }
    return slides.join("\n");
  }

  fs.readFile(__dirname + '/slides.tmpl', function(err, tmpl){
    tmpl = tmpl.toString();

    fs.readFile(__dirname + '/slides.md', function(err, content){
      if(err) {
        throw "error reading markdown file: " + err.message;
      } else {
        var tree = md.toHTMLTree(content.toString());
        var context = {
          title: 'Backbone.js',
          slides: renderSlides(tree)
        };
        console.log(JSON.stringify(context.slides));
        
        // basic templating replaceing ${token} with its context value
        var html = tmpl.replace(/\$\{([^\{}]+)\}/g, function(m, name){
          return context[name];
        });
        
        cb( html );
      }
    });
  });
}
exports.create = createSlides;

if(require.main === module){
  createSlides(function(html){
    fs.writeFile(__dirname + '/slides.html', html, 'utf8',  function(err){
      if(err) throw err;
      console.log("File created at " + __dirname + '/slides.html');
    });
  });
}

// 
// 
// 
// var md_text = "**bold** *italic* [link](http://www.neti.ee) `code block`",
//     md_parser = require("node-markdown").Markdown;
// 
// // simple
// console.log(md_parser(md_text));
// 
// // limit HTML tags and attributes
// console.log(md_parser(md_text, true, 'h1|p|span'));
// 
// // limit HTML tags and keep attributes for allowed tags
// var allowedTags = 'a|img';
//     allowedAttributes = {
//         'a':'href|style',
//         'img': 'src',
//         '*': 'title'
//     }
// console.log(md_parser(md_text, true, allowedTags, allowedAttributes));
// 

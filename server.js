var fs = require("fs"), 
    express = require("express"), 
    port = 3000, 
    apiDir = __dirname + '/api', 
    app = express.createServer();

app.use(app.router);
app.use(express.static(__dirname));

app.get('/slides', function(req, res){
  res.setHeader('Content-Type', 'text/html');
  
  var slidegen = require('./slidegen');
  slidegen.create(function(html){
    console.log("slidegen made me: ", html);
    res.end(html);
  });
});

app.get('/api/:method', function(req, res){
  var file = apiDir +'/' + req.params.method + '.json';

  res.setHeader('Content-Type', 'application/json');
  
  fs.readFile(file, function(err, content){
    if(err) {
      res.end(JSON.stringify({
        'success': false,
        'message': 'Method not found',
        'attempt': file
      }));
    } else {
      res.end(content);
    }
  });
});

app.get('/', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    'success': true, 
    'message': 'A simple node.js service. Hit /api for a list of api methods, and api/:methodname for a specific method'
  }));
});

app.get('/api', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  
  fs.readdir(apiDir, function(err, files){
    if(err) {
      res.end(JSON.stringify({
        'success': false,
        'message': 'Bad path',
        'attempt': apiDir
      }));
    } else {
      var list = [], 
          file = null;
      var getDetails = function(name, contents){
        console.log('getDetails: ' + contents);
        var data = JSON.parse(contents);
        return {
          url: '/api/' + name.replace(/\.json$/, ''),
          name: data.name, 
          description: data.description
        };
      };
      var count = files.length;
      
      files.forEach(function(file){
        count--;
        fs.readFile(apiDir+'/'+file, function(err, contents){
          if(err) { throw err; }
          console.log("file: " + apiDir+'/'+file);

          list.push( getDetails( file, ''+contents ) );

          if(!count){
            res.end(JSON.stringify(list));
          }
        });
      }); 
    }
  });
});


app.listen(port);
// connect(
//   connect.logger(), 
//   main
// ).listen(port);

console.log("Server listening on localhost:"+port);

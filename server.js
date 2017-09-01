const path = require('path');
var express = require('express');
var app = express();
var fs = require('fs');
var middleware = require('swagger-express-middleware');

var specfile = path.join(__dirname, 'swagger.yaml');

process.on('SIGINT', function() { console.log('Caught Ctrl+C...'); process.exit(); }); // Ctrl+C
process.on('SIGTERM', function() { console.log('Caught kill...'); process.exit(); }); // docker stop

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.use('/editor/config/defaults.json', express.static(path.join(__dirname, 'config/defaults.json')));

app.use('/editor/spec', function(req, res){

    if (!fs.existsSync(specfile)) {
        fs.writeFileSync(specfile, '');
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
        // Serve the file
        res.sendFile(specfile);
    } else if (req.method === 'PUT') {
        // Write file to disk
        var stream = fs.createWriteStream(specfile);
        stream.on('finish', function () {
            res.end('ok');
        });
        req.pipe(stream);			
    } else {
        // Method not allowed
        res.writeHead(405, {
            'Allow': 'GET, HEAD, PUT',
            'Content-Length': '0'
        });
        res.end();
    }


});

app.use('/editor', express.static(path.join(__dirname, 'node_modules/swagger-editor')));

middleware(specfile, app, function(err, middleware) {
    // Add all the Swagger Express Middleware, or just the ones you need.
    // NOTE: Some of these accept optional options (omitted here for brevity)
    app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
        middleware.mock()
    );

    var server = app.listen(process.env.PORT || 8080, function () {
        var host = server.address().address
        var port = server.address().port
        
        console.log("Example app listening at http://%s:%s", host, port)
     });
});



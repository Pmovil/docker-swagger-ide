'use strict';

var path = require('path');
var express = require('express');
var app = express();
var fs = require('fs-extra');
var middleware = require('swagger-express-middleware');
var SwaggerParser = require('swagger-parser');


var specfile = path.join(__dirname, 'specs/swagger.yaml');
var mtime;

process.on('SIGINT', function() {
    console.log('Caught Ctrl+C...');
    process.exit();
}); // Ctrl+C
process.on('SIGTERM', function() {
    console.log('Caught kill...');
    process.exit();
}); // docker stop

if (!fs.existsSync(specfile)) {
    fs.copySync(__dirname + '/swagger.yaml.min', specfile);
}

mtime = fs.statSync(specfile).mtime.getTime();


//Using fixed default.json
app.use('/editor/config/defaults.json', express.static(path.join(__dirname, 'config/defaults.json')));

//Setting backend
app.use('/editor/spec', function(req, res){


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

app.use(express.static(path.join(__dirname, 'specs/')));

middleware(specfile, app, function(err, middleware, api) {
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

    fs.watch(specfile, {}, function(eventType){
        fs.stat(specfile, function(err, stats){
            console.log(stats.mtime+'/'+mtime+"\n");
            if(stats.mtime.getTime() != mtime){
                mtime = stats.mtime.getTime();
                console.log(`event type is: ${eventType}`);
                SwaggerParser.validate(specfile)
                .then(function (api) {
                    middleware.init(specfile, function(err){
                        if (err) {
                            console.log(err);
                        }
                    })
                })
                .catch(function(err) {
                    console.error('Onoes! The API is invalid. ' + err.message);
                });
            }         
        });
    });
    

    var server = app.listen(process.env.PORT || 8080, function () {
        var host = server.address().address;
        var port = server.address().port;
        
        console.log("Example app listening at http://%s:%s", host, port);
     });
});



module.exports = app;

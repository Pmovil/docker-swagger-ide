'use strict';

var SwaggerParser = require('swagger-parser');
var resolveAllOf = require('json-schema-resolve-allof');


SwaggerParser.dereference("./specs/swagger.yaml")
    .then(function (api) {

        delete api.definitions;

        var result;
        var ops = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

        result = resolveAllOf(api);
        result = resolveAllOf(result);

        console.log(JSON.stringify(result, null, '\t'));
    });

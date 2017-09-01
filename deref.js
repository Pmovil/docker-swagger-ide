var SwaggerParser = require('swagger-parser');
var resolveAllOf = require('json-schema-resolve-allof');


SwaggerParser.dereference("./swagger.yaml")
    .then(function (api) {

    delete api.definitions;

    var result;
    var ops = ['get','put', 'post', 'delete', 'options', 'head', 'patch'];

    result = resolveAllOf(api);
    result = resolveAllOf(result);

                    for(var path in result.paths){
                        for(var op in result.paths[path]){
				if(ops.indexOf(op) > -1)
                                   result.paths[path][op]['tags'] = ['veek-app'];
                        }
                    }

    console.log(JSON.stringify(result, null, '\t'));
});

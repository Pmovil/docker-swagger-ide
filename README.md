# Swagger editor + mock in a Docker.

[Docker](https://www.docker.com) container with a [swagger-editor](https://github.com/swagger-api/swagger-editor) and [swagger-express-middleware](https://github.com/BigstickCarpet/swagger-express-middleware) mashup.

## Installation / Usage

1. Install the pmovil/docker-swagger-ide container:

    ``` sh
	$ docker pull pmovil/docker-swagger-ide
	```

2. Run docker-swagger-ide with a shared specs folder and port:

    ``` sh
	$ docker run -v $(pwd):/app/specs -p 8080:8080 --rm pmovil/docker-swagger-ide
    ```

3. Go to  http://127.0.0.1:8080/editor

4. A minimal swagger.yaml file will be avaiable at your execution folder, and mocked at http://127.0.0.1:8080/users

5. Edit your swagger definition. Mocking will be avaiable at http://127.0.0.1:8080/, just follow [mock middleware docs](https://github.com/BigstickCarpet/swagger-express-middleware/blob/master/docs/middleware/mock.md) to customize it.
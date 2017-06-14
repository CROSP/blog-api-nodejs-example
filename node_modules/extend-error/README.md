# extend-error

Ever tried to create custom error types in Node.js and wished it should be this simple?

```
var MyError = Error.extend('MyError');
```

```
throw MyError('wow')
```

### installation

```
npm install extend-error
```

and in your app.js, just ```require('extend-error')```. It will provide you an extend() method for the Error type.



### syntax
- extend() takes two arguments : subTypeName & errorCode [optional]
- it returns the newly created error type


### more examples for a web app


something useful

```
var AppError = Error.extend('AppError', 500);
var ClientError = Error.extend('ClientError', 400);
```

extend ClientError further for specific http types

```
var HttpNotFound = ClientError.extend('HttpNotFoundError', 404);
var HttpUnauthorized = ClientError.extend('HttpUnauthorized', 401);
```

### throwing errors

```
throw new AppError('unable to connect db due to error: ' + err);

throw new ClientError({'message':'required field missing', field: 'email'})

throw new HttpNotFound('no post found with id: ' + id);

throw new HttpNotFound({'message': 'no such post', 'id': id});
```

### don't worry when you forget 'new'

```
throw ClientError('bad request');
```

### instanceof

throw an error in controller

```
var err = HttpNotFound('user profile not found');

throw err; 
(or)
callback(err)
```

handle it easily in global error handler (in case of express.js error middleware)

```
if (err instanceof ClientError) {
	//send out the actual message
	res.send(err.code, err.message);
} else {
	//send out a generic message
	res.send(500, 'oops! something went wrong');
	log.error(err);
}

```


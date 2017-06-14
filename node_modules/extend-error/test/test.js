/**
 * mocha test cases
 */

var errors = require('../http-errors');

var assert = require('assert');


describe('instantiation', function() {
	it('should work with new operator', function() {
		var err = new errors.AppError('problem');
		assert.ok(err instanceof errors.AppError);
	});
	
	it('should work without new operator', function() {
		var err = errors.AppError('problem');
		assert.ok(err instanceof errors.AppError);
	});
});


describe('inheritance', function() {
	it('should maintain prototype hierarchy with one level', function() {
		var err = new errors.ClientError('email required');
		
		assert.ok(err instanceof errors.ClientError, 'ClientError is not an instance of ClientError');
		assert.ok(err instanceof Error, 'ClientError is not an instance of Error');
	});
	
	it('should maintain prototype hierarchy with two levels', function() {
		var notfound = new errors.HttpNotFound('item not found');
		
		assert.ok(notfound instanceof errors.HttpNotFound, 'HttpNotFound is not an instance of HttpNotFound');
		assert.ok(notfound instanceof errors.ClientError, 'HttpNotFound is not an instance of ClientError');
		assert.ok(notfound instanceof Error, 'HttpNotFound is not an instance of Error');
	});
});


describe('error details', function() {
	it('should have message', function() {
		var err;
		
		err = new errors.ClientError('name required');
		assert.equal(err.message, 'name required');
		
		err = new errors.ClientError();
		assert.equal(err.message, '');
	});
	
	it('should have code', function() {
		var err = new errors.ClientError();
		assert.equal(err.code, 400);
	});
	
});




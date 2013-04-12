
/**
 * Module dependencies.
 */

var cookie = require('..');

describe('.sign(val, secret)', function(){
  it('should sign the cookie', function(){
    var val = cookie.sign('hello', 'tobiiscool');
    val.should.equal('hello.kVofCuivbz8r8NiCfWJV5JsZQBX6WGHgt8ihyKktT7OdEObssUD5JItXNDH9PIaD+rTEQTK9V6+prF9qR0aDSg');

    var val = cookie.sign('hello', 'luna');
    val.should.not.equal('hello.kVofCuivbz8r8NiCfWJV5JsZQBX6WGHgt8ihyKktT7OdEObssUD5JItXNDH9PIaD+rTEQTK9V6+prF9qR0aDSg');
  })
})

describe('.unsign(val, secret)', function(){
  it('should unsign the cookie', function(){
    var val = cookie.sign('hello', 'tobiiscool');
    cookie.unsign(val, 'tobiiscool').should.equal('hello');
    cookie.unsign(val, 'luna').should.be.false;
  })
})

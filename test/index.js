/**
 * Module dependencies.
 */

var cookie = require('..');

describe('.sign(val, secret)', function(){
  it('should sign the cookie', function(){
    var val = cookie.sign('hello', 'tobiiscool');
    val.should.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');

    var val = cookie.sign('hello', 'luna');
    val.should.not.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');
  })
  it('should accept appropriately non-string secrets', function(){
    var key = Buffer.from("A0ABBC0C", 'hex'),
        val = cookie.sign('hello', key);
    val.should.equal('hello.hIvljrKw5oOZtHHSq5u+MlL27cgnPKX77y7F+x5r1to');
    (function () {
      cookie.sign('unsupported', new Date());
    }).should.throw();
  })
})

describe('.unsign(val, secret)', function(){
  it('should unsign the cookie', function(){
    var val = cookie.sign('hello', 'tobiiscool');
    cookie.unsign(val, 'tobiiscool').should.equal('hello');
    cookie.unsign(val, 'luna').should.be.false();
  })
  it('should reject malformed cookies', function(){
    var pwd = 'actual sekrit password';
    cookie.unsign('fake unsigned data', pwd).should.be.false();

    var val = cookie.sign('real data', pwd);
    cookie.unsign('garbage'+val, pwd).should.be.false();
    cookie.unsign('garbage.'+val, pwd).should.be.false();
    cookie.unsign(val+'.garbage', pwd).should.be.false();
    cookie.unsign(val+'garbage', pwd).should.be.false();
  })
  it('should accept non-string secrets', function(){
    var key = Uint8Array.from([0xA0, 0xAB, 0xBC, 0x0C]),
        val = cookie.unsign('hello.hIvljrKw5oOZtHHSq5u+MlL27cgnPKX77y7F+x5r1to', key);
    val.should.equal('hello');
  })
})

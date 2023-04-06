/**
 * Module dependencies.
 */

var cookie = require('..');
var bufferFrom = require('buffer-from')

describe('.sign(val, secret)', function(){
  it('should reject non-string and non-buffer secrets', function () {
    should(function () { cookie.sign('hello', undefined) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.sign('hello', null) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.sign('hello', 123) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.sign('hello', {}) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.sign('hello', []) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.sign('hello', new Uint8Array([0xA0, 0xAB, 0xBC, 0x0C])) }).throw('Secret must be of type string or Buffer.')
  })

  it('should reject non-string values', function () {
    should(function () { cookie.sign(undefined, 'keyboard cat') }).throw('Cookie value must be provided as a string.')
    should(function () { cookie.sign(null, 'keyboard cat') }).throw('Cookie value must be provided as a string.')
    should(function () { cookie.sign(123, 'keyboard cat') }).throw('Cookie value must be provided as a string.')
    should(function () { cookie.sign({}, 'keyboard cat') }).throw('Cookie value must be provided as a string.')
    should(function () { cookie.sign([], 'keyboard cat') }).throw('Cookie value must be provided as a string.')
    should(function () { cookie.sign(bufferFrom('hello'), 'keyboard cat') }).throw('Cookie value must be provided as a string.')
  })

  it('should sign the cookie', function(){
    cookie.sign('hello', 'tobiiscool').should.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');

    cookie.sign('foobar', 'keyboard cat').should.equal('foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE');

    cookie.sign('hello', 'luna').should.not.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');
  })

  it('should accept Buffer secrets', function () {
    var key = bufferFrom('keyboard cat')
    cookie.sign('foobar', key).should.equal('foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE');

    // 'nyan cat' in base64
    var key = bufferFrom('bnlhbiBjYXQ=', 'base64')
    cookie.sign('foobar', key).should.equal('foobar.JTCAgiMWsnuZpN3mrYnEUjXlGxmDi4POCBnWbRxse88');
  })
})

describe('.unsign(val, secret)', function(){
  it('should reject non-string and non-buffer secrets', function () {
    should(function () { cookie.unsign('hello', undefined) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.unsign('hello', null) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.unsign('hello', 123) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.unsign('hello', {}) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.unsign('hello', []) }).throw('Secret must be of type string or Buffer.')
    should(function () { cookie.unsign('hello', new Uint8Array([0xA0, 0xAB, 0xBC, 0x0C])) }).throw('Secret must be of type string or Buffer.')
  })

  it('should reject non-string values', function () {
    should(function () { cookie.unsign(undefined, 'keyboard cat') }).throw('Signed cookie string must be provided.')
    should(function () { cookie.unsign(null, 'keyboard cat') }).throw('Signed cookie string must be provided.')
    should(function () { cookie.unsign(123, 'keyboard cat') }).throw('Signed cookie string must be provided.')
    should(function () { cookie.unsign({}, 'keyboard cat') }).throw('Signed cookie string must be provided.')
    should(function () { cookie.unsign([], 'keyboard cat') }).throw('Signed cookie string must be provided.')
    should(function () { cookie.unsign(bufferFrom('hello'), 'keyboard cat') }).throw('Signed cookie string must be provided.')
  })

  it('should unsign the cookie', function(){
    var val = cookie.sign('hello', 'tobiiscool');
    cookie.unsign(val, 'tobiiscool').should.equal('hello');
    cookie.unsign(val, 'luna').should.be.false;

    cookie.unsign('foobar.N5r0C3M8W+IPpzyAJaIddMWbTGfDSO+bfKlZErJ+MeE', 'keyboard cat').should.equal('foobar')
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
})

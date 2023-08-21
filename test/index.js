/**
 * Module dependencies.
 */

const cookie = require('..');

describe('.sign(val, secret)', function(){
  it('should sign the cookie', async function(){
    let val = await cookie.sign('hello', 'tobiiscool');
    val.should.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');

    val = await cookie.sign('hello', 'luna');
    val.should.not.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');
  })
})

describe('.unsign(val, secret)', function(){
  it('should unsign the cookie', async function(){
    const val = await cookie.sign('hello', 'tobiiscool');
    (await cookie.unsign(val, 'tobiiscool')).should.equal('hello');
    (await cookie.unsign(val, 'luna')).should.be.false();
  })
  it('should reject malformed cookies', async function(){
    const pwd = 'actual sekrit password';
    (await cookie.unsign('fake unsigned data', pwd)).should.be.false();

    const val = await cookie.sign('real data', pwd);
    (await cookie.unsign('garbage'+val, pwd)).should.be.false();
    (await cookie.unsign('garbage.'+val, pwd)).should.be.false();
    (await cookie.unsign(val+'.garbage', pwd)).should.be.false();
    (await cookie.unsign(val+'garbage', pwd)).should.be.false();
  })
})

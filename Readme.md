
# cookie-signature

  Sign and unsign cookies.

## Example

```js
const cookie = require('cookie-signature');

const val = await cookie.sign('hello', 'tobiiscool');
val.should.equal('hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI');

const val = await cookie.sign('hello', 'tobiiscool');
(await cookie.unsign(val, 'tobiiscool')).should.equal('hello');
(await cookie.unsign(val, 'luna')).should.be.false;
```

## License

MIT.

See LICENSE file for details.

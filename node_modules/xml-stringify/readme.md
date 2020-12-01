# xml-stringify [![Build Status](https://travis-ci.org/1000ch/xml-stringify.svg?branch=master)](https://travis-ci.org/1000ch/xml-stringify)

Stringify AST built from [segmentio/xml-parser](https://github.com/segmentio/xml-parser).

## Usage

```javascript
const parse = require('xml-parser');
const stringify = require('xml-stringify');

const ast = parse('<foo>Foo!</foo>');
const xml = stringify(ast);

console.log(xml);
```

## License

[MIT](https://1000ch.mit-license.org) © [Shogo Sensui](https://github.com/1000ch)

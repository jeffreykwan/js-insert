# js-insert [![Build Status](https://travis-ci.org/jeffreykwan/js-insert.svg?branch=master)](https://travis-ci.org/jeffreykwan/js-insert)

Insert javascript into javascript

## Install
Install the module with: `npm install js-insert`

```javascript
var insert = require('js-insert');
```

## API
###parameter###
**func**: add a parameter to a function
```javascript
var insert = require('js-insert');

insert.parameter.func(<fileName>, <function>, <parameter>);
```

**funcCall**: add a parameter to a function call
```javascript
var insert = require('js-insert');

insert.parameter.funcCall(options);

//f1() ->f1(a)
insert.parameter.funcCall({
  funcName: 'f1',
  parameter: 'a'
});

//obj.f1(a) -> obj.f1(a, 'b')
insert.parameter.funcCall({
  obj: 'obj',
  funcName: 'f1',
  parmeter: 'b',
  parameterType: 'literal'
});
```
`options` available:
```javascript
{
  obj: '',
  funcName: '',
  parameter: '',
  parameterType: 'literal|variable' //default: variable,
}
```

## Release History
- **v0.0.1**, *TBD*

## License
Copyright (c) 2014 Jeffrey Kwan. Licensed under the MIT license.

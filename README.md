# js-insert [![Build Status](https://travis-ci.org/jeffreykwan/js-insert.svg?branch=master)](https://travis-ci.org/jeffreykwan/js-insert)

Insert javascript into javascript

## Install
Install the module with: `npm install js-insert`

```javascript
var insert = require('js-insert');
```

## API
**into**: insert code anywhere
> WIP: After functionality not complete. Before does not support method declarations at the moment.

```javascript
var insert = require('js-insert');

insert.into({
  fileName: '',
  code: '',
  funcName: '', //insert into function body
  before: { // before specified function call
    object: '',
    funcName: '',
    declaration: false|true //before function declaration,
    returnCall: false|true //before the return statement
  },
  after: { // after specified function call
    object: '',
    funcName: '',
    declaration: false|true //before function declaration
  }
})
```

###parameter###
**func**: add a parameter to a function
```javascript
var insert = require('js-insert');

insert.parameter.func(<fileName>, <function>, <parameter>);
```

**funcCall**: add a parameter to a function call
```javascript
var insert = require('js-insert');

insert.parameter.funcCall(<fileName>, <match>, <insert>);

//f1() -> f1(a)
insert.parameter.funcCall('example.js', 
  { func: 'f1' }, 
  { param: 'a' }
});

//obj.f1(a) -> obj.f1(a, 'b')
insert.parameter.funcCall('example.js', 
{
  obj: 'obj',
  func: 'f1'
}, {
  parm: 'b',
  type: 'literal'
});

//obj.f1([a]) -> obj.f1([a, b]);
insert.parameter.funcCall('example', 
{  
  obj: 'obj',
  func: 'f1'
}, {
  arr: {
    param: 'b',
    type: 'variable'
  }
});

//obj1.f1(function (a) {}) -> obj1.f1(function (a, b) {})
insert.parameter.funcCall('example.js', 
{
  obj: 'obj',
  func: 'f1'
}, {
  func: {
    param: 'b',
    type: 'variable'
  }
});
```

`match`:
```javascript
{
  obj: '',
  func: ''
}
```

`insert`:
```javascript
{
  param: '',
  type: 'literal|variable', //default: variable

  arr: {
    param: '',
    type: '' //Similar to above
  },

  func: {
    param: '',
    type: '' //Similar to above
  },

  obj: {
    key: '',
    value: '',
    type: '' //Similar to above
  }
}
```

## Release History
- **v0.0.1**, *TBD*

## License
Copyright (c) 2014 Jeffrey Kwan. Licensed under the MIT license.

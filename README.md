# js-insert [![Build Status](https://travis-ci.org/jeffreykwan/js-insert.svg?branch=master)](https://travis-ci.org/jeffreykwan/js-insert)

Insert javascript into javascript

## Install
Install the module with: `npm install js-insert`

```javascript
var insert = require('js-insert');
```

## API
```javascript
insert.into(<filename>, <matcher>, <insert>);
```

`matcher` options:

Defines the structure of where to insert code into

```javascript
{
  obj: '',
  func: '',
  nested: {
    obj: '',
    nested: {
      key: ''
    }
  }
}
```

`value` options:
```javascript
{
  code: {
    code: '',
    before: {
      obj: '',
      func: '',
      ret: true
    },
    after: {
    }
  },
  param: {
    param: '',
    type: 'literal|variable', //variable is default
    obj: {
      key: '',
      value: ''
      type: 'literal|variable' //variable is default
    },
    func: {
      param: '',
      type: 'literal|variable' //variable is default
    },
    arr: {
      param: '',
      type: 'literal|variable' //variable is default
    }
  }
}
```

## Release History
- **v0.0.1**, *TBD*

## License
Copyright (c) 2014 Jeffrey Kwan. Licensed under the MIT license.

# Resettable

Js decorator that mark properties that need to be reset and reset them at once.

*Important!* **Designed to be used in Vue or React where class has a mounted function**

If you'd like to use it in other senero, make sure the class has a mounted method and is called in the constructor (it can be easily achieved with decorator)

You can check the usage in the test folder (it's very simple) or by reading this readme written in shitty English

## Basic usage
Usage:
1. Create a resettable instance
    
    const resettable = new Resettable();
    
2. Decorate the class property that need to be reset in the future

    ```
    // this.foo after this.mounted() is called will be used as the defualt value
    @resettable.mark() foo
    
    // 2 will be used as the default value
    @resettable.mark().default(2) foo
    
    // assuming this.foo = { bar:0, foobar: 2} after this.mounted()
    // the default value will be { bar: 1, foobar: 2 }
    @resettable.mark({ bar:1 }) foo
    
    // assuming this.foo = { bar:0, foobar: 2} after this.mounted()
    // the default value will be { bar: 1, foobar: 2 }
    // barfoo takes no effect as there is no such a field in the decorated property
    @resettable.mark({ bar:1, barfoo: 0 }) foo
    
    // it works on the array as well
    // default value will be [0, 2, 2, 3]
    @resettable.mark({ 1: 2, 9: 0 }) foo = [0, 1, 2, 3]
    ```
    

3. Decorate the class method that used to reset all marked variable

Basic Example:

```
import Resettable from 'resettable';
const resettable = new Resettable();
class Foo {
  constructor() {
    // to simulate a mounted behaviour which is used in Vue and React
    this.mounted()
  }
  mounted(){ }
  
  // mark the property that need to be reset
  // if no default value is given, the value after mounted() will be used as default value
  @resettable.mark() barNum = 2;
  @resettable.mark().default('2') barStr = ''
  
  // will be called after reset is done
  @resettable.reset reset(){ } 
}

const foo = new Foo();
// change foo.barNum and foo.barStr to whatever values
foo.reset();
console.log(foo.barNum); // print 2
console.log(foo.barStr); // print '2'
```

## Advance test case
All function are introduced already.

The aim of this section is to show what can be achieved with deep nested JSON objects

### Multiple sets of data
Chances are that you may have multiple set of resettable data and you would like to reset them separately.

That can be easily achieved by creating multiple instance
```
import Resettable from 'resettable';
const resetGroup1 = new Resettable();
const resetGroup2 = new Resettable();
class Foo {
  constructor() { this.mounted() }
  mounted(){ }
  
  @resetGroup1.mark() barNum = 2;
  @resetGroup2.mark() barStr = ''
  
  @resetGroup1.reset resetGroup1(){ }
  @resetGroup2.reset resetGroup2(){ }
}

const foo = new Foo();
foo.barNum = 0;;
foo.barStr = '0';
foo.resetGroup1();
console.log(foo.barNum); // print 2
console.log(foo.barStr); // print '0'
foo.resetGtroup2();
console.log(foo.barStr); // print ''
```

### Deep nested object
```
import Resettable from 'resettable';
const resettable = new Resettable();
class TestObj {
  @resettable.mark().default({
    a: 2,
    c: {
      cb: false,
      cc: {
        1: {
          ccb: { 0: 3 },
          ccc: true,
          ccd: { ccdb: '0' }
        }
      }
    },
    d: { 0: '0', 1: 0 }
  }) obj: any = {
    a: 1,
    b: '123',
    c: {
      ca: 2,
      cb: true,
      cc: [{
        cca: 1,
        ccb: [2, 3, 4, 5]
      }, {
        cca: 2,
        ccb: [1, 2, 3, 4],
        ccc: false,
        ccd: {
          ccda: 2,
          ccdb: '2',
          ccdc: false,
          ccdd: [2, 3, 4, 5]
        }
      }]
    },
    d: ['123', false, 2]
  }
  constructor(){ this.mounted(); }
  mounted(){ }
  change(){ this.obj = undefined; }
  @resettable.reset
  reset(){ }
}
const testObj = new TestObj();
testObj.change();
testObj.reset();
console.log(testObj.obj)
/*
  origin value is 
  {
    a: 1,
    b: '123',
    c: {
      ca: 2,
      cb: true,
      cc: [{
        cca: 1,
        ccb: [2, 3, 4, 5]
      }, {
        cca: 2,
        ccb: [1, 2, 3, 4],
        ccc: false,
        ccd: {
          ccda: 2,
          ccdb: '2',
          ccdc: false,
          ccdd: [2, 3, 4, 5]
        }
      }]
    },
    d: ['123', false, 2]
  }, after reset , should gives 
  {
    a: 2,
    b: '123',
    c: {
      ca: 2,
      cb: false,
      cc: [{
        cca: 1,
        ccb: [2, 3, 4, 5]
      }, {
        cca: 2,
        ccb: [3, 2, 3, 4],
        ccc: true,
        ccd: {
          ccda: 2,
          ccdb: '0',
          ccdc: false,
          ccdd: [2, 3, 4, 5]
        }
      }]
    },
    d: ['0', false, 0]
  }
*/
```

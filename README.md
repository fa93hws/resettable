# resettable

Js decorator that mark properties that need to be reset and reset them at once.

You can check the usage in the test folder (it's very simple) or by reading this readme written in shitty English

## Basic usage
Usage:
1. Create a resettable instance
2. Decorate the class property that need to be reset in the future
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
```

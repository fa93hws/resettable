# resettable

Js decorator that mark properties that need to be reset and reset them at once.

You can check the usage in the test folder (it's very simple) or by reading this readme written in shitty English

## Basic usage
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
foo.clear();
console.log(foo.barNum); // print 2
console.log(foo.barStr); // print '2'

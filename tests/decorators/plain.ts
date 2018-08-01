import Resettable from '../../src';
const resettable = new Resettable();
class TestClass {
  @resettable.mark() str = '0';
  @(resettable.mark() as any).default('reset') strReset = '';
  @resettable.mark() num = 0;
  @resettable.mark() boo = false;
  @resettable.mark() arr = [1,2,3,4,5];
  @resettable.mark().default([2,3,4]) arr2 = [1,2,3,4,5]
  @resettable.mark().default({
    2: 0,
    9: 10 // no effect, as there was no idx 9 in the origin array
  }) arr3 = [0, 1, 2, 3, 4, 5]
  @resettable.mark() obj = {
    a:1,
    b:2,
    c:3
  }
  constructor() {
    this.mounted()
  }
  mounted() {}
  change() {
    this.str = '123213';
    this.num = 123123;
    this.boo = true;
    this.arr[2] = 1;
    this.obj.a = 4;
  }

  @resettable.reset
  reset() {}
}

describe('plain object or array', () => {
  test('primitives', () => {
    const obj = new TestClass();
    obj.change();
    obj.reset();
    expect(obj.str).toEqual('0');
    expect(obj.num).toEqual(0);
    expect(obj.boo).toEqual(false);
    expect(obj.strReset).toEqual('reset')
  })
  test('array', () => {
    const obj = new TestClass();
    obj.change();
    obj.reset();
    expect(obj.arr).toEqual([1,2,3,4,5]);
    expect(obj.arr2).toEqual([2,3,4]);
    expect(obj.arr3).toEqual([0, 1, 0, 3, 4, 5]);
  })
  test('object', () => {
    const obj = new TestClass();
    obj.change();
    obj.reset();
    expect(obj.obj).toEqual({a:1, b:2, c:3})
  })
})
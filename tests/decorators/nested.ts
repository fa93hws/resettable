import Resettable from '../../src';
const resettable = new Resettable();

const nested = {
  f1: 1,
  f2: 'sdf',
  f3: {
    f11: 2,
    f12: '5',
    f13: false,
    f14: {
      f21: 3,
      f22: '5',
      f23: true
    }
  }
}
class TestObj {
  @resettable.mark()
  obj0 = JSON.parse(JSON.stringify(nested));
  @(resettable.mark() as any).default({
    f2: '0',
    f3: {
      f12: '0',
      f14: { f22: '0' }
    }
  }) obj1 = JSON.parse(JSON.stringify(nested));
  constructor() {
    this.mounted()
  }
  mounted() {}
  change() {
    this.obj0.f1 = 23;
    this.obj0.f3.f12 = '123213';
    this.obj0.f3.f14.f23 = false
  }
  @resettable.reset
  reset(){ }
}

describe('nested object', () => {
  test('no default value', () => {
    const obj = new TestObj();
    obj.change();
    obj.reset();
    expect(obj.obj0).toEqual(nested);
  });
  test('nested default value', () => {
    const obj = new TestObj();
    obj.reset();
    expect(obj.obj1.f2).toEqual('0');
    expect(obj.obj1.f3.f12).toEqual('0');
    expect(obj.obj1.f3.f14.f22).toEqual('0');
    expect(obj.obj1.f1).toEqual(1);
  })
});
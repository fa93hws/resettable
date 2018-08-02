import Resettable from '../../src';
const resettable = new Resettable();

const complexObjects = {
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
const resetted = {
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
  d: ['0', 0, 2]
}
class TestObj {
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
  }) obj: any = complexObjects

  constructor(){ this.mounted(); }
  mounted(){ }
  change(){ this.obj = undefined; }
  @resettable.reset
  reset(){ }
}

describe('complex object', () => {
  test('case 0', () => {
    const testObj = new TestObj();
    testObj.change();
    testObj.reset();
    expect(testObj.obj).toEqual(resetted)
  })
})

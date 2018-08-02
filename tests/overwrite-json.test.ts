import OverwritableJSON from '../src/overwrite-json';

const plainObj = {
  a: 1,
  b: false,
  d: [1, 2, 3, 4],
  c: function() { },
};
const arrayObjs = [{
  ...plainObj
}, {
  ...plainObj
}, {
  ...plainObj
}];
const complexObj = {
  ...plainObj,
  e: plainObj,
  f: arrayObjs
};
const str = '1';

describe('overwritableJSON', () => {
  test('able to construct', () => {
    const overwritableJSON = new OverwritableJSON({ a:1, b: [1,2,3], c: {a:1, b:2, c:3} });
    expect(overwritableJSON.obj.a).toEqual(1);
    expect(overwritableJSON.obj.b).toEqual([1,2,3]);
    expect(overwritableJSON.obj.c).toEqual({a:1, b:2, c:3})
  })
  test('primitives', () => {
    let overwritableJSON = new OverwritableJSON(str);
    overwritableJSON.set(2);
    expect(overwritableJSON.obj).toEqual(2);
  })
  test('plain obj', () => {
    const overwritableJSON = new OverwritableJSON(plainObj);
    overwritableJSON.set({ a: 2, f: 5 })
    expect(overwritableJSON.obj.a).toEqual(2)
    expect(overwritableJSON.obj.d).toEqual([1, 2, 3, 4]);
    expect(overwritableJSON.obj.f).toEqual(undefined);
    overwritableJSON.set({ d: [2, 3, 4]});
    expect(overwritableJSON.obj.d);
  })
  test('array objs', () => {
    const overwritableJSON = new OverwritableJSON(arrayObjs);
    overwritableJSON.set({ 1: [2, 3, 4], 3: 4 });
    expect(overwritableJSON.obj[0]).toEqual(plainObj);
    expect(overwritableJSON.obj[1]).toEqual([2, 3, 4]);
    expect(overwritableJSON.obj[2]).toEqual(plainObj);
    expect(overwritableJSON.obj[3]).toEqual(undefined);
  })
  test('complex objs', () => {
    const overwritableJSON = new OverwritableJSON(complexObj);
    overwritableJSON.set({
      a: 2,
      e: {
        a: 2,
        g: 2
      },
      f: {
        2: 1,
        3: 2
      }
    });
    expect(overwritableJSON.obj.a).toEqual(2);
    expect(overwritableJSON.obj.e).toEqual({
      ...plainObj,
      a:2
    })
    expect(overwritableJSON.obj.f[0]).toEqual(plainObj);
    expect(overwritableJSON.obj.f[1]).toEqual(plainObj);
    expect(overwritableJSON.obj.f.length).toEqual(3);
    expect(overwritableJSON.obj.f[2]).toEqual(1);    
  })
})
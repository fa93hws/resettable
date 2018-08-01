type Primitive = boolean | string | number;
enum EType {
  object,
  primitive,
  array,
  function
}
type ISet = (target: any, field: string | number, obj: any) => void;

export default class OverwritableJSON {
  obj: any;
  constructor(json: any) {
    this.obj = JSON.parse(JSON.stringify(json));
    this.set = this.set.bind(this);
    this._getSetFun = this._getSetFun.bind(this);
    this._getType = this._getType.bind(this);
    this._setObj = this._setObj.bind(this);
    this._setArray = this._setArray.bind(this);
    this._setPrimitives = this._setPrimitives.bind(this);
    this._setOthers = this._setOthers.bind(this);
  }
  _setObj(target: any, field: string | number, obj: any): void {
    for (let k in obj) {
      if (!(k in target[field])) continue;
      const setFun = this._getSetFun(obj[k])
      setFun(target[field], k, obj[k])
    }
  }
  _setArray(target: any, field: string | number, arr: any[]): void {
    target[field] = new Array(arr.length).fill(undefined);
    arr.forEach((v, idx) => {
      const setFun = this._getSetFun(v);
      setFun(target[field], idx, v);
    })
  }
  _setPrimitives(target: any, field: string | number, val: Primitive): void {
    target[field] = val;
  }
  _setOthers(target: any, field: string | number, val: any): void {
    return;
  }
  _getType(val: any): EType {
    if (typeof val === 'object') {
      if (val.constructor === Array) return EType.array;
      else return EType.object
    } else if (typeof val === 'function') return EType.function
    else return EType.primitive;

  }
  _getSetFun(val: any): ISet {
    switch(this._getType(val)) {
      case EType.array:
        return this._setArray;
      case EType.object:
        return this._setObj;
      case EType.primitive:
        return this._setPrimitives;
      default:
        return this._setOthers;
    }
  }
  set(val: any): void {
    const setFun = this._getSetFun(val);
    setFun(this, 'obj', val);
  }
}
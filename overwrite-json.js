import * as cloneDeep from 'lodash.clonedeep';
var EType;
(function (EType) {
    EType[EType["object"] = 0] = "object";
    EType[EType["primitive"] = 1] = "primitive";
    EType[EType["array"] = 2] = "array";
    EType[EType["function"] = 3] = "function";
})(EType || (EType = {}));
export default class OverwritableJSON {
    constructor(json) {
        // this.obj = JSON.parse(JSON.stringify(json));
        this.obj = cloneDeep(json);
        this.set = this.set.bind(this);
        this._getSetFun = this._getSetFun.bind(this);
        this._getType = this._getType.bind(this);
        this._setObj = this._setObj.bind(this);
        this._setArray = this._setArray.bind(this);
        this._setPrimitives = this._setPrimitives.bind(this);
        this._setOthers = this._setOthers.bind(this);
    }
    _setObj(target, field, obj) {
        for (let k in obj) {
            if (!(k in target[field]))
                continue;
            const setFun = this._getSetFun(obj[k]);
            setFun(target[field], k, obj[k]);
        }
    }
    _setArray(target, field, arr) {
        target[field] = new Array(arr.length).fill(undefined);
        arr.forEach((v, idx) => {
            const setFun = this._getSetFun(v);
            setFun(target[field], idx, v);
        });
    }
    _setPrimitives(target, field, val) {
        target[field] = val;
    }
    _setOthers(target, field, val) {
        return;
    }
    _getType(val) {
        if (typeof val === 'object') {
            if (val.constructor === Array)
                return EType.array;
            else
                return EType.object;
        }
        else if (typeof val === 'function')
            return EType.function;
        else
            return EType.primitive;
    }
    _getSetFun(val) {
        switch (this._getType(val)) {
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
    set(val) {
        const setFun = this._getSetFun(val);
        setFun(this, 'obj', val);
    }
}

import OverwritableJSON from './overwrite-json';
import * as cloneDeep from 'lodash.clonedeep';

export interface IMountable {
  mounted?: () => void;
}

export default class Resettable {
  _defaults = {};
  constructor() {
    this.mark = this.mark.bind(this);
    this.reset = this.reset.bind(this);
    this._mark = this._mark.bind(this);
  }

  _mark(val?: any): (target: IMountable, name: string) => void {
    // console.log('_mark');
    const defaults = this._defaults;
    return function(target: IMountable, name: string) {
      const originMount = target.mounted;
      target.mounted = function() {
        // console.log('_mark');
        if (originMount !== undefined) originMount.call(this)
        defaults[name] = new OverwritableJSON(this[name]);
        if (val !== undefined) {
          defaults[name].set(val);
        }
      }
    }
  }
  mark(): any {
    // console.log('mark')
    const output = this._mark() as any;
    output.default = this._mark;
    return output;
    // (target: IMountable, name: string): any {
    //   this._markWithDefault()(target, name)
  }

  reset(target: IMountable, name: string, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;
    const defaults = this._defaults;
    descriptor.value = function(...args: any[]){
      for (let k in defaults) {
        // this[k] = JSON.parse(JSON.stringify(defaults[k].obj))
        this[k] = cloneDeep(defaults[k].obj)
      }
      if (originMethod !== undefined) originMethod.apply(this, args)
    }
  }
}
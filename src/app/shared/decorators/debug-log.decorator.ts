import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function log$(target: any, propertyKey: string) {
  let propertyValue: any;

  function getter() {
    return propertyValue;
  }

  function setter(value: any) {
    if (value instanceof Observable) {
      propertyValue = value.pipe(tap(res => {
        const isArrayOfObjects = Array.isArray(res) && typeof res[0] === 'object';
        const logType = isArrayOfObjects ? 'table' : 'log';
        console.groupCollapsed(propertyKey);
        console[logType](res);
        console.groupEnd();
      }));
    } else {
      propertyValue = value;
    }
  }

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

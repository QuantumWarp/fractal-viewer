import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value): any {
    const keys = [];
    for (const enumMember in value) {
      if (!isNaN(parseInt(enumMember, 10))) {
        let valueString = value[enumMember];
        valueString = valueString.replace(/([A-Z])/g, ' $1').trim();
        keys.push({key: parseInt(enumMember, 10), value: valueString });
      }
    }
    return keys;
  }
}

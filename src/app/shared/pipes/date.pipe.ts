import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: number): string {
    const date = new Date(value)
    return moment(date).format('DD-MM-YYYY');
  }
}

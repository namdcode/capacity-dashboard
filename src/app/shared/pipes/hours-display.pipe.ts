import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hoursDisplay', standalone: true })
export class HoursDisplayPipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  }
}

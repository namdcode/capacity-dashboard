import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'utilization', standalone: true })
export class UtilizationPipe implements PipeTransform {
  transform(value: number): string {
    return `${Math.round(value * 100)}%`;
  }
}

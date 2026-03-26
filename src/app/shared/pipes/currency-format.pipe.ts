import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency = '€'): string {
    if (value >= 1_000_000) {
      return `${currency}${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${currency}${(value / 1_000).toFixed(0)}K`;
    }
    return `${currency}${value.toFixed(0)}`;
  }
}

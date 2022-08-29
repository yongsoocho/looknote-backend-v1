import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DetailsPipe implements PipeTransform {
  transform(details: string | object) {
    if (details === undefined || details === null || !details) {
      return [];
    }
    if (typeof details === 'string') {
      return details.split(',');
    } else if (typeof details === 'object') {
      return details;
    }
  }
}

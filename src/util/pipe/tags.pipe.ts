import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TagsPipe implements PipeTransform {
  transform(filters: string | Array<string | number>): Array<string | number> {
    if (typeof filters === 'string') {
      return filters.split(',').map((item) => Number(item));
    } else if (typeof filters === 'object') {
      return filters;
    } else {
      return [];
    }
  }
}

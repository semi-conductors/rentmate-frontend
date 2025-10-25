import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceify',
  standalone: true // if using standalone components
})
export class SpaceifyPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value) {
      return value.replace(/_/g, ' ');
    }
    return '';
  }
}
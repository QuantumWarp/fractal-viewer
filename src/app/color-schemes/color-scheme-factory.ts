import { ColorSchemeType } from './color-scheme-type.enum';
import { ColorScheme } from './color-scheme.interface';
import { Greenscale } from './greenscale';

export class ColorSchemeFactory {

  static create(type: ColorSchemeType): ColorScheme {

    switch (type) {
      case ColorSchemeType.Greenscale:
        return new Greenscale();
    }
  }
}

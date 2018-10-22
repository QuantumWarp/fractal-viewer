import { ColorSchemeType } from './color-scheme-type.enum';
import { ColorScheme } from './color-scheme.interface';
import { Greenscale } from './schemes/greenscale';
import { Greyscale } from './schemes/greyscale';
import { Bluescale } from './schemes/bluescale';
import { Redscale } from './schemes/redscale';
import { Sine } from './schemes/sine';

export class ColorSchemeFactory {

  static create(type: ColorSchemeType): ColorScheme {

    switch (type) {
      case ColorSchemeType.Greyscale:
        return new Greyscale();
      case ColorSchemeType.Greenscale:
        return new Greenscale();
      case ColorSchemeType.Bluescale:
        return new Bluescale();
      case ColorSchemeType.Redscale:
        return new Redscale();
      case ColorSchemeType.Sine:
        return new Sine();
    }
  }
}

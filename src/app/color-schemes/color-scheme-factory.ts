import { ColorSchemeType } from './color-scheme-type.enum';
import { ColorScheme } from './color-scheme.interface';
import { AlternatingMonochrome } from './schemes/alternating-monochrome';
import { AlternatingPrimaryColor } from './schemes/alternating-primary-color';
import { BlueRedFlame } from './schemes/blue-red-flame';
import { Bluescale } from './schemes/bluescale';
import { Greenscale } from './schemes/greenscale';
import { Greyscale } from './schemes/greyscale';
import { Redscale } from './schemes/redscale';

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
      case ColorSchemeType.BlueRedFlame:
        return new BlueRedFlame();
      case ColorSchemeType.AlternatingMonochrome:
        return new AlternatingMonochrome();
      case ColorSchemeType.AlternatingPrimaryColor:
        return new AlternatingPrimaryColor();
      default:
        throw new Error('Color scheme not found');
    }
  }
}
